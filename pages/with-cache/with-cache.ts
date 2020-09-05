import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import type { ParsedUrlQuery } from 'querystring'
export type WithCache = (
  path: string,
  params: string[],
) => (gssp: GetServerSideProps) => GetServerSideProps

type normalizeURL = (query: ParsedUrlQuery) => string

type Cgssp = (
  nurl: normalizeURL,
) => (gssp: GetServerSideProps) => GetServerSideProps

export const makeWithCache = (cgssp: Cgssp): WithCache => {
  return (path, params) => {
    const nurl = makeNormalizeURL(path, params)
    return cgssp(nurl)
  }
}

export const makeNormalizeURL = (
  path: string,
  params: string[],
): normalizeURL => (query) => {
  let u = new URL(path, 'http://cache')
  for (let field of params) {
    let val = query[field]
    if (Array.isArray(val)) {
      for (let v of val) {
        u.searchParams.append(field, v)
      }
      continue
    }
    u.searchParams.set(field, val)
  }
  return u.toString()
}
