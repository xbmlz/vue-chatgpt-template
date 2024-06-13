export async function convertReadableStreamToRef(stream: ReadableStream, ref: Ref<string>) {
  let text = ''
  try {
    const reader = stream.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false
    while (!done) {
      const { value, done: readerDone } = await reader.read()
      if (value) {
        const char = decoder.decode(value, { stream: true })
        if (char) {
          text += char
          ref.value = text
        }
        // // 打字机
        // const delay = 50
        // const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        // const type = async (text: string, index: number) => {
        //   if (index < text.length) {
        //     ref.value += text[index]
        //     await sleep(delay)
        //     await type(text, index + 1)
        //   }
        // }
        // await type(char, 0)
      }
      done = readerDone
    }
  }
  catch (error) {
    console.error(error)
  }
}
