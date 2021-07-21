const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const TinyEmitter = require('../src/tiny-emitter');
const expect = chai.expect;

class Foo extends TinyEmitter {}


describe("TinyEmitter", () => {

  it('should listen eventName', (done) => {
    const foo = new Foo();

    const spy = chai.spy(() => {});

    foo.on('bar', spy);

    foo.emit('bar', '1', '2');
    foo.emit('bar', '3', '4');

    expect(spy).to.have.been.called.twice;
    done();
  });

  it('should listen eventName once', (done) => {
    const foo = new Foo();

    const spy = chai.spy(() => {});

    foo.once('bar', spy);

    foo.emit('bar', '1', '2');
    foo.emit('bar', '3', '4');

    expect(spy).to.have.been.called.once;
    done();
  });

  it('should remove specific listener', (done) => {
    const foo = new Foo();

    const spy = chai.spy(() => {});
    const spy2 = chai.spy(() => {});

    foo.on('bar', spy);
    foo.on('bar', spy2);

    foo.off('bar', spy2);
    foo.emit('bar');

    expect(spy).to.have.been.called.once;
    expect(spy).to.have.not.been.called;
    done();
  });

  it('should remove all listeners for eventName', (done) => {
    const foo = new Foo();

    const spy = chai.spy(() => {});
    const spy2 = chai.spy(() => {});

    foo.on('bar', spy);
    foo.on('bar', spy2);

    foo.off('bar');
    foo.emit('bar');

    expect(spy).to.have.not.been.called;
    expect(spy).to.have.not.been.called;

    done();
  });

});