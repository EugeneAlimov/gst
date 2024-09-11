from django.contrib.auth import get_user_model
from drf_writable_nested import WritableNestedModelSerializer

from rest_framework import serializers
from .models import *


class BoardSerializer(serializers.ModelSerializer):
    # name = serializers.SlugRelatedField(
    #     many=False,
    #     slug_field='board',
    #     queryset=Column.objects.all()
    # )

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

    # def create(self, validated_data):
    class Meta:
        model = CardInColumn
        fields = ['id', 'card_id', 'column_id', 'position_in_column']
    #     card_id = validated_data['card_id']
    #     column_id = validated_data['column_id']
    #     position_in_column = validated_data['position_in_column']
    #
    #     card_in_column, created = CardInColumn.objects.update_or_create(
    #         card_id=card_id,
    #         column_id=column_id,
    #         defaults={'position_in_column': position_in_column}
    #     )
    #     return card_in_column
    #
    # class Meta:
    #     model = CardInColumn
    #     fields = '__all__'


class CardSerializer(serializers.ModelSerializer):
    card_in_columns = CardInColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'name', 'header_color', 'text', 'status', 'comments_how_many', 'checklist_how_many',
                  'date_time_start', 'date_time_finish', 'date_time_reminder', 'created', 'updated', 'is_subscribed',
                  'in_process', 'is_archived', 'is_have_description', 'header_image', 'card_in_columns']
        # fields = '__all__'


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
