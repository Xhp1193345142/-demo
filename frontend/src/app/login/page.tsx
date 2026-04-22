"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import { NebulaBackground } from "@/components/nebula-background";

type AuthMode = "login" | "register";

type LoginFormState = {
  email: string;
  password: string;
};

type RegisterFormState = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type AuthUser = {
  username?: string;
  email?: string;
  email_verified?: boolean;
  is_staff?: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const cookieItem = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookieItem ? decodeURIComponent(cookieItem.split("=")[1] ?? "") : "";
}

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(text.includes("<!DOCTYPE") ? "服务器返回了异常页面，请检查后端日志。" : "服务器返回了非 JSON 响应。");
  }

  return response.json();
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserVerified, setCurrentUserVerified] = useState(false);
  const [verificationHint, setVerificationHint] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [registrationPending, setRegistrationPending] = useState(false);

  const pageCopy = useMemo(() => {
    if (mode === "register") {
      return {
        eyebrow: "Create Account",
        title: "注册一个账号，进入你的课程空间。",
        description: "第一版先把邮箱注册和基础登录打通，后面再继续叠加会员订阅与权限控制。",
        actionLabel: "立即注册",
        helperText: "注册成功后会先发送验证邮件，完成邮箱验证后再进入个人中心。",
      };
    }

    return {
      eyebrow: "Sign In",
      title: "先用最直接的方式，把登录链路走通。",
      description: "这一版已经接入 Django 真实认证，登录成功后会保留当前会话状态。",
      actionLabel: "立即登录",
      helperText: "当前先保留邮箱登录这一条主链路，后续再逐步补找回密码和邮箱验证。",
    };
  }, [mode]);

  async function ensureCsrfCookie() {
    await fetch(`${API_BASE_URL}/accounts/csrf/`, {
      method: "GET",
      credentials: "include",
    });

    const csrfToken = readCookie("csrftoken");
    if (!csrfToken) {
      throw new Error("未能获取 CSRF 安全凭证，请确认前后端地址是否使用同一主机名。");
    }

    return csrfToken;
  }

  async function fetchCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/accounts/me/`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as {
      user?: AuthUser;
    };

    const user = data.user;
    if (user) {
      setCurrentUserName(user.username || user.email || "");
      setCurrentUserEmail(user.email || "");
      setCurrentUserVerified(Boolean(user.email_verified));
    }
  }

  function normalizeErrorMessage(payload: unknown) {
    if (!payload || typeof payload !== "object") {
      return "提交失败，请稍后重试。";
    }

    const entries = Object.entries(payload as Record<string, unknown>);
    for (const [, value] of entries) {
      if (typeof value === "string") {
        return value;
      }

      if (Array.isArray(value) && typeof value[0] === "string") {
        return value[0];
      }
    }

    const detail = (payload as { detail?: string }).detail;
    return detail || "提交失败，请检查输入内容。";
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const csrfToken = await ensureCsrfCookie();
      const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(normalizeErrorMessage(data));
      }

      setSuccessMessage("登录成功，当前会话已建立。");
      setVerificationHint("");
      const user = data.user as AuthUser | undefined;
      if (user) {
        setCurrentUserName(user.username || user.email || "");
        setCurrentUserEmail(user.email || "");
        setCurrentUserVerified(Boolean(user.email_verified));
        if (!user.email_verified) {
          setVerificationHint("当前邮箱还没有完成验证，请先去邮箱点击激活链接。");
        }
      }
      await fetchCurrentUser();
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "登录失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const csrfToken = await ensureCsrfCookie();
      const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          email: registerForm.email,
          username: registerForm.username,
          password: registerForm.password,
          confirm_password: registerForm.confirmPassword,
        }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(normalizeErrorMessage(data));
      }

      const user = data.user as AuthUser | undefined;
      setCurrentUserName(user?.username || user?.email || "");
      setCurrentUserEmail(user?.email || registerForm.email);
      setCurrentUserVerified(Boolean(user?.email_verified));
      setRegistrationPending(true);
      setSuccessMessage("注册成功，验证邮件已发送。");
      setVerificationHint(`验证邮件已发送到 ${user?.email || registerForm.email}，请前往邮箱点击激活链接。`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "注册失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendVerificationEmail() {
    setIsResendingEmail(true);
    setErrorMessage("");

    try {
      const csrfToken = await ensureCsrfCookie();
      const response = await fetch(`${API_BASE_URL}/accounts/resend-verification-email/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          email: currentUserEmail || registerForm.email,
        }),
      });

      const data = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(normalizeErrorMessage(data));
      }

      setSuccessMessage(data.message || "验证邮件已重新发送。");
      setVerificationHint(`验证邮件已重新发送到 ${currentUserEmail || registerForm.email}，请前往邮箱查收。`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "重发失败，请稍后再试。");
    } finally {
      setIsResendingEmail(false);
    }
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <NebulaBackground />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(248,245,236,0.08),rgba(12,10,18,0.36)_42%,rgba(8,8,12,0.68)_100%)]" />

      <div className="mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-6xl flex-col justify-start px-6 pt-10 pb-4 lg:px-10 lg:pt-12 lg:pb-5">
        <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-white/62">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span>Login</span>
        </div>

        <section className="mt-4 grid flex-1 gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.24em] uppercase text-white/74 backdrop-blur-sm">
              Member Access
            </div>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl leading-[1.02] font-semibold tracking-[-0.05em] text-white md:text-[3.45rem]">
                登录或注册后，再进入你的个人课程内容入口。
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/72 md:text-base">
                这一页只做认证入口，不堆复杂内容，让用户快速进入网站。现在已经支持第一版邮箱注册和邮箱登录。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/12 bg-[rgba(255,255,255,0.1)] px-5 py-4 text-sm leading-6 text-white/78 backdrop-blur-md">
                先把用户注册、登录和会话状态跑通，后面接会员订阅会轻松很多。
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-[rgba(255,255,255,0.1)] px-5 py-4 text-sm leading-6 text-white/78 backdrop-blur-md">
                下一步就可以接会员等级、付费订阅和课程访问控制。
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-[rgba(248,245,236,0.92)] p-6 shadow-[0_28px_90px_rgba(8,10,20,0.28)] backdrop-blur-xl md:p-7">
            <div className="grain pointer-events-none absolute inset-0 opacity-10" />

            <div className="relative space-y-5">
              <div className="relative inline-grid grid-cols-2 gap-0 rounded-full border border-[var(--color-ink)]/10 bg-white/78 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <span
                  className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-[var(--color-accent)] shadow-[0_10px_24px_rgba(201,108,60,0.24)] transition-transform duration-300 ease-out ${
                    mode === "register" ? "translate-x-[100%]" : "translate-x-0"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                    setSuccessMessage("");
                    setVerificationHint("");
                    setRegistrationPending(false);
                  }}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    mode === "login"
                      ? "text-[var(--color-paper)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  登录
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage("");
                    setSuccessMessage("");
                    setVerificationHint("");
                  }}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    mode === "register"
                      ? "text-[var(--color-paper)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  注册
                </button>
              </div>

              <div key={mode} className="auth-panel-enter space-y-2">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {pageCopy.eyebrow}
                </p>
                <h2 className="text-[2rem] leading-[1.06] font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                  {pageCopy.title}
                </h2>
                <p className="max-w-lg text-sm leading-6 text-[var(--color-muted)]">
                  {pageCopy.description}
                </p>
              </div>

              {mode === "login" ? (
                <form className="space-y-4 transition-all duration-300 ease-out" onSubmit={handleLoginSubmit}>
                  <div className="space-y-3">
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-[var(--color-muted)]">邮箱</span>
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-[var(--color-ink)]/10 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/55 focus:border-[var(--color-accent)] focus:bg-white"
                        required
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-[var(--color-muted)]">密码</span>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        placeholder="请输入密码"
                        className="w-full rounded-2xl border border-[var(--color-ink)]/10 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/55 focus:border-[var(--color-accent)] focus:bg-white"
                        required
                      />
                    </label>
                  </div>

                  {errorMessage ? (
                    <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                      {errorMessage}
                    </div>
                  ) : null}

                  {successMessage ? (
                    <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                      {successMessage}
                      {currentUserName ? ` 当前用户：${currentUserName}` : ""}
                    </div>
                  ) : null}

                  {verificationHint ? (
                    <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
                      {verificationHint}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? "登录中..." : pageCopy.actionLabel}
                    </button>
                    <Link
                      href="/"
                      className="rounded-full border border-[var(--color-ink)]/10 bg-white/75 px-6 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                    >
                      返回首页
                    </Link>
                  </div>

                  {!currentUserVerified && currentUserEmail ? (
                    <button
                      type="button"
                      onClick={handleResendVerificationEmail}
                      disabled={isResendingEmail}
                      className="text-left text-sm font-medium text-[var(--color-accent)] transition hover:text-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isResendingEmail ? "正在重发验证邮件..." : "没有收到邮件？重新发送验证链接"}
                    </button>
                  ) : null}
                </form>
              ) : (
                <form className="space-y-4 transition-all duration-300 ease-out" onSubmit={handleRegisterSubmit}>
                  <div className={`grid gap-3 md:grid-cols-2 ${registrationPending ? "opacity-70" : ""}`}>
                    <label className="block space-y-1.5 md:col-span-2">
                      <span className="text-sm font-medium text-[var(--color-muted)]">邮箱</span>
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-[var(--color-ink)]/10 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/55 focus:border-[var(--color-accent)] focus:bg-white"
                        required
                        disabled={registrationPending}
                      />
                    </label>

                    <label className="block space-y-1.5 md:col-span-2">
                      <span className="text-sm font-medium text-[var(--color-muted)]">用户名</span>
                      <input
                        type="text"
                        value={registerForm.username}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            username: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-[var(--color-ink)]/10 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/55 focus:border-[var(--color-accent)] focus:bg-white"
                        placeholder="注册后前台直接显示这个用户名"
                        required
                        disabled={registrationPending}
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-[var(--color-muted)]">密码</span>
                      <input
                        type="password"
                        value={registerForm.password}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        placeholder="请设置密码"
                        className="w-full rounded-2xl border border-[var(--color-ink)]/10 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/55 focus:border-[var(--color-accent)] focus:bg-white"
                        required
                        disabled={registrationPending}
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-[var(--color-muted)]">确认密码</span>
                      <input
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            confirmPassword: event.target.value,
                          }))
                        }
                        placeholder="请再次输入密码"
                        className="w-full rounded-2xl border border-[var(--color-ink)]/10 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/55 focus:border-[var(--color-accent)] focus:bg-white"
                        required
                        disabled={registrationPending}
                      />
                    </label>
                  </div>

                  {errorMessage ? (
                    <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                      {errorMessage}
                    </div>
                  ) : null}

                  {successMessage ? (
                    <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                      {successMessage}
                      {currentUserName ? ` 当前用户：${currentUserName}` : ""}
                    </div>
                  ) : null}

                  {verificationHint ? (
                    <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
                      {verificationHint}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isSubmitting || registrationPending}
                      className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {registrationPending ? "等待邮箱验证" : isSubmitting ? "注册中..." : pageCopy.actionLabel}
                    </button>
                    <Link
                      href="/"
                      className="rounded-full border border-[var(--color-ink)]/10 bg-white/75 px-6 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                    >
                      返回首页
                    </Link>
                  </div>

                  {!currentUserVerified && currentUserEmail ? (
                    <button
                      type="button"
                      onClick={handleResendVerificationEmail}
                      disabled={isResendingEmail}
                      className="text-left text-sm font-medium text-[var(--color-accent)] transition hover:text-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isResendingEmail ? "正在重发验证邮件..." : "没有收到邮件？重新发送验证链接"}
                    </button>
                  ) : null}
                </form>
              )}

              <div className="rounded-[1.35rem] bg-[rgba(255,255,255,0.72)] px-5 py-3.5 text-sm leading-6 text-[var(--color-muted)]">
                {pageCopy.helperText}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
