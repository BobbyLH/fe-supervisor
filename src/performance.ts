import { getType } from './../utils/getType'

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

export interface Itiming {
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
  timing_api_random: TimingArr;
  timing_api_appoint: TimingArr;
  timing_source_random: TimingArr;
  timing_source_appoint: TimingArr;
  timing_exec: TimingArr;
}

export function getPerformanceData (config: Iconfig): Itiming | void {
  if (typeof window === 'undefined' || !window.performance) return

  const { apiRatio = 0.1, sourceRatio = 0.1, apis = '', sources = '' } = config || {}
  const p = window.performance
  const t = p.timing
  const s = p.getEntriesByType('resource')
  const m = p.getEntriesByType('measure')

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
  // 接口请求随机上报
  const timing_api_random: TimingArr = []
  // 接口请求指定上报
  const timing_api_appoint: TimingArr = []
  // 资源请求随机上报
  const timing_source_random: TimingArr = []
  // 资源请求指定上报
  const timing_source_appoint: TimingArr = []
  // 代码块执行时长
  const timing_exec: TimingArr = []

  s.forEach(item => {
    const type = (item as any).initiatorType || ''
    const data = {
      name: item.name,
      duration: Number.prototype.toFixed.call(item.duration, 2),
      type
    }
    if (type === 'xmlhttprequest' || type === 'fetchrequest') {
      random(apiRatio) && timing_api_random.push(data)
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
      random(sourceRatio) && timing_source_random.push(data)
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
  })

  m.forEach(item => {
    timing_exec.push({
      name: item.name,
      duration: item.duration
    })
  })

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
    timing_render_ready,
    timing_api_random,
    timing_api_appoint,
    timing_source_random,
    timing_source_appoint,
    timing_exec
  }
}

export function codeTiming (tag: string): void {
  if (typeof window === 'undefined' || !window.performance) return

  const p = window.performance
  const marks = p.getEntriesByType('mark')

  
}

function timingFilter (timing: number): number | NA {
  if (isNaN(timing)) return 'N/A'

  return timing > 0 ? timing : 0
}

function random (ratio: number) {
  if (Math.random() <= ratio) return true

  return false
}