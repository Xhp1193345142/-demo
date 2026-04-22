import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Buyu | 公开内容与会员课程站",
  description: "一个适合从飞书课程迁移到独立站的 Next.js + Django 会员内容平台骨架。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[var(--color-paper)] text-[var(--color-ink)]">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          <SiteHeader />
          <main className="relative flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
