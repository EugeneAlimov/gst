from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from .utils.reminder_utils import calculate_reminder_time, validate_reminder_offset

# Валидатор для HEX-цветов
hex_color_validator = RegexValidator(
    regex=r'^#(?:[0-9a-fA-F]{3}){1,2}$',
    message='Введите корректный HEX-цвет в формате #RGB или #RRGGBB'
)


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
        return self.name or f"Доска #{self.id}"


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


class ReminderLog(models.Model):
    """
    Модель для логирования всех изменений напоминаний.
    Используется для аналитики и отслеживания действий пользователей.
    """

    # Основные связи
    card = models.ForeignKey(
        'Card',
        on_delete=models.CASCADE,
        related_name='reminder_logs',
        verbose_name='Карточка'
    )
    user = models.ForeignKey(
        UserProfile,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reminder_logs',
        verbose_name='Пользователь'
    )

    # Данные об изменении
    old_offset_minutes = models.IntegerField(
        null=True, blank=True,
        verbose_name='Предыдущее смещение (минуты)'
    )
    new_offset_minutes = models.IntegerField(
        null=True, blank=True,
        verbose_name='Новое смещение (минуты)'
    )

    # Тип действия
    ACTION_CHOICES = [
        ('created', 'Создано напоминание'),
        ('updated', 'Изменено напоминание'),
        ('disabled', 'Отключено пользователем'),
        ('auto_disabled', 'Автоматически отключено при выполнении'),
        ('sent', 'Напоминание отправлено'),
        ('failed', 'Ошибка отправки напоминания'),
        ('cancelled', 'Отменено из-за удаления карточки'),
    ]
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name='Действие'
    )

    # Дополнительная информация
    timezone_info = models.CharField(
        max_length=100,
        null=True, blank=True,
        verbose_name='Часовой пояс пользователя'
    )
    user_agent = models.TextField(
        null=True, blank=True,
        verbose_name='User Agent браузера'
    )
    ip_address = models.GenericIPAddressField(
        null=True, blank=True,
        verbose_name='IP адрес'
    )

    # Системная информация
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время действия'
    )
    error_message = models.TextField(
        null=True, blank=True,
        verbose_name='Сообщение об ошибке'
    )

    # Метаданные для аналитики
    card_due_date = models.DateTimeField(
        null=True, blank=True,
        verbose_name='Дата завершения карточки на момент действия'
    )
    reminder_calculated_time = models.DateTimeField(
        null=True, blank=True,
        verbose_name='Вычисленное время напоминания'
    )

    class Meta:
        verbose_name = 'Лог напоминания'
        verbose_name_plural = 'Логи напоминаний'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['card', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['timestamp']),  # для общей аналитики
        ]

    def __str__(self):
        user_info = f" пользователем {self.user.username}" if self.user else ""
        return f"{self.get_action_display()} для карточки '{self.card.name}'{user_info} ({self.timestamp.strftime('%d.%m.%Y %H:%M')})"

    def get_offset_change_text(self):
        """Возвращает текстовое описание изменения смещения"""
        if self.old_offset_minutes is None and self.new_offset_minutes is not None:
            return f"Установлено: за {self.new_offset_minutes} мин"
        elif self.old_offset_minutes is not None and self.new_offset_minutes is None:
            return f"Отключено (было: за {self.old_offset_minutes} мин)"
        elif self.old_offset_minutes != self.new_offset_minutes:
            return f"Изменено: за {self.old_offset_minutes} мин → за {self.new_offset_minutes} мин"
        else:
            return "Без изменений"

    @classmethod
    def log_reminder_change(cls, card, user, old_offset, new_offset, action, **kwargs):
        """
        Удобный метод для создания записи лога

        Args:
            card: экземпляр Card
            user: экземпляр UserProfile или None
            old_offset: предыдущее смещение в минутах или None
            new_offset: новое смещение в минутах или None
            action: тип действия из ACTION_CHOICES
            **kwargs: дополнительные поля (timezone_info, user_agent, etc.)
        """
        # Вычисляем reminder_calculated_time если есть новое смещение
        calculated_time = None
        if new_offset and card.date_time_finish:
            from datetime import timedelta
            calculated_time = card.date_time_finish - timedelta(minutes=new_offset)

        return cls.objects.create(
            card=card,
            user=user,
            old_offset_minutes=old_offset,
            new_offset_minutes=new_offset,
            action=action,
            card_due_date=card.date_time_finish,
            reminder_calculated_time=calculated_time,
            **kwargs
        )

    @classmethod
    def get_analytics_data(cls, card=None, user=None, date_from=None, date_to=None):
        """
        Получить аналитические данные по логам

        Returns:
            dict: статистика по действиям
        """
        queryset = cls.objects.all()

        if card:
            queryset = queryset.filter(card=card)
        if user:
            queryset = queryset.filter(user=user)
        if date_from:
            queryset = queryset.filter(timestamp__gte=date_from)
        if date_to:
            queryset = queryset.filter(timestamp__lte=date_to)

        # Группировка по действиям
        from django.db.models import Count
        actions_stats = queryset.values('action').annotate(
            count=Count('id')
        ).order_by('-count')

        # Самые популярные смещения
        popular_offsets = queryset.filter(
            action__in=['created', 'updated'],
            new_offset_minutes__isnull=False
        ).values('new_offset_minutes').annotate(
            count=Count('id')
        ).order_by('-count')[:10]

        return {
            'total_logs': queryset.count(),
            'actions_distribution': list(actions_stats),
            'popular_offsets': list(popular_offsets),
            'unique_cards': queryset.values('card').distinct().count(),
            'unique_users': queryset.filter(user__isnull=False).values('user').distinct().count(),
        }


