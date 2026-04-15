import os
import django
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rentora.settings')
django.setup()

from analytics.models import AnalyticsProperty
from properties.models import Property, Location
from datetime import date
import random

def seed():
    if AnalyticsProperty.objects.exists():
        print("Data already exists in Analytics. Skipping seed.")
        return

    properties = [
        {
            'locality': 'Whitefield',
            'property_id': 'WHIT-001',
            'property_type': 'BHK3',
            'bhk': 3,
            'rent': 45000,
            'deposit': 150000,
            'property_size': 1800,
            'furnishing': 'ff',
            'bathroom': 3,
            'floor': 5,
            'total_floor': 12,
            'parking': 'YES',
            'building_type': 'Apartment',
            'property_age': 2,
            'gym': True,
            'lift': True,
            'swimming_pool': True,
            'lease_type': 'FAMILY'
        },
        {
            'locality': 'Electronic City',
            'property_id': 'ELEC-001',
            'property_type': 'BHK2',
            'bhk': 2,
            'rent': 22000,
            'deposit': 60000,
            'property_size': 1100,
            'furnishing': 'sf',
            'bathroom': 2,
            'floor': 2,
            'total_floor': 4,
            'parking': 'YES',
            'building_type': 'Independent House',
            'property_age': 5,
            'gym': False,
            'lift': True,
            'swimming_pool': False,
            'lease_type': 'ANYONE'
        },
        {
            'locality': 'Bellandur',
            'property_id': 'BELL-001',
            'property_type': 'BHK1',
            'bhk': 1,
            'rent': 18000,
            'deposit': 50000,
            'property_size': 700,
            'furnishing': 'un',
            'bathroom': 1,
            'floor': 1,
            'total_floor': 3,
            'parking': 'NO',
            'building_type': 'Independent Floor',
            'property_age': 10,
            'gym': False,
            'lift': False,
            'swimming_pool': False,
            'lease_type': 'BACHELOR'
        }
    ]

    for p in properties:
        # Create Analytics Property
        an_p = {**p}
        p_id = an_p.pop('property_id')
        AnalyticsProperty.objects.create(**an_p)
        
        # Create Property Listing
        loc_obj, _ = Location.objects.get_or_create(name=p['locality'])
        
        furn_map = {'ff': 'Furnished', 'sf': 'Semi-Furnished', 'un': 'Unfurnished'}
        bhk_type = p['property_type']
        
        Property.objects.create(
            property_id=p_id,
            type=bhk_type,
            activation_date=date.today(),
            building_type=p['building_type'],
            furnishing=furn_map.get(p['furnishing'], 'Unfurnished'),
            lease_type='Any',
            locality=loc_obj,
            pin_code="560001",
            bathroom=p['bathroom'],
            floor=p['floor'],
            total_floor=p['total_floor'],
            property_age=p['property_age'],
            property_size=p['property_size'],
            rent=p['rent'],
            deposit=p['deposit'],
            gym=p['gym'],
            lift=p['lift'],
            swimming_pool=p['swimming_pool'],
            parking=(p['parking'] == 'YES'),
            latitude=12.9716,
            longitude=77.5946
        )
    
    print(f"Successfully seeded {len(properties)} properties across all models.")

if __name__ == '__main__':
    seed()
