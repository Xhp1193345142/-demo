"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

type HeaderUser = {
  username?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
};

const navItems = [
  { href: "#top", label: "首页" },
  { href: "#plans", label: "会员方案" },
  { href: "#content-model", label: "网站说明" },
  { href: "#build-roadmap", label: "下一步" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const currentUserLevel = currentUser?.is_superuser
    ? "超级管理员"
    : currentUser?.is_staff
      ? "管理员"
      : "普通用户";
  const currentUserDisplayName = currentUser?.username || "个人中心";
  const currentUserEmail = currentUser?.email || "未绑定邮箱";

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

        if (!response.ok) {
          setCurrentUser(null);
          return;
        }

        const data = (await response.json()) as { user?: HeaderUser };
        setCurrentUser(data.user ?? null);
      } catch {
        if (!isCancelled) {
          setCurrentUser(null);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const ensureCsrfCookie = async () => {
    await fetch(`${API_BASE_URL}/accounts/csrf/`, {
      method: "GET",
      credentials: "include",
    });

    const cookieItem = document.cookie
      .split("; ")
      .find((item) => item.startsWith("csrftoken="));

    const csrfToken = cookieItem ? decodeURIComponent(cookieItem.split("=")[1] ?? "") : "";
    if (!csrfToken) {
      throw new Error("未能获取 CSRF 安全凭证，请稍后重试。");
    }

    return csrfToken;
  };

  const handleLogout = async () => {
    setIsSubmitting(true);

    try {
      const csrfToken = await ensureCsrfCookie();
      const response = await fetch(`${API_BASE_URL}/accounts/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error("退出登录失败。");
      }

      setCurrentUser(null);
      setUserMenuOpen(false);
      closeMobileMenu();
      router.push("/");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionJump = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) {
      closeMobileMenu();
      return;
    }

    if (pathname !== "/") {
      event.preventDefault();
      router.push(`/${href}`);
      closeMobileMenu();
      return;
    }

    if (href === "#top") {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      closeMobileMenu();
      return;
    }

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);

    if (!target) {
      closeMobileMenu();
      return;
    }

    event.preventDefault();

    const sectionOffset = window.innerWidth >= 1024 ? 104 : 92;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - sectionOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });

    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/6 bg-[rgba(248,245,236,0.9)] backdrop-blur-xl">
      <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 lg:px-10 xl:px-14">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-full px-1 py-1 transition hover:opacity-88"
          onClick={closeMobileMenu}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-semibold text-[var(--color-paper)] shadow-[0_10px_24px_rgba(28,30,27,0.18)]">
            BU
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold tracking-[0.28em] text-[var(--color-ink)] uppercase">
              Buyu
            </span>
            <span className="block text-xs text-[var(--color-muted)]">个人内容网站</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center justify-self-center overflow-x-auto rounded-full border border-black/6 bg-white/55 p-1.5 text-sm text-[var(--color-muted)] shadow-[0_12px_30px_rgba(28,30,27,0.05)] lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleSectionJump(event, item.href)}
              className="shrink-0 rounded-full px-4 py-2 transition hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center justify-self-end gap-2 sm:gap-3 lg:flex">
          {currentUser ? (
            <>
              <Link
                href="/courses"
                className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)]"
              >
                课程中心
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="inline-flex max-w-[26rem] items-center gap-3 rounded-full border border-[var(--color-ink)]/12 bg-white/78 px-3 py-2 text-left text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="min-w-0">
                    <span className="block max-w-[14rem] truncate text-sm font-semibold">
                      {currentUserDisplayName}
                      <span className="mx-1.5 text-[var(--color-muted)]">·</span>
                      {currentUserEmail}
                    </span>
                  </span>
                  <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-[var(--color-accent-strong)]">
                    {currentUserLevel}
                  </span>
                  <span
                    className={`text-xs transition ${userMenuOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {userMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-48 overflow-hidden rounded-[1.4rem] border border-black/8 bg-[rgba(248,245,236,0.96)] p-2 shadow-[0_20px_50px_rgba(28,30,27,0.14)] backdrop-blur-xl">
                    <div className="grid gap-1">
                      <Link
                        href="/dashboard"
                        className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-black/[0.04]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        个人中心
                      </Link>
                      {(currentUser.is_staff || currentUser.is_superuser) ? (
                        <Link
                          href="http://127.0.0.1:8000/admin/"
                          className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-black/[0.04]"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          管理员后台
                        </Link>
                      ) : null}
                      <div className="my-1 h-px bg-black/6" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isSubmitting}
                        className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-[var(--color-ink)] transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? "退出中..." : "退出登录"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[var(--color-ink)]/12 bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
            >
              登录
            </Link>
          )}
          {!currentUser ? (
            <a
              href="#plans"
              onClick={(event) => handleSectionJump(event, "#plans")}
              className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)]"
            >
              查看方案
            </a>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-ink)]/12 bg-white/72 text-[var(--color-ink)] shadow-[0_10px_24px_rgba(28,30,27,0.08)] transition hover:border-[var(--color-ink)]/30 hover:bg-white lg:hidden"
        >
          <span className="sr-only">{mobileMenuOpen ? "关闭菜单" : "打开菜单"}</span>
          <span className="relative h-4 w-4">
            <span
              className={`absolute left-0 top-0.5 h-[1.5px] w-4 rounded-full bg-current transition ${
                mobileMenuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[1.5px] w-4 rounded-full bg-current transition ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[13.5px] h-[1.5px] w-4 rounded-full bg-current transition ${
                mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-black/6 bg-[rgba(248,245,236,0.96)] transition-[max-height,opacity] duration-300 lg:hidden ${
          mobileMenuOpen ? "max-h-[calc(100svh-88px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100svh-88px)] space-y-5 overflow-y-auto px-6 py-5">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleSectionJump(event, item.href)}
                className="block rounded-2xl border border-black/6 bg-white/70 px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="grid gap-3">
            {currentUser ? (
              <>
                <div className="rounded-[1.75rem] border border-black/6 bg-white/78 px-4 py-4 shadow-[0_12px_28px_rgba(28,30,27,0.05)]">
                  <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                    {currentUserDisplayName}
                    <span className="mx-1.5 text-[var(--color-muted)]">·</span>
                    {currentUserEmail}
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                    {currentUserLevel}
                  </p>
                </div>
                <Link
                  href="/courses"
                  onClick={closeMobileMenu}
                  className="rounded-full border border-[var(--color-ink)]/12 bg-white/78 px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                >
                  课程中心
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="rounded-full border border-[var(--color-ink)]/12 bg-white/78 px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                >
                  个人中心
                </Link>
                {(currentUser.is_staff || currentUser.is_superuser) ? (
                  <Link
                    href="http://127.0.0.1:8000/admin/"
                    onClick={closeMobileMenu}
                    className="rounded-full border border-[var(--color-ink)]/12 bg-white/78 px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
                  >
                    管理员后台
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isSubmitting}
                  className="rounded-full border border-[var(--color-ink)]/12 bg-white/78 px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "退出中..." : "退出登录"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="rounded-full border border-[var(--color-ink)]/12 bg-white/78 px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
              >
                登录
              </Link>
            )}
            {!currentUser ? (
              <a
                href="#plans"
                onClick={(event) => handleSectionJump(event, "#plans")}
                className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)]"
              >
                查看方案
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
