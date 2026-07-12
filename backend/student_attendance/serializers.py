from rest_framework import serializers
from .models import StudentAttendance

class StudentAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttendance
        fields = "__all__"
