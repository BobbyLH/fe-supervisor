import { ExceptionType, IErrObj, IErrArr, IErrTotalObj } from '../index.d'

enum ExceptionTypes {
  'js',
  'api',
  'source'
}

const jsErrors: IErrArr = []
const apiErrors: IErrArr = []
const sourceErrors: IErrArr = []

export const HandleException = {
  getErrors (type?: ExceptionType): IErrArr | IErrTotalObj {
    const typeIndex = type ? ExceptionTypes[type] : undefined

    let errors
    switch (typeIndex) {
      case ExceptionTypes['js']:
        errors = jsErrors
        break
      case ExceptionTypes['api']:
        errors = apiErrors
        break
      case ExceptionTypes['source']:
        errors = sourceErrors
        break
      default:
        errors = { jsErrors, apiErrors, sourceErrors }
    }

    return errors
  },

  setErrors (error: IErrObj): void {
    const { type } = error
    const typeIndex = ExceptionTypes[type]

    switch (typeIndex) {
      case ExceptionTypes['js']:
        jsErrors.push(error)
        break
      case ExceptionTypes['api']:
        apiErrors.push(error)
        break
      case ExceptionTypes['source']:
        sourceErrors.push(error)
        break
    }
  },

  clearError (type?: ExceptionType): boolean {
    const typeIndex = type ? ExceptionTypes[type] : undefined

    let res = true
    try {
      switch (typeIndex) {
        case ExceptionTypes['js']:
          jsErrors.splice(0)
          break
        case ExceptionTypes['api']:
          apiErrors.splice(0)
          break
        case ExceptionTypes['source']:
          sourceErrors.splice(0)
          break
        default:
          jsErrors.splice(0)
          apiErrors.splice(0)
          sourceErrors.splice(0)
      }
    } catch (err) {
      res= false
    }
    
    return res
  }
}

export default HandleException