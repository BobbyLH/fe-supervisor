import { NA, TimingSource, TimingExec, IAnyObj, IconfigSources, Iconfig, Imemory, Itiming, Isource, Iexec, Iperformance, IGeneratorFn, ClearType, IobserveSourceOption } from '../index.d'
import { getType, notSupport, notSupportPromisify, timeslice, logger, Observer } from '../utils'

export const getMemory = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (): Imemory {
    const p = window.performance
    const m = (p as any).memory
    const used = m.usedJSHeapSize || 0
    const total = m.totalJSHeapSize || 1
    const usedRatio = +Number.prototype.toFixed.call(used / total, 3)

    return {
      memory: usedRatio || 'N/A',
      used,
      total
    }
  }
})()

export const getTiming = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (): Itiming {
    const p = window.performance
    const t = p.timing
      
    // 白屏时长
    const wscreen = timingFilter(t.responseStart - t.navigationStart)
    // 首屏时长
    const fscreen = timingFilter(t.domContentLoadedEventStart - t.navigationStart)
    // 网络总时长
    const network = timingFilter(t.responseEnd - t.navigationStart)
    // 上一个页面unload时长
    const network_prev = timingFilter(t.fetchStart - t.navigationStart)
    // 从定向时长
    const network_redirect = timingFilter(t.redirectEnd - t.redirectStart)
    // DNS解析时长
    const network_dns = timingFilter(t.domainLookupEnd - t.domainLookupStart)
    // tcp时长
    const network_tcp = timingFilter(t.connectEnd - t.connectStart)
    // 请求耗时
    const network_request = timingFilter(t.responseEnd - t.requestStart)
    // DOM从开始解析到可交互的时长
    const render_ready = timingFilter(t.domContentLoadedEventStart - t.domLoading)
    // DOM从开始解析到加载完毕时长
    const render_load = timingFilter(t.loadEventEnd - t.domLoading)
    // 总耗时
    const total = timingFilter(t.loadEventEnd - t.navigationStart)

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
      total
    }
  }
})()

export const getSource = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (config?: Iconfig): Promise<Isource> {
    const { apiRatio = 0.1, sourceRatio = 0.1, apis = '', sources = '', timeout = 2000 } = config || {}
    const p = window.performance
    const s = p.getEntriesByType('resource')
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
    // 超时门槛值 默认值2000毫秒
    const threshold = timeout

    function* gen (): IterableIterator<void> {
      const len = s.length

      for (let i = 0; i < len; i++) {
        const item = s[i]
        const type = (item as any).initiatorType || ''
        const data = {
          name: item.name,
          duration: +Number.prototype.toFixed.call(item.duration, 2),
          type
        }
        if (type === 'xmlhttprequest' || type === 'fetchrequest') {
          randomRatio(apiRatio) && api_random.push(data)
          data.duration >= threshold && api_timeout.push(data)
          if (getType(apis) === 'string') {
            data.name === apis && api_appoint.push(data)
          } else if (getType(apis) === 'array') {
            (apis as Array<string>).some(v => {
              if (v === data.name) {
                api_appoint.push(data)
                // break the iteration
                return true
              }
              return false
            })
          }
        } else {
          randomRatio(sourceRatio) && source_random.push(data)
          data.duration >= threshold && source_timeout.push(data)
          if (getType(sources) === 'string') {
            type === sources && source_appoint.push(data)
          } else if (getType(sources) === 'array') {
            (sources as Array<string>).some(v => {
              if (v === type) {
                source_appoint.push(data)
                // break the iteration
                return true
              }
              return false
            })
          } else if (getType(sources) === 'object') {
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

        yield
      }
    }

    await timeslice(gen as IGeneratorFn)

    return {
      api_random,
      api_timeout,
      api_appoint,
      source_random,
      source_timeout,
      source_appoint
    }
  }
})()

export const getExecTiming  = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (): Promise<Iexec> {
    const p = window.performance
    const measures = p.getEntriesByType('measure')
  
    // 代码块执行时长
    const exec: TimingExec = []

    function* gen () {
      const len = measures.length
      for (let i = 0; i < len; i++) {
        const item = measures[i];
        exec.push({
          name: item.name,
          duration: item.duration
        })
      }

      yield
    }
    
    await timeslice(gen as IGeneratorFn)

    return {
      exec
    }
  }
})()

