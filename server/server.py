""" Server for capstone """

from flask import Flask, render_template, request, flash, session, redirect
from model import *
from jinja2 import StrictUndefined
from flask_session import Session
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
app.secret_key = os.environ['APP_KEY']
app.jinja_env.undefined = StrictUndefined
app.app_context().push()
app.config['SESSION_TYPE'] = 'filesystem'
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)
Session(app)
CORS(app)

# Routes for React
@app.route('/login-status')
def login_status():
    """ Checks if user session is defined """

    user_id = session.get('user_id')
    username = session.get('username')
    print('### USER_ID: ', user_id, '@@@@ USERNAME: ', username)
    if not user_id:
        
        return { 'user_id': None }
    else: 
        
        return { 'user_id': user_id, 'username': username.capitalize() }

@app.route('/data')
def data():
    """ React testing """
    session['test'] = 'test'

    return {
        'name': 'tyl',
        'test': 'test',
        }

@app.route('/data1')
def data1():
    """ test login """
    print('@@@@@@@@@', session.get('test'))
    user = session.get('test')

    if not user:
        return {'error': 'Unauthorized'}

    user = User.exists('tylphe')
    json_user = {
        'id': user.id,
        'username': user.username,
        'fname': user.fname,
        'lanme': user.lname,
        }

    return json_user

@app.route('/user-login', methods=['POST'])
def user_login():
    """ Check if user exists. Set session if logged in """

    username = request.json.get('username')
    password = request.json.get('password')
    login_ok = User.validate(username, password)

    if (login_ok):
        library = Library.search_by_id(login_ok.id)

        session['username'] = login_ok.username
        session['user_id'] = login_ok.id
        session['library_id'] = library.id
        print('SESSIONS: ',
              'username', session['username'],
              'user_id', session['user_id'],
              'library_id', session['library_id'],)
        
        return { 'status': 'Success' }
    

    return {
        'status': 'Error',
        'msg': 'Wrong account name or password.'
        }


@app.route('/user-register', methods=['POST'])
def user_register():
    """ Checks for user in db, then saves account to db """

    username = request.json.get('username')
    password = request.json.get('password')
    fname = request.json.get('fname')
    lname = request.json.get('lname')

    user_exists = User.exists(username)
    if (user_exists):
        
        return {
            'status': 'Error',
            'msg': 'Please enter a different account name.'
        }
    else:
        # Create user and create user's library
        user = User.create(username, password, fname, lname)
        library = Library.create(user)
        db.session.add_all([user, library])
        db.session.commit()

        return {
            'status': 'Success',
            'msg': f'"{ username }" created. Please sign in.',
        }


@app.route('/library-data')
def library_data():
    """ Display user's library and their added games """

    user = session.get('user_id')
    response = { 
        'status': 'Success',
        'library_games': [],
        }

    library = Library.search_by_id(user)
    response['library_name'] = library.name.capitalize()

    if (library != None):
        game_dict = {}
        library_games = Library_game.search_by_id(library.id)
        
        for game in library_games:
            game_dict['library_game_id'] = game.id

            # Query for game details to add to library
            game_data = Game.search_by_id(game.game_id)
            game_dict['game_id'] = game_data.id
            game_dict['game_name'] = game_data.name
            game_dict['game_header_image'] = game_data.header_image
            
            response['library_games'].append(game_dict)

        print('&&&&&&&&RESPONSE: ', response)
        return response
    

    else:
      return { 'status': 'Error' }


@app.route('/games/<game_id>/<game_name>')
def game_details(game_id, game_name):
    """ Render game details """

    game = Game.search_by_id(game_id)

    if not game:
        return { 'status': 'Error' }
    else:
        response = { 'status': 'Success' }

        # Check if game already exists. If so, disable add to library button
        library_id = session.get('library_id')
        library_game = Library_game.search_by_game_id(library_id, game_id)
        response['name'] = game.name
        response['short_description'] = game.short_description
        response['header_image'] = game.header_image
        response['background'] = game.background
        response['release_date'] = game.release_date
        response['in_library'] = bool(library_game)
        
        # return render_template('game-details.html', game=game, 
                            #    library_game=bool(library_game))
        
        return response

