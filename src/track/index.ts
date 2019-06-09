import { ItrackInfo } from '../index.d'
import { getEnvInfo } from '../env'
import { uuid, storage } from '../utils'

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