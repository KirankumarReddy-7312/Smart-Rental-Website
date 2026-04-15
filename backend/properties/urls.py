from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, LocationViewSet, SavedPropertyViewSet

router = DefaultRouter()
router.register(r'', PropertyViewSet, basename='property')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'saved', SavedPropertyViewSet, basename='saved-property')

urlpatterns = [
    path('', include(router.urls)),
]
