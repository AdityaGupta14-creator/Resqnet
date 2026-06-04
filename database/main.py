import duckdb
from math import radians, sin, cos, sqrt, asin

# Haversine Formula
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

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


# -----------------------------
# USER LOCATION (Replace later with GPS)
# -----------------------------
user_lat = 19.033
user_lon = 73.029

# -----------------------------
# CONNECT DATABASE
# -----------------------------
con = duckdb.connect("hospitals.duckdb")

hospitals = con.execute("""
SELECT
    name,
    country,
    latitude,
    longitude,
    phone
FROM hospitals
WHERE latitude IS NOT NULL
AND longitude IS NOT NULL
""").fetchall()

results = []

# -----------------------------
# CALCULATE DISTANCES
# -----------------------------
for hospital in hospitals:

    name = hospital[0]
    country = hospital[1]
    lat = float(hospital[2])
    lon = float(hospital[3])
    phone = hospital[4]

    distance = haversine(
        user_lat,
        user_lon,
        lat,
        lon
    )

    results.append(
        (
            distance,
            name,
            country,
            lat,
            lon,
            phone
        )
    )

# -----------------------------
# SORT BY DISTANCE
# -----------------------------
results.sort(key=lambda x: x[0])

# -----------------------------
# DISPLAY TOP 5
# -----------------------------
print("\n===== TOP 5 NEAREST HOSPITALS =====\n")

for i, hospital in enumerate(results[:5], start=1):

    distance, name, country, lat, lon, phone = hospital

    print(f"{i}. {name}")
    print(f"   Distance : {round(distance, 2)} km")
    print(f"   Country  : {country}")
    print(f"   Latitude : {lat}")
    print(f"   Longitude: {lon}")
    print(f"   Phone    : {phone}")
    print()