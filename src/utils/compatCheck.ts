type compatType = 'generator' | 'promise' | 'async'

export function compatCheck (type: compatType): boolean {
  let res = true
  try {
    switch (type) {
      case 'generator':
        const genFn = function* (): IterableIterator<boolean> {
          yield true;
        }
        const gen = genFn()
        gen.next()
        break
      case 'promise':
        Promise.resolve(true)
        break
      case 'async':
        const asyncFn = async function () {
          const res = await Promise.resolve(true).then(res => res)
          return res
        }
        asyncFn()
        break
    }
  } catch (error) {
    res = false
  }

  return res
}

export default compatCheck