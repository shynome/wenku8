import React, { Fragment } from 'react'
import App from 'next/app'
import Head from 'next/head'

import { CssBaseline, LinearProgress, Container } from '@material-ui/core'

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Fragment>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <CssBaseline />
        <Container disableGutters>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <Component {...pageProps} />
        </Container>
      </Fragment>
    )
  }
}
