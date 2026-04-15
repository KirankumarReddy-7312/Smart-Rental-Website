import os
import django
import pandas as pd
from pathlib import Path

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rentora.settings')
django.setup()

from analytics.models import AnalyticsProperty

def ingest_data():
    data_dir = Path(__file__).parent.parent / 'data'
    csv_files = list(data_dir.glob('*.csv'))
    
    print(f"Found {len(csv_files)} datasets.")
    
    # Mapping of CSV columns to Model fields
    # Models: locality, property_type, bhk, rent, deposit, property_size, furnishing, bathroom, floor, total_floor, parking, building_type, property_age, gym, lift, swimming_pool, lease_type
    
    all_properties = []
    
    for csv_file in csv_files:
        print(f"Processing {csv_file.name}...")
        df = pd.read_csv(csv_file)
        
        # Clean data
        for _, row in df.iterrows():
            # Extract BHK from type (e.g. BHK2 -> 2)
            ptype = str(row.get('type', ''))
            bhk = 0
            if 'BHK' in ptype:
                try:
                    bhk = int(ptype.replace('BHK', '').split('PLUS')[0])
                except:
                    bhk = 0
            elif 'RK' in ptype:
                bhk = 0 # 1RK usually
            
            # Convert booleans
            gym = bool(row.get('gym', 0))
            lift = bool(row.get('lift', 0))
            pool = bool(row.get('swimming_pool', 0))
            
            # Handle possible NaN values
            def clean_int(val, default=0):
                if pd.isna(val) or val == '': return default
                try: return int(val)
                except: return default

            prop = AnalyticsProperty(
                locality=row.get('locality', csv_file.stem),
                property_type=ptype,
                bhk=bhk,
                rent=clean_int(row.get('rent')),
                deposit=clean_int(row.get('deposit')),
                property_size=clean_int(row.get('property_size')),
                furnishing=str(row.get('furnishing', '')),
                bathroom=clean_int(row.get('bathroom')),
                floor=clean_int(row.get('floor')),
                total_floor=clean_int(row.get('total_floor')),
                parking=str(row.get('parking', '')),
                building_type=str(row.get('building_type', '')),
                property_age=clean_int(row.get('property_age')),
                gym=gym,
                lift=lift,
                swimming_pool=pool,
                lease_type=str(row.get('lease_type', ''))
            )
            all_properties.append(prop)
            
        if len(all_properties) > 1000:
            AnalyticsProperty.objects.bulk_create(all_properties)
            print(f"Bulk created {len(all_properties)} properties.")
            all_properties = []
            
    if all_properties:
        AnalyticsProperty.objects.bulk_create(all_properties)
        print(f"Bulk created final batch of {len(all_properties)} properties.")

if __name__ == "__main__":
    ingest_data()
