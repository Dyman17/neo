import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional
import os

class Database:
    def __init__(self):
        self.db_path = "artifacts.db"
        self.init_db()
    
    def init_db(self):
        """Initialize database with tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Artifacts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS artifacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                material TEXT,
                preservation_index REAL,
                gps_lat REAL,
                gps_lng REAL,
                image_url TEXT,
                ai_analysis TEXT,
                discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                discovered_by TEXT,
                status TEXT DEFAULT 'active'
            )
        ''')
        
        # Settings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Sensor readings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sensor_type TEXT,
                value REAL,
                unit TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                gps_lat REAL,
                gps_lng REAL
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_artifact(self, artifact_data: Dict) -> int:
        """Save new artifact to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO artifacts 
            (name, description, material, preservation_index, gps_lat, gps_lng, 
             image_url, ai_analysis, discovered_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            artifact_data.get('name'),
            artifact_data.get('description'),
            artifact_data.get('material'),
            artifact_data.get('preservation_index'),
            artifact_data.get('gps_lat'),
            artifact_data.get('gps_lng'),
            artifact_data.get('image_url'),
            json.dumps(artifact_data.get('ai_analysis', {})),
            artifact_data.get('discovered_by', 'system')
        ))
        
        artifact_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return artifact_id
    
    def get_artifacts(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get artifacts with optional filters"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        query = "SELECT * FROM artifacts WHERE status = 'active'"
        params = []
        
        if filters:
            if filters.get('material'):
                query += " AND material = ?"
                params.append(filters['material'])
            if filters.get('min_preservation'):
                query += " AND preservation_index >= ?"
                params.append(filters['min_preservation'])
            if filters.get('max_preservation'):
                query += " AND preservation_index <= ?"
                params.append(filters['max_preservation'])
        
        query += " ORDER BY discovered_at DESC"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        artifacts = []
        for row in rows:
            artifact = {
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'material': row[3],
                'preservation_index': row[4],
                'gps_lat': row[5],
                'gps_lng': row[6],
                'image_url': row[7],
                'ai_analysis': json.loads(row[8]) if row[8] else {},
                'discovered_at': row[9],
                'discovered_by': row[10],
                'status': row[11]
            }
            artifacts.append(artifact)
        
        conn.close()
        return artifacts
    
    def save_sensor_reading(self, sensor_type: str, value: float, unit: str, 
                           gps_lat: float = None, gps_lng: float = None):
        """Save sensor reading"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sensor_readings (sensor_type, value, unit, gps_lat, gps_lng)
            VALUES (?, ?, ?, ?, ?)
        ''', (sensor_type, value, unit, gps_lat, gps_lng))
        
        conn.commit()
        conn.close()
    
    def get_heatmap_data(self) -> List[Dict]:
        """Get data for heatmap visualization"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT gps_lat, gps_lng, COUNT(*) as artifact_count
            FROM artifacts 
            WHERE gps_lat IS NOT NULL AND gps_lng IS NOT NULL
            GROUP BY gps_lat, gps_lng
        ''')
        
        rows = cursor.fetchall()
        heatmap_data = []
        
        for row in rows:
            heatmap_data.append({
                'lat': row[0],
                'lng': row[1], 
                'intensity': row[2]
            })
        
        conn.close()
        return heatmap_data

# Global database instance
db = Database()