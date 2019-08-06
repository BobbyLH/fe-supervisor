import { isType, timeslice, compatCheck, getTs } from 'peeler-js'
import { ItimingSource } from './../index.d';
import { NA, Timing, TimingSource, TimingExec, IAnyObj, IconfigSources, Iwhitelist, Iconfig, PIconfig, Imemory, Itiming, Isource, Iexec, Iperformance, IGeneratorFn, ClearType, IobserveSourceOption } from '../index.d'
import { notSupport, notSupportPromisify, Observer, catchError } from '../utils'

interface MarkCache {
  tag: string;
  ts: number;
}
interface MeasureCache {
  entryType: 'measure';
  name: string;
  duration: number;
}
const markCache: MarkCache[] = []
const measureCache: MeasureCache[] = []
const marks: string[] = []
const measures: string[] = []

export const getMemory = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (): Imemory {
    let used, total, usedRatio

    try {
      const p = window.performance
      const m = (p as any).memory || {}
      used = m.usedJSHeapSize || 0
      total = m.totalJSHeapSize || 1
      usedRatio = +Number.prototype.toFixed.call(used / total, 3)
    } catch (error) {
      const msg = `[SV - getMemory]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      catchError('js', msg)
    } finally {
      return {
        memory: usedRatio || 'N/A',
        used: usedRatio ? used : 'N/A',
        total: usedRatio ? total : 'N/A'
      }
    }
  }
})()

export const getTiming = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (): Itiming {
    let wscreen: Timing,
    fscreen: Timing,
    network: Timing,
    network_prev: Timing,
    network_redirect: Timing,
    network_dns: Timing,
    network_tcp: Timing,
    network_request: Timing,
    network_response: Timing,
    network_interact: Timing,
    dom_loading: Timing,
    dom_interact: Timing,
    dom_ready: Timing,
    dom_load: Timing,
    dom_complete: Timing,
    js_ready: Timing,
    js_load: Timing,
    js_complete: Timing,
    render_ready: Timing,
    render_load: Timing,
    total: Timing;

    wscreen = fscreen = network = network_prev = network_redirect = network_dns = network_tcp = network_request = network_response = network_interact = dom_loading = dom_interact = dom_ready = dom_load = dom_complete = js_ready = js_load = js_complete = render_ready = render_load = total = 'N/A';

    try {
      const p = window.performance
      const t = p.timing || {}

      // white screen timing
      wscreen = timingFilter(t.domLoading - t.navigationStart)
      // first screem timing
      fscreen = timingFilter(t.domContentLoadedEventStart - t.navigationStart)
      // newwork timing
      network = timingFilter(t.responseEnd - t.navigationStart)
      // The timing of unload on the previous page
      network_prev = timingFilter(t.fetchStart - t.navigationStart)
      // redirect timing
      network_redirect = timingFilter(t.redirectEnd - t.redirectStart)
      // DNS timing
      network_dns = timingFilter(t.domainLookupEnd - t.domainLookupStart)
      // tcp timing
      network_tcp = timingFilter(t.connectEnd - t.connectStart)
      // request timing
      network_request = timingFilter(t.responseStart - t.requestStart)
      // request timing
      network_response = timingFilter(t.responseEnd - t.responseStart)
      // request timing
      network_interact = timingFilter(t.responseEnd - t.requestStart)
      // DOM tree loading timing
      dom_loading = timingFilter(t.domLoading - t.responseEnd)
      // DOM tree parsing timing
      dom_interact = timingFilter(t.domInteractive - t.domLoading)
      // DOM tree parsing timing + embed resource loading&parsing&runing timing
      dom_ready = timingFilter(t.domContentLoadedEventStart - t.domLoading)
      // DOM tree generation timing
      dom_load = timingFilter(t.domComplete - t.domLoading)
      // all DOM mount from start to finish
      dom_complete = timingFilter(t.domComplete - t.navigationStart)
      // all script start to runing from load
      js_ready = timingFilter(t.domContentLoadedEventStart - t.domInteractive)
      // all script has been executed from load
      js_load = timingFilter(t.domContentLoadedEventEnd - t.domInteractive)
      // all script has been executed from navigation
      js_complete = timingFilter(t.domContentLoadedEventEnd - t.navigationStart)
      // rendering to interactive timing(Timing from parsing DOM to interactive)
      render_ready = timingFilter(t.domContentLoadedEventStart - t.domLoading)
      // overall rendering timing(DOM from parsing to loading)
      render_load = timingFilter(t.loadEventEnd - t.domLoading)
      // total timing
      total = timingFilter(t.loadEventEnd - t.navigationStart)
    } catch (error) {
      const msg = `[SV - getTiming]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      catchError('js', msg)
    } finally {
      return {
        wscreen,
        fscreen,
        network,
        network_prev,
        network_redirect,
        network_dns,
        network_tcp,
        network_request,
        network_response,
        network_interact,
        dom_loading,
        dom_interact,
        dom_ready,
        dom_load,
        dom_complete,
        js_ready,
        js_load,
        js_complete,
        render_ready,
        render_load,
        total
      }
    }
  }
})()

