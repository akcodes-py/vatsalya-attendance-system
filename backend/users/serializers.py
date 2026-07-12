from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # write_only means password is accepted on input but never returned in response
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password', 'created_at']

    def create(self, validated_data):
        # Pop password out before creating user
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            # This properly hashes the password for authentication
            user.set_password(password)
            # This saves the plain text password for admin to see
            user.plain_password = password
        user.save()
        return user


class EmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email.')

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError('Wrong password.')

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        refresh['role'] = user.role

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
