PYTHON := ./.venv/bin/python
PIP := ./.venv/bin/pip
MANAGE := $(PYTHON) backend/manage.py
NPM := npm --prefix frontend
FRONTEND_LOCK := frontend/.next/dev/lock
BACKEND_HEALTH_URL := http://127.0.0.1:8000/api/v1/health/
DOCKER_COMPOSE := docker compose

.PHONY: help setup env backend-env frontend-env install backend-install frontend-install \
	dev migrate makemigrations superuser backend-dev frontend-dev frontend-stop \
	lint build check shell api-health clean-pyc db-up db-down db-restart \
	db-logs db-ps db-shell

help:
	@echo "常用命令："
	@echo "  make setup         # 创建本地环境文件并安装前后端依赖"
	@echo "  make dev           # 同时启动 Django 和 Next.js 开发服务"
	@echo "  make backend-dev   # 启动 Django 开发服务并支持热重载"
	@echo "  make frontend-dev  # 启动 Next.js 开发服务并支持热重载"
	@echo "  make frontend-stop # 停止当前前端开发服务"
	@echo "  make migrate       # 执行 Django 数据库迁移"
	@echo "  make makemigrations # 生成 Django 迁移文件"
	@echo "  make superuser     # 创建 Django 后台管理员"
	@echo "  make lint          # 执行前端 eslint 检查"
	@echo "  make build         # 使用 webpack 构建前端"
	@echo "  make check         # 执行 Django 系统检查"
	@echo "  make api-health    # 快速检查 API 健康状态"
	@echo "  make db-up         # 启动 Buyu 专属 PostgreSQL 容器"
	@echo "  make db-down       # 停止 Buyu PostgreSQL 容器"
	@echo "  make db-restart    # 重启 Buyu PostgreSQL 容器"
	@echo "  make db-logs       # 查看 Buyu PostgreSQL 日志"
	@echo "  make db-ps         # 查看 Buyu PostgreSQL 容器状态"
	@echo "  make db-shell      # 进入 Buyu PostgreSQL 命令行"

setup: env install

env: backend-env frontend-env

backend-env:
	@test -f backend/.env || cp backend/.env.example backend/.env

frontend-env:
	@test -f frontend/.env.local || cp frontend/.env.local.example frontend/.env.local

install: backend-install frontend-install

backend-install:
	$(PIP) install -r backend/requirements.txt

frontend-install:
	$(NPM) install

dev:
	@frontend_pid=""; \
	frontend_url=""; \
	frontend_running=0; \
	if [ -f "$(FRONTEND_LOCK)" ]; then \
		frontend_pid=$$(sed -n 's/.*\"pid\":\([0-9]*\).*/\1/p' "$(FRONTEND_LOCK)"); \
		frontend_url=$$(sed -n 's/.*\"appUrl\":\"\([^\"]*\)\".*/\1/p' "$(FRONTEND_LOCK)"); \
	fi; \
	if [ -n "$$frontend_pid" ] && ps -p "$$frontend_pid" >/dev/null 2>&1; then \
		frontend_running=1; \
	elif [ -f "$(FRONTEND_LOCK)" ]; then \
		echo "检测到失效的前端锁文件，正在清理。"; \
		rm -f "$(FRONTEND_LOCK)"; \
	fi; \
	if curl -sf $(BACKEND_HEALTH_URL) >/dev/null 2>&1 && [ "$$frontend_running" -eq 1 ]; then \
		echo "前后端开发服务都已经在运行。"; \
		echo "前端地址：$$frontend_url"; \
		echo "后端地址：$(BACKEND_HEALTH_URL)"; \
		echo "当前直接修改代码即可触发热更新。"; \
	elif curl -sf $(BACKEND_HEALTH_URL) >/dev/null 2>&1; then \
		echo "后端开发服务已经在运行，只启动前端服务。"; \
		$(NPM) run dev; \
	elif [ "$$frontend_running" -eq 1 ]; then \
		echo "前端开发服务已经在运行，只启动后端服务。"; \
		$(MANAGE) runserver; \
	else \
		trap 'kill 0' INT TERM EXIT; \
		$(MANAGE) runserver & \
		$(NPM) run dev & \
		wait; \
	fi

migrate:
	$(MANAGE) migrate

makemigrations:
	$(MANAGE) makemigrations

superuser:
	$(MANAGE) createsuperuser

backend-dev:
	@if curl -sf $(BACKEND_HEALTH_URL) >/dev/null 2>&1; then \
		echo "后端开发服务已经在运行：$(BACKEND_HEALTH_URL)"; \
		echo "当前无需重复启动，直接修改代码即可触发热更新。"; \
	else \
		$(MANAGE) runserver; \
	fi

frontend-dev:
	@frontend_pid=""; \
	frontend_url=""; \
	if [ -f "$(FRONTEND_LOCK)" ]; then \
		frontend_pid=$$(sed -n 's/.*\"pid\":\([0-9]*\).*/\1/p' "$(FRONTEND_LOCK)"); \
		frontend_url=$$(sed -n 's/.*\"appUrl\":\"\([^\"]*\)\".*/\1/p' "$(FRONTEND_LOCK)"); \
	fi; \
	if [ -n "$$frontend_pid" ] && ps -p "$$frontend_pid" >/dev/null 2>&1; then \
		echo "前端开发服务已经在运行：$$frontend_url"; \
		echo "当前无需重复启动，直接修改代码即可触发热更新。"; \
	else \
		if [ -f "$(FRONTEND_LOCK)" ]; then \
			echo "检测到失效的前端锁文件，正在清理。"; \
			rm -f "$(FRONTEND_LOCK)"; \
		fi; \
		$(NPM) run dev; \
	fi

frontend-stop:
	@frontend_pid=""; \
	if [ -f "$(FRONTEND_LOCK)" ]; then \
		frontend_pid=$$(sed -n 's/.*\"pid\":\([0-9]*\).*/\1/p' "$(FRONTEND_LOCK)"); \
	fi; \
	if [ -n "$$frontend_pid" ] && ps -p "$$frontend_pid" >/dev/null 2>&1; then \
		kill $$frontend_pid; \
		rm -f "$(FRONTEND_LOCK)"; \
		echo "已停止前端开发服务，PID=$$frontend_pid"; \
	elif [ -f "$(FRONTEND_LOCK)" ]; then \
		rm -f "$(FRONTEND_LOCK)"; \
		echo "已清理失效的前端锁文件。"; \
	else \
		echo "当前没有检测到正在运行的前端开发服务。"; \
	fi

lint:
	$(NPM) run lint

build:
	cd frontend && npx next build --webpack

check:
	$(MANAGE) check

shell:
	$(MANAGE) shell

api-health:
	@curl -sf $(BACKEND_HEALTH_URL)

clean-pyc:
	find backend -name '__pycache__' -type d -prune -exec rm -rf {} +

db-up:
	$(DOCKER_COMPOSE) up -d postgres

db-down:
	$(DOCKER_COMPOSE) stop postgres

db-restart:
	$(DOCKER_COMPOSE) restart postgres

db-logs:
	$(DOCKER_COMPOSE) logs -f postgres

db-ps:
	$(DOCKER_COMPOSE) ps

db-shell:
	$(DOCKER_COMPOSE) exec postgres psql -U buyu_user -d buyu
