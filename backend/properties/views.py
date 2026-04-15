from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property, Location, SavedProperty
from .serializers import PropertySerializer, LocationSerializer, SavedPropertySerializer
from .filters import PropertyFilter


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['locality__name', 'building_type', 'type']
    ordering_fields = ['rent', 'property_size', 'created_at']
    ordering = ['rent']

    def get_queryset(self):
        queryset = Property.objects.select_related('locality').all()
        
        # Budget filter
        min_budget = self.request.query_params.get('min_budget')
        max_budget = self.request.query_params.get('max_budget')
        
        if min_budget:
            queryset = queryset.filter(rent__gte=min_budget)
        if max_budget:
            queryset = queryset.filter(rent__lte=max_budget)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured properties (lowest rent)"""
        properties = self.get_queryset()[:6]
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get property statistics"""
        stats = {
            'total_properties': Property.objects.count(),
            'average_rent': Property.objects.aggregate(avg_rent=Avg('rent'))['avg_rent'],
            'average_size': Property.objects.aggregate(avg_size=Avg('property_size'))['avg_size'],
            'locations': Location.objects.annotate(
                property_count=Count('property')
            ).values('name', 'property_count').order_by('-property_count')
        }
        return Response(stats)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        """Save a property for authenticated user"""
        property = self.get_object()
        saved_property, created = SavedProperty.objects.get_or_create(
            user=request.user,
            property=property
        )
        
        if created:
            return Response({'message': 'Property saved successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Property already saved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def unsave(self, request, pk=None):
        """Unsave a property for authenticated user"""
        property = self.get_object()
        try:
            saved_property = SavedProperty.objects.get(user=request.user, property=property)
            saved_property.delete()
            return Response({'message': 'Property unsaved successfully'}, status=status.HTTP_200_OK)
        except SavedProperty.DoesNotExist:
            return Response({'message': 'Property not saved'}, status=status.HTTP_404_NOT_FOUND)


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    @action(detail=True, methods=['get'])
    def properties(self, request, pk=None):
        """Get properties for a specific location"""
        location = self.get_object()
        properties = Property.objects.filter(locality=location).select_related('locality')
        
        # Apply filters
        property_filter = PropertyFilter(request.GET, queryset=properties)
        serializer = PropertySerializer(property_filter.qs, many=True)
        
        return Response({
            'location': LocationSerializer(location).data,
            'properties': serializer.data,
            'count': property_filter.qs.count()
        })

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get statistics for a specific location"""
        location = self.get_object()
        properties = Property.objects.filter(locality=location)
        
        stats = {
            'location': LocationSerializer(location).data,
            'total_properties': properties.count(),
            'average_rent': properties.aggregate(avg_rent=Avg('rent'))['avg_rent'],
            'average_size': properties.aggregate(avg_size=Avg('property_size'))['avg_size'],
            'min_rent': properties.aggregate(min_rent=models.Min('rent'))['min_rent'],
            'max_rent': properties.aggregate(max_rent=models.Max('rent'))['max_rent'],
        }
        return Response(stats)


class SavedPropertyViewSet(viewsets.ModelViewSet):
    serializer_class = SavedPropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedProperty.objects.filter(user=self.request.user).select_related('property', 'property__locality')
