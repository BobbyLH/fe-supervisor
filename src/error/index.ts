import { ExceptionType, IErrObj, IErrArr, IErrTotalObj } from '../index.d'
import { addListener } from '../utils/addListener'
import { HandleException } from './Exception'

(function () {
  if (typeof window === 'undefined') return

  addListener('error', function (e: ErrorEvent) {
    const { filename, message, error } = e

    HandleException.setErrors({
      ts: +Date.now(),
      type: 'js',
      url: filename || '',
      msg: message,
      error
    })
  }, window, { passive: true} )

  addListener('DOMContentLoaded', function () {
    const imgs = transArray(document.querySelectorAll('img'))

    imgs.forEach(img => addListener('error', function (e: ErrorEvent) {
      const sourceType = 'img'
      const url = (e as any).target.src
      HandleException.setErrors({
        ts: +Date.now(),
        type: 'source',
        sourceType,
        url
      })
    }, img))
  }, window)
})()

export function getError (): IErrTotalObj
export function getError (type: ExceptionType): IErrObj[]
export function getError (type?: ExceptionType): IErrArr | IErrTotalObj {
  return HandleException.getErrors(type)
}

export function setError (err: IErrObj): void {
  HandleException.setErrors(err)
}

export function clearError (type?: ExceptionType): boolean {
  return HandleException.clearError(type)
}

export class ObserveError {
  private observer: MutationObserver | void
  public constructor (target: HTMLElement, observeDom?: string | string[]) {
    this.observer = this.init(target, observeDom)
  }

  public init (target: HTMLElement, observeDom?: string | string[]): MutationObserver | void {
    if (!target) return console.warn('Please pass a vaild HTMLElement')
    const observer = new MutationObserver(function (doms) {
      const observeList = (observeDom && typeof observeDom === 'string' ? [observeDom] : observeDom) || ['img']
      handleError(doms)
  
      function handleError (doms: MutationRecord[] | NodeList): void {
        const len = doms.length
        for (let i = 0; i < len; i++) {
          const item: any = ((doms[i] as any).addedNodes && (doms[i] as any).addedNodes[0]) || doms[i]
          const nodeName = item.nodeName || ''
          const sourceType = nodeName.toLowerCase()
          if (~observeList.indexOf(sourceType)) {
            addListener('error', function (e: ErrorEvent) {
              const url = (e as any).target.src
              HandleException.setErrors({
                ts: +Date.now(),
                type: 'source',
                sourceType,
                url
              })
            }, item)
          }
  
          if (item.children.length > 0) {
            return handleError(item.children)
          }
        }
      }
    })
  
    observer.observe(target, {
      'childList': true,
      'attributes':true
    })
  
    return observer
  }

  public cancel () {
    this.observer && this.observer.disconnect()
  }
}

function transArray (arrayLike: ArrayLike<HTMLElement>) {
  return Array.prototype.slice.call(arrayLike)
}