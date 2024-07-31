#!/usr/bin/env python3
"""Method to setup a basic flask app with babel and some templates
and forcing the locale with a parameter"""

from flask import Flask, render_template, request, g
from flask_babel import Babel, gettext


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config():
    """Class to store available languages"""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Function to select a locale"""

    locale = request.args.get("locale")
    user = g.user
    header = request.headers.get("locale")
    if locale in app.config['LANGUAGES']:
        return locale
    elif user and user.get('locale') in app.config['LANGUAGES']:
        return user['locale']
    elif header  in app.config['LANGUAGES']:
        return header
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def welcome():
    """Route to output the welcome template"""
    if g.user:
        return render_template('5-index.html', user=g.user)
    return render_template('5-index.html', user=None)


def get_user():
    """Function to return a user dict else none if id cant be found
    or if it wasn't passed"""

    id = request.args.get("login_as")
    if id:
        return users.get(int(id))
    return None


@app.before_request
def before_request():
    """To be executed before all others, to use get_user to find a
    user if any and set it as a global on flask.g.user"""

    g.user = get_user()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
