class TinyEmitter {
  constructor() {
    Object.defineProperty(this, '__listeners', {
      value: {},
      enumerable: false,
      writable: false
    });
  }

  emit(eventName, ...args) {
    if(!this.__listeners[eventName])
      return this;

    for(const handler of this.__listeners[eventName]) {
      handler(...args);
    }

    return this;
  }

  once(eventName, handler) {
    const once = (...args) => {
      this.off(eventName, once);
      handler(...args);
    };

    return this.on(eventName, once);
  }

  on(eventName, handler) {
    if(!this.__listeners[eventName])
      this.__listeners[eventName] = [];

    this.__listeners[eventName].push(handler);

    return this;
  }

  off(eventName, handler) {
    if(handler)
      this.__listeners[eventName] = this.__listeners[eventName].filter(h => h !== handler);
    else
      this.__listeners[eventName] = [];

    return this;
  }
}

module.exports = TinyEmitter;
