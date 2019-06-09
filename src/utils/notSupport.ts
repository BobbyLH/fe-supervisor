import { InotSupportPromisify } from '../index.d'

export function notSupport (): false {
  console.warn('Your browser not support the [Performance] API!')
  return false
}

export function notSupportPromisify (): InotSupportPromisify {
  console.warn('Your browser not support the [Performance] API!')
  const thenable = {
    then: function (cb?: Function) {
      typeof cb === 'function' && cb()
      return thenable
    },
    catch: function (cb?: Function) {
      typeof cb === 'function' && cb()
      return thenable
    }
  }

  return thenable
}