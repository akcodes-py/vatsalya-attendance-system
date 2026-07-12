from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES=[
        ("admin","Admin"),
        ("user","User"),
    ]

    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, default = "user",

    )
    plain_password = models.CharField(max_length=128, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.username