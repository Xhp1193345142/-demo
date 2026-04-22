from smtplib import SMTPException

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from .models import User


class EmailDeliveryError(Exception):
    """邮件发送失败时抛出的业务异常。"""


def build_frontend_base_url(request) -> str:
    request_origin = request.headers.get("Origin", "").rstrip("/")
    if request_origin:
        return request_origin

    configured_base_url = settings.FRONTEND_BASE_URL.rstrip("/")
    if configured_base_url:
        return configured_base_url

    return "http://127.0.0.1:3000"


def make_email_verification_payload(user: User) -> dict[str, str]:
    return {
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": default_token_generator.make_token(user),
    }


def verify_email_token(uid: str, token: str) -> User | None:
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return None

    if not default_token_generator.check_token(user, token):
        return None

    return user


def send_verification_email(user: User, request) -> str:
    payload = make_email_verification_payload(user)
    verify_url = (
        f"{build_frontend_base_url(request)}/verify-email/"
        f"{payload['uid']}/{payload['token']}"
    )

    subject = "请验证你的 Buyu 邮箱"
    message = render_to_string(
        "accounts/verify_email.txt",
        {
            "username": user.username,
            "verify_url": verify_url,
        },
    )

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except SMTPException as exc:
        raise EmailDeliveryError("邮件服务器连接失败，请检查 SMTP 配置是否正确。") from exc
    except Exception as exc:
        raise EmailDeliveryError("验证邮件发送失败，请检查邮箱服务配置后重试。") from exc

    return verify_url