export const getSource = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (config?: Iconfig): Promise<Isource> {
    // random reporting of API request
    const api_random: TimingSource = []
    // timeout reporting of API request
    const api_timeout: TimingSource = []
    // specified reporting of API request
    const api_appoint: TimingSource = []
    // random reporting of source
    const source_random: TimingSource = []
    // timeout reporting of source
    const source_timeout: TimingSource = []
    // specified reporting of source
    const source_appoint: TimingSource = []
    // others source
    const others: TimingSource = []

    try {
      const {
        apiRatio = 0.1,
        sourceRatio = 0.1,
        apis = '',
        sources = '',
        timeout = 2000,
        whitelist = {},
        paintTiming = false
      } = config || {}
      const w_a = (<Iwhitelist>whitelist).api || ''
      const w_s = (<Iwhitelist>whitelist).source || ''
  
      const p = window.performance
      const s = (p.getEntries && p.getEntries()) || []
      // 超时门槛值 默认值2000毫秒
      const threshold = timeout
  
      function sortSource (item: PerformanceEntry) {
        const entryType = item.entryType || '';
        const type = (item as any).initiatorType || '';
        const data = {
          name: item.name,
          duration: +Number.prototype.toFixed.call(item.duration, 2),
          type
        };

        if (type === 'xmlhttprequest' || type === 'fetchrequest') {
          // apis
          // filtered by whitelist
          if (w_a) {
            if (isType('string')(w_a)) {
              if (data.name === w_a) return
            } else if (isType('array')(w_a)) {
              const w_a_len = (w_a && w_a.length) || 0
              for (let j = 0; j < w_a_len; j++) {
                if (data.name === w_a[j]) return 
              }
            }
          }

          // random obtain apis by api ratio
          randomRatio(apiRatio) && api_random.push(data)
          data.duration >= threshold && api_timeout.push(data)
          if (isType('string')(apis)) {
            data.name === apis && api_appoint.push(data)
          } else if (isType('array')(apis)) {
            (apis as Array<string>).some(v => {
              if (v === data.name) {
                api_appoint.push(data)
                // break the iteration
                return true
              }
              return false
            })
          }
        } else if (type === 'script' || type === 'css' || type === 'img' || type === 'link' || type === 'css') {
          // sources
          // filtered by whitelist
          if (w_s) {
            if (isType('string')(w_s)) {
              if (data.name === w_s) return
            } else if (isType('array')(w_s)) {
              const w_s_len = (w_s && w_s.length) || 0
              for (let m = 0; m < w_s_len; m++) {
                if (data.name === w_s[m]) return 
              }
            }
          }

          // random obtain sources by source ratio 
          randomRatio(sourceRatio) && source_random.push(data)
          data.duration >= threshold && source_timeout.push(data)
          if (isType('string')(sources)) {
            type === sources && source_appoint.push(data)
          } else if (isType('array')(sources)) {
            sources.some(v => {
              if (v === type) {
                source_appoint.push(data)
                // break the iteration
                return true
              }
              return false
            })
          } else if (isType('object')(sources)) {
            for (const k in sources) {
              if (k === type) {
                sources[k].some(v => {
                  if (v === data.name) {
                    source_appoint.push(data)
                    // break the iteration
                    return true
                  }
                  return false
                })
              }
            }
          }
        } else {
          if (paintTiming && entryType === 'paint') {
            const { startTime } = item;
            let type = '';
            if (data.name === 'first-paint' || data.name === 'first-contentful-paint') {
              switch (data.name) {
                case 'first-paint':
                  type = 'FP';
                  break;
                case 'first-contentful-paint':
                  type = 'FCP';
                  break;
              }

              others.push({
                ...data,
                type,
                startTime
              })
            }
          }
        }
      }

      if (compatCheck('generator')) {
        function* gen (): IterableIterator<void> {
          const len = s.length
          for (let i = 0; i < len; i++) {
            sortSource(s[i])
            yield
          }
        }
        await timeslice(gen as IGeneratorFn)
      } else {
        const len = s.length
        for (let i = 0; i < len; i++) {
          sortSource(s[i])
        }
      }
    } catch (error) {
      const msg = `[SV - getSource]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      catchError('js', msg)
    } finally {
      return {
        api_random,
        api_timeout,
        api_appoint,
        source_random,
        source_timeout,
        source_appoint,
        others
      }
    }
  }
})()

export const getExecTiming  = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (): Promise<Iexec> {    
    // code execution timing
    const exec: TimingExec = []

    try {
      const p = window.performance
      let measures: PerformanceEntry[] | MeasureCache[] = []
      if (p.mark && p.measure) {
        measures = (p.getEntriesByType && p.getEntriesByType('measure')) || (p.getEntries && p.getEntries()) || []
      } else {
        measures = measureCache
      }

      function sortExec (item: PerformanceEntry | MeasureCache) {
        if (item.entryType === 'measure') {
          exec.push({
            name: item.name,
            duration: +Number.prototype.toFixed.call(item.duration, 3)
          })
        }
      }

      if (compatCheck('generator')) {
        function* gen () {
          const len = (measures && measures.length) || 0
          for (let i = 0; i < len; i++) {
            sortExec(measures[i])
          }
          yield
        }
        await timeslice(gen as IGeneratorFn)
      } else {
        const len = (measures && measures.length) || 0
        for (let i = 0; i < len; i++) {
          sortExec(measures[i])
        }
      }
    } catch (error) {
      const msg = `[SV - getExecTiming]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      catchError('js', msg)
    } finally {
      return {
        exec
      }
    }
  }
})()

