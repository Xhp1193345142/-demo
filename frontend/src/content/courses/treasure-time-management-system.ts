import type { CourseDetail, CourseLesson } from "@/lib/site";

export const treasureTimeManagementCourse: CourseDetail = {
  id: "course-demo-productivity-system",
  title: "示例效率系统课",
  slug: "demo-productivity-system",
  summary: "这是一个用于演示课程中心、详情页和章节页结构的示例课程，不包含真实课程内容。",
  updatedAt: "2026-04-22",
  level: "普通会员",
  status: "可查看",
  category: "演示课程",
  lessonCount: 3,
  coverTitle: "示例课程",
  coverTone: "emerald",
  audience: "适合用来演示课程站点结构、会员可见性和章节导航逻辑。",
  blocks: [
    {
      type: "course_hero",
      eyebrow: "Course Detail 课程详情",
      title: "用一门示例课程，把课程站的页面结构先搭稳。",
      subtitle:
        "这一页的重点不是展示真实课程内容，而是演示课程详情、章节目录和章节页之间的关系。",
      tags: ["Demo", "课程结构", "示例内容", "可替换"],
      stats: [
        { label: "最近更新", value: "2026 年 4 月 22 日" },
        { label: "适合场景", value: "课程站骨架演示" },
        { label: "课程节数", value: "3 节示例内容" },
      ],
    },
    {
      type: "value_grid",
      title: "为什么先放一门示例课更合理",
      description: "先把路由、排版、权限和导航跑通，再逐步替换成真实课程，会更安全也更容易维护。",
      items: [
        {
          title: "先验证结构",
          description: "先检查课程中心、课程详情页和章节页是否形成稳定闭环，而不是一开始就堆真实内容。",
        },
        {
          title: "方便替换",
          description: "当前的数据层已经独立成内容文件，后面替换成正式课程时不需要重写页面模板。",
        },
        {
          title: "便于演示",
          description: "没有敏感内容的情况下，也可以完整演示站点交互、导航和会员分层效果。",
        },
        {
          title: "降低风险",
          description: "即使仓库公开或需要协作，也不会把还未准备好的课程内容直接暴露出去。",
        },
      ],
    },
    {
      type: "learning_outcomes",
      title: "这门示例课会展示哪些能力",
      items: [
        "课程详情页的模块化排版能力。",
        "章节目录和章节详情页的联动关系。",
        "会员等级、课程状态和内容入口的展示方式。",
        "后续把示例内容替换成真实内容时的数据接入方式。",
      ],
    },
    {
      type: "chapter_group",
      title: "示例章节目录",
      description: "这里保留一套最小可用的章节结构，用来演示单章节阅读体验。",
      groups: [
        {
          title: "模块一：理解结构",
          summary: "先理解课程详情页、章节目录和阅读页分别承担什么职责。",
          lessons: [
            {
              title: "1. 为什么课程页不要一开始就堆满真实内容",
              href: "/courses/demo-productivity-system/lessons/why-start-with-a-demo-course",
            },
            {
              title: "2. 如何把课程拆成总览页和章节页",
              href: "/courses/demo-productivity-system/lessons/how-to-split-course-and-lessons",
            },
          ],
        },
        {
          title: "模块二：进入替换阶段",
          summary: "当结构稳定后，再逐步替换成正式课程素材。",
          lessons: [
            {
              title: "3. 什么时候适合接入真实课程内容",
              href: "/courses/demo-productivity-system/lessons/when-to-replace-with-real-content",
            },
          ],
        },
      ],
    },
    {
      type: "rich_text",
      title: "课程导读",
      paragraphs: [
        "这门课是一个演示课程，它的目标不是教学，而是帮助你验证课程站点的结构是否合理。",
        "当你确认课程中心、详情页、章节目录、章节正文和导航交互都足够稳定后，再把这里替换成真实课程内容会更合适。",
      ],
    },
    {
      type: "callout",
      tone: "accent",
      title: "当前内容仅用于结构展示",
      description:
        "你现在看到的是公开仓库可保留的示例内容。后续如果要接入真实课程，可以继续沿用同一套数据结构和页面模板。",
    },
    {
      type: "steps",
      title: "推荐的替换顺序",
      items: [
        {
          title: "先保留示例课验证页面结构",
          description: "确认课程列表、详情页和章节页的样式与交互都达标。",
        },
        {
          title: "再替换课程概览文案",
          description: "先从课程标题、摘要、目录和封面层开始替换。",
        },
        {
          title: "最后补充章节正文",
          description: "当站点结构稳定后，再逐节补真实内容，风险更低。",
        },
      ],
    },
    {
      type: "tool_stack",
      title: "这一版示例课主要验证的模块",
      description: "这里不是工具清单，而是课程站当前已经打通的页面能力。",
      tools: [
        { name: "课程中心", role: "负责展示课程卡片、更新时间、等级和入口。" },
        { name: "课程详情页", role: "负责承接课程价值、目录、学习路径和相关推荐。" },
        { name: "章节详情页", role: "负责演示单章节阅读体验和课程内跳转。" },
        { name: "左侧页面导航", role: "负责演示长页面阅读时的模块级导航交互。" },
      ],
    },
    {
      type: "lesson_preview",
      title: "你可以先点开这两节示例内容",
      description: "它们用来展示章节页模板和阅读路径，不包含真实课程知识。",
      lessons: [
        {
          title: "1. 为什么课程页不要一开始就堆满真实内容",
          href: "/courses/demo-productivity-system/lessons/why-start-with-a-demo-course",
          summary: "这一节用来说明为什么先做骨架、后填内容，会更稳。",
          highlights: [
            "先有稳定的页面模板",
            "先验证导航和排版逻辑",
            "最后再替换成真实课程",
          ],
        },
        {
          title: "2. 如何把课程拆成总览页和章节页",
          href: "/courses/demo-productivity-system/lessons/how-to-split-course-and-lessons",
          summary: "这一节演示课程总览页和章节页各自负责什么。",
          highlights: [
            "总览页负责价值和目录",
            "章节页负责正文和上下节",
            "目录和页面导航负责辅助阅读",
          ],
        },
      ],
    },
    {
      type: "checklist",
      title: "这门示例课当前用于验证的项目",
      items: [
        "课程详情页内容块是否足够通用。",
        "章节目录是否能稳定跳转到章节页。",
        "章节页导航、信息侧栏和上下节切换是否合理。",
        "后续替换真实内容时是否能只换数据、不改模板。",
      ],
    },
  ],
};

