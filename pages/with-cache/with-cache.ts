import { GetServerSideProps, GetServerSidePropsContext } from 'next'
export type WithCache = (gssp: GetServerSideProps) => GetServerSideProps

export function normalizePageURL(url: string) {
  if (url.startsWith('/_next/data')) {
    // '/_next/data/ssss/book.json' -> '/book.json'
    url = url.replace(/^\/_next\/data\/\S+(\/\S+)\.json/, '$1')
  }
  return url
}
