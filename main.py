import duckdb
from math import radians, sin, cos, sqrt, asin

# Haversine Formula
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in KM

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * asin(sqrt(a))

    return R * c


# Demo GPS Location (Panvel)
user_lat = 19.033
user_lon = 73.029

# Connect Database
con = duckdb.connect("hospitals.db")

# Fetch Hospitals
hospitals = con.execute("""
SELECT name, latitude, longitude, phone
FROM hospitals
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
""").fetchall()

print("Hospitals loaded:", len(hospitals))

best_distance = float("inf")
nearest_hospital = None
nearest_phone = None

for hospital in hospitals:
    try:
        name = hospital[0]
        lat = float(hospital[1])
        lon = float(hospital[2])
        phone = hospital[3]

        distance = haversine(
            user_lat,
            user_lon,
            lat,
            lon
        )

        if distance < best_distance:
            best_distance = distance
            nearest_hospital = name
            nearest_phone = phone

    except:
        continue

print("\n===== NEAREST HOSPITAL =====")
print("Hospital :", nearest_hospital)
print("Distance :", round(best_distance, 2), "km")
print("Phone    :", nearest_phone)