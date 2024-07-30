#!/usr/bin/env python3
"""Method to setup a basic flask app with babel"""

from flask import Flask, render_template, request
from flask_babel import Babel


class Config():
    """Class to store available languages"""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Function to select a locale"""

    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def welcome():
    """Route to output the welcome template"""

    return render_template('0-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
