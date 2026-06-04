import duckdb
import os

db_path = os.path.join(os.path.dirname(__file__), "hospitals.duckdb")
csv_path = os.path.join(os.path.dirname(__file__), "hospitals.csv")

print(f"Connecting to database at {db_path}...")
con = duckdb.connect(db_path)

print("Dropping old table and creating new schema...")
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

print("Importing CSV data...")
con.execute(f"""
COPY hospitals
FROM '{csv_path}'
(
    HEADER,
    IGNORE_ERRORS TRUE
)
""")

count = con.execute("SELECT COUNT(*) FROM hospitals").fetchone()[0]

print("Successfully imported hospitals:", count)

con.close()
