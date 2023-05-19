from flask import request, session 
from core.model import *
from core import app, db

# Routes for React
@app.route('/api/session-status')
def session_status():
    """ Checks if user session is defined """

    user_id = session.get('user_id')
    username = session.get('username')

    if not user_id:
        return '', 401
    else: 
        return { 'user_id': user_id, 'username': username.capitalize() }, 200


@app.route('/api/signin', methods=['POST'])
def user_signin():
    """ Check if user exists. Set session if logged in """

    username = request.json.get('username')
    password = request.json.get('password')
    signin_ok = User.validate(username, password)

    if (signin_ok):
        library = Library.search_by_id(signin_ok.library.id)

        session['username'] = signin_ok.username
        session['user_id'] = signin_ok.id
        session['fname'] = signin_ok.fname
        session['lname'] = signin_ok.lname
        session['library_id'] = library.id
        
        return '', 200
    
    return 'Wrong account name or password.', 401


@app.route('/api/register', methods=['POST'])
def user_register():
    """ Checks for user in db, then saves account to db """

    username = request.json.get('username')
    password = request.json.get('password')
    fname = request.json.get('fname')
    lname = request.json.get('lname')
    user_exists = User.exists(username)

    if (user_exists): 
        return 'Please enter a different account name.', 400
    else:
        # Create user and create user's library
        user = User.create(username, password, fname, lname)
        library = Library.create(user)
        db.session.add_all([user, library])
        db.session.commit()

        return f'"{ username }" created. Please sign in.', 201


@app.route('/api/library')
def library_data():
    """ Display user's library and their added games """

    library_id = session.get('library_id')

    response = { 'library_games': [] }

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

        return response, 200
    
    else:
      return '', 401


@app.route('/api/games/<id>')
def game_details(id):
    """ Render game details """

    game = Game.search_by_id(id)

    if not game:
        return '', 400

    else:
        # Check if game already exists. If so, disable add to library button
        library_id = session.get('library_id')
        library_game = Library_game.search_by_game_id(library_id, id)
        
        return {
            'name': game.name,
            'short_description': game.short_description,
            'header_image': game.header_image,
            'background': game.background,
            'release_date': game.release_date,
            'in_library': bool(library_game),
        }, 200


@app.route('/api/add-game', methods=['POST'])
def add_game():
    """ Add game to user's library """

    library_id = session.get('library_id')
    library = Library.search_by_id(library_id)
    game_id = request.json.get('id')
    game = Game.search_by_id(game_id)
    library_game = Library_game.create(library, game)
    review = Review.create(library_game, f'# {game.name} Review')
    
    if (library_game):
        db.session.add_all([library_game, review])
        db.session.commit()
        return 'Added to library', 201
    else:
        return 'Game already exists', 400


@app.route('/api/review/<lgame_id>')
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
    }, 200


@app.route('/api/random-games')
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

    return response, 200


@app.route('/api/games/search')
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

        return response, 200
 
    elif (len(result) == 1):
        return {
            'status': 'Success', 
            'url': f'/games/{ result[0].id }/{ result[0].name }' 
        }, 200
    else: 
        return {
            'status': 'Error',
            'msg': 'Game not found.'
        }, 200


@app.route('/api/review/update', methods=['POST'])
def update_review():
    """ Find review by id and update database """

    id = request.json.get('id')
    review = request.json.get('review')

    r = Review.search_by_id(id)
    if (r): 
        r.review = review
        db.session.commit()
        return 'Update saved.', 201
    else:
        return 'Error saving review.', 400


@app.route('/api/review/edit/<id>')
def review_edit(id):
    """ Return review data for edit page """
    
    r = Review.search_by_id(id)
    
    return {
        'id': id,
        'review': r.review,
        'name': r.library_game.game.name,
        'score': r.score
    }, 200


@app.route('/app/review/delete', methods=['POST'])
def delete_review():
    """ Delete review, client should reroute to library """

    review_id = request.json.get('review_id')
    r = Review.search_by_id(review_id)
    lg = r.library_game

    db.session.delete(r)
    db.session.delete(lg)
    db.session.commit()

    return '', 204


@app.route('/api/logout')
def log_out():
    """ Log user out """

    session.pop('user_id')
    session.pop('username')
    session.pop('library_id')

    return '', 200


@app.route('/api/user/initials')
def user_initials():
    """ Return user initials for header """

    fname = session.get('fname')
    lname = session.get('lname')

    initials = ''

    if (fname):
        initials += fname[0]
    if (lname):
        initials += lname[0]

    return initials.upper(), 200


# Would need to change imports to make this work. 
# Use flask run in terminal instead
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', debug=True)