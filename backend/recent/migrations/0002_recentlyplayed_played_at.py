# Generated by Django 5.1 on 2024-08-31 17:42

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recent', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recentlyplayed',
            name='played_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
