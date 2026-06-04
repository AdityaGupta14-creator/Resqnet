import duckdb
from math import radians, sin, cos, sqrt, asin
import os

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = (sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2)
    return 2 * R * asin(sqrt(a))

def find_nearest_hospital(user_lat, user_lon):
    # Connect to the DuckDB database (located in the database/ folder relative to project root)
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "hospitals.duckdb")
    
    con = duckdb.connect(db_path)
    
    try:
        hospitals = con.execute("""
        SELECT name, country, latitude, longitude, phone
        FROM hospitals
        WHERE latitude IS NOT NULL
        AND longitude IS NOT NULL
        """).fetchall()
        
        results = []
        for name, country, lat, lon, phone in hospitals:
            try:
                lat_float = float(lat)
                lon_float = float(lon)
            except ValueError:
                continue

            distance = haversine(user_lat, user_lon, lat_float, lon_float)
            
            results.append({
                "name": name,
                "distance_km": round(distance, 2),
                "country": country,
                "phone": phone,
                "latitude": lat_float,
                "longitude": lon_float
            })
            
        results.sort(key=lambda x: x["distance_km"])
        
        return results[:5] if results else []
    finally:
        con.close()
