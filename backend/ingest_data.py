import os
import pandas as pd
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'rentora_db'),
    'port': os.getenv('DB_PORT', '3306')
}

DATA_DIR = os.path.join(os.path.dirname(__file__), '../data')

# Image mapping for BHK types
IMAGE_MAPPING = {
    'BHK1': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'BHK2': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'BHK3': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'BHK4': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'BHK4PLUS': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'RK1': 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def clean_data(df):
    # Map furnishing
    furnishing_map = {
        'SEMI_FURNISHED': 'Semi-Furnished',
        'FULLY_FURNISHED': 'Furnished',
        'NOT_FURNISHED': 'Unfurnished'
    }
    df['furnishing_display'] = df['furnishing'].map(furnishing_map).fillna('Contact for Info')
    
    # Map building type
    building_map = {
        'AP': 'Apartment',
        'IH': 'Independent House',
        'IF': 'Independent Floor',
        'GC': 'Gated Community'
    }
    df['building_type_display'] = df['building_type'].map(building_map).fillna('Residential')
    
    # Map BHK type display
    def format_bhk(bhk):
        if 'BHK' in str(bhk):
            return bhk.replace('BHK', '') + ' BHK'
        return bhk
    
    df['type_display'] = df['type'].apply(format_bhk)
    
    # Handle NaNs and types
    df['rent'] = pd.to_numeric(df['rent'], errors='coerce').fillna(0).astype(int)
    df['deposit'] = pd.to_numeric(df['deposit'], errors='coerce').fillna(0).astype(int)
    df['bathroom'] = pd.to_numeric(df['bathroom'], errors='coerce').fillna(1).astype(int)
    df['property_size'] = pd.to_numeric(df['property_size'], errors='coerce').fillna(0).astype(int)
    df['total_floor'] = pd.to_numeric(df['total_floor'], errors='coerce').fillna(0).astype(int)
    df['floor'] = pd.to_numeric(df['floor'], errors='coerce').fillna(0).astype(int)
    
    # Assign image based on type
    df['image'] = df['type'].map(IMAGE_MAPPING).fillna('https://images.unsplash.com/photo-1460317442991-0ec239f606aa?w=800&q=80')
    
    return df

def ingest_properties():
    conn = get_db_connection()
    if not conn:
        return
    
    cursor = conn.cursor()
    
    files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv') and f != 'customers.csv']
    
    for filename in files:
        print(f"Processing {filename}...")
        file_path = os.path.join(DATA_DIR, filename)
        df = pd.read_csv(file_path)
        df = clean_data(df)
        
        for _, row in df.iterrows():
            try:
                sql = """
                INSERT INTO rentals (
                    property_id, type, type_display, building_type, building_type_display,
                    activation_date, bathroom, floor, total_floor, furnishing,
                    furnishing_display, gym, latitude, longitude, lease_type,
                    lift, locality, parking, property_age, property_size,
                    swimming_pool, pin_code, rent, deposit, image
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE rent=VALUES(rent), deposit=VALUES(deposit)
                """
                
                cursor.execute(sql, (
                    row['property_id'], row['type'], row['type_display'], row['building_type'], row['building_type_display'],
                    row['activation_date'], int(row['bathroom']), int(row['floor']), int(row['total_floor']), row['furnishing'],
                    row['furnishing_display'], int(row['gym']), row['latitude'], row['longitude'], row['lease_type'],
                    int(row['lift']), row['locality'], row['parking'], int(row['property_age']), int(row['property_size']),
                    int(row['swimming_pool']), str(row['pin_code']), int(row['rent']), int(row['deposit']), row['image']
                ))
            except Error as e:
                print(f"Error inserting row {row['property_id']}: {e}")
                continue
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Property ingestion complete.")

def ingest_users():
    conn = get_db_connection()
    if not conn:
        return
    
    cursor = conn.cursor()
    file_path = os.path.join(DATA_DIR, 'customers.csv')
    
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        for _, row in df.iterrows():
            try:
                # Generate a mock email and password
                email = f"{row['CustomerName'].lower().replace(' ', '_')}@example.com"
                password = "pbkdf2:sha256:600000$randomsalt$hashedpassword" # Mock hash for testing
                
                sql = """
                INSERT INTO users (name, email, password, city, age, membership)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE city=VALUES(city), age=VALUES(age)
                """
                cursor.execute(sql, (
                    row['CustomerName'], email, password, row['City'], int(row['Age']), row['Membership']
                ))
            except Error as e:
                print(f"Error inserting user {row['CustomerName']}: {e}")
                continue
    
    conn.commit()
    cursor.close()
    conn.close()
    print("User ingestion complete.")

if __name__ == "__main__":
    ingest_properties()
    ingest_users()
