import LRU from 'lru-cache'

export const cache = new LRU({
  max: 500,
  maxAge: 60 * 60 * 1e3,
})

import { NextPageContext, GetServerSideProps } from 'next'
export const withCache = (
  getServerSideProps: GetServerSideProps,
): GetServerSideProps => async (ctx) => {
  const k = ctx.req.url
  if (cache.has(k)) {
    return cache.get(k)
  }
  const result = await getServerSideProps(ctx)
  cache.set(k, result)
  return result as any
}
