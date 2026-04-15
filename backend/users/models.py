from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    EMPLOYMENT_TYPES = [
        ('salaried', 'Salaried'),
        ('self_employed', 'Self Employed'),
        ('business', 'Business Owner'),
        ('student', 'Student'),
        ('retired', 'Retired'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True, null=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
