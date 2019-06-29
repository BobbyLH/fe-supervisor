import 'mocha'
import { expect } from 'chai'
import { getMemory, getTiming, getSource, getExecTiming, getPerformanceData, mark, clearPerformance, observeSource, SV } from '../index'

describe('Performance test module', function () {
  if (typeof window === 'undefined') {
    it('In node env', function () {
      expect(getMemory).to.be.a('function')
      expect(getMemory()).to.be.false
      expect(getTiming).to.be.a('function')
      expect(getTiming()).to.be.false
      expect(getSource).to.be.a('function')
      expect(getExecTiming).to.be.a('function')
      expect(getPerformanceData).to.be.a('function')
      expect(mark).to.be.a('function')
      expect(mark('test')).to.be.false
      expect(clearPerformance).to.be.a('function')
      expect(clearPerformance()).to.be.false
      expect(observeSource).to.be.a('function')
      expect(SV).to.be.a('function')
      expect(new SV()).to.be.an('object')
    })
  } else {
    it('In browser env', function () {
      
    })
  }
})