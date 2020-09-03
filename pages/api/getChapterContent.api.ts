import { getChapterContent } from './getChapterContent'
import { NextApiResponse } from 'next'
import fs from 'fs'

export default async (req, res: NextApiResponse) => {
  res.end('finished')
  return
  // http://dl.wenku8.com/packtxt.php?aid=2428&vid=90210&charset=utf-8
  let c = await getChapterContent('2428', '90210')
  fs.writeFileSync('c.txt', c)
  res.end('finished')
}
