import React, { Fragment } from 'react'
import App from 'next/app'

import { CssBaseline, LinearProgress, Container } from '@material-ui/core'
import dynamic from 'next/dynamic'

const Provider = dynamic(() => import('./_provider'), {
  loading: () => <LinearProgress />,
  ssr: false,
})

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Fragment>
        <CssBaseline />
        <Container disableGutters>
          <Provider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <Component {...pageProps} />
          </Provider>
        </Container>
      </Fragment>
    )
  }
}
