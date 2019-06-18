import { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, observeSource, SV } from './performance'
import { getEnvInfo } from './env'
import { getError, setError, clearError, observeError } from './error'
import { makeTrackInfo } from './track'
import { ISupervisor } from './index.d'

export { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, observeSource, SV } from './performance'
export { getEnvInfo } from './env'
export { getError, setError, clearError, observeError } from './error'
export { makeTrackInfo } from './track'

const Supervisor: ISupervisor = {
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
  observeError,
  makeTrackInfo,
  SV
}

export default Supervisor