"""
URL configuration for tasker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name="home")
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include("blog.urls"))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from main import views

from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView, TokenRefreshView, TokenBlacklistView

from main.views import UpdateActiveBoardView

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'board', views.BoardsViewSet, basename='board')
router.register(r'user-boards', views.UserBoardsViewSet, basename='userBoard')
router.register(r'card-in-column', views.CardInColumnViewSet, basename='cardInColumn')
router.register(r'board-membership', views.BoardMembershipViewSet, basename='boardMembership')

# router.register(r'update-active-board', views.UpdateActiveBoardViewSet, basename='updateActiveBoard')

router.register(r'card', views.CardViewSet, basename='card')
router.register(r'column', views.ColumnViewSet, basename='column')
router.register(r'columns-on-board', views.ColumnsOnBoardViewSet, basename='columnsOnBoard')
router.register(r'chip', views.ChipViewSet, basename='chip')
router.register(r'color', views.ColorViewSet, basename='color')
router.register(r'comment', views.CommentViewSet, basename='comment')
router.register(r'checklist-item', views.ChecklistItemViewSet, basename='checklist-item')

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/v1/', include(router.urls)),
                  # path('api/v1/auth/', include('rest_framework.urls')),
                  path('login/', TemplateView.as_view(template_name="index.html")),
                  path('user/', TemplateView.as_view(template_name="index.html")),
                  path('board/', TemplateView.as_view(template_name="index.html")),

                  path('api/v1/update-active-board/', UpdateActiveBoardView.as_view(), name='update_active_board'),

                  path('user-boards/', TemplateView.as_view(template_name="index.html")),
                  path('board-membership/', TemplateView.as_view(template_name="index.html")),
                  path('card-in-column/', TemplateView.as_view(template_name="index.html")),
                  path('column/', TemplateView.as_view(template_name="index.html")),
                  path('columns-on-board/', TemplateView.as_view(template_name="index.html")),
                  path('card/', TemplateView.as_view(template_name="index.html")),
                  path('chip/', TemplateView.as_view(template_name="index.html")),
                  path('color/', TemplateView.as_view(template_name="index.html")),
                  path('comment/', TemplateView.as_view(template_name="index.html")),
                  path('checklist-item/', TemplateView.as_view(template_name="index.html")),
                  path('', TemplateView.as_view(template_name="index.html")),

                  # path('settings', TemplateView.as_view(template_name="index.html")),
                  # path('analytics', TemplateView.as_view(template_name="index.html")),
                  # path('dashboard', TemplateView.as_view(template_name="index.html")),
                  # path('tags-to-ws/', WSTagsUpdateView.as_view(), name='tags-to-ws'),
                  # path('user-dataset-update/<int:pk>/', UserSetUpdateView.as_view(), name="user-dataset-update"),
                  # path('analytic/chart/', TemplateView.as_view(template_name="index.html")),
                  path('api/v1/auth/', include('djoser.urls')),
                  re_path(r'auth/', include('djoser.urls.authtoken')),
                  path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                  path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
                  path('api/v1/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
                  # path('api/v1/pars-tags-list/', pars_tags_list_view, name='pars-tags-list')
              ] \
              + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
              + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
