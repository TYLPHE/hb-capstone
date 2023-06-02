from core import db
from datetime import datetime

class Review(db.Model):
    """ A table of reviews """

    __tablename__ = 'reviews'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    library_games_id = db.Column(db.Integer, db.ForeignKey('library_games.id'))
    review = db.Column(db.Text)
    score = db.Column(db.Integer)
    votes_up = db.Column(db.Boolean)
    created = db.Column(db.DateTime)
    reviewed = db.Column(db.Boolean, default=False)

    # Relationships    
    library_game = db.relationship('Library_game', back_populates='review')

    def __repr__(self):
        return f'<Review id={self.id}>'

    @classmethod
    def create(cls, library_game, review='', reviewed=False, votes_up=None):
        """ Create class. Does not add and commit to db """

        return cls(library_game=library_game,
                   review=review,
                   reviewed=reviewed,
                   created=datetime.now(), 
                   votes_up=votes_up)


    @classmethod
    def search_by_id(cls, id):
        """ Return a Class """

        return db.session.get(cls, id)
    

    @classmethod
    def set_vote(cls, votes_up, id):
        """ set votes_up to True (positive), False (negative), or None """

        r = db.session.get(cls, id)
        r.votes_up = votes_up

        return r

