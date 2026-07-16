from rest_framework import serializers
from .models import UserAttendance

class UserAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAttendance
        fields = "__all__"
        # 'user' is set automatically by the view from the logged-in user,
        # so we mark it as read-only (not required in POST data)
        read_only_fields = ['user']
