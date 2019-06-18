import { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, observeSource } from './performance'
import { getEnvInfo } from './env'
import { getError, setError, clearError, observeError } from './error'
import { makeTrackInfo } from './track'
import { Iconfig, ClearType, IAnyObj, IobserveSourceOption, ISupervisor } from './index.d'

export { getPerformanceData, getMemory, getTiming, getSource, getExecTiming, mark, clearPerformance, observeSource } from './performance'
export { getEnvInfo } from './env'
export { getError, setError, clearError, observeError } from './error'
export { makeTrackInfo } from './track'


export class SV {
  private config: Iconfig | undefined
  public constructor (config?: Iconfig) {
    this.config = config
  }

  public getMemory () {
    return getMemory()
  }

  public getTiming () {
    return getTiming()
  }

  public async getSource () {
    return await getSource(this.config)
  }

  public async getExecTiming () {
    return await getExecTiming()
  }

  public async getPerformanceData () {
    return getPerformanceData(this.config)
  }

  public clearPerformance (clearType?: ClearType) {
    return clearPerformance(clearType)
  }

  public observeSource (target: HTMLElement, callback: (source_appoint: IAnyObj[]) => any, option?: IobserveSourceOption) {
    if (this.config && this.config.timeout) {
      option = { timeout: this.config.timeout, ...option }
    }

    return observeSource(target, callback, option)
  }
}

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