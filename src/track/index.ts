import { ItrackInfo } from '../index.d'
import { uuid, storage, catchError, getTs } from '../utils'

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
    const msg = `[SV - makeTrackInfo]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
    catchError('js', msg)
  } finally {
    return {
      ts: getTs(),
      type,
      info
    }
  }

}