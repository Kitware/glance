"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class WorkerPool {
  /* poolSize is the maximum number of web workers to create in the pool.
   *
   * The function, fcn, should accept null or an existing worker as its first argument.
   * It most also return and object with the used worker on the `webWorker`
   * property.  * Example: runPipelineBrowser.
   *
   **/
  constructor(poolSize, fcn) {
    this.fcn = fcn;
    this.workerQueue = new Array(poolSize);
    this.workerQueue.fill(null);
    this.runInfo = [];
  }
  /*
   * Run the tasks specified by the arguments in the taskArgsArray that will
   * be passed to the pool fcn.
   *
   * An optional progressCallback will be cassed with the number of complete
   * tasks and the total number of tasks as arguments every time a task has
   * completed.
   */


  runTasks(taskArgsArray, progressCallback) {
    const info = {
      taskQueue: [],
      results: [],
      addingTasks: false,
      postponed: false,
      runningWorkers: 0,
      progressCallback: progressCallback
    };
    this.runInfo.push(info);
    info.index = this.runInfo.length - 1;
    return new Promise((resolve, reject) => {
      info.resolve = resolve;
      info.reject = reject;
      info.results = new Array(taskArgsArray.length);
      info.completedTasks = 0;
      info.addingTasks = true;
      taskArgsArray.forEach((taskArg, index) => {
        this.addTask(info.index, index, taskArg);
      });
      info.addingTasks = false;
    });
  }

  terminateWorkers() {
    for (let index = 0; index < this.workerQueue.length; index++) {
      const worker = this.workerQueue[index];

      if (worker) {
        worker.terminate();
      }

      this.workerQueue[index] = null;
    }
  } // todo: change to #addTask(resultIndex, taskArgs) { after private methods
  // proposal accepted and supported by default in Babel.


  addTask(infoIndex, resultIndex, taskArgs) {
    const info = this.runInfo[infoIndex];

    if (this.workerQueue.length > 0) {
      const worker = this.workerQueue.pop();
      info.runningWorkers++;
      this.fcn(worker, ...taskArgs).then(({
        webWorker,
        ...result
      }) => {
        this.workerQueue.push(webWorker);
        info.runningWorkers--;
        info.results[resultIndex] = result;
        info.completedTasks++;

        if (info.progressCallback) {
          info.progressCallback(info.completedTasks, info.results.length);
        }

        if (info.taskQueue.length > 0) {
          const reTask = info.taskQueue.shift();
          this.addTask(infoIndex, ...reTask);
        } else if (!info.addingTasks && !info.runningWorkers) {
          const results = info.results;
          const clearIndex = info.index;
          this.runInfo[clearIndex] = null;
          info.resolve(results);
        }
      }).catch(error => {
        const reject = info.reject;
        const clearIndex = info.index;
        this.runInfo[clearIndex] = null;
        reject(error);
      });
    } else {
      if (info.runningWorkers || info.postponed === true) {
        // At least one worker is working on these tasks, and it will pick up
        // the next item in the taskQueue when done.
        info.taskQueue.push([resultIndex, taskArgs]);
      } else {
        // Try again later.
        info.postponed = true;
        setTimeout(() => {
          info.postponed = false;
          this.addTask(info.index, resultIndex, taskArgs);
        }, 50);
      }
    }
  }

}

var _default = WorkerPool;
exports.default = _default;