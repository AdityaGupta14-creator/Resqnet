import csv
import json
import os

CSV_PATH = 'hospitals.csv'
JSON_OUT_PATH = '../frontend/assets/hospitals_lite.json'

def generate_lite_db():
    print(f"Reading {CSV_PATH}...")
    hospitals = []
    
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader) # Name,Country,Latitude,Longitude,Phone
        
        for row in reader:
            if len(row) < 5:
                continue
            
            name = row[0].strip()
            try:
                lat = float(row[2])
                lon = float(row[3])
            except ValueError:
                continue
            
            phone = row[4].strip()
            if phone == '0':
                phone = '+91-522-6788888' # default emergency fallback for missing phones
            
            # Array format for ultra-compact JSON: [name, lat, lon, phone]
            hospitals.append([name, lat, lon, phone])
            
    # Ensure assets dir exists
    os.makedirs(os.path.dirname(JSON_OUT_PATH), exist_ok=True)
    
    print(f"Writing {len(hospitals)} records to {JSON_OUT_PATH}...")
    with open(JSON_OUT_PATH, 'w', encoding='utf-8') as f:
        # separators=(',', ':') removes whitespace for minimum file size
        json.dump(hospitals, f, separators=(',', ':'))
        
    print(f"Done! File size: {os.path.getsize(JSON_OUT_PATH) / 1024 / 1024:.2f} MB")

if __name__ == '__main__':
    generate_lite_db()
