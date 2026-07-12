from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import StudentAttendance
from .serializers import StudentAttendanceSerializer


class StudentAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StudentAttendance.objects.all()
    serializer_class = StudentAttendanceSerializer

    def get_permissions(self):
        # Only admin can delete attendance records
        # Any logged-in user can view and mark attendance
        if self.action == 'destroy':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Automatically save who marked the attendance
        serializer.save(marked_by=self.request.user)