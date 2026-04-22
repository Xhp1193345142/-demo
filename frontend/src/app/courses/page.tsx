import Link from "next/link";

import { NebulaBackground } from "@/components/nebula-background";
import {
  courseDirectory,
  coverToneClasses,
  levelClasses,
  statusClasses,
} from "@/lib/site";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function CoursesPage() {
  const latestUpdatedAt = courseDirectory
    .map((course) => new Date(course.updatedAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => right.getTime() - left.getTime())[0];

  const latestUpdatedLabel = latestUpdatedAt
    ? new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(latestUpdatedAt)
    : "待补充";

  return (
    <div className="relative isolate overflow-hidden bg-black">
      <NebulaBackground />
      <div className="relative mx-auto min-h-[calc(100svh-88px)] w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <section className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.24em] uppercase text-white/78 backdrop-blur-sm">
                Course Center 课程中心
              </div>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl leading-[1.02] font-semibold tracking-[-0.05em] text-white md:text-6xl">
                  把全部课程整理成一个清晰、可筛选、可继续扩展的内容目录。
                </h1>
                <p className="max-w-3xl text-base leading-7 text-white/74 md:text-lg">
                  先让用户一眼看到课程标题、封面、更新日期和会员等级，再决定进入哪一门课程继续学习。
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <article className="rounded-[1.5rem] border border-white/12 bg-[rgba(255,255,255,0.1)] px-5 py-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.22em] text-white/48">课程总数</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                  {courseDirectory.length}
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-white/12 bg-[rgba(255,255,255,0.1)] px-5 py-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.22em] text-white/48">最近更新</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                  {latestUpdatedLabel}
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-white/12 bg-[rgba(255,255,255,0.1)] px-5 py-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.22em] text-white/48">当前视图</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                  全部课程目录
                </p>
              </article>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[1.8rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                全部
              </span>
              <span className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/64">
                公开
              </span>
              <span className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/64">
                普通会员
              </span>
              <span className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/64">
                高级会员
              </span>
              <span className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/64">
                超级会员
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/62">
              <span className="rounded-full border border-white/12 px-4 py-2">按最近更新排序</span>
              <span className="rounded-full border border-white/12 px-4 py-2">后续可接搜索</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courseDirectory.map((course) => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.1)] shadow-[0_18px_60px_rgba(8,10,20,0.22)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.13)]"
              >
                <div
                  className={`relative h-52 overflow-hidden bg-gradient-to-br ${coverToneClasses[course.coverTone]}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_42%)]" />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                    <span className="rounded-full border border-white/20 bg-black/12 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/82">
                      {course.category}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${levelClasses[course.level]}`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/54">
                      {course.coverTitle}
                    </p>
                    <p className="mt-3 max-w-[14rem] text-2xl font-semibold tracking-[-0.04em] text-white">
                      {course.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <p className="text-sm leading-7 text-white/74">{course.summary}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/44">
                        最近更新
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {formatDate(course.updatedAt)}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/44">
                        课程状态
                      </p>
                      <p className={`mt-2 text-sm font-medium ${statusClasses[course.status]}`}>
                        {course.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">
                        章节数量
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">{course.lessonCount} 节内容</p>
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        course.status === "可查看"
                          ? "bg-white text-[var(--color-ink)] hover:bg-white/88"
                          : course.status === "需升级"
                            ? "bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent-strong)]"
                            : "border border-white/14 bg-white/8 text-white/70 hover:bg-white/12"
                      }`}
                    >
                      {course.status === "可查看"
                        ? "查看课程"
                        : course.status === "需升级"
                          ? "升级后查看"
                          : "敬请期待"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-white/46">Membership Upgrade</p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                想继续看高级课程，可以在这里承接会员升级动作。
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-white/68">
                当前目录页先重点解决浏览和分层展示，下一步再把升级按钮接到你的会员方案与支付流程里。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/#plans"
                className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-accent-strong)]"
              >
                查看会员方案
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/16 bg-white/10 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-white/16"
              >
                返回个人中心
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
