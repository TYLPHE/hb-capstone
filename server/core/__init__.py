from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session

app = Flask(__name__)
app.config.from_object(Config)
app.app_context().push()
db = SQLAlchemy(app)
Session(app)

from .api import api_blueprint
app.register_blueprint(api_blueprint)

# Import all models (add to the module cache) for relationship() to work
from .api import (
    developer, 
    game,
    games_developer,
    games_genre,
    games_publisher,
    genre,
    library,
    library_game,
    movie,
    publisher,
    review,
    screenshot, 
    user, 
)

print(f'Connected to server!')