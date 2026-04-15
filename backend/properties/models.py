from django.db import models
from django.contrib.auth.models import User


class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Location"
        verbose_name_plural = "Locations"

    def __str__(self):
        return self.name


class Property(models.Model):
    PROPERTY_TYPES = [
        ('BHK1', '1 BHK'),
        ('BHK2', '2 BHK'),
        ('BHK3', '3 BHK'),
        ('BHK4', '4 BHK'),
        ('RK1', '1 RK'),
    ]

    BUILDING_TYPES = [
        ('Apartment', 'Apartment'),
        ('Independent House', 'Independent House'),
        ('Independent Floor', 'Independent Floor'),
    ]

    FURNISHING_TYPES = [
        ('Furnished', 'Furnished'),
        ('Semi-Furnished', 'Semi-Furnished'),
        ('Unfurnished', 'Unfurnished'),
    ]

    LEASE_TYPES = [
        ('Family', 'Family'),
        ('Bachelor', 'Bachelor'),
        ('Company', 'Company'),
        ('Any', 'Any'),
    ]

    # Basic Information
    property_id = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=10, choices=PROPERTY_TYPES)
    activation_date = models.DateField()
    building_type = models.CharField(max_length=50, choices=BUILDING_TYPES)
    furnishing = models.CharField(max_length=20, choices=FURNISHING_TYPES)
    lease_type = models.CharField(max_length=20, choices=LEASE_TYPES)
    locality = models.ForeignKey(Location, on_delete=models.CASCADE)
    pin_code = models.CharField(max_length=10)

    # Property Details
    bathroom = models.IntegerField()
    floor = models.IntegerField()
    total_floor = models.IntegerField()
    property_age = models.IntegerField()
    property_size = models.IntegerField()  # in sq ft

    # Financial
    rent = models.IntegerField()
    deposit = models.IntegerField()

    # Amenities
    gym = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    lift = models.BooleanField(default=False)
    swimming_pool = models.BooleanField(default=False)

    # Location
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        ordering = ['rent']

    def __str__(self):
        return f"{self.property_id} - {self.locality.name}"


class SavedProperty(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'property']
        verbose_name = "Saved Property"
        verbose_name_plural = "Saved Properties"

    def __str__(self):
        return f"{self.user.username} - {self.property.property_id}"
