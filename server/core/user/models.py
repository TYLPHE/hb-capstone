from .. import db
from datetime import datetime

class User(db.Model):
    """ A table of users """

    __tablename__ = 'users'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
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
    def validate(cls, username, password):
        """ Checks database if email and password match """

        return cls.query.filter(cls.username==username, 
                                cls.password==password).first()

    @classmethod
    def exists(cls, username):
        """ Checks if user exists for registration """

        return cls.query.filter(cls.username==username).first()