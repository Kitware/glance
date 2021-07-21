global.self = new class Worker {
  postMessage(m) {
    process.send(m);
  }

  addEventListener(eventName, listener) {
    if(eventName === 'message') {
      process.on('message', data => listener({data}));
    }
  }
};

require(process.argv[2]);
