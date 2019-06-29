import { describe, it } from 'mocha'
import { expect } from 'chai'
import { getMemory, getTiming, getSource, getExecTiming, getPerformanceData, mark, clearPerformance, observeSource, SV } from '../index'

describe('Performance test module', function () {
  if (typeof window === 'undefined') {
    describe('In node env', function () {
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
    describe('In browser env', function () {
      it('getMemory', function () {
        const memory = getMemory()
        if (!memory) return expect(memory).to.be.false

        expect(memory).to.be.an('object')
        if (memory.memory !== 'N/A') {
          expect(memory).to.have.property('memory').to.be.a('number')
          expect(memory).to.have.property('used').to.be.a('number')
          expect(memory).to.have.property('total').to.be.a('number')
        } else {
          expect(memory).to.have.property('memory').to.be.eql('N/A')
          expect(memory).to.have.property('used').to.be.eql('N/A')
          expect(memory).to.have.property('total').to.be.eql('N/A')
        }

      })

      it('getTiming', function () {
        const timing = getTiming()
        expect(timing).to.be.an('object')
        expect(timing).to.have.property('wscreen').to.be.a('number')
        expect(timing).to.have.property('fscreen').to.be.a('number')
        expect(timing).to.have.property('network').to.be.a('number')
        expect(timing).to.have.property('network_prev').to.be.a('number')
        expect(timing).to.have.property('network_redirect').to.be.a('number')
        expect(timing).to.have.property('network_dns').to.be.a('number')
        expect(timing).to.have.property('network_tcp').to.be.a('number')
        expect(timing).to.have.property('network_request').to.be.a('number')
        expect(timing).to.have.property('render_ready').to.be.a('number')
        expect(timing).to.have.property('render_load').to.be.a('number')
        expect(timing).to.have.property('js_complete').to.be.a('number')
        expect(timing).to.have.property('dom_complete').to.be.a('number')
        expect(timing).to.have.property('total').to.be.a('number')
      })
      
      it('getSource', async function () {
        const source = await getSource({
          sources: { script: ['http://localhost:9876/context.js'] }
        })
        const source_appoint = (<any>source)['source_appoint']
        expect(source).to.be.an('object')
        expect(source).to.have.property('api_appoint').to.be.an('array')
        expect(source).to.have.property('api_random').to.be.an('array')
        expect(source).to.have.property('api_timeout').to.be.an('array')
        expect(source).to.have.property('source_appoint').to.be.an('array').to.have.lengthOf(1)
        expect(source_appoint[0]).to.have.property('name').to.be.a('string')
        expect(source_appoint[0]).to.have.property('duration').to.be.a('number')
        expect(source_appoint[0]).to.have.property('type').to.be.a('string')
        expect(source).to.have.property('source_random').to.be.an('array')
        expect(source).to.have.property('source_timeout').to.be.an('array')
      })

    })
  }
})