import { ItrackInfo } from '../index.d'
import { uuid, storage } from '../utils'

export function makeTrackInfo (type: string, info: object): ItrackInfo {
  if (type === 'pv') {
    const guid = storage.get('uuid', 'cookie')
    if (!guid) {
      type = 'uv'
      storage.set('uuid', uuid(), 'cookie', { expires: 86400 })
    }
  }

  return {
    ts: +Date.now(),
    type,
    info
  }
}