from flask import Blueprint
from .models import User

blueprint = Blueprint('ut', __name__, url_prefix='/ut')

@blueprint.route('/test')
def test():
    """ return something """

    return 'test success'

@blueprint.route('/')
def test_root():
    """ return something """

    return 'root success'