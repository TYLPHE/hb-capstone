from flask import Blueprint, session
from . import Library
from .. import library_game as lg
from .. import game as g

library_blueprint = Blueprint('library_blueprint', __name__, url_prefix='/library')

@library_blueprint.route('/data')
def library_data():
    """ Display user's library and their added games """

    library_id = session.get('library_id')

    response = { 'library_games': [] }

    library = Library.search_by_id(library_id)

    if (library != None):
        response['library_name'] = library.name.capitalize()
        library_games = lg.Library_game.search_by_id(library.id)
        
        for game in library_games:
            # Query for game details to add to library
            game_data = g.Game.search_by_id(game.game_id)

            game_dict = {
                'library_game_id': game.id,
                'game_id': game_data.id,
                'game_name': game_data.name,
                'game_header_image': game_data.header_image,
                'game_background': game_data.background,
            }
            
            response['library_games'].append(game_dict)

        return response, 200
    
    else:
      return '', 401