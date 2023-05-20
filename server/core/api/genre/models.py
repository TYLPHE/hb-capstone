from core import db

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