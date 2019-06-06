import { getType } from './utils/getType'
import { notSupport } from './utils/notSupport'
import { timeslice } from './utils/timeslice'

type NA = 'N/A'
type Timing = number | NA
type TimingArr = Array<IAnyObj>

interface IAnyObj {
  [propName: string]: any;
}

interface Isources {
  [propName: string]: string[];
}

interface Iconfig {
  apiRatio?: number;
  sourceRatio?: number;
  apis?: string[] | string;
  sources?: Isources | string[] | string;
}

interface Imemory {
  memory: number | NA;
  used: number;
  total: number;
}

interface Itiming {
  timing_wscreen: Timing;
  timing_fscreen: Timing;
  timing_network: Timing;
  timing_network_prev: Timing;
  timing_network_redirect: Timing;
  timing_network_dns: Timing;
  timing_network_tcp: Timing;
  timing_network_request: Timing;
  timing_render: Timing;
  timing_render_ready: Timing;
  timing_render_load: Timing;
}

interface Isource {
  timing_api_random: TimingArr;
  timing_api_timeout: TimingArr;
  timing_api_appoint: TimingArr;
  timing_source_random: TimingArr;
  timing_source_timeout: TimingArr;
  timing_source_appoint: TimingArr;
}

interface Iexec {
  timing_exec: TimingArr;
}

interface Iperformance extends Itiming, Isource, Iexec {
  memory: number | NA;
}

export const getMemory = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return function (): Imemory {
    const p = window.performance
    const m = (p as any).memory
    const used = m.usedJSHeapSize || 0
    const total = m.totalJSHeapSize || 1
    const usedRatio = used / total

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
    const timing_wscreen = timingFilter(t.responseStart - t.navigationStart)
    // 首屏时长
    const timing_fscreen = timingFilter(t.loadEventEnd - t.navigationStart)
    // 网络总时长
    const timing_network = timingFilter(t.responseEnd - t.navigationStart)
    // 上一个页面unload时长
    const timing_network_prev = timingFilter(t.fetchStart - t.navigationStart)
    // 从定向时长
    const timing_network_redirect = timingFilter(t.redirectEnd - t.redirectStart)
    // DNS解析时长
    const timing_network_dns = timingFilter(t.domainLookupEnd - t.domainLookupStart)
    // tcp时长
    const timing_network_tcp = timingFilter(t.connectEnd - t.connectStart)
    // 请求耗时
    const timing_network_request = timingFilter(t.responseEnd - t.requestStart)
    // 渲染时长
    const timing_render = timingFilter(t.responseStart - t.navigationStart)
    // DOM 从解析到可交互的时长
    const timing_render_load = timingFilter(t.loadEventEnd - t.navigationStart)
    // DOM 完全解析完毕时长
    const timing_render_ready = timingFilter(t.domComplete - t.responseEnd)

    return {
    timing_wscreen,
    timing_fscreen,
    timing_network,
    timing_network_prev,
    timing_network_redirect,
    timing_network_dns,
    timing_network_tcp,
    timing_network_request,
    timing_render,
    timing_render_load,
    timing_render_ready
  }
  }
})()

export const getSource = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return async function (config?: Iconfig): Promise<Isource> {
    const { apiRatio = 0.1, sourceRatio = 0.1, apis = '', sources = '' } = config || {}
    const p = window.performance
    const s = p.getEntriesByType('resource')
  
    // 接口请求随机上报
    const timing_api_random: TimingArr = []
    // 接口请求超时上报
    const timing_api_timeout: TimingArr = []
    // 接口请求指定上报
    const timing_api_appoint: TimingArr = []
    // 资源请求随机上报
    const timing_source_random: TimingArr = []
    // 资源请求超时上报
    const timing_source_timeout: TimingArr = []
    // 资源请求指定上报
    const timing_source_appoint: TimingArr = []
    // 超时门槛值 2000毫秒
    const threshold = 2000

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
          randomRatio(apiRatio) && timing_api_random.push(data)
          data.duration >= threshold && timing_api_timeout.push(data)
          if (getType(apis) === 'string') {
            data.name === apis && timing_api_appoint.push(data)
          } else if (getType(apis) === 'array') {
            (apis as Array<string>).some(v => {
              if (v === data.name) {
                timing_api_appoint.push(data)
                // break the iteration
                return true
              }
              return false
            })
          }
        } else {
          randomRatio(sourceRatio) && timing_source_random.push(data)
          data.duration >= threshold && timing_source_timeout.push(data)
          if (getType(sources) === 'string') {
            type === sources && timing_source_appoint.push(data)
          } else if (getType(sources) === 'array') {
            (sources as Array<string>).some(v => {
              if (v === type) {
                timing_source_appoint.push(data)
                // break the iteration
                return true
              }
              return false
            })
          } else if (getType(sources) === 'object') {
            for (const k in <Isources>sources) {
              if (k === type) {
                (<Isources>sources)[k].some(v => {
                  if (v === data.name) {
                    timing_source_appoint.push(data)
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

    await timeslice(gen as any)

    return {
      timing_api_random,
      timing_api_timeout,
      timing_api_appoint,
      timing_source_random,
      timing_source_timeout,
      timing_source_appoint
    }
  }
})()

export const getExecTiming  = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  return async function (): Promise<Iexec> {
    const p = window.performance
    const measures = p.getEntriesByType('measure')
  
    // 代码块执行时长
    const timing_exec: TimingArr = []

    function* gen () {
      const len = measures.length
      for (let i = 0; i < len; i++) {
        const item = measures[i];
        timing_exec.push({
          name: item.name,
          duration: item.duration
        })
      }

      yield
    }
    
    await timeslice(gen as any)

    return {
      timing_exec
    }
  }
})()

export const getPerformanceData = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

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

  return function (tag: string): void {
    const p = window.performance
    const mark = p.mark
    const measure = p.measure

    if (!~marks.indexOf(tag)) {
      mark(`${tag}Start`)
      marks.push(tag)
    } else if (!~measures.indexOf(tag)) {
      mark(`${tag}End`)
      measure(`${tag}`)
      measures.push(tag)
    } else {
      console.warn(`Cannot repeat tag the mark: ${tag}`)
    }
  }
})

export const clear = (function () {
  if (typeof window === 'undefined' || !window.performance) return notSupport

  const p = window.performance
  performance.clearMarks()
  performance.clearMeasures()
  performance.clearResourceTimings()

  marks.splice(0)
  measures.splice(0)
})

function timingFilter (timing: number): number | NA {
  if (isNaN(timing)) return 'N/A'

  return timing > 0 ? timing : 0
}

function randomRatio (ratio: number) {
  if (Math.random() <= ratio) return true

  return false
}