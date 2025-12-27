from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import (
    Company, Department, Vendor, Employee, WorkCenter,
    MaintenanceTeam, EquipmentCategory, Equipment, 
    MaintenanceRequest, MaintenanceLog, ScheduledMaintenance
)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'phone', 'email', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code', 'email']
    ordering = ['name']


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'contact_person', 'email', 'phone', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code', 'contact_person', 'email']
    ordering = ['name']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'description', 'employee_count', 'created_at']
    list_filter = ['company']
    search_fields = ['name', 'description']
    autocomplete_fields = ['company']
    ordering = ['name']

    def employee_count(self, obj):
        return obj.employees.count()
    employee_count.short_description = 'Employees'


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'department', 'position', 'user', 'created_at']
    list_filter = ['department']
    search_fields = ['name', 'email', 'position']
    autocomplete_fields = ['user', 'department']
    ordering = ['name']


@admin.register(WorkCenter)
class WorkCenterAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'costs_hour', 'time_efficiency', 'oee_target', 'company', 'is_active', 'created_at']
    list_filter = ['is_active', 'company']
    search_fields = ['name', 'code', 'description']
    filter_horizontal = ['alternative_workcenters']
    autocomplete_fields = ['company']
    ordering = ['name']


@admin.register(MaintenanceTeam)
class MaintenanceTeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'leader', 'company', 'member_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'company']
    search_fields = ['name', 'description']
    filter_horizontal = ['members']
    autocomplete_fields = ['leader', 'company']
    ordering = ['name']

    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = 'Members'


@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'default_maintenance_team', 'responsible_user', 'company', 'equipment_count', 'created_at']
    list_filter = ['company']
    search_fields = ['name', 'description']
    autocomplete_fields = ['default_maintenance_team', 'responsible_user', 'company']
    ordering = ['name']

    def equipment_count(self, obj):
        return obj.equipment.count()
    equipment_count.short_description = 'Equipment'


