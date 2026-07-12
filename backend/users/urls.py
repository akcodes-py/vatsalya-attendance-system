from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EmailLoginView

router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    path("email-login/", EmailLoginView.as_view(), name="email_login"),
    path("", include(router.urls)),
]