class Card(models.Model):
    """
    Карточка задачи.
    """
    name = models.CharField(max_length=255, blank=True, null=True,
                            verbose_name='Название карточки')  # Используем name вместо title для совместимости
    assigned_users = models.ManyToManyField(UserProfile, blank=True, related_name='assigned_cards',
                                            verbose_name='Назначенные пользователи')  # Название из админки
    description = models.TextField(blank=True, verbose_name='Описание')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='cards', verbose_name='Доска')
    chips = models.ManyToManyField('Chip', blank=True, related_name='cards', verbose_name='Метки/Чипы')
    is_completed = models.BooleanField(default=False, verbose_name='Выполнено')  # Поле из админки
    is_archived = models.BooleanField(default=False, verbose_name='Архивная')  # Поле из админки
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')  # Сохраняем названия
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')  # Сохраняем названия
    # Дополнительные поля, которые могут быть полезны
    date_time_start = models.DateTimeField(null=True, blank=True, verbose_name='Дата и время начала')
    date_time_finish = models.DateTimeField(null=True, blank=True, verbose_name='Дата и время завершения')
    reminder_offset_minutes = models.IntegerField(null=True, blank=True, verbose_name='Смещение напоминания (минуты)',
                                                  help_text='За сколько минут до завершения отправить напоминание')
    reminder_calculated_time = models.DateTimeField(null=True, blank=True,
                                                    verbose_name='Вычисленное время напоминания (UTC)',
                                                    help_text='Автоматически рассчитывается на основе времени завершения и смещения'
                                                    )
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
        return self.name or f"Колонка #{self.id}"

    def recalculate_reminder_time(self):
        """
        Автоматический пересчет времени напоминания при изменении дат
        Вызывается при изменении date_time_finish или reminder_offset_minutes
        """
        try:
            # Если есть время завершения и смещение - рассчитываем время напоминания
            if self.date_time_finish and self.reminder_offset_minutes:
                self.reminder_calculated_time = calculate_reminder_time(
                    self.date_time_finish,
                    self.reminder_offset_minutes
                )
            else:
                # Если нет данных для расчета - обнуляем
                self.reminder_calculated_time = None

        except ValidationError as e:
            # В случае ошибки валидации - обнуляем напоминание
            self.reminder_calculated_time = None
            self.reminder_offset_minutes = None
            raise e

    def validate_reminder_data(self):
        """
        Валидация данных напоминания перед сохранением
        """
        if self.reminder_offset_minutes and self.date_time_finish:
            validate_reminder_offset(self.date_time_finish, self.reminder_offset_minutes)

    def save(self, *args, **kwargs):
        """
        Переопределяем save для автоматического пересчета времени напоминания
        """

        print(f"🔍 CARD MODEL DEBUG: Сохранение карточки {self.id}")
        print(f"- date_time_start: {self.date_time_start}")
        print(f"- date_time_finish: {self.date_time_finish}")
        print(f"- reminder_offset_minutes: {self.reminder_offset_minutes}")
        print(f"- is_completed: {self.is_completed}")

        # АВТОМАТИЧЕСКОЕ ОТКЛЮЧЕНИЕ при выполнении задачи
        if self.is_completed and (self.reminder_offset_minutes or self.reminder_calculated_time):
            print(f"DEBUG: Отключаем напоминание для карточки {self.id}")  # для отладки

            # Отключаем напоминание
            self.reminder_offset_minutes = None
            self.reminder_calculated_time = None

        elif not self.is_completed:
            # Валидируем и пересчитываем только если задача НЕ выполнена
            try:
                print("DEBUG: Валидируем данные напоминания")
                self.validate_reminder_data()
                print("DEBUG: Пересчитываем время напоминания")
                self.recalculate_reminder_time()
                print(f"DEBUG: После пересчета reminder_calculated_time: {self.reminder_calculated_time}")
            except ValidationError:
                # Если валидация не прошла - обнуляем
                self.reminder_offset_minutes = None
                self.reminder_calculated_time = None
                print(f"DEBUG: Ошибка валидации: {e}")

        print(f"DEBUG: Перед super().save():")
        print(f"- date_time_start: {self.date_time_start}")
        print(f"- date_time_finish: {self.date_time_finish}")
        print(f"- reminder_offset_minutes: {self.reminder_offset_minutes}")
        print(f"- reminder_calculated_time: {self.reminder_calculated_time}")

        # Вызываем родительский save
        super().save(*args, **kwargs)

        print(f"DEBUG: После super().save() - карточка сохранена")

    def disable_reminder(self, reason="manually_disabled"):
        """
        Отключает напоминание для карточки

        Args:
            reason (str): Причина отключения для логирования
        """
        old_offset = self.reminder_offset_minutes
        old_calculated = self.reminder_calculated_time

        self.reminder_offset_minutes = None
        self.reminder_calculated_time = None

        # Логируем отключение напоминания
        if hasattr(self, '_current_user'):  # если передан пользователь
            from .models import ReminderLog
            ReminderLog.log_reminder_change(
                card=self,
                user=self._current_user,
                action='disabled',
                old_offset_minutes=old_offset,
                old_calculated_time=old_calculated,
                metadata={'reason': reason}
            )

        self.save()

    def get_reminder_status(self):
        """
        Возвращает статус напоминания для отображения
        """
        if not self.reminder_offset_minutes:
            return "Напоминание отключено"

        if not self.reminder_calculated_time:
            return "Ошибка расчета времени"

        from django.utils import timezone
        from .utils.reminder_utils import get_reminder_display_text

        now = timezone.now()

        if self.reminder_calculated_time <= now:
            return "Время напоминания наступило"
        else:
            offset_text = get_reminder_display_text(self.reminder_offset_minutes)
            return f"Напоминание {offset_text} до завершения"

    @property
    def is_reminder_active(self):
        """
        Проверяет активно ли напоминание
        """
        return (
                self.reminder_offset_minutes is not None and
                self.reminder_calculated_time is not None and
                not self.is_completed and  # предполагается что есть поле is_completed
                not self.is_archived  # предполагается что есть поле is_archived
        )


