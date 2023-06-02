from core import db
from flask import Blueprint, request, session
from . import Review

review_blueprint = Blueprint('review_blueprint', __name__, url_prefix='/review')

@review_blueprint.route('/<lgame_id>')
def review(lgame_id):
    """ Display review of game """

    r = Review.search_by_id(lgame_id)
    current_library_id = session.get('library_id')

    return {
        'review_id': r.id,
        'review': r.review,
        'game_id': r.library_game.game.id,
        'game': r.library_game.game.name,
        'background': r.library_game.game.background,
        'header_image': r.library_game.game.header_image,
        'score': r.score,
        'votes_up': r.votes_up,
        'owner_username': r.library_game.library.user.username,
        'owner': (r.library_game.library_id == current_library_id),
        'reviewed': r.reviewed,
        'user_id':r.library_game.library.user.id,
    }, 200


@review_blueprint.route('/edit/<id>')
def review_edit(id):
    """ Return review data for edit page """
    
    r = Review.search_by_id(id)
    current_library_id = session.get('library_id')
    
    return {
        'id': id,
        'review': r.review,
        'name': r.library_game.game.name,
        'votes_up': r.votes_up,
        'owner': (r.library_game.library_id == current_library_id),
        'reviewed': r.reviewed,
    }, 200


@review_blueprint.route('/update', methods=['POST'])
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


@review_blueprint.route('/delete', methods=['POST'])
def delete_review():
    """ Delete review, client should reroute to library """

    review_id = request.json.get('review_id')
    r = Review.search_by_id(review_id)
    lg = r.library_game

    db.session.delete(r)
    db.session.delete(lg)
    db.session.commit()

    return '', 204

@review_blueprint.route('/publish', methods=['POST'])
def publish():
    """ toggle publish status (bool) """
    
    review_id = request.json.get('review_id')
    print('REVIEWID', review_id)
    r = Review.search_by_id(review_id)

    r.reviewed = not r.reviewed
    db.session.commit()

    return { 'reviewed': r.reviewed }, 201

@review_blueprint.route('/vote', methods=["POST"])
def vote():
    """ Mark review of game up, down, or null """

    vote_status = request.json.get('vote')
    review_id = request.json.get('id')

    r = Review.set_vote(vote_status, review_id)
    db.session.commit()

    return { 'votes_up': r.votes_up }, 201