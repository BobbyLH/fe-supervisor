import { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, getSourceByDom } from './performance'
import { getEnvInfo } from './env'
import { getError, setError, clearError, ObserveError } from './error'
import { makeTrackInfo } from './track'
import { ISupervisor } from './index.d'

export { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, getSourceByDom } from './performance'
export { getEnvInfo } from './env'
export { getError, setError, clearError, ObserveError } from './error'
export { makeTrackInfo } from './track'

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
  clearError,
  ObserveError,
  makeTrackInfo
}

export default Supervisor