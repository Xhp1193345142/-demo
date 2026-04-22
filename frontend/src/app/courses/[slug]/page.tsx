import Link from "next/link";
import { notFound } from "next/navigation";

import { NebulaBackground } from "@/components/nebula-background";
import { CoursePageNavigation } from "@/components/course-page-navigation";
import {
  courseDirectory,
  coverToneClasses,
  getCourseBySlug,
  getLessonsByCourseSlug,
  levelClasses,
} from "@/lib/site";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function CalloutBlock({
  title,
  description,
  tone,
  sectionId,
}: {
  title: string;
  description: string;
  tone: "accent" | "warning";
  sectionId?: string;
}) {
  const toneClass =
    tone === "accent"
      ? "border-[rgba(229,173,88,0.28)] bg-[rgba(229,173,88,0.1)]"
      : "border-[rgba(255,170,147,0.28)] bg-[rgba(255,170,147,0.12)]";

  return (
    <section
      id={sectionId}
      className={`scroll-mt-28 rounded-[1.8rem] border p-6 backdrop-blur-md ${toneClass}`}
    >
      <p className="text-sm uppercase tracking-[0.22em] text-white/52">重点提醒</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/76">{description}</p>
    </section>
  );
}

function getBlockAnchor(blockType: string, index: number) {
  if (blockType === "chapter_group") {
    return "course-outline";
  }

  return `${blockType}-${index + 1}`;
}

