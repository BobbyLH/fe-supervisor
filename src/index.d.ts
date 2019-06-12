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
  wscreen: Timing;
  fscreen: Timing;
  network: Timing;
  network_prev: Timing;
  network_redirect: Timing;
  network_dns: Timing;
  network_tcp: Timing;
  network_request: Timing;
  render_ready: Timing;
  render_load: Timing;
  total: Timing;
}

export interface Isource {
  api_random: TimingArr;
  api_timeout: TimingArr;
  api_appoint: TimingArr;
  source_random: TimingArr;
  source_timeout: TimingArr;
  source_appoint: TimingArr;
}

export interface Iexec {
  exec: TimingArr;
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

export interface IErrObj extends IAnyObj {
  ts: number;
  type: ExceptionType;
  sourceType?: string;
  url: string;
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
export interface ItrackInfo {
  ts: number;
  type: string;
  info: object;
}

// declare
declare const getPerformanceData: (config?: Iconfig) => Promise<false | Iperformance | IAnyObj>
declare const getMemory: () => false | Imemory
declare const getTiming: () => false | Itiming
declare const getSource: (config?: Iconfig) => Promise<false | Isource>
declare const getExecTiming: () => Promise<false | Iexec>
declare const mark: (tag: string) => boolean
declare const clearPerformance: () => boolean
declare const getSourceByDom: (target: HTMLElement, sourceType?: string) => Promise<false | IAnyObj[]>
declare const getEnvInfo: () => false | IenvInfo
declare const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
declare const setError: (err: IErrObj) => void
declare const clearError: (type?: ExceptionType) => boolean
declare class ObserveError {
  public constructor (target: HTMLElement, observeDom?: string | string[])
  public init (target: HTMLElement, observeDom?: string | string[]): MutationObserver | void
  public cancel (): void
}
declare const makeTrackInfo: (type: string, info: object) => ItrackInfo

export interface ISupervisor {
  getPerformanceData: (config?: Iconfig) => Promise<false | Iperformance | IAnyObj>;
  getMemory: () => false | Imemory;
  getTiming: () => false | Itiming;
  getSource: (config?: Iconfig) => Promise<false | Isource>;
  getExecTiming: () => Promise<false | Iexec>;
  mark: (tag: string) => boolean;
  clearPerformance: () => boolean;
  getSourceByDom: (target: HTMLElement, sourceType?: string) => Promise<false | IAnyObj[]>;
  getEnvInfo: () => false | IenvInfo;
  getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj;
  setError: (err: IErrObj) => void;
  clearError: (type?: ExceptionType) => boolean;
  ObserveError: typeof ObserveError;
  makeTrackInfo: (type: string, info: object) => ItrackInfo;
}

declare namespace $sv {
  const getPerformanceData: (config?: Iconfig) => Promise<false | Iperformance | IAnyObj>
  const getMemory: () => false | Imemory
  const getTiming: () => false | Itiming
  const getSource: (config?: Iconfig) => Promise<false | Isource>
  const getExecTiming: () => Promise<false | Iexec>
  const mark: (tag: string) => boolean
  const clearPerformance: () => boolean
  const getSourceByDom: (target: HTMLElement, sourceType?: string) => Promise<false | IAnyObj[]>
  const getEnvInfo: () => false | IenvInfo
  const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
  const setError: (err: IErrObj) => void
  const clearError: (type?: ExceptionType) => boolean
  class ObserveError {
    public constructor (target: HTMLElement, observeDom?: string | string[])
    public init (target: HTMLElement, observeDom?: string | string[]): MutationObserver | void
    public cancel (): void
  }
  const makeTrackInfo: (type: string, info: object) => ItrackInfo
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
  clearError,
  makeTrackInfo,
  $sv
}

export as namespace $sv