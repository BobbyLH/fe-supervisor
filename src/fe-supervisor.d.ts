declare module 'fe-supervisor' {
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

  export interface Iwhitelist {
    api?: string[] | string;
    source?: string[] | string;
  }

  export interface Iconfig {
    apiRatio?: number;
    sourceRatio?: number;
    apis?: string[] | string;
    sources?: IconfigSources | string[] | string;
    timeout?: number; // timeout threshold(millisecond) - default 2000
    whitelist?: Iwhitelist;
    paintTiming?: boolean;
  }

  export type PIconfig = Partial<Iconfig>

  export interface Imemory {
    memory: number | NA;
    used: number | NA;
    total: number | NA;
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
    network_response: Timing;
    network_interact: Timing;
    dom_loading: Timing;
    dom_interact: Timing;
    dom_ready: Timing;
    dom_load: Timing;
    dom_complete: Timing;
    js_ready: Timing;
    js_load: Timing;
    js_complete: Timing;
    render_ready: Timing;
    render_load: Timing;
    total: Timing;
  }

  export interface ItimingSource {
    name: string;
    duration: number;
    type: string;
    startTime?: number;
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
    others: TimingSource;
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

  export type ClearType = 'source' | 'mark' | 'measure' | 'all'

  export interface IobserveSourceOption {
    sourceType?: string;
    timeout?: number;
    whitelist?: Iwhitelist;
  }

  // error
  export type ExceptionType = 'js' | 'api' | 'source'

  export interface IErrObj extends IAnyObj {
    ts: number;
    type: ExceptionType;
    sourceType?: string;
    url: string;
    msg?: string;
    code_site?: string;
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
    os: '' | 'windows' | 'mac' | 'android' | 'ios';
    browser: '' | 'weixin' | 'weibo_sina' | 'weibo_qq' | 'facebook' | 'twitter' | 'instagram' | 'chrome' | 'firefox' | 'ie' | 'edge' | 'opera' | 'safari' | '360' | 'qq' | 'uc' | 'baidu' | 'sougou' | 'liebao' | 'webkit';
    screen_size: string;
    referer: string;
    page_url: string;
    device: 'mobile' | 'pc';
    ua: string;
  }

  //track
  export interface ItrackInfo {
    ts: number;
    type: string;
    info: object;
  }

  class Observer {
    public constructor (target: HTMLElement, callback: (doms: MutationRecord[]) => any);
    public init (target: HTMLElement, callback: (doms: MutationRecord[]) => any): MutationObserver | null;
    public cancel (): void;
    public setCache (cache: IAnyObj): void;
    public getCache (): IAnyObj[];
    public clearCache (): void;
  }

  export const getPerformanceData: (config?: Iconfig) => Promise<false | Iperformance | IAnyObj>
  export const getMemory: () => false | Imemory
  export const getTiming: () => false | Itiming
  export const getSource: (config?: Iconfig) => Promise<false | Isource>
  export const getExecTiming: () => Promise<false | Iexec>
  export const mark: (tag: string) => boolean
  export const clearPerformance: (clearType?: ClearType) => boolean
  export const observeSource: (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption) => false | Observer
  export const getEnvInfo: () => false | IenvInfo
  export const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
  export const setError: (err: IErrObj) => void
  export const clearError: (type?: ExceptionType) => boolean
  export const observeError: (target: HTMLElement, callback?: (dom: Node | HTMLElement, e: ErrorEvent) => any, observeDom?: string | string[]) => Observer
  export const makeTrackInfo: (type: string, info: object) => ItrackInfo
  export class SV {
    public constructor (config?: Iconfig);
    public updateConfig (newConfig: PIconfig): void;
    public getMemory (): false | Imemory;
    public getTiming (): false | Itiming;
    public getSource (): Promise<false | Isource>;
    public getExecTiming(): Promise<false | Iexec>;
    public getPerformanceData (): Promise<false | Iperformance | IAnyObj>;
    public clearPerformance (clearType?: ClearType): boolean;
    public observeSource (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption): false | Observer;
  }
}