function getBlockLabel(block: { type: string; title?: string }, index: number) {
  if ("title" in block && block.title) {
    return block.title;
  }

  return `内容模块 ${index + 1}`;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = courseDirectory
    .filter((item) => item.slug !== course.slug)
    .slice(0, 3);
  const lessons = getLessonsByCourseSlug(course.slug);
  const contentNavigation = course.blocks.map((block, index) => ({
    anchor: getBlockAnchor(block.type, index),
    label: getBlockLabel(block, index),
  }));

  return (
    <div className="relative isolate overflow-x-clip bg-black">
      <NebulaBackground />
      <div className="relative mx-auto min-h-[calc(100svh-88px)] w-full max-w-[1500px] px-6 py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)_20rem] lg:items-start">
          <aside className="self-start">
            <CoursePageNavigation items={contentNavigation} />
          </aside>

          <div className="space-y-6">
            {course.blocks.map((block, index) => {
              const sectionAnchor = getBlockAnchor(block.type, index);

              if (block.type === "course_hero") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className={`relative scroll-mt-28 overflow-hidden rounded-[2.2rem] border border-white/12 bg-gradient-to-br ${coverToneClasses[course.coverTone]} p-8 shadow-[0_28px_90px_rgba(8,10,20,0.28)]`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_36%)]" />
                    <div className="relative space-y-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/16 bg-black/12 px-4 py-2 text-xs font-medium tracking-[0.24em] uppercase text-white/78">
                          {block.eyebrow}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${levelClasses[course.level]}`}
                        >
                          {course.level}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h1 className="max-w-4xl text-4xl leading-[1.02] font-semibold tracking-[-0.05em] text-white md:text-6xl">
                          {block.title}
                        </h1>
                        <p className="max-w-3xl text-base leading-7 text-white/82 md:text-lg">
                          {block.subtitle}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {block.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/84"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {block.stats.map((stat) => (
                          <article
                            key={stat.label}
                            className="rounded-[1.4rem] border border-white/12 bg-[rgba(255,255,255,0.12)] px-5 py-4 backdrop-blur-md"
                          >
                            <p className="text-xs uppercase tracking-[0.22em] text-white/48">
                              {stat.label}
                            </p>
                            <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                              {stat.value}
                            </p>
                          </article>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                          href="#course-outline"
                          className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white/88"
                        >
                          开始学习
                        </a>
                        <a
                          href="#course-outline"
                          className="rounded-full border border-white/16 bg-white/10 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-white/16"
                        >
                          查看章节目录
                        </a>
                      </div>
                    </div>
                  </section>
                );
              }

              if (block.type === "value_grid") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <div className="max-w-3xl space-y-3">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/48">课程价值</p>
                      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                        {block.title}
                      </h2>
                      <p className="text-sm leading-7 text-white/74">{block.description}</p>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {block.items.map((item) => (
                        <article
                          key={item.title}
                          className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.09)] p-5"
                        >
                          <p className="text-xl font-semibold tracking-[-0.03em] text-white">
                            {item.title}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              }

              if (block.type === "learning_outcomes") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <p className="text-sm uppercase tracking-[0.22em] text-white/48">学习收获</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {block.title}
                    </h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {block.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-[1.4rem] border border-white/10 bg-black/10 px-5 py-4 text-sm leading-7 text-white/78"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (block.type === "chapter_group") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <div className="max-w-3xl space-y-3">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/48">章节目录</p>
                      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                        {block.title}
                      </h2>
                      <p className="text-sm leading-7 text-white/74">{block.description}</p>
                    </div>
                    <div className="mt-6 grid gap-4">
                      {block.groups.map((group) => (
                        <article
                          key={group.title}
                          className="rounded-[1.6rem] border border-white/10 bg-[rgba(255,255,255,0.09)] p-5"
                        >
                          <div className="space-y-2">
                            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                              {group.title}
                            </h3>
                            <p className="text-sm leading-7 text-white/70">{group.summary}</p>
                          </div>
                          <div className="mt-5 grid gap-3">
                            {group.lessons.map((lesson) => (
                              lesson.href ? (
                                <a
                                  key={lesson.title}
                                  href={lesson.href}
                                  className="rounded-[1.2rem] border border-[rgba(126,163,255,0.22)] bg-[rgba(62,84,144,0.12)] px-4 py-3 text-sm text-[rgba(164,194,255,0.98)] underline decoration-[rgba(164,194,255,0.55)] underline-offset-4 transition hover:bg-[rgba(62,84,144,0.2)] hover:text-white"
                                >
                                  {lesson.title}
                                </a>
                              ) : (
                                <div
                                  key={lesson.title}
                                  className="rounded-[1.2rem] border border-white/8 bg-black/10 px-4 py-3 text-sm text-white/80"
                                >
                                  {lesson.title}
                                </div>
                              )
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              }

              if (block.type === "rich_text") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <p className="text-sm uppercase tracking-[0.22em] text-white/48">课程导读</p>
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

              if (block.type === "callout") {
                return (
                  <CalloutBlock
                    key={`${block.type}-${index}`}
                    title={block.title}
                    description={block.description}
                    tone={block.tone}
                    sectionId={sectionAnchor}
                  />
                );
              }

              if (block.type === "steps") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <p className="text-sm uppercase tracking-[0.22em] text-white/48">学习路径</p>
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

              if (block.type === "tool_stack") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <div className="max-w-3xl space-y-3">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/48">工具栈</p>
                      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                        {block.title}
                      </h2>
                      <p className="text-sm leading-7 text-white/74">{block.description}</p>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {block.tools.map((tool) => (
                        <article
                          key={tool.name}
                          className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.09)] p-5"
                        >
                          <p className="text-xl font-semibold tracking-[-0.03em] text-white">
                            {tool.name}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/72">{tool.role}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              }

              if (block.type === "lesson_preview") {
                return (
                  <section
                    key={`${block.type}-${index}`}
                    id={sectionAnchor}
                    className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                  >
                    <div className="max-w-3xl space-y-3">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/48">章节正文 Demo</p>
                      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                        {block.title}
                      </h2>
                      <p className="text-sm leading-7 text-white/74">{block.description}</p>
                    </div>
                    <div className="mt-6 grid gap-4">
                      {block.lessons.map((lesson) => (
                        <article
                          key={lesson.title}
                          className="rounded-[1.6rem] border border-white/10 bg-[rgba(255,255,255,0.09)] p-5"
                        >
                          <div className="space-y-3">
                            {lesson.href ? (
                              <a
                                href={lesson.href}
                                className="text-2xl font-semibold tracking-[-0.03em] text-[rgba(164,194,255,0.98)] underline decoration-[rgba(164,194,255,0.55)] underline-offset-4 transition hover:text-white"
                              >
                                {lesson.title}
                              </a>
                            ) : (
                              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                                {lesson.title}
                              </h3>
                            )}
                            <p className="max-w-3xl text-sm leading-7 text-white/72">
                              {lesson.summary}
                            </p>
                          </div>
                          <div className="mt-5 grid gap-3 md:grid-cols-3">
                            {lesson.highlights.map((highlight) => (
                              <div
                                key={highlight}
                                className="rounded-[1.2rem] border border-white/8 bg-black/10 px-4 py-4 text-sm leading-7 text-white/78"
                              >
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              }

              return (
                <section
                  key={`${block.type}-${index}`}
                  id={sectionAnchor}
                  className="scroll-mt-28 rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-6 backdrop-blur-md"
                >
                  <p className="text-sm uppercase tracking-[0.22em] text-white/48">上线检查</p>
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
          </div>

          <aside className="self-start space-y-5 lg:sticky lg:top-28">
            <section className="rounded-[2rem] border border-white/12 bg-[rgba(248,245,236,0.92)] p-6 shadow-[0_22px_70px_rgba(8,10,20,0.24)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">课程信息</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                {course.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{course.summary}</p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-[1.2rem] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    会员等级
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{course.level}</p>
                </div>
                <div className="rounded-[1.2rem] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    最近更新
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{course.updatedAt}</p>
                </div>
                <div className="rounded-[1.2rem] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    适合人群
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{course.audience}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="#course-outline"
                  className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-accent-strong)]"
                >
                  从目录开始看
                </a>
                <Link
                  href="/courses"
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-black/[0.03]"
                >
                  返回课程中心
                </Link>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.22em] text-white/48">章节入口</p>
              <div className="mt-5 grid gap-3">
                {lessons.map((lesson, lessonIndex) => (
                  <Link
                    key={lesson.slug}
                    href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                    className="rounded-[1.35rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4 transition hover:bg-[rgba(255,255,255,0.12)]"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                      第 {lessonIndex + 1} 节
                    </p>
                    <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-white">
                      {lesson.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/66">{lesson.summary}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.22em] text-white/48">你还可以继续看</p>
              <div className="mt-5 grid gap-3">
                {relatedCourses.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/courses/${item.slug}`}
                    className="rounded-[1.35rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4 transition hover:bg-[rgba(255,255,255,0.12)]"
                  >
                    <p className="text-base font-semibold tracking-[-0.03em] text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/66">{item.summary}</p>
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
