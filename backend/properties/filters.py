import django_filters
from .models import Property


class PropertyFilter(django_filters.FilterSet):
    min_rent = django_filters.NumberFilter(field_name="rent", lookup_expr='gte')
    max_rent = django_filters.NumberFilter(field_name="rent", lookup_expr='lte')
    min_bathroom = django_filters.NumberFilter(field_name="bathroom", lookup_expr='gte')
    building_type = django_filters.ChoiceFilter(choices=Property.BUILDING_TYPES)
    furnishing = django_filters.ChoiceFilter(choices=Property.FURNISHING_TYPES)
    type = django_filters.ChoiceFilter(choices=Property.PROPERTY_TYPES)
    lease_type = django_filters.ChoiceFilter(choices=Property.LEASE_TYPES)

    class Meta:
        model = Property
        fields = [
            'locality', 'building_type', 'furnishing', 'type', 
            'lease_type', 'gym', 'parking', 'lift', 'swimming_pool'
        ]