class MaintenanceRequestInline(admin.TabularInline):
    model = MaintenanceRequest
    extra = 0
    fields = ['name', 'request_type', 'status', 'scheduled_date', 'assigned_to']
    readonly_fields = ['name', 'request_type', 'status', 'scheduled_date', 'assigned_to']
    show_change_link = True
    can_delete = False
    fk_name = 'equipment'

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'serial_number', 'category', 'location', 'work_center',
        'maintenance_team', 'is_active_display', 'open_requests_count', 'warranty_status'
    ]
    list_filter = ['is_active', 'category', 'department', 'maintenance_team', 'company', 'work_center']
    search_fields = ['name', 'serial_number', 'location']
    autocomplete_fields = ['category', 'department', 'assigned_employee', 'maintenance_team', 'default_technician', 'work_center', 'vendor', 'company']
    readonly_fields = ['created_at', 'updated_at', 'warranty_status_full', 'open_requests_link']
    inlines = [MaintenanceRequestInline]
    ordering = ['name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'serial_number', 'category', 'location', 'image', 'description')
        }),
        ('Work Center', {
            'fields': ('work_center',)
        }),
        ('Vendor & Warranty', {
            'fields': ('vendor', 'purchase_date', 'warranty_expiry_date', 'warranty_status_full')
        }),
        ('Ownership', {
            'fields': ('department', 'assigned_employee', 'assign_date')
        }),
        ('Maintenance Assignment', {
            'fields': ('maintenance_team', 'default_technician')
        }),
        ('Status', {
            'fields': ('is_active', 'scrap_date', 'notes', 'open_requests_link')
        }),
        ('Company', {
            'fields': ('company',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def is_active_display(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">✓ Active</span>')
        return format_html('<span style="color: red;">✗ Inactive</span>')
    is_active_display.short_description = 'Status'

    def warranty_status(self, obj):
        if obj.is_under_warranty:
            return format_html('<span style="color: green;">Under Warranty</span>')
        return format_html('<span style="color: gray;">Expired/None</span>')
    warranty_status.short_description = 'Warranty'

    def warranty_status_full(self, obj):
        if obj.warranty_expiry_date:
            if obj.is_under_warranty:
                days_left = (obj.warranty_expiry_date - timezone.now().date()).days
                return f"Under warranty - {days_left} days remaining (expires {obj.warranty_expiry_date})"
            return f"Expired on {obj.warranty_expiry_date}"
        return "No warranty information"
    warranty_status_full.short_description = 'Warranty Status'

    def open_requests_count(self, obj):
        count = obj.open_maintenance_count
        if count > 0:
            return format_html('<span style="color: orange; font-weight: bold;">{}</span>', count)
        return count
    open_requests_count.short_description = 'Open Requests'

    def open_requests_link(self, obj):
        count = obj.open_maintenance_count
        if count > 0:
            url = reverse('admin:maintenance_maintenancerequest_changelist') + f'?equipment__id__exact={obj.id}'
            return format_html('<a href="{}">{} open request(s)</a>', url, count)
        return "No open requests"
    open_requests_link.short_description = 'Maintenance Requests'


class MaintenanceLogInline(admin.TabularInline):
    model = MaintenanceLog
    extra = 0
    readonly_fields = ['user', 'action', 'old_status', 'new_status', 'notes', 'created_at']
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'equipment', 'work_center', 'request_type', 'priority',
        'status_display', 'scheduled_date', 'assigned_to', 'is_overdue_display'
    ]
    list_filter = ['status', 'request_type', 'priority', 'maintenance_team', 'company', 'created_at']
    search_fields = ['name', 'description', 'equipment__name', 'equipment__serial_number', 'work_center__name']
    autocomplete_fields = ['equipment', 'work_center', 'maintenance_team', 'assigned_to', 'created_by', 'company']
    readonly_fields = ['equipment_category', 'created_by', 'request_date', 'color', 'created_at', 'updated_at', 'is_overdue_display']
    inlines = [MaintenanceLogInline]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    fieldsets = (
        ('Request Details', {
            'fields': ('name', 'description', 'request_type', 'priority', 'color')
        }),
        ('Equipment / Work Center', {
            'fields': ('equipment', 'work_center', 'equipment_category'),
            'description': 'Select either Equipment OR Work Center for this maintenance request.'
        }),
        ('Assignment', {
            'fields': ('maintenance_team', 'assigned_to')
        }),
        ('Scheduling', {
            'fields': ('request_date', 'scheduled_date', 'completion_date', 'duration', 'is_overdue_display')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Company', {
            'fields': ('company',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_display(self, obj):
        colors = {
            'new': 'blue',
            'in_progress': 'orange',
            'repaired': 'green',
            'scrap': 'red'
        }
        color = colors.get(obj.status, 'gray')
        return format_html('<span style="color: {};">{}</span>', color, obj.get_status_display())
    status_display.short_description = 'Status'

    def is_overdue_display(self, obj):
        if obj.is_overdue:
            return format_html('<span style="color: red; font-weight: bold;">⚠ OVERDUE</span>')
        return format_html('<span style="color: green;">On Track</span>')
    is_overdue_display.short_description = 'Overdue Status'

    def save_model(self, request, obj, form, change):
        if not change:  # New object
            obj.created_by = request.user
        
        # Track status change for logging
        old_status = None
        if change and 'status' in form.changed_data:
            old_status = MaintenanceRequest.objects.get(pk=obj.pk).status
        
        super().save_model(request, obj, form, change)
        
        # Create log entry for status change
        if old_status and old_status != obj.status:
            MaintenanceLog.objects.create(
                request=obj,
                user=request.user,
                action='Status Changed (Admin)',
                old_status=old_status,
                new_status=obj.status,
                notes=f"Status changed via admin panel"
            )


@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = ['request', 'user', 'action', 'old_status', 'new_status', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['request__subject', 'user__username', 'notes']
    readonly_fields = ['request', 'user', 'action', 'old_status', 'new_status', 'notes', 'created_at']
    ordering = ['-created_at']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(ScheduledMaintenance)
class ScheduledMaintenanceAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'equipment', 'frequency', 'next_run_date',
        'last_run_date', 'is_active', 'days_until_next'
    ]
    list_filter = ['frequency', 'is_active', 'maintenance_team']
    search_fields = ['name', 'description', 'equipment__name']
    autocomplete_fields = ['equipment', 'maintenance_team', 'assigned_to']
    readonly_fields = ['last_run_date', 'created_at', 'updated_at']
    ordering = ['next_run_date']
    actions = ['generate_requests', 'activate_schedules', 'deactivate_schedules']

    fieldsets = (
        ('Schedule Details', {
            'fields': ('name', 'description', 'frequency')
        }),
        ('Equipment', {
            'fields': ('equipment',)
        }),
        ('Assignment', {
            'fields': ('maintenance_team', 'assigned_to')
        }),
        ('Scheduling', {
            'fields': ('next_run_date', 'last_run_date', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def days_until_next(self, obj):
        if obj.next_run_date:
            days = (obj.next_run_date - timezone.now().date()).days
            if days < 0:
                return format_html('<span style="color: red;">Overdue by {} days</span>', abs(days))
            elif days == 0:
                return format_html('<span style="color: orange;">Today</span>')
            elif days <= 7:
                return format_html('<span style="color: orange;">{} days</span>', days)
            return f"{days} days"
        return "-"
    days_until_next.short_description = 'Days Until Next'

    @admin.action(description="Generate maintenance requests for selected schedules")
    def generate_requests(self, request, queryset):
        from datetime import timedelta
        count = 0
        for scheduled in queryset.filter(is_active=True):
            # Create maintenance request
            MaintenanceRequest.objects.create(
                subject=f"[Scheduled] {scheduled.name}",
                description=scheduled.description,
                request_type='preventive',
                scheduled_date=scheduled.next_run_date,
                equipment=scheduled.equipment,
                maintenance_team=scheduled.maintenance_team,
                assigned_to=scheduled.assigned_to,
                created_by=request.user,
            )
            
            # Update next run date
            scheduled.last_run_date = timezone.now().date()
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
            count += 1
        
        self.message_user(request, f"Generated {count} maintenance request(s).")

    @admin.action(description="Activate selected schedules")
    def activate_schedules(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"Activated {updated} schedule(s).")

    @admin.action(description="Deactivate selected schedules")
    def deactivate_schedules(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"Deactivated {updated} schedule(s).")


# Customize admin site header
admin.site.site_header = "GearGuard Maintenance Tracker"
admin.site.site_title = "GearGuard Admin"
admin.site.index_title = "Maintenance Management Dashboard"

