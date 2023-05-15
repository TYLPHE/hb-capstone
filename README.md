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

## Ideas for later
 - Maybe add a sidebar in User Home to display a list of reviews of followed reviewers
 - Search in nav to find game 

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

### Flask's jsonify vs json.dumps()
After converting my project to have a React front-end. I needed to change how I send data to the client. In Flask, I could send the classes I created as a parameter to Jinja using render template, for example, `render_template('homepage.html', user=User)`.

Jinja is great because it can interpret that class created in Python and read the class's attributes no problem. I think if I were to send data to React, I need to query the classes, then convert it into a dictionary, and then send that newly created dictionary to React. For example, 
```python
    # server.py
    user = User.query.get(1)
    json_user = {
        'id': user.id,
        'username': user.username,
        'fname': user.fname,
        'lanme': user.lname,
    }
    return json_user
```

I guess it makes sense to do it this way too because I'm only sending the data I need instead of a whole class object.

So I know that I need to send data through the internet as strings. Flask has a `jsonify()` funciton and python has a `json.dumps()`. For this particular example, [using `jsonify()` is better](https://www.geeksforgeeks.org/use-jsonify-instead-of-json-dumps-in-flask/#). However, [I saw this article from 2020](https://danielms.site/blog/flask-jsonify-you-dont-need-it/) saying that returning a dictionary automatically uses `jsonify()` on a dicionary. I'm going to return code just like the `json_user` dictionary mentioned above.

### Fetching server data from React
I learned that Flask routes and React routes need to be different. For example I wanted to redirect the user to their dashboard if they are logged in. When loading my react page at the root address, `'/'`, I wanted to `fetch()` data from Flask, which was also linked to `@app.route('/')`. React was confused and never contacted Flask. React routes and Flask routes need to be different

### Redirecting with flash messages
I learned that setting React Router's hook called `useNavigate()` can help redirect the user to different locations by setting in the component:
```javascript
// On Register.js
const navigate = useNavigate();

// Code to create user account and redirect to log in page
navigate('/login') 
```

If I want to send a flash message to the log in page to remind the user of their account name, then I can set a state and call it with another React Router hook called, `useLocation()`.
```javascript
// On Login.js
const { state } = useLocation();
  useEffect(() => {
    if (state) {
      return setMsg(state);
    }
  }, [state])
```
Some pretty cool stuff here!

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
Before adding the functionality of adding a game to a user's library, I created the library page and the game's review page. I then added a button that lets the user add the game to their own library.

This add button is disabled if the game already exists in the user's library.

I then added a partial search functionality where the user can type 'marvel' and if the partial search returns more than 1 game, it will display a list of games containing the word 'marvel'.

Next I will work on the review page where the user can edit their review. That will probably be followed by the ability to delete their review and remove the game from their library.

### 5/12
Thinking about the review editing to be similar to the GitHub's markdown editor. I hope it exists somewhere out there. But before working on the review page, I'm going to try to figure if I can incorporate React into this project...

It's about 2 AM and I have followed 3 different guides:
 - [dev.to Getting Started with Flask](https://dev.to/nagatodev/getting-started-with-flask-1kn1)
 - [dev.to How to connect Flask to ReactJs](https://dev.to/nagatodev/how-to-connect-flask-to-reactjs-1k8i)
 - [Authentication in React app using Flask Server-Sided Sessions](https://www.youtube.com/watch?v=sBw0O5YTT4Q)

 The first two I actually coded along the guide and learned a lot. The third, YouTube video, guide helped me understand how to use sessions between the back-end and front-end. It also showed me how I could structure my files.

 Tomorrow I have a good idea of how I want to approach this capstone project to make it a Flask and React project.

 ### 5/13
 I have created a React project inside the newly created `client` folder and moved all the SQL/Flask files into a newly created `server` folder. I have referred back to the guides from yesterday and I think I have successfully authenticated a user with React! Now I can practice more with React as my front-end framework. 
 
 I feel like this was quite the detour but it will be good for me in the long run. Good thing I have an extra week before the first MVP is due!

I've decided to use the new React Router version (6.4), which was released around September, 2022. A lot of the google examples seem outdated so I'm going to rely on the docs to maybe use the latest ways of using it.

### 5/14
I learned how to use React Router to route to different components. I've also learned how to use loader to check if the user is already logged in to automatically redirect them to the dashboard. 

I also learned how to use React Router's `useNavigate()` hook to redirect users to different pages after log in and registration.

React Router's redirect is really cool becasue w can use the `useLocation()` hook to send data to a different component. In my case, once the user creates an account, they are redirected to the login page with a reminder of their account name to log in. 