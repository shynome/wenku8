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
import { useQuery, gql } from '@apollo/client'

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

export const queryBook = gql`
  query getBook($bid: String!) {
    book: Book(bid: $bid) {
      bid
      name
      chaptersVols {
        name
        order
        chapters {
          cid
          name
        }
      }
    }
  }
`

import { useRouter } from 'next/router'
import Head from 'next/head'
function Page() {
  const classes = useStyles()
  const bid = useRouter().query['bid']
  const { loading, error, data } = useQuery<{ book: Book }>(queryBook, {
    variables: { bid },
  })
  if (loading) {
    return <LinearProgress />
  }
  if (error) {
    return <div>{error.message}</div>
  }
  return (
    <Paper>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>{data.book.name}</Typography>
        </Toolbar>
      </AppBar>
      <Head>
        <title>{data.book.name}</title>
      </Head>
      <div className={classes.paper}>
        <BookInfo book={data.book} />
      </div>
    </Paper>
  )
}
export default Page
