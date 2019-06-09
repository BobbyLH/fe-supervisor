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
  }
}

export default HandleException