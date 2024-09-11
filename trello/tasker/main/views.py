from django.shortcuts import render
import json

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from django.http import Http404


# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


class BoardsViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        response = Board.objects.filter(user=user)

        return response

    def partial_update(self, request, *args, **kwargs):
        board = request.data
        board_copy = board.copy()

        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"error": "Method PUT not allowed"})

        for i in Board.objects.all():
            i.is_active = False
            i.save()

        is_active = json.loads(board['is_active'])
        board_copy.update({'is_active': is_active})

        q = Board.objects.all()
        q.get(pk=pk)
        b = Board.objects.get(pk=pk)
        b.is_active = is_active
        b.save()
        try:
            instance = Board.objects.get(pk=pk)
            serializer = BoardSerializer(instance)

            return Response(serializer.data)
        except Board.DoesNotExist:
            return Response({"error": "Object not found"}, status=404)


class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        try:
            board = self.request.GET.get('board')
            response = Column.objects.filter(board=board)

            return response
        except Column.DoesNotExist:

            return Response({"error": "Object not found"}, status=404)


class ColumnsOnBoardViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = (IsAuthenticated,)

    def partial_update(self, request, *args, **kwargs):
        columns = request.data.get('columns')
        pk = kwargs.get('pk', None)

        if not pk:
            return Response({"error": "Method PUT not allowed: no pk"})

        columns_queryset = Column.objects.filter(board=pk)

        if columns_queryset.exists():
            for c_s in columns_queryset:
                c_s_id = c_s.id

                for c in columns:
                    if c['id'] == c_s_id:
                        index = c['index']
                        c_s.position_on_board = index
                    c_s.save()
            try:
                instance = Column.objects.filter(board=pk)
                serializer = BoardSerializer(instance)

                return Response(serializer.data)
            except Board.DoesNotExist:
                return Response({"error": "Object not found"}, status=404)


class CardInColumnViewSet(viewsets.ModelViewSet):
    queryset = CardInColumn.objects.all()
    serializer_class = CardInColumnSerializer
    permission_classes = (IsAuthenticated,)

    def partial_update(self, request, *args, **kwargs):
        cards = request.data.get('cards')
        pk = kwargs.get('pk', None)
        print('cards ', cards)
        if not pk:
            return Response({"error": "Method PUT not allowed: no pk"})

        cards_queryset = CardInColumn.objects.filter(column=pk)

        if cards_queryset.exists():
            for c_s in cards_queryset:
                c_s_id = c_s.id

                for c in cards:
                    if c['id'] == c_s_id:
                        index = c['index']
                        c_s.position_in_column = index
                    c_s.save()
            try:
                instance = CardInColumn.objects.filter(card=pk)
                serializer = BoardSerializer(instance)

                return Response(serializer.data)
            except CardInColumn.DoesNotExist:
                return Response({"error": "Object not found"}, status=404)


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        column_id = self.request.query_params.get('column')
        if column_id:
            return Card.objects.filter(card_in_columns__column_id=column_id).order_by(
                'card_in_columns__position_in_column')
        return Card.objects.all().order_by('card_in_columns__position_in_column')

    @action(detail=False, methods=['post'], url_path='update-positions')
    def update_positions(self, request):
        # Using a set to keep track of processed items to avoid duplicates
        processed_items = set()
        errors = []
        cards = request.data['cards']
        target_column_id = request.data['target_column_id']

        for c in cards:
            card_id = c.get('card_id')
            index = c.get('index')

            if (card_id, index) in processed_items:
                errors.append(f"Duplicate entry for card_id {card_id} and column_id {index}")
                continue

            processed_items.add((card_id, index))

            try:
                CardInColumn.objects.update_or_create(
                    card_id=card_id,
                    defaults={'position_in_column': index, 'column_id': target_column_id}
                )
            except Exception as e:
                errors.append(str(e))

        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': 'Card positions updated'}, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Получаем данные о карточках в колонках
        card_in_columns = instance.card_in_columns.all()
        card_in_columns_serializer = CardInColumnSerializer(card_in_columns, many=True)

        # Объединяем данные о карточке с данными о расположении в колонках
        data = serializer.data
        data['card_in_columns'] = card_in_columns_serializer.data

        return Response(data)


class ChipViewSet(viewsets.ModelViewSet):
    queryset = Chip.objects.all()
    serializer_class = ChipSerializer
    permission_classes = (IsAuthenticated,)


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = (IsAuthenticated,)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        try:
            card = self.request.GET.get('card')
            response = Comment.objects.filter(card=card)
            return response
        except Comment.DoesNotExist:

            return Response({"error": "Object not found"}, status=404)


class ChecklistItemViewSet(viewsets.ModelViewSet):
    queryset = ChecklistItem.objects.all()
    serializer_class = ChecklistItemSerializer
    permission_classes = (IsAuthenticated,)

    # def get_queryset(self):
    #     try:
    #         card = self.request.GET.get('card')
    #         response = ChecklistItem.objects.filter(card=card)
    #         return response
    #     except ChecklistItem.DoesNotExist:
    #
    #         return Response({"error": "Object not found"}, status=404)
