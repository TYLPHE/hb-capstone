from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """ A table of users """

    __tablename__ = 'users'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    fname = db.Column(db.String(30))
    lname = db.Column(db.String(30))
    created = db.Column(db.DateTime)

    reviews = db.relationship('Review', back_populates='user')

    def __repr__(self):
        return f'<User username={self.username} id={self.id}>'
    
    @classmethod
    def create_user(cls, username, password, 
                    fname, lname, created=datetime.now()):
        """ Create a user. Does not add and commit to db """

        return User(username=username, 
                    password=password, 
                    fname=fname, 
                    lname=lname, 
                    created=created)

    @classmethod
    def details(cls, id):
        """ returns Class of parameter: id """

        return User.query.get(id).first()

    @classmethod
    def check_login(cls, username, password):
        """ Checks database if email and password match """

        return cls.query.filter(cls.username==username, 
                                cls.password==password).first()

class Review(db.Model):
    """ A table of reviews """

    __tablename__ = 'reviews'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    review = db.Column(db.Text)
    score = db.Column(db.Integer)
    created = db.Column(db.DateTime)
    votes_up = db.Column(db.Integer)
    
    user = db.relationship('User', back_populates='reviews')

    def __repr__(self):
        return f'<Review id={self.id}'


class Game(db.Model):
    """ A table of all games """

    __tablename__ = 'games'

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

    library_games = db.relationship('Library_game', back_populates='game')

    def __repr__(self):
        return f'<Game name={self.name}> id={self.id}'
    

class Library_game(db.Model):
    """ User's games added to their library """

    __tablename__ = 'library_games'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.name'))
    library_id = db.Column(db.Integer, db.ForeignKey('libraries.id'))
    purchased = db.Column(db.Boolean)
    total_playtime = db.Column(db.Integer)
    last_played = db.Column(db.DateTime)

    game = db.relationship('Game', back_populates='library_games')    
    library = db.relationship('Library', back_populates='library_games')

    def __repr__(self):
        return f'<Library_game id={self.id} game_id={self.game_id}'


class Library(db.Model):
    """ The user's library """

    __tablename__ = 'libraries'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_count = db.Column(db.Integer)
    name = db.Column(db.String)
    created = db.Column(db.DateTime)

    library_games = db.relationship('Library_game', back_populates='library')

    def __repr__(self):
        return f'<Library name={self.name} id={self.id}'


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
