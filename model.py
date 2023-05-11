from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from random import choice
import json

db = SQLAlchemy()

class User(db.Model):
    """ A table of users """

    __tablename__ = 'users'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    fname = db.Column(db.String(30))
    lname = db.Column(db.String(30))
    created = db.Column(db.DateTime)

    # Relationships
    library = db.relationship('Library', back_populates='user', uselist=False)

    def __repr__(self):
        return f'<User username={self.username} id={self.id}>'
    
    @classmethod
    def create(cls, username, password, fname, lname, created=datetime.now()):
        """ Create a user. """

        return cls(username=username, password=password, fname=fname, 
                   lname=lname, created=created)


    @classmethod
    def details(cls, id):
        """ returns Class of parameter: id """

        return cls.query.get(id).first()


    @classmethod
    def validate(cls, username, password):
        """ Checks database if email and password match """

        return cls.query.filter(cls.username==username, 
                                cls.password==password).first()

    @classmethod
    def exists(cls, username):
        """ Checks if user exists for registration """

        return cls.query.filter(cls.username==username).first()


class Library(db.Model):
    """ The user's library """

    __tablename__ = 'libraries'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String, default='My Library')
    created = db.Column(db.DateTime, default=datetime.now())

    # Relationships
    user = db.relationship('User', back_populates='library')
    library_games = db.relationship('Library_game', back_populates='library')

    def __repr__(self):
        return f'<Library name={self.name} id={self.id}>'

    @classmethod
    def create(cls, user, name='My Library', created=datetime.now()):
        """ Create class. Does not add and commit to db """

        return cls(user=user, name=name, created=created)


    @classmethod
    def search_by_id(cls, id):
        """ Search and return Class based on id """

        return db.session.get(cls, id)


