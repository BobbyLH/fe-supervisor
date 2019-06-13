interface ListenerOption {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

/**
 * @param {string} event event name
 * @param {function} fn event callback
 * @param {object} dom event dom
 * @param {ListenerOption} option option contain captrue, passive, once
 */
export const addListener: Function = (function () {
  if (typeof window === 'undefined') return function (): void {}

  if (!window.addEventListener) {
    return function (event: string, fn: EventListenerOrEventListenerObject, dom: HTMLElement): void {
      const eventDOM: any = dom || window
      eventDOM.attachEvent(`on${event}`, fn)
    }
  }

  return function (event: string, fn: EventListenerOrEventListenerObject, dom: HTMLElement, option: ListenerOption = {}): void {
    const eventDOM = dom || window
    const { capture = false, passive = false, once = false } = option

    eventDOM.addEventListener(event, fn, {
      capture,
      passive,
      once
    })
  }
})()

export default addListener
