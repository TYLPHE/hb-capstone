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
### Database Seeds
Steam API cannot provide a list of games in JSON. I had to learn how to write a web scraper to manually pull individual games from the API. I found a list that ranked all the games by popularity.

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

### Case-insensitive queries
I learned about using ilike for queries. For example, searching for a game in all lowercase can find games that are capitalized. If I wanted to find a game called 'Terraria' and searched for 'terraria', `ilike()` helps!
```python
@classmethod
def search_by_name(cls, name):
    """ Return game by name """

    return cls.query.filter(cls.name.ilike(f'%{name}%')).all()
```

### Strict-slashes
[Thanks to this article](https://stackoverflow.com/questions/33241050/trailing-slash-triggers-404-in-flask-path-rule), I learned that Flask is particular about the slashes in `@app.route()`. For example:
```python
#both are interpreted differently
@app.route('/games')
@app.route('/games/')
```

We can add an extra parameter to disable the strict slashes:
```python
@app.route('/games', strict_slashes=False)
```

Alternatively, we can do...
```python
app.url_map.strict_slashes = False
```

But its preferred to keep it `True`.


### RuntimeError: Working outside of application context
Add the following line where app is declared:
```python
app = Flask(__name__)
app.app.context().push()
```
## Log of progress
### 5/8
Day 1, I had my database tables approved and managed to write all the tables and their relationships in SQLAlchemy. Planning to write classmethods to be able to seed the database with data.

### 5/9
I created classmethods for each table. As I'm writing the seed_database.py file, I learned that I needed some game data. Steam is not great at providing this information so I learned how to scrape the API every 1.5 seconds or so to grab the information I need. I managed to scrape the top 50 games and will work off of that. I think it'll take hours to scrape every game from the store.

Will continue to write data to seed my database. Thinking about using react for front end but not quite sure how to start yet.

### 5/10
This morning I had issues with SQLAlchemy not attaching to Flask. My colleague, Emiko, helped remind me that I had to use `app` when I ran the file `if __name__ == "__main__"` 

I created a log in page and registration page. Both seem to save to the database successfully.

I managed to scrape data from Steam API overnight. I used the top 50 results to seed the database with no issue. However, when I tried to seed all 6500 games, I ran into some issues of some data that were duplicates and some data that had Null values. I worked on cleaning the scraped data.

I created a 'Browse Games' page that should eventually have search functionality to add to the user's library. Thankfully the database works! I will continue to hash out more of the game store and try to add it to the user's library to review.

### 5/11
Before adding the functionality of adding a game to a user's library, I'm creating the library page and the game's review page.