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
    if (session.get('username')):
        return render_template('user.html')
    else:
        return render_template('index.html')


@app.route('/login', methods=['POST'])
def login_post():
    """ Check if user exists. Set session if logged in """

    username = request.form.get('username')
    password = request.form.get('password')
    login_ok = User.validate(username, password)
    library = Library.search_by_id(login_ok.id)

    if (login_ok):
        session['username'] = login_ok.username
        session['user_id'] = login_ok.id
        session['library_id'] = library.id
        print('SESSIONS: ',
              'username', session['username'],
              'user_id', session['user_id'],
              'library_id', session['library_id'],)
        flash(f'Welcome, {login_ok.fname.capitalize()}')
        return render_template('user.html')
    else:
        flash('Incorrect email or password')
    
    return redirect('/')
    
@app.route('/logout')
def logout():
    """ Logs the user out of session """

    session.pop('username', None)
    session.pop('user_id', None)
    session.pop('library_id', None)

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
        # Create user and create users' library
        flash(f'"{username}" created. Please log in')
        user = User.create(username, password, fname, lname)
        library = Library.create(user)
        db.session.add_all([user, library])
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
        session['search'] = name
        return redirect(f'/games/search-result')
    elif (len(result) == 1):
        return redirect(f'/games/details/{ result[0].id }/{ result[0].name }')
    else: 
        flash('Game not found')

    return redirect('/games')


@app.route('/games/search-result')
def search_results():
    """ display a list of games based on search term """

    name = session['search']
    games = Game.search_by_name(name)

    return render_template('search-result.html', games=games, name=name)
    

@app.route('/games/details/<game_id>/<game_name>', strict_slashes=False)
def game_details(game_id, game_name):
    """ Render game details """

    game = Game.search_by_id(game_id)

    # Check if game already exists. If so, disable add to library button
    library_id = session['library_id']
    library_game = Library_game.search_by_game_id(library_id, game_id)
    
    return render_template('game-details.html', game=game, 
                           library_game=bool(library_game))


@app.route('/library')
def library():
    """ Display user's library and their added games """

    user = session['user_id']
    library = Library.search_by_id(user)
    library_games = Library_game.search_by_id(library.id)

    for g in library_games:
        game = Game.search_by_id(g.game_id)
        g.game = game

    return render_template('library.html', 
                           library=library, 
                           library_games=library_games)


@app.route('/review/<lgame_id>')
def review(lgame_id):
    """ Display review of game """

    review = Review.search_by_id(lgame_id)

    return render_template('review.html', review=review)


@app.route('/add-game', methods=['POST'])
def add_game():
    """ Add game to user's library """

    library = Library.search_by_id(session.get('library_id'))
    game = Game.search_by_id(request.json.get('game_id'))
    library_game = Library_game.create(library, game)
    review = Review.create(library_game)
    
    if (library_game):
        db.session.add_all([library_game, review])
        db.session.commit()
        return {
            'success': True,
            'msg': 'Hello'
        }
    else:
        return {
            'success': True,
            'msg': 'Game already exists'
        }


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)