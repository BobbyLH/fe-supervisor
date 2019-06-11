import { notSupportPromisify } from '../index.d'

export function notSupport (): false {
  console.warn('Your browser not support the [Performance] API!')
  return false
}

export function notSupportPromisify (): notSupportPromisify {
  console.warn('Your browser not support the [Performance] API!')
  return Promise.resolve(false)
}