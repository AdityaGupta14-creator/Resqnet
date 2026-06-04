import duckdb
import os

con = duckdb.connect("hospitals.duckdb")

csv_path = os.path.join(
    os.path.dirname(__file__),
    "hospitals.csv"
)

con.execute("DROP TABLE IF EXISTS hospitals")

con.execute("""
CREATE TABLE hospitals(
    name VARCHAR,
    country VARCHAR,
    latitude DOUBLE,
    longitude DOUBLE,
    phone VARCHAR
)
""")

con.execute(f"""
COPY hospitals
FROM '{csv_path}'
(
    HEADER,
    IGNORE_ERRORS TRUE
)
""")

count = con.execute(
    "SELECT COUNT(*) FROM hospitals"
).fetchone()[0]

print("Hospitals imported:", count)

con.close()