from core import db
from flask import Blueprint, session, request
from . import Follow

follow_blueprint = Blueprint('follow_blueprint', __name__, url_prefix='/follow')

@follow_blueprint.route('/add', methods=['POST'])
def add():
    """ Add a follow from user to library """

    user_id = session.get('user_id')
    library_id = request.json.get('library_id')

    follow = Follow.create(user_id, library_id)

    db.session.add(follow)
    db.session.commit()

    return '', 201


@follow_blueprint.route('/delete', methods=['POST'])
def delete():
    """ Add a follow from user to library """

    user_id = session.get('user_id')
    library_id = request.json.get('library_id')

    follow = Follow.search_by_id(user_id, library_id)
    
    db.session.delete(follow)
    db.session.commit()

    return '', 204


@follow_blueprint.route('/all')
def all():
    """ returns followers/following and respective counts """

    user_id = session.get('user_id')
    library_id = session.get('library_id')

    following = Follow.following(user_id, library_id)
    followers = Follow.followers(user_id, library_id)

    response = {
        'following': {
            'count': following.get('count'),
            'users': [],
        },
        'followers': {
            'count': followers.get('count'),
            'users': [],
        },
    }

    for user in following.get('following'):
        users = response['following'].get('users')

        users.append({
            'user_name': user.library.user.username,
            'library_id': user.library_id,
        })
    
    for user in followers.get('followers'):
        users = response['followers'].get('users')
        users.append({
            'user_id': user.user_id,
            'user_name': user.user.username,
            'library_id': user.user.library.id,
        })
    
    return response, 200

   
@follow_blueprint.route('/random-review')
def random_review():
    """ return a random review """

    user_id = session.get('user_id')

    lg = Follow.random_library_game(user_id)
    
    return {
        'random_review': {
            'library_id': lg.library_id,
            'library_game_id': lg.id,
            'review_id': lg.review.id,
            'username': lg.library.user.username,
            'game_name': lg.game.name,
            'game_background': lg.game.background,
            'game_header_image': lg.game.header_image,
        }
    }, 200

