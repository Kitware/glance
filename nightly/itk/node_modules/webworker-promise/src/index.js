const TinyEmitter = require('./tiny-emitter');

const MESSAGE_RESULT = 0;
const MESSAGE_EVENT = 1;

const RESULT_ERROR = 0;
const RESULT_SUCCESS = 1;

class Worker extends TinyEmitter {
  /**
   *
   * @param worker {Worker}
   */
  constructor(worker) {
    super();

    this._messageId = 1;
    this._messages = new Map();

    this._worker = worker;
    this._worker.onmessage = this._onMessage.bind(this);
    this._id = Math.ceil(Math.random() * 10000000);
  }

  terminate() {
    this._worker.terminate();
  }

  /**
   * return true if there is no unresolved jobs
   * @returns {boolean}
   */
  isFree() {
    return this._messages.size === 0;
  }

  jobsLength() {
    return this._messages.size;
  }

  /**
   * @param operationName string
   * @param data any
   * @param transferable array
   * @param onEvent function
   * @returns {Promise}
   */
  exec(operationName, data = null, transferable = [], onEvent) {
    return new Promise((res, rej) => {
      const messageId = this._messageId++;
      this._messages.set(messageId, [res, rej, onEvent]);
      this._worker.postMessage([messageId, data, operationName], transferable || []);
    });
  }

  /**
   *
   * @param data any
   * @param transferable array
   * @param onEvent function
   * @returns {Promise}
   */
  postMessage(data = null, transferable = [], onEvent) {
    return new Promise((res, rej) => {
      const messageId = this._messageId++;
      this._messages.set(messageId, [res, rej, onEvent]);
      this._worker.postMessage([messageId, data], transferable || []);
    });
  }

  emit(eventName, ...args) {
    this._worker.postMessage({eventName, args});
  }

  _onMessage(e) {
    //if we got usual event, just emit it locally
    if(!Array.isArray(e.data) && e.data.eventName) {
      return super.emit(e.data.eventName, ...e.data.args);
    }

    const [type, ...args] = e.data;

    if(type === MESSAGE_EVENT)
      this._onEvent(...args);
    else if(type === MESSAGE_RESULT)
      this._onResult(...args);
    else
      throw new Error(`Wrong message type '${type}'`);
  }

  _onResult(messageId, success, payload) {
    const [res, rej] = this._messages.get(messageId);
    this._messages.delete(messageId);

    return success === RESULT_SUCCESS ? res(payload) : rej(payload);
  }

  _onEvent(messageId, eventName, data) {
    const [,,onEvent] = this._messages.get(messageId);

    if(onEvent) {
      onEvent(eventName, data);
    }
  }

}

module.exports = Worker;
