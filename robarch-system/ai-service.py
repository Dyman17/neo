import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from sklearn.naive_bayes import GaussianNB
import joblib
import warnings
warnings.filterwarnings('ignore')

def train_material_classifier():
    """Train the material classifier using the complete dataset"""
    print("Loading dataset...")
    
    try:
        # Load the complete dataset
        df = pd.read_csv('complete_material_dataset.csv')
        print(f"Dataset loaded with {len(df)} samples")
        print(f"Material distribution:\n{df['material'].value_counts()}")
    except FileNotFoundError:
        print("Complete dataset not found, using synthetic data generation...")
        
        # Generate synthetic data if real dataset not available
        data = []
        
        # Metal: Very high piezo, medium-high tds, close distance
        for i in range(200):
            piezo = np.random.normal(3800, 400)
            tds = np.random.normal(750, 150)
            distance = np.random.normal(2.5, 0.8)
            data.append([piezo, tds, distance, 'Металл'])

        # Plastic: Low piezo, low tds, close distance
        for i in range(200):
            piezo = np.random.normal(500, 150)
            tds = np.random.normal(250, 80)
            distance = np.random.normal(5, 2)
            data.append([piezo, tds, distance, 'Пластик'])

        # Liquid: Medium piezo, very high tds, any distance
        for i in range(200):
            piezo = np.random.normal(1800, 600)
            tds = np.random.normal(1900, 300)
            distance = np.random.normal(10, 4)
            data.append([piezo, tds, distance, 'Жидкость'])

        # Wood: Medium piezo, low tds, medium distance
        for i in range(200):
            piezo = np.random.normal(1400, 300)
            tds = np.random.normal(180, 60)
            distance = np.random.normal(8, 3)
            data.append([piezo, tds, distance, 'Дерево'])

        # Ceramic: High piezo, medium tds, close distance
        for i in range(200):
            piezo = np.random.normal(2800, 400)
            tds = np.random.normal(600, 150)
            distance = np.random.normal(4, 1.5)
            data.append([piezo, tds, distance, 'Керамика'])

        # Glass: Medium-high piezo, low tds, medium distance
        for i in range(200):
            piezo = np.random.normal(1600, 350)
            tds = np.random.normal(200, 70)
            distance = np.random.normal(6, 2.5)
            data.append([piezo, tds, distance, 'Стекло'])

        # Soil/Sediment: Medium piezo, high tds, close distance
        for i in range(200):
            piezo = np.random.normal(1200, 300)
            tds = np.random.normal(1000, 250)
            distance = np.random.normal(3.5, 1.2)
            data.append([piezo, tds, distance, 'Земля/Грунт'])

        # Sand: Low piezo, high tds, close distance
        for i in range(200):
            piezo = np.random.normal(600, 200)
            tds = np.random.normal(1100, 200)
            distance = np.random.normal(4, 1.5)
            data.append([piezo, tds, distance, 'Песок'])

        # Coral: High piezo, medium tds, medium distance
        for i in range(200):
            piezo = np.random.normal(2500, 500)
            tds = np.random.normal(700, 200)
            distance = np.random.normal(6, 2)
            data.append([piezo, tds, distance, 'Кораллы'])

        # Algae: Medium piezo, low tds, medium distance
        for i in range(200):
            piezo = np.random.normal(1000, 250)
            tds = np.random.normal(300, 100)
            distance = np.random.normal(7, 2.5)
            data.append([piezo, tds, distance, 'Водоросли'])

        # Shell: Medium piezo, low tds, close distance
        for i in range(200):
            piezo = np.random.normal(1800, 400)
            tds = np.random.normal(250, 80)
            distance = np.random.normal(4, 1.5)
            data.append([piezo, tds, distance, 'Ракушки'])

        # Sedimentary rock: Medium piezo, high tds, close distance
        for i in range(200):
            piezo = np.random.normal(1400, 350)
            tds = np.random.normal(900, 250)
            distance = np.random.normal(5, 2)
            data.append([piezo, tds, distance, 'Осадочные породы'])

        df = pd.DataFrame(data, columns=['piezo', 'tds', 'distance', 'material'])
        
        # Add realistic variations
        for idx in df.index:
            df.loc[idx, 'piezo'] += np.random.normal(0, 50)
            df.loc[idx, 'tds'] += np.random.normal(0, 30)
            df.loc[idx, 'distance'] += np.random.normal(0, 0.2)
            
            # Ensure values are positive
            df.loc[idx, 'piezo'] = max(df.loc[idx, 'piezo'], 0)
            df.loc[idx, 'tds'] = max(df.loc[idx, 'tds'], 0)
            df.loc[idx, 'distance'] = max(df.loc[idx, 'distance'], 0.1)

    # Calculate additional features
    df['piezo_tds_ratio'] = df['piezo'] / np.maximum(df['tds'], 0.001)
    df['distance_piezo_ratio'] = df['distance'] / np.maximum(df['piezo'], 0.001)
    df['combined_score'] = (df['piezo'] * 0.4 + df['tds'] * 0.3 + (1/np.maximum(df['distance'], 0.001)) * 0.3)
    
    # Define feature columns
    feature_columns = ['piezo', 'tds', 'distance', 'piezo_tds_ratio', 'distance_piezo_ratio', 'combined_score']
    
    # Prepare features and target
    X = df[feature_columns].values
    y = df['material'].values
    
    # Normalize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Create ensemble of models for better accuracy
    rf_model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1)
    gb_model = GradientBoostingClassifier(n_estimators=150, random_state=42, learning_rate=0.1)
    svm_model = SVC(probability=True, kernel='rbf', gamma='scale', random_state=42)
    nb_model = GaussianNB()
    
    # Create voting classifier
    ensemble_model = VotingClassifier(
        estimators=[('rf', rf_model), ('gb', gb_model), ('svm', svm_model), ('nb', nb_model)],
        voting='soft'  # Use soft voting to get probabilities
    )
    
    print("Training the ensemble model...")
    ensemble_model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = ensemble_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the trained model and scaler
    joblib.dump(ensemble_model, 'trained_material_classifier.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    print("\nModel and scaler saved successfully!")
    print("Files created: trained_material_classifier.pkl, scaler.pkl")
    
    return ensemble_model, scaler

if __name__ == "__main__":
    model, scaler = train_material_classifier()