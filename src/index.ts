import { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, getSourceByDom } from './performance'
import { IAnyObj, Iconfig, Imemory, Itiming, Isource, Iexec, Iperformance } from './performance'
import { getEnvInfo, IenvInfo } from './env'
import { getError, setError, ObserveError } from './error'
import { ExceptionType, IErrObj, IErrTotalObj } from './error/Exception'
import { makeTrackInfo, ItrackInfo } from './track'

export { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, getSourceByDom } from './performance'
export { getEnvInfo } from './env'
export { getError, setError, ObserveError } from './error'
export { makeTrackInfo } from './track'

type notSupportFn = () => false

interface ISupervisor {
  getPerformanceData: notSupportFn | ((config?: Iconfig) => Promise<Iperformance | IAnyObj>);
  getMemory: notSupportFn | (() => Imemory);
  getTiming: notSupportFn | (() => Itiming);
  getSource: notSupportFn | ((config?: Iconfig) => Promise<Isource>);
  getExecTiming: notSupportFn | (() => Promise<Iexec>);
  mark: notSupportFn | ((tag: string) => void);
  clearPerformance: notSupportFn | (() => boolean);
  getSourceByDom: notSupportFn | ((target: HTMLElement, sourceType: string) => Promise<IAnyObj[]>);
  getEnvInfo: () => void | (() => IenvInfo);
  getError: (type?: ExceptionType) => IErrObj[] | IErrTotalObj;
  setError: (err: IErrObj) => void;
  ObserveError: typeof ObserveError;
  makeTrackInfo: (type: string, info: any) => ItrackInfo;
}

const Supervisor: ISupervisor = {
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
  ObserveError,
  makeTrackInfo
}

export default Supervisor