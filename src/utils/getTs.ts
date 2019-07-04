/**
 * polyfill ES5 character - Date.now
 */
export function getTs () {
  return (Date.now && +Date.now()) || new Date().getTime()
}

export default getTs
