import Link from "next/link";
import { notFound } from "next/navigation";

import { NebulaBackground } from "@/components/nebula-background";
import {
  coverToneClasses,
  getCourseBySlug,
  getLessonBySlug,
  getLessonsByCourseSlug,
  levelClasses,
} from "@/lib/site";

type LessonPageProps = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

function formatLessonTitleForSidebar(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

export default async function LessonDetailPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const course = getCourseBySlug(slug);
  const lesson = getLessonBySlug(slug, lessonSlug);

  if (!course || !lesson) {
    notFound();
  }

  const lessons = getLessonsByCourseSlug(slug);
  const lessonIndex = lessons.findIndex((item) => item.slug === lesson.slug);
  const previousLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const courseOutline = course.blocks.find((block) => block.type === "chapter_group");

  return (
    <div className="relative isolate overflow-hidden bg-black">
      <NebulaBackground />
      <div className="relative mx-auto min-h-[calc(100svh-88px)] w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_20rem] lg:items-start">
          <div className="space-y-6">
            {lesson.blocks.map((block, index) => {
              if (block.type === "lesson_hero") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    className={`relative overflow-hidden rounded-[2rem] border border-white/12 bg-gradient-to-br ${coverToneClasses[course.coverTone]} px-7 py-7 shadow-[0_24px_72px_rgba(8,10,20,0.24)] md:px-8 md:py-8`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_36%)]" />
                    <div className="relative space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/16 bg-black/12 px-4 py-2 text-xs font-medium tracking-[0.24em] uppercase text-white/78">
                          {block.eyebrow}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${levelClasses[lesson.accessLevel]}`}
                        >
                          {lesson.accessLevel}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <h1 className="max-w-3xl text-3xl leading-[1.04] font-semibold tracking-[-0.05em] text-white md:text-[3.6rem]">
                          {block.title}
                        </h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/82 md:text-base">
                          {block.subtitle}
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="rounded-full bg-white px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white/88"
                        >
                          返回课程总览
                        </Link>
                        <a
                          href="#lesson-content"
                          className="rounded-full border border-white/16 bg-white/10 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-white/16"
                        >
                          开始阅读
                        </a>
                      </div>
                    </div>
                  </section>
                );
              }

              if (block.type === "lesson_rich_text") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id="lesson-content"
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <p className="text-sm uppercase tracking-[0.22em] text-white/48">章节正文</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {block.title}
                    </h2>
                    <div className="mt-5 space-y-4">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="max-w-4xl text-sm leading-8 text-white/76">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                );
              }

              if (block.type === "lesson_steps") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <p className="text-sm uppercase tracking-[0.22em] text-white/48">操作步骤</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {block.title}
                    </h2>
                    <div className="mt-6 grid gap-4">
                      {block.items.map((item, itemIndex) => (
                        <article
                          key={item.title}
                          className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.09)] p-5 md:grid-cols-[3.2rem_minmax(0,1fr)] md:items-start"
                        >
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-semibold text-[var(--color-ink)]">
                            {itemIndex + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
                              {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              }

              if (block.type === "lesson_callout") {
                const toneClass =
                  block.tone === "accent"
                    ? "border-[rgba(229,173,88,0.28)] bg-[rgba(229,173,88,0.1)]"
                    : "border-[rgba(255,170,147,0.28)] bg-[rgba(255,170,147,0.12)]";

                return (
                  <section
                    key={`${block.type}-${index}`}
                    className={`rounded-[1.8rem] border p-6 backdrop-blur-md ${toneClass}`}
                  >
                    <p className="text-sm uppercase tracking-[0.22em] text-white/52">重点提醒</p>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {block.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/76">
                      {block.description}
                    </p>
                  </section>
                );
              }

              return (
                <section
                  key={`${block.type}-${index}`}
                  className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                >
                  <p className="text-sm uppercase tracking-[0.22em] text-white/48">检查清单</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {block.title}
                  </h2>
                  <div className="mt-6 grid gap-3">
                    {block.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/78"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            <section className="grid gap-3 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md sm:grid-cols-2">
              {previousLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${previousLesson.slug}`}
                  className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-5 transition hover:bg-[rgba(255,255,255,0.12)]"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-white/44">上一节</p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                    {previousLesson.title}
                  </p>
                </Link>
              ) : (
                <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 text-sm text-white/46">
                  当前已经是第一节
                </div>
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-5 text-right transition hover:bg-[rgba(255,255,255,0.12)]"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-white/44">下一节</p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                    {nextLesson.title}
                  </p>
                </Link>
              ) : (
                <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 text-right text-sm text-white/46">
                  当前已经是最后一节
                </div>
              )}
            </section>
          </div>

          <aside className="self-start space-y-5 lg:sticky lg:top-12">
            <section className="rounded-[2rem] border border-white/12 bg-[rgba(248,245,236,0.92)] p-6 shadow-[0_22px_70px_rgba(8,10,20,0.24)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">章节信息</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                {lesson.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{lesson.summary}</p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-[1.2rem] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    所属课程
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{course.title}</p>
                </div>
                <div className="rounded-[1.2rem] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    权限等级
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                    {lesson.accessLevel}
                  </p>
                </div>
                <div className="rounded-[1.2rem] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    最近更新
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{lesson.updatedAt}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/courses/${course.slug}`}
                  className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-accent-strong)]"
                >
                  返回课程总览
                </Link>
                <Link
                  href="/courses"
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-black/[0.03]"
                >
                  返回课程中心
                </Link>
              </div>
            </section>

            {courseOutline ? (
              <section className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.22em] text-white/48">课程模块大纲</p>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  先看清这门课的整体结构，再决定当前这一节在整套课程里的位置。
                </p>
                <div className="mt-5 space-y-4">
                  {courseOutline.groups.map((group, groupIndex) => {
                    const containsCurrentLesson = group.lessons.some(
                      (item) => item.href === `/courses/${course.slug}/lessons/${lesson.slug}`,
                    );

                    return (
                      <div
                        key={group.title}
                        className={`rounded-[1.35rem] border px-4 py-4 ${
                          containsCurrentLesson
                            ? "border-[rgba(229,173,88,0.28)] bg-[rgba(229,173,88,0.12)]"
                            : "border-white/10 bg-[rgba(255,255,255,0.05)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">
                              模块 {groupIndex + 1}
                            </p>
                            <h3 className="mt-2 text-base font-semibold tracking-[-0.03em] text-white">
                              {group.title}
                            </h3>
                          </div>
                          {containsCurrentLesson ? (
                            <span className="rounded-full border border-[rgba(229,173,88,0.3)] bg-[rgba(229,173,88,0.12)] px-2.5 py-1 text-[11px] font-medium text-[rgba(255,228,191,0.94)]">
                              当前所在
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/62">{group.summary}</p>
                        <div className="mt-3 space-y-2">
                          {group.lessons.map((item) => {
                            const isCurrent =
                              item.href === `/courses/${course.slug}/lessons/${lesson.slug}`;

                            return (
                              <div
                                key={`${group.title}-${item.title}`}
                                className={`rounded-[1rem] px-3 py-2 text-sm leading-6 ${
                                  isCurrent
                                    ? "bg-white/12 text-white"
                                    : "bg-black/10 text-white/66"
                                }`}
                              >
                                {formatLessonTitleForSidebar(item.title)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.22em] text-white/48">章节顺序</p>
              <div className="mt-5 grid gap-2">
                {lessons.map((item, index) => (
                  <Link
                    key={item.slug}
                    href={`/courses/${course.slug}/lessons/${item.slug}`}
                    className={`grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 rounded-[1.15rem] border px-4 py-3 text-sm transition ${
                      item.slug === lesson.slug
                        ? "border-[rgba(229,173,88,0.28)] bg-[rgba(229,173,88,0.14)] text-white"
                        : "border-white/10 bg-[rgba(255,255,255,0.08)] text-white/76 hover:bg-[rgba(255,255,255,0.14)] hover:text-white"
                    }`}
                  >
                    <span className="pt-0.5 text-xs font-medium tabular-nums text-white/42">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-6">{formatLessonTitleForSidebar(item.title)}</span>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
