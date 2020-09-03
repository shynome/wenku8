// @ts-check

import { createServer } from 'http'
import next from 'next'
import { parse } from 'url'
import send from 'send'

const app = next({ dev: false })
const handle = app.getRequestHandler()

// @ts-ignore
await app.prepare()

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true)
  if (parsedUrl.pathname.startsWith('/api')) {
    handle(req, res, parsedUrl)
    return
  }
  send(req, parsedUrl.pathname, { extensions: ['html'], root: 'out' }).pipe(res)
})

server.listen(3000, (err) => {
  if (err) throw err
  console.log('> Ready on http://127.0.0.1:3000')
})
