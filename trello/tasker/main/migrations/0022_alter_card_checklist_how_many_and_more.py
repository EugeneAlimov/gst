# Generated by Django 5.0.4 on 2024-05-04 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_alter_card_date_time_finish_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='checklist_how_many',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Checklist how many'),
        ),
        migrations.AlterField(
            model_name='card',
            name='comments_how_many',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Comments how many'),
        ),
        migrations.AlterField(
            model_name='card',
            name='created',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created'),
        ),
        migrations.AlterField(
            model_name='card',
            name='header_image',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='', verbose_name='Header image'),
        ),
        migrations.AlterField(
            model_name='card',
            name='in_process',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='In process'),
        ),
        migrations.AlterField(
            model_name='card',
            name='is_archived',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='Is archived'),
        ),
        migrations.AlterField(
            model_name='card',
            name='is_have_description',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='Is have description'),
        ),
        migrations.AlterField(
            model_name='card',
            name='is_subscribed',
            field=models.BooleanField(blank=True, default=True, null=True, verbose_name='Subscribed'),
        ),
        migrations.AlterField(
            model_name='card',
            name='updated',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated'),
        ),
    ]
