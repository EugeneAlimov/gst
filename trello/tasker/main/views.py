import json
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.templatetags import rest_framework
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    """
    Работа с данными текущего пользователя.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Возвращаем только текущего пользователя
        return UserProfile.objects.filter(pk=self.request.user.pk)


class UserBoardsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Работа с досками пользователя.
    """
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Возвращаем только доски текущего пользователя
        return Board.objects.filter(user=self.request.user)


class BoardMembershipViewSet(viewsets.ViewSet):
    """
    Вьюсет для управления участниками досок и взаимодействием с досками.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """
        Возвращает список всех досок, на которых пользователь является участником.
        """
        boards = Board.objects.filter(members__user=request.user)
        serializer = BoardSerializer(boards, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='add-member')
    def add_member(self, request, pk=None):
        """
        Добавляет участника к доске.
        """
        board = get_object_or_404(Board, pk=pk)
        if board.user != request.user:
            return Response({'error': 'У вас нет прав на добавление участников.'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        role = request.data.get('role', 'viewer')
        user = get_object_or_404(UserProfile, pk=user_id)

        # Проверяем, существует ли уже связь
        if BoardMembership.objects.filter(board=board, user=user).exists():
            return Response({'error': 'Этот пользователь уже является участником доски.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Создаем связь
        BoardMembership.objects.create(board=board, user=user, role=role)
        return Response({'message': f'Пользователь {user.username} добавлен с ролью {role}.'},
                        status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='remove-member')
    def remove_member(self, request, pk=None):
        """
        Удаляет участника с доски.
        """
        board = get_object_or_404(Board, pk=pk)
        if board.user != request.user:
            return Response({'error': 'У вас нет прав на удаление участников.'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        user = get_object_or_404(UserProfile, pk=user_id)

        # Удаляем связь
        membership = BoardMembership.objects.filter(board=board, user=user).first()
        if not membership:
            return Response({'error': 'Этот пользователь не является участником доски.'},
                            status=status.HTTP_400_BAD_REQUEST)

        membership.delete()
        return Response({'message': f'Пользователь {user.username} удален с доски.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], url_path='change-role')
    def change_role(self, request, pk=None):
        """
        Изменяет роль участника на доске.
        """
        board = get_object_or_404(Board, pk=pk)
        if board.user != request.user:
            return Response({'error': 'У вас нет прав на изменение ролей участников.'},
                            status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        role = request.data.get('role')
        if role not in ['admin', 'editor', 'viewer']:
            return Response({'error': 'Недопустимая роль.'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(UserProfile, pk=user_id)
        membership = BoardMembership.objects.filter(board=board, user=user).first()
        if not membership:
            return Response({'error': 'Этот пользователь не является участником доски.'},
                            status=status.HTTP_400_BAD_REQUEST)

        membership.role = role
        membership.save()
        return Response({'message': f'Роль пользователя {user.username} изменена на {role}.'})

    @action(detail=True, methods=['get'], url_path='members')
    def list_members(self, request, pk=None):
        """
        Возвращает список участников доски.
        """
        board = get_object_or_404(Board, pk=pk)
        if not BoardMembership.objects.filter(board=board, user=request.user).exists():
            return Response({'error': 'У вас нет доступа к участникам этой доски.'}, status=status.HTTP_403_FORBIDDEN)

        members = BoardMembership.objects.filter(board=board)
        data = [
            {
                'id': member.user.id,
                'username': member.user.username,
                'role': member.role,
                'joined_at': member.joined_at
            } for member in members
        ]
        return Response(data)


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

    def create(self, request, *args, **kwargs):
        # Проверяем, что все необходимые данные присутствуют
        if 'board' not in request.data:
            return Response({"error": "Не указана доска"}, status=status.HTTP_400_BAD_REQUEST)

        # Проверяем, что доска существует
        board_id = request.data.get('board')
        try:
            board = Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            return Response({"error": f"Доска с ID {board_id} не найдена"}, status=status.HTTP_404_NOT_FOUND)

        # Устанавливаем позицию, если не указана
        data = request.data.copy()
        if 'position_on_board' not in data or not data.get('position_on_board'):
            # Получаем максимальную позицию и добавляем 1
            max_position = Column.objects.filter(board_id=board_id).aggregate(models.Max('position_on_board'))
            max_position = max_position['position_on_board__max'] or 0
            data['position_on_board'] = max_position + 1

        # Если имя не указано, используем значение по умолчанию
        if 'name' not in data or not data.get('name'):
            data['name'] = 'Новая колонка'

        # Создаем колонку
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    # def perform_create(self, serializer):
    #     """"Создаем новую карточку - Создание новой и подготовка полей"""
    #     # Сначала создаем карту без привязки к пользователям
    #     card = serializer.save()
    #
    #     # Предположим, что текущий пользователь является экземпляром UserProfile и мы хотим его добавить к карте
    #     # Например, добавляем текущего пользователя к ManyToMany полю
    #     user_profile = UserProfile.objects.get(username=self.request.user)  # Получаем профиль текущего пользователя
    #     card.user.add(user_profile)
    #     column_id = self.request.data.get('column_id')
    #     position_in_column = self.request.data.get('position_in_column', 0)
    #     column = get_object_or_404(Column, id=column_id)
    #     CardInColumn.objects.create(card=card, column=column, position_in_column=position_in_column)
    #
    # def create(self, request, *args, **kwargs):
    #     """"Создаем новую карточку - Сохранение"""
    #     serializer = self.get_serializer(data=request.data)
    #
    #     if not serializer.is_valid():
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #
    #     self.perform_create(serializer)
    #
    #     headers = self.get_success_headers(serializer.data)
    #
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """Создаем новую карточку с привязкой к пользователю и колонке"""
        try:
            # Получаем текущего пользователя - он уже является экземпляром UserProfile
            user_profile = self.request.user

            # Получаем и проверяем column_id
            column_id = self.request.data.get('column_id')
            if not column_id:
                raise ValueError("Не указан column_id")

            # Проверяем, существует ли колонка
            try:
                column = Column.objects.get(id=column_id)
            except Column.DoesNotExist:
                raise ValueError(f"Колонка с ID {column_id} не найдена")

            # Определяем позицию карточки в колонке
            position_in_column = self.request.data.get('position_in_column')
            if position_in_column is None:
                # Если позиция не указана, ставим карточку в конец
                max_position = CardInColumn.objects.filter(column=column).aggregate(
                    models.Max('position_in_column')
                )['position_in_column__max'] or -1
                position_in_column = max_position + 1

            # Создаем карточку
            card = serializer.save(board=column.board)  # Устанавливаем доску автоматически

            # Добавляем пользователя к карточке
            card.assigned_users.add(user_profile)

            # Создаем связь с колонкой
            CardInColumn.objects.create(
                card=card,
                column=column,
                position_in_column=position_in_column
            )

            return card

        except ValueError as e:
            # Конвертируем ValueError в ValidationError, чтобы DRF её правильно обработал
            from rest_framework.exceptions import ValidationError
            raise ValidationError(str(e))
        except Exception as e:
            # Логируем неожиданные ошибки
            print(f"Ошибка при создании карточки: {str(e)}")
            raise  # Пробрасываем ошибку дальше

    def create(self, request, *args, **kwargs):
        """Создание карточки с пустым именем и автоматическим определением доски"""
        # Создаем копию данных запроса для модификации
        data = request.data.copy()

        # Убеждаемся, что name может быть пустым
        if 'name' not in data:
            data['name'] = ""  # Пустое имя по умолчанию

        # Обработка поля board - получаем из колонки
        if 'board' not in data and 'column_id' in data:
            column_id = data.get('column_id')
            try:
                column = Column.objects.get(id=column_id)
                data['board'] = column.board.id  # Устанавливаем board из колонки
                print(f"Автоматически установлена доска {data['board']} из колонки {column_id}")
            except Column.DoesNotExist:
                return Response(
                    {"error": f"Колонка с ID {column_id} не найдена"},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Стандартная валидация через сериализатор
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            print("Ошибки валидации:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Создание карточки
        self.perform_create(serializer)

        # Возвращаем данные созданной карточки
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


class ColorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для работы с цветами
    """
    queryset = Color.objects.all().order_by('color_number')
    serializer_class = ColorSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def palette(self, request):
        """
        Возвращает цвета в формате, совместимом с фронтендом
        """
        colors = self.get_queryset()
        palette_data = []

        for color in colors:
            palette_data.append({
                'id': color.id,
                'colorNumber': color.color_number,
                'normal': color.normal_color,
                'hover': color.hover_color,
                'colorName': color.color_name,
                'isDark': color.is_dark,
                'textColor': color.text_color
            })

        return Response(palette_data)


class ChipViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с чипами"""
    queryset = Chip.objects.all()
    serializer_class = ChipSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Создание нового чипа"""
        print("Received data:", request.data)  # Для отладки

        # Подготавливаем данные для сериализатора
        data = {}

        # Обрабатываем название чипа - РАЗРЕШАЕМ ПУСТОЕ
        name = request.data.get('name') or request.data.get('text', '').strip()
        # Убираем проверку на обязательность!
        # if not name:
        #     return Response(
        #         {'error': 'Необходимо указать название чипа'},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        data['name'] = name  # Может быть пустым

        # Обрабатываем color_id - ТОЛЬКО ЭТО ОБЯЗАТЕЛЬНО
        color_id = request.data.get('color_id')
        if not color_id:
            return Response(
                {'error': 'Необходимо указать color_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        data['color_id'] = color_id

        # Создаем сериализатор с подготовленными данными
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            chip = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)  # Для отладки
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Обновление чипа"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Логируем исходные данные
        print(f"Updating chip {instance.id}, old updated: {instance.updated}")

        # Подготавливаем данные для сериализатора
        data = {}

        # Обрабатываем название чипа - РАЗРЕШАЕМ ПУСТОЕ
        name = request.data.get('name') or request.data.get('text')
        if name is not None:  # Обновляем только если передано
            data['name'] = name.strip()

        # Обрабатываем color_id
        color_id = request.data.get('color_id')
        if color_id:
            data['color_id'] = color_id

        serializer = self.get_serializer(instance, data=data, partial=partial)

        if serializer.is_valid():
            chip = serializer.save()

            # Логируем результат
            print(f"Chip updated: {chip.id}, new updated: {chip.updated}")
            print(f"Serialized data: {serializer.data}")

            return Response(serializer.data)
        else:
            print("Update validation errors:", serializer.errors)  # Для отладки
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
