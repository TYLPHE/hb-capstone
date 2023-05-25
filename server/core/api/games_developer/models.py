from core import db

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
        return f'<Games_developer id={self.id}>'
    
    @classmethod
    def create(cls, game, developer):
        """ Create class. Does not add and commit to db """

        return cls(game=game, developer=developer)