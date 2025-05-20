from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models


from django.contrib.auth.models import AbstractUser
from django.db import models

class UserProfile(AbstractUser):
    """
    Расширенная модель пользователя с дополнительными полями.
    """
    active_board = models.ForeignKey(
        'Board',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='active_users',
        verbose_name='Активная доска'
    )
    photo = models.ImageField(
        upload_to='user_photos/',
        blank=True, null=True,
        verbose_name='Фото пользователя'
    )
    user_information = models.TextField(
        blank=True, null=True,
        verbose_name='Информация о пользователе'
    )

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'

    def __str__(self):
        return self.username

class Board(models.Model):
    """
    Канбан-доска. Поле user используется вместо owner для сохранения совместимости.
    """
    user = models.ForeignKey(  # Сохраняем имя поля как в админке
        UserProfile,
        on_delete=models.CASCADE,
        related_name='boards',
        verbose_name='Пользователь'  # Владелец доски
    )
    name = models.CharField(
        max_length=255,
        verbose_name='Название доски'
    )
    is_active = models.BooleanField(  # Добавляем в соответствии с админкой
        default=False,
        verbose_name='Активная доска'
    )
    created = models.DateTimeField(  # Используем те же названия полей
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated = models.DateTimeField(  # Используем те же названия полей
        auto_now=True,
        verbose_name='Дата обновления'
    )
    background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        verbose_name='Цвет фона'
    )
    background_image = models.ImageField(
        upload_to='board_backgrounds/',
        blank=True, null=True,
        verbose_name='Фоновое изображение'
    )

    class Meta:
        verbose_name = 'Доска'
        verbose_name_plural = 'Доски'
        ordering = ['-updated']

    def __str__(self):
        return self.name


class BoardMembership(models.Model):
    """
    Связь между пользователями и досками с указанием роли.
    """
    ROLE_CHOICES = [
        ('owner', 'Владелец'),
        ('admin', 'Администратор'),
        ('editor', 'Редактор'),
        ('viewer', 'Наблюдатель'),
    ]

    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='board_memberships',
        verbose_name='Пользователь'
    )
    board = models.ForeignKey(
        Board,
        on_delete=models.CASCADE,
        related_name='board_memberships',
        verbose_name='Доска'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='viewer',
        verbose_name='Роль'
    )
    joined_at = models.DateTimeField(  # Поле в админке
        auto_now_add=True,
        verbose_name='Дата присоединения'
    )

    class Meta:
        verbose_name = 'Участие в доске'
        verbose_name_plural = 'Участия в досках'
        unique_together = ('user', 'board')

    def __str__(self):
        return f"{self.user.username} - {self.board.name} ({self.get_role_display()})"

class Column(models.Model):
    """
    Колонка на канбан-доске, содержит карточки.
    """
    board = models.ForeignKey(
        Board,
        on_delete=models.CASCADE,
        related_name='columns',
        verbose_name='Доска'
    )
    name = models.CharField(
        max_length=255,
        verbose_name='Название колонки'
    )
    position_on_board = models.PositiveIntegerField(  # Название из админки
        default=0,
        verbose_name='Позиция на доске'
    )
    created = models.DateTimeField(  # Сохраняем названия полей из админки
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated = models.DateTimeField(  # Сохраняем названия полей из админки
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Колонка'
        verbose_name_plural = 'Колонки'
        ordering = ['position_on_board']

    def __str__(self):
        return self.name


class Card(models.Model):
    """
    Карточка задачи.
    """
    name = models.CharField(max_length=255, blank=True, null=True, verbose_name='Название карточки')  # Используем name вместо title для совместимости
    assigned_users = models.ManyToManyField(UserProfile, blank=True, related_name='assigned_cards',
                                            verbose_name='Назначенные пользователи') # Название из админки
    description = models.TextField(blank=True, verbose_name='Описание')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='cards', verbose_name='Доска')
    chips = models.ManyToManyField('Chip', blank=True, related_name='cards', verbose_name='Метки/Чипы')
    is_completed = models.BooleanField(default=False, verbose_name='Выполнено') # Поле из админки
    is_archived = models.BooleanField(default=False, verbose_name='Архивная') # Поле из админки
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания') # Сохраняем названия
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления') # Сохраняем названия
    # Дополнительные поля, которые могут быть полезны
    due_date = models.DateTimeField(null=True, blank=True, verbose_name='Срок выполнения')
    reminder_date = models.DateTimeField(null=True, blank=True, verbose_name='Напоминание')
    priority = models.IntegerField(choices=[(1, 'Низкий'), (2, 'Средний'), (3, 'Высокий'), (4, 'Критический')],
                                   default=2, verbose_name='Приоритет')
    is_subscribed = models.BooleanField(default=False, verbose_name='Подписаны на обновления')
    header_image = models.ImageField(upload_to='card_headers/', blank=True, null=True,
                                     verbose_name='Изображение заголовка')

    class Meta:
        verbose_name = 'Карточка'
        verbose_name_plural = 'Карточки'
        ordering = ['created']

    def __str__(self):
        return self.name


class CardInColumn(models.Model):
    """
    Положение карточки в колонке.
    """
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_in_columns', verbose_name='Карточка')# Сохраняем имя для совместимости
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='card_in_columns', verbose_name='Колонка') # Сохраняем имя для совместимости
    position_in_column = models.PositiveIntegerField(default=0, verbose_name='Позиция в колонке')
    is_archived = models.BooleanField(default=False, verbose_name='Архивная')

    class Meta:
        verbose_name = 'Карточка в колонке'
        verbose_name_plural = 'Карточки в колонках'
        ordering = ['position_in_column']
        unique_together = ('card', 'column')

    def __str__(self):
        return f"{self.card.name} в {self.column.name}"


class Comment(models.Model):
    """
    Комментарий к карточке.
    """
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='comments', verbose_name='Карточка')
    text = models.TextField(verbose_name='Комментарий') # Сохраняем имя поля
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created']

    def __str__(self):
        return self.text


class Chip(models.Model):
    """
    Метка/чип для карточек.
    """
    name = models.CharField(max_length=50, verbose_name='Название чипа')
    color = models.CharField(max_length=7, default='#FFFFFF', verbose_name='Цвет чипа')
    text = models.CharField(max_length=500, blank=True, null=True, verbose_name='Текст чипа') # Поле для обратной совместимости
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Чип'
        verbose_name_plural = 'Чипы'

    def __str__(self):
        return self.name


class Color(models.Model):
    """
    Цвета для интерфейса.
    """
    color = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Color')
    hover_color = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Hover color')
    color_name = models.CharField(max_length=500, blank=True, null=True, default=None, verbose_name='Color name')
    color_number = models.IntegerField(blank=True, null=True, default=None, verbose_name='Color number')

    class Meta:
        verbose_name = 'Color'
        verbose_name_plural = 'Colors'

    def __str__(self):
        return f"{self.color}"


class ChecklistItem(models.Model):
    """
    Элемент чеклиста в карточке.
    """
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='checklist_items', verbose_name='Карточка')
    description = models.CharField(max_length=255, verbose_name='Описание пункта') # Используем description вместо text для совместимости
    is_checked = models.BooleanField(default=False, verbose_name='Отмечено')  # Обратная совместимость
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Пункт чеклиста'
        verbose_name_plural = 'Пункты чеклиста'
        ordering = ['-created']

    def __str__(self):
        return self.description