export const getPerformanceData = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return async function (config?: Iconfig): Promise<Iperformance | IAnyObj> {
    // 简单的同步任务
    const memo = getMemory()
    const { memory } = memo as Imemory
    const timings = getTiming()
    // 耗时的异步任务
    const sources = await (getSource(config) as Promise<Isource>).then(data => data)
    const execTiming = await (getExecTiming() as Promise<Iexec>).then(data => data)

    return {
      memory: memory || 'N/A',
      ...timings,
      ...sources,
      ...execTiming
    }
  }
})()

const marks: string[] = []
const measures: string[] = []
export const mark = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (tag: string): boolean {
    const p = window.performance
    const mark = p.mark
    const measure = p.measure

    let res = true
    if (!~marks.indexOf(tag)) {
      mark(`${tag}Start`)
      marks.push(tag)
    } else if (!~measures.indexOf(tag)) {
      mark(`${tag}End`)
      measure(`${tag}`)
      measures.push(tag)
    } else {
      res = false
      console.warn(`Cannot repeat tag the mark: ${tag}`)
    }

    return res
  }
})()

export const clearPerformance = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (clearType?: ClearType) {
    try {
      const isClearSource = !clearType || clearType === 'source' || clearType === 'all'
      const isClearMark = !clearType || clearType === 'mark' || clearType === 'all'
      const p = window.performance
      isClearMark && p.clearMarks()
      isClearMark && p.clearMeasures()
      isClearSource && p.clearResourceTimings()
    
      isClearMark && marks.splice(0)
      isClearMark && measures.splice(0)
      return true
    } catch (err) {
      logger(err)
      return false
    }
  }
})()

export const observeSource = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupportPromisify

  return function (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption): Observer {
    let { sourceType = 'img', timeout = 2000 } = option || {}
    sourceType = sourceType.toLowerCase()
    getSourceByDom(target)

    const observer = new Observer(target, async function (mutationRecords) {
      let spendTime = 0
      let frequence = 200

      const len = mutationRecords.length
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
            sources: {[sourceType as string]: sourceAddr}
          })).then(data => data.source_appoint)
          if (sourceData.length === sourceAddr.length || spendTime >= timeout) {
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
      const sourceAddr: string[] = []

      if (dom.nodeName.toLowerCase() === sourceType) {
        const sourceSrc = (<HTMLLinkElement>dom).href || (<HTMLImageElement | HTMLScriptElement>dom).src
        sourceAddr.push(sourceSrc)
      }
      const doms = (dom as HTMLElement).children
      if (doms && doms.length > 0) {
        await timeslice(iterationDOM(doms, sourceAddr) as IGeneratorFn)
      }
  
      const data = await (<Promise<Isource>>getSource({
        apiRatio: 0,
        sourceRatio: 0,
        sources: {[sourceType as string]: sourceAddr}
      })).then(data => data.source_appoint)
  
      !isAsync && callback && callback(data)
      return data
    }

    /**
     * 遍历DOM, 筛选出符合条件的DOM
     * @param doms NodeList | HTMLCollection
     */
    function iterationDOM (doms: NodeList | HTMLCollection, sourceAddr: string[]) {
      return function* (): IterableIterator<Promise<() => void> | (() => false) | false | void> {
        const len = doms.length
        for (let i = 0; i < len; i++) {
          const dom = doms[i]
          const type = dom.nodeName.toLowerCase()
          if (sourceType === type) {
            let sourceSrc
            if (type === 'link') {
              sourceSrc = (<HTMLLinkElement>dom).href
            } else {
              sourceSrc = (<HTMLImageElement | HTMLScriptElement>dom).src
            }
            sourceAddr.push(sourceSrc)
          }

          const children = (dom as Element).children
          const childLen = children ? children.length : 0
          if (childLen > 0) {
            yield timeslice(iterationDOM(children, sourceAddr) as IGeneratorFn)
          }

          yield
        }
      }
    }

    return observer
  }
})()

function timingFilter (timing: number): number | NA {
  if (isNaN(timing)) return 'N/A'

  return timing > 0 ? timing : 0
}

function randomRatio (ratio: number) {
  if (ratio === 0) return false
  if (Math.random() <= ratio) return true

  return false
}