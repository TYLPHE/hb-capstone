from core import db

class Games_publisher(db.Model):
    """ Connecting a many-to-many relationship betwee games and publishers """

    __tablename__ = 'games_publishers'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    publishers_id = db.Column(db.Integer, db.ForeignKey('publishers.id'))

    # Relationships
    game = db.relationship('Game', back_populates='games_publishers')
    publisher = db.relationship('Publisher', back_populates='games_publishers')

    def __repr__(self):
        return f'<Games_publisher id={self.id}>'