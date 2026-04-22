"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { NebulaBackground } from "@/components/nebula-background";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";
  const hasValidParams = Boolean(uid && token);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("正在验证邮箱，请稍候...");

  useEffect(() => {
    if (!hasValidParams) {
      return;
    }

    let isCancelled = false;

    async function verifyEmail() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/accounts/verify-email/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();

        if (isCancelled) {
          return;
        }

        if (!response.ok) {
          setStatus("error");
          setMessage(data.detail || "验证失败，链接可能已经失效。");
          return;
        }

        setStatus("success");
        setMessage(data.message || "邮箱验证成功。");
      } catch {
        if (isCancelled) {
          return;
        }

        setStatus("error");
        setMessage("验证请求失败，请稍后重试。");
      }
    }

    void verifyEmail();

    return () => {
      isCancelled = true;
    };
  }, [hasValidParams, token, uid]);

  const resolvedStatus = hasValidParams ? status : "error";
  const resolvedMessage = hasValidParams
    ? message
    : "验证链接不完整，请重新从邮件中打开。";

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <NebulaBackground />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(248,245,236,0.08),rgba(12,10,18,0.36)_42%,rgba(8,8,12,0.68)_100%)]" />

      <div className="mx-auto flex min-h-[calc(100svh-88px)] max-w-3xl items-center px-6 py-10 lg:px-10">
        <section className="w-full rounded-[2rem] border border-white/14 bg-[rgba(248,245,236,0.92)] p-8 shadow-[0_28px_90px_rgba(8,10,20,0.28)] backdrop-blur-xl md:p-10">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-[var(--color-ink)]/10 bg-white/78 px-4 py-2 text-xs font-medium tracking-[0.24em] uppercase text-[var(--color-muted)]">
              Email Verification
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--color-ink)]">
                {resolvedStatus === "loading"
                  ? "正在验证你的邮箱"
                  : resolvedStatus === "success"
                    ? "邮箱验证成功"
                    : "邮箱验证失败"}
              </h1>
              <p className="text-base leading-7 text-[var(--color-muted)]">{resolvedMessage}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold text-[var(--color-paper)] shadow-[0_12px_28px_rgba(201,108,60,0.24)] transition hover:bg-[var(--color-accent-strong)]"
              >
                返回登录页
              </Link>
              <Link
                href="/"
                className="rounded-full border border-[var(--color-ink)]/10 bg-white/75 px-6 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)]/30 hover:bg-white"
              >
                返回首页
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