export const getPerformanceData = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (config?: Iconfig): Promise<Iperformance | IAnyObj> {
    let memory, timings, sources, execTiming

    try {
      const memo = getMemory()
      memory = memo && memo.memory
      timings = getTiming() || {}
      sources = await (getSource(config) as Promise<Isource>).then(data => data)
      execTiming = await (getExecTiming() as Promise<Iexec>).then(data => data)
    } catch (error) {
      const msg = `[SV - getPerformanceData]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      catchError('js', msg)
    } finally {
      return {
        memory: memory || 'N/A',
        ...timings,
        ...sources,
        ...execTiming
      }
    }
    
  }
})()

export const mark = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (tag: string): boolean {
    let res = true

    try {
      const p = window.performance
      const tagS = `${tag}_start`
      const tagE = `${tag}_end`

      if (!~marks.indexOf(tag)) {
        if (p.mark) {
          p.mark(tagS)
        } else {
          compatibleMark(tagS)
        }
        marks.push(tag)
      } else if (!~measures.indexOf(tag)) {
        if (p.mark && p.measure) {
          p.mark(tagE)
          p.measure(`${tag}`, tagS, tagE)
        } else {
          compatibleMark(tagE)
          compatibleMeasure(`${tag}`, tagS, tagE)
        }
        measures.push(tag)
      } else {
        res = false
        console.warn(`Cannot repeat tag the mark: ${tag}`)
      }
    } catch (error) {
      res = false
      const msg = `[SV - mark]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      catchError('js', msg)
    } finally {
      return res
    }
  }
})()

