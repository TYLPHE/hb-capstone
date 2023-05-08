from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

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
    def create_user(cls, username, password, 
                    fname, lname, created=datetime.now()):
        """ Create a user. Does not add and commit to db """

        return cls(username=username, 
                   password=password, 
                   fname=fname, 
                   lname=lname, 
                   created=created)

    @classmethod
    def details(cls, id):
        """ returns Class of parameter: id """

        return cls.query.get(id).first()

    @classmethod
    def check_login(cls, username, password):
        """ Checks database if email and password match """

        return cls.query.filter(cls.username==username, 
                                cls.password==password).first()


class Library(db.Model):
    """ The user's library """

    __tablename__ = 'libraries'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    game_count = db.Column(db.Integer)
    name = db.Column(db.String)
    created = db.Column(db.DateTime)

    # Relationships
    user = db.relationship('User', back_populates='library')
    library_games = db.relationship('Library_game', back_populates='library')

    def __repr__(self):
        return f'<Library name={self.name} id={self.id}'


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


class Review(db.Model):
    """ A table of reviews """

    __tablename__ = 'reviews'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    library_games_id = db.Column(db.Integer, db.ForeignKey('library_games.id'))
    review = db.Column(db.Text)
    score = db.Column(db.Integer)
    created = db.Column(db.DateTime)
    votes_up = db.Column(db.Integer)

    # Relationships    
    library_game = db.relationship('Library_game', back_populates='review')

    def __repr__(self):
        return f'<Review id={self.id}'


class Game(db.Model):
    """ A table of all games """

    __tablename__ = 'games'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    short_description = db.Column(db.Text)
    header_image = db.Column(db.String)
    developers = db.Column(db.ARRAY(db.String))
    publishers = db.Column(db.ARRAY(db.String))
    genres = db.Column(db.ARRAY(db.String))
    screenshots = db.Column(db.ARRAY(db.String))
    movies = db.Column(db.ARRAY(db.String))
    background = db.Column(db.String)
    release_date = db.Column(db.DateTime)

    # Relationships
    library_games = db.relationship('Library_game', back_populates='game')
    screenshots = db.relationship('Screenshot', back_populates='game')
    movies = db.relationship('Movie', back_populates='movie')
    games_developers = db.relationship('Games_developer', back_populates='game')

    def __repr__(self):
        return f'<Game name={self.name}> id={self.id}'
    

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


class Movie(db.Model):
    """ Movies for game """

    __tablename__ = 'movies'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    path = db.Column(db.String)

    # Relationships
    movie = db.relationship('Game', back_populates='movies')

    def __repr__(self):
        return f'<Movie id={self.id}>'

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
