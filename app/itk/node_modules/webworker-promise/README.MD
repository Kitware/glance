# webworker-promise [![Build Status](https://travis-ci.org/kwolfy/webworker-promise.svg?branch=master)](https://travis-ci.org/kwolfy/webworker-promise)

A small promise based wrapper over the "webworkers"

Usage
---

Install:

    npm install webworker-promise

Inside your main bundle:

```js
// main.js
const WebworkerPromise = require('webworker-promise');
const worker = new WebworkerPromise(new Worker('worker.js'));

worker
  .postMessage('ping')
  .then((response) => {
    // handle response
  })
  .catch(error => {
    // handle error
  });
```

Inside `worker.js`:

```js
// worker.js
const registerWebworker = require('webworker-promise/lib/register');

registerWebworker(async (message, emit) => {
  //message - ping
  return 'pong';
});
```

### Nodejs

You can use webworker-promise with nodejs using shim

**Note** It uses nodejs `child_process` for workers

```js
const Worker = require('webworker-promise/lib/node-worker');
const WebWorkerPromise = require('webworker-promise');

const worker = new WebWorkerPromise(new Worker('./node-process'));
```

### Message format

The message you send can be any object, array, string, number, etc.:

```js
// main.js
worker.postMessage({
  hello: 'world'
}).then(/* ... */);
```

```js
// worker.js
registerWebworker(async (message, emit) => {
  console.log(message); // { hello: 'world'}
});
```

Note that you can't send dom objects via postMessage

### Transferable

You can use transferable list for performance issue

Send just arraybuffer
```js
worker.postMessage(arrayBuffer, [arrayBuffer])
```

Or inside objects

```js
worker.postMessage({myArr: arrayBuffer, myArr2: arrayBuffer2}, [arrayBuffer, arrayBuffer2]);
```

And in `worker.js`

```js
registerWebworker(async (message, emit) => {
  return new registerWebworker.TransferableResponse(arrayBuffer, [arrayBuffer]);
});
```

### Events

You can send events from worker to main-process

```js
// main.js
worker.postMessage('ping', [], (eventName, data) => {
  eventName; // hello
  data; // world
})
.then(response => {
  //job end
  //pong
})
```

```js
// worker.js
registerWebworker(async (message, emit) => {
  emit('hello', 'world');
  return 'pong';
});
```


### EventEmitter

Combine with simple EventEmitter mode

```js
// main.js
worker.emit('add', 11, 22);
```

```js
// worker.js
const host = registerWebworker()
.on('add', (n1, n2) => {
    host.emit('add:ok', n1 + n2);
})
.once('minus', (n1, n2) => {
  host.emit('minus:answer', n1 - n2);
})
// you still can add operations
.operation('foo', async () => {
  return 'bar';
});
```

### Operations

Also, you can create operations

```js
// worker.js
registerWebworker(async (message) => {
  //handle postMessage
  return 'pong';
})
.operation('hello', async (message, emit) => {
  return 'world';
});
```

```js
// main.js
worker.exec('hello')
.then(response => {
  // world
})
```


### Workers Pool

Dynamic pool for workers.

**Note:** It's experimental feature, and api may be changed

```js
const WorkerPool = require('webworker-promise/lib/pool');
const pool = WorkerPool.create({
    src: './test.worker.js',
    // or
    create: () => new Worker('./test.worker.js'),
    maxThreads: 3, // optional, default is 2, max numbers of workers to create if necessary
    maxConcurrentPerWorker: 1 // optional, default is 1
});

pool.postMessage('hello')
    .then(() => {
        console.log('result');
    });

```

Pool has `exec` and `postMessage` methods with the same api as WebWorkerPromise

### Promises

Inside of the worker, the registered handler should return Promise or just value

### Error handling

Any thrown errors or rejections from the worker will
be propagated to the main thread as a rejected Promise. For instance:

```js
// worker.js
registerWebworker(function (message) {
  throw new Error('myException!');
});
```

```js
// main.js
worker.postMessage('hi').catch(function (err) {
  console.log(err.message); // 'myException!'
  console.log(err.stack); // stack trace string
});
```

Note that stacktraces cannot be originaly sent from the worker to the main thread, so 
you're getting just string stack trace

Browser support
----

* Chrome
* Firefox
* Safari 8+
* IE 10+
* Edge
* iOS 8+
* Android 4.4+

---

### Main bundle

#### `new WebworkerPromise(worker)`

Create a new `WebworkerPromise`, using the given worker.

* `worker` - the `Worker` to use.

#### `PromiseWorker.postMessage(message, transferableList, onEvent)`

Send a message to the worker and return a Promise.

* `message` - object - required
  * The message to send.
* `transferable` - transferable list
* `onEvent` - on-event callback function to handle events from worker
  * Take eventName and message
* returns a Promise

#### `PromiseWorker.exec(operationName, message, transferableList, onEvent)`

Send a message to the worker and return a Promise.

* `operationName` - string - required
  * Operation name to exec
* `message` - object
  * The message to send.
* `transferable` - transferable list
* `onEvent` - on-event callback function to handle events from worker
  * Take eventName and message
* returns a Promise

### Worker bundle

Register a message handler inside of the worker. Your handler consumes a message
and returns a Promise.

#### `registerWebworker(function)`

* `function`
  * Takes a emit fn and message, returns a Promise;

#### `registerWebworker().operation(name, handler)`

Add Operation.

* `name` - string - required
  * The message to send.
* `handler` - handle the operation

Testing the library
---

First:

    npm install

Then to test in Node using pseudo-webworker

    npm test

Or to test with coverage reports:

    npm run coverage
    
    
Inspired by https://github.com/nolanlawson/promise-worker
