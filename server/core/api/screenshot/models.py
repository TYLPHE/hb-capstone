from core import db

class Screenshot(db.Model):
    """ Screenshots for game """

    __tablename__ = 'screenshots'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    path = db.Column(db.String)

    # Relationships
    game = db.relationship('Game', back_populates='screenshots')

    def __repr__(self):
        return f'<Screenshot id={self.id}>'

    @classmethod
    def create(cls, path):
        """ Create class. Does not add and commit to db """

        return cls(path=path)