import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_app.models import db
from flask_app.routes.property_routes import property_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Database Configuration
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', '')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_name = os.getenv('DB_NAME', 'rentora_db')
    db_port = os.getenv('DB_PORT', '3306')

    try:
        app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'db.sqlite3')}"
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(app)
    except Exception as e:
        print(f"Error initializing DB: {e}")

    # Register Blueprints
    from flask_app.routes.property_routes import property_bp
    from flask_app.routes.analytics_routes import analytics_bp
    
    app.register_blueprint(property_bp, url_prefix='/api/properties')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

    @app.route('/')
    def index():
        return jsonify({"message": "Rentora Flask API is running"})

    return app

if __name__ == '__main__':
    app = create_app()
    # Run on port 8000 to match frontend's expected API port
    app.run(host='0.0.0.0', port=8000, debug=True)
