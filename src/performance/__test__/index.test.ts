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
    mark('test')
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

      it('getExecTiming', async function () {
        mark('test')
        const exec = await getExecTiming()
        expect(exec).to.be.an('object')
        expect(exec).to.have.property('exec').to.be.an('array')
        const execute = exec && exec.exec || []
        expect(execute).to.have.lengthOf(1)
        expect(execute[0]).to.have.property('name').to.be.a('string').to.eql('test')
        expect(execute[0]).to.have.property('duration').to.be.a('number')
      })

      it('getPerformanceData', async function () {
        mark('test')
        const performance = await getPerformanceData()
        expect(performance).to.be.an('object')
        expect(performance).to.have.property('api_appoint').to.be.an('array')
        expect(performance).to.have.property('api_random').to.be.an('array')
        expect(performance).to.have.property('api_timeout').to.be.an('array')
        expect(performance).to.have.property('exec').to.be.an('array').to.have.lengthOf(1)
        expect(performance).to.have.property('source_appoint').to.be.an('array')
        expect(performance).to.have.property('source_random').to.be.an('array')
        expect(performance).to.have.property('source_timeout').to.be.an('array')
        expect(performance).to.have.property('dom_complete').to.be.an('number')
        expect(performance).to.have.property('fscreen').to.be.an('number')
        expect(performance).to.have.property('memory').to.be.an('number')
        expect(performance).to.have.property('network').to.be.an('number')
        expect(performance).to.have.property('network_dns').to.be.an('number') 
        expect(performance).to.have.property('network_prev').to.be.an('number') 
        expect(performance).to.have.property('network_redirect').to.be.an('number') 
        expect(performance).to.have.property('network_request').to.be.an('number') 
        expect(performance).to.have.property('network_tcp').to.be.an('number') 
        expect(performance).to.have.property('render_load').to.be.an('number') 
        expect(performance).to.have.property('render_ready').to.be.an('number') 
        expect(performance).to.have.property('total').to.be.an('number') 
        expect(performance).to.have.property('wscreen').to.be.an('number') 
      })

      it('mark', async function () {
        const mark1Res = mark('test')
        const mark2Res = mark('test1')
        const mark3Res = mark('test1')
        expect(mark1Res).to.be.false
        expect(mark2Res).to.be.true
        expect(mark3Res).to.be.true

        const exec = await getExecTiming()
        const execute = exec && exec.exec || []
        expect(execute).to.have.lengthOf(2)
        expect(execute[0]).to.have.property('name').to.be.a('string').to.eql('test')
        expect(execute[0]).to.have.property('duration').to.be.a('number')
        expect(execute[1]).to.have.property('name').to.be.a('string').to.eql('test1')
        expect(execute[1]).to.have.property('duration').to.be.a('number')
      })

      it('clearPerformance', async function () {
        const mark1Res = mark('test2')
        const mark2Res = mark('test3')
        // clear measure record
        const res1 = clearPerformance('measure')
        expect(mark1Res).to.be.true
        expect(mark2Res).to.be.true
        expect(res1).to.be.true
        let exec = await getExecTiming()
        let execute = exec && exec.exec || []
        expect(execute).to.have.lengthOf(0)

        const mark3Res = mark('test2')
        expect(mark3Res).to.be.true
        exec = await getExecTiming()
        execute = exec && exec.exec || []
        expect(execute).to.have.lengthOf(1)
        expect(execute[0]).to.have.property('name').to.be.a('string').to.eql('test2')
        expect(execute[0]).to.have.property('duration').to.be.a('number')

        // clear mark record
        const res2 = clearPerformance('mark')
        const res3 = clearPerformance('measure')
        const mark4Res = mark('test3')
        expect(res2).to.be.true
        expect(res3).to.be.true
        expect(mark4Res).to.be.true
        exec = await getExecTiming()
        execute = exec && exec.exec || []
        expect(execute).to.have.lengthOf(0)

        // clear source record
        const res4 = clearPerformance('source')
        expect(res4).to.be.true
        const performance = await getPerformanceData({sourceRatio: 1})
        expect(performance).to.have.property('source_random').to.be.an('array').to.lengthOf(0)
      })

      it('observeSource', async function () {
        const body = document.body
        const newSrc = 'https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/48/8c/2b/488c2be3-c5c4-13da-73c5-1f1077662abc/source/300x300bb.jpg'
        observeSource(body, function (source_appoint) {
          expect(source_appoint).to.be.an('array').to.have.lengthOf(1)
          expect(source_appoint[0]).to.have.property('name').to.eql(newSrc)
          expect(source_appoint[0]).to.have.property('type').to.eql('img')
          expect(source_appoint[0]).to.have.property('duration').to.be.a('number')
        })

        const img: any = document.getElementById('img')
        img.src = newSrc
      })

      it('SV', async function () {
        expect(SV).to.be.a('function').to.have.property('__proto__')
        expect(SV).to.be.a('function').to.have.property('prototype')
        expect(SV.prototype).to.be.a('object').to.have.property('constructor').to.be.a('function')
        expect(SV.prototype).to.be.a('object').to.have.property('clearPerformance').to.be.a('function')
        expect(SV.prototype).to.be.a('object').to.have.property('getExecTiming').to.be.a('function')
        expect(SV.prototype).to.be.a('object').to.have.property('getPerformanceData').to.be.a('function')
        expect(SV.prototype).to.be.a('object').to.have.property('getSource').to.be.a('function')
        expect(SV.prototype).to.be.a('object').to.have.property('getTiming').to.be.a('function')
        expect(SV.prototype).to.be.a('object').to.have.property('observeSource').to.be.a('function')
        expect(SV.prototype).to.be.a('object').to.have.property('updateConfig').to.be.a('function')
      })
    })
  }
})