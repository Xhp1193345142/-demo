"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { NebulaBackground } from "@/components/nebula-background";
import {
  dashboardPreviewCourses,
  dashboardQuickActions,
  membershipTiers,
} from "@/lib/site";

type DashboardUser = {
  username?: string;
  email?: string;
  email_verified?: boolean;
  email_verified_at?: string | null;
  date_joined?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
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

async function ensureCsrfCookie() {
  await fetch(`${API_BASE_URL}/accounts/csrf/`, {
    method: "GET",
    credentials: "include",
  });

  const csrfToken = readCookie("csrftoken");
  if (!csrfToken) {
    throw new Error("未能获取 CSRF 安全凭证，请稍后再试。");
  }

  return csrfToken;
}

function formatDate(dateString?: string | null) {
  if (!dateString) {
    return "待补充";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "待补充";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/accounts/me/`, {
          method: "GET",
          credentials: "include",
        });

        if (isCancelled) {
          return;
        }

        if (response.status === 403 || response.status === 401) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || "读取当前用户信息失败。");
        }

        setUser((data.user as DashboardUser | undefined) ?? null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "加载个人中心失败。");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function handleResendVerificationEmail() {
    setIsResendingEmail(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const csrfToken = await ensureCsrfCookie();
      const response = await fetch(`${API_BASE_URL}/accounts/resend-verification-email/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "重新发送验证邮件失败。");
      }

      setInfoMessage(
        data.email_backend?.includes("console")
          ? "当前是开发模式，新的验证链接已经输出到 Django 控制台。"
          : "验证邮件已重新发送，请前往邮箱查收。",
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "重新发送验证邮件失败。");
    } finally {
      setIsResendingEmail(false);
    }
  }

  return (
    <div className="relative isolate overflow-hidden bg-black">
      <NebulaBackground />
      <div className="relative mx-auto min-h-[calc(100svh-88px)] w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.24em] uppercase text-white/78 backdrop-blur-sm">
                Personal Dashboard
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl leading-[1.02] font-semibold tracking-[-0.05em] text-white md:text-6xl">
                  登录后先进入一个清晰的个人内容入口。
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  这个页面不是复杂后台，而是让用户知道自己当前状态、接下来该看什么、还差哪一步才能进入正式课程内容。
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.75rem] border border-white/12 bg-[rgba(255,255,255,0.12)] p-6 backdrop-blur-md">
                <p className="text-sm text-white/60">当前会员</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  普通访客 Demo
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  等你后面接入订阅系统后，这里会显示真实会员等级、到期时间和可访问内容范围。
                </p>
              </article>

              <article className="rounded-[1.75rem] border border-white/12 bg-[rgba(255,255,255,0.12)] p-6 backdrop-blur-md">
                <p className="text-sm text-white/60">可访问内容</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {dashboardPreviewCourses.length} 组课程入口
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  现在先用 demo 数据把个人中心的内容结构搭起来，后续再接真实课程表。
                </p>
              </article>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {dashboardQuickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`rounded-[1.6rem] border p-6 transition ${
                    action.tone === "accent"
                      ? "border-white/16 bg-[rgba(255,255,255,0.14)] text-white hover:bg-[rgba(255,255,255,0.18)]"
                      : "border-white/10 bg-[rgba(255,255,255,0.08)] text-white/88 hover:bg-[rgba(255,255,255,0.12)]"
                  }`}
                >
                  <p className="text-xl font-semibold tracking-[-0.03em]">{action.title}</p>
                  <p className="mt-3 text-sm leading-6 text-white/70">{action.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-[2rem] border border-white/14 bg-[rgba(248,245,236,0.92)] p-7 shadow-[0_28px_90px_rgba(8,10,20,0.28)] backdrop-blur-xl">
              {isLoading ? (
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">Loading</p>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                    正在读取你的个人中心数据...
                  </h2>
                </div>
              ) : user ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Account Snapshot
                    </p>
                    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                      欢迎回来，{user.username}
                    </h2>
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      这是登录后的第一版个人中心 demo，后面会继续接课程、会员和支付状态。
                    </p>
                  </div>

                  {!user.email_verified ? (
                    <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-700">
                      你的邮箱还没有完成验证。后续接入课程权限和支付后，建议先完成验证再继续。
                    </div>
                  ) : null}

                  {infoMessage ? (
                    <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-6 text-emerald-700">
                      {infoMessage}
                    </div>
                  ) : null}

                  {errorMessage ? (
                    <div className="rounded-[1.4rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
                      {errorMessage}
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.35rem] bg-white/75 px-5 py-4">
                      <p className="text-sm text-[var(--color-muted)]">登录邮箱</p>
                      <p className="mt-2 text-base font-medium text-[var(--color-ink)]">{user.email}</p>
                    </div>
                    <div className="rounded-[1.35rem] bg-white/75 px-5 py-4">
                      <p className="text-sm text-[var(--color-muted)]">邮箱状态</p>
                      <p className="mt-2 text-base font-medium text-[var(--color-ink)]">
                        {user.email_verified ? "已验证" : "未验证"}
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] bg-white/75 px-5 py-4">
                      <p className="text-sm text-[var(--color-muted)]">注册时间</p>
                      <p className="mt-2 text-base font-medium text-[var(--color-ink)]">
                        {formatDate(user.date_joined)}
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] bg-white/75 px-5 py-4">
                      <p className="text-sm text-[var(--color-muted)]">当前身份</p>
                      <p className="mt-2 text-base font-medium text-[var(--color-ink)]">
                        {user.is_superuser
                          ? "超级管理员"
                          : user.is_staff
                            ? "管理员"
                            : "普通注册用户"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/courses"
                      className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)]"
                    >
                      去看课程目录
                    </Link>
                    {!user.email_verified ? (
                      <button
                        type="button"
                        onClick={handleResendVerificationEmail}
                        disabled={isResendingEmail}
                        className="rounded-full border border-[var(--color-ink)]/10 bg-white/75 px-6 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isResendingEmail ? "正在重发验证邮件..." : "重新发送验证邮件"}
                      </button>
                    ) : null}
                    {(user.is_staff || user.is_superuser) ? (
                      <Link
                        href="http://127.0.0.1:8000/admin/"
                        className="rounded-full border border-[var(--color-ink)]/10 bg-white/75 px-6 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                      >
                        进入 Django Admin
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Login Required
                  </p>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                    这个页面是登录后的个人中心入口。
                  </h2>
                  <p className="text-sm leading-6 text-[var(--color-muted)]">
                    你还没有登录，所以这里先展示结构预览。登录后会看到自己的邮箱状态、身份信息和下一步入口。
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/login"
                      className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)]"
                    >
                      去登录
                    </Link>
                    <Link
                      href="/"
                      className="rounded-full border border-[var(--color-ink)]/10 bg-white/75 px-6 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                    >
                      返回首页
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.12)] p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-white/62">Course Preview</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                    未来会出现在这里的课程入口
                  </h3>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                  Demo
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {dashboardPreviewCourses.map((course, index) => (
                  <article
                    key={course.title}
                    className="rounded-[1.4rem] border border-white/10 bg-[rgba(248,245,236,0.14)] px-5 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{course.title}</p>
                        <p className="mt-2 text-sm leading-6 text-white/72">{course.summary}</p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
                        {course.level}
                      </div>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/46">
                      Slot {index + 1}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.12)] p-6 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.22em] text-white/62">Membership Hint</p>
              <div className="mt-4 grid gap-3">
                {membershipTiers.map((tier) => (
                  <div
                    key={tier.tier}
                    className="rounded-[1.3rem] border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-semibold text-white">{tier.name}</p>
                      <span className="text-sm text-white/72">{tier.price}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/68">{tier.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
