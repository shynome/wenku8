import { Book, Chapter } from '~graphql/codegen'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { queryBook } from './book.page'
import {
  Typography,
  Paper,
  LinearProgress,
  makeStyles,
  Button,
  Tooltip,
  IconButton,
  Link,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Head from 'next/head'
import NextLink from 'next/link'
import { Fragment, memo, useMemo } from 'react'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  reader: {
    whiteSpace: 'break-spaces',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    overflow: 'scroll',
  },
}))
const Reader: React.FC<{ content: string }> = ({ content }) => {
  const classes = useStyles()
  return <Paper className={classes.reader}>{content}</Paper>
}

const q = gql`
  query content($bid: String!, $cid: String!) {
    content: ChapterContent(bid: $bid, cid: $cid)
  }
`

const makeGetFirstCid = (indexes: [string, number][]) => (
  v: number,
): string => {
  for (let i = 0; i < indexes.length; i++) {
    let [cid, vorder] = indexes[i]
    if (vorder === v) {
      return cid
    }
  }
}

const Nav: React.FC<{ book: Book; cid: string }> = memo(({ book, cid }) => {
  const bid = book.bid
  const vols = book.chaptersVols
  const indexes = vols.reduce((arr, vol) => {
    return arr.concat(vol.chapters.map((c) => [c.cid, vol.order]))
  }, [] as [string, number][])
  const cindex = indexes.map(([cid]) => cid).indexOf(cid)
  const index = indexes[cindex][1]
  const getFirstCid = makeGetFirstCid(indexes)

  const pVol = vols[index - 1]
  const nVol = vols[index + 1]
  let prevLink = pVol ? `/reader?bid=${bid}&cid=${getFirstCid(index - 1)}` : ``
  let nextLink = nVol ? `/reader?bid=${bid}&cid=${getFirstCid(index + 1)}` : ``
  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      <NextLink href={prevLink}>
        <Link
          color="inherit"
          href={prevLink}
          style={{ visibility: pVol ? 'visible' : 'hidden' }}
        >
          <Tooltip title={`上一卷 - ${pVol?.name || ''}`}>
            <IconButton color="inherit">
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </NextLink>
      <NextLink href={nextLink}>
        <Link
          color="inherit"
          href={nextLink}
          style={{ visibility: nVol ? 'visible' : 'hidden' }}
        >
          <Tooltip title={`下一卷  - ${nVol?.name || ''}`}>
            <IconButton color="inherit">
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </NextLink>
    </div>
  )
})

import { Topbar } from '~pages/components/Topbar'
export default function Page() {
  const router = useRouter()
  const bid = router.query['bid'] as string
  const cid = router.query['cid'] as string
  const cq = useQuery<{ content: string }>(q, { variables: { bid, cid } })
  const bq = useQuery<{ book: Book }>(queryBook, { variables: { bid } })
  const title = useMemo(() => {
    if (bq.loading || bq.error) {
      return ''
    }
    const allChapters = bq.data.book.chaptersVols.reduce((arr, vol) => {
      return arr.concat(vol.chapters)
    }, [] as Chapter[])
    const chapter = allChapters.filter((chapter) => chapter.cid === cid)[0]
    return `${chapter.name} - ${bq.data.book.name}`
  }, [bq, cid])
  if (cq.loading || bq.loading) {
    return <LinearProgress />
  }
  let err = cq.error || bq.error
  if (err) {
    return <div>{err.message}</div>
  }
  return (
    <div>
      <Topbar
        title={
          <NextLink href={`/book?bid=${bid}`}>
            <Link color="inherit" href={`/book?bid=${bid}`}>
              {title}
            </Link>
          </NextLink>
        }
      >
        <Nav book={bq.data.book} cid={cid} />
      </Topbar>
      <Head>
        <title>{title}</title>
      </Head>
      <Reader content={cq.data.content} />
    </div>
  )
}
