"""
config 项目的 WSGI 配置。

该文件会暴露模块级变量 ``application``，供 WSGI 服务器加载。
更多说明可参考 Django 官方部署文档：
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
