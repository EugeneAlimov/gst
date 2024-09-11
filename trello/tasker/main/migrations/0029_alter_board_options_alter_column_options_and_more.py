# Generated by Django 5.0.4 on 2024-05-10 13:11

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0028_alter_column_board_alter_column_name_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='board',
            options={'verbose_name': 'Доска', 'verbose_name_plural': 'Доски'},
        ),
        migrations.AlterModelOptions(
            name='column',
            options={'verbose_name': 'Колонка', 'verbose_name_plural': 'Колонки'},
        ),
        migrations.AlterField(
            model_name='board',
            name='is_active',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='Активна'),
        ),
        migrations.AlterField(
            model_name='board',
            name='name',
            field=models.CharField(blank=True, default=None, max_length=100, null=True, verbose_name='Название'),
        ),
        migrations.AlterField(
            model_name='board',
            name='user',
            field=models.ManyToManyField(blank=True, default=None, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
        ),
    ]
