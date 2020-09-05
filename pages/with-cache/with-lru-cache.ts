import LRU from 'lru-cache'
import { WithCache, normalizePageURL } from './with-cache'

export const cache = new LRU({
  max: 500,
  maxAge: 60 * 60 * 1e3,
})

export const withLRUCache: WithCache = (gssp) => async (ctx) => {
  const k = normalizePageURL(ctx.req.url)
  if (cache.has(k)) {
    return cache.get(k)
  }
  const result = await gssp(ctx)
  cache.set(k, result)
  return result as any
}

export default withLRUCache
