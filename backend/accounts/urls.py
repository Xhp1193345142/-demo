from django.urls import path

from .views import (
    CsrfView,
    CurrentUserView,
    LoginView,
    LogoutView,
    RegisterView,
    ResendVerificationEmailView,
    VerifyEmailView,
)


urlpatterns = [
    path("csrf/", CsrfView.as_view(), name="accounts-csrf"),
    path("register/", RegisterView.as_view(), name="accounts-register"),
    path("login/", LoginView.as_view(), name="accounts-login"),
    path("logout/", LogoutView.as_view(), name="accounts-logout"),
    path("me/", CurrentUserView.as_view(), name="accounts-me"),
    path("verify-email/", VerifyEmailView.as_view(), name="accounts-verify-email"),
    path(
        "resend-verification-email/",
        ResendVerificationEmailView.as_view(),
        name="accounts-resend-verification-email",
    ),
]
