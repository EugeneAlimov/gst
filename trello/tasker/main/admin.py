from django.contrib import admin
from django.utils.html import format_html
from django import forms
from .models import *
from django.db.models import Count, Q
from django.urls import reverse
from django.utils.safestring import mark_safe


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'active_board', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'email')}),
        ('Дополнительные поля', {'fields': ('active_board', 'photo', 'user_information')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_active', 'created', 'updated')
    search_fields = ('name', 'user__username')
    list_filter = ('is_active', 'created')


@admin.register(BoardMembership)
class BoardMembershipAdmin(admin.ModelAdmin):
    list_display = ('board', 'user', 'role', 'joined_at')
    search_fields = ('board__name', 'user__username', 'role')
    list_filter = ('role', 'joined_at')


@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ('name', 'board', 'position_on_board', 'created', 'updated')
    search_fields = ('name', 'board__name')
    list_filter = ('created', 'updated')


@admin.register(ReminderLog)
class ReminderLogAdmin(admin.ModelAdmin):
    list_display = (
        'timestamp', 'card_link', 'user_link', 'action_colored',
        'offset_change', 'timezone_info'
    )
    list_filter = (
        'action', 'timestamp', 'timezone_info',
        ('user', admin.RelatedOnlyFieldListFilter),
        ('card__board', admin.RelatedOnlyFieldListFilter),
    )
    search_fields = (
        'card__name', 'user__username', 'user__email',
        'timezone_info', 'ip_address'
    )
    readonly_fields = (
        'timestamp', 'card', 'user', 'old_offset_minutes',
        'new_offset_minutes', 'action', 'timezone_info',
        'user_agent', 'ip_address', 'card_due_date',
        'reminder_calculated_time', 'error_message',
        'offset_change_display', 'time_until_reminder'
    )
    ordering = ['-timestamp']
    date_hierarchy = 'timestamp'

    # Группировка полей для удобства
    fieldsets = (
        ('Основная информация', {
            'fields': ('timestamp', 'card', 'user', 'action')
        }),
        ('Изменения напоминания', {
            'fields': (
                'old_offset_minutes', 'new_offset_minutes',
                'offset_change_display', 'reminder_calculated_time',
                'time_until_reminder'
            )
        }),
        ('Контекст карточки', {
            'fields': ('card_due_date',),
            'classes': ('collapse',)
        }),
        ('Техническая информация', {
            'fields': (
                'timezone_info', 'ip_address', 'user_agent', 'error_message'
            ),
            'classes': ('collapse',)
        }),
    )

    def card_link(self, obj):
        """Ссылка на карточку"""
        if obj.card:
            url = reverse('admin:main_card_change', args=[obj.card.id])
            return format_html('<a href="{}">{}</a>', url, obj.card.name[:50])
        return '-'

    card_link.short_description = 'Карточка'
    card_link.admin_order_field = 'card__name'

    def user_link(self, obj):
        """Ссылка на пользователя"""
        if obj.user:
            url = reverse('admin:main_userprofile_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        return 'Система'

    user_link.short_description = 'Пользователь'
    user_link.admin_order_field = 'user__username'

    def action_colored(self, obj):
        """Цветное отображение действия"""
        colors = {
            'created': '#4caf50',  # зеленый
            'updated': '#2196f3',  # синий
            'disabled': '#ff9800',  # оранжевый
            'auto_disabled': '#9c27b0',  # фиолетовый
            'sent': '#00bcd4',  # голубой
            'failed': '#f44336',  # красный
            'cancelled': '#607d8b',  # серый
        }
        color = colors.get(obj.action, '#666666')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_action_display()
        )

    action_colored.short_description = 'Действие'
    action_colored.admin_order_field = 'action'

    def offset_change(self, obj):
        """Краткое описание изменения"""
        return obj.get_offset_change_text()

    offset_change.short_description = 'Изменение'

    def offset_change_display(self, obj):
        """Подробное описание изменения для детального просмотра"""
        text = obj.get_offset_change_text()

        # Добавляем контекст о времени
        if obj.reminder_calculated_time:
            from django.utils import timezone
            now = timezone.now()
            if obj.reminder_calculated_time > now:
                diff = obj.reminder_calculated_time - now
                days = diff.days
                hours = diff.seconds // 3600
                minutes = (diff.seconds % 3600) // 60

                time_str = []
                if days > 0:
                    time_str.append(f"{days}д")
                if hours > 0:
                    time_str.append(f"{hours}ч")
                if minutes > 0:
                    time_str.append(f"{minutes}м")

                if time_str:
                    text += f" (через {' '.join(time_str)})"
                else:
                    text += " (менее минуты)"
            else:
                text += " (время прошло)"

        return text

    offset_change_display.short_description = 'Подробности изменения'

    def time_until_reminder(self, obj):
        """Время до напоминания"""
        if not obj.reminder_calculated_time:
            return '-'

        from django.utils import timezone
        now = timezone.now()

        if obj.reminder_calculated_time <= now:
            return format_html('<span style="color: red;">Время прошло</span>')

        diff = obj.reminder_calculated_time - now
        days = diff.days
        hours = diff.seconds // 3600
        minutes = (diff.seconds % 3600) // 60

        parts = []
        if days > 0:
            parts.append(f"{days} дн.")
        if hours > 0:
            parts.append(f"{hours} ч.")
        if minutes > 0:
            parts.append(f"{minutes} мин.")

        if not parts:
            return "< 1 мин."

        return " ".join(parts)

    time_until_reminder.short_description = 'До напоминания'

    def get_queryset(self, request):
        """Оптимизируем запросы"""
        return super().get_queryset(request).select_related(
            'card', 'user', 'card__board'
        )

    # Добавляем changelist view для аналитики
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}

        # Получаем статистику за последние 30 дней
        from datetime import timedelta
        from django.utils import timezone
        from django.db.models import Count

        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_logs = ReminderLog.objects.filter(timestamp__gte=thirty_days_ago)

        # Статистика по действиям
        actions_stats = recent_logs.values('action').annotate(
            count=Count('id')
        ).order_by('-count')

        # Популярные смещения
        popular_offsets = recent_logs.filter(
            action__in=['created', 'updated'],
            new_offset_minutes__isnull=False
        ).values('new_offset_minutes').annotate(
            count=Count('id')
        ).order_by('-count')[:5]

        extra_context.update({
            'total_logs_30d': recent_logs.count(),
            'actions_stats': actions_stats,
            'popular_offsets': popular_offsets,
        })

        return super().changelist_view(request, extra_context)


class CardAdminForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = '__all__'


class CommentInline(admin.TabularInline):
    """Inline для комментариев в карточке"""
    model = Comment
    extra = 0
    fields = ('text', 'created', 'updated')
    readonly_fields = ('created', 'updated')
    ordering = ['-created']

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created')

    def has_add_permission(self, request, obj=None):
        return True  # Разрешаем добавлять комментарии

    def has_delete_permission(self, request, obj=None):
        return True  # Разрешаем удалять комментарии


class ChecklistItemInline(admin.TabularInline):
    """Inline для элементов чеклиста в карточке"""
    model = ChecklistItem
    extra = 0
    fields = ('description', 'is_checked', 'created', 'updated')
    readonly_fields = ('created', 'updated')
    ordering = ['created']  # Чеклист в порядке создания

    def has_add_permission(self, request, obj=None):
        return True  # Разрешаем добавлять элементы чеклиста

    def has_delete_permission(self, request, obj=None):
        return True  # Разрешаем удалять элементы чеклиста


class CardInColumnInline(admin.TabularInline):
    """Inline для отображения позиций карточки в колонках"""
    model = CardInColumn
    extra = 0
    fields = ('column', 'position_in_column', 'is_archived')
    readonly_fields = ('column',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('column', 'column__board')

    def has_add_permission(self, request, obj=None):
        return False  # Запрещаем добавление - это управляется через drag&drop

    def has_delete_permission(self, request, obj=None):
        return True  # Разрешаем удаление позиций


class ReminderLogInline(admin.TabularInline):
    """Inline для отображения логов напоминаний в карточке"""
    model = ReminderLog
    extra = 0
    readonly_fields = (
        'timestamp', 'user', 'action_colored', 'offset_change_display',
        'timezone_info', 'ip_address'
    )
    fields = (
        'timestamp', 'user', 'action_colored', 'offset_change_display',
        'timezone_info'
    )
    ordering = ['-timestamp']

    def action_colored(self, obj):
        """Цветное отображение действия в inline"""
        colors = {
            'created': '#4caf50',  # зеленый
            'updated': '#2196f3',  # синий
            'disabled': '#ff9800',  # оранжевый
            'auto_disabled': '#9c27b0',  # фиолетовый
            'sent': '#00bcd4',  # голубой
            'failed': '#f44336',  # красный
            'cancelled': '#607d8b',  # серый
        }
        color = colors.get(obj.action, '#666666')
        return format_html(
            '<span style="color: {}; font-weight: bold; font-size: 11px;">{}</span>',
            color,
            obj.get_action_display()
        )

    action_colored.short_description = 'Действие'

    def offset_change_display(self, obj):
        """Краткое отображение изменения для inline"""
        text = obj.get_offset_change_text()
        if len(text) > 40:
            text = text[:37] + '...'
        return text

    offset_change_display.short_description = 'Изменение'

    def has_add_permission(self, request, obj=None):
        return False  # Запрещаем добавление через inline

    def has_delete_permission(self, request, obj=None):
        return False  # Запрещаем удаление через inline


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    form = CardAdminForm

    # Основное отображение списка
    list_display = (
        'name', 'board', 'is_completed', 'is_archived',
        'reminder_status', 'assigned_users_count', 'get_comments_count',
        'get_checklist_count', 'get_chips_display', 'created', 'updated'
    )

    # Фильтры
    list_filter = (
        'is_completed', 'is_archived', 'created', 'updated', 'priority',
        ('board', admin.RelatedOnlyFieldListFilter),
        ('assigned_users', admin.RelatedOnlyFieldListFilter),
        'is_subscribed'
        # Фильтр для reminder_offset_minutes добавим после создания поля
        # ('reminder_offset_minutes', admin.BooleanFieldListFilter),
    )

    # Поиск
    search_fields = ('name', 'description')

    # Поля для массового редактирования
    filter_horizontal = ('assigned_users', 'chips')

    # Инлайны
    inlines = [ReminderLogInline, CommentInline, ChecklistItemInline, CardInColumnInline]

    # Порядок по умолчанию
    ordering = ['-updated']

    # Иерархия по датам
    date_hierarchy = 'created'

    # Поля только для чтения
    readonly_fields = (
        'created', 'updated', 'reminder_logs_count', 'last_reminder_action',
        'reminder_effectiveness'
    )

    # Группировка полей в форме редактирования
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'description', 'board')
        }),
        ('Назначения и метки', {
            'fields': ('assigned_users', 'chips'),
            'classes': ('wide',)
        }),
        ('Статус и приоритет', {
            'fields': (
                'is_completed', 'is_archived', 'priority', 'is_subscribed'
            )
        }),
        ('Даты и сроки', {
            'fields': (
                'due_date', 'reminder_date'
                # После миграции заменим на:
                # 'date_time_start', 'date_time_finish', 'reminder_offset_minutes'
            ),
            'classes': ('collapse',)
        }),
        ('Дополнительно', {
            'fields': ('header_image',),
            'classes': ('collapse',)
        }),
        ('Системная информация', {
            'fields': (
                'created', 'updated', 'reminder_logs_count',
                'last_reminder_action', 'reminder_effectiveness'
            ),
            'classes': ('collapse',)
        }),
    )

    # Кастомные методы для отображения
    def reminder_status(self, obj):
        """Показывает статус напоминания для карточки"""
        # Пока поле reminder_offset_minutes не создано, проверяем старое поле
        if hasattr(obj, 'reminder_offset_minutes'):
            reminder_offset = getattr(obj, 'reminder_offset_minutes', None)
        else:
            # Временная проверка старого поля reminder_date
            reminder_offset = None
            if hasattr(obj, 'reminder_date') and obj.reminder_date:
                reminder_offset = "установлено"  # Временное отображение

        if reminder_offset and reminder_offset != "установлено":
            # Форматируем время
            if reminder_offset >= 1440:  # дни
                days = reminder_offset / 1440
                time_text = f"{days:.0f}д" if days == int(days) else f"{days:.1f}д"
            elif reminder_offset >= 60:  # часы
                hours = reminder_offset / 60
                time_text = f"{hours:.0f}ч" if hours == int(hours) else f"{hours:.1f}ч"
            else:  # минуты
                time_text = f"{reminder_offset}м"

            return format_html(
                '<span style="color: #2196f3; font-weight: bold;">За {}</span>',
                time_text
            )
        elif reminder_offset == "установлено":
            return format_html('<span style="color: #2196f3;">Установлено</span>')
        elif obj.is_completed:
            return format_html('<span style="color: #4caf50;">✓ Выполнено</span>')
        else:
            return format_html('<span style="color: #999;">—</span>')

    reminder_status.short_description = 'Напоминание'
    reminder_status.admin_order_field = 'reminder_date'  # Временно, потом заменим

    def assigned_users_count(self, obj):
        """Количество назначенных пользователей"""
        count = obj.assigned_users.count()
        if count == 0:
            return '—'
        elif count == 1:
            user = obj.assigned_users.first()
            return format_html(
                '<span title="{}">{}</span>',
                user.username,
                user.username[:10] + ('...' if len(user.username) > 10 else '')
            )
        else:
            users = list(obj.assigned_users.all()[:3])
            user_names = [u.username for u in users]
            tooltip = ', '.join(user_names)
            if count > 3:
                tooltip += f' и еще {count - 3}'

            return format_html(
                '<span title="{}" style="color: #1976d2;">{} чел.</span>',
                tooltip,
                count
            )

    assigned_users_count.short_description = 'Участники'

    def reminder_logs_count(self, obj):
        """Количество записей в логе напоминаний"""
        if hasattr(obj, 'reminder_logs'):
            count = obj.reminder_logs.count()
            if count > 0:
                return format_html(
                    '<a href="{}?card__id__exact={}" target="_blank">{} записей</a>',
                    reverse('admin:main_reminderlog_changelist'),
                    obj.id,
                    count
                )
        return '0'

    reminder_logs_count.short_description = 'Логов напоминаний'

    def last_reminder_action(self, obj):
        """Последнее действие с напоминанием"""
        if hasattr(obj, 'reminder_logs'):
            last_log = obj.reminder_logs.first()  # По ordering модели это последний
            if last_log:
                colors = {
                    'created': '#4caf50',
                    'updated': '#2196f3',
                    'disabled': '#ff9800',
                    'auto_disabled': '#9c27b0',
                    'sent': '#00bcd4',
                    'failed': '#f44336',
                    'cancelled': '#607d8b',
                }
                color = colors.get(last_log.action, '#666666')
                return format_html(
                    '<span style="color: {};">{}</span><br><small>{}</small>',
                    color,
                    last_log.get_action_display(),
                    last_log.timestamp.strftime('%d.%m.%Y %H:%M')
                )
        return '—'

    last_reminder_action.short_description = 'Последнее действие'

    def reminder_effectiveness(self, obj):
        """Эффективность напоминаний для этой карточки"""
        if not hasattr(obj, 'reminder_logs'):
            return '—'

        # Считаем отправленные напоминания
        sent_count = obj.reminder_logs.filter(action='sent').count()
        if sent_count == 0:
            return '—'

        # Проверяем было ли выполнение после последнего напоминания
        last_sent = obj.reminder_logs.filter(action='sent').first()
        if last_sent:
            completed_after = obj.reminder_logs.filter(
                action='auto_disabled',
                timestamp__gt=last_sent.timestamp
            ).exists()

            if completed_after:
                return format_html('<span style="color: #4caf50;">✓ Эффективно</span>')
            elif obj.is_completed:
                return format_html('<span style="color: #ff9800;">? Выполнено позже</span>')
            else:
                return format_html('<span style="color: #f44336;">✗ Не выполнено</span>')

        return '—'

    reminder_effectiveness.short_description = 'Эффективность'

    def get_comments_count(self, obj):
        """Количество комментариев"""
        count = obj.comments.count()
        if count > 0:
            return format_html(
                '<a href="{}?card__id__exact={}" style="color: #007bff;">{} 💬</a>',
                reverse('admin:main_comment_changelist'),
                obj.id,
                count
            )
        return '—'

    get_comments_count.short_description = 'Комментарии'

    def get_checklist_count(self, obj):
        """Количество элементов чеклиста"""
        total = obj.checklist_items.count()
        checked = obj.checklist_items.filter(is_checked=True).count()

        if total > 0:
            percentage = (checked / total * 100) if total > 0 else 0
            color = '#28a745' if percentage == 100 else '#007bff' if percentage > 50 else '#ffc107'

            return format_html(
                '<span style="color: {};">{}/{} ✓</span>',
                color,
                checked,
                total
            )
        return '—'

    get_checklist_count.short_description = 'Чеклист'

    def get_chips_display(self, obj):
        """Отображение меток/чипов"""
        chips = obj.chips.all()[:3]  # Показываем первые 3
        if not chips:
            return '—'

        chips_html = []
        for chip in chips:
            if hasattr(chip, 'color') and chip.color:
                color = getattr(chip.color, 'normal_color', '#e0e0e0')
            else:
                color = '#e0e0e0'

            chip_name = chip.name if chip.name else '●'
            chips_html.append(
                f'<span style="background: {color}; color: white; padding: 2px 6px; '
                f'border-radius: 10px; font-size: 10px; margin-right: 2px;">{chip_name}</span>'
            )

        result = ''.join(chips_html)

        # Если чипов больше 3, добавляем индикатор
        total_chips = obj.chips.count()
        if total_chips > 3:
            result += f'<span style="color: #6c757d; font-size: 10px;">+{total_chips - 3}</span>'

        return format_html(result)

    get_chips_display.short_description = 'Метки'

    # Оптимизация запросов
    def get_queryset(self, request):
        """Оптимизируем запросы для списка"""
        return super().get_queryset(request).select_related(
            'board'
        ).prefetch_related(
            'assigned_users', 'chips', 'reminder_logs', 'comments', 'checklist_items'
        )

    # Массовые действия
    actions = ['mark_completed', 'mark_uncompleted', 'archive_cards', 'unarchive_cards']

    def mark_completed(self, request, queryset):
        """Массовое выполнение карточек"""
        updated_count = 0
        for card in queryset:
            if not card.is_completed:
                card.is_completed = True
                card.save()
                updated_count += 1

                # Логируем автоматическое отключение напоминаний
                if hasattr(card, 'reminder_offset_minutes') and getattr(card, 'reminder_offset_minutes', None):
                    from .services import ReminderLogger
                    ReminderLogger.log_auto_disabled(
                        card=card,
                        old_offset=card.reminder_offset_minutes,
                        reason='bulk_completed_by_admin'
                    )

        self.message_user(request, f'Отмечено как выполненное: {updated_count} карточек')

    mark_completed.short_description = 'Отметить как выполненные'

    def mark_uncompleted(self, request, queryset):
        """Массовая отмена выполнения карточек"""
        updated_count = queryset.filter(is_completed=True).update(is_completed=False)
        self.message_user(request, f'Отменено выполнение: {updated_count} карточек')

    mark_uncompleted.short_description = 'Отменить выполнение'

    def archive_cards(self, request, queryset):
        """Массовая архивация карточек"""
        updated_count = queryset.filter(is_archived=False).update(is_archived=True)
        self.message_user(request, f'Заархивировано: {updated_count} карточек')

    archive_cards.short_description = 'Архивировать'

    def unarchive_cards(self, request, queryset):
        """Массовая разархивация карточек"""
        updated_count = queryset.filter(is_archived=True).update(is_archived=False)
        self.message_user(request, f'Разархивировано: {updated_count} карточек')

    unarchive_cards.short_description = 'Разархивировать'

    # Добавляем статистику в changelist
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}

        # Общая статистика карточек
        from django.db.models import Count, Q

        total_cards = Card.objects.count()
        completed_cards = Card.objects.filter(is_completed=True).count()
        archived_cards = Card.objects.filter(is_archived=True).count()

        # Статистика напоминаний (пока по старому полю)
        cards_with_reminders = Card.objects.filter(
            reminder_date__isnull=False
        ).count()

        # Статистика по доскам
        boards_stats = Card.objects.values('board__name').annotate(
            total=Count('id'),
            completed=Count('id', filter=Q(is_completed=True))
        ).order_by('-total')[:5]

        extra_context.update({
            'card_stats': {
                'total': total_cards,
                'completed': completed_cards,
                'archived': archived_cards,
                'with_reminders': cards_with_reminders,
                'completion_rate': (completed_cards / total_cards * 100) if total_cards > 0 else 0,
            },
            'top_boards': boards_stats,
        })

        return super().changelist_view(request, extra_context)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('text', 'card', 'created', 'updated')
    search_fields = ('text', 'card__name')
    list_filter = ('created', 'updated')


