"""共享的 slowapi rate limiter 实例，供所有路由模块使用。"""

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
