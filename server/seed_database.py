""" Script to seed database """

import os, json
from core import db
from core.model import *
from core.user.models import User

# Commands to create a new 'tylphe-capstone' db
os.system('dropdb tylphe_capstone')
os.system('createdb tylphe_capstone')
# connect_to_db(app)
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

            """ 
            # Comment-in to generate a new list of appids
            with open('/data/games-filtered.json', 'r') as f:
                data = f.read()

            h = json.loads(data)
            h.append(id)

            with open('/data/games-filtered.json', 'w') as f:
                f.write(json.dumps(h, indent=2))
            """

l1 = Library.create(u1)

db.session.add_all([u1, l1])
db.session.commit()

lg1 = Library_game.create(l1, games_class[0])

r1_markdown = """ # Dota 2 Review

## Introduction

Dota 2 is a multiplayer online battle arena (MOBA) game developed and published by Valve Corporation. It is the sequel to the popular Warcraft III mod, Defense of the Ancients (DotA). In Dota 2, players engage in intense team-based battles, utilizing strategic gameplay and hero selection to defeat the opposing team. As an avid player of the game, I would like to share my review and thoughts on Dota 2.

## Gameplay

Dota 2 offers an incredibly deep and complex gameplay experience. The game revolves around two teams of five players, each controlling a hero with unique abilities and roles. The objective is to destroy the enemy's Ancient, a heavily fortified structure located in their base. To achieve this, players must navigate through three lanes, engaging in skirmishes, farming gold and experience, and pushing towers.

The gameplay mechanics in Dota 2 are well-balanced and provide a high level of depth. Each hero has its strengths and weaknesses, and the strategic decision-making involved in hero selection, itemization, and team composition is crucial. The game rewards teamwork, coordination, and individual skill, creating an exhilarating and satisfying experience.

## Graphics and Sound

Visually, Dota 2 is stunning. The game features detailed character models, beautiful environments, and impressive spell effects. The art style is distinctive and cohesive, enhancing the overall immersion. The sound design is also top-notch, with impactful ability sounds and an epic soundtrack that adds to the intensity of battles.

## Community and Esports

The Dota 2 community is diverse and passionate, with a dedicated player base. However, it is important to note that like any online competitive game, toxic behavior exists. Valve has implemented systems to combat toxicity, but occasional negative encounters can still occur. Nevertheless, Dota 2 provides a great opportunity to connect and play with friends or join teams to compete in leagues or tournaments.

Dota 2 has become one of the leading titles in the esports scene. The annual tournament, The International, features the world's best teams battling for a massive prize pool. The competitive scene is well-structured and provides thrilling matches, making it a joy to watch and follow.

## Updates and Support

Valve has done an excellent job of consistently updating Dota 2 with new content and balance patches. The developers actively listen to the community, addressing bugs and introducing gameplay improvements. Furthermore, the game is free-to-play, and all heroes are available from the start, ensuring a level playing field for all players.

## Conclusion

Dota 2 is a masterpiece of the MOBA genre, offering deep gameplay, stunning graphics, and a vibrant community. The strategic gameplay, hero variety, and the constant updates from Valve keep the game fresh and exciting. While toxicity can be an issue, the overall experience of Dota 2 is highly rewarding, making it a must-play for fans of competitive gaming.
 """

r1 = Review.create(
    lg1, 
    r1_markdown
    )

db.session.add_all(games_class + [lg1, r1])
db.session.commit()