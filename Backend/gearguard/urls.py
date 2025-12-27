"""
URL configuration for gearguard project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    """API root endpoint with available endpoints"""
    return Response({
        'message': 'Welcome to GearGuard Maintenance Tracker API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'users': '/api/users/',
            'companies': '/api/companies/',
            'vendors': '/api/vendors/',
            'departments': '/api/departments/',
            'employees': '/api/employees/',
            'workcenters': '/api/workcenters/',
            'teams': '/api/teams/',
            'categories': '/api/categories/',
            'equipment': '/api/equipment/',
            'requests': '/api/requests/',
            'scheduled': '/api/scheduled/',
            'dashboard': '/api/dashboard/',
            'calendar': '/api/calendar/',
        }
    })


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("maintenance.urls")),
    path("", api_root, name="api-root"),
    # DRF browsable API auth
    path("api-auth/", include("rest_framework.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