# Routes for Jinja (depreciating)
# @app.route('/')
# def homepage():
#     """ Render homepage """
#     # Old Jinja code
#     if (session.get('username')):
#         return render_template('user.html')
#     else:
#         return render_template('index.html')

# @app.route('/login', methods=['POST'])
# def login_post():
#     """ Check if user exists. Set session if logged in """

#     username = request.form.get('username')
#     password = request.form.get('password')
#     login_ok = User.validate(username, password)
#     library = Library.search_by_id(login_ok.id)

#     if (login_ok):
#         session['username'] = login_ok.username
#         session['user_id'] = login_ok.id
#         session['library_id'] = library.id
#         print('SESSIONS: ',
#               'username', session['username'],
#               'user_id', session['user_id'],
#               'library_id', session['library_id'],)
#         flash(f'Welcome, {login_ok.fname.capitalize()}')
#         return render_template('user.html')
#     else:
#         flash('Incorrect email or password')
    
#     return redirect('/')
    
# @app.route('/logout')
# def logout():
#     """ Logs the user out of session """

#     session.pop('username', None)
#     session.pop('user_id', None)
#     session.pop('library_id', None)

#     return redirect('/')


# @app.route('/register')
# def register():
#     """ Render registration page """

#     return render_template('register.html')

# @app.route('/register', methods=['POST'])
# def register_post():
#     """ Checks for user in db, then saves account to db """

#     username = request.form.get('username')
#     password = request.form.get('password')
#     fname = request.form.get('fname')
#     lname = request.form.get('lname')

#     user_exists = User.exists(username)
#     if (user_exists):
#         flash('Username already exists.')
#     else:
#         # Create user and create users' library
#         flash(f'"{username}" created. Please log in')
#         user = User.create(username, password, fname, lname)
#         library = Library.create(user)
#         db.session.add_all([user, library])
#         db.session.commit()

#     return redirect('/')

# @app.route('/games', strict_slashes=False)
# def games():
#     """ Find top 10 games and render page """

#     games = Game.random_games()

#     return render_template('games.html', games=games)


# @app.route('/games/search')
# def search():
#     """ search for game and render details """

#     name = request.args['game_name']
#     result = Game.search_by_name(name)

#     if (len(result) > 1):
#         session['search'] = name
#         return redirect(f'/games/search-result')
#     elif (len(result) == 1):
#         return redirect(f'/games/details/{ result[0].id }/{ result[0].name }')
#     else: 
#         flash('Game not found')

#     return redirect('/games')


# @app.route('/games/search-result')
# def search_results():
#     """ display a list of games based on search term """

#     name = session['search']
#     games = Game.search_by_name(name)

#     return render_template('search-result.html', games=games, name=name)
    

# @app.route('/games/details/<game_id>/<game_name>', strict_slashes=False)
# def game_details(game_id, game_name):
#     """ Render game details """

#     game = Game.search_by_id(game_id)

#     # Check if game already exists. If so, disable add to library button
#     library_id = session['library_id']
#     library_game = Library_game.search_by_game_id(library_id, game_id)
    
#     return render_template('game-details.html', game=game, 
#                            library_game=bool(library_game))


# @app.route('/library')
# def library():
#     """ Display user's library and their added games """

#     user = session['user_id']
#     library = Library.search_by_id(user)
#     library_games = Library_game.search_by_id(library.id)

#     for g in library_games:
#         game = Game.search_by_id(g.game_id)
#         g.game = game

#     return render_template('library.html', 
#                            library=library, 
#                            library_games=library_games)


# @app.route('/review/<lgame_id>')
# def review(lgame_id):
#     """ Display review of game """

#     review = Review.search_by_id(lgame_id)

#     return render_template('review.html', review=review)


# @app.route('/add-game', methods=['POST'])
# def add_game():
#     """ Add game to user's library """

#     library = Library.search_by_id(session.get('library_id'))
#     game = Game.search_by_id(request.json.get('game_id'))
#     library_game = Library_game.create(library, game)
#     review = Review.create(library_game)
    
#     if (library_game):
#         db.session.add_all([library_game, review])
#         db.session.commit()
#         return {
#             'success': True,
#             'msg': 'Hello'
#         }
#     else:
#         return {
#             'success': True,
#             'msg': 'Game already exists'
#         }


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)