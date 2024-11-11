# Generated by Django 5.1.1 on 2024-09-26 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artist', '0004_likedartist_delete_likedsong'),
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artist_name', models.CharField(max_length=255)),
                ('artist_image', models.URLField()),
                ('artist_followers', models.IntegerField(default=0)),
                ('track_name', models.CharField(max_length=255)),
                ('album_name', models.CharField(max_length=255)),
                ('duration', models.IntegerField()),
                ('track_url', models.URLField()),
            ],
        ),
        migrations.DeleteModel(
            name='LikedArtist',
        ),
    ]