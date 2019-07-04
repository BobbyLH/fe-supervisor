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

describe('catchError\'s test module', function () {
  it('catchError is a function', function () {
    expect(catchError).to.be.a('function')
  })
})

describe('compatCheck\'s test module', function () {
  it('compatCheck is a function', function () {
    expect(compatCheck).to.be.a('function')
  })
  it('call compatCheck return boolean', function () {
    expect(compatCheck('promise')).to.be.true
    expect(compatCheck('generator')).to.be.true
    expect(compatCheck('async')).to.be.true
  })
})

describe('getTs\'s test module', function () {
  it('getTs is a function', function () {
    expect(getTs).to.be.a('function')
  })
  it('call getTs return a timestamp', function () {
    expect(getTs()).to.be.a('number')
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
  it('getType - date', function () {
    expect(getType(new Date())).to.be.equal('date')
  })
  it('getType - regexp', function () {
    expect(getType(/test/)).to.be.equal('regexp')
    expect(getType(new RegExp('test'))).to.be.equal('regexp')
  })
  it('getType - object', function () {
    expect(getType({})).to.be.equal('object')
    expect(getType(new Object())).to.be.equal('object')
    expect(getType(Object.create(null))).to.be.equal('object')
  })
})

describe('isType\'s test module', function () {
  it('isType - string', function () {
    expect(isType('string')('test')).to.be.true
    expect(isType('string')(new String(123))).to.be.true
  })
  it('isType - number', function () {
    expect(isType('number')(123)).to.be.true
    expect(isType('number')(new Number(123))).to.be.true
  })
  it('isType - boolean', function () {
    expect(isType('boolean')(false)).to.be.true
    expect(isType('boolean')(new Boolean(1))).to.be.true
  })
  it('isType - null', function () {
    expect(isType('null')(null)).to.be.true
  })
  it('isType - undefined', function () {
    expect(isType('undefined')(undefined)).to.be.true
  })
  it('isType - symbol', function () {
    expect(isType('symbol')(Symbol(123))).to.be.true
  })
  it('isType - function', function () {
    expect(isType('function')(function () {})).to.be.true
    expect(isType('function')(() => {})).to.be.true
    expect(isType('function')(new Function())).to.be.true
  })
  it('isType - array', function () {
    expect(isType('array')([])).to.be.true
    expect(isType('array')(new Array(0))).to.be.true
  })
  it('isType - date', function () {
    expect(isType('date')(new Date())).to.be.true
  })
  it('isType - regexp', function () {
    expect(isType('regexp')(/test/)).to.be.true
    expect(isType('regexp')(new RegExp('test'))).to.be.true
  })
  it('isType - object', function () {
    expect(isType('object')({})).to.be.true
    expect(isType('object')(new Object())).to.be.true
    expect(isType('object')(Object.create(null))).to.be.true
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

describe('parseUrl\'s test module', function () {
  it('parseUrl is a function', function () {
    expect(parseUrl).to.be.a('function')
  })
  const url = 'https://www.baidu.com:3020/test/user?uid=55598&tid=12345#20Addon%20'
  if (typeof window === 'undefined') {
    it('call parseUrl in node env', function () {
      expect(parseUrl(url)).to.be.equal(url)
    })
  } else {
    it('call parseUrl in browser env', function () {
      const parseParams = parseUrl(url)
      expect(parseParams).to.be.an('object')
      expect(parseParams).to.have.property('hash').to.equal('#20Addon%20')
      expect(parseParams).to.have.property('host').to.equal('www.baidu.com:3020')
      expect(parseParams).to.have.property('hostname').to.equal('www.baidu.com')
      expect(parseParams).to.have.property('href').to.equal(url)
      expect(parseParams).to.have.property('origin').to.equal('https://www.baidu.com:3020')
      expect(parseParams).to.have.property('pathname').to.equal('/test/user')
      expect(parseParams).to.have.property('port').to.equal('3020')
      expect(parseParams).to.have.property('protocol').to.equal('https:')
      expect(parseParams).to.have.property('search').to.equal('?uid=55598&tid=12345')
    })
  }

})

describe('storage\'s test module', function () {
  it('storage is a object', function () {
    expect(storage).to.be.an('object')
    expect(storage).to.have.property('get').to.be.a('function')
    expect(storage).to.have.property('set').to.be.a('function')
    expect(storage).to.have.property('clear').to.be.a('function')
  })

  if (typeof window === 'undefined') {
    it('call storage in node env', function () {
      expect(storage.set('test', 123)).to.be.false
      expect(storage.get('test')).to.be.equal(null)
      expect(storage.clear('test')).to.be.false
    })
  } else {
    it('call storage in browser env - without params', function (done) {
      expect(storage.set('test', 123)).to.be.true
      expect(storage.get('test')).to.be.equal('123')
      expect(storage.clear('test')).to.be.true
      done()
    })
    it('call storage in browser env - cookie', function (done) {
      expect(storage.set('test', 456, 'cookie', { domain: 'localhost', expires: 10000 })).to.be.true
      expect(storage.get('test', 'cookie')).to.be.equal('456')
      expect(storage.clear('test', 'cookie', 'localhost')).to.be.true
      done()
    })
    it('call storage in browser env - localStorage', function (done) {
      expect(storage.set('test', 789, 'localStorage')).to.be.true
      expect(storage.get('test', 'localStorage')).to.be.equal('789')
      expect(storage.clear('test', 'localStorage')).to.be.true
      done()
    })
    it('call storage in browser env - sessionStorage', function (done) {
      expect(storage.set('test', 999, 'sessionStorage')).to.be.true
      expect(storage.get('test', 'sessionStorage')).to.be.equal('999')
      expect(storage.clear('test', 'sessionStorage')).to.be.true
      done()
    })
  }
})

describe('timeslice\'s test module', function () {
  it('timeslice is a function', function () {
    expect(timeslice).to.be.a('function')
  })

  it('call timeslice return a promise', function (done) {
    function* gen () {
      const arr: number[] = Array.apply(null, ({ length: 50000 } as any)).map((v: unknown, k: number) => k)
      const len = arr.length
      for (let i = 0; i < len; i++) {
        if (arr[i] % 5000 === 0) {
          console.info(arr[i])
        }
        yield
      }
      done()
    }
    expect(timeslice(gen as any)).to.be.a('promise')
  })
})

describe('uuid\'s test module', function () {
  it('uuid is a function', function () {
    expect(uuid).to.be.a('function')
  })
  it('call uuid return a uuid', function () {
    expect(uuid()).to.be.a('string').to.be.lengthOf(36)
  })
})

describe('removeListener\'s test module', function () {
  it('removeListener is a function', function () {
    expect(removeListener).to.be.a('function')
  })
})