import { HandleException } from '../error/Exception'
import { ExceptionType } from '../index.d'

/**
 * catch error method for try catch block
 * @param {ExceptionType} type 
 * @param {string} msg the identity for exclude duplication error
 */
export function catchError (type: ExceptionType, msg: string): void {
  if (!type) return

  if (!HandleException.dupliError(type, msg)) {
    HandleException.setErrors({
      ts: +Date.now(),
      type,
      url: location.href,
      msg
    })
  }
}