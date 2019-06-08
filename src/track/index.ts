import { getEnvInfo, IenvInfo } from '../env'
import { uuid, storage } from '../utils'

interface Iprops {
  type: string;
  info: any;
}

export interface ItrackInfo {
  general: IenvInfo | void;
  props: Iprops;
}

export function makeTrackInfo (type: string, info: any): ItrackInfo {
  const envInfo = getEnvInfo()
  if (type === 'pv') {
    const guid = storage.get('uuid', 'cookie')
    if (!guid) {
      type = 'uv'
      storage.set('uuid', uuid(), 'cookie', { expires: 86400 })
    }
  }

  return {
    general: envInfo,
    props: {
      type,
      info
    }
  }
}