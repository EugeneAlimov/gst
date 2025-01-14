from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import UserProfileChangeForm
from django.db import transaction
from django import forms

from .models import *


# Register your models here.

class BoardAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Board._meta.fields]
    list_display_links = ['name']

    def save_model(self, request, obj, form, change):
        # Начинаем транзакцию для атомарности
        with transaction.atomic():
            # Сохраняем объект Board (доску)
            super().save_model(request, obj, form, change)

            if not change:  # Если доска новая
                user_profile = request.user  # Получаем профиль текущего пользователя
                BoardMembership.objects.create(user=user_profile, board=obj, role='owner')
            else:  # Если доска уже существует
                # Получаем текущего владельца
                current_owner = BoardMembership.objects.filter(board=obj, role='owner').first()

                if current_owner:
                    # Меняем роль текущего владельца на 'member'
                    current_owner.role = 'member'
                    current_owner.save()

                # Получаем пользователя, который выбран в поле owner
                new_owner = obj.owner  # Мы предполагаем, что obj.owner был обновлен в админке

                # Проверяем, есть ли уже этот пользователь в BoardMembership
                new_owner_membership = BoardMembership.objects.filter(board=obj, user=new_owner).first()

                if new_owner_membership:
                    # Если пользователь уже существует, обновляем его роль
                    new_owner_membership.role = 'owner'
                    new_owner_membership.save()
                else:
                    # Если пользователя нет в BoardMembership, создаем новую запись
                    BoardMembership.objects.create(user=new_owner, board=obj, role='owner')

                # Обновляем поле owner в самой доске
                obj.owner = new_owner
                obj.save()


admin.site.register(Board, BoardAdmin)


class BoardMembershipAdmin(admin.ModelAdmin):
    list_display = [field.name for field in BoardMembership._meta.fields]
    list_display_links = ['user']


admin.site.register(BoardMembership, BoardMembershipAdmin)


class ColumnAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Column._meta.fields]
    list_display_links = ['name']


admin.site.register(Column, ColumnAdmin)


class CardAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Card._meta.fields]
    list_display_links = ['name']


admin.site.register(Card, CardAdmin)


class ChipAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Chip._meta.fields]
    list_display_links = ['text']


admin.site.register(Chip, ChipAdmin)


class CommentAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Comment._meta.fields]
    list_display_links = ['text']


admin.site.register(Comment, CommentAdmin)


class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ChecklistItem._meta.fields]
    list_display_links = ['text']


admin.site.register(ChecklistItem, ChecklistItemAdmin)


class ColorAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Color._meta.fields]
    list_display_links = ['color']


admin.site.register(Color, ColorAdmin)


class CardInColumnAdmin(admin.ModelAdmin):
    list_display = [field.name for field in CardInColumn._meta.fields]
    list_display_links = ['card']


admin.site.register(CardInColumn, CardInColumnAdmin)


class UserProfileAdminForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Проверяем, если пользователь уже существует
        if self.instance.pk:  # Если пользователь уже существует
            user = self.instance  # Получаем текущего пользователя
            # Фильтруем доски, к которым этот пользователь имеет доступ
            self.fields['active_board'].queryset = Board.objects.filter(
                id__in=BoardMembership.objects.filter(user=user).values('board_id')
            )
        else:
            self.fields['active_board'].queryset = Board.objects.none()  # Для нового пользователя нет доступных досок

    def clean_active_board(self):
        active_board = self.cleaned_data.get('active_board')
        # Проверка, что выбранная доска принадлежит текущему пользователю
        if active_board and not BoardMembership.objects.filter(user=self.instance, board_id=active_board).exists():
            raise forms.ValidationError("You do not have access to the selected board.")
        return active_board


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    form = UserProfileAdminForm

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Custom fields', {'fields': ('active_board', 'photo', 'user_information')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'first_name', 'last_name'),
        }),
    )

    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)