class Library_game(db.Model):
    """ User's games added to their library """

    __tablename__ = 'library_games'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    library_id = db.Column(db.Integer, db.ForeignKey('libraries.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    purchased = db.Column(db.Boolean)
    total_playtime = db.Column(db.Integer)
    last_played = db.Column(db.DateTime)

    # Relationships
    review = db.relationship('Review', 
                             back_populates='library_game', 
                             uselist=False)    
    library = db.relationship('Library', back_populates='library_games')
    game = db.relationship('Game', back_populates='library_games')

    def __repr__(self):
        return f'<Library_game id={self.id} game_id={self.game_id}'

    @classmethod
    def create(cls, library, game, purchased, total_playtime, last_played=datetime.now()):
        """ Create class. Does not add and commit to db """

        return cls(library=library,
                   game=game,
                   purchased=purchased, 
                   total_playtime=total_playtime, 
                   last_played=last_played)


    @classmethod
    def search_by_id(cls, id):
        """ Return a list of the user's added games """

        return cls.query.filter(cls.library_id==id).all()


class Review(db.Model):
    """ A table of reviews """

    __tablename__ = 'reviews'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    library_games_id = db.Column(db.Integer, db.ForeignKey('library_games.id'))
    review = db.Column(db.Text)
    score = db.Column(db.Integer)
    votes_up = db.Column(db.Integer)
    created = db.Column(db.DateTime)

    # Relationships    
    library_game = db.relationship('Library_game', back_populates='review')

    def __repr__(self):
        return f'<Review id={self.id}'

    @classmethod
    def create(cls, library_game, review, 
               score, created=datetime.now(), votes_up=0):
        """ Create class. Does not add and commit to db """

        return cls(library_game=library_game, review=review, score=score, 
                   created=created, votes_up=votes_up)


class Game(db.Model):
    """ A table of all games """

    __tablename__ = 'games'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    short_description = db.Column(db.Text)
    header_image = db.Column(db.String)
    background = db.Column(db.String)
    release_date = db.Column(db.String)

    # Relationships
    library_games = db.relationship('Library_game', back_populates='game')
    screenshots = db.relationship('Screenshot', back_populates='game')
    movies = db.relationship('Movie', back_populates='game')
    games_developers = db.relationship('Games_developer', back_populates='game')
    games_publishers = db.relationship('Games_publisher', back_populates='game')
    games_genres = db.relationship('Games_genre', back_populates='game')
    
    def __repr__(self):
        return f'<Game name={self.name} id={self.id}>'
    
    @classmethod
    def create(cls, id, name, short_description, header_image,
               background, release_date):
        """ Create class. Does not add and commit to db """

        return cls(id=id, name=name, short_description=short_description,
                   header_image=header_image, background=background,
                   release_date=release_date)

    @classmethod
    def random_games(cls, limit=6):
        """ return a list of random games """

        with open('data/games-filtered.json') as f:
            data = f.read()

        ids = json.loads(data)
        count = 0
        games = []

        while count < limit:
            game = db.session.get(cls, choice(ids))
            games.append(game)
            count += 1

        return games

    
    @classmethod
    def search_by_name(cls, name):
        """ Return game by name """

        return cls.query.filter(cls.name.ilike(f'%{name}%')).all()


    @classmethod
    def search_by_id(cls, id):
        """ Return game by id """

        return db.session.get(cls, id)

        
    

class Screenshot(db.Model):
    """ Screenshots for game """

    __tablename__ = 'screenshots'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    path = db.Column(db.String)

    # Relationships
    game = db.relationship('Game', back_populates='screenshots')

    def __repr__(self):
        return f'<Screenshot id={self.id}>'

    @classmethod
    def create(cls, path):
        """ Create class. Does not add and commit to db """

        return cls(path=path)

class Movie(db.Model):
    """ Movies for game """

    __tablename__ = 'movies'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    path = db.Column(db.String)

    # Relationships
    game = db.relationship('Game', back_populates='movies')

    def __repr__(self):
        return f'<Movie id={self.id}>'


    @classmethod
    def create(cls, path):
        """ Create class. Does not add and commit to db """

        return cls(path=path)
    

class Games_developer(db.Model):
    """ Connecting a many-to-many relationship between games and developers """

    __tablename__ = 'games_developers'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    developers_id = db.Column(db.Integer, db.ForeignKey('developers.id'))

    # Relationships
    game = db.relationship('Game', back_populates='games_developers')
    developer = db.relationship('Developer', back_populates='games_developers')

    def __repr__(self):
        return f'<Games_developer id={id}>'


class Developer(db.Model):
    """ Game developers """

    __tablename__ = 'developers'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String)

    # Relationships
    games_developers = db.relationship('Games_developer', 
                                       back_populates='developer')

    def __repr__(self):
        return f'<Developer name={self.name}'


    @classmethod
    def create(cls, name):
        """ Create class. Does not add and commit to db """

        return cls(name=name)


class Games_publisher(db.Model):
    """ Connecting a many-to-many relationship betwee games and publishers """

    __tablename__ = 'games_publishers'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    publishers_id = db.Column(db.Integer, db.ForeignKey('publishers.id'))

    # Relationships
    game = db.relationship('Game', back_populates='games_publishers')
    publisher = db.relationship('Publisher', back_populates='games_publishers')

    def __repr__(self):
        return f'<Games_publisher id={self.id}>'


class Publisher(db.Model):
    """ Game Publishers """

    __tablename__ = 'publishers'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String)

    # Relationships
    games_publishers = db.relationship('Games_publisher', 
                                       back_populates='publisher')

    def __repr__(self):
        return f'<Publisher name={self.name}>'


    @classmethod
    def create(cls, name):
        """ Create class. Does not add and commit to db """

        return cls(name=name)


class Games_genre(db.Model):
    """ Connecting a many-to-many relationship between games and genres """

    __tablename__ = 'games_genres'
    
    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'))

    # Relationships
    game = db.relationship('Game', back_populates='games_genres')
    genre = db.relationship('Genre', back_populates='games_genres')

    def __repr__(self):
        return f'<Games_Genre id={self.id}>'


class Genre(db.Model):
    """ Game Genres """

    __tablename__ = 'genres'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String)

    # Relationships
    games_genres = db.relationship('Games_genre', back_populates='genre')

    def __repr__(self):
        return f'<Genre name={self.name}>'

    
    @classmethod
    def create(cls, name):
        """ Create class. Does not add and commit to db """

        return cls(name=name)

    
def connect_to_db(flask_app, db_uri='postgresql:///tylphe_capstone', echo=True):
    """ Initialize db.app """
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print(f'Connected to {db_uri}')


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
