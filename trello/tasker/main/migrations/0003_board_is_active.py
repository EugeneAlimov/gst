# Generated by Django 5.0.4 on 2024-04-10 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_alter_userprofile_options_alter_column_board'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='is_active',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
