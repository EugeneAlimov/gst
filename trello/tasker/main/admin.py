from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import UserProfileChangeForm

from .models import *


# Register your models here.


class BoardAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Board._meta.fields]
    list_display_links = ['name']


admin.site.register(Board, BoardAdmin)


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


@admin.register(UserProfile)
class UserProfileAdmin(UserAdmin):
    form = UserProfileChangeForm

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Custom fields', {'fields': ('roles', 'active_board', 'photo', 'user_information')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
