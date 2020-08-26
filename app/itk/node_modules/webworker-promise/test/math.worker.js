const register = require('../src/register');

const sleep = delay => delay ? new Promise((res) => setTimeout(res, delay)): Promise.resolve();

const math = {
  async add(emit, delay, num1, num2) {
    await sleep(delay);
    return num1 + num2;
  },

  // take all of the event loop
  async addLoop(emit, delay, num1, num2) {
    let start = Date.now();
    while(Date.now() - start < delay) {}
    return num1 + num2;
  },

  async minus(emit, delay, num1, num2) {
    await sleep(delay);
    return num1 - num2;
  },

  async fib(emit, delay, n) {
    let a = 1, b = 1;
    for(let i = 3; i <= n; i++) {
      let c = a + b;
      a = c;

      await sleep(delay);

      if(!(i % 10))
        emit('progress', i);
    }

    return a;
  },

  async addWithDirectResult(emit, delay, num1, num2) {
    self.postMessage(num1 + num2);
  }

};

const host = register(async (data, emit) => {
  return math[data.func](emit, data.delay, ...data.nums);
})
.operation('add-operation', async ([n1, n2]) => {
  return n1 + n2;
})
.on('bar', function(n1, n2) {
  host.emit('bar:result', n1 + n2);
});