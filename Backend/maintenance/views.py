from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta

from .models import (
    Company, Department, Vendor, Employee, WorkCenter,
    MaintenanceTeam, EquipmentCategory, Equipment, 
    MaintenanceRequest, MaintenanceLog, ScheduledMaintenance
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserProfileSerializer, PasswordChangeSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    CompanySerializer, VendorSerializer,
    DepartmentSerializer, EmployeeSerializer, WorkCenterSerializer,
    MaintenanceTeamSerializer, EquipmentCategorySerializer,
    EquipmentSerializer, EquipmentListSerializer, EquipmentAutoFillSerializer,
    MaintenanceRequestSerializer, MaintenanceRequestListSerializer,
    MaintenanceRequestStatusUpdateSerializer,
    MaintenanceLogSerializer, ScheduledMaintenanceSerializer,
    CalendarEventSerializer, DashboardStatsSerializer
)


# Authentication Views
class UserRegistrationView(APIView):
    """User registration endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create token for the user
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """User login endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Please provide both username and password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid credentials. Please check your username and password.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'error': 'This account has been disabled. Please contact support.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        # Update last login
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class UserLogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token
            request.user.auth_token.delete()
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Something went wrong during logout'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(APIView):
    """User profile view and update endpoint"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Update current user's profile"""
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'user': serializer.data,
                'message': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Partially update current user's profile"""
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'user': serializer.data,
                'message': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """Change password endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            # Delete old token and create new one
            try:
                request.user.auth_token.delete()
            except:
                pass
            token = Token.objects.create(user=request.user)
            
            return Response({
                'message': 'Password changed successfully. Please use new token for further requests.',
                'token': token.key
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """Request password reset - send reset email"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.save()
            return Response({
                'message': 'If an account exists with this email, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """Confirm password reset with token"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create new token for the user
            token = Token.objects.create(user=user)
            
            return Response({
                'message': 'Password has been reset successfully. You can now login with your new password.',
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserMaintenanceHistoryView(APIView):
    """View user's maintenance request history"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get maintenance requests created by the user"""
        # Get query parameters
        status_filter = request.query_params.get('status', None)
        limit = request.query_params.get('limit', None)
        
        # Base queryset - using created_by instead of requested_by
        queryset = MaintenanceRequest.objects.filter(
            created_by=request.user
        ).select_related(
            'equipment', 'work_center', 'maintenance_team', 'company'
        ).order_by('-request_date')
        
        # Apply status filter if provided
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Apply limit if provided
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        
        serializer = MaintenanceRequestListSerializer(queryset, many=True)
        
        # Get statistics - using created_by instead of requested_by
        stats = {
            'total': MaintenanceRequest.objects.filter(created_by=request.user).count(),
            'new': MaintenanceRequest.objects.filter(created_by=request.user, status='new').count(),
            'in_progress': MaintenanceRequest.objects.filter(created_by=request.user, status='in_progress').count(),
            'repaired': MaintenanceRequest.objects.filter(created_by=request.user, status='repaired').count(),
            'scrap': MaintenanceRequest.objects.filter(created_by=request.user, status='scrap').count(),
        }
        
        return Response({
            'maintenance_requests': serializer.data,
            'statistics': stats
        }, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for User model - read only"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name', 'email']

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current authenticated user"""
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'])
    def technicians(self, request):
        """Get users who are members of any maintenance team"""
        team_members = User.objects.filter(maintenance_teams__isnull=False).distinct()
        serializer = self.get_serializer(team_members, many=True)
        return Response(serializer.data)


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for Company model"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'created_at']


class VendorViewSet(viewsets.ModelViewSet):
    """ViewSet for Vendor model"""
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code', 'contact_person', 'email']
    ordering_fields = ['name', 'created_at']


class DepartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Department model"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class EmployeeViewSet(viewsets.ModelViewSet):
    """ViewSet for Employee model"""
    queryset = Employee.objects.select_related('department', 'user').all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department']
    search_fields = ['name', 'email', 'position']
    ordering_fields = ['name', 'created_at']


class WorkCenterViewSet(viewsets.ModelViewSet):
    """ViewSet for WorkCenter model"""
    queryset = WorkCenter.objects.prefetch_related('alternative_workcenters').all()
    serializer_class = WorkCenterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'company']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']

    @action(detail=True, methods=['get'])
    def maintenance_requests(self, request, pk=None):
        """Get all maintenance requests for this work center"""
        work_center = self.get_object()
        requests = work_center.maintenance_requests.all()
        
        open_only = request.query_params.get('open_only', 'false').lower() == 'true'
        if open_only:
            requests = requests.exclude(status__in=['repaired', 'scrap'])
        
        serializer = MaintenanceRequestListSerializer(requests, many=True)
        return Response({
            'work_center_id': work_center.id,
            'work_center_name': work_center.name,
            'requests': serializer.data
        })


class MaintenanceTeamViewSet(viewsets.ModelViewSet):
    """ViewSet for MaintenanceTeam model"""
    queryset = MaintenanceTeam.objects.prefetch_related('members').all()
    serializer_class = MaintenanceTeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members of a specific team"""
        team = self.get_object()
        serializer = UserSerializer(team.members.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to the team"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(pk=user_id)
            team.members.add(user)
            return Response({'status': 'member added'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Remove a member from the team"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(pk=user_id)
            team.members.remove(user)
            return Response({'status': 'member removed'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class EquipmentCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for EquipmentCategory model"""
    queryset = EquipmentCategory.objects.select_related('default_maintenance_team').all()
    serializer_class = EquipmentCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class EquipmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Equipment model with smart button functionality"""
    queryset = Equipment.objects.select_related(
        'category', 'department', 'assigned_employee',
        'maintenance_team', 'default_technician'
    ).all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'department', 'maintenance_team', 'is_active']
    search_fields = ['name', 'serial_number', 'location']
    ordering_fields = ['name', 'created_at', 'purchase_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return EquipmentListSerializer
        return EquipmentSerializer

    @action(detail=True, methods=['get'])
    def auto_fill(self, request, pk=None):
        """
        Get auto-fill data for a maintenance request.
        Returns category, maintenance team, and default technician.
        """
        equipment = self.get_object()
        data = {
            'equipment_id': equipment.id,
            'category': EquipmentCategorySerializer(equipment.category).data if equipment.category else None,
            'maintenance_team': MaintenanceTeamSerializer(equipment.maintenance_team).data if equipment.maintenance_team else None,
            'default_technician': UserSerializer(equipment.default_technician).data if equipment.default_technician else None,
        }
        return Response(data)

    @action(detail=True, methods=['get'])
    def maintenance_requests(self, request, pk=None):
        """
        Smart button action: Get all maintenance requests for this equipment.
        Supports filtering by status.
        """
        equipment = self.get_object()
        requests = equipment.maintenance_requests.all()
        
        # Optional filter for open requests only
        status_filter = request.query_params.get('status', None)
        if status_filter:
            requests = requests.filter(status=status_filter)
        
        open_only = request.query_params.get('open_only', 'false').lower() == 'true'
        if open_only:
            requests = requests.exclude(status__in=['repaired', 'scrap'])
        
        serializer = MaintenanceRequestListSerializer(requests, many=True)
        return Response({
            'equipment_id': equipment.id,
            'equipment_name': equipment.name,
            'open_count': equipment.open_maintenance_count,
            'requests': serializer.data
        })

    @action(detail=True, methods=['post'])
    def mark_inactive(self, request, pk=None):
        """Mark equipment as inactive (scrapped)"""
        equipment = self.get_object()
        equipment.is_active = False
        notes = request.data.get('notes', '')
        equipment.notes += f"\n[{timezone.now().date()}] Marked as inactive. {notes}"
        equipment.save()
        return Response({'status': 'equipment marked as inactive'})


class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for MaintenanceRequest with workflow management"""
    queryset = MaintenanceRequest.objects.select_related(
        'equipment', 'maintenance_team', 'assigned_to',
        'created_by', 'equipment_category'
    ).prefetch_related('logs').all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'request_type', 'priority', 'equipment', 'maintenance_team', 'assigned_to']
    search_fields = ['subject', 'description', 'equipment__name', 'equipment__serial_number']
    ordering_fields = ['created_at', 'scheduled_date', 'priority', 'status']

    def get_serializer_class(self):
        if self.action == 'list':
            return MaintenanceRequestListSerializer
        if self.action == 'update_status':
            return MaintenanceRequestStatusUpdateSerializer
        return MaintenanceRequestSerializer

    def perform_create(self, serializer):
        """Set created_by and log creation"""
        instance = serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
        MaintenanceLog.objects.create(
            request=instance,
            user=self.request.user if self.request.user.is_authenticated else None,
            action='Created',
            new_status=instance.status,
            notes=f"Request created: {instance.subject}"
        )

    def perform_update(self, serializer):
        """Log status changes"""
        old_status = serializer.instance.status
        instance = serializer.save()
        
        if old_status != instance.status:
            MaintenanceLog.objects.create(
                request=instance,
                user=self.request.user if self.request.user.is_authenticated else None,
                action='Status Changed',
                old_status=old_status,
                new_status=instance.status,
                notes=f"Status changed from {old_status} to {instance.status}"
            )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update the status of a maintenance request with proper workflow validation.
        """
        maintenance_request = self.get_object()
        old_status = maintenance_request.status
        
        serializer = MaintenanceRequestStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        new_status = serializer.validated_data['status']
        duration = serializer.validated_data.get('duration')
        notes = serializer.validated_data.get('notes', '')
        
        # Update the request
        maintenance_request.status = new_status
        if duration:
            maintenance_request.duration = duration
        if new_status == 'repaired':
            maintenance_request.completion_date = timezone.now().date()
        
        maintenance_request.save()
        
        # Create log entry
        MaintenanceLog.objects.create(
            request=maintenance_request,
            user=request.user if request.user.is_authenticated else None,
            action='Status Changed',
            old_status=old_status,
            new_status=new_status,
            notes=notes
        )
        
        return Response(MaintenanceRequestSerializer(maintenance_request).data)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """
        Assign a maintenance request to a technician.
        Validates that the technician is a member of the assigned team.
        """
        maintenance_request = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Validate team membership
        if maintenance_request.maintenance_team:
            if not maintenance_request.maintenance_team.members.filter(id=user.id).exists():
                return Response(
                    {'error': 'The assigned technician must be a member of the maintenance team.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        maintenance_request.assigned_to = user
        if maintenance_request.status == 'new':
            maintenance_request.status = 'in_progress'
        maintenance_request.save()
        
        # Create log entry
        MaintenanceLog.objects.create(
            request=maintenance_request,
            user=request.user if request.user.is_authenticated else None,
            action='Assigned',
            notes=f"Assigned to {user.get_full_name() or user.username}"
        )
        
        return Response(MaintenanceRequestSerializer(maintenance_request).data)

    @action(detail=True, methods=['post'])
    def pick_up(self, request, pk=None):
        """
        Allow a technician to pick up a request (self-assign).
        Validates that the user is a member of the assigned team.
        """
        maintenance_request = self.get_object()
        user = request.user
        
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Validate team membership
        if maintenance_request.maintenance_team:
            if not maintenance_request.maintenance_team.members.filter(id=user.id).exists():
                return Response(
                    {'error': 'You must be a member of the maintenance team to pick up this request.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        maintenance_request.assigned_to = user
        maintenance_request.status = 'in_progress'
        maintenance_request.save()
        
        # Create log entry
        MaintenanceLog.objects.create(
            request=maintenance_request,
            user=user,
            action='Picked Up',
            old_status='new',
            new_status='in_progress',
            notes=f"Request picked up by {user.get_full_name() or user.username}"
        )
        
        return Response(MaintenanceRequestSerializer(maintenance_request).data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get all overdue maintenance requests"""
        today = timezone.now().date()
        overdue_requests = self.queryset.filter(
            scheduled_date__lt=today
        ).exclude(
            status__in=['repaired', 'scrap']
        )
        serializer = MaintenanceRequestListSerializer(overdue_requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """
        Get maintenance requests for calendar view.
        Supports filtering by date range and type.
        """
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        request_type = request.query_params.get('type')
        
        queryset = self.queryset.filter(scheduled_date__isnull=False)
        
        if start_date:
            queryset = queryset.filter(scheduled_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(scheduled_date__lte=end_date)
        if request_type:
            queryset = queryset.filter(request_type=request_type)
        
        events = []
        for req in queryset:
            events.append({
                'id': req.id,
                'title': req.subject,
                'date': req.scheduled_date,
                'type': 'request',
                'status': req.status,
                'equipment_name': req.equipment.name,
                'is_overdue': req.is_overdue,
            })
        
        return Response(events)

    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Get requests assigned to the current user"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        my_requests = self.queryset.filter(assigned_to=request.user)
        serializer = MaintenanceRequestListSerializer(my_requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def team_requests(self, request):
        """Get requests for teams the current user is a member of"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user_teams = request.user.maintenance_teams.all()
        team_requests = self.queryset.filter(maintenance_team__in=user_teams)
        serializer = MaintenanceRequestListSerializer(team_requests, many=True)
        return Response(serializer.data)


class ScheduledMaintenanceViewSet(viewsets.ModelViewSet):
    """ViewSet for ScheduledMaintenance model"""
    queryset = ScheduledMaintenance.objects.select_related(
        'equipment', 'maintenance_team', 'assigned_to'
    ).all()
    serializer_class = ScheduledMaintenanceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['frequency', 'is_active', 'equipment', 'maintenance_team']
    search_fields = ['name', 'description', 'equipment__name']
    ordering_fields = ['next_run_date', 'name', 'created_at']

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming scheduled maintenances within the next 7 days"""
        today = timezone.now().date()
        next_week = today + timedelta(days=7)
        upcoming = self.queryset.filter(
            is_active=True,
            next_run_date__gte=today,
            next_run_date__lte=next_week
        )
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def generate_request(self, request, pk=None):
        """Generate a maintenance request from this scheduled maintenance"""
        scheduled = self.get_object()
        
        # Create maintenance request
        maintenance_request = MaintenanceRequest.objects.create(
            subject=f"[Scheduled] {scheduled.name}",
            description=scheduled.description,
            request_type='preventive',
            scheduled_date=scheduled.next_run_date,
            equipment=scheduled.equipment,
            maintenance_team=scheduled.maintenance_team,
            assigned_to=scheduled.assigned_to,
            created_by=request.user if request.user.is_authenticated else None,
        )
        
        # Update scheduled maintenance
        scheduled.last_run_date = timezone.now().date()
        
        # Calculate next run date based on frequency
        if scheduled.frequency == 'daily':
            scheduled.next_run_date += timedelta(days=1)
        elif scheduled.frequency == 'weekly':
            scheduled.next_run_date += timedelta(weeks=1)
        elif scheduled.frequency == 'monthly':
            scheduled.next_run_date += timedelta(days=30)
        elif scheduled.frequency == 'quarterly':
            scheduled.next_run_date += timedelta(days=90)
        elif scheduled.frequency == 'yearly':
            scheduled.next_run_date += timedelta(days=365)
        
        scheduled.save()
        
        return Response({
            'message': 'Maintenance request generated successfully',
            'request_id': maintenance_request.id,
            'next_run_date': scheduled.next_run_date
        })


class DashboardView(APIView):
    """Dashboard view for statistics and overview"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        today = timezone.now().date()
        first_day_of_month = today.replace(day=1)
        
        # Equipment stats
        total_equipment = Equipment.objects.count()
        active_equipment = Equipment.objects.filter(is_active=True).count()
        inactive_equipment = Equipment.objects.filter(is_active=False).count()
        
        # Request stats
        total_requests = MaintenanceRequest.objects.count()
        new_requests = MaintenanceRequest.objects.filter(status='new').count()
        in_progress_requests = MaintenanceRequest.objects.filter(status='in_progress').count()
        
        # Overdue requests
        overdue_requests = MaintenanceRequest.objects.filter(
            scheduled_date__lt=today
        ).exclude(
            status__in=['repaired', 'scrap']
        ).count()
        
        # Completed this month
        completed_this_month = MaintenanceRequest.objects.filter(
            status='repaired',
            completion_date__gte=first_day_of_month
        ).count()
        
        # Upcoming scheduled maintenance
        next_week = today + timedelta(days=7)
        upcoming_scheduled = ScheduledMaintenance.objects.filter(
            is_active=True,
            next_run_date__gte=today,
            next_run_date__lte=next_week
        ).count()
        
        data = {
            'total_equipment': total_equipment,
            'active_equipment': active_equipment,
            'inactive_equipment': inactive_equipment,
            'total_requests': total_requests,
            'new_requests': new_requests,
            'in_progress_requests': in_progress_requests,
            'overdue_requests': overdue_requests,
            'completed_this_month': completed_this_month,
            'upcoming_scheduled': upcoming_scheduled,
        }
        
        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)


class CalendarView(APIView):
    """Combined calendar view for all maintenance events"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        events = []
        
        # Get maintenance requests with scheduled dates
        requests = MaintenanceRequest.objects.filter(
            scheduled_date__isnull=False
        ).select_related('equipment')
        
        if start_date:
            requests = requests.filter(scheduled_date__gte=start_date)
        if end_date:
            requests = requests.filter(scheduled_date__lte=end_date)
        
        for req in requests:
            events.append({
                'id': req.id,
                'title': req.subject,
                'date': req.scheduled_date,
                'type': 'request',
                'status': req.status,
                'equipment_name': req.equipment.name,
                'is_overdue': req.is_overdue,
            })
        
        # Get scheduled maintenances
        scheduled = ScheduledMaintenance.objects.filter(
            is_active=True
        ).select_related('equipment')
        
        if start_date:
            scheduled = scheduled.filter(next_run_date__gte=start_date)
        if end_date:
            scheduled = scheduled.filter(next_run_date__lte=end_date)
        
        for sched in scheduled:
            events.append({
                'id': sched.id,
                'title': f"[Scheduled] {sched.name}",
                'date': sched.next_run_date,
                'type': 'scheduled',
                'equipment_name': sched.equipment.name,
                'is_overdue': False,
            })
        
        # Sort by date
        events.sort(key=lambda x: x['date'])
        
        return Response(events)

