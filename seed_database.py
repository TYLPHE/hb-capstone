""" Script to seed database """

import os, json, random, datetime, model, server, crud

# Commands to create a new 'tylphe-capstone' db
os.system('dropdb tylphe-capstone')
os.system('createdb tylphe-capstone')
# server.app.app_context().push()
model.connect_to_db(server.app)
model.db.create_all()
