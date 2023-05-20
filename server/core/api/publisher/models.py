from core import db

class Publisher(db.Model):
    """ Game Publishers """

    __tablename__ = 'publishers'

    # Table Columns
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String)

    # Relationships
    games_publishers = db.relationship('Games_publisher', 
                                       back_populates='publisher')

    def __repr__(self):
        return f'<Publisher name={self.name}>'


    @classmethod
    def create(cls, name):
        """ Create class. Does not add and commit to db """

        return cls(name=name)