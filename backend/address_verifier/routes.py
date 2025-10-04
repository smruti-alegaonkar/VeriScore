# address_verifier/routes.py
from flask import Blueprint, request, jsonify, current_app
import time
from .verifier import verify_address
from flask import send_file
from fpdf import FPDF
import io
# Add this at the top with the other imports if it's not there
from flask import jsonify 

api = Blueprint('api', __name__)

@api.route('/verify', methods=['POST'])
def verify_endpoint():
    user_ip = request.remote_addr
    data = request.get_json()

    if not data or "company_name" not in data or "address" not in data:
        return jsonify({"error": "Missing company_name or address"}), 400

    company = data["company_name"]
    address = data["address"]
    
    # 1. Call the verification logic from verifier.py
    result = verify_address(company, address, user_ip)
    
    # 2. Save the result for the dashboard
    score = result['confidence_score']
    result_to_save = {
        "id": len(current_app.verifications_db) + 1,
        "address": f"{company}, {address}",
        "status": "verified" if score >= 80 else "suspicious" if score >= 40 else "rejected",
        "confidence": score / 100.0,
        "timestamp": time.time()
    }
    current_app.verifications_db.append(result_to_save)
    result['id'] = result_to_save['id']

    # 3. Return the detailed verification result
    return jsonify(result)

@api.route('/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    db = current_app.verifications_db
    total = len(db)
    verified = sum(1 for v in db if v['status'] == 'verified')
    suspicious = sum(1 for v in db if v['status'] == 'suspicious')
    rejected = sum(1 for v in db if v['status'] == 'rejected')
    rate = (verified / total * 100) if total > 0 else 0
    
    recent = sorted(db, key=lambda x: x['timestamp'], reverse=True)[:5]

    stats = {
        "total_verifications": total, "verified_count": verified,
        "suspicious_count": suspicious, "rejected_count": rejected,
        "verification_rate": rate, "recent_verifications": recent
    }
    return jsonify(stats)

@api.route('/get-report/<int:verification_id>', methods=['GET'])
def get_verification_report(verification_id):
    # Find the verification result in our "database"
    verification = next((item for item in current_app.verifications_db if item["id"] == verification_id), None)

    if not verification:
        return jsonify({"error": "Verification not found"}), 404

    # --- PDF Generation Logic ---
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    
    # Title
    pdf.cell(0, 10, "Verification Report", ln=True, align='C')
    pdf.ln(10)

    # Main Details
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 10, f"Company: {verification.get('address').split(',')[0]}", ln=True)
    pdf.set_font("Helvetica", "", 12)
    pdf.multi_cell(0, 10, f"Address: {verification.get('address')}")
    pdf.ln(5)

    # Confidence Score
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 10, f"Final Confidence Score: {int(verification.get('confidence') * 100)}%", ln=True)
    pdf.ln(10)
    
    # For a full report, you'd add the 'findings' breakdown here
    # This is a great place to expand if you have time.

    # --- Create a downloadable file in memory ---
    pdf_bytes = pdf.output(dest='S').encode('latin-1')
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'VeriScore_Report_{verification_id}.pdf'
    )

# Add this new function with the other @api.route definitions
@api.route('/')
def index():
    return jsonify({"status": "ok", "message": "VeriScore API is running!"})