export const clearPerformance = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (clearType?: ClearType) {
    try {
      const isClearSource = !clearType || clearType === 'source' || clearType === 'all'
      const isClearMark = !clearType || clearType === 'mark' || clearType === 'all'
      const isClearMeasure = !clearType || clearType === 'measure' || clearType === 'all'

      const p = window.performance
      if (isClearMark) {
        p.clearMarks && p.clearMarks()
        marks.splice(0)
        markCache.splice(0)
      }

      if (isClearMeasure) {
        p.clearMeasures && p.clearMeasures()
        measures.splice(0)
        measureCache.splice(0)
      }

      isClearSource && p.clearResourceTimings && p.clearResourceTimings()

      return true
    } catch (error) {
      const msg = `[SV - clearPerformance]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
      catchError('js', msg)
      return false
    }
  }
})()

export const observeSource = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption): Observer {
    let { sourceType = 'img', timeout = 2000, whitelist = {} } = option || {}
    sourceType = isType('string')(sourceType) ? [sourceType.toLowerCase()] : [...sourceType.map(type => type.toLowerCase())]
    getSourceByDom(target)

    const observer = new Observer(target, async function (mutationRecords) {
      let spendTime = 0
      let frequence = 200

      const len = (mutationRecords && mutationRecords.length) || 0
      const sourceAddr: IconfigSources = {}
      for (let i = 0; i < len; i++) {
        const item = mutationRecords[i];
        const recordType = item.type;
        switch (recordType) {
          case 'childList':
            const addNodes = item.addedNodes
            await timeslice(iterationDOM(addNodes, sourceAddr) as IGeneratorFn)
            break
          case 'attributes':
            const attrName = item.attributeName;
            const target: any = item.target;
            const type: string = target.tagName && target.tagName.toLowerCase() || 'img';
            if (attrName) {
              !sourceAddr[type] && (sourceAddr[type] = []);
              sourceAddr[type].push(target[attrName])
            }
            break
        }
      }

      timerQuery()

      /**
       * polling whether all resources have onload or onerror
       * @returns {void}
       */
      function timerQuery () {
        setTimeout(async function () {
          // more than 3 seconds havn't been loaded
          // there are likely to be errors or timeouts
          // stop polling
          // defined out of time or error data
          const sourceData = await (<Promise<Isource>>getSource({
            apiRatio: 0,
            sourceRatio: 0,
            sources: sourceAddr,
            whitelist
          })).then(data => data.source_appoint)
          let addrLen = 0;
          for (const k in sourceAddr) {
            addrLen += sourceAddr[k].length;
          };

          if ((sourceData && sourceData.length === addrLen) || spendTime >= timeout) {
            return callback && callback(sourceData)
          } else {
            spendTime += frequence
            timerQuery()
          }
        }, frequence)
      }
    })

    /**
     * Specify DOM to get the resource performance information
     * @param dom HTMLElement
     * @param isAsync Asynchronous? true means does not execute callback
     */
    async function getSourceByDom (dom: HTMLElement | Node, isAsync?: boolean) {
      let data: ItimingSource[] = []

      try {
        const type = dom.nodeName.toLowerCase();
        const sourceAddr: IconfigSources = {};
        if (~sourceType.indexOf(type)) {
          const sourceSrc = (<HTMLImageElement | HTMLScriptElement>dom).src || (<HTMLLinkElement>dom).href || '';
          !sourceAddr[type] && (sourceAddr[type] = []);
          sourceSrc && sourceAddr[type].push(sourceSrc);
        }
        const doms = (dom as HTMLElement).children
        if (doms && doms.length > 0) {
          await timeslice(iterationDOM(doms, sourceAddr) as IGeneratorFn)
        }
    
        data = await (<Promise<Isource>>getSource({
          apiRatio: 0,
          sourceRatio: 0,
          sources: sourceAddr,
          whitelist
        })).then(data => data.source_appoint)
    
        !isAsync && callback && callback(data)
      } catch (error) {
        const msg = `[SV - observeSource_getSourceByDom]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
        catchError('js', msg)
      } finally {
        return data
      }
    }

    /**
     * Iteration DOM, screening out eligible DOM
     * @param doms NodeList | HTMLCollection
     */
    function iterationDOM (doms: NodeList | HTMLCollection, sourceAddr: IconfigSources) {
      function sortDOM (doms: NodeList | HTMLCollection, sourceStore: IconfigSources) {
        const len = (doms && doms.length) || 0
        for (let i = 0; i < len; i++) {
          const dom = doms[i]
          const type = dom.nodeName.toLowerCase()
          if (~sourceType.indexOf(type)) {
            const sourceSrc = (<HTMLImageElement | HTMLScriptElement>dom).src || (<HTMLLinkElement>dom).href || '';
            !sourceStore[type] && (sourceStore[type] = []);
            sourceSrc && sourceStore[type].push(sourceSrc);
          }

          const children = (dom as Element).children
          const childLen = (children && children.length) || 0

          if (childLen > 0) {
            sortDOM(children, sourceStore)
          }
        }
      }

      if (compatCheck('generator')) {
        return function* (): IterableIterator<Promise<() => void> | (() => false) | false | void> {
          try {
            const len = (doms && doms.length) || 0
            for (let i = 0; i < len; i++) {
              const dom = doms[i]
              const type = dom.nodeName.toLowerCase()
              if (~sourceType.indexOf(type)) {
                const sourceSrc = (<HTMLImageElement | HTMLScriptElement>dom).src || (<HTMLLinkElement>dom).href || '';
                !sourceAddr[type] && (sourceAddr[type] = []);
                sourceSrc && sourceAddr[type].push(sourceSrc);
              }
  
              const children = (dom as Element).children
              const childLen = (children && children.length) || 0
              if (childLen > 0) {
                yield timeslice(iterationDOM(children, sourceAddr) as IGeneratorFn)
              }
  
              yield
            }
          } catch (error) {
            const msg = `[SV - observeSource_iterationDOM]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
            catchError('js', msg)
          }
        }
      } else {
        sortDOM(doms, sourceAddr)
      }
    }

    return observer
  }
})()

function compatibleMark (tag: string) {
  const ts = +((window.performance.now && ('' + window.performance.now())) || getTs())
  markCache.push({ tag, ts })
}

function compatibleMeasure (tag: string, tagStart: string, tagEnd: string) {
  const len = (markCache && markCache.length) || 0

  let startTime = 0
  let endTime = 0
  for (let i = 0; i < len; i++) {
    const item = markCache[i]
    if (item.tag === tagStart) startTime = item.ts
    if (item.tag === tagEnd) endTime = item.ts
  }

  measureCache.push({ entryType: 'measure', name: tag, duration: Math.abs(endTime - startTime) })
}

function timingFilter (timing: number | undefined): number | NA {
  if (timing === null || timing === undefined || isNaN(timing)) return 'N/A'

  return timing > 0 ? timing : 0
}

function randomRatio (ratio: number) {
  if (ratio === 0) return false
  if (Math.random() <= ratio) return true

  return false
}

export class SV {
  private config: Iconfig | undefined
  public constructor (config?: Iconfig) {
    this.config = config
  }

  public updateConfig (newConfig: PIconfig) {
    this.config = { ...this.config, ...newConfig }
  }

  public getMemory () {
    return getMemory()
  }

  public getTiming () {
    return getTiming()
  }

  public async getSource () {
    return await getSource(this.config)
  }

  public async getExecTiming () {
    return await getExecTiming()
  }

  public async getPerformanceData () {
    return getPerformanceData(this.config)
  }

  public clearPerformance (clearType?: ClearType) {
    return clearPerformance(clearType)
  }

  public observeSource (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption) {
    if (this.config && this.config.timeout) {
      option = { timeout: this.config.timeout, ...option }
    }

    return observeSource(target, callback, option)
  }
}

export default SV