const WebWorkerPromise = require('./index');

class WorkerPool {
  constructor({create, maxThreads, terminateAfterDelay, maxConcurrentPerWorker}) {
    this._queue = [];
    this._workers = [];
    this._createWorker = create;
    this._maxThreads = maxThreads;
    this._terminateAfterDelay = terminateAfterDelay;
    this._maxConcurrentPerWorker = maxConcurrentPerWorker;

    const worker = this._createWebWorker();
    this._workers.push(worker);
  }

  /**
   const pool = WorkerPool.create({
    src: 'my-worker.js',
    // or create: () => new Worker()
    maxThreads: 2
   });
   */

  static create(opts) {
    if(!opts.create)
      opts.create = () => new Worker(opts.src);

    if(!opts.terminateAfterDelay)
      opts.terminateAfterDelay = 5000;
    if(!opts.maxThreads)
      opts.maxThreads = 2;
    if(!opts.maxConcurrentPerWorker) {
      opts.maxConcurrentPerWorker = 1;
    }

    return new WorkerPool(opts);
  }

  exec(...args) {
    const worker = this.getFreeWorkerOrCreate();
    if(worker)
      return this._exec(worker, 'exec', args);

    return new Promise(res => this._queue.push(['exec', args, res]));
  }

  postMessage(...args) {
    const worker = this.getFreeWorkerOrCreate();
    if(worker){
      return this._exec(worker, 'postMessage', args);
    }

    return new Promise(res => this._queue.push(['postMessage', args, res]));
  }

  _exec(worker, method, args) {
    return new Promise((res, rej) => {
      worker[method](...args)
        .then((result) => {
          this._onWorkDone(worker);
          res(result);
        })
        .catch(e => {
          this._onWorkDone(worker);
          rej(e);
        });
    });
  }

  // if there is unresolved jobs, run them
  // or remove unused workers

  _onWorkDone() {
    if(this._queue.length) {
      let worker;
      while(this._queue.length && (worker = this.getFreeWorkerOrCreate())) {
        let [method, args, cb] = this._queue.shift();
        cb(this._exec(worker, method, args));
      }
    }

    const freeWorkers = this.getAllFreeWorkers();
    if(freeWorkers.length) {
      this._waitAndRemoveWorkers(freeWorkers);
    }
  }

  // remove workers if its not using after delay
  _waitAndRemoveWorkers(workers) {
    setTimeout(() => {
      // only one worker should be alive always
      workers = workers.filter(w => w.isFree()).slice(0, this._workers.length - 1);
      workers.forEach(worker => this._removeWorker(worker));
    }, this._terminateAfterDelay);
  }

  _removeWorker(worker) {
    this._workers = this._workers.filter(w => w._id !== worker._id);
    worker.terminate();
  }

  getAllFreeWorkers() {
    return this._workers.filter(w => w.jobsLength() < this._maxConcurrentPerWorker);
  }

  getFreeWorkerOrCreate() {
    const freeWorker = this._workers.find(w => w.jobsLength() < this._maxConcurrentPerWorker);

    if(!freeWorker && this._workers.length < this._maxThreads) {
      const worker = this._createWebWorker();
      this._workers.push(worker);
      return worker;
    }

    return freeWorker;
  }

  _createWebWorker(){
    return new WebWorkerPromise(this._createWorker());
  }
}

module.exports = WorkerPool;