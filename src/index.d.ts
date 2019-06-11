// performance
export type NA = 'N/A'
export type Timing = number | NA
export type TimingArr = Array<IAnyObj>

export interface IAnyObj {
  [propName: string]: any;
}

export interface Isources {
  [propName: string]: string[];
}

export interface Iconfig {
  apiRatio?: number;
  sourceRatio?: number;
  apis?: string[] | string;
  sources?: Isources | string[] | string;
}

export interface Imemory {
  memory: number | NA;
  used: number;
  total: number;
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
}

export interface Isource {
  timing_api_random: TimingArr;
  timing_api_timeout: TimingArr;
  timing_api_appoint: TimingArr;
  timing_source_random: TimingArr;
  timing_source_timeout: TimingArr;
  timing_source_appoint: TimingArr;
}

export interface Iexec {
  timing_exec: TimingArr;
}

export interface Iperformance extends Itiming, Isource, Iexec {
  memory: number | NA;
}

export interface IGeneratorFn extends GeneratorFunction {
  readonly [Symbol.toStringTag]: 'GeneratorFunction';
  (): IterableIterator<any>;
}

// error
export type ExceptionType = 'js' | 'api' | 'source'

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

// env
export interface IenvInfo {
  ts: number;
  os: string;
  browser: string;
  screen_size: string;
  referer: string;
  page_url: string;
  device: string;
  ua: string;
}

//track
export interface Itrackprops {
  type: string;
  info: any;
}

export interface ItrackInfo {
  general: IenvInfo | void;
  props: Itrackprops;
}

// index
export type notSupportFn = () => false
export type notSupportPromisify = Promise<false>
export type notSupportPromisifyFn = () => notSupportPromisify

// declare
declare const getPerformanceData: notSupportPromisifyFn | ((config?: Iconfig) => Promise<Iperformance | IAnyObj>)
declare const getMemory: notSupportFn | (() => Imemory)
declare const getTiming: notSupportFn | (() => Itiming)
declare const getSource: notSupportPromisifyFn | ((config?: Iconfig) => Promise<Isource>)
declare const getExecTiming: notSupportPromisifyFn | (() => Promise<Iexec>)
declare const mark: notSupportFn | ((tag: string) => void)
declare const clearPerformance: notSupportFn | (() => boolean)
declare const getSourceByDom: notSupportPromisifyFn | ((target: HTMLElement, sourceType?: string) => Promise<IAnyObj[]>)
declare const getEnvInfo: () => void | IenvInfo
declare const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
declare const setError: (err: IErrObj) => void
declare class ObserveError {
  public constructor (target: HTMLElement, observeDom?: string | string[])
  public init (target: HTMLElement, observeDom?: string | string[]): MutationObserver | void
  public cancel (): void
}
declare const makeTrackInfo: (type: string, info: any) => ItrackInfo

export interface ISupervisor {
  getPerformanceData: notSupportPromisifyFn | ((config?: Iconfig) => Promise<Iperformance | IAnyObj>);
  getMemory: notSupportFn | (() => Imemory);
  getTiming: notSupportFn | (() => Itiming);
  getSource: notSupportPromisifyFn | ((config?: Iconfig) => Promise<Isource>);
  getExecTiming: notSupportPromisifyFn | (() => Promise<Iexec>);
  mark: notSupportFn | ((tag: string) => void);
  clearPerformance: notSupportFn | (() => boolean);
  getSourceByDom: notSupportPromisifyFn | ((target: HTMLElement, sourceType?: string) => Promise<IAnyObj[]>);
  getEnvInfo: () => void | IenvInfo;
  getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj;
  setError: (err: IErrObj) => void;
  ObserveError: typeof ObserveError;
  makeTrackInfo: (type: string, info: any) => ItrackInfo;
}

declare namespace $sv {
  const getPerformanceData: notSupportPromisifyFn | ((config?: Iconfig) => Promise<Iperformance | IAnyObj>)
  const getMemory: notSupportFn | (() => Imemory)
  const getTiming: notSupportFn | (() => Itiming)
  const getSource: notSupportPromisifyFn | ((config?: Iconfig) => Promise<Isource>)
  const getExecTiming: notSupportPromisifyFn | (() => Promise<Iexec>)
  const mark: notSupportFn | ((tag: string) => void)
  const clearPerformance: notSupportFn | (() => boolean)
  const getSourceByDom: notSupportPromisifyFn | ((target: HTMLElement, sourceType?: string) => Promise<IAnyObj[]>)
  const getEnvInfo: () => void | IenvInfo
  const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
  const setError: (err: IErrObj) => void
  class ObserveError {
    public constructor (target: HTMLElement, observeDom?: string | string[])
    public init (target: HTMLElement, observeDom?: string | string[]): MutationObserver | void
    public cancel (): void
  }
  const makeTrackInfo: (type: string, info: any) => ItrackInfo
}

declare module 'fe-supervisor' {
  export default $sv
}

export { 
  getPerformanceData,
  getMemory,
  getTiming,
  getSource,
  getExecTiming,
  mark,
  clearPerformance,
  getSourceByDom,
  getEnvInfo,
  getError,
  setError,
  makeTrackInfo,
  $sv
}

export as namespace $sv