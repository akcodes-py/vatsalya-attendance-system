from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

# Get the custom User model we defined in users/models.py
User = get_user_model()


# ─────────────────────────────────────────────
# MODEL TESTS
# These tests check that our User model works correctly
# ─────────────────────────────────────────────

class UserModelTest(TestCase):

    def test_create_a_normal_user(self):
        """
        Step 1: Create a user in the test database.
        Step 2: Check that the user was saved correctly.
        """
        # Create a user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass123'
        )

        # Check the username is saved correctly
        self.assertEqual(user.username, 'testuser')

        # Check the email is saved correctly
        self.assertEqual(user.email, 'testuser@example.com')

        # Check the default role is 'user' (not admin)
        self.assertEqual(user.role, 'user')

        # Check that the password is NOT stored as plain text
        # Django hashes passwords for security
        self.assertNotEqual(user.password, 'testpass123')

    def test_create_an_admin_user(self):
        """
        Check that we can create a user with the 'admin' role.
        """
        admin = User.objects.create_user(
            username='adminuser',
            email='admin@example.com',
            password='adminpass123',
            role='admin'
        )

        # Check the role is 'admin'
        self.assertEqual(admin.role, 'admin')

    def test_user_str_returns_username(self):
        """
        The __str__ method in our model should return the username.
        This is used when we print a user object.
        """
        user = User.objects.create_user(
            username='myuser',
            email='myuser@example.com',
            password='pass123'
        )

        # str(user) should give us the username
        self.assertEqual(str(user), 'myuser')


# ─────────────────────────────────────────────
# API TESTS
# These tests check that our login API works correctly
# ─────────────────────────────────────────────

class LoginAPITest(APITestCase):

    def setUp(self):
        """
        setUp() runs BEFORE every test in this class.
        We create a test user here so all tests can use it.
        """
        self.user = User.objects.create_user(
            username='loginuser',
            email='login@example.com',
            password='mypassword123'
        )
        # The login URL
        self.login_url = '/api/users/email-login/'

    def test_login_with_correct_credentials_gives_token(self):
        """
        When we send the correct email and password,
        the API should return HTTP 200 and give us a JWT token.
        """
        # Send a POST request to the login endpoint
        response = self.client.post(self.login_url, {
            'email': 'login@example.com',
            'password': 'mypassword123'
        })

        # Check the response status is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the response contains an 'access' token
        self.assertIn('access', response.data)

        # Check that the response also contains a 'refresh' token
        self.assertIn('refresh', response.data)

    def test_login_with_wrong_password_gives_error(self):
        """
        When we send the wrong password,
        the API should return HTTP 400 (Bad Request).
        """
        response = self.client.post(self.login_url, {
            'email': 'login@example.com',
            'password': 'WRONG_PASSWORD'
        })

        # Should NOT be 200 OK
        self.assertEqual(response.status_code, 400)

    def test_login_with_wrong_email_gives_error(self):
        """
        When we send an email that doesn't exist,
        the API should return HTTP 400 (Bad Request).
        """
        response = self.client.post(self.login_url, {
            'email': 'doesnotexist@example.com',
            'password': 'mypassword123'
        })

        # Should NOT be 200 OK
        self.assertEqual(response.status_code, 400)

    def test_login_with_empty_fields_gives_error(self):
        """
        When we send an empty request,
        the API should return HTTP 400 (Bad Request).
        """
        response = self.client.post(self.login_url, {})

        # Should NOT be 200 OK
        self.assertEqual(response.status_code, 400)
