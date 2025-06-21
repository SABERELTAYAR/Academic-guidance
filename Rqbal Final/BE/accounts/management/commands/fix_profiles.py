from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import CustomUser, AdminProfile, ProfessorProfile, AssistantProfile, StudentProfile

class Command(BaseCommand):
    help = 'Creates missing profiles for users'

    def handle(self, *args, **options):
        with transaction.atomic():
            users = CustomUser.objects.all()
            for user in users:
                profile = user.get_profile()
                if not profile:
                    full_name = f"{user.first_name} {user.last_name}".strip() or user.username
                    
                    if user.user_type == 'admin':
                        AdminProfile.objects.get_or_create(
                            user=user,
                            defaults={
                                'full_name': full_name,
                                'email': user.email
                            }
                        )
                        self.stdout.write(self.style.SUCCESS(f'Created admin profile for {user.username}'))
                    
                    elif user.user_type == 'professor':
                        ProfessorProfile.objects.get_or_create(
                            user=user,
                            defaults={
                                'full_name': full_name,
                                'email': user.email
                            }
                        )
                        self.stdout.write(self.style.SUCCESS(f'Created professor profile for {user.username}'))
                    
                    elif user.user_type == 'assistant':
                        AssistantProfile.objects.get_or_create(
                            user=user,
                            defaults={
                                'full_name': full_name,
                                'email': user.email
                            }
                        )
                        self.stdout.write(self.style.SUCCESS(f'Created assistant profile for {user.username}'))
                    
                    elif user.user_type == 'student':
                        StudentProfile.objects.get_or_create(
                            user=user,
                            defaults={
                                'full_name': full_name,
                                'email': user.email
                            }
                        )
                        self.stdout.write(self.style.SUCCESS(f'Created student profile for {user.username}'))
                else:
                    self.stdout.write(f'Profile already exists for {user.username}') 