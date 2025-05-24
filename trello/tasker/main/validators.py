import re
from django.core.exceptions import ValidationError

def validate_hex_color(value):
    """Валидатор для HEX-цветов"""
    if not re.match(r'^#(?:[0-9a-fA-F]{3}){1,2}$', value):
        raise ValidationError(
            f'{value} не является корректным HEX-цветом. Используйте формат #RGB или #RRGGBB.'
        )