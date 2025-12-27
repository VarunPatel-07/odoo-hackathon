from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import (
    Company, Department, Vendor, Employee, WorkCenter,
    MaintenanceTeam, EquipmentCategory, Equipment, 
    MaintenanceRequest, MaintenanceLog, ScheduledMaintenance
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model - read only"""
    full_name = serializers.SerializerMethodField()
    employee_info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'employee_info', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
    
    def get_employee_info(self, obj):
        """Get associated employee information if exists"""
        try:
            from .models import Employee
            employee = Employee.objects.filter(user=obj).first()
            if employee:
                return {
                    'id': employee.id,
                    'name': employee.name,
                    'position': employee.position,
                    'phone': employee.phone,
                    'email': employee.email,
                    'department': employee.department.name if employee.department else None,
                    'image': employee.image.url if employee.image else None
                }
            return None
        except Exception:
            return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
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
        """Validate passwords match and meet requirements"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate password strength
        try:
            validate_password(attrs['password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for viewing and updating user profile"""
    full_name = serializers.SerializerMethodField()
    employee_info = serializers.SerializerMethodField()
    total_maintenance_requests = serializers.SerializerMethodField()
    completed_requests = serializers.SerializerMethodField()
    pending_requests = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'employee_info', 'date_joined', 'last_login',
            'total_maintenance_requests', 'completed_requests', 'pending_requests'
        ]
        read_only_fields = ['id', 'username', 'date_joined', 'last_login']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
    
    def get_employee_info(self, obj):
        """Get associated employee information if exists"""
        try:
            from .models import Employee
            employee = Employee.objects.filter(user=obj).first()
            if employee:
                return {
                    'id': employee.id,
                    'name': employee.name,
                    'position': employee.position,
                    'department': employee.department.name if employee.department else None,
                    'phone': employee.phone,
                    'email': employee.email,
                    'image': employee.image.url if employee.image else None
                }
            return None
        except Exception as e:
            return None
    
    def get_total_maintenance_requests(self, obj):
        """Get total maintenance requests created by user"""
        try:
            return MaintenanceRequest.objects.filter(created_by=obj).count()
        except Exception:
            return 0
    
    def get_completed_requests(self, obj):
        """Get completed maintenance requests"""
        try:
            return MaintenanceRequest.objects.filter(created_by=obj, status='repaired').count()
        except Exception:
            return 0
    
    def get_pending_requests(self, obj):
        """Get pending maintenance requests"""
        try:
            return MaintenanceRequest.objects.filter(created_by=obj).exclude(status__in=['repaired', 'scrap']).count()
        except Exception:
            return 0


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password2 = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'}, label='Confirm New Password')

    def validate_old_password(self, value):
        """Check if old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, attrs):
        """Validate new passwords match and meet requirements"""
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "New password fields didn't match."})
        
        # Validate password strength
        try:
            validate_password(attrs['new_password'], self.context['request'].user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        
        return attrs

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for requesting password reset"""
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Check if email exists"""
        try:
            user = User.objects.get(email=value)
            if not user.is_active:
                raise serializers.ValidationError("This account has been disabled.")
        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            pass
        return value

    def save(self):
        """Generate and send password reset email"""
        email = self.validated_data['email']
        try:
            user = User.objects.get(email=email, is_active=True)
            
            # Generate token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Create reset link (adjust domain for production)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            
            # Send email
            subject = "Password Reset Request - GearGuard"
            message = f"""
Hello {user.get_full_name() or user.username},

You have requested to reset your password for GearGuard.

Please click the link below to reset your password:
{reset_link}

This link will expire in 24 hours.

If you didn't request this password reset, please ignore this email.

Best regards,
GearGuard Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return {
                'uid': uid,
                'token': token,
                'message': 'Password reset email sent successfully'
            }
        except User.DoesNotExist:
            # Return success message even if user doesn't exist (security best practice)
            return {
                'message': 'If an account exists with this email, a password reset link has been sent.'
            }


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming password reset"""
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password2 = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'}, label='Confirm New Password')

    def validate(self, attrs):
        """Validate token and passwords"""
        try:
            # Decode user ID
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=uid)
            
            # Validate token
            if not default_token_generator.check_token(user, attrs['token']):
                raise serializers.ValidationError({"token": "Invalid or expired reset link."})
            
            # Check if passwords match
            if attrs['new_password'] != attrs['new_password2']:
                raise serializers.ValidationError({"new_password": "Password fields didn't match."})
            
            # Validate password strength
            try:
                validate_password(attrs['new_password'], user)
            except DjangoValidationError as e:
                raise serializers.ValidationError({"new_password": list(e.messages)})
            
            # Store user in validated data for save method
            attrs['user'] = user
            return attrs
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid reset link."})

    def save(self):
        """Reset the password"""
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        
        # Invalidate all existing tokens for this user
        from rest_framework.authtoken.models import Token
        Token.objects.filter(user=user).delete()
        
        return user


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


class RaiseMaintenanceRequestSerializer(serializers.ModelSerializer):
    """Simplified serializer for users to raise maintenance requests"""
    
    class Meta:
        model = MaintenanceRequest
        fields = [
            'equipment',
            'name',
            'description',
            'request_type',
            'priority',
            'scheduled_date'
        ]
    
    def validate_equipment(self, value):
        """Ensure equipment exists and is active"""
        if not value.is_active:
            raise serializers.ValidationError("Cannot create a request for inactive equipment.")
        return value
    
    def create(self, validated_data):
        """Create maintenance request with auto-populated fields"""
        request = self.context.get('request')
        user = request.user if request else None
        
        # Auto-populate fields from equipment
        equipment = validated_data['equipment']
        validated_data['created_by'] = user
        validated_data['work_center'] = equipment.work_center
        validated_data['equipment_category'] = equipment.category
        validated_data['company'] = equipment.company
        validated_data['request_date'] = timezone.now().date()
        validated_data['status'] = 'new'
        
        # Determine priority color
        priority = validated_data.get('priority', 'low')
        color_map = {'low': 'green', 'medium': 'yellow', 'high': 'red'}
        validated_data['color'] = color_map.get(priority, 'green')
        
        # Create the request
        maintenance_request = MaintenanceRequest.objects.create(**validated_data)
        
        # Create log entry
        MaintenanceLog.objects.create(
            request=maintenance_request,
            user=user,
            action='Created',
            new_status='new',
            notes=f"Maintenance request created by {user.get_full_name() or user.username}"
        )
        
        return maintenance_request


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


class ComprehensiveProfileSerializer(serializers.Serializer):
    """
    Comprehensive profile serializer that adapts to all user types.
    Returns role-specific data based on user type.
    """
    # Universal fields
    user_info = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    primary_role = serializers.SerializerMethodField()
    
    # Role-specific fields
    employee_stats = serializers.SerializerMethodField()
    vendor_info = serializers.SerializerMethodField()
    company_info = serializers.SerializerMethodField()
    leadership_info = serializers.SerializerMethodField()
    maintenance_stats = serializers.SerializerMethodField()
    admin_stats = serializers.SerializerMethodField()
    
    # Recent activity
    recent_activities = serializers.SerializerMethodField()

    def get_user_info(self, obj):
        """Get basic user information"""
        employee = getattr(obj, 'employee', None)
        return {
            'id': obj.id,
            'username': obj.username,
            'email': obj.email,
            'first_name': obj.first_name,
            'last_name': obj.last_name,
            'full_name': obj.get_full_name() or obj.username,
            'date_joined': obj.date_joined,
            'last_login': obj.last_login,
            'is_active': obj.is_active,
            'profile_picture': employee.image.url if employee and employee.image else None,
            'phone': employee.phone if employee else '',
            'position': employee.position if employee else '',
        }

    def get_roles(self, obj):
        """Detect all roles this user has"""
        roles = []
        
        # Check employee
        has_employee = hasattr(obj, 'employee') and obj.employee is not None
        if has_employee:
            roles.append('employee')
        
        # Check team membership
        if obj.maintenance_teams.exists():
            roles.append('team_member')
        
        # Check team leader
        if obj.led_teams.exists():
            roles.append('team_leader')
        
        # Check vendor relationship (user is contact for vendor)
        vendor_equipment = Equipment.objects.filter(vendor__contact_person=obj.username).exists()
        if vendor_equipment:
            roles.append('vendor')
        
        # Check company representative (has employee with company)
        if has_employee and obj.employee.department and obj.employee.department.company:
            roles.append('company_rep')
        
        # Check admin/staff
        if obj.is_staff:
            roles.append('staff')
        if obj.is_superuser:
            roles.append('admin')
        
        return roles

    def get_primary_role(self, obj):
        """Determine the primary/dominant role"""
        if obj.is_superuser:
            return 'admin'
        if obj.is_staff:
            return 'staff'
        if obj.led_teams.exists():
            return 'team_leader'
        if obj.maintenance_teams.exists():
            return 'team_member'
        if hasattr(obj, 'employee') and obj.employee:
            return 'employee'
        
        # Check vendor
        vendor_equipment = Equipment.objects.filter(vendor__contact_person=obj.username).exists()
        if vendor_equipment:
            return 'vendor'
        
        return 'user'

    def get_employee_stats(self, obj):
        """Get employee-specific statistics"""
        if not hasattr(obj, 'employee') or not obj.employee:
            return None
        
        employee = obj.employee
        created_requests = MaintenanceRequest.objects.filter(created_by=obj)
        assigned_requests = MaintenanceRequest.objects.filter(assigned_to=obj)
        
        return {
            'employee_id': employee.id,
            'name': employee.name,
            'position': employee.position,
            'department': {
                'id': employee.department.id,
                'name': employee.department.name,
            } if employee.department else None,
            'company': {
                'id': employee.department.company.id,
                'name': employee.department.company.name,
            } if employee.department and employee.department.company else None,
            'statistics': {
                'requests_created': created_requests.count(),
                'tasks_assigned': assigned_requests.count(),
                'tasks_completed': assigned_requests.filter(status='repaired').count(),
                'tasks_pending': assigned_requests.exclude(status__in=['repaired', 'scrap']).count(),
            },
            'assigned_equipment': Equipment.objects.filter(assigned_employee=employee).count(),
        }

    def get_vendor_info(self, obj):
        """Get vendor-specific information"""
        # Find vendor where user is the contact
        vendor = Vendor.objects.filter(contact_person=obj.username).first()
        if not vendor:
            return None
        
        supplied_equipment = Equipment.objects.filter(vendor=vendor)
        under_warranty = supplied_equipment.filter(warranty_expiry_date__gte=timezone.now().date())
        related_requests = MaintenanceRequest.objects.filter(equipment__vendor=vendor)
        
        return {
            'vendor_id': vendor.id,
            'vendor_name': vendor.name,
            'vendor_code': vendor.code,
            'contact_person': vendor.contact_person,
            'email': vendor.email,
            'phone': vendor.phone,
            'statistics': {
                'total_equipment_supplied': supplied_equipment.count(),
                'equipment_under_warranty': under_warranty.count(),
                'active_equipment': supplied_equipment.filter(is_active=True).count(),
                'service_requests': related_requests.count(),
                'open_requests': related_requests.exclude(status__in=['repaired', 'scrap']).count(),
            },
            'equipment_portfolio': list(supplied_equipment.values(
                'id', 'name', 'serial_number', 'is_active', 'warranty_expiry_date'
            )[:10])  # Top 10
        }

    def get_company_info(self, obj):
        """Get company representative information"""
        if not hasattr(obj, 'employee') or not obj.employee:
            return None
        
        employee = obj.employee
        if not employee.department or not employee.department.company:
            return None
        
        company = employee.department.company
        company_equipment = Equipment.objects.filter(company=company)
        company_requests = MaintenanceRequest.objects.filter(company=company)
        
        return {
            'company_id': company.id,
            'company_name': company.name,
            'company_code': company.code,
            'company_address': company.address,
            'company_phone': company.phone,
            'company_email': company.email,
            'statistics': {
                'total_departments': company.departments.count(),
                'total_employees': Employee.objects.filter(department__company=company).count(),
                'total_equipment': company_equipment.count(),
                'active_equipment': company_equipment.filter(is_active=True).count(),
                'work_centers': company.workcenters.count(),
                'maintenance_requests': company_requests.count(),
                'open_requests': company_requests.exclude(status__in=['repaired', 'scrap']).count(),
            },
            'departments': list(company.departments.values('id', 'name', 'description')[:10])
        }

    def get_leadership_info(self, obj):
        """Get team leadership information"""
        led_teams = obj.led_teams.all()
        if not led_teams.exists():
            return None
        
        teams_data = []
        for team in led_teams:
            team_requests = MaintenanceRequest.objects.filter(maintenance_team=team)
            teams_data.append({
                'team_id': team.id,
                'team_name': team.name,
                'description': team.description,
                'member_count': team.members.count(),
                'members': list(team.members.values('id', 'username', 'first_name', 'last_name')[:10]),
                'statistics': {
                    'total_requests': team_requests.count(),
                    'open_requests': team_requests.exclude(status__in=['repaired', 'scrap']).count(),
                    'completed_requests': team_requests.filter(status='repaired').count(),
                },
            })
        
        return {
            'teams_led': teams_data,
            'total_teams': len(teams_data),
        }

    def get_maintenance_stats(self, obj):
        """Get maintenance team member statistics"""
        teams = obj.maintenance_teams.all()
        if not teams.exists():
            return None
        
        assigned_equipment = Equipment.objects.filter(default_technician=obj)
        work_orders = MaintenanceRequest.objects.filter(assigned_to=obj)
        
        teams_data = []
        for team in teams:
            teams_data.append({
                'team_id': team.id,
                'team_name': team.name,
                'leader': team.leader.username if team.leader else None,
            })
        
        return {
            'teams': teams_data,
            'statistics': {
                'total_work_orders': work_orders.count(),
                'completed_work_orders': work_orders.filter(status='repaired').count(),
                'pending_work_orders': work_orders.exclude(status__in=['repaired', 'scrap']).count(),
                'assigned_equipment': assigned_equipment.count(),
            },
            'assigned_equipment_list': list(assigned_equipment.values(
                'id', 'name', 'serial_number', 'category__name'
            )[:10])
        }

    def get_admin_stats(self, obj):
        """Get admin/superuser statistics"""
        if not (obj.is_staff or obj.is_superuser):
            return None
        
        return {
            'system_overview': {
                'total_users': User.objects.count(),
                'total_companies': Company.objects.count(),
                'total_departments': Department.objects.count(),
                'total_equipment': Equipment.objects.count(),
                'total_requests': MaintenanceRequest.objects.count(),
                'total_teams': MaintenanceTeam.objects.count(),
            },
            'recent_statistics': {
                'users_this_month': User.objects.filter(
                    date_joined__gte=timezone.now() - timedelta(days=30)
                ).count(),
                'requests_this_month': MaintenanceRequest.objects.filter(
                    created_at__gte=timezone.now() - timedelta(days=30)
                ).count(),
            }
        }

    def get_recent_activities(self, obj):
        """Get recent activities for the user"""
        activities = []
        
        # Recent requests created
        created_requests = MaintenanceRequest.objects.filter(
            created_by=obj
        ).order_by('-created_at')[:5]
        
        for req in created_requests:
            activities.append({
                'type': 'request_created',
                'title': f"Created request: {req.name}",
                'date': req.created_at,
                'status': req.status,
                'id': req.id,
            })
        
        # Recent requests assigned
        assigned_requests = MaintenanceRequest.objects.filter(
            assigned_to=obj
        ).order_by('-updated_at')[:5]
        
        for req in assigned_requests:
            activities.append({
                'type': 'request_assigned',
                'title': f"Assigned to: {req.name}",
                'date': req.updated_at,
                'status': req.status,
                'id': req.id,
            })
        
        # Sort by date
        activities.sort(key=lambda x: x['date'], reverse=True)
        
        return activities[:10]  # Return top 10 most recent
