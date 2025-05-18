# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .forms import UserProfileChangeForm
# from django.db import transaction
# from django import forms
#
# from .models import *
#
#
# @admin.register(UserProfile)
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('username', 'email', 'active_board', 'is_staff', 'is_active')
#     search_fields = ('username', 'email')
#     list_filter = ('is_staff', 'is_active')
#
# @admin.register(Board)
# class BoardAdmin(admin.ModelAdmin):
#     list_display = ('name', 'user', 'is_active', 'created', 'updated')
#     search_fields = ('name', 'user__username')
#     list_filter = ('is_active', 'created')
#
# @admin.register(BoardMembership)
# class BoardMembershipAdmin(admin.ModelAdmin):
#     list_display = ('board', 'user', 'role', 'joined_at')
#     search_fields = ('board__name', 'user__username', 'role')
#     list_filter = ('role', 'joined_at')
#
# class ColumnAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Column._meta.fields]
#     list_display_links = ['name']
#
#
# admin.site.register(Column, ColumnAdmin)
#
# class CardAdminForm(forms.ModelForm):
#     class Meta:
#         model = Card
#         fields = '__all__'
#
#     assigned_users = forms.ModelMultipleChoiceField(
#         queryset=UserProfile.objects.all(),
#         widget=admin.widgets.FilteredSelectMultiple('Назначенные пользователи', is_stacked=False),
#     )
#
# @admin.register(Card)
# class CardAdmin(admin.ModelAdmin):
#     form = CardAdminForm
#     list_display = ('name', 'is_completed', 'is_archived', 'created', 'updated')
#     list_filter = ('is_completed', 'is_archived', 'created', 'updated')
#     search_fields = ('name', 'description')
#     filter_horizontal = ('assigned_users',)  # Позволяет использовать интерфейс для выбора пользователей
#
#
# class ChipAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Chip._meta.fields]
#     list_display_links = ['name']
#
#
# admin.site.register(Chip, ChipAdmin)
#
#
# class CommentAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Comment._meta.fields]
#     list_display_links = ['text']
#
#
# admin.site.register(Comment, CommentAdmin)
#
#
# class ChecklistItemAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in ChecklistItem._meta.fields]
#     list_display_links = ['description']
#
#
# admin.site.register(ChecklistItem, ChecklistItemAdmin)
#
#
# class ColorAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Color._meta.fields]
#     list_display_links = ['color']
#
#
# admin.site.register(Color, ColorAdmin)
#
#
# class CardInColumnAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in CardInColumn._meta.fields]
#     list_display_links = ['card']
#
#
# admin.site.register(CardInColumn, CardInColumnAdmin)
from django.contrib import admin
from django import forms
from .models import *

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'active_board', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'email')}),
        ('Дополнительные поля', {'fields': ('active_board', 'photo', 'user_information')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_active', 'created', 'updated')
    search_fields = ('name', 'user__username')
    list_filter = ('is_active', 'created')

@admin.register(BoardMembership)
class BoardMembershipAdmin(admin.ModelAdmin):
    list_display = ('board', 'user', 'role', 'joined_at')
    search_fields = ('board__name', 'user__username', 'role')
    list_filter = ('role', 'joined_at')

@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ('name', 'board', 'position_on_board', 'created', 'updated')
    search_fields = ('name', 'board__name')
    list_filter = ('created', 'updated')

class CardAdminForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = '__all__'

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    form = CardAdminForm
    list_display = ('name', 'board', 'is_completed', 'is_archived', 'created', 'updated')
    list_filter = ('is_completed', 'is_archived', 'created', 'updated')
    search_fields = ('name', 'description')
    filter_horizontal = ('assigned_users',)

@admin.register(Chip)
class ChipAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'created', 'updated')
    search_fields = ('name', 'color')
    list_filter = ('created', 'updated')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('text', 'card', 'created', 'updated')
    search_fields = ('text', 'card__name')
    list_filter = ('created', 'updated')

@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('description', 'card', 'is_checked', 'created', 'updated')
    search_fields = ('description', 'card__name')
    list_filter = ('is_checked', 'created', 'updated')

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ('color', 'color_name', 'color_number')
    search_fields = ('color', 'color_name')

@admin.register(CardInColumn)
class CardInColumnAdmin(admin.ModelAdmin):
    list_display = ('card', 'column', 'position_in_column', 'is_archived')
    search_fields = ('card__name', 'column__name')
    list_filter = ('is_archived',)