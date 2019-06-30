import { ItimingSource } from './../index.d';
import { NA, Timing, TimingSource, TimingExec, IAnyObj, IconfigSources, Iwhitelist, Iconfig, PIconfig, Imemory, Itiming, Isource, Iexec, Iperformance, IGeneratorFn, ClearType, IobserveSourceOption } from '../index.d'
import { isType, notSupport, notSupportPromisify, timeslice, Observer, catchError, compatCheck, getTs } from '../utils'

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
    let wscreen: Timing, fscreen: Timing, network: Timing, network_prev: Timing, network_redirect: Timing, network_dns: Timing, network_tcp: Timing, network_request: Timing, render_ready: Timing, render_load: Timing, js_complete: Timing, dom_complete: Timing, total: Timing;
    wscreen = fscreen = network = network_prev = network_redirect = network_dns = network_tcp = network_request = render_ready = render_load = js_complete = dom_complete = total = 'N/A'

    try {
      const p = window.performance
      const t = p.timing || {}

      // 白屏时长
      wscreen = timingFilter(t.domLoading - t.navigationStart)
      // 首屏时长
      fscreen = timingFilter(t.domContentLoadedEventStart - t.navigationStart)
      // 网络总时长
      network = timingFilter(t.responseEnd - t.navigationStart)
      // 上一个页面unload时长
      network_prev = timingFilter(t.fetchStart - t.navigationStart)
      // 从定向时长
      network_redirect = timingFilter(t.redirectEnd - t.redirectStart)
      // DNS解析时长
      network_dns = timingFilter(t.domainLookupEnd - t.domainLookupStart)
      // tcp时长
      network_tcp = timingFilter(t.connectEnd - t.connectStart)
      // 请求耗时
      network_request = timingFilter(t.responseEnd - t.requestStart)
      // 渲染至可交互时长(DOM从开始解析到可交互的时长)
      render_ready = timingFilter(t.domContentLoadedEventStart - t.domLoading)
      // 整体渲染完毕时长(DOM从开始解析到加载完毕时长)
      render_load = timingFilter(t.loadEventEnd - t.domLoading)
      // 所需要的脚本执行完成时长
      js_complete = timingFilter(t.domContentLoadedEventEnd - t.navigationStart)
      // DOM完全挂载完毕时长
      dom_complete = timingFilter(t.domComplete - t.navigationStart)
      // 总耗时
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
        render_ready,
        render_load,
        js_complete,
        dom_complete,
        total
      }
    }
  }
})()