@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('description', 'card', 'is_checked', 'created', 'updated')
    search_fields = ('description', 'card__name')
    list_filter = ('is_checked', 'created', 'updated')


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ('color_preview', 'color_number', 'color_name', 'normal_color', 'hover_color', 'is_dark')
    search_fields = ('color_name', 'color_number', 'normal_color')
    list_filter = ('is_dark',)
    ordering = ('color_number',)

    fields = (
        'color_number',
        'color_name',
        'normal_color',
        'hover_color',
        'text_color',
        'is_dark',
        'color_preview'
    )
    readonly_fields = ('color_preview',)

    def color_preview(self, obj):
        """Создает интерактивный предпросмотр цвета"""
        if not obj.normal_color:
            return '-'

        return format_html(
            '<div style="display: flex; gap: 10px; align-items: center;">'
            '<div style="'
            'background-color: {}; '
            'width: 60px; '
            'height: 30px; '
            'border-radius: 4px; '
            'border: 1px solid #ddd; '
            'transition: background-color 0.3s; '
            'display: flex; '
            'align-items: center; '
            'justify-content: center; '
            'color: {}; '
            'font-weight: bold; '
            'font-size: 10px; '
            '" '
            'onmouseover="this.style.backgroundColor=\'{}\'" '
            'onmouseout="this.style.backgroundColor=\'{}\'" '
            'title="Наведите для просмотра hover-эффекта"'
            '>#{}</div>'
            '<div style="font-size: 11px; color: #666;">'
            'Normal: {}<br>'
            'Hover: {}'
            '</div>'
            '</div>',
            obj.normal_color,
            obj.text_color,
            obj.hover_color,
            obj.normal_color,
            obj.color_number,
            obj.normal_color,
            obj.hover_color
        )

    color_preview.short_description = 'Предпросмотр'


