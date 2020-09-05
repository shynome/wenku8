import Redis from 'ioredis'
import { WithCache, makeWithCache } from './with-cache'
import * as config from './config'

export const cache = config.REDIS_LINK ? new Redis(config.REDIS_LINK) : null

function sleep(second: number) {
  return new Promise((rl) => setTimeout(rl, second * 1e3))
}

export const withRedisCache: WithCache = makeWithCache(
  (nurl) => (gssp) => async (ctx) => {
    const k = nurl(ctx.query)
    // lock key
    const lk = 'lock-' + k
    let lock = (await cache.get(lk)) !== null
    while (lock) {
      await sleep(0.5)
    }
    // cache result
    const cr = await cache.get(k)
    if (cr !== null) {
      return JSON.parse(cr)
    }
    await cache.set(lk, 'lock', 'EX', 30)
    try {
      const result = await gssp(ctx)
      cache.set(k, JSON.stringify(result))
      return result as any
    } finally {
      await cache.del(lk)
    }
  },
)
