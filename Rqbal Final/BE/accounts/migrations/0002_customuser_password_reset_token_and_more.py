# Generated by Django 5.1.4 on 2025-06-07 00:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='password_reset_token',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='password_reset_token_created',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
