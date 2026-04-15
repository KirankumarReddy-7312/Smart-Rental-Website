from django.db import models
from django.contrib.auth.models import User

class AnalyticsProperty(models.Model):
    locality = models.CharField(max_length=100)
    property_type = models.CharField(max_length=50)
    bhk = models.IntegerField()
    rent = models.IntegerField()
    deposit = models.IntegerField()
    property_size = models.IntegerField()
    furnishing = models.CharField(max_length=20)
    bathroom = models.IntegerField()
    floor = models.IntegerField()
    total_floor = models.IntegerField()
    parking = models.CharField(max_length=20)
    building_type = models.CharField(max_length=20)
    property_age = models.IntegerField()
    gym = models.BooleanField(default=False)
    lift = models.BooleanField(default=False)
    swimming_pool = models.BooleanField(default=False)
    lease_type = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

class MLModelVersion(models.Model):
    model_name = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    accuracy = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    model_file = models.FileField(upload_to='ml_models/')
