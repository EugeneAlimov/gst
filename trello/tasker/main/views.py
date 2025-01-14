import json
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Возвращаем только текущего аутентифицированного пользователя
        return UserProfile.objects.filter(id=self.request.user.id)


class UserBoardsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BoardMembership.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Получаем все BoardMembership пользователя
        user_memberships = BoardMembership.objects.filter(user=self.request.user)

        # Возвращаем доски, к которым принадлежит пользователь через BoardMembership
        return Board.objects.filter(board_memberships__in=user_memberships)


class BoardMembershipViewSet(viewsets.ModelViewSet):
    queryset = BoardMembership.objects.all()
    serializer_class = BoardMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Фильтрация по доске, если это необходимо
        board_id = self.request.query_params.get('board', None)
        if board_id:
            print('BoardMembership 1', BoardMembership)
            return BoardMembership.objects.filter(board_id=board_id)
        print('BoardMembership 2', BoardMembership)
        return BoardMembership.objects.all()


class UpdateActiveBoardView(APIView):
    permission_classes = [IsAuthenticated]  # Убедимся, что только авторизованные пользователи могут изменять доску

    def patch(self, request, *args, **kwargs):
        # Получаем текущего пользователя
        user = request.user

        # Получаем текущий профиль пользователя
        user_profile = UserProfile.objects.get(id=user.id)

        # Сериализуем данные и обновляем
        serializer = ActiveBoardSerializer(user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            # Сохраняем изменения
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BoardsViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """"Получаем доски пользователя"""
        user = self.request.user

        response = Board.objects.filter(user=user)

        return response

    def partial_update(self, request, *args, **kwargs):
        """"Изменяем активную доску"""
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
        """"Получаем все колонки, которые относятся к доске"""
        try:
            board = self.request.GET.get('board')
            response = Column.objects.filter(board=board)

            return response
        except Column.DoesNotExist:

            return Response({"error": "Object not found"}, status=404)

    def partial_update(self, request, *args, **kwargs):
        """"Изменяем имя колонки"""
        pk = kwargs.get('pk', None)
        errors = []
        name = request.data.get('name')
        if not pk:
            return Response({"error": "Method PUT not allowed: no pk"})

        try:
            Column.objects.update_or_create(
                id=pk,
                defaults={'name': name}
            )
        except Exception as e:
            errors.append(str(e))

            if errors:
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)


# class ColumnsOnBoardViewSet(viewsets.ModelViewSet):
#     queryset = Column.objects.all()
#     serializer_class = ColumnSerializer
#     permission_classes = (IsAuthenticated,)
#
#     def partial_update(self, request, *args, **kwargs):
#         """"Обновить положение колонок на доске.
#             передается id доски чтобы отфильтровать колонки на этой доске"""
#         columns = request.data.get('columns')
#         print('columns', columns)
#         pk = kwargs.get('pk', None)
#         print('request.data columns ', request.data)
#         if not pk:
#             return Response({"error": "Method PUT not allowed: no pk"})
#
#         columns_queryset = Column.objects.filter(board=pk)
#         print('columns_queryset ', columns_queryset)
#
#         if columns_queryset.exists():
#             for c_s in columns_queryset:
#                 c_s_id = c_s.id
#
#                 for c in columns:
#                     if c['id'] == c_s_id:
#                         index = c['index']
#                         c_s.position_on_board = index
#                     c_s.save()
#             try:
#                 instance = Column.objects.filter(board=pk)
#                 serializer = BoardSerializer(instance)
#
#                 return Response(serializer.data)
#             except Board.DoesNotExist:
#                 return Response({"error": "Object not found"}, status=404)

class ColumnsOnBoardViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = (IsAuthenticated,)

    def partial_update(self, request, *args, **kwargs):
        """"Обновить положение колонок на доске.
            передается id доски чтобы отфильтровать колонки на этой доске"""
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

            # Сериализуем обновленные колонки
            serializer = ColumnSerializer(columns_queryset, many=True)
            return Response(serializer.data)
        return Response({"error": "No columns found for this board"}, status=status.HTTP_404_NOT_FOUND)

    
class CardInColumnViewSet(viewsets.ModelViewSet):
    queryset = CardInColumn.objects.all()
    serializer_class = CardInColumnSerializer
    permission_classes = (IsAuthenticated,)


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """"Получить все карточки в колонке"""
        column_id = self.request.query_params.get('column')
        if column_id:
            return Card.objects.filter(card_in_columns__column_id=column_id).order_by(
                'card_in_columns__position_in_column')
        return Card.objects.all().order_by('card_in_columns__position_in_column')

    @action(detail=False, methods=['post'], url_path='update-positions')
    def update_positions(self, request):
        """"Oбновить позиции всех карточек в колонке
            Используем метод POST потому что нужно передать массив карточек - без id"""
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
        """"Получить расположение карточки в разных колонках"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Получаем данные о карточках в колонках
        card_in_columns = instance.card_in_columns.all()
        card_in_columns_serializer = CardInColumnSerializer(card_in_columns, many=True)

        # Объединяем данные о карточке с данными о расположении в колонках
        data = serializer.data
        data['card_in_columns'] = card_in_columns_serializer.data

        return Response(data)

    def perform_create(self, serializer):
        """"Создаем новую карточку - Создание новой и подготовка полей"""
        # Сначала создаем карту без привязки к пользователям
        card = serializer.save()

        # Предположим, что текущий пользователь является экземпляром UserProfile и мы хотим его добавить к карте
        # Например, добавляем текущего пользователя к ManyToMany полю
        user_profile = UserProfile.objects.get(username=self.request.user)  # Получаем профиль текущего пользователя
        card.user.add(user_profile)
        column_id = self.request.data.get('column_id')
        position_in_column = self.request.data.get('position_in_column', 0)
        column = get_object_or_404(Column, id=column_id)
        CardInColumn.objects.create(card=card, column=column, position_in_column=position_in_column)

    def create(self, request, *args, **kwargs):
        """"Создаем новую карточку - Сохранение"""
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"error": "Method PUT not allowed: no pk"})

        # Получаем объект карточки
        card = Card.objects.filter(id=pk).first()
        if not card:
            return Response({"error": "Card not found"}, status=status.HTTP_404_NOT_FOUND)

        # Сначала обновляем другие поля карточки
        if 'field' in request.data:
            for i in request.data['field']:
                field = i
                value = request.data['field'][i]
                if field != 'chips':  # Чтобы не обновить chips повторно
                    Card.objects.update_or_create(
                        id=pk,
                        defaults={field: value}
                    )

        # Обновляем связь ManyToMany для chips
        chips = request.data.get('chips', None)
        if chips is not None:
            # Получаем чипы по переданным ID
            try:
                chip_objects = Chip.objects.filter(id__in=chips)
                card.chips.set(chip_objects)  # Обновляем связь
            except Chip.DoesNotExist:
                return Response({"error": "One or more chips not found"}, status=status.HTTP_400_BAD_REQUEST)

            card.save()  # Сохраняем изменения

        # Возвращаем обновленные данные
        serializer = CardSerializer(card)
        return Response(serializer.data)


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
