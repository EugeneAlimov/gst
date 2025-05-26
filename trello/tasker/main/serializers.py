from rest_framework import serializers
from .utils.reminder_utils import validate_reminder_offset
from .models import *


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id', 'name', 'created', 'updated')  # Указываем только необходимые поля


class ActiveBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['active_board']

    def update(self, instance, validated_data):
        # Обновление активной доски для текущего пользователя
        active_board = validated_data.get('active_board')

        # Проверяем, что выбранная доска существует
        if not Board.objects.filter(id=active_board.id).exists():
            raise serializers.ValidationError("Выбранная доска не существует.")

        # Обновляем активную доску
        instance.active_board = active_board
        instance.save()
        return instance


class CardInColumnSerializer(serializers.ModelSerializer):
    card_id = serializers.IntegerField()
    column_id = serializers.IntegerField()
    position_in_column = serializers.IntegerField()

    class Meta:
        model = CardInColumn
        fields = ['id', 'card_id', 'column_id', 'position_in_column']


class CardSerializer(serializers.ModelSerializer):
    # Существующие поля...
    date_time_start = serializers.DateTimeField(required=False, allow_null=True)
    date_time_finish = serializers.DateTimeField(required=False, allow_null=True)
    reminder_offset_minutes = serializers.IntegerField(required=False, allow_null=True)
    reminder_calculated_time = serializers.DateTimeField(read_only=True)

    # Поля для создания карточки
    column_id = serializers.IntegerField(write_only=True, required=False)
    position_in_column = serializers.IntegerField(write_only=True, required=False)

    # Дополнительные поля для фронтенда
    reminder_status = serializers.SerializerMethodField()
    is_reminder_active = serializers.SerializerMethodField()

    class Meta:
        model = Card
        # КРИТИЧНО: убедитесь что новые поля включены!
        fields = '__all__'
        # ИЛИ явно перечислите:
        # fields = [
        #     'id', 'name', 'description', 'board', 'created', 'updated',
        #     'date_time_start', 'date_time_finish',  # <- ЭТИ ПОЛЯ
        #     'reminder_offset_minutes', 'reminder_calculated_time',  # <- И ЭТИ
        #     'reminder_status', 'is_reminder_active',
        #     # ... остальные поля
        # ]

    # ДОБАВЬТЕ ОТЛАДКУ в update метод:
    def update(self, instance, validated_data):
        print(f"🔍 SERIALIZER DEBUG: Получены данные для обновления:")
        print(f"- validated_data: {validated_data}")
        print(f"- instance.id: {instance.id}")

        # Проверяем какие поля пришли
        if 'date_time_start' in validated_data:
            print(f"✅ date_time_start: {validated_data['date_time_start']}")
        if 'date_time_finish' in validated_data:
            print(f"✅ date_time_finish: {validated_data['date_time_finish']}")
        if 'reminder_offset_minutes' in validated_data:
            print(f"✅ reminder_offset_minutes: {validated_data['reminder_offset_minutes']}")

        # Сохраняем старые значения для логирования
        old_offset = instance.reminder_offset_minutes
        old_calculated = instance.reminder_calculated_time

        # АВТОМАТИЧЕСКОЕ ОТКЛЮЧЕНИЕ при выполнении
        if validated_data.get('is_completed', False):
            if instance.reminder_offset_minutes or instance.reminder_calculated_time:
                print(f"SERIALIZER DEBUG: Отключаем напоминание для карточки {instance.id}")
                validated_data['reminder_offset_minutes'] = None
                validated_data['reminder_calculated_time'] = None

        # Передаем текущего пользователя в модель для логирования
        if 'request' in self.context:
            instance._current_user = self.context['request'].user

        # Обновляем инстанс
        result = super().update(instance, validated_data)

        print(f"🔍 SERIALIZER DEBUG: После обновления:")
        print(f"- result.date_time_start: {result.date_time_start}")
        print(f"- result.date_time_finish: {result.date_time_finish}")
        print(f"- result.reminder_offset_minutes: {result.reminder_offset_minutes}")
        print(f"- result.reminder_calculated_time: {result.reminder_calculated_time}")

        return result


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'


class ColorSerializer(serializers.ModelSerializer):
    """Сериализатор для цветов"""

    # Поля для совместимости с фронтендом
    normal = serializers.CharField(source='normal_color', read_only=True)
    hover = serializers.CharField(source='hover_color', read_only=True)
    colorNumber = serializers.IntegerField(source='color_number', read_only=True)
    colorName = serializers.CharField(source='color_name', read_only=True)
    isDark = serializers.BooleanField(source='is_dark', read_only=True)
    textColor = serializers.CharField(source='text_color', read_only=True)

    class Meta:
        model = Color
        fields = [
            'id', 'color_number', 'normal_color', 'hover_color',
            'color_name', 'is_dark', 'text_color',
            # Поля для совместимости
            'normal', 'hover', 'colorNumber', 'colorName', 'isDark', 'textColor'
        ]


class ChipSerializer(serializers.ModelSerializer):
    """Сериализатор для чипа с полной информацией о цвете"""
    color = ColorSerializer(read_only=True)
    color_id = serializers.IntegerField(write_only=True)

    # Поля для совместимости - делаем необязательными
    text = serializers.CharField(source='name', required=False, allow_blank=True)
    color_number = serializers.IntegerField(source='color.color_number', read_only=True)

    class Meta:
        model = Chip
        fields = [
            'id', 'name', 'color', 'color_id', 'created', 'updated',
            # Поля для совместимости
            'text', 'color_number'
        ]
        # Делаем name необязательным
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        """Создание чипа - разрешаем пустое имя"""
        # Просто создаем чип как есть, без автоматической генерации имени
        print(f"Creating chip with name: '{validated_data.get('name', '')}'")  # Для отладки
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Обновление чипа с возвратом полных данных"""
        if 'color_id' in validated_data:
            color_id = validated_data.pop('color_id')
            instance.color = Color.objects.get(id=color_id)

        # Обновляем имя только если оно передано
        if 'name' in validated_data:
            instance.name = validated_data['name']

        instance.save()
        instance.refresh_from_db()
        return instance

    def to_representation(self, instance):
        """Возвращаем полные данные, включая цвет"""
        data = super().to_representation(instance)

        # Убеждаемся, что цвет включен в ответ
        if instance.color:
            data['color'] = ColorSerializer(instance.color).data

        return data


class ChipDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для чипа с полной информацией о цвете"""
    color = ColorSerializer(read_only=True)

    # Поля для совместимости со старым API
    text = serializers.CharField(source='name', read_only=True)
    color_number = serializers.IntegerField(source='color.color_number', read_only=True)

    class Meta:
        model = Chip
        fields = [
            'id', 'name', 'color', 'created', 'updated',
            # Поля для совместимости
            'text', 'color_number'
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        # model = get_user_model()
        # fields = '__all__'
        fields = (
            'active_board',
            'photo',
            'id',
            'is_superuser',
            'username',
            'first_name',
            'last_name',
            'email',
            'is_staff',
        )


class BoardMembershipSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='username', queryset=UserProfile.objects.all())
    board = serializers.SlugRelatedField(slug_field='name', queryset=Board.objects.all())

    class Meta:
        model = BoardMembership
        fields = ['user', 'board', 'role', 'created_at']

    def create(self, validated_data):
        return BoardMembership.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance
