export function notSupport (): false {
  console.warn('Your browser not support the [Performance] API!')
  return false
}

export function notSupportPromisify (): Promise<false> {
  console.warn('Your browser not support the [Performance] API!')
  return Promise.resolve(false)
}