# Generated by Django 5.0.3 on 2024-03-04 17:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('banner', models.ImageField(default='user_banner.jpg', upload_to='user_banner/')),
                ('profile_picture', models.ImageField(default='user_banner.jpg', upload_to='user_banner/')),
                ('joining_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('biography', models.TextField(blank=True, default=None, max_length=100, null=True)),
                ('location', models.TextField(blank=True, default=None, max_length=200, null=True)),
                ('private', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
