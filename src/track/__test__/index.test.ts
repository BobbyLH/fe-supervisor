import { describe, it } from 'mocha'
import { expect } from 'chai'
import { makeTrackInfo } from '../index'

describe('track test module', function () {
  it('makeTrackInfo', function () {
    expect(makeTrackInfo).to.be.a('function')
    expect(makeTrackInfo('uv', {})).to.be.an('object')
  })
})