from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'companies', views.CompanyViewSet, basename='company')
router.register(r'vendors', views.VendorViewSet, basename='vendor')
router.register(r'departments', views.DepartmentViewSet, basename='department')
router.register(r'employees', views.EmployeeViewSet, basename='employee')
router.register(r'workcenters', views.WorkCenterViewSet, basename='workcenter')
router.register(r'teams', views.MaintenanceTeamViewSet, basename='team')
router.register(r'categories', views.EquipmentCategoryViewSet, basename='category')
router.register(r'equipment', views.EquipmentViewSet, basename='equipment')
router.register(r'requests', views.MaintenanceRequestViewSet, basename='request')
router.register(r'scheduled', views.ScheduledMaintenanceViewSet, basename='scheduled')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('auth/logout/', views.UserLogoutView.as_view(), name='logout'),
    
    # Password management endpoints
    path('auth/change-password/', views.PasswordChangeView.as_view(), name='change-password'),
    path('auth/forgot-password/', views.PasswordResetRequestView.as_view(), name='forgot-password'),
    path('auth/reset-password/', views.PasswordResetConfirmView.as_view(), name='reset-password'),
    
    # User profile endpoints
    path('auth/profile/', views.UserProfileView.as_view(), name='profile'),
    path('auth/maintenance-history/', views.UserMaintenanceHistoryView.as_view(), name='maintenance-history'),
    
    # API routes from router
    path('', include(router.urls)),
    
    # Dashboard and calendar views
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('calendar/', views.CalendarView.as_view(), name='calendar'),
]
