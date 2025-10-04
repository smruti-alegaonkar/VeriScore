# address_verifier/__init__.py
from flask import Flask, jsonify  # <-- Make sure jsonify is imported here
from flask_cors import CORS
from dotenv import load_dotenv

def create_app():
    # 1. Load environment variables from .env file FIRST.
    load_dotenv() 
    
    app = Flask(__name__)
    CORS(app)

    # 2. Initialize your in-memory "database"
    app.verifications_db = []

    # 3. Import and register your API routes under the /api prefix
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    ## --- NEW CODE STARTS HERE --- ##

    # 4. Define a simple route for the server's root URL
    @app.route('/')
    def index():
        # This message will now appear at http://127.0.0.1:5000/
        return jsonify({"status": "ok", "message": "VeriScore API is running!"})
        
    ## --- NEW CODE ENDS HERE --- ##

    return app