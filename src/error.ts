import { addListener } from './utils/addListener'
import { Exception, ExceptionType, IErrArr, IErrTotalObj } from './Exception'

(function () {
  if (typeof window === 'undefined') return

  const exception = new Exception()


  window.onerror = function (msg, url, row, col, error) {
    exception.setErrors({
      type: 'js',
      url: url || '',
      msg,
      error
    })
  }

  addListener('error', function (e: ErrorEvent) {
    // console.log(e)
  }, window)

  addListener('DOMContentLoaded', function (e: Event) {
    const imgs = transArray(document.getElementsByTagName('img'))
    const links = transArray(document.getElementsByTagName('link'))
    const scripts = transArray(document.getElementsByTagName('script'))

    imgs.forEach(img => addListener('error', function (e: ErrorEvent) {
      // console.log('img', e)
    }, img))
  
    links.forEach(link => addListener('error', function (e: ErrorEvent) {
      // console.log('link', e)
    }, link))
  
    scripts.forEach(script => addListener('error', function (e: ErrorEvent) {
      // console.log('script', e)
    }, script))
  }, window)
})()

export function getError (type: ExceptionType | undefined): IErrArr | IErrTotalObj {
  return Exception.getErrors(type)
}

function transArray (arrayLike: ArrayLike<HTMLElement>) {
  return Array.prototype.slice.call(arrayLike)
}