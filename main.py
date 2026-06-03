import duckdb
from math import radians, sin, cos, sqrt, asin

def haversine(lat1, lon1, lat2, lon2):
    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    return 2 * R * asin(sqrt(a))


# User GPS Location
user_lat = 19.033
user_lon = 73.029

con = duckdb.connect("hospitals.duckdb")

hospitals = con.execute("""
SELECT name, country, latitude, longitude, phone
FROM hospitals
WHERE latitude IS NOT NULL
AND longitude IS NOT NULL
""").fetchall()

results = []

for name, country, lat, lon, phone in hospitals:

    distance = haversine(
        user_lat,
        user_lon,
        float(lat),
        float(lon)
    )

    results.append(
        (distance, name, country, lat, lon, phone)
    )

# Sort by distance
results.sort(key=lambda x: x[0])

print("\n===== TOP 5 NEAREST HOSPITALS =====\n")

for i, hospital in enumerate(results[:5], start=1):

    distance, name, country, lat, lon, phone = hospital

    print(f"{i}. {name}")
    print(f"   Distance : {round(distance,2)} km")
    print(f"   Country  : {country}")
    print(f"   Latitude : {lat}")
    print(f"   Longitude: {lon}")
    print(f"   Phone    : {phone}")
    print()