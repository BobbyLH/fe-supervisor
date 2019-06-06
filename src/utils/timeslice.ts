import { notSupport } from './notSupport'

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
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (genF: GeneratorFunction): NotFN | Next {
    if (!genF || typeof genF !== 'function') return notGF
    const gen: Generator = genF()

    if (typeof gen.next !== 'function') return notGF

    return new Promise((resolve, reject) => {
      function next (): void {
        try {
          const start = performance.now()
          let res = null
    
          do {
            res = gen.next()
          } while (!res.done && performance.now() - start < singleTaskThreshold)
    
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
