# main/management/commands/populate_colors.py
from django.core.management.base import BaseCommand
from main.models import Color


class Command(BaseCommand):
    help = 'Заполняет таблицу цветов данными из константы chipColor'

    def handle(self, *args, **kwargs):
        # Данные из вашего файла src/constants/colorsConst.js
        chip_colors = [
            {"normal": "#baf3db", "hover": "#7ee2b8", "colorNumber": 0, "colorName": "Приглушенный зеленый"},
            {"normal": "#f8e6a0", "hover": "#f5cd47", "colorNumber": 1, "colorName": "Приглушенный желтый"},
            {"normal": "#fedec8", "hover": "#fec195", "colorNumber": 2, "colorName": "Приглушенный оранжевый"},
            {"normal": "#ffd5d2", "hover": "#fd9891", "colorNumber": 3, "colorName": "Приглушенный красный"},
            {"normal": "#dfd8fd", "hover": "#b8acf6", "colorNumber": 4, "colorName": "Приглушенный фиолетовый"},
            {"normal": "#4bce97", "hover": "#7ee2b8", "colorNumber": 5, "colorName": "Зелёный"},
            {"normal": "#f5cd47", "hover": "#e2b203", "colorNumber": 6, "colorName": "Желтый"},
            {"normal": "#fea362", "hover": "#fec195", "colorNumber": 7, "colorName": "Оранжевый"},
            {"normal": "#f87168", "hover": "#fd9891", "colorNumber": 8, "colorName": "Красный"},
            {"normal": "#9f8fef", "hover": "#b8acf6", "colorNumber": 9, "colorName": "Пурпурный"},
            {"normal": "#1f845a", "hover": "#216e4e", "colorNumber": 10, "colorName": "Насыщенный зеленый"},
            {"normal": "#946f00", "hover": "#7f5f01", "colorNumber": 11, "colorName": "Насыщенный желтый"},
            {"normal": "#c25100", "hover": "#a54800", "colorNumber": 12, "colorName": "Насыщенный оранжевый"},
            {"normal": "#c9372c", "hover": "#ae2e24", "colorNumber": 13, "colorName": "Красный"},
            {"normal": "#6e5dc6", "hover": "#5e4db2", "colorNumber": 14, "colorName": "Пурпурный"},
            {"normal": "#cce0ff", "hover": "#85b8ff", "colorNumber": 15, "colorName": "Приглушенный синий"},
            {"normal": "#c6edfb", "hover": "#9dd9ee", "colorNumber": 16, "colorName": "Приглушенный голубой"},
            {"normal": "#d3f1a7", "hover": "#b3df72", "colorNumber": 17, "colorName": "Приглушенный лаймовый"},
            {"normal": "#fdd0ec", "hover": "#f797d2", "colorNumber": 18, "colorName": "Приглушенный розовый"},
            {"normal": "#dcdfe4", "hover": "#85b8ff", "colorNumber": 19, "colorName": "Светло-серый"},
            {"normal": "#579dff", "hover": "#9dd9ee", "colorNumber": 20, "colorName": "Синий"},
            {"normal": "#6cc3e0", "hover": "#94c748", "colorNumber": 21, "colorName": "Небесный"},
            {"normal": "#94c748", "hover": "#b3b9c4", "colorNumber": 22, "colorName": "Лаймовый"},
            {"normal": "#e774bb", "hover": "#f797d2", "colorNumber": 23, "colorName": "Розовый"},
            {"normal": "#8590a2", "hover": "#b3b9c4", "colorNumber": 24, "colorName": "Черный"},
            {"normal": "#0c66e4", "hover": "#0055cc", "colorNumber": 25, "colorName": "Насыщенный синий"},
            {"normal": "#227d9b", "hover": "#206a83", "colorNumber": 26, "colorName": "Насыщенный голубой"},
            {"normal": "#5b7f24", "hover": "#4c6b1f", "colorNumber": 27, "colorName": "Насыщенный лаймовый"},
            {"normal": "#ae4787", "hover": "#943d73", "colorNumber": 28, "colorName": "Насыщенный розовый"},
            {"normal": "#626f86", "hover": "#44546f", "colorNumber": 29, "colorName": "Темно-серый"},
        ]

        self.stdout.write("Начинаем заполнение таблицы цветов...")

        created_count = 0
        updated_count = 0

        for color_data in chip_colors:
            color, created = Color.objects.update_or_create(
                color_number=color_data["colorNumber"],
                defaults={
                    'normal_color': color_data["normal"],
                    'hover_color': color_data["hover"],
                    'color_name': color_data["colorName"],
                }
            )

            if created:
                created_count += 1
                self.stdout.write(f"✓ Создан: {color.color_name} (#{color.color_number})")
            else:
                updated_count += 1
                self.stdout.write(f"↻ Обновлен: {color.color_name} (#{color.color_number})")

        self.stdout.write(
            self.style.SUCCESS(
                f"Завершено! Создано: {created_count}, Обновлено: {updated_count}"
            )
        )