import {
  treasureTimeManagementCourse,
  treasureTimeManagementLessons,
} from "@/content/courses/treasure-time-management-system";

export const membershipTiers = [
  {
    name: "普通会员",
    tier: "basic",
    price: "¥39 / 月",
    summary: "适合先开始系统学习的用户，可查看基础课程与公开专栏完整版。",
  },
  {
    name: "高级会员",
    tier: "pro",
    price: "¥99 / 月",
    summary: "适合持续学习用户，可查看专题课、进阶文章与路线图型内容。",
  },
  {
    name: "超级会员",
    tier: "ultra",
    price: "¥199 / 月",
    summary: "适合深度用户，可查看全部会员文章、内部专题与长期沉淀内容。",
  },
] as const;

export const accessMatrix = [
  { section: "首页 / 价格页 / 品牌介绍", public: "可见", basic: "可见", pro: "可见", ultra: "可见" },
  { section: "公开文章", public: "可见", basic: "可见", pro: "可见", ultra: "可见" },
  { section: "普通会员文章", public: "摘要", basic: "全文", pro: "全文", ultra: "全文" },
  { section: "高级会员文章", public: "摘要", basic: "引导升级", pro: "全文", ultra: "全文" },
  { section: "超级会员文章", public: "摘要", basic: "引导升级", pro: "引导升级", ultra: "全文" },
] as const;

export const buildRoadmap = [
  "先导入飞书导出的 Markdown 内容，建立分类、slug 和访问等级。",
  "接入 Django Auth 或 JWT，打通登录页和个人中心。",
  "为会员方案接入支付回调，把订阅状态同步到用户会员等级。",
  "补充文章详情页、试看逻辑和会员内容拦截。",
] as const;

export const dashboardQuickActions = [
  {
    title: "进入课程中心",
    description: "登录后先进入课程中心浏览所有课程简介，再决定具体点开哪一篇课程内容。",
    href: "/courses",
    tone: "accent",
  },
  {
    title: "查看会员方案",
    description: "进入会员说明区域，检查不同等级的内容访问权限和后续支付路径。",
    href: "/#plans",
    tone: "subtle",
  },
] as const;

export const dashboardPreviewCourses = [
  {
    title: "从飞书迁移到独立站的内容整理方法",
    level: "公开内容",
    summary: "先梳理课程目录、封面、摘要和 slug 结构，后续迁移会顺很多。",
  },
  {
    title: "会员课程架构与权限拆分",
    level: "普通会员",
    summary: "定义哪些内容放在公开区，哪些内容需要 basic / pro / ultra 才能查看。",
  },
  {
    title: "长期更新型个人网站的内容运营节奏",
    level: "高级会员",
    summary: "把课程、专栏和更新日志统一进一个稳定的发布节奏里。",
  },
] as const;

export type CourseLevel = "公开" | "普通会员" | "高级会员" | "超级会员";
export type CourseStatus = "可查看" | "需升级" | "即将上线";
export type CourseTone = "amber" | "violet" | "indigo" | "emerald" | "rose" | "sky";
export type LessonAccess = CourseLevel;

export type CourseCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  updatedAt: string;
  level: CourseLevel;
  status: CourseStatus;
  category: string;
  lessonCount: number;
  coverTitle: string;
  coverTone: CourseTone;
};

export type CourseHeroBlock = {
  type: "course_hero";
  eyebrow: string;
  title: string;
  subtitle: string;
  tags: string[];
  stats: Array<{ label: string; value: string }>;
};

export type CourseValueGridBlock = {
  type: "value_grid";
  title: string;
  description: string;
  items: Array<{ title: string; description: string }>;
};

export type CourseOutcomesBlock = {
  type: "learning_outcomes";
  title: string;
  items: string[];
};

export type CourseChapterGroupBlock = {
  type: "chapter_group";
  title: string;
  description: string;
  groups: Array<{
    title: string;
    summary: string;
    lessons: Array<{
      title: string;
      href?: string;
    }>;
  }>;
};

