import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  Link,
  makeStyles,
  Button,
  AppBar,
  Toolbar,
  LinearProgress,
} from '@material-ui/core'
import { Book } from '~graphql/codegen'
import NextLink from 'next/link'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}))

export const BookInfo: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <Grid container spacing={2}>
      {book.chaptersVols.map((vol) => {
        return (
          <Grid item key={vol.order} xs={12}>
            <Card>
              <CardHeader title={vol.name} />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {vol.chapters.map((chapter, i) => {
                    let link = `/reader?bid=${book.bid}&cid=${chapter.cid}`
                    return (
                      <Grid item key={chapter.cid}>
                        <NextLink href={link}>
                          <Link href={link}>
                            <Button variant="outlined">
                              {i}-{chapter.name}
                            </Button>
                          </Link>
                        </NextLink>
                      </Grid>
                    )
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

import Head from 'next/head'
type Props = { book: Book }
export default function Page({ book }: Props) {
  const classes = useStyles()
  return (
    <Paper>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>{book.name}</Typography>
        </Toolbar>
      </AppBar>
      <Head>
        <title>{book.name}</title>
      </Head>
      <div className={classes.paper}>
        <BookInfo book={book} />
      </div>
    </Paper>
  )
}

import { getChaptersVol, getLink } from './api/getChaptersVol'
import { NextPageContext } from 'next'
import { withCache } from './with-cache'
export const getServerSideProps = withCache(async (ctx: NextPageContext) => {
  const bid = ctx.query['bid'] as string
  const link = await getLink(bid)
  const book = await getChaptersVol(link)
  return {
    props: {
      book,
    } as Props,
  }
})
