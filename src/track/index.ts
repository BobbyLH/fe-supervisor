import { ItrackInfo } from '../index.d'
import { uuid, storage } from '../utils'
import { setError } from '../error'

export function makeTrackInfo (type: string, info: object): ItrackInfo {
  try {
    if (type === 'pv') {
      const guid = storage.get('uuid', 'cookie')
      if (!guid) {
        type = 'uv'
        storage.set('uuid', uuid(), 'cookie', { expires: 86400 })
      }
    }
  } catch (error) {
    setError({
      ts: +Date.now(),
      type: 'js',
      url: location.href,
      msg: `[SV - makeTrackInfo]: ${JSON.stringify(error)}`
    })
  } finally {
    return {
      ts: +Date.now(),
      type,
      info
    }
  }

}