import 'mocha'
import { expect } from 'chai'
import catchError from '../catchError'
import logger from '../logger'
import { notSupport, notSupportPromisify } from '../notSupport'
import Observer from '../Observer'

describe('catchError\'s test module', function () {
  it('catchError is a function', function () {
    expect(catchError).to.be.a('function')
  })
})

describe('logger\'s test module', function () {
  it('logger is a function', function () {
    expect(logger).to.be.a('function')
  })
})

describe('notSupport\'s test module', function () {
  it('notSupport is a function', function () {
    expect(notSupport).to.be.a('function')
  })
  it('call notSupport return false', function () {
    expect(notSupport()).to.be.false
  })
})

describe('notSupportPromisify\'s test module', function () {
  it('notSupportPromisify is a function', function () {
    expect(notSupportPromisify).to.be.a('function')
    expect(notSupportPromisify()).to.be.a('promise')
  })
  it('call notSupportPromisify return promise', function (done) {
    expect(notSupportPromisify()).to.be.a('promise')
    notSupportPromisify().then(res => {
      expect(res).to.be.false
      done()
    })
  })
})

describe('Observer\'s test module', function () {
  it('Observer is a class', function () {
    expect(Observer).to.be.a('function')
  })
  it('Observer prototype check', function () {
    expect(Observer).to.have.property('prototype')
    const proto = Observer.prototype
    expect(proto).to.have.property('init').to.be.a('function')
    expect(proto).to.have.property('cancel').to.be.a('function')
    expect(proto).to.have.property('setCache').to.be.a('function')
    expect(proto).to.have.property('getCache').to.be.a('function')
    expect(proto).to.have.property('clearCache').to.be.a('function')
  })
})