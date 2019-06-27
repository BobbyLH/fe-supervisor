import { ExceptionType, IErrObj, IErrArr, IErrTotalObj } from '../index.d'
import { addListener, Observer, catchError } from '../utils'
import { HandleException, errorTag } from './Exception'

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
    const imgs = transArray(document.getElementsByTagName('img'))
    const links = transArray(document.getElementsByTagName('link'))
    const scripts = transArray(document.getElementsByTagName('script'))
    const len_img = (imgs && imgs.length) || 0
    const len_link = (links && links.length) || 0
    const len_script = (scripts && scripts.length) || 0
    const max_len = Math.max(len_img, len_link, len_script)

    for (let i = 0; i < max_len; i++) {
      imgs[i] && handleError(imgs[i], 'img')
      links[i] && handleError(links[i], 'link')
      scripts[i] && handleError(scripts[i], 'script')
    }
  }, window)
})()

export function getError (): IErrTotalObj
export function getError (type: ExceptionType): IErrArr
export function getError (type?: ExceptionType): IErrArr | IErrTotalObj {
  return type ? HandleException.getErrors(type) : HandleException.getErrors()
}

export function setError (err: IErrObj): void {
  HandleException.setErrors(err)
}

export function clearError (type?: ExceptionType): boolean {
  return HandleException.clearError(type)
}

export function observeError (target: HTMLElement, callback?: (dom: Node | HTMLElement, e: ErrorEvent) => any, observeDom?: string | string[]): Observer {
  const observer = new Observer(target, function (doms: MutationRecord[]) {
    const observeList = (observeDom && typeof observeDom === 'string' ? [observeDom] : observeDom) || ['img']
    handleError(doms)

    function handleError (doms: MutationRecord[] | HTMLCollection): void {
      try {
        const len_doms = (doms && doms.length) || 0
        for (let i = 0; i < len_doms; i++) {
          const addedNodes = (doms[i] as MutationRecord).addedNodes
          if (addedNodes) {
            const len_added = addedNodes.length || 0
            for (let k = 0; k < len_added; k++) {
              bindError(addedNodes[k])
            }
          } else {
            bindError(doms[i] as Element)
          }
        }
      } catch (error) {
        const msg = `[SV - observeError_handleError]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
        catchError('js', msg)
      }


      function bindError (dom: Node | Element) {
        try {
          const nodeName = dom.nodeName
          const sourceType = nodeName.toLowerCase()
          bind: if (~observeList.indexOf(sourceType)) {
            // Excluding already binding error event situation
            if ((<Element>dom).getAttribute) {
              if ((<Element>dom).getAttribute(errorTag)) break bind
              (<Element>dom).setAttribute(errorTag, 'true')
            }

            addListener('error', function (e: ErrorEvent) {
              const target = e.target
              const url = target && ((target as HTMLLinkElement).href || (target as HTMLImageElement | HTMLScriptElement).src) || location.href
              const errObj: IErrObj = {
                ts: +Date.now(),
                type: 'source',
                sourceType,
                url,
                msg: JSON.stringify(e, Object.getOwnPropertyNames(e))
              }
              HandleException.setErrors(errObj)
              callback && callback(dom, e)
            }, dom, { passive: true })
          }

          const children = (dom as Element).children
          if (children && children.length > 0) {
            return handleError(children)
          }
        } catch (error) {
          const msg = `[SV - observeError_bindError]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
          catchError('js', msg)
        }
      }
    }
  })

  return observer
}

function transArray (arrayLike: ArrayLike<HTMLElement>): Array<HTMLElement> {
  if (Array.from) {
    return Array.from(arrayLike)
  }
  return Array.prototype.slice.call(arrayLike)
}

function handleError (target: HTMLElement, sourceType: string) {
  if (!target || target.getAttribute(errorTag)) return

  target.setAttribute(errorTag, 'true')
  addListener('error', function (e: ErrorEvent) {
    const url = (e as any).target.src || (e as any).target.href
    HandleException.setErrors({
      ts: +Date.now(),
      type: 'source',
      sourceType,
      url,
      msg: JSON.stringify(e, Object.getOwnPropertyNames(e))
    })
  }, target)
}