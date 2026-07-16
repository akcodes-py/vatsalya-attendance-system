from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from .models import UserAttendance
from .serializers import UserAttendanceSerializer
import datetime


class UserAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = UserAttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admin sees all attendance
        # Normal user sees only their own attendance
        if self.request.user.is_staff:
            return UserAttendance.objects.all()
        return UserAttendance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically save the logged-in user as the attendance user.
        # If attendance already exists for today, catch the error and
        # return a friendly 400 message instead of crashing with 500.
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise ValidationError("Attendance already marked for today.")

    @action(detail=False, methods=['get'])
    def calendar(self, request):
        # Returns attendance for the current month in calendar format
        today = datetime.date.today()
        month = int(request.query_params.get('month', today.month))
        year = int(request.query_params.get('year', today.year))

        # Get attendance records for this user for the month
        records = UserAttendance.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month
        )

        # Build a simple dictionary: date -> status
        calendar_data = {}
        for record in records:
            calendar_data[str(record.date)] = record.status

        return Response({
            'year': year,
            'month': month,
            'attendance': calendar_data
        })
