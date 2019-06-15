import { Observer } from './utils'

// performance
export type NA = 'N/A'
export type Timing = number | NA
export type TimingSource = Array<ItimingSource>
export type TimingExec = Array<ItimingExec>


export interface IAnyObj {
  [propName: string]: any;
}

export interface IconfigSources {
  [propName: string]: string[];
}

export interface Iconfig {
  apiRatio?: number;
  sourceRatio?: number;
  apis?: string[] | string;
  sources?: IconfigSources | string[] | string;
  timeout?: number; // timeout threshold(millisecond) - default 2000
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

export interface ItimingSource {
  name: string;
  duration: number;
  type: string;
}

export interface ItimingExec {
  name: string;
  duration: number;
}

export interface Isource {
  api_random: TimingSource;
  api_timeout: TimingSource;
  api_appoint: TimingSource;
  source_random: TimingSource;
  source_timeout: TimingSource;
  source_appoint: TimingSource;
}

export interface Iexec {
  exec: TimingExec;
}

export interface Iperformance extends Itiming, Isource, Iexec {
  memory: number | NA;
}

export interface IGeneratorFn extends GeneratorFunction {
  readonly [Symbol.toStringTag]: 'GeneratorFunction';
  (): IterableIterator<any>;
}

export type ClearType = 'source' | 'mark' | 'all'

export interface IobserveSourceOption {
  sourceType?: string;
  timeout?: number;
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
declare const clearPerformance: (clearType?: ClearType) => boolean
declare const observeSource: (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption) => Promise<false> | Observer
declare const getEnvInfo: () => false | IenvInfo
declare const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
declare const setError: (err: IErrObj) => void
declare const clearError: (type?: ExceptionType) => boolean
declare const observeError: (target: HTMLElement, callback?: (dom: Node | HTMLElement, e: ErrorEvent) => any, observeDom?: string | string[]) => Observer
declare const makeTrackInfo: (type: string, info: object) => ItrackInfo

export interface ISupervisor {
  getPerformanceData: (config?: Iconfig) => Promise<false | Iperformance | IAnyObj>;
  getMemory: () => false | Imemory;
  getTiming: () => false | Itiming;
  getSource: (config?: Iconfig) => Promise<false | Isource>;
  getExecTiming: () => Promise<false | Iexec>;
  mark: (tag: string) => boolean;
  clearPerformance: (clearType?: ClearType) => boolean;
  observeSource: (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption) => Promise<false> | Observer;
  getEnvInfo: () => false | IenvInfo;
  getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj;
  setError: (err: IErrObj) => void;
  clearError: (type?: ExceptionType) => boolean;
  observeError: (target: HTMLElement, callback?: (dom: Node | HTMLElement, e: ErrorEvent) => any, observeDom?: string | string[]) => Observer;
  makeTrackInfo: (type: string, info: object) => ItrackInfo;
}

declare namespace $sv {
  const getPerformanceData: (config?: Iconfig) => Promise<false | Iperformance | IAnyObj>
  const getMemory: () => false | Imemory
  const getTiming: () => false | Itiming
  const getSource: (config?: Iconfig) => Promise<false | Isource>
  const getExecTiming: () => Promise<false | Iexec>
  const mark: (tag: string) => boolean
  const clearPerformance: (clearType?: ClearType) => boolean
  const observeSource: (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption) => Promise<false> | Observer
  const getEnvInfo: () => false | IenvInfo
  const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
  const setError: (err: IErrObj) => void
  const clearError: (type?: ExceptionType) => boolean
  const observeError: (target: HTMLElement, callback?: (dom: Node | HTMLElement, e: ErrorEvent) => any, observeDom?: string | string[]) => Observer
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
  observeSource,
  getEnvInfo,
  getError,
  setError,
  clearError,
  makeTrackInfo,
  $sv
}

export as namespace $sv