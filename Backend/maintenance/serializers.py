from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import (
    Company, Department, Vendor, Employee, WorkCenter,
    MaintenanceTeam, EquipmentCategory, Equipment, 
    MaintenanceRequest, MaintenanceLog, ScheduledMaintenance
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']
        read_only_fields = ['id']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate_username(self, value):
        """Check if username already exists"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        """Check if passwords match"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """Create user with encrypted password"""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        """Authenticate user credentials"""
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError(
                    "Unable to log in with provided credentials.",
                    code='authorization'
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    "User account is disabled.",
                    code='authorization'
                )
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                "Must include 'username' and 'password'.",
                code='authorization'
            )


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        """Check if old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, attrs):
        """Check if new passwords match"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

    def save(self):
        """Update user password"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile with full details"""
    full_name = serializers.SerializerMethodField()
    total_requests = serializers.SerializerMethodField()
    pending_requests = serializers.SerializerMethodField()
    completed_requests = serializers.SerializerMethodField()
    maintenance_teams = serializers.SerializerMethodField()
    employee_info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'date_joined', 'last_login', 'is_active', 'total_requests',
            'pending_requests', 'completed_requests', 'maintenance_teams',
            'employee_info'
        ]
        read_only_fields = ['id', 'username', 'date_joined', 'last_login', 'is_active']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_total_requests(self, obj):
        """Count total maintenance requests created by this user"""
        return MaintenanceRequest.objects.filter(requested_by=obj).count()

    def get_pending_requests(self, obj):
        """Count pending maintenance requests"""
        return MaintenanceRequest.objects.filter(
            requested_by=obj,
            status__in=['pending', 'in_progress']
        ).count()

    def get_completed_requests(self, obj):
        """Count completed maintenance requests"""
        return MaintenanceRequest.objects.filter(
            requested_by=obj,
            status='completed'
        ).count()

    def get_maintenance_teams(self, obj):
        """Get teams where user is a member"""
        teams = obj.maintenance_teams.all()
        return [{'id': team.id, 'name': team.name} for team in teams]

    def get_employee_info(self, obj):
        """Get employee info if exists"""
        try:
            employee = Employee.objects.get(user=obj)
            return {
                'id': employee.id,
                'employee_code': employee.employee_code,
                'department': employee.department.name if employee.department else None,
                'position': employee.position,
                'phone': employee.phone,
                'image': employee.image.url if employee.image else None
            }
        except Employee.DoesNotExist:
            return None


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company model"""
    class Meta:
        model = Company
        fields = ['id', 'name', 'code', 'address', 'phone', 'email', 'logo', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class VendorSerializer(serializers.ModelSerializer):
    """Serializer for Vendor model"""
    class Meta:
        model = Vendor
        fields = ['id', 'name', 'code', 'contact_person', 'email', 'phone', 'address', 'website', 'notes', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    employee_count = serializers.SerializerMethodField()
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'company', 'company_name', 'employee_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_employee_count(self, obj):
        return obj.employees.count()


class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee model"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'email', 'phone', 'department', 'department_name',
            'position', 'user', 'user_details', 'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class WorkCenterSerializer(serializers.ModelSerializer):
    """Serializer for WorkCenter model"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    alternative_workcenter_names = serializers.SerializerMethodField()

    class Meta:
        model = WorkCenter
        fields = [
            'id', 'name', 'code', 'alternative_workcenters', 'alternative_workcenter_names',
            'costs_hour', 'time_efficiency', 'oee_target',
            'company', 'company_name', 'description', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_alternative_workcenter_names(self, obj):
        return [wc.name for wc in obj.alternative_workcenters.all()]


class MaintenanceTeamSerializer(serializers.ModelSerializer):
    """Serializer for MaintenanceTeam model"""
    members_details = UserSerializer(source='members', many=True, read_only=True)
    leader_details = UserSerializer(source='leader', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    member_count = serializers.ReadOnlyField()

    class Meta:
        model = MaintenanceTeam
        fields = [
            'id', 'name', 'description', 'members', 'members_details',
            'leader', 'leader_details', 'company', 'company_name',
            'is_active', 'member_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EquipmentCategorySerializer(serializers.ModelSerializer):
    """Serializer for EquipmentCategory model"""
    default_maintenance_team_name = serializers.CharField(
        source='default_maintenance_team.name', read_only=True
    )
    responsible_user_name = serializers.SerializerMethodField()
    company_name = serializers.CharField(source='company.name', read_only=True)
    equipment_count = serializers.SerializerMethodField()

    class Meta:
        model = EquipmentCategory
        fields = [
            'id', 'name', 'description', 'default_maintenance_team',
            'default_maintenance_team_name', 'responsible_user', 'responsible_user_name',
            'company', 'company_name', 'equipment_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_equipment_count(self, obj):
        return obj.equipment.count()

    def get_responsible_user_name(self, obj):
        if obj.responsible_user:
            return obj.responsible_user.get_full_name() or obj.responsible_user.username
        return None


class EquipmentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for Equipment list view"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    maintenance_team_name = serializers.CharField(source='maintenance_team.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    work_center_name = serializers.CharField(source='work_center.name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    open_maintenance_count = serializers.ReadOnlyField()
    is_under_warranty = serializers.ReadOnlyField()

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'serial_number', 'category', 'category_name',
            'location', 'is_active', 'maintenance_team_name', 'department_name',
            'work_center', 'work_center_name', 'vendor_name',
            'open_maintenance_count', 'is_under_warranty', 'image'
        ]


class EquipmentSerializer(serializers.ModelSerializer):
    """Full serializer for Equipment model"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    assigned_employee_name = serializers.CharField(source='assigned_employee.name', read_only=True)
    maintenance_team_details = MaintenanceTeamSerializer(source='maintenance_team', read_only=True)
    default_technician_details = UserSerializer(source='default_technician', read_only=True)
    work_center_details = WorkCenterSerializer(source='work_center', read_only=True)
    vendor_details = VendorSerializer(source='vendor', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    open_maintenance_count = serializers.ReadOnlyField()
    is_under_warranty = serializers.ReadOnlyField()

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'serial_number', 'category', 'category_name',
            'purchase_date', 'warranty_expiry_date', 'assign_date', 'scrap_date',
            'location', 'work_center', 'work_center_details',
            'vendor', 'vendor_details',
            'department', 'department_name', 'assigned_employee', 'assigned_employee_name',
            'maintenance_team', 'maintenance_team_details',
            'default_technician', 'default_technician_details',
            'is_active', 'description', 'notes', 'image',
            'company', 'company_name',
            'open_maintenance_count', 'is_under_warranty',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EquipmentAutoFillSerializer(serializers.Serializer):
    """Serializer for auto-fill endpoint - returns team and category info for an equipment"""
    equipment_id = serializers.IntegerField()
    category = EquipmentCategorySerializer(read_only=True)
    maintenance_team = MaintenanceTeamSerializer(read_only=True)
    default_technician = UserSerializer(read_only=True)


class MaintenanceLogSerializer(serializers.ModelSerializer):
    """Serializer for MaintenanceLog model"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = MaintenanceLog
        fields = [
            'id', 'request', 'user', 'user_name', 'action',
            'old_status', 'new_status', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class MaintenanceRequestListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for MaintenanceRequest list view"""
    equipment_name = serializers.SerializerMethodField()
    equipment_serial = serializers.SerializerMethodField()
    work_center_name = serializers.CharField(source='work_center.name', read_only=True)
    maintenance_team_name = serializers.CharField(source='maintenance_team.name', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    is_overdue = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    request_type_display = serializers.CharField(source='get_request_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = MaintenanceRequest
        fields = [
            'id', 'name', 'request_type', 'request_type_display',
            'priority', 'priority_display', 'status', 'status_display',
            'color', 'request_date', 'scheduled_date', 'is_overdue',
            'equipment', 'equipment_name', 'equipment_serial',
            'work_center', 'work_center_name',
            'maintenance_team', 'maintenance_team_name',
            'assigned_to', 'assigned_to_name',
            'created_at'
        ]

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None

    def get_equipment_name(self, obj):
        return obj.equipment.name if obj.equipment else None

    def get_equipment_serial(self, obj):
        return obj.equipment.serial_number if obj.equipment else None


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    """Full serializer for MaintenanceRequest model"""
    equipment_details = EquipmentListSerializer(source='equipment', read_only=True)
    work_center_details = WorkCenterSerializer(source='work_center', read_only=True)
    maintenance_team_details = MaintenanceTeamSerializer(source='maintenance_team', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    created_by_details = UserSerializer(source='created_by', read_only=True)
    equipment_category_name = serializers.CharField(source='equipment_category.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    logs = MaintenanceLogSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    request_type_display = serializers.CharField(source='get_request_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = MaintenanceRequest
        fields = [
            'id', 'name', 'description', 'request_type', 'request_type_display',
            'priority', 'priority_display', 'color',
            'request_date', 'scheduled_date', 'completion_date', 'duration',
            'status', 'status_display',
            'equipment', 'equipment_details',
            'work_center', 'work_center_details',
            'maintenance_team', 'maintenance_team_details',
            'assigned_to', 'assigned_to_details',
            'created_by', 'created_by_details',
            'equipment_category', 'equipment_category_name',
            'company', 'company_name',
            'is_overdue', 'logs',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'equipment_category', 'request_date', 'color', 'company', 'created_at', 'updated_at']

    def validate(self, attrs):
        """Custom validation for MaintenanceRequest"""
        # Validate assigned_to belongs to maintenance team
        assigned_to = attrs.get('assigned_to')
        maintenance_team = attrs.get('maintenance_team')
        
        # If updating, get existing values
        if self.instance:
            assigned_to = assigned_to or self.instance.assigned_to
            maintenance_team = maintenance_team or self.instance.maintenance_team

        if assigned_to and maintenance_team:
            if not maintenance_team.members.filter(id=assigned_to.id).exists():
                raise serializers.ValidationError({
                    'assigned_to': 'The assigned technician must be a member of the maintenance team.'
                })

        # Validate duration when status is repaired
        status = attrs.get('status')
        duration = attrs.get('duration')
        
        if status == 'repaired':
            if self.instance:
                duration = duration if duration is not None else self.instance.duration
            if not duration:
                raise serializers.ValidationError({
                    'duration': 'Duration is required when marking a request as repaired.'
                })

        return attrs

    def create(self, validated_data):
        # Set created_by from request user
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class MaintenanceRequestStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating maintenance request status"""
    status = serializers.ChoiceField(choices=MaintenanceRequest.STATUS_CHOICES)
    duration = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        status = attrs.get('status')
        duration = attrs.get('duration')
        
        if status == 'repaired' and not duration:
            raise serializers.ValidationError({
                'duration': 'Duration is required when marking as repaired.'
            })
        
        return attrs


class ScheduledMaintenanceSerializer(serializers.ModelSerializer):
    """Serializer for ScheduledMaintenance model"""
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    equipment_serial = serializers.CharField(source='equipment.serial_number', read_only=True)
    maintenance_team_name = serializers.CharField(source='maintenance_team.name', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)

    class Meta:
        model = ScheduledMaintenance
        fields = [
            'id', 'name', 'equipment', 'equipment_name', 'equipment_serial',
            'description', 'frequency', 'frequency_display',
            'next_run_date', 'last_run_date', 'is_active',
            'maintenance_team', 'maintenance_team_name',
            'assigned_to', 'assigned_to_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'last_run_date', 'created_at', 'updated_at']

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None


class CalendarEventSerializer(serializers.Serializer):
    """Serializer for calendar events (both requests and scheduled maintenance)"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    date = serializers.DateField()
    type = serializers.CharField()  # 'request' or 'scheduled'
    status = serializers.CharField(required=False)
    equipment_name = serializers.CharField()
    is_overdue = serializers.BooleanField(required=False)


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_equipment = serializers.IntegerField()
    active_equipment = serializers.IntegerField()
    inactive_equipment = serializers.IntegerField()
    total_requests = serializers.IntegerField()
    new_requests = serializers.IntegerField()
    in_progress_requests = serializers.IntegerField()
    overdue_requests = serializers.IntegerField()
    completed_this_month = serializers.IntegerField()
    upcoming_scheduled = serializers.IntegerField()
