import os
import csv
import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings
from properties.models import Property, Location


class Command(BaseCommand):
    help = 'Import property data from CSV files'

    def handle(self, *args, **options):
        # Define the CSV files and their corresponding location names
        csv_files = {
            'Whitefield.csv': 'Whitefield',
            'Bellandur.csv': 'Bellandur',
            'Varthur.csv': 'Varthur',
            'Kaggadasapura.csv': 'Kaggadasapura',
            'K.R Puram.csv': 'K.R Puram',
            'Electronic_City.csv': 'Electronic City',
            'Brookefield.csv': 'Brookefield',
            'Yelahanka.csv': 'Yelahanka'
        }

        # Path to the CSV files directory
        csv_dir = os.path.join(settings.BASE_DIR, '..', 'data')

        total_imported = 0
        total_errors = 0

        for csv_file, location_name in csv_files.items():
            csv_path = os.path.join(csv_dir, csv_file)
            
            if not os.path.exists(csv_path):
                self.stdout.write(
                    self.style.WARNING(f'CSV file not found: {csv_file}')
                )
                continue

            # Create or get the location
            location, created = Location.objects.get_or_create(name=location_name)
            
            if created:
                self.stdout.write(f'Created location: {location_name}')

            try:
                # Read CSV file using pandas
                df = pd.read_csv(csv_path)
                
                imported_count = 0
                error_count = 0

                for index, row in df.iterrows():
                    try:
                        # Convert boolean columns
                        gym = bool(str(row.get('gym', '')).strip().lower() in ['true', '1', 'yes', 'y'])
                        parking = bool(str(row.get('parking', '')).strip().lower() in ['true', '1', 'yes', 'y'])
                        lift = bool(str(row.get('lift', '')).strip().lower() in ['true', '1', 'yes', 'y'])
                        swimming_pool = bool(str(row.get('swimming_pool', '')).strip().lower() in ['true', '1', 'yes', 'y'])

                        # Create property
                        property_obj = Property.objects.create(
                            property_id=str(row['property_id']),
                            type=str(row['type']),
                            activation_date=pd.to_datetime(row['activation_date']).date(),
                            bathroom=int(row['bathroom']),
                            floor=int(row['floor']),
                            total_floor=int(row['total_floor']),
                            furnishing=str(row['furnishing']),
                            gym=gym,
                            latitude=float(row['latitude']),
                            longitude=float(row['longitude']),
                            lease_type=str(row['lease_type']),
                            lift=lift,
                            locality=location,
                            parking=parking,
                            property_age=int(row['property_age']),
                            property_size=int(row['property_size']),
                            swimming_pool=swimming_pool,
                            pin_code=str(row['pin_code']),
                            rent=int(row['rent']),
                            deposit=int(row['deposit']),
                            building_type=str(row['building_type'])
                        )
                        
                        imported_count += 1
                        
                    except Exception as e:
                        error_count += 1
                        self.stdout.write(
                            self.style.ERROR(f'Error importing row {index + 1} from {csv_file}: {str(e)}')
                        )
                        continue

                total_imported += imported_count
                total_errors += error_count

                self.stdout.write(
                    self.style.SUCCESS(
                        f'Imported {imported_count} properties from {csv_file} '
                        f'({error_count} errors)'
                    )
                )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error reading {csv_file}: {str(e)}')
                )
                total_errors += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'\nImport completed!\n'
                f'Total properties imported: {total_imported}\n'
                f'Total errors: {total_errors}'
            )
        )
