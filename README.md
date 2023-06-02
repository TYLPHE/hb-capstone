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
[Helpful link](https://stackoverflow.com/questions/3464443/how-to-create-one-to-one-relationships-with-declarative/9611874#9611874)- Set `uselist=False` on the parent:
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
navigate('/signin', { state: response.msg })
```

[This link taught me that](https://stackoverflow.com/questions/42173786/react-router-pass-data-when-navigating-programmatically) if I want to send a flash message to the log in page to remind the user of their account name, then I can set a state and call it with another React Router hook called, `useLocation()`.
```javascript
// On Signin.jsx
const { state } = useLocation();
  useEffect(() => {
    if {
      (state) setMsg(state);
    }
  }, [state])
```
Some pretty cool stuff here!

### Extracting URL parameters with React Router
If I want to extract parameters from the URL in a component, I can use the hook called `useParams()`. For example, 
```javascript
// GameDetails.jsx
// Extract the game's ID from the URL '/games/:id'
const { id } = useParams()
console.log(id)
```

In a loader, however, [I learned from the documentation](https://reactrouter.com/en/main/route/loader) that we can pass `{ params }` to the loader function to extract the parameter of the URL. For example, 
```javascript
// from index.js
{
  path:'/games/:id',
  element: <GameDetails />,
  loader: async ({ params }) => {
    console.log(params.id);
    return null;
  }
},
```

This is really helpful to pull a game's details before the component renders, hopefully for a snappier experience.

### Thinking about styling for mobile devices
[Refer to this for future reference](https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto) 


### SQLAlchemy relationship() issue
SQLAlchemy kept returning an error related to its `relationship()` function. For example,
```python
# In /game/models
movies = db.relationship('Movie', back_populates='game')

# And in /movie/models
game = db.relationship('Game', back_populates='movies')
```

SQLAlchemy could not seem to detect `'Movie'` or `'Game'`. I fixed this issue by importing movie and game into `/core`.

### Session.query() vs Model.query()
I've learned that [New in version 1.4: Added Session.get(), which is moved from the now legacy Query.get() method.](https://docs.sqlalchemy.org/en/20/orm/session_api.html#sqlalchemy.orm.Session.get). Version 1.4 was released Jan-03-23. Right now I am using SQLAlchemy 2.0 (Released Apr-30-23).

I want to use the more modern methods of SQLAlchemy so will try to use session.query(). Since I also modularized my models, I learned I can run the command `flask shell` to test my queries. 

For example, [I now should](https://docs.sqlalchemy.org/en/14/glossary.html#term-2.0-style),
```
db.session.query(User).all()
```

This gives the same result as,
```
User.query.all()
```

I haven't found a clear answer to why Model.query is legacy code but I'll take it.

#### Addendum
[I found a table on sqlalchemy.org](https://docs.sqlalchemy.org/en/20/changelog/migration_20.html#migration-20-query-usage) that compares 1.x style with the new 2.0 style! Personally, it looks worse.

It seems like `session.query()` is old too. I should be using something like `scalars()` and `execute()` listed in the article mentioned above.

### React Strict Mode triggers useEffect() twice
I noticed that react was fetching my api twice on refresh. [I learned](https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode?rq=4) that react's strict mode does this and should trigger only once in production.

```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
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

I've decided to use the new React Router version (6.4), which was released around September, 2022. A lot of the google examples seem outdated so I'm going to rely on the docs to maybe use the latest methods.

### 5/14
I learned how to use React Router to route to different components. I've also learned how to use loader to check if the user is already logged in to automatically redirect them to the dashboard. 

I also learned how to use React Router's `useNavigate()` hook to redirect users to different pages after log in and registration.

React Router's redirect is really cool becasue w can use the `useLocation()` hook to send data to a different component. In my case, once the user creates an account, they are redirected to the sign-in page with a reminder of their account name to log in. 

### 5/15
I did a lot today. First, I created a user library where users can see their own games. Then I created a game details page where users can see details about any game. From the game details, I added functionality where users can add the game to their library.

Later in the evening, I created a game search and search results page. Users can partially search for games. I don't know how to deal with the search results page yet. I limited the search term to 2 characters to limit the number of games returned. I also am only listing the game's name. I am afraid if I list all the game's thumbnail, the page will be too busy with a list of images. A one page search result where user can see more search results as they scroll would be cool though... That will probably be a nice-to-have feature.

### 5/16
Looking into the [react-md-editor](https://github.com/uiwjs/react-md-editor), which is a "simple markdown editor with preview, implemented with React.js and TypeScript."

I was able to implement the markdown editor. This was one of the features I was most worried about but the react-md-editor was straightforward and easy to use.

After creating the editing feature, I moved to deleting the review and game from the user's library. I was thinking about implementing a modal for the delete confirmation but I remembered that people hate modals. I turned it into a new page instead. I'll probably make the button red when I start styling.

It has been about 1 week since I started and 3 days since I learned and implemented react. I'm pretty proud to say the basic MVP functionality is here. Planning to add a header and log out button next.

### 5/17
I created a header with basic navigation, game search, and Log out.

In the morning lecutre, I noticed in the lecture's demo code how the API is called from its server.py file. I ended up refactoring my server routes to include proper route url names, responses, and response codes.

I learned from [Flask's tips about making responses](https://flask.palletsprojects.com/en/2.3.x/quickstart/?highlight=about%20responses#about-responses) that There are multiple ways to return responses and their codes. I paired that with [MDN's list of response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) to properly label my API's responses. Some of my website does not need a response body so [I learned to create an empty body](https://stackoverflow.com/questions/24295426/python-flask-intentional-empty-response) by `return Response(code=200)`. Eventually, though, I decided to send an empty string since it felt easier to read. I instead `return '', 200` as my empty response.

Extra tasks completed:
- Library is now sorted.
- FLASK QUESTION: What is the difference between a URL converter and request.args?
   - [Answer](https://www.alibabacloud.com/topic-center/dev-faq/ghgfdxwc43-when-do-i-use-path-params-vs-query-params-in-a-restful-api)

### 5/18
I spent pretty much all day styling my website so it looks cool.

Thinking about what to do next for today. MVP is complete so I'm thinking about adding extra features.

Thoughts:
- Tomorrow's TODO: Fix bug when searching for 1 game only
- Dashboard- image carousel that shows some games in library.

### 5/19
I decided learn more about the back-end. I'm hoping to refactor my server's code for better understanding and scalability. I think just about all of the cohort, including me, are using the Movie Ratings app as a template to build their models and views. If I can understand Flask a little better, maybe I can refactor that template code into something more readable.

Used this earlier in the week but helped with packaging (https://dev.to/nagatodev/getting-started-with-flask-1kn1)
Playing with blueprints (https://realpython.com/flask-blueprint/)
nesting blueprints (https://flask.palletsprojects.com/en/2.3.x/blueprints/)

### 5/20
I've been playing a lot with how python packages work and I think I have a better idea of how it works. Thanks to the article linked below, I learned how to turn my folders into packages. This way, I can import the package and have access to its contents.
- [Helpful link to understanding `__init__.py`](https://web.archive.org/web/20200721150953/http://effbot.org/pyfaq/what-is-init-py-used-for.htm)

### 5/21
Before today, I had my header rerender whenever a page was visited. This was a problem because the nav bar is designed to query for user initials to show that they've logged in. Whenver the user visits a new page, the nav bar would keep querying for the user initials.

I learned from the video below that I could use React Router to set up a layout or template with children inside!
[Nav bar with React Router](https://www.youtube.com/watch?v=5s57C7leXc4)

### 5/22
I added a follow feature to my app. In order to implement it, I added an extra many-to-many table. This is updated in the 'Links' section of this README under 'Data Table'. I'm surprised that I was able to implement this without big roadblocks!

I did run into a React issue where navigating from another user's library, which has the follow/unfollow button, to their own library. The issue is that the follow button would stay on the page. I learned to add a `useEffect()` that will set states on render:

```javascript
useEffect(() => {
  setOwner(library_owner)
  setFollowBool(followed)
}, [library_owner, followed])
```

This bug was also happening to the game details page with the 'Add to library' button, which was fixed. 

I also fixed another bug. When a user visits a game details page, useEffect sets the background of the #root element. However, when they navigated away from the page, the background would not change. I learned to use `useEffect()` again.

If we return a funciton on useEffect, we can tell react to do things to the component when it is 'unmounted'. [If your effect returns a function, React will run it when it is time to clean up](https://legacy.reactjs.org/docs/hooks-effect.html#example-using-hooks-1).

To make my background return to null, I added the following code:
```javascript
useEffect(() => {
  return () => {
    const root = document.querySelector('#root');
    root.style.backgroundImage = null;
  }
}, []);
```

### 5/23
`Promise.all()` is blowing my mind but I think I have a solution thanks to [this](https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all).

After some trial-and-error, I was able to perform multiple fetch requests by using `Promise.all()`. As soon as I figured that out, I immediately hit another bug in react.

React was returning null in my states despite using hooks to set the state variables with the responses from `Promise.all()`. In order to fix this bug, I had to also set the variables in `setState()` like so:
```javascript
const { username, following, followers, random_review } = useLoaderData();
const [name, setName] = useState(username)
const [fing, setFing] = useState(following)
const [fers, setFers] = useState(followers)
const [randomReview, setRandomReview] = useState(random_review)

useEffect(() => {
  setName(username);
  setFing(following);
  setFers(followers);
  setRandomReview(randomReview)
}, [username, following, followers, randomReview])
```
Again, I was setting `useState(null)` instead of something like, `useState(username)`. In case anybody is wondering, I set the `useEffect()` to ensure that if I switch to another user's library page, all the components update to the new user's data.

After figuring out how to deliver data from my API to React, I started working a little bit on the dashboard. First, I decided to show a list of followers and followed users. In order to do this, I created new methods for the API to distribute the right users. Next I combined React Router to link the followed/following list of users to their respective libraries. Finally, I styled it so it would look ok on the user's dashboard.

As for the styling, this was a [really cool guide](https://dev.to/jordanfinners/creating-a-collapsible-section-with-nothing-but-html-4ip9) to create a collapsible section with just HTML tags. I felt like this was a really nice way of displaying things on the dashboard and it was easy to implement because theyre just `<details>` and `<summary>` tags!

### 5/24
Notes throughout the day:
- Working on styling and animations; More specifically the hover functionality.
- Thinking about extracting more details for my games API.
- Fixed bug about if user has no followers or followers with no reviews, random review breaks.

What a day. I started with styling and animations; More specifically the hover functionality. 

Next, I really wanted to expand on the game details page. In order to do that, I needed to expand on my database seeding file. It was not using all the tables listed in my data model. I still needed to populate screenshots, movies, and developers. This was a big task for me because of the number of games I'm adding to my database. I skipped populating these fields because I was not sure how long it would take to create an MVP. Now that I have some extra time, I can go back to this task and populate the rest of the tables.

The biggest challenge about expanding my own table was traversing through all the nested objects and lists. I had to break it down into smaller parts too. For example, pulling just screenshots, then just movies, etc., and then pulling all the data at once.


### 5/25
Notes throughout the day
- Maybe take a break from this project to memorize python built in functions for whiteboarding.
- I had my wife browse my page and she had a hard time navigating though each page and understanding what to do. I'm going to focus on navigation logic.

The day was spent rearranging my UI to make more sense as a user navigates through my web site.

### 5/26
- Fixed links that have a '/' in its name, for example, `http://localhost:3000/games/2130460/FATAL FRAME / PROJECT ZERO: Mask of the Luna Eclipse` would return a 404. I learned that it's because of the '/' in its title. I only use the game's id to find the game but I felt like it would be helpful to include the game's title in the URL too.

### 5/27
I decided to include a publish button. The ultimate goal is to allow users to add games to their library without needing to add a review. This means that I also need to add an indicator in the library to show whether or not a review has been published or not. 

### 5/28
Worked on some functionality that hopefully makes sense when someone else uses it.
- Library now has proper functionality if its owner is accesssing it
- Delete now has a decline button
- Review is not hidden if not published

### 5/29
- Moved delete button from review to editReview
- Added delete button to library so user can remove games they've recently added
- UI animations in library to make deleting more intuitive
- Updated follow button style
- Game details has proper navigation before and after adding the game to library

- bug fix: State is null on delete. I passed state in button and not the <Link> component.

TODO: Add proper game filter

### 5/30
Wife had another look at the user flow. I think it makes more sense now. Making more updates to UI
- bug fix: Background not properly updating from background-image to plain background-color. I had to move background-color and background-image to the same layer. Before they were split between `root` element and the `body` element. They are now both sitting in `root`.
- Note for later: This is a nice complementary color: #644a22

Today I created a UI for filtering games. Since I don't have very strong tags for my game, I decided to be able to filter by letters and include a text input to better refine the search.

I was able to produce a list of filters to pass to SQLAlchemy but the challenge today was what to do with the list of filters. 

I learned about the `and_` and `or_` functions today. 

### 5/31
I spent more time on the filters today. I implemented filters for both the games and the users. On the surface, they look the same but I tried two differnt strategies for filtering.

Filters on the games page will send a fetch request to the server for a list of games. However, since there are fewer users than games, I decided to load all users first, and then use React to display what was filtered. Surprisingly, having react filter the right users was difficult. I learned that sometimes the warnings for `useEffect()` can be ignored.

In this case, I wanted to only update the users if the `filter` state changed. Once `filter` updated, I wanted to update a different state called `users`, which is an array of objects. React wanted me to add `users` to `useEffect` like so: `useEffect(() =>, [filter, users])`. I learned that we can apply a quick fix, which adds a comment in the line above, letting VSCode know to ignore this warning!
```javascript
useEffect(() => {
  if (!filters.length) {
    return setUsers(users);
  } else {
    filters.forEach((filter) => {
      setUsers(users.filter((user) => user.username.includes(filter)));
    });
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [filters])
```

### 6/1
- Upvote/downvote arrows I want to use later: 🡅🡇
- Added arrows to Review Edit page.
- Arrows now appear in Review page.

- Final section I need to expand on is the Game Details page.
  - I would like to first add a review section to show a list of users who reviewed the game.