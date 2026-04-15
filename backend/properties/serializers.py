from rest_framework import serializers
from .models import Property, Location, SavedProperty


class LocationSerializer(serializers.ModelSerializer):
    property_count = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ['id', 'name', 'created_at', 'property_count']

    def get_property_count(self, obj):
        return Property.objects.filter(locality=obj).count()


class PropertySerializer(serializers.ModelSerializer):
    locality_name = serializers.CharField(source='locality.name', read_only=True)
    building_type_display = serializers.CharField(source='get_building_type_display', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    furnishing_display = serializers.CharField(source='get_furnishing_display', read_only=True)
    lease_type_display = serializers.CharField(source='get_lease_type_display', read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'property_id', 'type', 'type_display', 'activation_date',
            'bathroom', 'floor', 'total_floor', 'furnishing', 'furnishing_display',
            'gym', 'latitude', 'longitude', 'lease_type', 'lease_type_display',
            'lift', 'locality', 'locality_name', 'parking', 'property_age',
            'property_size', 'swimming_pool', 'pin_code', 'rent', 'deposit',
            'building_type', 'building_type_display', 'created_at', 'updated_at',
            'is_saved'
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedProperty.objects.filter(user=request.user, property=obj).exists()
        return False


class SavedPropertySerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = SavedProperty
        fields = ['id', 'user', 'property', 'property_details', 'created_at']
        read_only_fields = ['user', 'created_at']
