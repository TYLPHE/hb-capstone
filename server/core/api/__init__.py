from flask import Blueprint
from core.api.user.views import user_blueprint
from core.api.library.views import library_blueprint
from core.api.review.views import review_blueprint
from core.api.library_game.views import library_game_blueprint
from core.api.game.views import game_blueprint

api_blueprint = Blueprint('api_blueprint', __name__, url_prefix='/api')
api_blueprint.register_blueprint(user_blueprint)
api_blueprint.register_blueprint(library_blueprint)
api_blueprint.register_blueprint(review_blueprint)
api_blueprint.register_blueprint(library_game_blueprint)
api_blueprint.register_blueprint(game_blueprint)