export type CourseRichTextBlock = {
  type: "rich_text";
  title: string;
  paragraphs: string[];
};

export type CourseCalloutBlock = {
  type: "callout";
  tone: "accent" | "warning";
  title: string;
  description: string;
};

export type CourseStepsBlock = {
  type: "steps";
  title: string;
  items: Array<{ title: string; description: string }>;
};

export type CourseChecklistBlock = {
  type: "checklist";
  title: string;
  items: string[];
};

export type CourseToolStackBlock = {
  type: "tool_stack";
  title: string;
  description: string;
  tools: Array<{ name: string; role: string }>;
};

export type CourseLessonPreviewBlock = {
  type: "lesson_preview";
  title: string;
  description: string;
  lessons: Array<{
    title: string;
    href?: string;
    summary: string;
    highlights: string[];
  }>;
};

export type CourseDetailBlock =
  | CourseHeroBlock
  | CourseValueGridBlock
  | CourseOutcomesBlock
  | CourseChapterGroupBlock
  | CourseRichTextBlock
  | CourseCalloutBlock
  | CourseStepsBlock
  | CourseChecklistBlock
  | CourseToolStackBlock
  | CourseLessonPreviewBlock;

export type CourseDetail = CourseCard & {
  audience: string;
  blocks: CourseDetailBlock[];
};

export type LessonOverview = {
  slug: string;
  title: string;
  summary: string;
  accessLevel: LessonAccess;
  updatedAt: string;
};

export type LessonHeroBlock = {
  type: "lesson_hero";
  eyebrow: string;
  title: string;
  subtitle: string;
};

export type LessonRichTextBlock = {
  type: "lesson_rich_text";
  title: string;
  paragraphs: string[];
};

export type LessonChecklistBlock = {
  type: "lesson_checklist";
  title: string;
  items: string[];
};

export type LessonCalloutBlock = {
  type: "lesson_callout";
  tone: "accent" | "warning";
  title: string;
  description: string;
};

export type LessonStepsBlock = {
  type: "lesson_steps";
  title: string;
  items: Array<{ title: string; description: string }>;
};

export type LessonBlocks =
  | LessonHeroBlock
  | LessonRichTextBlock
  | LessonChecklistBlock
  | LessonCalloutBlock
  | LessonStepsBlock;

export type CourseLesson = LessonOverview & {
  courseSlug: string;
  blocks: LessonBlocks[];
};

export const coverToneClasses: Record<CourseTone, string> = {
  amber:
    "from-[rgba(244,167,86,0.92)] via-[rgba(227,129,73,0.7)] to-[rgba(33,20,16,0.24)]",
  violet:
    "from-[rgba(178,154,255,0.9)] via-[rgba(118,88,242,0.72)] to-[rgba(26,24,44,0.26)]",
  indigo:
    "from-[rgba(120,143,255,0.92)] via-[rgba(75,61,214,0.76)] to-[rgba(17,24,42,0.26)]",
  emerald:
    "from-[rgba(133,224,191,0.92)] via-[rgba(62,159,135,0.68)] to-[rgba(19,35,31,0.24)]",
  rose:
    "from-[rgba(255,161,180,0.94)] via-[rgba(211,89,120,0.72)] to-[rgba(40,18,28,0.24)]",
  sky:
    "from-[rgba(143,219,255,0.94)] via-[rgba(93,154,245,0.72)] to-[rgba(15,24,40,0.24)]",
};

export const levelClasses: Record<CourseLevel, string> = {
  公开: "bg-white/14 text-white/88",
  普通会员: "bg-[rgba(241,185,104,0.2)] text-[rgba(255,229,185,0.96)]",
  高级会员: "bg-[rgba(140,122,255,0.22)] text-[rgba(226,220,255,0.98)]",
  超级会员: "bg-[rgba(255,154,119,0.22)] text-[rgba(255,222,204,0.98)]",
};

export const statusClasses: Record<CourseStatus, string> = {
  可查看: "text-[rgba(219,244,215,0.94)]",
  需升级: "text-[rgba(255,224,191,0.94)]",
  即将上线: "text-white/64",
};

