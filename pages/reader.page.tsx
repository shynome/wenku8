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

const Nav: React.FC<{ book: Book; cid: string }> = memo(({ book, cid }) => {
  const bid = book.bid
  const allChapters = book.chaptersVols.reduce((arr, vol) => {
    return arr.concat(vol.chapters)
  }, [] as Chapter[])
  const index = allChapters.map((chapter) => chapter.cid).indexOf(cid)
  const pChapter = allChapters[index - 1]
  const nChapter = allChapters[index + 1]
  let prevLink = pChapter ? `/reader?bid=${bid}&cid=${pChapter.cid}` : ``
  let nextLink = nChapter ? `/reader?bid=${bid}&cid=${nChapter.cid}` : ``
  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      <NextLink href={prevLink}>
        <Link
          color="inherit"
          href={prevLink}
          style={{ visibility: pChapter ? 'visible' : 'hidden' }}
        >
          <Tooltip title={`上一卷 - ${pChapter?.name || ''}`}>
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
          style={{ visibility: nChapter ? 'visible' : 'hidden' }}
        >
          <Tooltip title={`下一卷  - ${nChapter?.name || ''}`}>
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
