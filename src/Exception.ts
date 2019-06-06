export type ExceptionType = 'js' | 'api' | 'source'

enum ExceptionTypes {
  'js',
  'api',
  'source'
}

export interface IErrObj {
  type: ExceptionType;
  sourceType?: string;
  url: string;
  [propName: string]: any;
}

export type IErrArr = IErrObj[]

export interface IErrTotalObj {
  jsErrors: IErrArr;
  apiErrors: IErrArr;
  sourceErrors: IErrArr;
}

const jsErrors: IErrArr = []
const apiErrors: IErrArr = []
const sourceErrors: IErrArr = []

export class Exception {
  public static getErrors (type: ExceptionType | undefined): IErrArr | IErrTotalObj {
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
  }

  public setErrors (error: IErrObj): void {
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

export default Exception