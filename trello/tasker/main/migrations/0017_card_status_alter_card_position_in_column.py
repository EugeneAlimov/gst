# Generated by Django 5.0.4 on 2024-04-14 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_card_is_have_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='status',
            field=models.IntegerField(blank=True, default=1, null=True, verbose_name='Status'),
        ),
        migrations.AlterField(
            model_name='card',
            name='position_in_column',
            field=models.IntegerField(blank=True, default=1, null=True, verbose_name='Position in column'),
        ),
    ]
