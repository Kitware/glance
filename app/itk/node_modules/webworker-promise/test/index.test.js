const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

const path = require('path');

const Worker = require('../src/node-worker');
const WorkerPromise = require('../src');
const WorkerPool = require('../src/pool');

const sleep = delay => new Promise(res => setTimeout(res, delay));

describe('Worker promise', () => {

  describe('Payload types', () => {
    const worker = new WorkerPromise(new Worker(path.join(__dirname, './payload-type.worker.js')));

    it('object send->receive', async () => {
      const result = await worker.postMessage({a: '1'});
      expect(result.a).to.be.equal('1');
      expect(result.pong).to.be.equal('pong');
    });

    it('array send->receive', async () => {
      const result = await worker.postMessage([1]);
      expect(result[0]).to.be.equal(1);
      expect(result[1]).to.be.equal('pong')
    });

    it('string send->receive', async () => {
      const result = await worker.postMessage('ping');
      expect(result).to.be.equal('pingpong');
    });

    it('boolean send->receive', async () => {
      const result = await worker.postMessage(true);
      expect(result).to.be.equal(true);

      expect(await worker.postMessage(false)).to.be.equal(true);
    });

  });

  describe('Features', () => {
    const worker = new WorkerPromise(new Worker(path.join(__dirname, './math.worker.js')));

    it('concurrent execution ', async () => {
      const tasks = [
        worker.postMessage({func: 'add', delay: 40, nums: [100, 200]}),
        worker.postMessage({func: 'minus', delay: 30, nums: [100, 50]}),
        worker.postMessage({func: 'add', delay: 50, nums: [400, 1000]}),
      ];

      const results = await Promise.all(tasks);

      expect(results[0]).to.be.equal(300);
      expect(results[1]).to.be.equal(50);
      expect(results[2]).to.be.equal(1400);
    });


    it('emit events ', async () => {
      let events = [];
      await worker.postMessage({func: 'fib', delay: 10, nums: [22]}, [], (eventName, current) => {
        expect(eventName).to.be.equal('progress');
        events.push(current);
      });

      expect(events[0]).to.be.equal(10);
      expect(events[1]).to.be.equal(20);
    });

    it('events from different postMessages ', async () => {
      let events1 = [];
      let events2 = [];

      let tasks = [
        worker.postMessage({func: 'fib', delay: 10, nums: [22]}, [], (eventName, current) => {
          events1.push(current);
        }),

        worker.postMessage({func: 'fib', delay: 10, nums: [12]}, [], (eventName, current) => {
          events2.push(current);
        })
      ];

      await Promise.all(tasks);

      expect(events2[0]).to.be.equal(10);
      expect(events2[1]).to.be.equal(undefined);

      expect(events1[0]).to.be.equal(10);
      expect(events1[1]).to.be.equal(20);
    });

    it('should not throw error when worker send events and there is no event handler ', async () => {
      await worker.postMessage({func: 'fib', delay: 10, nums: [12]}, []);
    });

    it('should not throw error when worker try directly use postMessage', async () => {
      const promise = worker.postMessage({func: 'addWithDirectResult', delay: 10, nums: [12, 10]}, []);
      expect(promise).to.be.eventually.equal(null);
    });

    it('should call operation and get result', async () => {
      const result = await worker.exec('add-operation', [10, 8]);
      expect(result).to.be.equal(18);
    });

    it('should throw error when trying to call undefined operation', async () => {
      const result = worker.exec('my-undefined-operation');
      return expect(result).to.be.rejectedWith('Not found handler for this request');
    });



    it('should send event host=>worker worker=>host', async () => {
      const resultPromise = onPromise(worker, 'bar:result');
      worker.emit('bar', 11, 22);

      expect(await resultPromise).to.be.equal(33);
    });

    function onPromise(worker, eventName) {
      return new Promise((res, rej) => {
        worker.on(eventName, (...args) => res(...args));
      });
    }


  });


  describe('Pool', () => {
    const opts = {
      create: () => new Worker(path.join(__dirname, './math.worker.js')),
      maxThreads: 3,
      maxConcurrentPerWorker: 1
    };

    it('should create additional workers per job but no more than maxConcurrentWorkers', async () => {
      const pool = WorkerPool.create(Object.assign(opts, {maxConcurrentPerWorker: 2}));

      const tasks = [
        pool.postMessage({func: 'add', delay: 30, nums: [100, 200]}),
        pool.postMessage({func: 'minus', delay: 30, nums: [100, 50]}),
        pool.postMessage({func: 'add', delay: 30, nums: [400, 1000]}),
      ];

      const results = await Promise.all(tasks);

      expect(results[0]).to.be.equal(300);
      expect(results[1]).to.be.equal(50);
      expect(results[2]).to.be.equal(1400);

      expect(pool._workers).to.have.length(2);
    });

    it('should terminate worker after inactivity', async () => {
      const pool = WorkerPool.create(Object.assign(opts, {
        maxConcurrentPerWorker: 1,
        terminateAfterDelay: 100
      }));

      const tasks = [
        pool.postMessage({func: 'add', delay: 30, nums: [100, 200]}),
        pool.postMessage({func: 'minus', delay: 30, nums: [100, 50]}),
      ];

      expect(pool._workers).to.have.length(2);

      await Promise.all(tasks);
      await sleep(200);

      expect(pool._workers).to.have.length(1);
    });


  });

});