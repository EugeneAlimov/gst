# main/management/commands/migrate_colors.py
from django.core.management.base import BaseCommand
from django.db import transaction
from main.models import Color, Chip


class Command(BaseCommand):
    help = 'Миграция цветов из константы chipColor в модель Color'

    def handle(self, *args, **kwargs):
        # Данные из chipColor (можно импортировать или скопировать)
        chip_colors = [
            {"normal": "#baf3db", "hover": "#7ee2b8", "colorNumber": "0", "colorName": "Приглушенный зеленый"},
            {"normal": "#f8e6a0", "hover": "#f5cd47", "colorNumber": "1", "colorName": "Приглушенный желтый"},
            # Добавьте остальные цвета
        ]

        self.stdout.write("Начинаем миграцию цветов...")

        with transaction.atomic():
            # Создаем цвета в базе данных
            for color_data in chip_colors:
                # Определяем, тёмный ли цвет (простая эвристика)
                is_dark = self._is_dark_color(color_data["normal"])

                # Определяем цвет текста для контраста
                text_color = "#FFFFFF" if is_dark else "#000000"

                # Создаем или обновляем цвет
                color, created = Color.objects.update_or_create(
                    color_id=int(color_data["colorNumber"]),
                    defaults={
                        "base_color": color_data["normal"],
                        "hover_color": color_data["hover"],
                        "name": color_data["colorName"],
                        "is_dark": is_dark,
                        "text_color": text_color
                    }
                )

                action = "Создан" if created else "Обновлен"
                self.stdout.write(f"{action} цвет: {color.name} (ID: {color.color_id})")

            # Обновляем связи в Chip
            chips_updated = 0
            for chip in Chip.objects.all():
                # Находим соответствующий цвет (если существует)
                if hasattr(chip, 'color_number') and chip.color_number is not None:
                    try:
                        # Ищем цвет по старому номеру
                        color = Color.objects.get(color_id=int(chip.color_number))
                        # Устанавливаем связь
                        chip.color = color
                        chip.save(update_fields=['color'])
                        chips_updated += 1
                    except (Color.DoesNotExist, ValueError):
                        self.stdout.write(self.style.WARNING(
                            f"Не найден цвет для чипа {chip.id} ({chip.name})"
                        ))

            self.stdout.write(self.style.SUCCESS(f"Обновлено чипов: {chips_updated}"))

        self.stdout.write(self.style.SUCCESS("Миграция цветов завершена!"))

    def _is_dark_color(self, hex_color):
        """Определяет, тёмный ли цвет по HEX-коду"""
        # Убираем # если есть
        hex_color = hex_color.lstrip('#')

        # Конвертируем в RGB
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)

        # Рассчитываем яркость (простая формула)
        brightness = (r * 299 + g * 587 + b * 114) / 1000

        # Если яркость < 128, считаем цвет тёмным
        return brightness < 128