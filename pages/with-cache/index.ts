import * as config from './config'
import { WithCache } from './with-cache'
import { withLRUCache } from './with-lru-cache'
import { withRedisCache } from './with-redis-cache'

export const withCache: WithCache = config.REDIS_LINK
  ? withRedisCache
  : withLRUCache
