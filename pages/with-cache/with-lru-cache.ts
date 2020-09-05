import LRU from 'lru-cache'
import { WithCache, makeWithCache } from './with-cache'

export const cache = new LRU({
  max: 500,
  maxAge: 60 * 60 * 1e3,
})

export const withLRUCache: WithCache = makeWithCache(
  (nurl) => (gssp) => async (ctx) => {
    const k = nurl(ctx.query)
    if (cache.has(k)) {
      return cache.get(k)
    }
    const result = await gssp(ctx)
    cache.set(k, result)
    return result as any
  },
)

export default withLRUCache
