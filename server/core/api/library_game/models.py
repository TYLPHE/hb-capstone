from core import db
from ..game.models import Game

class Library_game(db.Model):
    """ User's games added to their library """

    __tablename__ = 'library_games'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    library_id = db.Column(db.Integer, db.ForeignKey('libraries.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    purchased = db.Column(db.Boolean)
    total_playtime = db.Column(db.Integer)
    date_added = db.Column(db.DateTime)

    # Relationships
    review = db.relationship('Review', 
                             back_populates='library_game', 
                             uselist=False)    
    library = db.relationship('Library', back_populates='library_games')
    game = db.relationship('Game', back_populates='library_games')

    def __repr__(self):
        return f'<Library_game id={self.id} game_id={self.game_id}>'

    @classmethod
    def create(cls, library, game):
        """ Create class. Does not add and commit to db """

        exists = cls.query.filter(cls.library_id==library.id,
                                  cls.game_id==game.id).first()
        
        if (exists):
            return None
        else:
            return cls(library=library,
                      game=game,
                      date_added=datetime.now())


    @classmethod
    def search_by_id(cls, id):
        """ Return a list of the user's added games """

        return cls.query.join(Game).filter(cls.library_id==id)\
                  .order_by(Game.name).all()


    @classmethod
    def search_by_game_id(cls, library_id, game_id):
        """ Checks to see if game is in library_games. Returns boolean """
        
        return cls.query.filter(cls.library_id==library_id,
                                  cls.game_id==game_id).first()