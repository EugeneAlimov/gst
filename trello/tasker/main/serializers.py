from django.contrib.auth import get_user_model
from drf_writable_nested import WritableNestedModelSerializer

from rest_framework import serializers
from .models import *


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        """"" Возможный вариант записи если необходимо выбрать все записи из БД без исключения
            fields = '__all__' либо fields = ('name_group', 'name_tag', 'tag_table', 'data_type', 'comment') если
            необходимы конкретные записи """
        fields = '__all__'


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
    date_time_start = serializers.DateTimeField(required=False)
    date_time_finish = serializers.DateTimeField(required=False)
    date_time_reminder = serializers.DateTimeField(required=False)
    created = serializers.DateTimeField(required=False)
    updated = serializers.DateTimeField(required=False)
    header_image = serializers.ImageField(required=False)
    card_in_columns = CardInColumnSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Card
        # fields = ['id', 'name', 'header_color', 'text', 'status', 'comments_how_many', 'checklist_how_many',
        #           'date_time_start', 'date_time_finish', 'date_time_reminder', 'created', 'updated', 'is_subscribed',
        #           'in_process', 'is_archived', 'is_have_description', 'header_image', 'card_in_columns', 'column_id',
        #           'position_in_column']
        fields = '__all__'

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


class ChipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chip
        fields = '__all__'


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'


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
