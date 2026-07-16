from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from user_attendance.models import UserAttendance
import datetime

# Get the custom User model
User = get_user_model()


# ─────────────────────────────────────────────
# MODEL TESTS
# These tests check that the UserAttendance model works correctly
# ─────────────────────────────────────────────

class UserAttendanceModelTest(TestCase):

    def setUp(self):
        """
        Create a test user before each test.
        """
        self.user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='pass123'
        )

    def test_create_attendance_record(self):
        """
        Check that we can create an attendance record for a user.
        """
        # Create an attendance record
        attendance = UserAttendance.objects.create(
            user=self.user,
            date=datetime.date.today(),
            status='P',           # P = Present
            check_in='09:00:00'
        )

        # Check it was saved correctly
        self.assertEqual(attendance.user, self.user)
        self.assertEqual(attendance.status, 'P')

    def test_photo_field_is_optional(self):
        """
        The photo field should be optional (null and blank allowed).
        A user can mark attendance even without a photo.
        """
        # Create attendance WITHOUT a photo
        attendance = UserAttendance.objects.create(
            user=self.user,
            date=datetime.date.today(),
            status='P'
        )

        # Photo should be empty/None
        self.assertFalse(attendance.photo)

    def test_attendance_str_shows_username_and_date(self):
        """
        The __str__ of UserAttendance should show "username - date"
        """
        today = datetime.date.today()
        attendance = UserAttendance.objects.create(
            user=self.user,
            date=today,
            status='P'
        )

        # Should display like: "staffuser - 2026-07-17"
        expected = f"staffuser - {today}"
        self.assertEqual(str(attendance), expected)

    def test_duplicate_attendance_on_same_day_is_not_allowed(self):
        """
        A user cannot mark attendance twice on the same day.
        The model has unique_together = ("user", "date").
        """
        today = datetime.date.today()

        # Create first attendance - this should work fine
        UserAttendance.objects.create(
            user=self.user,
            date=today,
            status='P'
        )

        # Try to create a second attendance for the same day
        # This should raise an error (IntegrityError)
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            UserAttendance.objects.create(
                user=self.user,
                date=today,
                status='P'
            )


# ─────────────────────────────────────────────
# API TESTS
# These tests check the attendance marking API endpoint
# ─────────────────────────────────────────────

class UserAttendanceAPITest(APITestCase):

    def setUp(self):
        """
        Create a test user and log them in to get a JWT token.
        We need the token to make authenticated API requests.
        """
        self.user = User.objects.create_user(
            username='apiuser',
            email='apiuser@example.com',
            password='pass123'
        )

        # Generate a JWT token for the user (like logging in)
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        # The attendance API URL
        self.url = '/api/user-attendance/'

    def test_user_can_mark_attendance(self):
        """
        A logged-in user should be able to POST attendance and get 201 Created.
        """
        # Set the Authorization header with our JWT token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Send attendance data
        response = self.client.post(self.url, {
            'date': str(datetime.date.today()),
            'status': 'P',
            'check_in': '09:00:00'
        })

        # 201 means the record was successfully Created
        self.assertEqual(response.status_code, 201)

    def test_unauthenticated_user_cannot_mark_attendance(self):
        """
        If someone tries to mark attendance WITHOUT a JWT token,
        the API should return 401 Unauthorized.
        """
        # No token is set here — unauthenticated request
        response = self.client.post(self.url, {
            'date': str(datetime.date.today()),
            'status': 'P',
        })

        # 401 means Unauthorized
        self.assertEqual(response.status_code, 401)

    def test_user_cannot_mark_attendance_twice_on_same_day(self):
        """
        If a user tries to mark attendance for the same day twice,
        the API should return 400 Bad Request.
        """
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        today = str(datetime.date.today())

        # First request - should succeed
        self.client.post(self.url, {
            'date': today,
            'status': 'P',
        })

        # Second request on same day - should fail
        response = self.client.post(self.url, {
            'date': today,
            'status': 'P',
        })

        # 400 means Bad Request (duplicate attendance)
        self.assertEqual(response.status_code, 400)
