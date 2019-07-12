import { describe, it } from 'mocha'
import { expect } from 'chai'
import { makeTrackInfo } from '../index'
import { storage } from 'peeler-js'

describe('track test module', function () {
  it('makeTrackInfo - uv', function () {
    const trackInfo = makeTrackInfo('uv', { msg: 'test msg uv' })
    expect(makeTrackInfo).to.be.a('function')
    expect(trackInfo).to.be.an('object')
    expect(trackInfo).to.have.property('info').to.be.an('object').to.have.property('msg').to.be.equal('test msg uv')
    expect(trackInfo).to.have.property('ts').to.be.a('number')
    expect(trackInfo).to.have.property('type').to.be.a('string').to.equal('uv')
  })

  it('makeTrackInfo - pv', function () {
    const uuid = storage.get('uuid', 'cookie')
    const trackInfo = makeTrackInfo('pv', { msg: 'test msg pv' })
    const type = trackInfo.type
    expect(makeTrackInfo).to.be.a('function')
    expect(trackInfo).to.be.an('object')
    expect(trackInfo).to.have.property('info').to.be.an('object').to.have.property('msg').to.be.equal('test msg pv')
    expect(trackInfo).to.have.property('ts').to.be.a('number')
    expect(trackInfo).to.have.property('type').to.be.a('string')
    if (uuid) {
      expect(type).to.equal('pv')
    } else {
      expect(type).to.equal('uv')
    }
  })
})