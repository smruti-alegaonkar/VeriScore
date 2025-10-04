# address_verifier/routes.py
from flask import Blueprint, request, jsonify

# --- Imports for BOTH functionalities ---
from .parser import parse_full_address  # Your function for parsing
from .verifier import verify_address    # My function for verification

# Create a 'Blueprint' to organize all the routes
api = Blueprint('api', __name__)

# --- Route for PARSING an address into components ---
# NOTE: I've moved your original '/verify' route to '/parse' to avoid a conflict.
@api.route('/parse', methods=['POST'])
def parse_address_endpoint():
    """
    Takes a raw address string and returns its structured components.
    """
    data = request.get_json()
    if not data or 'address' not in data:
        return jsonify({"error": "Address not provided"}), 400

    raw_address = data['address']
    # Call your parser function from parser.py
    structured_data = parse_full_address(raw_address)
    return jsonify(structured_data)

# --- Route for VERIFYING a company at an address ---
# This is the endpoint your index.html file will call.
@api.route('/verify', methods=['POST'])
def verify_company_endpoint():
    """
    Takes a company name and address, and returns a confidence score.
    """
    user_ip = request.remote_addr
    data = request.get_json()

    if not data or "company_name" not in data or "address" not in data:
        return jsonify({"error": "Missing company_name or address in request body"}), 400

    company = data["company_name"]
    address = data["address"]
    
    # Call the verification logic from verifier.py
    result = verify_address(company, address, user_ip)
    
    return jsonify(result)

