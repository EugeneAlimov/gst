# Generated by Django 5.0.4 on 2024-05-10 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0024_alter_card_date_time_finish_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='roles',
            field=models.IntegerField(blank=True, default=3, null=True),
        ),
    ]
