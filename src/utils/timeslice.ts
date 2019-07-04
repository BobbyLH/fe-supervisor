import { getTs } from './getTs'

const longTaskThreshold = 50
const singleTaskThreshold = longTaskThreshold / 2

type NotFN = () => false
type Next = Promise<() => void>
type Gen = (genF: GeneratorFunction) => NotFN | Next

const notGF: NotFN = function () {
  console.warn('Please pass the [Generator Function]')
  return false
}

export const timeslice = (function (): NotFN | Gen {
  const supportAPI = typeof window !== 'undefined' && window.performance

  return function (genF: GeneratorFunction): NotFN | Next {
    if (!genF || typeof genF !== 'function') return notGF
    const gen: Generator = genF()

    if (typeof gen.next !== 'function') return notGF

    return new Promise((resolve, reject) => {
      function next (): void {
        try {
          const start = (supportAPI && performance.now()) || getTs()
          let res = null
    
          do {
            res = gen.next()
          } while (!res.done && ((supportAPI && performance.now()) || getTs()) - start < singleTaskThreshold)
    
          if (res.done) {
            resolve(res.value)
            return
          }

          setTimeout(next)
        } catch (err) {
          reject(err)
        }
      }

      next()
    })
  }
})()

export default timeslice