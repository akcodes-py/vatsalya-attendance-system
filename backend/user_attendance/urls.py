from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserAttendanceViewSet

router = DefaultRouter()
router.register(r'', UserAttendanceViewSet, basename='userattendance')

urlpatterns = [
    path("", include(router.urls)),
]
