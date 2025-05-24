from django.contrib import admin
from django.utils.html import format_html
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
    list_display = ('color_preview', 'color_number', 'color_name', 'normal_color', 'hover_color', 'is_dark')
    search_fields = ('color_name', 'color_number', 'normal_color')
    list_filter = ('is_dark',)
    ordering = ('color_number',)

    fields = (
        'color_number',
        'color_name',
        'normal_color',
        'hover_color',
        'text_color',
        'is_dark',
        'color_preview'
    )
    readonly_fields = ('color_preview',)

    def color_preview(self, obj):
        """Создает интерактивный предпросмотр цвета"""
        if not obj.normal_color:
            return '-'

        return format_html(
            '<div style="display: flex; gap: 10px; align-items: center;">'
            '<div style="'
            'background-color: {}; '
            'width: 60px; '
            'height: 30px; '
            'border-radius: 4px; '
            'border: 1px solid #ddd; '
            'transition: background-color 0.3s; '
            'display: flex; '
            'align-items: center; '
            'justify-content: center; '
            'color: {}; '
            'font-weight: bold; '
            'font-size: 10px; '
            '" '
            'onmouseover="this.style.backgroundColor=\'{}\'" '
            'onmouseout="this.style.backgroundColor=\'{}\'" '
            'title="Наведите для просмотра hover-эффекта"'
            '>#{}</div>'
            '<div style="font-size: 11px; color: #666;">'
            'Normal: {}<br>'
            'Hover: {}'
            '</div>'
            '</div>',
            obj.normal_color,
            obj.text_color,
            obj.hover_color,
            obj.normal_color,
            obj.color_number,
            obj.normal_color,
            obj.hover_color
        )

    color_preview.short_description = 'Предпросмотр'


class ColorAdminForm(forms.ModelForm):
    """Форма для администрирования цветов с дополнительными полями"""

    class Meta:
        model = Color
        fields = '__all__'

    # Дополнительное поле для генерации hover-цвета
    generate_hover = forms.BooleanField(
        required=False,
        label='Сгенерировать цвет при наведении',
        help_text='Автоматически создать цвет при наведении на основе базового'
    )


# Обновляем админку для Chip с учётом связи с Color
@admin.register(Chip)
class ChipAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_color_preview', 'get_color_name', 'created')
    list_filter = ('color', 'created')
    search_fields = ('name', 'color__color_name')
    autocomplete_fields = ['color']

    def get_color_name(self, obj):
        return obj.color.color_name if obj.color else '-'

    get_color_name.short_description = 'Цвет'

    def get_color_preview(self, obj):
        if not obj.color:
            return '-'

        return format_html(
            '<div style="'
            'background-color: {}; '
            'width: 40px; '
            'height: 20px; '
            'border-radius: 3px; '
            'border: 1px solid #ddd; '
            'transition: background-color 0.3s; '
            '" '
            'onmouseover="this.style.backgroundColor=\'{}\'" '
            'onmouseout="this.style.backgroundColor=\'{}\'"'
            '></div>',
            obj.color.normal_color,
            obj.color.hover_color,
            obj.color.normal_color
        )

    get_color_preview.short_description = 'Предпросмотр'


@admin.register(CardInColumn)
class CardInColumnAdmin(admin.ModelAdmin):
    list_display = ('card', 'column', 'position_in_column', 'is_archived')
    search_fields = ('card__name', 'column__name')
    list_filter = ('is_archived',)
