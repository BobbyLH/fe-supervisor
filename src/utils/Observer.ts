import { IAnyObj } from '../index.d'

export class Observer {
  private observer: MutationObserver | null
  private cache: IAnyObj[]
  public constructor (target: HTMLElement, callback: (doms: MutationRecord[]) => any) {
    this.cache = []
    this.observer = this.init(target, callback)
  }

  public init (target: HTMLElement, callback: (doms: MutationRecord[]) => any): MutationObserver | null {
    if (!target) {
      console.warn('Please pass a vaild HTMLElement')
      return null
    }

    let observer
    try {
      observer = new MutationObserver(callback)
  
      observer.observe(target, {
        'childList': true,
        'subtree':true
      })
    } catch (error) {
      return null
    }

    return observer
  }

  public cancel () {
    this.observer && this.observer.disconnect()
  }

  public setCache (cache: IAnyObj) {
    this.cache.push(cache)
  }

  public getCache () {
    return this.cache
  }

  public clearCache () {
    this.cache.splice(0)
  }
}

export default Observer