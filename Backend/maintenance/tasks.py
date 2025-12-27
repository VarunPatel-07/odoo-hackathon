from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def generate_scheduled_maintenance_requests():
    """
    Task to automatically generate maintenance requests from scheduled maintenances.
    This should run daily to check for scheduled maintenances that are due.
    """
    from .models import ScheduledMaintenance, MaintenanceRequest
    
    today = timezone.now().date()
    due_schedules = ScheduledMaintenance.objects.filter(
        is_active=True,
        next_run_date__lte=today
    )
    
    count = 0
    for scheduled in due_schedules:
        # Create maintenance request
        MaintenanceRequest.objects.create(
            subject=f"[Scheduled] {scheduled.name}",
            description=scheduled.description,
            request_type='preventive',
            scheduled_date=scheduled.next_run_date,
            equipment=scheduled.equipment,
            maintenance_team=scheduled.maintenance_team,
            assigned_to=scheduled.assigned_to,
        )
        
        # Update next run date
        scheduled.last_run_date = today
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
    
    return f"Generated {count} maintenance request(s) from scheduled maintenances."


@shared_task
def check_overdue_requests():
    """
    Task to check for overdue maintenance requests and send notifications.
    This should run daily.
    """
    from .models import MaintenanceRequest
    
    today = timezone.now().date()
    overdue_requests = MaintenanceRequest.objects.filter(
        scheduled_date__lt=today
    ).exclude(
        status__in=['repaired', 'scrap']
    )
    
    overdue_count = overdue_requests.count()
    
    # You can add email notification logic here
    # For now, just return the count
    return f"Found {overdue_count} overdue maintenance request(s)."


@shared_task
def check_warranty_expiry():
    """
    Task to check for equipment with warranties expiring soon.
    This should run weekly.
    """
    from .models import Equipment
    
    today = timezone.now().date()
    next_month = today + timedelta(days=30)
    
    expiring_soon = Equipment.objects.filter(
        is_active=True,
        warranty_expiry_date__gte=today,
        warranty_expiry_date__lte=next_month
    )
    
    return f"Found {expiring_soon.count()} equipment with warranty expiring within 30 days."


@shared_task
def cleanup_old_logs():
    """
    Task to clean up old maintenance logs (older than 1 year).
    This should run monthly.
    """
    from .models import MaintenanceLog
    
    one_year_ago = timezone.now() - timedelta(days=365)
    old_logs = MaintenanceLog.objects.filter(created_at__lt=one_year_ago)
    count = old_logs.count()
    old_logs.delete()
    
    return f"Deleted {count} old log entries."


@shared_task
def send_daily_summary():
    """
    Task to send daily summary email to administrators.
    This should run daily at end of day.
    """
    from .models import MaintenanceRequest, Equipment, ScheduledMaintenance
    
    today = timezone.now().date()
    tomorrow = today + timedelta(days=1)
    
    # Today's stats
    new_today = MaintenanceRequest.objects.filter(
        created_at__date=today
    ).count()
    
    completed_today = MaintenanceRequest.objects.filter(
        completion_date=today
    ).count()
    
    overdue = MaintenanceRequest.objects.filter(
        scheduled_date__lt=today
    ).exclude(
        status__in=['repaired', 'scrap']
    ).count()
    
    # Tomorrow's scheduled
    tomorrow_scheduled = ScheduledMaintenance.objects.filter(
        is_active=True,
        next_run_date=tomorrow
    ).count()
    
    summary = {
        'date': str(today),
        'new_requests': new_today,
        'completed_requests': completed_today,
        'overdue_requests': overdue,
        'scheduled_for_tomorrow': tomorrow_scheduled,
    }
    
    return summary