class ColorAdminForm(forms.ModelForm):
    """Форма для администрирования цветов с дополнительными полями"""

    class Meta:
        model = Color
        fields = '__all__'

    # Дополнительное поле для генерации hover-цвета
    generate_hover = forms.BooleanField(
        required=False,
        label='Сгенерировать цвет при наведении',
        help_text='Автоматически создать цвет при наведении на основе базового'
    )


@admin.register(Chip)
class ChipAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_color_preview', 'get_color_name', 'created')
    list_filter = ('color', 'created')
    search_fields = ('name', 'color__color_name')
    autocomplete_fields = ['color']

    def get_color_name(self, obj):
        return obj.color.color_name if obj.color else '-'

    get_color_name.short_description = 'Цвет'

    def get_color_preview(self, obj):
        if not obj.color:
            return '-'

        return format_html(
            '<div style="'
            'background-color: {}; '
            'width: 40px; '
            'height: 20px; '
            'border-radius: 3px; '
            'border: 1px solid #ddd; '
            'transition: background-color 0.3s; '
            '" '
            'onmouseover="this.style.backgroundColor=\'{}\'" '
            'onmouseout="this.style.backgroundColor=\'{}\'"'
            '></div>',
            obj.color.normal_color,
            obj.color.hover_color,
            obj.color.normal_color
        )

    get_color_preview.short_description = 'Предпросмотр'


@admin.register(CardInColumn)
class CardInColumnAdmin(admin.ModelAdmin):
    list_display = ('card', 'column', 'position_in_column', 'is_archived')
    search_fields = ('card__name', 'column__name')
    list_filter = ('is_archived',)


class ReminderLogInline(admin.TabularInline):
    model = ReminderLog
    extra = 0
    readonly_fields = (
        'timestamp', 'user', 'action', 'old_offset_minutes',
        'new_offset_minutes', 'timezone_info'
    )
    ordering = ['-timestamp']

    def has_add_permission(self, request, obj=None):
        return False  # Запрещаем добавление через inline

    def has_delete_permission(self, request, obj=None):
        return False  # Запрещаем удаление через inline
