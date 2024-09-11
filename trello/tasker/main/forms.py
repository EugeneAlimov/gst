from django.contrib.auth.forms import UserChangeForm
from .models import UserProfile


class UserProfileChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = UserProfile
