from flask import Blueprint
from .user.views import user_blueprint
from .library.views import library_blueprint
from .review.views import review_blueprint
from .library_game.views import library_game_blueprint
from .game.views import game_blueprint

api_blueprint = Blueprint('api_blueprint', __name__, url_prefix='/api')
api_blueprint.register_blueprint(user_blueprint)
api_blueprint.register_blueprint(library_blueprint)
api_blueprint.register_blueprint(review_blueprint)
api_blueprint.register_blueprint(library_game_blueprint)
api_blueprint.register_blueprint(game_blueprint)
