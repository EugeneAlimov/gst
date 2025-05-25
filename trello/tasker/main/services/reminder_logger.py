# Создать файл: trello/tasker/main/services/reminder_logger.py

from datetime import timedelta
from django.utils import timezone
from ..models import ReminderLog


class ReminderLogger:
    """
    Сервис для логирования всех действий с напоминаниями.
    Предоставляет удобные методы для записи различных типов событий.
    """

    @staticmethod
    def _get_client_info(request=None):
        """Извлекает информацию о клиенте из запроса"""
        if not request:
            return {}

        return {
            'timezone_info': request.META.get('HTTP_X_TIMEZONE'),
            'user_agent': request.META.get('HTTP_USER_AGENT'),
            'ip_address': ReminderLogger._get_client_ip(request),
        }

    @staticmethod
    def _get_client_ip(request):
        """Получает IP адрес клиента"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    @staticmethod
    def _calculate_reminder_time(card, offset_minutes):
        """Вычисляет время напоминания"""
        if not card.date_time_finish or not offset_minutes:
            return None
        return card.date_time_finish - timedelta(minutes=offset_minutes)

    @classmethod
    def log_created(cls, card, user, offset_minutes, request=None, **kwargs):
        """Логирует создание нового напоминания"""
        client_info = cls._get_client_info(request)

        return ReminderLog.objects.create(
            card=card,
            user=user,
            old_offset_minutes=None,
            new_offset_minutes=offset_minutes,
            action='created',
            card_due_date=card.date_time_finish,
            reminder_calculated_time=cls._calculate_reminder_time(card, offset_minutes),
            **client_info,
            **kwargs
        )

    @classmethod
    def log_updated(cls, card, user, old_offset, new_offset, request=None, **kwargs):
        """Логирует изменение существующего напоминания"""
        client_info = cls._get_client_info(request)

        return ReminderLog.objects.create(
            card=card,
            user=user,
            old_offset_minutes=old_offset,
            new_offset_minutes=new_offset,
            action='updated',
            card_due_date=card.date_time_finish,
            reminder_calculated_time=cls._calculate_reminder_time(card, new_offset),
            **client_info,
            **kwargs
        )

    @classmethod
    def log_disabled(cls, card, user, old_offset, request=None, **kwargs):
        """Логирует отключение напоминания пользователем"""
        client_info = cls._get_client_info(request)

        return ReminderLog.objects.create(
            card=card,
            user=user,
            old_offset_minutes=old_offset,
            new_offset_minutes=None,
            action='disabled',
            card_due_date=card.date_time_finish,
            reminder_calculated_time=None,
            **client_info,
            **kwargs
        )

    @classmethod
    def log_auto_disabled(cls, card, old_offset, reason='task_completed', **kwargs):
        """Логирует автоматическое отключение напоминания"""
        return ReminderLog.objects.create(
            card=card,
            user=None,  # Системное действие
            old_offset_minutes=old_offset,
            new_offset_minutes=None,
            action='auto_disabled',
            card_due_date=card.date_time_finish,
            reminder_calculated_time=None,
            error_message=f"Auto-disabled: {reason}",
            **kwargs
        )

    @classmethod
    def log_sent(cls, card, old_offset, **kwargs):
        """Логирует отправку напоминания"""
        return ReminderLog.objects.create(
            card=card,
            user=None,  # Системное действие
            old_offset_minutes=old_offset,
            new_offset_minutes=None,
            action='sent',
            card_due_date=card.date_time_finish,
            reminder_calculated_time=timezone.now(),
            **kwargs
        )

    @classmethod
    def log_failed(cls, card, old_offset, error_message, **kwargs):
        """Логирует ошибку отправки напоминания"""
        return ReminderLog.objects.create(
            card=card,
            user=None,  # Системное действие
            old_offset_minutes=old_offset,
            new_offset_minutes=None,
            action='failed',
            card_due_date=card.date_time_finish,
            reminder_calculated_time=timezone.now(),
            error_message=str(error_message),
            **kwargs
        )

    @classmethod
    def log_cancelled(cls, card, old_offset, reason='card_deleted', **kwargs):
        """Логирует отмену напоминания (удаление карточки и т.п.)"""
        return ReminderLog.objects.create(
            card=card,
            user=None,  # Системное действие
            old_offset_minutes=old_offset,
            new_offset_minutes=None,
            action='cancelled',
            card_due_date=card.date_time_finish,
            reminder_calculated_time=None,
            error_message=f"Cancelled: {reason}",
            **kwargs
        )

    @classmethod
    def get_card_history(cls, card, limit=None):
        """Получает историю изменений напоминаний для карточки"""
        queryset = ReminderLog.objects.filter(card=card).order_by('-timestamp')
        if limit:
            queryset = queryset[:limit]
        return queryset

    @classmethod
    def get_user_activity(cls, user, days=30, limit=None):
        """Получает активность пользователя по напоминаниям"""
        from datetime import timedelta
        date_from = timezone.now() - timedelta(days=days)

        queryset = ReminderLog.objects.filter(
            user=user,
            timestamp__gte=date_from
        ).order_by('-timestamp')

        if limit:
            queryset = queryset[:limit]
        return queryset

    @classmethod
    def get_analytics(cls, date_from=None, date_to=None):
        """
        Получает аналитические данные по использованию напоминаний

        Returns:
            dict: Различная статистика
        """
        from django.db.models import Count, Avg

        queryset = ReminderLog.objects.all()

        if date_from:
            queryset = queryset.filter(timestamp__gte=date_from)
        if date_to:
            queryset = queryset.filter(timestamp__lte=date_to)

        # Общая статистика
        total_logs = queryset.count()
        unique_cards = queryset.values('card').distinct().count()
        unique_users = queryset.filter(user__isnull=False).values('user').distinct().count()

        # Распределение по действиям
        actions_distribution = queryset.values('action').annotate(
            count=Count('id')
        ).order_by('-count')

        # Популярные смещения
        popular_offsets = queryset.filter(
            action__in=['created', 'updated'],
            new_offset_minutes__isnull=False
        ).values('new_offset_minutes').annotate(
            count=Count('id')
        ).order_by('-count')

        # Среднее смещение
        avg_offset = queryset.filter(
            action__in=['created', 'updated'],
            new_offset_minutes__isnull=False
        ).aggregate(avg=Avg('new_offset_minutes'))['avg']

        # Эффективность напоминаний (сколько задач выполнено после отправки)
        sent_reminders = queryset.filter(action='sent').count()
        completed_after_reminder = 0

        # Для этого нужно проверить карточки, для которых было отправлено напоминание
        for log in queryset.filter(action='sent'):
            if log.card.is_completed:
                # Проверяем, что карточка была выполнена после отправки напоминания
                completion_logs = ReminderLog.objects.filter(
                    card=log.card,
                    action='auto_disabled',
                    timestamp__gt=log.timestamp
                )
                if completion_logs.exists():
                    completed_after_reminder += 1

        effectiveness = (completed_after_reminder / sent_reminders * 100) if sent_reminders > 0 else 0

        # Распределение по часовым поясам
        timezone_distribution = queryset.filter(
            timezone_info__isnull=False
        ).values('timezone_info').annotate(
            count=Count('id')
        ).order_by('-count')[:10]

        return {
            'period': {
                'from': date_from,
                'to': date_to,
            },
            'totals': {
                'total_logs': total_logs,
                'unique_cards': unique_cards,
                'unique_users': unique_users,
                'sent_reminders': sent_reminders,
                'completed_after_reminder': completed_after_reminder,
                'effectiveness_percent': round(effectiveness, 2),
            },
            'distributions': {
                'actions': list(actions_distribution),
                'popular_offsets': list(popular_offsets),
                'timezones': list(timezone_distribution),
            },
            'metrics': {
                'average_offset_minutes': round(avg_offset, 2) if avg_offset else 0,
            }
        }

    @classmethod
    def cleanup_old_logs(cls, days_to_keep=365):
        """
        Очищает старые логи для экономии места

        Args:
            days_to_keep: сколько дней хранить логи (по умолчанию год)

        Returns:
            int: количество удаленных записей
        """
        from datetime import timedelta
        cutoff_date = timezone.now() - timedelta(days=days_to_keep)

        deleted_count, _ = ReminderLog.objects.filter(
            timestamp__lt=cutoff_date
        ).delete()

        return deleted_count