from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100))
    age = db.Column(db.Integer)
    membership = db.Column(db.String(50), default='Bronze')
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'city': self.city,
            'age': self.age,
            'membership': self.membership,
            'role': self.role
        }

class Rental(db.Model):
    __tablename__ = 'rentals'
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.String(100), unique=True, nullable=False)
    type = db.Column(db.String(50))
    type_display = db.Column(db.String(50))
    building_type = db.Column(db.String(50))
    building_type_display = db.Column(db.String(50))
    activation_date = db.Column(db.String(100))
    bathroom = db.Column(db.Integer)
    floor = db.Column(db.Integer)
    total_floor = db.Column(db.Integer)
    furnishing = db.Column(db.String(50))
    furnishing_display = db.Column(db.String(50))
    gym = db.Column(db.Boolean, default=False)
    latitude = db.Column(db.Numeric(10, 8))
    longitude = db.Column(db.Numeric(11, 8))
    lease_type = db.Column(db.String(50))
    lift = db.Column(db.Boolean, default=False)
    locality = db.Column(db.String(255))
    parking = db.Column(db.String(50))
    property_age = db.Column(db.Integer)
    property_size = db.Column(db.Integer)
    swimming_pool = db.Column(db.Boolean, default=False)
    pin_code = db.Column(db.String(20))
    rent = db.Column(db.Integer)
    deposit = db.Column(db.Integer)
    image = db.Column(db.String(500))
    is_saved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'type': self.type,
            'type_display': self.type_display,
            'building_type': self.building_type,
            'building_type_display': self.building_type_display,
            'bathroom': self.bathroom,
            'furnishing_display': self.furnishing_display,
            'gym': bool(self.gym),
            'locality_name': self.locality,
            'property_size': self.property_size,
            'lift': bool(self.lift),
            'swimming_pool': bool(self.swimming_pool),
            'rent': self.rent,
            'deposit': self.deposit,
            'image': self.image,
            'is_saved': bool(self.is_saved)
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    rental_id = db.Column(db.Integer, db.ForeignKey('rentals.id'))
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='Pending')

class UserActivity(db.Model):
    __tablename__ = 'user_activity'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    activity_type = db.Column(db.String(100))
    activity_data = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
