"""
CarbMine — Carbon Footprint Assessment System for Indian Coal Mines
Backend: Flask API for emission calculations, data ingestion, and reporting.
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
import os
from dotenv import load_dotenv

from emission_factors import calculate_scope1, calculate_scope2, calculate_scope3
from report_generator import generate_pdf_report

load_dotenv()

app = Flask(__name__)
CORS(app)

# ─── Health Check ────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "CarbMine API running", "version": "1.0.0"})


# ─── Emission Calculation ────────────────────────────────────────
@app.route("/api/calculate", methods=["POST"])
def calculate():
    """
    Accept emission inputs (coal production, electricity, transport)
    and return Scope 1, 2, 3 totals in tonnes CO2e.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        scope1 = calculate_scope1(
            coal_extracted_tonnes=data.get("coal_extracted", 0),
            methane_vented_m3=data.get("methane_vented", 0),
            diesel_litres=data.get("diesel_used", 0),
            explosives_kg=data.get("explosives_used", 0),
        )
        scope2 = calculate_scope2(
            electricity_kwh=data.get("electricity_kwh", 0),
            grid_region=data.get("grid_region", "national"),
        )
        scope3 = calculate_scope3(
            coal_transported_tkm=data.get("coal_transported_tkm", 0),
            coal_combustion_tonnes=data.get("coal_combustion_tonnes", 0),
        )

        total = scope1["total"] + scope2["total"] + scope3["total"]

        return jsonify({
            "scope1": scope1,
            "scope2": scope2,
            "scope3": scope3,
            "total_co2e_tonnes": round(total, 4),
            "unit": "tonnes CO2e",
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── CSV / Excel Upload ──────────────────────────────────────────
@app.route("/api/upload", methods=["POST"])
def upload():
    """
    Accept a CSV or Excel file with emission input columns.
    Returns row-by-row calculated emissions.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file)
        elif filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file)
        else:
            return jsonify({"error": "Only CSV and Excel files are supported"}), 400

        required_cols = ["coal_extracted", "electricity_kwh", "diesel_used"]
        missing = [c for c in required_cols if c not in df.columns]
        if missing:
            return jsonify({"error": f"Missing columns: {missing}"}), 400

        results = []
        for _, row in df.iterrows():
            s1 = calculate_scope1(
                coal_extracted_tonnes=row.get("coal_extracted", 0),
                methane_vented_m3=row.get("methane_vented", 0),
                diesel_litres=row.get("diesel_used", 0),
                explosives_kg=row.get("explosives_used", 0),
            )
            s2 = calculate_scope2(electricity_kwh=row.get("electricity_kwh", 0))
            s3 = calculate_scope3(
                coal_transported_tkm=row.get("coal_transported_tkm", 0),
                coal_combustion_tonnes=row.get("coal_combustion_tonnes", 0),
            )
            results.append({
                **row.to_dict(),
                "scope1_co2e": s1["total"],
                "scope2_co2e": s2["total"],
                "scope3_co2e": s3["total"],
                "total_co2e": round(s1["total"] + s2["total"] + s3["total"], 4),
            })

        return jsonify({"rows": len(results), "data": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── PDF Report ──────────────────────────────────────────────────
@app.route("/api/report", methods=["POST"])
def report():
    """Generate a PDF sustainability report from emission data."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        pdf_bytes = generate_pdf_report(data)
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name="CarbMine_Emission_Report.pdf",
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Historical Trends ───────────────────────────────────────────
@app.route("/api/trends", methods=["GET"])
def trends():
    """
    Return mock historical emission data for dashboard charts.
    Replace with real DB queries once connected.
    """
    mock_data = [
        {"month": "Jan 2024", "scope1": 1200, "scope2": 340, "scope3": 890},
        {"month": "Feb 2024", "scope1": 1150, "scope2": 320, "scope3": 870},
        {"month": "Mar 2024", "scope1": 1300, "scope2": 360, "scope3": 920},
        {"month": "Apr 2024", "scope1": 1100, "scope2": 310, "scope3": 850},
        {"month": "May 2024", "scope1": 1050, "scope2": 295, "scope3": 810},
        {"month": "Jun 2024", "scope1": 980,  "scope2": 280, "scope3": 790},
    ]
    return jsonify(mock_data)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=os.getenv("FLASK_ENV") == "development", host="0.0.0.0", port=port)
