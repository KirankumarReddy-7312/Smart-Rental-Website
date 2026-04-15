from flask import Blueprint, jsonify, request
from ..services.rental_service import RentalService

property_bp = Blueprint('property_bp', __name__)

@property_bp.route('/', methods=['GET', 'POST'])
def handle_properties():
    if request.method == 'POST':
        data = request.json
        try:
            rental = RentalService.create_rental(data)
            return jsonify(rental.to_dict()), 201
        except Exception as e:
            print(f"Error creating property: {e}")
            return jsonify({'error': str(e)}), 400
            
    # GET method handling
    filters = {
        'locality': request.args.get('locality'),
        'type': request.args.get('type'),
        'min_rent': request.args.get('min_rent'),
        'max_rent': request.args.get('max_rent')
    }
    try:
        rentals = RentalService.get_all_rentals(filters)
        return jsonify([rental.to_dict() for rental in rentals])
    except Exception as e:
        print(f"Error fetching properties: {e}")
        return jsonify([]), 200 # Return empty list so frontend doesn't crash

@property_bp.route('/featured', methods=['GET'])
def get_featured():
    rentals = RentalService.get_featured_rentals()
    return jsonify([rental.to_dict() for rental in rentals])

@property_bp.route('/<int:id>', methods=['GET'])
def get_property_detail(id):
    rental = RentalService.get_rental_by_id(id)
    if rental:
        return jsonify(rental.to_dict())
    return jsonify({'error': 'Property not found'}), 404
