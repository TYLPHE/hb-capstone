from core import db
from datetime import datetime

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
    follows = db.relationship('Follow', back_populates='library')

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