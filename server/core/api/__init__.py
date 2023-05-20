from flask import Blueprint
from core.api.user.views import user_blueprint
from core.api.library.views import library_blueprint

api_blueprint = Blueprint('api_blueprint', __name__, url_prefix='/api')
api_blueprint.register_blueprint(user_blueprint)
api_blueprint.register_blueprint(library_blueprint)
