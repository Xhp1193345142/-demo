#!/usr/bin/env python
"""Django 管理命令入口。"""
import os
import sys


def main():
    """执行 Django 管理任务。"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "无法导入 Django。请确认它已经安装，并且当前环境已正确激活虚拟环境。"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
