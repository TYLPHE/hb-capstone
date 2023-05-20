from core import db

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