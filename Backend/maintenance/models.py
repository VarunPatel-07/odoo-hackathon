from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError


class Company(models.Model):
    """Company model for multi-company support"""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['name']


class Department(models.Model):
    """Department model for equipment ownership tracking"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='departments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Vendor(models.Model):
    """Vendor/Partner model for warranty and supplier tracking"""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, blank=True)
    contact_person = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    website = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Employee(models.Model):
    """Employee model for equipment ownership tracking"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    position = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='employee_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class WorkCenter(models.Model):
    """Work Center model for manufacturing lines"""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, blank=True)
    alternative_workcenters = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='backup_for'
    )
    costs_hour = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Cost per hour"
    )
    time_efficiency = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100,
        help_text="Capacity time efficiency percentage"
    )
    oee_target = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=90,
        help_text="Overall Equipment Effectiveness target percentage"
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='workcenters'
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})" if self.code else self.name

    class Meta:
        verbose_name = "Work Center"
        verbose_name_plural = "Work Centers"
        ordering = ['name']


class MaintenanceTeam(models.Model):
    """Maintenance Team model for managing specialized groups (e.g., Mechanics, Electricians)"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(User, related_name='maintenance_teams', blank=True)
    leader = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_teams')
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='maintenance_teams'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

    @property
    def member_count(self):
        return self.members.count()


class EquipmentCategory(models.Model):
    """Category for equipment classification"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    default_maintenance_team = models.ForeignKey(
        MaintenanceTeam, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='equipment_categories'
    )
    responsible_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='responsible_categories',
        help_text="Manager responsible for this category of assets"
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='equipment_categories'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Equipment Categories"
        ordering = ['name']


class Equipment(models.Model):
    """Equipment model - central database for assets"""
    name = models.CharField(max_length=200)
    serial_number = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(
        EquipmentCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='equipment'
    )
    
    # Dates
    purchase_date = models.DateField(null=True, blank=True)
    warranty_expiry_date = models.DateField(null=True, blank=True, help_text="Warranty expiration date")
    assign_date = models.DateField(null=True, blank=True, help_text="Date equipment was assigned to current owner")
    scrap_date = models.DateField(null=True, blank=True, help_text="Date when equipment was scrapped")
    
    # Location and Work Center
    location = models.CharField(max_length=200, blank=True, help_text="Physical location of the machine")
    work_center = models.ForeignKey(
        WorkCenter,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipment',
        help_text="Work center if equipment is part of a manufacturing line"
    )
    
    # Vendor/Partner for warranty
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipment',
        help_text="Vendor or manufacturer linked to warranty"
    )
    
    # Owner/Tracking - either Department or Employee
    department = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='equipment'
    )
    assigned_employee = models.ForeignKey(
        Employee, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='equipment'
    )
    
    # Maintenance Assignment
    maintenance_team = models.ForeignKey(
        MaintenanceTeam, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='equipment'
    )
    default_technician = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_equipment'
    )
    
    # Status and Details
    is_active = models.BooleanField(default=True, help_text="Whether the equipment is usable")
    description = models.TextField(blank=True, help_text="Internal notes or description of the asset")
    notes = models.TextField(blank=True)
    image = models.ImageField(upload_to='equipment_images/', null=True, blank=True)
    
    # Company
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='equipment'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Equipment"

    @property
    def is_under_warranty(self):
        """Check if equipment is currently under warranty"""
        if self.warranty_expiry_date:
            return self.warranty_expiry_date >= timezone.now().date()
        return False

    @property
    def open_maintenance_count(self):
        """Count of open maintenance requests for this equipment"""
        return self.maintenance_requests.exclude(
            status__in=['repaired', 'scrap']
        ).count()

    def get_open_requests(self):
        """Get all open maintenance requests for this equipment"""
        return self.maintenance_requests.exclude(
            status__in=['repaired', 'scrap']
        )


