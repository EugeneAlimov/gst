# Generated by Django 5.0.4 on 2024-04-13 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_remove_color_card_color_card'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chip',
            name='color',
        ),
        migrations.RemoveField(
            model_name='color',
            name='card',
        ),
        migrations.AddField(
            model_name='color',
            name='chip',
            field=models.ManyToManyField(blank=True, default=None, null=True, to='main.chip'),
        ),
    ]