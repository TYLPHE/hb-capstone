from core import db
from flask import Blueprint, session, request
from . import models as f

follow_blueprint = Blueprint('follow_blueprint', __name__, url_prefix='/follow')

@follow_blueprint.route('/add', methods=['POST'])
def add():
    """ Add a follow from user to library """

    user_id = session.get('user_id')
    library_id = request.json.get('library_id')

    follow = f.Follow.create(user_id, library_id)

    db.session.add(follow)
    db.session.commit()

    return '', 201


@follow_blueprint.route('/delete', methods=['POST'])
def delete():
    """ Add a follow from user to library """

    user_id = session.get('user_id')
    library_id = request.json.get('library_id')

    follow = f.Follow.search_by_id(user_id, library_id)
    
    db.session.delete(follow)
    db.session.commit()

    return '', 204