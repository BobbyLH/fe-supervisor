import 'mocha'
import { expect } from 'chai'
import { setError, getError, clearError, observeError } from '../index'

describe('Error handles(set, get, clear) test module', function () {
  function mockErrors () {
    setError({
      type: 'js',
      url: 'hupu.com',
      ts: +Date.now()
    })
    setError({
      type: 'api',
      url: 'hupu.com/api',
      ts: +Date.now()
    })
    setError({
      type: 'source',
      url: 'hupu.com/img.png',
      sourceType: 'img',
      ts: +Date.now()
    })
  }
  mockErrors()

  it('Method type checking', function () {
    expect(setError).to.be.a('function')
    expect(getError).to.be.a('function')
    expect(clearError).to.be.a('function')
  })

  it('Errors checking', function () {
    const errors = getError()
    const { jsErrors, apiErrors, sourceErrors } = errors

    const jsErr = getError('js')
    const apiErr = getError('api')
    const sourceErr = getError('source')
    
    expect(errors).to.be.an('object')
    expect(errors).to.have.property('jsErrors')
    expect(errors).to.have.property('apiErrors')
    expect(errors).to.have.property('sourceErrors')
    expect(jsErrors).to.be.an('array').to.have.lengthOf(1)
    expect(apiErrors).to.be.an('array').to.have.lengthOf(1)
    expect(sourceErrors).to.be.an('array').to.have.lengthOf(1)
    expect(jsErrors[0]).to.have.property('type').to.be.a('string').to.eql('js')
    expect(apiErrors[0]).to.have.property('type').to.be.a('string').to.eql('api')
    expect(sourceErrors[0]).to.have.property('type').to.be.a('string').to.eql('source')

    expect(jsErr).to.be.an('array').to.have.lengthOf(1)
    expect(apiErr).to.be.an('array').to.have.lengthOf(1)
    expect(sourceErr).to.be.an('array').to.have.lengthOf(1)
    expect(jsErr[0]).to.have.property('type').to.be.a('string').to.eql('js')
    expect(apiErr[0]).to.have.property('type').to.be.a('string').to.eql('api')
    expect(sourceErr[0]).to.have.property('type').to.be.a('string').to.eql('source')
  })

  it('Clear checking', function () {
    clearError('js')
    let jsErr = getError('js')
    let apiErr = getError('api')
    let sourceErr = getError('source')
    expect(jsErr).to.be.an('array').to.have.lengthOf(0)
    expect(apiErr).to.be.an('array').to.have.lengthOf(1)
    expect(sourceErr).to.be.an('array').to.have.lengthOf(1)
    expect(apiErr[0]).to.have.property('type').to.be.a('string').to.eql('api')
    expect(sourceErr[0]).to.have.property('type').to.be.a('string').to.eql('source')

    clearError('api')
    apiErr = getError('api')
    sourceErr = getError('source')
    expect(apiErr).to.be.an('array').to.have.lengthOf(0)
    expect(sourceErr).to.be.an('array').to.have.lengthOf(1)
    expect(sourceErr[0]).to.have.property('type').to.be.a('string').to.eql('source')

    clearError('source')
    sourceErr = getError('source')
    expect(sourceErr).to.be.an('array').to.have.lengthOf(0)

    mockErrors()
    jsErr = getError('js')
    apiErr = getError('api')
    sourceErr = getError('source')
    expect(jsErr).to.be.an('array').to.have.lengthOf(1)
    expect(apiErr).to.be.an('array').to.have.lengthOf(1)
    expect(sourceErr).to.be.an('array').to.have.lengthOf(1)
    expect(jsErr[0]).to.have.property('type').to.be.a('string').to.eql('js')
    expect(apiErr[0]).to.have.property('type').to.be.a('string').to.eql('api')
    expect(sourceErr[0]).to.have.property('type').to.be.a('string').to.eql('source')

    clearError()
    jsErr = getError('js')
    apiErr = getError('api')
    sourceErr = getError('source')
    expect(jsErr).to.be.an('array').to.have.lengthOf(0)
    expect(apiErr).to.be.an('array').to.have.lengthOf(0)
    expect(sourceErr).to.be.an('array').to.have.lengthOf(0)
  })
})