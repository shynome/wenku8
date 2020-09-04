import { Book, ChaptersVol, Chapter } from '~graphql/codegen'
import cheerio from 'cheerio'
import iconv from 'iconv-lite'

function genEmptyVol(): ChaptersVol {
  return {
    name: '',
    chapters: [],
    order: 0,
  }
}

function getBid(link: string) {
  return link.match(/\/(\d+)\/index.htm$/)[1]
}

export async function getLink(bid: string) {
  const $ = await fetch(`https://www.wenku8.net/book/${bid}.htm`)
    .then((r) => r.arrayBuffer())
    .then((b) => iconv.decode(Buffer.from(b), 'gbk'))
    .then((r) => cheerio.load(r))
  const a = $('#content fieldset a').first()
  return a.attr('href')
}

export async function getChaptersVol(link: string): Promise<Book> {
  const $ = await fetch(link)
    .then((r) => r.arrayBuffer())
    .then((b) => iconv.decode(Buffer.from(b), 'gbk'))
    .then((r) => {
      return cheerio.load(r)
    })
  const nodes = $('.css td')
  const vols = []
  let vol: ChaptersVol
  let volOrder = 0
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes.eq(i)
    if (n.hasClass('vcss')) {
      vol = genEmptyVol()
      vol.name = n.text()
      vol.order = volOrder++
      vols.push(vol)
      continue
    }
    let a = n.find('a')
    if (a.length === 0) {
      // 跳过填充用的 td
      continue
    }
    let chapter: Chapter = {
      cid: a.attr('href').slice(0, '.htm'.length * -1),
      name: a.text(),
      order: vol.chapters.length,
    }
    vol.chapters.push(chapter)
  }
  return {
    bid: getBid(link),
    name: $('#title').text(),
    chaptersVols: vols,
  }
}

export async function getBook(bid: string) {
  const link = await getLink(bid)
  return getChaptersVol(link)
}
