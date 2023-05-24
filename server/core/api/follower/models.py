from core import db
from .. import library as l
from .. import user as u
from random import choice

class Follow(db.Model):
    """ A table of users and their followed libraries """

    __tablename__ = 'follows'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    library_id = db.Column(db.Integer, db.ForeignKey('libraries.id'))

    # Relationships
    user = db.relationship('User', back_populates='follows')
    library = db.relationship('Library', back_populates='follows')

    def __repr__(self):
        return f'<Follow id={self.id} user_id={self.user_id} library_id={self.library_id}>'
    
    @classmethod
    def create(cls, user_id, library_id):
        """ Create a follow relationship """

        user = db.session.get(u.User, user_id)
        library = db.session.get(l.Library, library_id)
        print('@@@@@user/library', user, library)
        return cls(user=user, library=library)


    @classmethod
    def search_by_id(cls, user_id, library_id):
        """ Search and return Class based on id """

        return cls.query.filter_by(user_id=user_id, library_id=library_id).first()


    @classmethod
    def followers(cls, user_id, library_id):
        """ return list of followers and its count """

        count = cls.query.filter_by(library_id=library_id).count()
        followers = cls.query.filter_by(library_id=library_id).all()

        return {
            'count': count,
            'followers': followers,
        }

    
    @classmethod
    def following(cls, user_id, library_id):
        """ return list of who the user follows and its count """

        count = cls.query.filter_by(user_id=user_id).count()
        following = cls.query.filter_by(user_id=user_id).all()

        return {
            'count': count,
            'following': following,
        }
    

    @classmethod
    def random_library_game(cls, user_id):
        """ returns a random library that the user follows """

        random_follower = choice(Follow.query.filter_by(user_id=user_id).all())
        library = random_follower.library
        random_library_game = choice(library.library_games)

        return random_library_game