import 'mocha'
import { expect } from 'chai'
import addListener from '../addListener'
import catchError from '../catchError'
import compatCheck from '../compatCheck'
import getTs from '../getTs'
import getType from '../getType'
import isType from '../isType'
import logger from '../logger'
import { notSupport, notSupportPromisify } from '../notSupport'
import Observer from '../Observer'
import parseUrl from '../parseUrl'
import removeListener from '../removeListener'
import storage from '../storage'
import timeslice from '../timeslice'
import uuid from '../uuid'

describe('addListener\'s test module', function () {
  it('addListener is a function', function () {
    expect(addListener).to.be.a('function')
  })
})

describe('getType\'s test module', function () {
  it('getType - string', function () {
    expect(getType('test')).to.be.equal('string')
    expect(getType(new String(123))).to.be.equal('string')
  })
  it('getType - number', function () {
    expect(getType(123)).to.be.equal('number')
    expect(getType(new Number(123))).to.be.equal('number')
  })
  it('getType - boolean', function () {
    expect(getType(false)).to.be.equal('boolean')
    expect(getType(new Boolean(1))).to.be.equal('boolean')
  })
  it('getType - null', function () {
    expect(getType(null)).to.be.equal('null')
  })
  it('getType - undefined', function () {
    expect(getType(undefined)).to.be.equal('undefined')
  })
  it('getType - symbol', function () {
    expect(getType(Symbol(123))).to.be.equal('symbol')
  })
  it('getType - function', function () {
    expect(getType(function () {})).to.be.equal('function')
    expect(getType(() => {})).to.be.equal('function')
    expect(getType(new Function())).to.be.equal('function')
  })
  it('getType - array', function () {
    expect(getType([])).to.be.equal('array')
    expect(getType(new Array(0))).to.be.equal('array')
  })
  it('getType - object', function () {
    expect(getType({})).to.be.equal('object')
    expect(getType(new Object())).to.be.equal('object')
    expect(getType(Object.create(null))).to.be.equal('object')
  })
})

describe('removeListener\'s test module', function () {
  it('removeListener is a function', function () {
    expect(removeListener).to.be.a('function')
  })
})