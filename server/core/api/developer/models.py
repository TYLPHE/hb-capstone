from core import db

class Developer(db.Model):
    """ Game developers """

    __tablename__ = 'developers'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String)

    # Relationships
    games_developers = db.relationship('Games_developer', 
                                       back_populates='developer')

    def __repr__(self):
        return f'<Developer name={self.name}>'


    @classmethod
    def create(cls, name):
        """ Create class. Does not add and commit to db """

        return cls(name=name)