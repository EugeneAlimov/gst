from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models


class UserProfile(AbstractUser, PermissionsMixin):
    active_board = models.IntegerField(blank=True, null=True, default=1, verbose_name='Активная доска')
    roles = models.IntegerField(blank=True, null=True, default=3, verbose_name='Роль')
    photo = models.ImageField(blank=True, null=True, default=None, verbose_name='Фото пользователя')
    user_information = models.CharField(max_length=1000, blank=True, null=True, default=None,
                                        verbose_name='Информация о пользователе')

    def __str__(self):
        return "%s" % self.username

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'


class Board(models.Model):
    user = models.ManyToManyField(UserProfile, blank=True, default=None, verbose_name='Пользователь')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100, blank=True, null=True, default=None, verbose_name='Название')
    is_active = models.BooleanField(blank=True, null=True, default=False, verbose_name='Активна')

    def __str__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = 'Доска'
        verbose_name_plural = 'Доски'


class Column(models.Model):
    board = models.ForeignKey(Board, blank=True, null=True, default=None, verbose_name='На какой доске',
                              on_delete=models.CASCADE, related_name='board')
    name = models.CharField(max_length=100, blank=True, null=True, default=None, verbose_name='Название колонки')
    position_on_board = models.IntegerField(blank=True, null=True, default=None, verbose_name='Позиция на доске')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = 'Колонка'
        verbose_name_plural = 'Колонки'


class Card(models.Model):
    user = models.ManyToManyField(UserProfile, blank=True, default=None, verbose_name='User')
    board = models.ForeignKey(Board, blank=True, null=True, default=None, verbose_name='Board',
                              on_delete=models.CASCADE)
    # column = models.ManyToManyField(Column, verbose_name='Column', blank=True, default=None,
    #                                 related_name='column_name')
    name = models.CharField(max_length=100, blank=True, null=True, default=None, verbose_name='Name')
    header_color = models.CharField(max_length=100, blank=True, null=True, default=None, verbose_name='Header color')
    text = models.CharField(max_length=5000, blank=True, null=True, default=None, verbose_name='Text card')
    # position_in_column = models.IntegerField(blank=True, null=True, default=1, verbose_name='Position in column')
    status = models.IntegerField(blank=True, null=True, default=0, verbose_name='Status')
    comments_how_many = models.IntegerField(blank=True, null=True, default=0, verbose_name='Comments how many')
    checklist_how_many = models.IntegerField(blank=True, null=True, default=0, verbose_name='Checklist how many')
    date_time_start = models.DateTimeField(blank=True, null=True, default='1970-01-01T00:00:00.000Z',
                                           verbose_name='Start')
    date_time_finish = models.DateTimeField(blank=True, null=True, default='1970-01-01T00:00:00.000Z',
                                            verbose_name='End')
    date_time_reminder = models.DateTimeField(blank=True, null=True, default='1970-01-01T00:00:00.000Z',
                                              verbose_name='Remind')
    created = models.DateTimeField(auto_now_add=True, verbose_name='Created')
    updated = models.DateTimeField(auto_now=True, verbose_name='Updated')
    is_subscribed = models.BooleanField(blank=True, null=True, default=True, verbose_name='Subscribed')
    in_process = models.BooleanField(blank=True, null=True, default=False, verbose_name='In process')
    is_archived = models.BooleanField(blank=True, null=True, default=False, verbose_name='Is archived')
    is_have_description = models.BooleanField(blank=True, null=True, default=False, verbose_name='Is have description')
    header_image = models.ImageField(blank=True, null=True, default=None, verbose_name='Header image')

    def __str__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = 'Card'
        verbose_name_plural = 'Cards'


class CardInColumn(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_in_columns')
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    position_in_column = models.IntegerField(default=0)  # Позиция карточки в колонке

    class Meta:
        unique_together = ('card', 'column')  # Уникальная комбинация карточки и колонки


class Chip(models.Model):
    card = models.ManyToManyField(Card, blank=True, default=None, verbose_name='Card')
    text = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Chip text')
    color_number = models.IntegerField(blank=True, null=True, default=0, verbose_name='Chip color number')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s" % self.text

    class Meta:
        verbose_name = 'Chip'
        verbose_name_plural = 'Chips'


class Color(models.Model):
    color = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Color')
    hover_color = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Hover color')
    color_name = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Color name')
    color_number = models.IntegerField(blank=True, null=True, default=None, verbose_name='Color number')

    def __str__(self):
        return "%s" % self.color

    class Meta:
        verbose_name = 'Color'
        verbose_name_plural = 'Colors'


class Comment(models.Model):
    card = models.ForeignKey(Card, blank=True, null=True, default=None, on_delete=models.CASCADE)
    text = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Comment text')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s" % self.text

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comment'


search_fields = ['username', 'email', 'phone_number', 'address']


class ChecklistItem(models.Model):
    card = models.ForeignKey(Card, verbose_name='Card', blank=True, null=True, default=None,
                             on_delete=models.CASCADE)
    is_checked = models.BooleanField(blank=True, null=True, default=False, verbose_name='is checked')
    text = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Checkbox item text')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s" % self.text

    class Meta:
        verbose_name = 'Checkbox item'
        verbose_name_plural = 'Checkbox items'
