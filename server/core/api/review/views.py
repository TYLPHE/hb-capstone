from core import db
from flask import Blueprint, request
from .models import Review

review_blueprint = Blueprint('review_blueprint', __name__, url_prefix='/review')

@review_blueprint.route('/<lgame_id>')
def review(lgame_id):
    """ Display review of game """

    review = Review.search_by_id(lgame_id)

    return {
        'review_id': review.id,
        'review': review.review,
        'game_id': review.library_game.game.id,
        'game': review.library_game.game.name,
        'header_image': review.library_game.game.header_image,
        'score': review.score,
        'votes_up': review.votes_up,
    }, 200


@review_blueprint.route('/edit/<id>')
def review_edit(id):
    """ Return review data for edit page """
    
    r = Review.search_by_id(id)
    
    return {
        'id': id,
        'review': r.review,
        'name': r.library_game.game.name,
        'score': r.score
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