class CardInColumn(models.Model):
    """
    Положение карточки в колонке.
    """
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_in_columns',
                             verbose_name='Карточка')  # Сохраняем имя для совместимости
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='card_in_columns',
                               verbose_name='Колонка')  # Сохраняем имя для совместимости
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
    text = models.TextField(verbose_name='Комментарий')  # Сохраняем имя поля
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created']

    def __str__(self):
        return self.text


class Color(models.Model):
    """
    Модель для хранения цветовых схем для чипов.
    Каждый цвет имеет нормальное состояние и состояние при наведении.
    """
    # Уникальный числовой идентификатор цвета (соответствует colorNumber из фронтенда)
    color_number = models.IntegerField(
        unique=True,
        blank=True,
        verbose_name='Номер цвета',
        help_text='Уникальный числовой идентификатор цвета из палитры'
    )

    # Основной цвет (нормальное состояние)
    normal_color = models.CharField(
        max_length=7,
        blank=True,
        validators=[hex_color_validator],
        verbose_name='Нормальный цвет',
        help_text='HEX-код цвета в нормальном состоянии'
    )

    # Цвет при наведении
    hover_color = models.CharField(
        max_length=7,
        blank=True,
        validators=[hex_color_validator],
        verbose_name='Цвет при наведении',
        help_text='HEX-код цвета при наведении курсора'
    )

    # Название цвета для отображения пользователю
    color_name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Название цвета',
        help_text='Человекочитаемое название цвета'
    )

    # Дополнительные свойства для улучшения UX
    is_dark = models.BooleanField(
        default=False,
        verbose_name='Темный цвет',
        help_text='Определяет, является ли цвет темным (для выбора цвета текста)'
    )

    text_color = models.CharField(
        max_length=7,
        default='#000000',
        validators=[hex_color_validator],
        verbose_name='Цвет текста',
        help_text='HEX-код цвета текста для обеспечения контрастности'
    )

    # Поля для аудита
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Цвет'
        verbose_name_plural = 'Цвета'
        ordering = ['color_number']

    def __str__(self):
        return f"{self.color_name} (#{self.color_number})"

    def save(self, *args, **kwargs):
        """
        Автоматически определяем, темный ли цвет, и устанавливаем соответствующий цвет текста
        """
        if not self.text_color or self.text_color == '#000000':
            # Определяем яркость цвета
            self.is_dark = self._is_color_dark(self.normal_color)
            self.text_color = '#FFFFFF' if self.is_dark else '#000000'

        super().save(*args, **kwargs)

    def _is_color_dark(self, hex_color):
        """
        Определяет, является ли цвет темным на основе его яркости
        """
        # Убираем # в начале
        hex_color = hex_color.lstrip('#')

        # Конвертируем в RGB
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)

        # Вычисляем относительную яркость по формуле W3C
        # https://www.w3.org/WAI/GL/wiki/Relative_luminance
        luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

        # Если яркость меньше 0.5, считаем цвет темным
        return luminance < 0.5


