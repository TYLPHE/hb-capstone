""" Script to seed database """

import os, random, datetime, server
from model import *

# Commands to create a new 'tylphe-capstone' db
os.system('dropdb tylphe_capstone')
os.system('createdb tylphe_capstone')
connect_to_db(server.app)
db.create_all()

# Seed db
u1 = User.create('tylphe','123','Tyler', 'Phet')
l1 = Library.create(u1)

db.session.add_all([u1, l1])
db.commit()

lg1 = Library_game.create(l1, True, 100, datetime(2023, 1, 31))
r1 = Review.create(lg1, 'This is a review.', 5)
