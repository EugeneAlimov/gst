# utils/reminder_utils.py
from datetime import timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError


def calculate_reminder_time(date_time_finish, offset_minutes):
    """
    Вычисляет UTC время отправки напоминания

    Args:
        date_time_finish (datetime): Время завершения задачи
        offset_minutes (int): Смещение в минутах (за сколько минут до завершения)

    Returns:
        datetime: UTC время когда нужно отправить напоминание
        None: если date_time_finish или offset_minutes пустые
    """
    if not date_time_finish or not offset_minutes:
        return None

    if offset_minutes <= 0:
        raise ValidationError("Смещение напоминания должно быть положительным числом")

    # Вычисляем время напоминания = время завершения - смещение
    reminder_time = date_time_finish - timedelta(minutes=offset_minutes)

    return reminder_time


def validate_reminder_offset(date_time_finish, offset_minutes):
    """
    Проверяет что напоминание не устанавливается на уже прошедшее время

    Args:
        date_time_finish (datetime): Время завершения задачи
        offset_minutes (int): Смещение в минутах

    Raises:
        ValidationError: если время напоминания уже прошло
    """
    if not date_time_finish or not offset_minutes:
        return  # Пропускаем валидацию если поля пустые

    reminder_time = calculate_reminder_time(date_time_finish, offset_minutes)

    if reminder_time <= timezone.now():
        raise ValidationError(
            f"Напоминание нельзя установить на уже прошедшее время. "
            f"Время напоминания: {reminder_time}, текущее время: {timezone.now()}"
        )


def get_reminder_display_text(offset_minutes):
    """
    Возвращает человекочитаемый текст для смещения напоминания

    Args:
        offset_minutes (int): Смещение в минутах

    Returns:
        str: Текст типа "за 30 минут", "за 2 часа", "за 1 день"
    """
    if not offset_minutes:
        return "Без напоминания"

    if offset_minutes < 60:
        return f"за {offset_minutes} минут"
    elif offset_minutes < 1440:  # меньше суток
        hours = offset_minutes // 60
        minutes = offset_minutes % 60
        if minutes == 0:
            return f"за {hours} час{'а' if hours in [2, 3, 4] else 'ов' if hours > 4 else ''}"
        else:
            return f"за {hours}ч {minutes}мин"
    else:  # дни
        days = offset_minutes // 1440
        hours = (offset_minutes % 1440) // 60
        if hours == 0:
            return f"за {days} день{'а' if days in [2, 3, 4] else 'ей' if days > 4 else ''}"
        else:
            return f"за {days}д {hours}ч"


def is_reminder_time_reached(reminder_calculated_time):
    """
    Проверяет наступило ли время отправки напоминания

    Args:
        reminder_calculated_time (datetime): Вычисленное время напоминания

    Returns:
        bool: True если время наступило
    """
    if not reminder_calculated_time:
        return False

    return timezone.now() >= reminder_calculated_time