export const getSource = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (config?: Iconfig): Promise<Isource> {
    // 接口请求随机上报
    const api_random: TimingSource = []
    // 接口请求超时上报
    const api_timeout: TimingSource = []
    // 接口请求指定上报
    const api_appoint: TimingSource = []
    // 资源请求随机上报
    const source_random: TimingSource = []
    // 资源请求超时上报
    const source_timeout: TimingSource = []
    // 资源请求指定上报
    const source_appoint: TimingSource = []

    try {
      const {
        apiRatio = 0.1,
        sourceRatio = 0.1,
        apis = '',
        sources = '',
        timeout = 2000,
        whitelist = {}
      } = config || {}
      const w_a = (<Iwhitelist>whitelist).api || ''
      const w_s = (<Iwhitelist>whitelist).source || ''
  
      const p = window.performance
      const s = (p.getEntriesByType && p.getEntriesByType('resource')) || (p.getEntries && p.getEntries()) || []
      // 超时门槛值 默认值2000毫秒
      const threshold = timeout
  
      function sortSource (item: PerformanceEntry) {
        const type = (item as any).initiatorType || ''
        const data = {
          name: item.name,
          duration: +Number.prototype.toFixed.call(item.duration, 2),
          type
        }

        if (type === 'xmlhttprequest' || type === 'fetchrequest') {
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
        } else if (type === 'script' || type === 'css' || type === 'img' || type === 'link') {
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

          randomRatio(sourceRatio) && source_random.push(data)
          data.duration >= threshold && source_timeout.push(data)
          if (isType('string')(sources)) {
            type === sources && source_appoint.push(data)
          } else if (isType('array')(sources)) {
            (sources as Array<string>).some(v => {
              if (v === type) {
                source_appoint.push(data)
                // break the iteration
                return true
              }
              return false
            })
          } else if (isType('object')(sources)) {
            for (const k in <IconfigSources>sources) {
              if (k === type) {
                (<IconfigSources>sources)[k].some(v => {
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
        source_appoint
      }
    }
  }
})()

export const getExecTiming  = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (): Promise<Iexec> {    
    // 代码块执行时长
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
      // 简单的同步任务
      const memo = getMemory()
      memory = memo && memo.memory
      timings = getTiming() || {}
      // 耗时的异步任务
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
    sourceType = sourceType.toLowerCase()
    getSourceByDom(target)

    const observer = new Observer(target, async function (mutationRecords) {
      let spendTime = 0
      let frequence = 200

      const len = (mutationRecords && mutationRecords.length) || 0
      const sourceAddr: string[] = []
      for (let i = 0; i < len; i++) {
        const item = mutationRecords[i]
        const recordType = mutationRecords[i].type
        switch (recordType) {
          case 'childList':
            const addNodes = item.addedNodes
            await timeslice(iterationDOM(addNodes, sourceAddr) as IGeneratorFn)
            break
          case 'attributes':
            const attrName = item.attributeName
            const target: any = item.target
            attrName && sourceAddr.push(target[attrName])
            break
        }
      }
      timerQuery()

      /**
       * 轮询是否所有的资源都执行了onload 或者 onerror
       * @returns {void}
       */
      function timerQuery () {
        setTimeout(async function () {
          // 超过3秒还未加载, 很可能有错误或超时, 停止轮询, 走超时或错误数据
          const sourceData = await (<Promise<Isource>>getSource({
            apiRatio: 0,
            sourceRatio: 0,
            sources: { [`${sourceType}`]: sourceAddr },
            whitelist
          })).then(data => data.source_appoint)
          if ((sourceData && sourceAddr && sourceData.length === sourceAddr.length) || spendTime >= timeout) {
            return callback && callback(sourceData)
          } else {
            spendTime += frequence
            timerQuery()
          }
        }, frequence)
      }
    })

    /**
     * 指定DOM获取其中的资源performance信息
     * @param dom HTMLElement
     * @param isAsync 是否异步, true的话则不执行callback
     */
    async function getSourceByDom (dom: HTMLElement | Node, isAsync?: boolean) {
      let data: ItimingSource[] = []

      try {
        const sourceAddr: string[] = []
        if (dom.nodeName.toLowerCase() === sourceType) {
          const sourceSrc = (<HTMLImageElement | HTMLScriptElement>dom).src || (<HTMLLinkElement>dom).href || ''
          sourceSrc && sourceAddr.push(sourceSrc)
        }
        const doms = (dom as HTMLElement).children
        if (doms && doms.length > 0) {
          await timeslice(iterationDOM(doms, sourceAddr) as IGeneratorFn)
        }
    
        data = await (<Promise<Isource>>getSource({
          apiRatio: 0,
          sourceRatio: 0,
          sources: { [`${sourceType}`]: sourceAddr },
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
     * 遍历DOM, 筛选出符合条件的DOM
     * @param doms NodeList | HTMLCollection
     */
    function iterationDOM (doms: NodeList | HTMLCollection, sourceAddr: string[]) {
      function sortDOM (doms: NodeList | HTMLCollection, sourceStore: string[]) {
        const len = (doms && doms.length) || 0
        for (let i = 0; i < len; i++) {
          const dom = doms[i]
          const type = dom.nodeName.toLowerCase()
          if (sourceType === type) {
            const sourceSrc = (<HTMLImageElement | HTMLScriptElement>dom).src || (<HTMLLinkElement>dom).href || ''
            sourceSrc && sourceStore.push(sourceSrc)
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
              if (sourceType === type) {
                const sourceSrc = (<HTMLImageElement | HTMLScriptElement>dom).src || (<HTMLLinkElement>dom).href || ''
                sourceSrc && sourceAddr.push(sourceSrc)
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