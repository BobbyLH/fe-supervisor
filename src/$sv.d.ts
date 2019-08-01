declare namespace $sv {
  // performance
  type NA = 'N/A'
  type Timing = number | NA
  type TimingSource = Array<ItimingSource>
  type TimingExec = Array<ItimingExec>


  interface IAnyObj {
    [propName: string]: any;
  }

  interface IconfigSources {
    [propName: string]: string[];
  }

  interface Iwhitelist {
    api?: string[] | string;
    source?: string[] | string;
  }

  interface Iconfig {
    apiRatio?: number;
    sourceRatio?: number;
    apis?: string[] | string;
    sources?: IconfigSources | string[] | string;
    timeout?: number; // timeout threshold(millisecond) - default 2000
    whitelist?: Iwhitelist;
  }

  type PIconfig = Partial<Iconfig>

  interface Imemory {
    memory: number | NA;
    used: number | NA;
    total: number | NA;
  }

  interface Itiming {
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

  interface ItimingSource {
    name: string;
    duration: number;
    type: string;
  }

  interface ItimingExec {
    name: string;
    duration: number;
  }

  interface Isource {
    api_random: TimingSource;
    api_timeout: TimingSource;
    api_appoint: TimingSource;
    source_random: TimingSource;
    source_timeout: TimingSource;
    source_appoint: TimingSource;
  }

  interface Iexec {
    exec: TimingExec;
  }

  interface Iperformance extends Itiming, Isource, Iexec {
    memory: number | NA;
  }

  interface IGeneratorFn extends GeneratorFunction {
    readonly [Symbol.toStringTag]: 'GeneratorFunction';
    (): IterableIterator<any>;
  }

  type ClearType = 'source' | 'mark' | 'measure' | 'all'

  interface IobserveSourceOption {
    sourceType?: string;
    timeout?: number;
    whitelist?: Iwhitelist;
  }

  // error
  type ExceptionType = 'js' | 'api' | 'source'

  interface IErrObj extends IAnyObj {
    ts: number;
    type: ExceptionType;
    sourceType?: string;
    url: string;
    msg?: string;
    code_site?: string;
  }

  type IErrArr = IErrObj[]

  interface IErrTotalObj {
    jsErrors: IErrArr;
    apiErrors: IErrArr;
    sourceErrors: IErrArr;
  }

  // env
  interface IenvInfo {
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
  interface ItrackInfo {
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

  const getPerformanceData: (config?: Iconfig) => Promise<false | Iperformance | IAnyObj>
  const getMemory: () => false | Imemory
  const getTiming: () => false | Itiming
  const getSource: (config?: Iconfig) => Promise<false | Isource>
  const getExecTiming: () => Promise<false | Iexec>
  const mark: (tag: string) => boolean
  const clearPerformance: (clearType?: ClearType) => boolean
  const observeSource: (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption) => false | Observer
  const getEnvInfo: () => false | IenvInfo
  const getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj
  const setError: (err: IErrObj) => void
  const clearError: (type?: ExceptionType) => boolean
  const observeError: (target: HTMLElement, callback?: (dom: Node | HTMLElement, e: ErrorEvent) => any, observeDom?: string | string[]) => Observer
  const makeTrackInfo: (type: string, info: object) => ItrackInfo
  class SV {
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