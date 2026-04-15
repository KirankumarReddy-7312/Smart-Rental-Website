from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        "status": "active",
        "project": "Rentora Smart Rental API",
        "endpoints": {
            "auth": "/api/auth/",
            "properties": "/api/properties/",
            "analytics": "/api/analytics/",
            "chat": "/api/chat/"
        }
    })


urlpatterns = [
    path('', api_root, name='api-root'),

    path('admin/', admin.site.urls),

    # API routes
    path('api/auth/', include('users.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/analytics/', include('analytics.urls')),

    # ✅ IMPORTANT (chat endpoint)
    path('api/chat/', include('chat.urls')),
]


# Static & Media (only for development)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