class Chip(models.Model):
    """
    Метка/чип для карточек с привязкой к цветовой схеме
    """
    name = models.CharField(
        max_length=50,
        blank=True,  # Разрешаем пустое значение в формах
        default='',  # Значение по умолчанию
        verbose_name='Название метки'
    )

    # Связь с цветовой схемой
    color = models.ForeignKey(
        Color,
        on_delete=models.PROTECT,
        related_name='chips',
        verbose_name='Цветовая схема'
    )

    # Поля для аудита
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Метка'
        verbose_name_plural = 'Метки'
        ordering = ['name']

    def __str__(self):
        # Если имя пустое, показываем только ID или цвет (для админки)
        if self.name:
            return self.name
        elif self.color:
            return f"Цветная метка ({self.color.color_name})"
        else:
            return f"Метка #{self.id}"


class ChecklistItem(models.Model):
    """
    Элемент чеклиста в карточке.
    """
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='checklist_items', verbose_name='Карточка')
    description = models.CharField(max_length=255,
                                   verbose_name='Описание пункта')  # Используем description вместо text для совместимости
    is_checked = models.BooleanField(default=False, verbose_name='Отмечено')  # Обратная совместимость
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Пункт чеклиста'
        verbose_name_plural = 'Пункты чеклиста'
        ordering = ['-created']

    def __str__(self):
        return self.description
