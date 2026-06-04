from flask import Flask, render_template, jsonify, request
import threading
import time
from flask_cors import CORS

from src.sensors import KinematicsFilter
from src.triage import VoiceTriageEngine
from src.locator import find_nearest_hospital

app = Flask(__name__)
CORS(app)

# Initialize global engines
kinematics = KinematicsFilter(sample_rate=50, window_ms=120)
triage = VoiceTriageEngine()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/status')
def status():
    return jsonify({
        "state": triage.current_state,
        "transcript": triage.transcript
    })

@app.route('/reset', methods=['POST'])
def reset():
    triage.current_state = "IDLE"
    triage.transcript = ""
    return jsonify({"status": "Reset successful"})

@app.route('/simulate', methods=['POST'])
def simulate():
    # Backend no longer processes the voice/audio. 
    # This is handled exclusively by the mobile browser now.
    return jsonify({"status": "Frontend handles simulation"})

from src.telephony import trigger_emergency_calls

def backend_reverse_geocode(lat, lon):
    import os
    import urllib.request
    import json
    
    # 1. Try Google Maps Geocoding API first
    google_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if google_key:
        try:
            url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lon}&key={google_key}"
            req = urllib.request.Request(url, headers={'User-Agent': 'ResQNetApp'})
            with urllib.request.urlopen(req, timeout=5) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                if res_data.get('status') == 'OK' and res_data.get('results'):
                    formatted = res_data['results'][0]['formatted_address']
                    print(f"[GEOCODE] Google Maps Success: {formatted}")
                    return formatted
                else:
                    print(f"[GEOCODE] Google Maps Failed: {res_data.get('status')} - {res_data.get('error_message', '')}")
        except Exception as e:
            print(f"[GEOCODE] Google Maps Exception: {e}")

    # 2. Fallback to OpenStreetMap (Nominatim)
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={lat}&lon={lon}"
        req = urllib.request.Request(url, headers={'User-Agent': 'ResQNetApp'})
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            if 'address' in res_data:
                addr = res_data['address']
                parts = []
                for field in ['building', 'house_number', 'road', 'neighbourhood', 'suburb', 'town', 'city', 'state']:
                    val = addr.get(field)
                    if val and val not in parts:
                        parts.append(val)
                if parts:
                    formatted = ", ".join(parts)
                    print(f"[GEOCODE] Nominatim Success: {formatted}")
                    return formatted
                elif 'display_name' in res_data:
                    return res_data['display_name']
    except Exception as e:
        print(f"[GEOCODE] Nominatim Exception: {e}")

    return f"Latitude {lat}, Longitude {lon}"

@app.route('/api/nearest_hospital', methods=['POST'])
def nearest_hospital():
    data = request.json
    lat = data.get('lat')
    lon = data.get('lon')
    if lat is None or lon is None:
        return jsonify({"error": "Missing lat or lon"}), 400
    
    hospitals = find_nearest_hospital(float(lat), float(lon))
    if not hospitals:
        return jsonify({"error": "No hospitals found"}), 404

    primary_hospital = hospitals[0]

    # Resolve address using Google Maps / Nominatim on backend
    resolved_address = backend_reverse_geocode(lat, lon)
    primary_hospital['user_address'] = resolved_address
        
    # Trigger Twilio voice calls in the background
    trigger_emergency_calls(
        hospital_phone=primary_hospital.get('phone'),
        hospital_name=primary_hospital.get('name'),
        lat=lat,
        lon=lon,
        address=resolved_address
    )
    
    return jsonify({
        "primary": primary_hospital,
        "nearby": hospitals
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)
