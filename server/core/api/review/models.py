from core import db

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
        return f'<Review id={self.id}>'

    @classmethod
    def create(cls, library_game, review=''):
        """ Create class. Does not add and commit to db """

        return cls(library_game=library_game,
                   review=review, 
                   created=datetime.now(), 
                   votes_up=0)


    @classmethod
    def search_by_id(cls, id):
        """ Return a Class """

        return db.session.get(cls, id)
    