export const courseDirectory: CourseCard[] = [
  {
    id: treasureTimeManagementCourse.id,
    title: treasureTimeManagementCourse.title,
    slug: treasureTimeManagementCourse.slug,
    summary: treasureTimeManagementCourse.summary,
    updatedAt: treasureTimeManagementCourse.updatedAt,
    level: treasureTimeManagementCourse.level,
    status: treasureTimeManagementCourse.status,
    category: treasureTimeManagementCourse.category,
    lessonCount: treasureTimeManagementCourse.lessonCount,
    coverTitle: treasureTimeManagementCourse.coverTitle,
    coverTone: treasureTimeManagementCourse.coverTone,
  },
  {
    id: "course-feishu-migration",
    title: "从飞书迁移到独立站的内容整理方法",
    slug: "feishu-to-personal-site",
    summary: "从目录、封面、摘要到 slug 结构，先把课程素材整理清楚，后面迁移和发布会顺很多。",
    updatedAt: "2026-04-21",
    level: "公开",
    status: "可查看",
    category: "建站起步",
    lessonCount: 6,
    coverTitle: "内容迁移",
    coverTone: "amber",
  },
  {
    id: "course-membership-access",
    title: "会员课程架构与权限拆分",
    slug: "membership-access-architecture",
    summary: "明确公开内容、普通会员和高级会员之间的边界，避免后续课程权限越来越混乱。",
    updatedAt: "2026-04-20",
    level: "普通会员",
    status: "可查看",
    category: "会员体系",
    lessonCount: 9,
    coverTitle: "访问权限",
    coverTone: "violet",
  },
  {
    id: "course-content-rhythm",
    title: "长期更新型个人网站的内容运营节奏",
    slug: "content-operation-rhythm",
    summary: "把课程、专栏和更新日志统一进一个稳定的发布节奏里，减少临时维护成本。",
    updatedAt: "2026-04-18",
    level: "高级会员",
    status: "需升级",
    category: "内容运营",
    lessonCount: 8,
    coverTitle: "持续更新",
    coverTone: "indigo",
  },
  {
    id: "course-homepage-system",
    title: "个人网站首页的信息结构设计",
    slug: "homepage-information-architecture",
    summary: "首页不只是门面，还要承担定位、价值说明和会员转化的第一步。",
    updatedAt: "2026-04-15",
    level: "公开",
    status: "可查看",
    category: "页面设计",
    lessonCount: 5,
    coverTitle: "首页结构",
    coverTone: "emerald",
  },
  {
    id: "course-payment-subscription",
    title: "订阅支付接入与会员状态同步",
    slug: "payment-subscription-sync",
    summary: "从支付回调到会员到期时间同步，搭出一个真正可用的订阅闭环。",
    updatedAt: "2026-04-12",
    level: "超级会员",
    status: "需升级",
    category: "支付系统",
    lessonCount: 10,
    coverTitle: "支付闭环",
    coverTone: "rose",
  },
  {
    id: "course-course-detail-template",
    title: "课程详情页与章节模板搭建",
    slug: "course-detail-template",
    summary: "建立统一的课程详情模板，让章节目录、试看说明和正文结构保持一致。",
    updatedAt: "2026-04-10",
    level: "普通会员",
    status: "即将上线",
    category: "课程模板",
    lessonCount: 7,
    coverTitle: "详情模板",
    coverTone: "sky",
  },
];

export const courseLessons: CourseLesson[] = [...treasureTimeManagementLessons];

export const courseDetails: CourseDetail[] = [treasureTimeManagementCourse];

export function getCourseBySlug(slug: string) {
  return courseDetails.find((course) => course.slug === slug);
}

export function getLessonsByCourseSlug(courseSlug: string) {
  return courseLessons.filter((lesson) => lesson.courseSlug === courseSlug);
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  return courseLessons.find(
    (lesson) => lesson.courseSlug === courseSlug && lesson.slug === lessonSlug,
  );
}
