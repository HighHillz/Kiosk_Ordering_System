"""Redis cache wrapper utilities."""
import redis
import json
from typing import Optional, Any
from app.config import settings


class RedisCache:
    """Redis cache client wrapper."""
    
    def __init__(self):
        """Initialize Redis connection."""
        self.client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
            decode_responses=True
        )
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from cache.
        
        Args:
            key: Cache key
            
        Returns:
            Optional[Any]: Cached value or None
        """
        value = self.client.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None
    
    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """
        Set a value in cache.
        
        Args:
            key: Cache key
            value: Value to cache
            expire: Expiration time in seconds (default 1 hour)
            
        Returns:
            bool: True if successful
        """
        if not isinstance(value, str):
            value = json.dumps(value)
        return self.client.setex(key, expire, value)
    
    def delete(self, key: str) -> bool:
        """
        Delete a key from cache.
        
        Args:
            key: Cache key to delete
            
        Returns:
            bool: True if successful
        """
        return bool(self.client.delete(key))
    
    def clear_pattern(self, pattern: str) -> int:
        """
        Clear all keys matching a pattern.
        
        Args:
            pattern: Redis key pattern (e.g., "menu:*")
            
        Returns:
            int: Number of keys deleted
        """
        keys = self.client.keys(pattern)
        if keys:
            return self.client.delete(*keys)
        return 0

    def lpush(self, key: str, value: Any) -> int:
        """
        Push a value to the head of a list (queue).
        
        Args:
            key: Queue key
            value: Value to push
            
        Returns:
            int: Length of the list after push
        """
        if not isinstance(value, str):
            value = json.dumps(value)
        return self.client.lpush(key, value)

    def brpop(self, key: str, timeout: int = 0) -> Optional[tuple]:
        """
        Pop a value from the tail of a list (blocking).
        
        Args:
            key: Queue key
            timeout: Timeout in seconds (0 for infinite)
            
        Returns:
            Optional[tuple]: (key, value) or None
        """
        result = self.client.brpop(key, timeout)
        if result:
            key, value = result
            try:
                return (key, json.loads(value))
            except json.JSONDecodeError:
                return (key, value)
        return None


# Global cache instance
cache = RedisCache()
