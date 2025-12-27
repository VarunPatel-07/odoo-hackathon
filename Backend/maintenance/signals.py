from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import MaintenanceRequest, Equipment, MaintenanceLog


@receiver(pre_save, sender=MaintenanceRequest)
def auto_fill_equipment_data(sender, instance, **kwargs):
    """
    Auto-fill maintenance team and category from equipment when creating a request.
    This implements the On Creation auto-fill logic.
    """
    if instance.equipment:
        # Auto-fill maintenance team if not set
        if not instance.maintenance_team and instance.equipment.maintenance_team:
            instance.maintenance_team = instance.equipment.maintenance_team
        
        # Auto-fill equipment category if not set
        if not instance.equipment_category and instance.equipment.category:
            instance.equipment_category = instance.equipment.category
        
        # Auto-fill company if not set
        if not instance.company and instance.equipment.company:
            instance.company = instance.equipment.company
    
    elif instance.work_center:
        # Auto-fill company from work center
        if not instance.company and instance.work_center.company:
            instance.company = instance.work_center.company


@receiver(pre_save, sender=MaintenanceRequest)
def handle_status_changes(sender, instance, **kwargs):
    """
    Handle status change logic:
    - Set completion date when status changes to repaired
    - Mark equipment as inactive when status changes to scrap
    - Update color based on status
    """
    if instance.pk:  # Only for existing instances
        try:
            old_instance = MaintenanceRequest.objects.get(pk=instance.pk)
            old_status = old_instance.status
            new_status = instance.status
            
            if old_status != new_status:
                # Handle completion
                if new_status == 'repaired' and not instance.completion_date:
                    instance.completion_date = timezone.now().date()
                
                # Handle scrap - mark equipment as inactive
                if new_status == 'scrap' and instance.equipment:
                    equipment = instance.equipment
                    equipment.is_active = False
                    equipment.scrap_date = timezone.now().date()
                    equipment.notes += f"\n[{timezone.now().date()}] Equipment scrapped via maintenance request #{instance.pk}"
                    equipment.save()
        except MaintenanceRequest.DoesNotExist:
            pass
    
    # Update color based on status and overdue
    if instance.is_overdue:
        instance.color = 1  # Red for overdue
    elif instance.status == 'in_progress':
        instance.color = 4  # Blue for in progress
    elif instance.status == 'repaired':
        instance.color = 10  # Green for completed
    elif instance.status == 'scrap':
        instance.color = 1  # Red for scrap
    else:
        instance.color = 0  # Default


@receiver(post_save, sender=MaintenanceRequest)
def log_request_creation(sender, instance, created, **kwargs):
    """
    Create a log entry when a maintenance request is created.
    """
    if created:
        MaintenanceLog.objects.create(
            request=instance,
            user=instance.created_by,
            action='Created',
            new_status=instance.status,
            notes=f"Maintenance request created: {instance.name}"
        )


@receiver(post_save, sender=Equipment)
def log_equipment_status_change(sender, instance, created, **kwargs):
    """
    Log when equipment is marked as inactive.
    """
    if not created and not instance.is_active:
        # Check if there's a recent scrap request
        recent_scrap = MaintenanceRequest.objects.filter(
            equipment=instance,
            status='scrap'
        ).order_by('-updated_at').first()
        
        if recent_scrap:
            MaintenanceLog.objects.get_or_create(
                request=recent_scrap,
                action='Equipment Scrapped',
                defaults={
                    'notes': f"Equipment {instance.name} marked as inactive/scrapped"
                }
            )
