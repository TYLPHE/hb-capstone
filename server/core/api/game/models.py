from core import db

class Game(db.Model):
    """ A table of all games """

    __tablename__ = 'games'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    short_description = db.Column(db.Text)
    header_image = db.Column(db.String)
    background = db.Column(db.String)
    release_date = db.Column(db.String)

    # Relationships
    library_games = db.relationship('Library_game', back_populates='game')
    screenshots = db.relationship('Screenshot', back_populates='game')
    movies = db.relationship('Movie', back_populates='game')
    games_developers = db.relationship('Games_developer', back_populates='game')
    games_publishers = db.relationship('Games_publisher', back_populates='game')
    games_genres = db.relationship('Games_genre', back_populates='game')
    
    def __repr__(self):
        return f'<Game name={self.name} id={self.id}>'
    
    
    @classmethod
    def create(cls, id, name, short_description, header_image,
               background, release_date):
        """ Create class. Does not add and commit to db """

        return cls(id=id, name=name, short_description=short_description,
                   header_image=header_image, background=background,
                   release_date=release_date)


    @classmethod
    def random_games(cls, limit=6):
        """ return a list of random games """

        with open('data/games-filtered.json') as f:
            data = f.read()

        ids = json.loads(data)
        count = 0
        games = []

        while count < limit:
            game = db.session.get(cls, choice(ids))
            games.append(game)
            count += 1

        return games

    
    @classmethod
    def search_by_name(cls, name):
        """ Return game by name """

        return cls.query.filter(cls.name.ilike(f'%{name}%')).all()


    @classmethod
    def search_by_id(cls, id):
        """ Return game by id """

        return db.session.get(cls, id)
    
    