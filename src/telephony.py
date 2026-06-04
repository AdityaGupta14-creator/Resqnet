import os
import threading
from dotenv import load_dotenv

load_dotenv()

def place_call(to_number, message, twilio_client, twilio_number):
    try:
        if twilio_client:
            # Create TwiML using Twilio's verb
            twiml = f'<Response><Say voice="alice">{message}</Say></Response>'
            call = twilio_client.calls.create(
                twiml=twiml,
                to=to_number,
                from_=twilio_number
            )
            print(f"[TELEPHONY] Successfully initiated call to {to_number}. Call SID: {call.sid}")
        else:
            print(f"\n==============================================")
            print(f"[MOCK CALL] Would be ringing {to_number}")
            print(f"[MOCK CALL] Message: {message}")
            print(f"==============================================\n")
    except Exception as e:
        print(f"[TELEPHONY ERROR] Failed to call {to_number}: {str(e)}")

def trigger_emergency_calls(hospital_phone, hospital_name, lat, lon, address=None):
    """
    Spawns background threads to call the nearest hospital and user's emergency contacts.
    """
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    twilio_number = os.getenv('TWILIO_PHONE_NUMBER')
    test_numbers_str = os.getenv('TEST_EMERGENCY_NUMBERS', '')
    
    # Initialize Twilio Client if credentials exist
    client = None
    if account_sid and auth_token and twilio_number:
        try:
            from twilio.rest import Client
            client = Client(account_sid, auth_token)
        except Exception as e:
            print(f"[TELEPHONY ERROR] Could not initialize Twilio client: {str(e)}")

    location_name = address if address else f"Latitude {lat}, Longitude {lon}"
    
    if not address:
        try:
            from geopy.geocoders import Nominatim
            geolocator = Nominatim(user_agent="ackballe_sos_app")
            # zoom=18 requests building/street level detail specifically
            location = geolocator.reverse(f"{lat}, {lon}", zoom=18)
            if location and location.raw and 'address' in location.raw:
                addr = location.raw['address']
                parts = []
                if 'building' in addr: parts.append(addr['building'])
                if 'house_number' in addr: parts.append(addr['house_number'])
                if 'road' in addr: parts.append(addr['road'])
                if 'highway' in addr: parts.append(addr['highway'])
                if 'path' in addr: parts.append(addr['path'])
                if 'pedestrian' in addr: parts.append(addr['pedestrian'])
                
                if 'neighbourhood' in addr: parts.append(addr['neighbourhood'])
                if 'suburb' in addr: parts.append(addr['suburb'])
                if 'residential' in addr: parts.append(addr['residential'])
                if 'town' in addr: parts.append(addr['town'])
                if 'village' in addr: parts.append(addr['village'])
                if 'county' in addr: parts.append(addr['county'])
                
                if 'city' in addr and addr['city'] not in parts: parts.append(addr['city'])
                
                if parts:
                    # Remove duplicates
                    unique_parts = []
                    for p in parts:
                        if p not in unique_parts:
                            unique_parts.append(p)
                    location_name = ", ".join(unique_parts)
                else:
                    location_name = location.address
        except Exception as e:
            print(f"[TELEPHONY WARNING] Reverse geocoding failed: {str(e)}")

    message = (
        f"Aapatkaleen soochana. Ek accident detect hua hai. "
        f"User ko madad ki zaroorat hai. Unki location hai: {location_name}. "
        f"Kripya turant madad bhejein."
    )

    # Collect numbers to call
    numbers_to_call = []
    
    # 1. Add nearest hospital if it has a valid number
    if hospital_phone and hospital_phone != "Not available":
        numbers_to_call.append(hospital_phone)
        
    # 2. Add test numbers provided in .env
    if test_numbers_str:
        contacts = [n.strip() for n in test_numbers_str.split(',') if n.strip()]
        numbers_to_call.extend(contacts)

    if not numbers_to_call:
        print("[TELEPHONY] No phone numbers available to call.")
        return

    # Remove duplicates
    numbers_to_call = list(set(numbers_to_call))
    
    print(f"[TELEPHONY] Initiating emergency calls to: {', '.join(numbers_to_call)}")

    # Launch calls in parallel threads so it doesn't block the backend
    for number in numbers_to_call:
        def place_call(to_number, msg, twilio_client, twilio_num):
            try:
                if twilio_client:
                    twiml = f'<Response><Say language="hi-IN" voice="Polly.Aditi">{msg}</Say></Response>'
                    call = twilio_client.calls.create(
                        twiml=twiml,
                        to=to_number,
                        from_=twilio_num
                    )
                    print(f"[TELEPHONY] Call initiated to {to_number}. SID: {call.sid}")
            except Exception as e:
                print(f"[TELEPHONY ERROR] Failed to call {to_number}: {str(e)}")
        
        t = threading.Thread(target=place_call, args=(number, message, client, twilio_number))
        t.start()
