# hb-capstone
A game review blog app

![image to be added](https://github.com/TYLPHE/TYLPHE/blob/main/readmeAssets/hb-capstone.gif)

## Links
- [Data Model](https://dbdiagram.io/d/64580bb3dca9fb07c4a8453f)
- [User Flow](https://app.diagrams.net/#G1z9lyHXlRGCrXEbBrZIRROnVPUq8ySHBm)
- [GitHub Gist](https://gist.github.com/TYLPHE/a33813691689b10cf085195d5944d48c)


## MVP
 - Users can create a review page
 - Users can search and filter a game library
 - Users can log in

## About
hb-capstone is a web application where users can create a review blog about the games that they have played.

## Challenges

## Helpful Notes
### One-to-one relationships
[Helpful link](https://stackoverflow.com/questions/3464443/how-to-create-one-to-one-relationships-with-declarative/9611874#9611874) - Set `uselist=False` on the parent:
```python
class Parent(Base):
    __tablename__ = "parent_table"

    id = mapped_column(Integer, primary_key=True)
    child = relationship("Child", uselist=False, back_populates="parent")


class Child(Base):
    __tablename__ = "child_table"

    id = mapped_column(Integer, primary_key=True)
    parent_id = mapped_column(ForeignKey("parent_table.id"))
    parent = relationship("Parent", back_populates="child")
```

### RuntimeError: Working outside of application context
Add the following line where app is declared:
```python
app = Flask(__name__)
app.app.context().push()
```
