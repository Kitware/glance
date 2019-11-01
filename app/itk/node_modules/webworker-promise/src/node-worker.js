const ChildProcess = require('child_process');
const path = require('path');

class Worker {
  constructor(script) {
    this._process = ChildProcess.fork(path.join(__dirname, 'node-child-process.js'), [script]);
    this._process.on('message', (data) => this.onmessage({data}));
  }

  postMessage(data) {
    this._process.send(data);
  }

  onmessage(data) {}

  terminate() {
    // terminated
    this._process.kill('SIGINT');
    this._terminated = true;
  }

}

module.exports = Worker;