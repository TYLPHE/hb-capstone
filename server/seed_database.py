""" Script to seed database """

import os, json
from core import db
from random import choice, randint
from core.api.user import User
from core.api.game import Game
from core.api.library import Library
from core.api.library_game import Library_game
from core.api.review import Review
from core.api.screenshot import Screenshot
from core.api.movie import Movie
from core.api.developer import Developer
from core.api.games_developer import Games_developer
from core.api.publisher import Publisher
from core.api.games_publisher import Games_publisher
from core.api.genre import Genre
from core.api.games_genre import Games_genre
from core.api.follower import Follow

# Commands to create a new 'tylphe-capstone' db
os.system('dropdb tylphe_capstone')
os.system('createdb tylphe_capstone')
db.create_all()

# Seed Games
with open('data/games.json') as f:
    data = f.read()

games = json.loads(data)

games_list = []
screenshot_list = []
movie_list = []
developer_set = set()
games_developer_list = []
genre_set = set()
description_set = set() # This is for genre_set because it kept adding duplicates to set
games_genre_list = []
for game in games:
    if(game.get('id') == None):
        continue
    else:
        id = game.get('id')
        name = game.get('name')
        short_description = game.get('short_description')
        header_image = game.get('header_image')
        background = game.get('background')
        release_date = game.get('release_date')

        # Search for matching game ids and exclude from seeding
        match = [entry for entry in games_list if entry.id == id]              
        
        if len(match) > 0:
            continue
        else:
            # Create game
            g = Game.create(id, name, short_description, 
                            header_image, background, release_date)
            games_list.append(g)

            # Create the game's screenshot paths
            screenshots = game.get('screenshots')
            if (screenshots):
                for screenshot in screenshots:
                    path = screenshot.get('path_full')
                    s = Screenshot.create(path, g)
                    screenshot_list.append(s)

            # Create the game's movie paths
            movies = game.get('movies')
            if (movies):
                for mv in movies:
                    vid = mv.get('mp4')
                    if (vid):
                        path = vid.get('480')
                        if (path):
                            m = Movie.create(path, g)
                            movie_list.append(m)
            
            # Create developers table
            developers = game.get('developers')
            if (developers):
                for developer in developers:
                    d = Developer.create(developer)
                    developer_set.add(d)

                    # Create games_developer relationship
                    for devClass in developer_set:
                        if developer == devClass.name:
                            gd = Games_developer.create(g, devClass) 
                            games_developer_list.append(gd)

            # Create genres table
            genres = game.get('genres')
            if (genres):
                for genre in genres:
                    description = genre.get('description')
                    if description not in description_set:
                        description_set.add(description)
                        ge = Genre.create(description)
                        genre_set.add(ge)


                    # Create games_genre relationship
                    for genreClass in genre_set:
                        if description == genreClass.name:
                            gg = Games_genre.create(g, genreClass)                            
                            games_genre_list.append(gg)
            

            """
            # Comment-in to generate a new list of appids
            with open('/data/games-filtered.json', 'r') as f:
                data = f.read()

            h = json.loads(data)
            h.append(id)

            with open('/data/games-filtered.json', 'w') as f:
                f.write(json.dumps(h, indent=2))
            """

# commit games and its related tables
genre_list = list(genre_set)
developer_list = list(developer_set)
db.session.add_all((
    games_list + 
    screenshot_list + 
    movie_list + 
    developer_list + 
    games_developer_list + 
    genre_list + 
    games_genre_list 
))
db.session.commit()

# seed users
usernames = [
    'tylphe',
    'cozycat',
    'funnyferret',
    'sillysquirrel',
    'playfulpenguin',
    'happyhamster',
    'dashingdolphin',
    'cuddlykoala',
    'quirkyquokka',
    'wittywalrus',
    'sneakysnake',
    'charmingcheetah',
    'luckyladybug',
    'bravebulldog',
    'sleepysloth',
    'jollyjellyfish',
    'cleverchameleon',
    'bashfulbunny',
    'prancingpony',
    'wisewolf',
    'purringpanther',
]
fname_lname = [
    ('Tyler', 'Phet'),
    ('Cozy', 'Cat'),
    ('Funny', 'Ferret'),
    ('Silly', 'Squirrel'),
    ('Playful', 'Penguin'),
    ('Happy', 'Hamster'),
    ('Dashing', 'Dolphin'),
    ('Cuddly', 'Koala'),
    ('Quirky', 'Quokka'),
    ('Witty', 'Walrus'),
    ('Sneaky', 'Snake'),
    ('Charming', 'Cheetah'),
    ('Lucky', 'Ladybug'),
    ('Brave', 'Bulldog'),
    ('Sleepy', 'Sloth'),
    ('Jolly', 'Jellyfish'),
    ('Clever', 'Chameleon'),
    ('Bashful', 'Bunny'),
    ('Prancing', 'Pony'),
    ('Wise', 'Wolf'),
    ('Purring', 'Panther'),
]

def create(usernames, fname_lname):
    """ Create users, their library, games, and followers """

    to_add = []

    # to create random follows
    users = []
    libraries = []
    
    for i, username in enumerate(usernames):
        u = User.create(username, '123', fname_lname[i][0], fname_lname[i][1])
        l = Library.create(u, u.username)
        to_add.extend([u,l])
        users.append(u)
        libraries.append(l)

        # create the user's list of games in their library
        with open('data/generic-review.txt', 'r') as review:
            mkdn = review.read() 

        for _ in range(randint(3, 5)):
            lg = Library_game(library=l, game=choice(games_list))
            r = Review.create(lg, mkdn)
            to_add.extend([lg, r])
            

    # create followers
    for user in users:
        l_copy = libraries[:]
        for _ in range(randint(5, 20)):
            random_library = l_copy.pop(randint(0, len(l_copy) - 1))
            f = Follow(user=user, library=random_library)
            to_add.append(f)

    db.session.add_all(to_add)
    db.session.commit()

# commit users with random seeded data
create(usernames, fname_lname)
