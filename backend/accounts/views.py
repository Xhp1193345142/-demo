from django.conf import settings
from django.contrib.auth import get_user_model, login, logout
from django.db import transaction
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import serializers
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .email_verification import EmailDeliveryError, send_verification_email, verify_email_token
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


User = get_user_model()


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"detail": "CSRF cookie 已设置。"})


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        email = User.objects.normalize_email(request.data.get("email", "")).lower()
        existing_user = User.objects.filter(email=email).first() if email else None

        if existing_user and existing_user.email_verified:
            return Response(
                {"detail": "该邮箱已经注册。"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if existing_user and not existing_user.email_verified:
            try:
                send_verification_email(existing_user, request)
            except EmailDeliveryError as exc:
                return Response(
                    {"detail": str(exc)},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            return Response(
                {
                    "message": "该邮箱已注册但尚未验证，我们已经重新发送验证邮件。",
                    "user": UserSerializer(existing_user).data,
                },
                status=status.HTTP_200_OK,
            )

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                user = serializer.save()
                send_verification_email(user, request)
        except EmailDeliveryError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "message": "注册成功，验证邮件已发送，请先完成邮箱验证。",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = User.objects.normalize_email(serializer.validated_data["email"]).lower()
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "邮箱或密码不正确。"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(password):
            return Response(
                {"detail": "邮箱或密码不正确。"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.email_verified:
            return Response(
                {"detail": "当前邮箱尚未验证，请先去邮箱点击激活链接。"},
                status=status.HTTP_403_FORBIDDEN,
            )

        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        return Response(
            {
                "message": "登录成功。",
                "user": UserSerializer(user).data,
            }
        )


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logout(request)
        return Response({"message": "已退出登录。"})


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"user": UserSerializer(request.user).data})


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        uid = request.query_params.get("uid", "")
        token = request.query_params.get("token", "")

        user = verify_email_token(uid, token)
        if user is None:
            return Response(
                {"detail": "验证链接无效或已过期。"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.email_verified:
            user.email_verified = True
            user.email_verified_at = timezone.now()
            user.save(update_fields=["email_verified", "email_verified_at", "updated_at"])

        login(request, user, backend="django.contrib.auth.backends.ModelBackend")

        return Response(
            {
                "message": "邮箱验证成功，现在可以正常购买会员和访问课程内容。",
                "user": UserSerializer(user).data,
            }
        )


class ResendVerificationEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        email = User.objects.normalize_email(request.data.get("email", "")).lower()
        if not email:
            raise serializers.ValidationError({"email": "请先填写邮箱。"})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "如果该邮箱已注册，我们已经重新发送验证邮件。"})

        if user.email_verified:
            return Response({"message": "当前邮箱已经验证过，无需重复发送。"})

        try:
            send_verification_email(user, request)
        except EmailDeliveryError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "message": "验证邮件已重新发送，请前往邮箱查收。",
            }
        )
