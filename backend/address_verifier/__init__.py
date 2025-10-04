# address_verifier/__init__.py
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

def create_app():
    # 1. Load environment variables from .env file FIRST.
    load_dotenv() 
    
    app = Flask(__name__)
    CORS(app)

    # 2. Initialize your in-memory "database"
    app.verifications_db = []

    # 3. NOW it is safe to import and register your routes,
    # because the API keys have been loaded into the environment.
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app