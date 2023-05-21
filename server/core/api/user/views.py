from core import db
from flask import Blueprint, session, request
from . import User
from .. import library as l

user_blueprint = Blueprint('user_blueprint', __name__, url_prefix='/user')

@user_blueprint.route('/initials')
def user_initials():
    """ Return user initials for header """

    fname = session.get('fname')
    lname = session.get('lname')

    initials = ''

    if (fname):
        initials += fname[0]
    if (lname):
        initials += lname[0]

    return initials.upper(), 200


@user_blueprint.route('/session-status')
def session_status():
    """ Checks if user session is defined """

    user_id = session.get('user_id')
    username = session.get('username')

    if not user_id:
        return '', 401
    else: 
        return { 'user_id': user_id, 'username': username.capitalize() }, 200


@user_blueprint.route('/signin', methods=['POST'])
def user_signin():
    """ Check if user exists. Set session if logged in """

    username = request.json.get('username')
    password = request.json.get('password')
    signin_ok = User.validate(username, password)

    if (signin_ok):
        library = l.Library.search_by_id(signin_ok.library.id)

        session['username'] = signin_ok.username
        session['user_id'] = signin_ok.id
        session['fname'] = signin_ok.fname
        session['lname'] = signin_ok.lname
        session['library_id'] = library.id
        
        return '', 200
    
    return 'Wrong account name or password.', 401

@user_blueprint.route('/register', methods=['POST'])
def user_register():
    """ Checks for user in db, then saves account to db """

    username = request.json.get('username')
    password = request.json.get('password')
    fname = request.json.get('fname')
    lname = request.json.get('lname')
    user_exists = User.exists(username)

    if (user_exists): 
        return 'Please enter a different account name.', 400
    else:
        # Create user and create user's library
        user = User.create(username, password, fname, lname)
        library = l.Library.create(user)
        db.session.add_all([user, library])
        db.session.commit()

        return f'"{ username }" created. Please sign in.', 201

@user_blueprint.route('/logout')
def log_out():
    """ Log user out """

    session.pop('user_id')
    session.pop('username')
    session.pop('library_id')

    return '', 200