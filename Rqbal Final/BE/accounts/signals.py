from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import CustomUser, AdminProfile, ProfessorProfile, AssistantProfile, StudentProfile
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to create the appropriate profile when a user is created
    """
    try:
        with transaction.atomic():
            # Check if profile already exists
            profile = instance.get_profile()
            if profile:
                logger.info(f"Profile already exists for user {instance.username}")
                return

            full_name = f"{instance.first_name} {instance.last_name}".strip() or instance.username
            
            if instance.user_type == 'admin':
                AdminProfile.objects.get_or_create(
                    user=instance,
                    defaults={
                        'full_name': full_name,
                        'email': instance.email
                    }
                )
                logger.info(f"Created admin profile for {instance.username}")
            
            elif instance.user_type == 'professor':
                ProfessorProfile.objects.get_or_create(
                    user=instance,
                    defaults={
                        'full_name': full_name,
                        'email': instance.email
                    }
                )
                logger.info(f"Created professor profile for {instance.username}")
            
            elif instance.user_type == 'assistant':
                AssistantProfile.objects.get_or_create(
                    user=instance,
                    defaults={
                        'full_name': full_name,
                        'email': instance.email
                    }
                )
                logger.info(f"Created assistant profile for {instance.username}")
            
            elif instance.user_type == 'student':
                StudentProfile.objects.get_or_create(
                    user=instance,
                    defaults={
                        'full_name': full_name,
                        'email': instance.email
                    }
                )
                logger.info(f"Created student profile for {instance.username}")
    except Exception as e:
        logger.error(f"Error creating profile for {instance.username}: {str(e)}")
        raise

@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal to save the user's profile whenever the user is saved
    """
    try:
        profile = instance.get_profile()
        if profile:
            profile.save()
            logger.info(f"Saved profile for {instance.username}")
    except Exception as e:
        logger.error(f"Error saving profile for {instance.username}: {str(e)}")
        raise 