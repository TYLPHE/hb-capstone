""" Server for capstone """

from flask import Flask, render_template, request, flash, session, redirect
# from model import connect_to_db, db
from jinja2 import StrictUndefined
from crud import *
import os

app = Flask(__name__)
app.secret_key = os.environ['APP_KEY']
app.jinja_env.undefined = StrictUndefined
app.app_context().push()

@app.route('/')
def homepage():
    """ Render homepage """

    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)