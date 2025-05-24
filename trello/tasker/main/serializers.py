from rest_framework import serializers
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
    column_id = serializers.SerializerMethodField()  # Получаем column_id через метод
    position_in_column = serializers.SerializerMethodField()  # Получаем position_in_column через метод
    card_in_columns = CardInColumnSerializer(many=True, read_only=True, required=False)
    # Объявляем поля, которые могут быть null или могут отсутствовать
    date_time_start = serializers.DateTimeField(required=False, allow_null=True)
    date_time_finish = serializers.DateTimeField(required=False, allow_null=True)
    date_time_reminder = serializers.DateTimeField(required=False, allow_null=True)
    created = serializers.DateTimeField(required=False, read_only=True)  # Поле только для чтения
    updated = serializers.DateTimeField(required=False, read_only=True)  # Поле только для чтения
    header_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Card
        fields = '__all__'

    def validate(self, data):
        """Валидация данных карточки"""
        # Проверяем, что date_time_finish позже чем date_time_start если оба указаны
        if 'date_time_start' in data and 'date_time_finish' in data:
            if data['date_time_start'] and data['date_time_finish']:
                if data['date_time_finish'] < data['date_time_start']:
                    raise serializers.ValidationError(
                        "Дата завершения не может быть раньше даты начала"
                    )
        return data

    def get_column_id(self, obj):
        # Предполагаем, что карточка может быть привязана к одной колонке
        card_in_column = obj.card_in_columns.first()  # Берем первую колонку
        if card_in_column:
            return card_in_column.column.id  # Возвращаем ID колонки
        return None

    def get_position_in_column(self, obj):
        # Предполагаем, что карточка может быть привязана к одной колонке
        card_in_column = obj.card_in_columns.first()
        if card_in_column:
            return card_in_column.position_in_column  # Возвращаем позицию карточки в колонке
        return None


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

    # Поля для совместимости
    text = serializers.CharField(source='name')
    color_number = serializers.IntegerField(source='color.color_number', read_only=True)

    class Meta:
        model = Chip
        fields = [
            'id', 'name', 'color', 'color_id', 'created', 'updated',
            # Поля для совместимости
            'text', 'color_number'
        ]

    def update(self, instance, validated_data):
        """Обновление чипа с возвратом полных данных"""
        if 'color_id' in validated_data:
            color_id = validated_data.pop('color_id')
            instance.color = Color.objects.get(id=color_id)

        if 'name' in validated_data:
            instance.name = validated_data['name']

        instance.save()
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
