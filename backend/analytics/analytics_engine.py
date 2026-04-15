import pandas as pd
import numpy as np
from pathlib import Path
from .models import AnalyticsProperty

class AnalyticsEngine:
    def __init__(self):
        self.data_dir = Path(__file__).parent.parent / 'data'
        self.datasets = [f.stem for f in self.data_dir.glob('*.csv')]
    
    def market_summary(self):
        data = AnalyticsProperty.objects.all()
        if not data.exists():
            return {
                "total_properties": 0, "avg_rent": 0, "avg_deposit": 0, "avg_size": 0, "avg_rent_psf": 0,
                "locality_counts": {}, "bhk_distribution": {}, "furnishing_trends": {}, "outliers_count": 0,
                "top_localities": [], "best_investment_areas": [], "max_rent": 0
            }
            
        df = pd.DataFrame(list(data.values()))
        # Strict numeric conversion
        df['rent'] = pd.to_numeric(df['rent'], errors='coerce').fillna(0)
        df['deposit'] = pd.to_numeric(df['deposit'], errors='coerce').fillna(0)
        df['property_size'] = pd.to_numeric(df['property_size'], errors='coerce').fillna(1)
        df['rent_psf'] = df['rent'] / df['property_size'].replace(0, 1)
        df['deposit_ratio'] = df['deposit'] / df['rent'].replace(0, 1)
        
        mean_rent = df['rent'].mean()
        std_rent = df['rent'].std()
        outliers = df[df['rent'] > mean_rent + 2.5 * std_rent]
        
        # Locality Metrics
        loc_group = df.groupby('locality').agg({
            'rent': 'mean', 
            'property_size': 'mean', 
            'rent_psf': 'mean',
            'deposit_ratio': 'mean'
        }).reset_index().fillna(0)
        
        max_psf = loc_group['rent_psf'].max() if not loc_group.empty else 1
        if pd.isna(max_psf) or max_psf == 0: max_psf = 1
        
        loc_group['investment_score'] = (loc_group['rent_psf'] / max_psf * 10).round(1)
        
        # Safe value retrieval
        def safe_val(val, type_func=int):
            if pd.isna(val) or val is None: return 0
            try: return type_func(val)
            except: return 0

        # Property stats
        best_areas = loc_group.sort_values(by='investment_score', ascending=False)
        
        # Clean localities and format
        loc_group['locality'] = loc_group['locality'].astype(str).str.replace('_', ' ').str.title()
        
        return {
            "total_properties": int(len(df)),
            "avg_rent": safe_val(round(mean_rent, 0)),
            "avg_deposit": safe_val(round(df['deposit'].mean(), 0)),
            "max_rent": safe_val(df['rent'].max()),
            "avg_rent_psf": safe_val(round(df['rent_psf'].mean(), 2), float),
            "locality_counts": {str(k).replace('_',' ').title(): v for k,v in df['locality'].value_counts().to_dict().items()},
            "bhk_distribution": df['bhk'].value_counts().to_dict(),
            "furnishing_trends": df['furnishing'].value_counts().to_dict(),
            "outliers_count": int(len(outliers)),
            "locality_stats": loc_group.to_dict('records'),
            "best_investment_areas": best_areas.to_dict('records'),
            "luxury_counts": df[df['bhk'] >= 4].groupby('locality').size().to_dict()
        }
    
    def amenity_impact(self):
        data = AnalyticsProperty.objects.all()
        if not data.exists(): return {}
        df = pd.DataFrame(list(data.values()))
        df['rent'] = pd.to_numeric(df['rent'], errors='coerce').fillna(0)
        impact = {}
        # location-wise amenities calculation
        for am in ['gym', 'lift', 'swimming_pool']:
            impact[am] = []
            for loc in df['locality'].unique():
                loc_df = df[df['locality'] == loc]
                has_am = loc_df[loc_df[am] == True]
                no_am = loc_df[loc_df[am] == False]
                m1 = has_am['rent'].mean() if not has_am.empty else 0
                m2 = no_am['rent'].mean() if not no_am.empty else 0
                diff = m1 - m2
                if not pd.isna(diff) and diff > 0:
                    impact[am].append({
                        "locality": str(loc).replace('_', ' ').title(),
                        "premium": int(round(diff, 0)),
                        "with": int(round(m1, 0)),
                        "without": int(round(m2, 0))
                    })
            # Sort by highest premium impact (Show all locations)
            impact[am] = sorted(impact[am], key=lambda x: x['premium'], reverse=True)
        return impact
    
    def pricing_inconsistencies(self):
        data = AnalyticsProperty.objects.all()
        df = pd.DataFrame(list(data.values()))
        if df.empty: return []
        df['rent'] = pd.to_numeric(df['rent'], errors='coerce').fillna(0)
        stats = df.groupby(['locality', 'bhk'])['rent'].mean().unstack().fillna(0)
        inconsistencies = []
        for loc, row in stats.iterrows():
            if 1 in row and 2 in row and row[1] > row[2] and row[2] > 0:
                inconsistencies.append({"locality": str(loc).replace('_',' '), "issue": "Price Mismatch (1BHK > 2BHK)", "val": int(round(row[1], 0))})
        return inconsistencies
