const TinyEmitter = require('./tiny-emitter');

const MESSAGE_RESULT = 0;
const MESSAGE_EVENT = 1;

const RESULT_ERROR = 0;
const RESULT_SUCCESS = 1;

const DEFAULT_HANDLER = 'main';

const isPromise = o => typeof o === 'object' && typeof o.then === 'function' && typeof o.catch === 'function';

function RegisterPromise(fn) {
  const handlers = {[DEFAULT_HANDLER]: fn};
  const sendPostMessage = self.postMessage.bind(self);

  const server = new class WorkerRegister extends TinyEmitter {
    emit(eventName, ...args) {
      sendPostMessage({eventName, args: args});
      return this;
    }

    emitLocally(eventName, ...args) {
      super.emit(eventName, ...args);
    }

    operation(name, handler) {
      handlers[name] = handler;
      return this;
    }
  };

  const run = (messageId, payload, handlerName) => {

    const onSuccess = (result) => {
      if(result && result instanceof TransferableResponse) {
        sendResult(messageId, RESULT_SUCCESS, result.payload, result.transferable);
      }
      else {
        sendResult(messageId, RESULT_SUCCESS, result);
      }
    };

    const onError = (e) => {
      sendResult(messageId, RESULT_ERROR, {
        message: e.message,
        stack: e.stack
      });
    };

    try {
      const result = runFn(messageId, payload, handlerName);
      if(isPromise(result)) {
        result.then(onSuccess).catch(onError);
      } else {
        onSuccess(result);
      }
    } catch (e) {
      onError(e);
    }
  };

  const runFn = (messageId, payload, handlerName) =>  {
    const handler = handlers[handlerName || DEFAULT_HANDLER];
    if(!handler)
      throw new Error(`Not found handler for this request`);

    return handler(payload, sendEvent.bind(null, messageId))
  };

  const sendResult = (messageId, success, payload, transferable = []) => {
    sendPostMessage([MESSAGE_RESULT, messageId, success, payload], transferable);
  };

  const sendEvent = (messageId, eventName, payload) => {
    if(!eventName)
      throw new Error('eventName is required');

    if(typeof eventName !== 'string')
      throw new Error('eventName should be string');

    sendPostMessage([MESSAGE_EVENT, messageId, eventName, payload]);
  };

  self.addEventListener('message', ({data}) => {
    if(Array.isArray(data)) {
      run(...data);
    } else if(data && data.eventName) {
      server.emitLocally(data.eventName, ...data.args);
    }
  });

  return server;
}

class TransferableResponse {
  constructor(payload, transferable) {
    this.payload = payload;
    this.transferable = transferable;
  }
}

module.exports = RegisterPromise;
module.exports.TransferableResponse = TransferableResponse;