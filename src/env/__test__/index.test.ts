import 'mocha'
import { expect } from 'chai'
import { getEnvInfo } from '../index'

describe('getEnvInfo test module', function () {
  if (typeof window === 'undefined') {
    it('In node env', function () {
      expect(getEnvInfo).to.be.a('function')
      expect(getEnvInfo()).to.be.false
    })
  } else {
    it('In browser env', function () {
      expect(getEnvInfo).to.be.a('function')
      const env = getEnvInfo()
      if (env) {
        expect(env).to.be.an('object')
        expect(env).to.have.property('ts').to.be.a('number')
        expect(env).to.have.property('os').to.be.a('string')
        expect(env).to.have.property('browser').to.be.a('string')
        expect(env).to.have.property('screen_size').to.be.a('string')
        expect(env).to.have.property('page_url').to.be.a('string')
        expect(env).to.have.property('referer').to.be.a('string')
        expect(env).to.have.property('device').to.be.a('string')
        expect(env).to.have.property('ua').to.be.a('string')
      }
    })
  }
})