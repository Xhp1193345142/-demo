import { Fragment } from "react";

import Link from "next/link";

import { NebulaBackground } from "@/components/nebula-background";
import { accessMatrix, buildRoadmap, membershipTiers } from "@/lib/site";

export default function Home() {
  const heroSectionShell =
    "mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-6xl items-center px-6 py-12 lg:px-10 lg:py-16";
  const stackedSectionShell =
    "mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-6xl items-start px-6 py-20 lg:px-10 lg:py-24";

  return (
    <div id="top" className="relative isolate scroll-mt-24 bg-black">
      <NebulaBackground />
      <div className="relative">
        <section className={heroSectionShell}>
          <div className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white/80 uppercase backdrop-blur-sm">
                Personal Knowledge Website
              </div>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl leading-[1.04] font-semibold tracking-[-0.04em] text-white md:text-7xl">
                  先把它做成一个清晰、可信、适合长期更新的个人内容网站。
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
                  首页负责介绍你是谁、这里有什么内容，以及用户为什么愿意留下来。登录和后续会员能力独立存在，但不打断第一次访问。
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#content-model"
                  className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-accent-strong)]"
                >
                  了解网站结构
                </a>
                <Link
                  href="/login"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/16"
                >
                  前往登录
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-[rgba(255,255,255,0.12)] p-8 shadow-[0_24px_80px_rgba(8,10,20,0.28)] backdrop-blur-md">
              <div className="grain pointer-events-none absolute inset-0 opacity-10" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/62">
                  <span>站点模式</span>
                  <span>v0 scaffold</span>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-[rgba(248,245,236,0.92)] p-5">
                    <p className="text-sm text-[var(--color-muted)]">访客体验</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--color-ink)]">首页、价格页、公开文章可直接访问</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[rgba(248,245,236,0.92)] p-5">
                    <p className="text-sm text-[var(--color-muted)]">会员逻辑</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--color-ink)]">basic / pro / ultra 对应不同文章权限</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[rgba(248,245,236,0.92)] p-5">
                    <p className="text-sm text-[var(--color-muted)]">后端职责</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--color-ink)]">Django Admin + API + 订阅状态同步</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={stackedSectionShell}>
          <div id="plans" className="w-full scroll-mt-24 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-white/68">
                  Membership Tiers
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                  这一屏只讲清楚会员方案，让用户一眼看懂差别。
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-white/72">
                用三档会员承接不同深度的内容访问需求，价格、定位和权益都应该足够直白。
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {membershipTiers.map((plan) => (
                <article
                  key={plan.tier}
                  className="rounded-[1.75rem] border border-white/12 bg-[rgba(255,255,255,0.12)] p-6 shadow-[0_18px_60px_rgba(8,10,20,0.2)] backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">{plan.name}</p>
                    <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-white/76">
                      {plan.tier}
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white">{plan.price}</p>
                  <p className="mt-4 text-base leading-7 text-white/72">{plan.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={stackedSectionShell}>
          <div id="content-model" className="grid w-full scroll-mt-24 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-white/68">
                Access Model
              </p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                这一屏专门解释网站结构，让用户知道哪里能看、哪里需要登录。
              </h2>
              <p className="max-w-xl text-base leading-7 text-white/72">
                网站默认不强制首访登录。用户先通过公开内容认识你，再决定是否登录或继续升级，这样路径更自然。
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-[rgba(248,245,236,0.9)] shadow-[0_18px_60px_rgba(8,10,20,0.16)]">
              <div className="grid grid-cols-5 gap-px bg-[var(--color-ink)]/8 text-sm">
                {["内容模块", "游客", "basic", "pro", "ultra"].map((label) => (
                  <div key={label} className="bg-[var(--color-paper)] px-4 py-3 font-medium">
                    {label}
                  </div>
                ))}
                {accessMatrix.map((row) => (
                  <Fragment key={row.section}>
                    <div key={`${row.section}-section`} className="bg-[var(--color-paper)] px-4 py-4 font-medium">
                      {row.section}
                    </div>
                    <div key={`${row.section}-public`} className="bg-[var(--color-paper)] px-4 py-4 text-[var(--color-muted)]">
                      {row.public}
                    </div>
                    <div key={`${row.section}-basic`} className="bg-[var(--color-paper)] px-4 py-4 text-[var(--color-muted)]">
                      {row.basic}
                    </div>
                    <div key={`${row.section}-pro`} className="bg-[var(--color-paper)] px-4 py-4 text-[var(--color-muted)]">
                      {row.pro}
                    </div>
                    <div key={`${row.section}-ultra`} className="bg-[var(--color-paper)] px-4 py-4 text-[var(--color-muted)]">
                      {row.ultra}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={stackedSectionShell}>
          <div id="build-roadmap" className="w-full scroll-mt-24 rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(248,245,236,0.84))] p-8 shadow-[0_24px_80px_rgba(8,10,20,0.18)] backdrop-blur-md md:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Build Roadmap
                </p>
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                  这一屏只保留下一步，让人知道现在该先做什么。
                </h2>
                <p className="text-base leading-7 text-[var(--color-muted)]">
                  先把底层框架收稳，再逐步加课程、鉴权和支付，而不是一开始就把所有页面和能力一起堆上来。
                </p>
              </div>

              <div className="space-y-4">
                {buildRoadmap.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl bg-white/80 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-semibold text-[var(--color-paper)]">
                      {index + 1}
                    </span>
                    <p className="pt-2 text-base leading-7 text-[var(--color-muted)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
