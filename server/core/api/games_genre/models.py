from core import db

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
    
    @classmethod
    def create(cls, game, genre):
        """ Create class. Does not add and commit to db """

        return cls(game=game, genre=genre)