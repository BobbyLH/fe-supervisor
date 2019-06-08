import { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance } from './performance'
import { IAnyObj, Isources, Iconfig, Imemory, Itiming, Isource, Iexec, Iperformance } from './performance'
import { getEnvInfo, IenvInfo } from './env'
import { getError, setError, ObserveError } from './error'
import { makeTrackInfo } from './track'
import { Class } from 'estree';

export { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance } from './performance'
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
  clearPerformance: Function;
  getEnvInfo: () => void | (() => IenvInfo);
  getError: Function;
  setError: Function;
  ObserveError: Function;
  makeTrackInfo: Function;
}

const Supervisor: ISupervisor = {
  getPerformanceData,
  getMemory,
  getTiming,
  getSource,
  getExecTiming,
  mark,
  clearPerformance,
  getEnvInfo,
  getError,
  setError,
  ObserveError,
  makeTrackInfo
}

export default Supervisor