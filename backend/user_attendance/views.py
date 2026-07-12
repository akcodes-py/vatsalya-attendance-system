from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
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
        # Automatically save the logged-in user as the attendance user
        serializer.save(user=self.request.user)

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
