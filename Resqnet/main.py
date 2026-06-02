import duckdb
from math import radians, sin, cos, sqrt, asin

def haversine(lat1, lon1, lat2, lon2):
    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat/2)**2 + \
        cos(radians(lat1)) * cos(radians(lat2)) * \
        sin(dlon/2)**2

    return 2 * R * asin(sqrt(a))

user_lat = 19.033
user_lon = 73.029

con = duckdb.connect("hospitals.db")

hospitals = con.execute(
    "SELECT * FROM hospitals"
).fetchall()

best_distance = 999999
nearest_hospital = None

for hospital in hospitals:

    distance = haversine(
        user_lat,
        user_lon,
        hospital[2],  # latitude
        hospital[3]   # longitude
    )

    if distance < best_distance:
        best_distance = distance
        nearest_hospital = hospital

print("Nearest Hospital:")
print(nearest_hospital[0])

print("Distance:")
print(round(best_distance, 2), "km")