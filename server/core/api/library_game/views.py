from core import db
from flask import Blueprint, session, request
from . import Library_game
from .. import library as l
from .. import game as g
from .. import review as r

library_game_blueprint = Blueprint('library_game_blueprint', __name__, url_prefix='/library-game')

@library_game_blueprint.route('/add', methods=['POST'])
def add_game():
    """ Add game to user's library """

    library_id = session.get('library_id')
    library = l.Library.search_by_id(library_id)
    game_id = request.json.get('id')
    game = g.Game.search_by_id(game_id)
    library_game = Library_game.create(library, game)
    review = r.Review.create(library_game)
    
    if (library_game):
        db.session.add_all([library_game, review])
        db.session.commit()
        return 'Added to library', 201
    else:
        return 'Game already exists', 400
    
@library_game_blueprint.route('/to-add-review')
def to_add_review():
    """ search game by game_id and return a link to its review page """

    game_id = request.args.get('game_id')
    library_id = session.get('library_id')
    library_game = Library_game.search_by_game_id(library_id, game_id)

    return f'/review/{library_game.id}', 200

