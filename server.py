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

@app.route('/games', strict_slashes=False)
def games():
    """ Find top 10 games and render page """

    games = Game.random_games()

    return render_template('games.html', games=games)


@app.route('/games/search')
def search():
    """ search for game and render details """

    name = request.args['game_name']
    result = Game.search_by_name(name)

    if (len(result) > 1):
        return redirect(f'/games/search-results/')
    elif (len(result) == 1):
        return redirect(f'/games/details/{ result[0].id }/{ result[0].name }')
    else: 
        flash('Game not found')

    return redirect('/games')

@app.route('/game/search-results/')
def search_results():
    """ display a list of games based on search term """

    return redirect('/games')
    

@app.route('/games/details/<game_id>/<game_name>/')
def game_details(game_id, game_name):
    """ Render game details """

    game = Game.search_by_id(game_id)
    
    return render_template('game-details.html', game=game)

    
if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)