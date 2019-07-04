import { describe, it } from 'mocha'
import { expect } from 'chai'
import { makeTrackInfo } from '../index'

describe('track test module', function () {
  it('makeTrackInfo', function () {
    const trackInfo = makeTrackInfo('uv', {})
    expect(makeTrackInfo).to.be.a('function')
    expect(trackInfo).to.be.an('object')
    // expect(trackInfo).to.have.property('info').to.be.an('object')
    // expect(trackInfo).to.have.property('ts').to.be.a('number')
    // expect(trackInfo).to.have.property('type').to.be.a('string')
  })
})