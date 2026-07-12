from django.db import models
from django.conf import settings
from students.models import Student


class StudentAttendance(models.Model):
    STATUS = [
        ("P", "Present"),
        ("A", "Absent"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    marked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=1, choices=STATUS)
    date = models.DateField()

    class Meta:
        unique_together = ("student", "date")

    def __str__(self):
        return f"{self.student.name} - {self.date}"