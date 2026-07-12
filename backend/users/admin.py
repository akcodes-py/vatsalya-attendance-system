from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import User

class CustomUserAdmin(DefaultUserAdmin):
    # Add plain_password and role to fieldsets so they show up on the edit page
    fieldsets = DefaultUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'plain_password')}),
    )
    # Add to list_display so it shows in the table view
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'plain_password', 'is_staff')

admin.site.register(User, CustomUserAdmin)
