from flask import Flask, request, session
from model import *
from jinja2 import StrictUndefined
from flask_session import Session
from flask_cors import CORS
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

    if not user_id:
        return { 'user_id': None }
    else: 
        return { 'user_id': user_id, 'username': username.capitalize() }


@app.route('/user-login', methods=['POST'])
def user_login():
    """ Check if user exists. Set session if logged in """

    username = request.json.get('username')
    password = request.json.get('password')
    login_ok = User.validate(username, password)

    if (login_ok):
        library = Library.search_by_id(login_ok.library.id)

        session['username'] = login_ok.username
        session['user_id'] = login_ok.id
        session['fname'] = login_ok.fname
        session['lname'] = login_ok.lname
        session['library_id'] = library.id
        
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

    library_id = session.get('library_id')

    response = {
        'status': 'Success',
        'library_games': [],
        }

    library = Library.search_by_id(library_id)

    if (library != None):
        response['library_name'] = library.name.capitalize()
        library_games = Library_game.search_by_id(library.id)
        
        for game in library_games:
            # Query for game details to add to library
            game_data = Game.search_by_id(game.game_id)

            game_dict = {
                'library_game_id': game.id,
                'game_id': game_data.id,
                'game_name': game_data.name,
                'game_header_image': game_data.header_image,
            }
            
            response['library_games'].append(game_dict)

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
        # Check if game already exists. If so, disable add to library button
        library_id = session.get('library_id')
        library_game = Library_game.search_by_game_id(library_id, game_id)
       
        return {
            'status': 'Success',
            'name': game.name,
            'short_description': game.short_description,
            'header_image': game.header_image,
            'background': game.background,
            'release_date': game.release_date,
            'in_library': bool(library_game),
        }   


@app.route('/add-game', methods=['POST'])
def add_game():
    """ Add game to user's library """

    library = Library.search_by_id(session.get('library_id'))
    game = Game.search_by_id(request.json.get('id'))
    library_game = Library_game.create(library, game)
    review = Review.create(library_game, f'# {game.name} Review')
    
    if (library_game):
        db.session.add_all([library_game, review])
        db.session.commit()
        return { 'status': 'Success' }
    else:
        return { 'status': 'Error', 'msg': 'Game already exists' }


@app.route('/review-data/<lgame_id>')
def review(lgame_id):
    """ Display review of game """

    review = Review.search_by_id(lgame_id)

    return {
        'review_id': review.id,
        'review': review.review,
        'game_id': review.library_game.game.id,
        'game': review.library_game.game.name,
        'header_image': review.library_game.game.header_image,
        'score': review.score,
        'votes_up': review.votes_up,
    }


@app.route('/random-games')
def random_games():
    """ Find top 10 games and render page """

    games = Game.random_games()
    response = []

    for game in games:
        response.append({
            'id': game.id,
            'name': game.name,
            'header_image': game.header_image,
        })

    return response


@app.route('/game-search')
def search():
    """ search for game and render details """

    name = request.args.get('search')
    result = Game.search_by_name(name)
    
    if (len(result) > 1):
        response = []
        
        for game in result:
            response.append({
                'id': game.id,
                'name': game.name,
                'header_image': game.header_image,
                'short_description': game.short_description
            })

        return response
    
    elif (len(result) == 1):
        return {
            'status': 'Success', 
            'url': f'/games/details/{ result[0].id }/{ result[0].name }' 
        }
    else: 
        return {
            'status': 'Error',
            'msg': 'Game not found.'
        }


@app.route('/update-review', methods=['POST'])
def update_review():
    """ Find review by id and update database """

    id = request.json.get('id')
    review = request.json.get('review')

    r = Review.search_by_id(id)
    if (r): 
        r.review = review
        db.session.commit()
        return {
            'status': 'Success',
            'msg': 'Update saved.',
        }
    else:
        return {
            'status': 'Error',
            'msg': 'Error saving review.'
        }


@app.route('/review-edit')
def review_edit():
    """ Return review data for edit page """
    
    id = request.args.get('id')
    r = Review.search_by_id(id)
    
    return {
        'id': id,
        'review': r.review,
        'name': r.library_game.game.name,
        'score': r.score
    }

@app.route('/delete-review', methods=['POST'])
def delete_review():
    """ Delete review, client should reroute to library """

    review_id = request.json.get('review_id')
    r = Review.search_by_id(review_id)
    lg = r.library_game

    db.session.delete(r)
    db.session.delete(lg)
    db.session.commit()

    return { 'status': 'Success' }


@app.route('/log-out')
def log_out():
    """ Log user out """

    session.pop('user_id')
    session.pop('username')
    session.pop('library_id')

    return { 'status': 'Success' }


@app.route('/user-initials')
def user_initials():
    """ Return user initials for header """

    fname = session.get('fname')
    lname = session.get('lname')

    initials = ''

    if (fname):
        initials += fname[0]
    if (lname):
        initials += lname[0]

    return { 'initials': initials.upper() }

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)