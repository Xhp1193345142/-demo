"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="border-t border-black/5 bg-[rgba(255,255,255,0.48)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[var(--color-muted)] lg:px-10">
        <p>Buyu 起步版骨架：公共内容站、独立登录页、会员分层和 Django 管理后台。</p>
        <p>下一步建议先打通登录鉴权、文章详情接口和支付订阅回调。</p>
      </div>
    </footer>
  );
}
