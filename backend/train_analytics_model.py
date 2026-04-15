import os
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.ensemble import HistGradientBoostingRegressor, HistGradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

def train_enhanced_model():
    data_dir = Path('data')
    if not data_dir.exists():
        data_dir = Path('../data')
    
    csv_files = list(data_dir.glob('*.csv'))
    print(f"Loading {len(csv_files)} datasets...")
    
    datasets = []
    for csv_file in csv_files:
        df = pd.read_csv(csv_file)
        datasets.append(df)
    
    combined_df = pd.concat(datasets, ignore_index=True)
    
    # Feature Selection
    features = ['type', 'bathroom', 'floor', 'total_floor', 'furnishing', 'gym', 'lift', 'swimming_pool', 'property_age', 'property_size', 'lease_type', 'building_type', 'locality']
    target = 'rent'
    
    df_clean = combined_df[features + [target]].copy()
    df_clean = df_clean.dropna()
    
    # Encoding
    label_encoders = {}
    categorical_cols = ['type', 'furnishing', 'lease_type', 'building_type', 'locality']
    for col in categorical_cols:
        le = LabelEncoder()
        df_clean[col] = le.fit_transform(df_clean[col].astype(str))
        label_encoders[col] = le
    
    X = df_clean[features]
    y = df_clean[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    print("Training Advanced HistGradientBoosting Regressor...")
    model = HistGradientBoostingRegressor(max_iter=200, learning_rate=0.1, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    # Simple logic for 'Market Fit' Classifier
    # We'll train a classifier to predict if a property is 'Excellent Value', 'Fair', or 'Premium'
    # Based on rent vs size ratio (Rent per SQFT)
    df_clean['rent_sqft'] = df_clean['rent'] / df_clean['property_size']
    med = df_clean['rent_sqft'].median()
    def cat_fit(val):
        if val < med * 0.8: return 0 # Value
        if val < med * 1.3: return 1 # Fair
        return 2 # Premium

    df_clean['fit_cat'] = df_clean['rent_sqft'].apply(cat_fit)
    
    clf = HistGradientBoostingClassifier(max_iter=100, random_state=42)
    clf.fit(X, df_clean['fit_cat'])
    
    accuracy = model.score(X_test, y_test)
    print(f"Model R^2 Accuracy: {accuracy:.4f}")
    
    # Save model artifacts
    model_dir = Path('backend/analytics/ml_models')
    if not model_dir.exists():
        model_dir = Path('analytics/ml_models')
    model_dir.mkdir(parents=True, exist_ok=True)
    
    joblib.dump(model, model_dir / 'rent_prediction_model.joblib')
    joblib.dump(clf, model_dir / 'market_fit_model.joblib')
    joblib.dump(label_encoders, model_dir / 'label_encoders.joblib')
    joblib.dump(features, model_dir / 'features.joblib')
    
    return accuracy

if __name__ == "__main__":
    train_enhanced_model()
