import * as config from './config'
import { withLRUCache } from './with-lru-cache'
import { withRedisCache } from './with-redis-cache'

export const withCache = config.REDIS_LINK ? withRedisCache : withLRUCache
