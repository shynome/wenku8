import { getChaptersVol } from './getChaptersVol'

export default async (req, res) => {
  return res.end('finished')
  let d = await getChaptersVol('https://www.wenku8.net/novel/1/1861/index.htm')
  res.json(d)
}
