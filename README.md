# Buyu

`Buyu` 是一个前后端分离的个人网站脚手架：

- `frontend/`：基于 Next.js 的前台展示站点与会员端体验
- `backend/`：基于 Django + Django REST framework 的 API、后台和内容模型

## 项目定位

当前项目目标是先把站点底层框架收敛到最小可用状态，优先完成用户注册、登录和个人主页展示，再逐步增加课程与付费能力。

## 技术栈

- 前端：Next.js 16、App Router、TypeScript、Tailwind CSS v4
- 后端：Django 5、Django REST framework、Django Admin
- 本地数据库：SQLite 或 Docker 中的 PostgreSQL
- 生产数据库规划：PostgreSQL

## 项目架构摘要

项目采用前后端分离结构：

- `frontend/`
  - 负责首页、登录页、价格页、文章页、会员端页面
  - 当前使用 Next.js App Router 构建页面结构
- `backend/`
  - 当前只负责用户数据、后台管理和基础健康检查
  - 通过 Django Admin 支撑用户管理
  - 通过 DRF 提供基础接口

当前开发原则：

- 前端负责展示和交互
- 登录与会话规则以后端为准
- 用户注册数据统一存放在 `accounts_user`

## 当前模块划分

### 前端模块

- `frontend/src/app/`
  - 页面与路由
- `frontend/src/components/`
  - 公共 UI 组件
- `frontend/src/lib/`
  - 站点静态配置与前端辅助逻辑

### 后端模块

- `backend/accounts/`
  - 注册用户与基础资料
- `backend/core_api/`
  - 健康检查接口

## 当前核心数据模型

当前只保留一张核心业务表：

- `accounts_user`：注册用户、显示名称、手机号、个人简介等基础资料

## 当前接口入口

- Django API 健康检查：`/api/v1/health/`
- Django 后台：`/admin/`

## 本地开发

### 快速开始

```bash
cd /Users/haopu_xi/project/Buyu
make setup
make db-up
make migrate
make dev
```

如果你希望使用项目专属 PostgreSQL：

- 容器名：`buyu-postgres`
- 本机端口：`127.0.0.1:5433`
- 数据库名：`buyu`
- 用户名：`buyu_user`

这样可以直接用 Chat2DB 等客户端连接，不会和其他项目的数据库冲突。

### 后端

```bash
cd /Users/haopu_xi/project/Buyu
make backend-dev
```

Django API 默认地址：

- `http://127.0.0.1:8000/api/v1/health/`

### 前端

```bash
cd /Users/haopu_xi/project/Buyu
make frontend-dev
```

Next.js 前端默认地址：

- `http://127.0.0.1:3000`

### 常用 Make 命令

```bash
make help
make db-up
make db-down
make dev
make db-shell
make makemigrations
make migrate
make superuser
make lint
make build
make check
make api-health
```

## 项目文档

- 开发规范：`docs/development-standards.md`
- 测试规范：`docs/testing-standards.md`
- 协作说明：`agent.md`

## README 维护规则

当以下内容发生变化时，应同步更新本文件：

- 前后端架构变化
- 模块职责变化
- 鉴权方式变化
- 支付方案变化
- 核心数据模型变化
- 启动方式或常用命令变化

建议保持：

- README 只写项目总览与架构摘要
- 具体规范放到 `docs/` 和 `agent.md`
- 每次做完核心功能后检查 README 是否仍然反映当前真实项目结构

## 当前建议开发顺序

1. 把登录页接到 Django 鉴权流程上。
2. 完成注册接口和基础用户资料页。
3. 再决定课程、章节与支付模型怎么加回项目。
