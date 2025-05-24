# main/management/commands/update_color_names.py
from django.core.management.base import BaseCommand
from main.models import Color


class Command(BaseCommand):
    help = 'Обновляет названия цветов согласно улучшенной схеме'

    def handle(self, *args, **kwargs):
        # Словарь с исправлениями
        color_updates = {
            3: {"name": "Приглушенный розовый"},
            9: {"name": "Фиолетовый"},
            10: {"name": "Темно-зеленый"},
            11: {"name": "Темно-желтый"},
            12: {"name": "Темно-оранжевый"},
            13: {"name": "Темно-красный"},
            14: {"name": "Темно-фиолетовый"},
            15: {"name": "Светло-синий"},
            16: {"name": "Светло-голубой"},
            17: {"name": "Светло-зеленый"},
            18: {"name": "Светло-розовый"},
            19: {"name": "Светло-серый", "hover": "#c5c9d0"},
            20: {"name": "Синий", "hover": "#4285f4"},
            21: {"name": "Голубой", "hover": "#5bb5d3"},
            22: {"name": "Лайм", "hover": "#7fb82b"},
            24: {"name": "Серый", "hover": "#747d8c"},
            25: {"name": "Глубокий синий"},
            26: {"name": "Глубокий голубой"},
            27: {"name": "Глубокий зеленый"},
            28: {"name": "Глубокий розовый"},
            29: {"name": "Темно-серый"},
        }

        updated_count = 0

        for color_number, updates in color_updates.items():
            try:
                color = Color.objects.get(color_number=color_number)

                # Обновляем название
                if 'name' in updates:
                    old_name = color.color_name
                    color.color_name = updates['name']
                    self.stdout.write(f"#{color_number}: '{old_name}' → '{updates['name']}'")

                # Обновляем hover-цвет, если указан
                if 'hover' in updates:
                    old_hover = color.hover_color
                    color.hover_color = updates['hover']
                    self.stdout.write(f"#{color_number}: hover {old_hover} → {updates['hover']}")

                color.save()
                updated_count += 1

            except Color.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f"Цвет #{color_number} не найден")
                )

        self.stdout.write(
            self.style.SUCCESS(f"Обновлено {updated_count} цветов")
        )