class MaintenanceRequest(models.Model):
    """Maintenance Request model - handles the repair lifecycle"""
    
    REQUEST_TYPE_CHOICES = [
        ('corrective', 'Corrective (Breakdown)'),
        ('preventive', 'Preventive (Routine)'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('repaired', 'Repaired'),
        ('scrap', 'Scrap'),
    ]
    
    PRIORITY_CHOICES = [
        (0, 'No Priority'),
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Critical'),
    ]

    # Basic fields
    name = models.CharField(max_length=200, default='', help_text="Subject/Description of the issue")
    description = models.TextField(blank=True)
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, default='corrective')
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=0, help_text="Importance level (star rating)")
    color = models.IntegerField(default=0, help_text="Color index for Kanban view")
    
    # Scheduling
    request_date = models.DateField(auto_now_add=True, help_text="Date the request was created")
    scheduled_date = models.DateTimeField(null=True, blank=True, help_text="When the work is planned to happen")
    completion_date = models.DateField(null=True, blank=True)
    duration = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Hours spent on repair"
    )
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    # Equipment or Work Center (alternative)
    equipment = models.ForeignKey(
        Equipment, 
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='maintenance_requests'
    )
    work_center = models.ForeignKey(
        WorkCenter,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='maintenance_requests',
        help_text="Alternative to Equipment - for work center maintenance"
    )
    
    # Team and Assignment
    maintenance_team = models.ForeignKey(
        MaintenanceTeam, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='maintenance_requests'
    )
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_requests',
        help_text="Technician or Manager responsible for the ticket"
    )
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_requests'
    )
    
    # Auto-fetched from equipment
    equipment_category = models.ForeignKey(
        EquipmentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='maintenance_requests'
    )
    
    # Company
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='maintenance_requests'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        target = self.equipment.name if self.equipment else (self.work_center.name if self.work_center else "Unknown")
        return f"{self.name} - {target}"

    class Meta:
        ordering = ['-created_at']

    @property
    def is_overdue(self):
        """Check if the request is overdue"""
        if self.scheduled_date and self.status not in ['repaired', 'scrap']:
            return self.scheduled_date.date() < timezone.now().date()
        return False

    def clean(self):
        """Validate the request"""
        # Must have either equipment or work_center
        if not self.equipment and not self.work_center:
            raise ValidationError('Either Equipment or Work Center must be specified.')
        
        # Validate that assigned_to belongs to the maintenance team
        if self.assigned_to and self.maintenance_team:
            if not self.maintenance_team.members.filter(id=self.assigned_to.id).exists():
                raise ValidationError({
                    'assigned_to': 'The assigned technician must be a member of the maintenance team.'
                })
        
        # Require duration when marking as repaired
        if self.status == 'repaired' and not self.duration:
            raise ValidationError({
                'duration': 'Duration is required when marking a request as repaired.'
            })

    def save(self, *args, **kwargs):
        # Auto-fill logic: populate team and category from equipment
        if self.equipment:
            if not self.maintenance_team:
                self.maintenance_team = self.equipment.maintenance_team
            if not self.equipment_category:
                self.equipment_category = self.equipment.category
            if not self.company:
                self.company = self.equipment.company
        elif self.work_center:
            if not self.company:
                self.company = self.work_center.company
        
        # Update color based on overdue status
        if self.is_overdue:
            self.color = 1  # Red for overdue
        elif self.status == 'in_progress':
            self.color = 4  # Blue for in progress
        elif self.status == 'repaired':
            self.color = 10  # Green for completed
        
        # Handle scrap logic
        if self.status == 'scrap':
            if self.equipment:
                self.equipment.is_active = False
                self.equipment.scrap_date = timezone.now().date()
                self.equipment.notes += f"\n[{timezone.now().date()}] Equipment scrapped via maintenance request #{self.pk or 'new'}"
                self.equipment.save()
        
        # Set completion date when repaired
        if self.status == 'repaired' and not self.completion_date:
            self.completion_date = timezone.now().date()
        
        super().save(*args, **kwargs)


class MaintenanceLog(models.Model):
    """Log entries for maintenance request status changes"""
    request = models.ForeignKey(
        MaintenanceRequest,
        on_delete=models.CASCADE,
        related_name='logs'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    action = models.CharField(max_length=100)
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.request} - {self.action}"

    class Meta:
        ordering = ['-created_at']


class ScheduledMaintenance(models.Model):
    """Model for recurring/scheduled preventive maintenance"""
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]

    name = models.CharField(max_length=200)
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='scheduled_maintenances'
    )
    description = models.TextField(blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    next_run_date = models.DateField()
    last_run_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    maintenance_team = models.ForeignKey(
        MaintenanceTeam,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.equipment.name} ({self.frequency})"

    class Meta:
        ordering = ['next_run_date']
        verbose_name_plural = "Scheduled Maintenances"
