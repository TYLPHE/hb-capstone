from flask import Blueprint, session, request
from . import Game
from .. import library_game as lg

game_blueprint = Blueprint('game_blueprint', __name__, url_prefix='/games')

@game_blueprint.route('/<id>')
def game_details(id):
    """ Return game details """

    game = Game.search_by_id(id)
    if not game:
        return '', 400

    else:
        # Check if game already exists. If so, disable add to library button
        library_id = session.get('library_id')
        library_game = lg.Library_game.search_by_game_id(library_id, id)
        
        return {
            'name': game.name,
            'short_description': game.short_description,
            'header_image': game.header_image,
            'background': game.background,
            'release_date': game.release_date,
            'in_library': bool(library_game),
        }, 200


@game_blueprint.route('/search')
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
            'url': f'/games/{ result[0].id }/{ result[0].name.replace("/", "") }' 
        }, 200
    else: 
        return {
            'status': 'Error',
            'msg': 'Game not found.'
        }, 200


@game_blueprint.route('/random-games')
def random_games():
    """ return 6 random games """

    games = Game.random_games(10)
    response = []

    for game in games:
        response.append({
            'id': game.id,
            'name': game.name,
            'header_image': game.header_image,
        })

    return response, 200

@game_blueprint.route('/filter', methods=['POST'])
def filter():
    """ Query list of games based on filter """

    filters = request.json.get('filters')
    print('FILTERS', filters)
    if len(filters) == 0:
        return { 'games': [] }, 200
    
    games = Game.search_by_filters(filters)
    games_list = []
    for game in games:
        games_list.append({
            'id': game.id,
            'header_image': game.header_image,
            'name': game.name,
        })

    return { 'games': games_list }, 200