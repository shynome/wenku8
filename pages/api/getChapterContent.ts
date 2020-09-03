export async function getChapterContent(
  bid: string,
  cid: string,
): Promise<string> {
  let link = `http://dl.wenku8.com/packtxt.php?aid=${bid}&vid=${cid}`
  // console.log(link)
  let content = await fetch(link)
    .then((r) => r.arrayBuffer())
    .then((b) => Buffer.from(b).toString('utf16le'))
  return content
}
