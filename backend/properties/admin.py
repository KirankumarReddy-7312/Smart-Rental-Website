from django.contrib import admin
from .models import Property, Location, SavedProperty


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        'property_id', 'type', 'building_type', 'locality', 
        'rent', 'bathroom', 'furnishing', 'created_at'
    ]
    list_filter = [
        'building_type', 'furnishing', 'lease_type', 'locality',
        'gym', 'parking', 'lift', 'swimming_pool'
    ]
    search_fields = ['property_id', 'locality__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SavedProperty)
class SavedPropertyAdmin(admin.ModelAdmin):
    list_display = ['user', 'property', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'property__property_id']
