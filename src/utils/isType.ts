interface AnyObject {
  [propsName: string]: any;
}

interface IsType {
  string: string;
  number: number;
  boolean: boolean;
  null: null;
  undefined: undefined | void;
  symbol: symbol;
  array: any[];
  object: AnyObject;
  regexp: RegExp;
  date: Date;
  function: Function;
}

const typeMap: IsType = {
  string: '',
  number: 1,
  boolean: true,
  null: null,
  undefined: undefined,
  symbol: Symbol(1),
  array: [],
  object: {},
  regexp: /regexp/,
  date: new Date(),
  function: function () {}
}

/**
 * judgement ele type
 * @param {string} type the string of ele type for judgement
 * @param {any} ele the target element
 * @return {boolean} whether or not ele pair with type
 */
export function isType <T extends keyof IsType>(type: T) {
  const typeInstance = typeMap[type]
  return function (ele: any): ele is typeof typeInstance {
    if (typeof ele !== 'object') return typeof ele === type.toLowerCase()
    const len = Object.prototype.toString.call(ele).length - 1
    return Object.prototype.toString.call(ele).slice(8, len).toLowerCase() === type.toLowerCase()
  }
}
export default isType
