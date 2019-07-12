import { getTs } from 'peeler-js'
import { HandleException } from '../error/Exception'
import { ExceptionType } from '../index.d'

/**
 * catch error method for try catch block
 * @param {ExceptionType} type 
 * @param {string} msg the identity for exclude duplication error
 */
export async function catchError (type: ExceptionType, msg: string): Promise<void> {
  if (!type) return
  const isDuplication = await HandleException.dupliError(type, msg)
  if (!isDuplication) {
    HandleException.setErrors({
      ts: getTs(),
      type,
      url: location.href,
      msg
    })
  }
}

export default catchError