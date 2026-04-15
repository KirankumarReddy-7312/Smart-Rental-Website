from ..models import Rental, db
from sqlalchemy import or_

class RentalService:
    @staticmethod
    def get_all_rentals(filters=None):
        query = Rental.query
        
        if filters:
            if filters.get('locality'):
                query = query.filter(Rental.locality.ilike(f"%{filters['locality']}%"))
            if filters.get('type'):
                query = query.filter(Rental.type.ilike(f"%{filters['type']}%"))
            if filters.get('min_rent'):
                query = query.filter(Rental.rent >= int(filters['min_rent']))
            if filters.get('max_rent'):
                query = query.filter(Rental.rent <= int(filters['max_rent']))
        
        # Default ordering
        query = query.order_by(Rental.rent.asc())
        
        return query.all()

    @staticmethod
    def create_rental(data):
        new_rental = Rental(**data)
        db.session.add(new_rental)
        db.session.commit()
        return new_rental

    @staticmethod
    def get_featured_rentals(limit=6):
        return Rental.query.order_by(Rental.rent.asc()).limit(limit).all()

    @staticmethod
    def get_rental_by_id(rental_id):
        return Rental.query.get(rental_id)
