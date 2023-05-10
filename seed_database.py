""" Script to seed database """

import os, random, datetime, server, json
from model import *

# Commands to create a new 'tylphe-capstone' db
os.system('dropdb tylphe_capstone')
os.system('createdb tylphe_capstone')
connect_to_db(server.app)
db.create_all()

# Seed db
u1 = User.create('tylphe','123','Tyler', 'Phet')

# Seed Games
with open('data/games.json') as f:
    data = f.read()

games = json.loads(data)

games_class = []
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
        match = [entry for entry in games_class if entry.id == id]              
        
        if len(match) > 0:
            continue
        else:
            g = Game.create(id, name, short_description, 
                            header_image, background, release_date)
            games_class.append(g)

            with open('/data/games-filtered.json', 'r') as f:
                data = f.read()

            h = json.loads(data)
            h.append(id)

            with open('/data/games-filtered.json', 'w') as f:
                f.write(json.dumps(h, indent=2))

l1 = Library.create(u1)

db.session.add_all([u1, l1])
db.session.commit()

lg1 = Library_game.create(l1, games_class[0], True, 100, datetime(2023, 1, 31))
r1 = Review.create(lg1, 'This is a review for Dota 2.', 5)

db.session.add_all(games_class + [lg1, r1])
db.session.commit()