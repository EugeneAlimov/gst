# Generated by Django 5.0.4 on 2024-04-14 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_remove_chip_color_chip_color_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='is_have_description',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]