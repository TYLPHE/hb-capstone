""" Server for capstone """

from flask import Flask, render_template, request, flash, session, redirect
from model import *
from jinja2 import StrictUndefined

import os

app = Flask(__name__)
app.secret_key = os.environ['APP_KEY']
app.jinja_env.undefined = StrictUndefined
app.app_context().push()

@app.route('/')
def homepage():
    """ Render homepage """

    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login_post():
    """ Check if user exists. Set session if logged in """

    username = request.form.get('username')
    password = request.form.get('password')
    login_ok = User.validate(username, password)

    if (login_ok):
        session['username'] = login_ok.username
        flash(f'Welcome, {login_ok.fname.capitalize()}')
        return render_template('user.html')
    else:
        flash('Incorrect email or password')
    
    return redirect('/')
    
@app.route('/logout')
def logout():
    """ Logs the user out of session """

    session.pop('username', None)

    return redirect('/')


@app.route('/register')
def register():
    """ Render registration page """

    return render_template('register.html')

@app.route('/register', methods=['POST'])
def register_post():
    """ Checks for user in db, then saves account to db """

    username = request.form.get('username')
    password = request.form.get('password')
    fname = request.form.get('fname')
    lname = request.form.get('lname')

    user_exists = User.exists(username)
    if (user_exists):
        flash('Username already exists.')
    else:
        flash(f'"{username}" created. Please log in')
        user = User.create(username, password, fname, lname)
        db.session.add(user)
        db.session.commit()

    return redirect('/')

@app.route('/games')
def games():
    """ Find top 10 games and render page """

    games = Game.random_games()
    print('@@@@@', games)
    return render_template('games.html', games=games)

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)