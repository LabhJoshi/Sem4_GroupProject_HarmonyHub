# Generated by Django 5.1.1 on 2024-09-26 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artist', '0003_likedsong_delete_likedartist'),
    ]

    operations = [
        migrations.CreateModel(
            name='LikedArtist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('image_url', models.URLField()),
                ('followers', models.IntegerField()),
            ],
        ),
        migrations.DeleteModel(
            name='LikedSong',
        ),
    ]