export const treasureTimeManagementLessons: CourseLesson[] = [
  {
    courseSlug: "demo-productivity-system",
    slug: "why-start-with-a-demo-course",
    title: "1. 为什么课程页不要一开始就堆满真实内容",
    summary: "先用示例内容把页面结构跑通，再逐步替换成正式课程，是更稳妥的做法。",
    accessLevel: "普通会员",
    updatedAt: "2026-04-22",
    blocks: [
      {
        type: "lesson_hero",
        eyebrow: "Lesson 01 示例章节",
        title: "先验证结构，再填真实内容。",
        subtitle: "这节示例内容用于说明为什么课程站开发不适合一开始就直接堆入真实课程资料。",
      },
      {
        type: "lesson_rich_text",
        title: "为什么先做示例版更稳",
        paragraphs: [
          "当页面结构、导航逻辑、权限显示和章节跳转都还在打磨时，直接放入真实课程内容很容易造成反复调整。",
          "先用一门示例课把骨架跑通，能让你在不暴露真实资料的情况下完成大部分前端交互和数据结构验证。",
        ],
      },
      {
        type: "lesson_steps",
        title: "这一阶段更适合关注的三件事",
        items: [
          {
            title: "先确认课程页模板",
            description: "包括 hero、目录、学习路径、章节入口和阅读导航是否足够通用。",
          },
          {
            title: "先确认章节页模板",
            description: "包括正文排版、侧栏信息、页面导航和上下节切换是否稳定。",
          },
          {
            title: "最后再接真实内容",
            description: "当结构不再频繁变化时，再替换正式课程会轻松很多。",
          },
        ],
      },
      {
        type: "lesson_checklist",
        title: "这一节结束后你应该确认",
        items: [
          "我理解了为什么示例内容更适合开发阶段。",
          "我知道真实课程应该在结构稳定后再接入。",
          "我明白数据层和模板层分离的重要性。",
        ],
      },
    ],
  },
  {
    courseSlug: "demo-productivity-system",
    slug: "how-to-split-course-and-lessons",
    title: "2. 如何把课程拆成总览页和章节页",
    summary: "课程总览页和章节页承担不同职责，拆开之后更利于长期维护。",
    accessLevel: "普通会员",
    updatedAt: "2026-04-22",
    blocks: [
      {
        type: "lesson_hero",
        eyebrow: "Lesson 02 示例章节",
        title: "总览页负责总览，章节页负责正文。",
        subtitle: "这节示例内容用来说明课程站更合理的信息结构拆分方式。",
      },
      {
        type: "lesson_rich_text",
        title: "课程页和章节页分别负责什么",
        paragraphs: [
          "课程总览页更适合放课程介绍、价值说明、章节目录、学习顺序和进入章节的入口。",
          "章节页则更适合承接单节正文、步骤说明、重点提醒以及上下节切换。",
        ],
      },
      {
        type: "lesson_callout",
        tone: "accent",
        title: "不要把整门课全堆在一个超长页面里",
        description: "拆成总览页和章节页之后，不仅阅读更舒服，后续更新和权限控制也会更清晰。",
      },
      {
        type: "lesson_checklist",
        title: "这一节结束后你应该确认",
        items: [
          "我知道课程总览页和章节页的职责边界。",
          "我知道为什么章节页适合承接正文。",
          "我知道后续新增章节时应该如何继续沿用模板。",
        ],
      },
    ],
  },
  {
    courseSlug: "demo-productivity-system",
    slug: "when-to-replace-with-real-content",
    title: "3. 什么时候适合接入真实课程内容",
    summary: "当页面结构稳定、导航逻辑顺畅后，就可以逐步替换成正式课程。",
    accessLevel: "普通会员",
    updatedAt: "2026-04-22",
    blocks: [
      {
        type: "lesson_hero",
        eyebrow: "Lesson 03 示例章节",
        title: "先把壳子打磨好，再正式上线内容。",
        subtitle: "这一节用于说明从示例数据切换到正式课程数据的合理时机。",
      },
      {
        type: "lesson_steps",
        title: "适合切换真实内容的判断标准",
        items: [
          {
            title: "页面模板已经稳定",
            description: "课程中心、详情页和章节页的布局不再频繁大改。",
          },
          {
            title: "导航和阅读体验已经顺滑",
            description: "包括页面导航、章节目录和上下节切换都已经达到可用状态。",
          },
          {
            title: "内容数据层已经独立",
            description: "只需要换内容文件或接数据库，不需要重写页面组件。",
          },
        ],
      },
      {
        type: "lesson_callout",
        tone: "warning",
        title: "内容替换前，先确认仓库可见范围",
        description: "如果仓库是公开的，建议继续只保留示例内容，把真实课程放到私有仓库或后台内容源里。",
      },
      {
        type: "lesson_checklist",
        title: "这一节结束后你应该确认",
        items: [
          "我知道什么时候适合替换成正式课程。",
          "我知道正式内容不应该直接长期放在公开仓库里。",
          "我知道当前这份示例数据的价值是保护真实内容并验证结构。",
        ],
      },
    ],
  },
];
