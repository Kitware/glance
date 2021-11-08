(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],2:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],3:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],4:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],5:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":4}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TinyEmitter = require('./tiny-emitter');

var MESSAGE_RESULT = 0;
var MESSAGE_EVENT = 1;

var RESULT_ERROR = 0;
var RESULT_SUCCESS = 1;

var DEFAULT_HANDLER = 'main';

var isPromise = function isPromise(o) {
  return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && typeof o.then === 'function' && typeof o.catch === 'function';
};

function RegisterPromise(fn) {
  var handlers = _defineProperty({}, DEFAULT_HANDLER, fn);
  var sendPostMessage = self.postMessage.bind(self);

  var server = new (function (_TinyEmitter) {
    _inherits(WorkerRegister, _TinyEmitter);

    function WorkerRegister() {
      _classCallCheck(this, WorkerRegister);

      return _possibleConstructorReturn(this, (WorkerRegister.__proto__ || Object.getPrototypeOf(WorkerRegister)).apply(this, arguments));
    }

    _createClass(WorkerRegister, [{
      key: 'emit',
      value: function emit(eventName) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        sendPostMessage({ eventName: eventName, args: args });
        return this;
      }
    }, {
      key: 'emitLocally',
      value: function emitLocally(eventName) {
        var _get2;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        (_get2 = _get(WorkerRegister.prototype.__proto__ || Object.getPrototypeOf(WorkerRegister.prototype), 'emit', this)).call.apply(_get2, [this, eventName].concat(args));
      }
    }, {
      key: 'operation',
      value: function operation(name, handler) {
        handlers[name] = handler;
        return this;
      }
    }]);

    return WorkerRegister;
  }(TinyEmitter))();

  var run = function run(messageId, payload, handlerName) {

    var onSuccess = function onSuccess(result) {
      if (result && result instanceof TransferableResponse) {
        sendResult(messageId, RESULT_SUCCESS, result.payload, result.transferable);
      } else {
        sendResult(messageId, RESULT_SUCCESS, result);
      }
    };

    var onError = function onError(e) {
      sendResult(messageId, RESULT_ERROR, {
        message: e.message,
        stack: e.stack
      });
    };

    try {
      var result = runFn(messageId, payload, handlerName);
      if (isPromise(result)) {
        result.then(onSuccess).catch(onError);
      } else {
        onSuccess(result);
      }
    } catch (e) {
      onError(e);
    }
  };

  var runFn = function runFn(messageId, payload, handlerName) {
    var handler = handlers[handlerName || DEFAULT_HANDLER];
    if (!handler) throw new Error('Not found handler for this request');

    return handler(payload, sendEvent.bind(null, messageId));
  };

  var sendResult = function sendResult(messageId, success, payload) {
    var transferable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    sendPostMessage([MESSAGE_RESULT, messageId, success, payload], transferable);
  };

  var sendEvent = function sendEvent(messageId, eventName, payload) {
    if (!eventName) throw new Error('eventName is required');

    if (typeof eventName !== 'string') throw new Error('eventName should be string');

    sendPostMessage([MESSAGE_EVENT, messageId, eventName, payload]);
  };

  self.addEventListener('message', function (_ref) {
    var data = _ref.data;

    if (Array.isArray(data)) {
      run.apply(undefined, _toConsumableArray(data));
    } else if (data && data.eventName) {
      server.emitLocally.apply(server, [data.eventName].concat(_toConsumableArray(data.args)));
    }
  });

  return server;
}

var TransferableResponse = function TransferableResponse(payload, transferable) {
  _classCallCheck(this, TransferableResponse);

  this.payload = payload;
  this.transferable = transferable;
};

module.exports = RegisterPromise;
module.exports.TransferableResponse = TransferableResponse;
},{"./tiny-emitter":7}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinyEmitter = function () {
  function TinyEmitter() {
    _classCallCheck(this, TinyEmitter);

    Object.defineProperty(this, '__listeners', {
      value: {},
      enumerable: false,
      writable: false
    });
  }

  _createClass(TinyEmitter, [{
    key: 'emit',
    value: function emit(eventName) {
      if (!this.__listeners[eventName]) return this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.__listeners[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var handler = _step.value;

          handler.apply(undefined, args);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: 'once',
    value: function once(eventName, handler) {
      var _this = this;

      var once = function once() {
        _this.off(eventName, once);
        handler.apply(undefined, arguments);
      };

      return this.on(eventName, once);
    }
  }, {
    key: 'on',
    value: function on(eventName, handler) {
      if (!this.__listeners[eventName]) this.__listeners[eventName] = [];

      this.__listeners[eventName].push(handler);

      return this;
    }
  }, {
    key: 'off',
    value: function off(eventName, handler) {
      if (handler) this.__listeners[eventName] = this.__listeners[eventName].filter(function (h) {
        return h !== handler;
      });else this.__listeners[eventName] = [];

      return this;
    }
  }]);

  return TinyEmitter;
}();

module.exports = TinyEmitter;
},{}],8:[function(require,module,exports){
"use strict";

var Float32 = 'float';
var Float64 = 'double';
var SpacePrecisionType = 'double';
module.exports = {
  Float32: Float32,
  Float64: Float64,
  SpacePrecisionType: SpacePrecisionType
};

},{}],9:[function(require,module,exports){
"use strict";

var Int8 = 'int8_t';
var UInt8 = 'uint8_t';
var Int16 = 'int16_t';
var UInt16 = 'uint16_t';
var Int32 = 'int32_t';
var UInt32 = 'uint32_t';
var Int64 = 'int64_t';
var UInt64 = 'uint64_t';
var SizeValueType = UInt64;
var IdentifierType = SizeValueType;
var IndexValueType = Int64;
var OffsetValueType = Int64;
module.exports = {
  Int8: Int8,
  UInt8: UInt8,
  Int16: Int16,
  UInt16: UInt16,
  Int32: Int32,
  UInt32: UInt32,
  Int64: Int64,
  UInt64: UInt64,
  SizeValueType: SizeValueType,
  IdentifierType: IdentifierType,
  IndexValueType: IndexValueType,
  OffsetValueType: OffsetValueType
};

},{}],10:[function(require,module,exports){
"use strict";

var MeshType = require('./MeshType.js');

var Mesh = function Mesh() {
  var meshType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new MeshType();
  this.meshType = meshType;
  this.name = 'Mesh';
  this.numberOfPoints = 0;
  this.points = null;
  this.numberOfPointPixels = 0;
  this.pointData = null;
  this.numberOfCells = 0;
  this.cells = null;
  this.numberOfCellPixels = 0;
  this.cellData = null;
  this.cellBufferSize = 0;
};

module.exports = Mesh;

},{"./MeshType.js":12}],11:[function(require,module,exports){
"use strict";

var MeshIOIndex = ['itkBYUMeshIOJSBinding', 'itkFreeSurferAsciiMeshIOJSBinding', 'itkFreeSurferBinaryMeshIOJSBinding', 'itkOBJMeshIOJSBinding', 'itkOFFMeshIOJSBinding', 'itkSTLMeshIOJSBinding', 'itkVTKPolyDataMeshIOJSBinding'];
module.exports = MeshIOIndex;

},{}],12:[function(require,module,exports){
"use strict";

var IntTypes = require('./IntTypes.js');

var FloatTypes = require('./FloatTypes.js');

var PixelTypes = require('./PixelTypes.js');

var MeshType = function MeshType() {
  var dimension = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
  var pointComponentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FloatTypes.Float32;
  var pointPixelComponentType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FloatTypes.Float32;
  var pointPixelType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : PixelTypes.Scalar;
  var pointPixelComponents = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var cellComponentType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : IntTypes.Int32;
  var cellPixelComponentType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : FloatTypes.Float32;
  var cellPixelType = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : PixelTypes.Scalar;
  var cellPixelComponents = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
  this.dimension = dimension;
  this.pointComponentType = pointComponentType;
  this.pointPixelComponentType = pointPixelComponentType;
  this.pointPixelType = pointPixelType;
  this.pointPixelComponents = pointPixelComponents;
  this.cellComponentType = cellComponentType;
  this.cellPixelComponentType = cellPixelComponentType;
  this.cellPixelType = cellPixelType;
  this.cellPixelComponents = cellPixelComponents;
};

module.exports = MeshType;

},{"./FloatTypes.js":8,"./IntTypes.js":9,"./PixelTypes.js":14}],13:[function(require,module,exports){
"use strict";

var mimeToIO = new Map([]);
module.exports = mimeToIO;

},{}],14:[function(require,module,exports){
"use strict";

var Unknown = 0;
var Scalar = 1;
var RGB = 2;
var RGBA = 3;
var Offset = 4;
var Vector = 5;
var Point = 6;
var CovariantVector = 7;
var SymmetricSecondRankTensor = 8;
var DiffusionTensor3D = 9;
var Complex = 10;
var FixedArray = 11;
var Array = 12;
var Matrix = 13;
var VariableLengthVector = 14;
var VariableSizeMatrix = 15;
module.exports = {
  Unknown: Unknown,
  Scalar: Scalar,
  RGB: RGB,
  RGBA: RGBA,
  Offset: Offset,
  Vector: Vector,
  Point: Point,
  CovariantVector: CovariantVector,
  SymmetricSecondRankTensor: SymmetricSecondRankTensor,
  DiffusionTensor3D: DiffusionTensor3D,
  Complex: Complex,
  FixedArray: FixedArray,
  Array: Array,
  Matrix: Matrix,
  VariableLengthVector: VariableLengthVector,
  VariableSizeMatrix: VariableSizeMatrix
};

},{}],15:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _register = _interopRequireDefault(require("webworker-promise/lib/register"));

var _MimeToMeshIO = _interopRequireDefault(require("../MimeToMeshIO"));

var _getFileExtension = _interopRequireDefault(require("../getFileExtension"));

var _extensionToMeshIO = _interopRequireDefault(require("../extensionToMeshIO"));

var _MeshIOIndex = _interopRequireDefault(require("../MeshIOIndex"));

var _loadEmscriptenModuleBrowser = _interopRequireDefault(require("../loadEmscriptenModuleBrowser"));

var _readMeshEmscriptenFSFile = _interopRequireDefault(require("../readMeshEmscriptenFSFile"));

var _writeMeshEmscriptenFSFile = _interopRequireDefault(require("../writeMeshEmscriptenFSFile"));

// To cache loaded io modules
var ioToModule = {};

function readMesh(_x) {
  return _readMesh.apply(this, arguments);
}

function _readMesh() {
  _readMesh = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(input) {
    var extension, mountpoint, io, idx, _ioModule, trialIO, meshIO, _filePath, ioModule, filePath, mesh, transferables;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            extension = (0, _getFileExtension["default"])(input.name);
            mountpoint = '/work';
            io = null;

            if (!_MimeToMeshIO["default"].has(input.type)) {
              _context2.next = 7;
              break;
            }

            io = _MimeToMeshIO["default"].get(input.type);
            _context2.next = 29;
            break;

          case 7:
            if (!_extensionToMeshIO["default"].has(extension)) {
              _context2.next = 11;
              break;
            }

            io = _extensionToMeshIO["default"].get(extension);
            _context2.next = 29;
            break;

          case 11:
            idx = 0;

          case 12:
            if (!(idx < _MeshIOIndex["default"].length)) {
              _context2.next = 29;
              break;
            }

            _ioModule = null;
            trialIO = _MeshIOIndex["default"][idx];

            if (trialIO in ioToModule) {
              _ioModule = ioToModule[trialIO];
            } else {
              ioToModule[trialIO] = (0, _loadEmscriptenModuleBrowser["default"])(input.config.itkModulesPath, 'MeshIOs', trialIO);
              _ioModule = ioToModule[trialIO];
            }

            meshIO = new _ioModule.ITKMeshIO();

            _ioModule.mkdirs(mountpoint);

            _filePath = "".concat(mountpoint, "/").concat(input.name);

            _ioModule.writeFile(_filePath, new Uint8Array(input.data));

            meshIO.SetFileName(_filePath);

            if (!meshIO.CanReadFile(_filePath)) {
              _context2.next = 25;
              break;
            }

            io = trialIO;

            _ioModule.unlink(_filePath);

            return _context2.abrupt("break", 29);

          case 25:
            _ioModule.unlink(_filePath);

          case 26:
            ++idx;
            _context2.next = 12;
            break;

          case 29:
            if (!(io === null)) {
              _context2.next = 32;
              break;
            }

            ioToModule = {};
            throw new Error('Could not find IO for: ' + input.name);

          case 32:
            ioModule = null;

            if (io in ioToModule) {
              ioModule = ioToModule[io];
            } else {
              ioToModule[io] = (0, _loadEmscriptenModuleBrowser["default"])(input.config.itkModulesPath, 'MeshIOs', io);
              ioModule = ioToModule[io];
            }

            ioModule.mkdirs(mountpoint);
            filePath = "".concat(mountpoint, "/").concat(input.name);
            ioModule.writeFile(filePath, new Uint8Array(input.data));
            mesh = (0, _readMeshEmscriptenFSFile["default"])(ioModule, filePath);
            ioModule.unlink(filePath);
            transferables = [];

            if (mesh.points) {
              transferables.push(mesh.points.buffer);
            }

            if (mesh.pointData) {
              transferables.push(mesh.pointData.buffer);
            }

            if (mesh.cells) {
              transferables.push(mesh.cells.buffer);
            }

            if (mesh.cellData) {
              transferables.push(mesh.cellData.buffer);
            }

            return _context2.abrupt("return", new _register["default"].TransferableResponse(mesh, transferables));

          case 45:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _readMesh.apply(this, arguments);
}

function writeMesh(_x2) {
  return _writeMesh.apply(this, arguments);
}

function _writeMesh() {
  _writeMesh = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(input) {
    var extension, mountpoint, io, idx, _ioModule2, trialIO, meshIO, _filePath2, ioModule, filePath, writtenFile;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            extension = (0, _getFileExtension["default"])(input.name);
            mountpoint = '/work';
            io = null;

            if (!_MimeToMeshIO["default"].has(input.type)) {
              _context3.next = 7;
              break;
            }

            io = _MimeToMeshIO["default"].get(input.type);
            _context3.next = 25;
            break;

          case 7:
            if (!_extensionToMeshIO["default"].has(extension)) {
              _context3.next = 11;
              break;
            }

            io = _extensionToMeshIO["default"].get(extension);
            _context3.next = 25;
            break;

          case 11:
            idx = 0;

          case 12:
            if (!(idx < _MeshIOIndex["default"].length)) {
              _context3.next = 25;
              break;
            }

            _ioModule2 = null;
            trialIO = _MeshIOIndex["default"][idx];

            if (trialIO in ioToModule) {
              _ioModule2 = ioToModule[trialIO];
            } else {
              ioToModule[trialIO] = (0, _loadEmscriptenModuleBrowser["default"])(input.config.itkModulesPath, 'MeshIOs', trialIO);
              _ioModule2 = ioToModule[trialIO];
            }

            meshIO = new _ioModule2.ITKMeshIO();
            _filePath2 = mountpoint + '/' + input.name;
            meshIO.SetFileName(_filePath2);

            if (!meshIO.CanWriteFile(_filePath2)) {
              _context3.next = 22;
              break;
            }

            io = trialIO;
            return _context3.abrupt("break", 25);

          case 22:
            ++idx;
            _context3.next = 12;
            break;

          case 25:
            if (!(io === null)) {
              _context3.next = 28;
              break;
            }

            ioToModule = {};
            throw new Error('Could not find IO for: ' + input.name);

          case 28:
            ioModule = null;

            if (io in ioToModule) {
              ioModule = ioToModule[io];
            } else {
              ioToModule[io] = (0, _loadEmscriptenModuleBrowser["default"])(input.config.itkModulesPath, 'MeshIOs', io);
              ioModule = ioToModule[io];
            }

            filePath = "".concat(mountpoint, "/").concat(input.name);
            ioModule.mkdirs(mountpoint);
            (0, _writeMeshEmscriptenFSFile["default"])(ioModule, {
              useCompression: input.useCompression,
              binaryFileType: input.binaryFileType
            }, input.mesh, filePath);
            writtenFile = ioModule.readFile(filePath, {
              encoding: 'binary'
            });
            ioModule.unlink(filePath);
            return _context3.abrupt("return", new _register["default"].TransferableResponse(writtenFile.buffer, [writtenFile.buffer]));

          case 36:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _writeMesh.apply(this, arguments);
}

(0, _register["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(input) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(input.operation === 'readMesh')) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", readMesh(input));

          case 4:
            if (!(input.operation === 'writeMesh')) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", writeMesh(input));

          case 8:
            throw new Error('Unknown worker operation');

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x3) {
    return _ref.apply(this, arguments);
  };
}());

},{"../MeshIOIndex":11,"../MimeToMeshIO":13,"../extensionToMeshIO":16,"../getFileExtension":17,"../loadEmscriptenModuleBrowser":18,"../readMeshEmscriptenFSFile":23,"../writeMeshEmscriptenFSFile":24,"@babel/runtime/helpers/asyncToGenerator":1,"@babel/runtime/helpers/interopRequireDefault":2,"@babel/runtime/regenerator":5,"webworker-promise/lib/register":6}],16:[function(require,module,exports){
"use strict";

var extensionToIO = new Map([['vtk', 'itkVTKPolyDataMeshIOJSBinding'], ['VTK', 'itkVTKPolyDataMeshIOJSBinding'], ['byu', 'itkBYUMeshIOJSBinding'], ['BYU', 'itkBYUMeshIOJSBinding'], ['fsa', 'itkFreeSurferAsciiMeshIOJSBinding'], ['FSA', 'itkFreeSurferAsciiMeshIOJSBinding'], ['fsb', 'itkFreeSurferBinaryMeshIOJSBinding'], ['FSB', 'itkFreeSurferBinaryMeshIOJSBinding'], ['obj', 'itkOBJMeshIOJSBinding'], ['OBJ', 'itkOBJMeshIOJSBinding'], ['off', 'itkOFFMeshIOJSBinding'], ['OFF', 'itkOFFMeshIOJSBinding'], ['stl', 'itkSTLMeshIOJSBinding'], ['STL', 'itkSTLMeshIOJSBinding']]);
module.exports = extensionToIO;

},{}],17:[function(require,module,exports){
"use strict";

var getFileExtension = function getFileExtension(filePath) {
  var extension = filePath.slice((filePath.lastIndexOf('.') - 1 >>> 0) + 2);

  if (extension.toLowerCase() === 'gz') {
    var index = filePath.slice(0, -3).lastIndexOf('.');
    extension = filePath.slice((index - 1 >>> 0) + 2);
  }

  return extension;
};

module.exports = getFileExtension;

},{}],18:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

// Load the Emscripten module in the browser.
//
// If the browser supports WebAssembly, then use the path the the WebAssembly
// wrapper module instead.
//
// If itkModulesPath is a relative Path, then resolve assuming we were called
// from <itkModulesPath>/WebWorkers/, since modules are loaded by the web
// workers.
//
// itkModulesPath is usually taken from './itkConfig', but a different value
// could be passed.
//
// If isAbsoluteURL is `true`, then itkModulesPath is not used, and
// pipelinePath is assumed to be an absoluteURL.
//
// modulesDirectory is one of "ImageIOs", "MeshIOs", or "Pipelines"
//
// pipelinePath is the file name of the emscripten module without the ".js"
// extension
function loadEmscriptenModule(itkModulesPath, modulesDirectory, pipelinePath, isAbsoluteURL) {
  var prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  var moduleScriptDir = prefix + '/' + modulesDirectory;

  if ((typeof WebAssembly === "undefined" ? "undefined" : (0, _typeof2["default"])(WebAssembly)) === 'object' && typeof WebAssembly.Memory === 'function') {
    var modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js';
    }

    importScripts(modulePath);
    var moduleBaseName = pipelinePath.replace(/.*\//, '');
    var module = self[moduleBaseName]({
      moduleScriptDir: moduleScriptDir,
      isAbsoluteURL: isAbsoluteURL,
      pipelinePath: pipelinePath
    });
    return module;
  } else {
    var _modulePath = moduleScriptDir + '/' + pipelinePath + '.js';

    if (isAbsoluteURL) {
      _modulePath = pipelinePath + '.js';
    }

    importScripts(_modulePath);
    return Module;
  }
}

var _default = loadEmscriptenModule;
exports["default"] = _default;

},{"@babel/runtime/helpers/interopRequireDefault":2,"@babel/runtime/helpers/typeof":3}],19:[function(require,module,exports){
"use strict";

var IntTypes = require('./IntTypes.js');

var FloatTypes = require('./FloatTypes.js');

var meshIOComponentToJSComponent = function meshIOComponentToJSComponent(module, ioComponentType) {
  var componentType = null;

  switch (ioComponentType) {
    case module.IOComponentType.UNKNOWNCOMPONENTTYPE:
      {
        componentType = null;
        break;
      }

    case module.IOComponentType.UCHAR:
      {
        componentType = IntTypes.UInt8;
        break;
      }

    case module.IOComponentType.CHAR:
      {
        componentType = IntTypes.Int8;
        break;
      }

    case module.IOComponentType.USHORT:
      {
        componentType = IntTypes.UInt16;
        break;
      }

    case module.IOComponentType.SHORT:
      {
        componentType = IntTypes.Int16;
        break;
      }

    case module.IOComponentType.UINT:
      {
        componentType = IntTypes.UInt32;
        break;
      }

    case module.IOComponentType.INT:
      {
        componentType = IntTypes.Int32;
        break;
      }

    case module.IOComponentType.ULONG:
      {
        componentType = IntTypes.UInt64;
        break;
      }

    case module.IOComponentType.LONG:
      {
        componentType = IntTypes.Int64;
        break;
      }

    case module.IOComponentType.ULONGLONG:
      {
        componentType = IntTypes.UInt64;
        break;
      }

    case module.IOComponentType.LONGLONG:
      {
        componentType = IntTypes.Int64;
        break;
      }

    case module.IOComponentType.FLOAT:
      {
        componentType = FloatTypes.Float32;
        break;
      }

    case module.IOComponentType.DOUBLE:
      {
        componentType = FloatTypes.Float64;
        break;
      }

    default:
      throw new Error('Unknown IO component type');
  }

  return componentType;
};

module.exports = meshIOComponentToJSComponent;

},{"./FloatTypes.js":8,"./IntTypes.js":9}],20:[function(require,module,exports){
"use strict";

var PixelTypes = require('./PixelTypes.js');

var meshIOPixelTypeToJSPixelType = function meshIOPixelTypeToJSPixelType(module, ioPixelType) {
  var pixelType = null;

  switch (ioPixelType) {
    case module.IOPixelType.UNKNOWNPIXELTYPE:
      {
        pixelType = PixelTypes.Unknown;
        break;
      }

    case module.IOPixelType.SCALAR:
      {
        pixelType = PixelTypes.Scalar;
        break;
      }

    case module.IOPixelType.RGB:
      {
        pixelType = PixelTypes.RGB;
        break;
      }

    case module.IOPixelType.RGBA:
      {
        pixelType = PixelTypes.RGBA;
        break;
      }

    case module.IOPixelType.OFFSET:
      {
        pixelType = PixelTypes.Offset;
        break;
      }

    case module.IOPixelType.VECTOR:
      {
        pixelType = PixelTypes.Vector;
        break;
      }

    case module.IOPixelType.POINT:
      {
        pixelType = PixelTypes.Point;
        break;
      }

    case module.IOPixelType.COVARIANTVECTOR:
      {
        pixelType = PixelTypes.CovariantVector;
        break;
      }

    case module.IOPixelType.SYMMETRICSECONDRANKTENSOR:
      {
        pixelType = PixelTypes.SymmetricSecondRankTensor;
        break;
      }

    case module.IOPixelType.DIFFUSIONTENSOR3D:
      {
        pixelType = PixelTypes.DiffusionTensor3D;
        break;
      }

    case module.IOPixelType.COMPLEX:
      {
        pixelType = PixelTypes.Complex;
        break;
      }

    case module.IOPixelType.FIXEDARRAY:
      {
        pixelType = PixelTypes.FixedArray;
        break;
      }

    case module.IOPixelType.ARRAY:
      {
        pixelType = PixelTypes.Array;
        break;
      }

    case module.IOPixelType.MATRIX:
      {
        pixelType = PixelTypes.Matrix;
        break;
      }

    case module.IOPixelType.VARIABLELENGTHVECTOR:
      {
        pixelType = PixelTypes.VariableLengthVector;
        break;
      }

    case module.IOPixelType.VARIABLESIZEMATRIX:
      {
        pixelType = PixelTypes.VariableSizeMatrix;
        break;
      }

    default:
      throw new Error('Unknown IO pixel type');
  }

  return pixelType;
};

module.exports = meshIOPixelTypeToJSPixelType;

},{"./PixelTypes.js":14}],21:[function(require,module,exports){
"use strict";

var IntTypes = require('./IntTypes.js');

var FloatTypes = require('./FloatTypes.js');

var meshJSComponentToIOComponent = function meshJSComponentToIOComponent(module, componentType) {
  var ioComponentType = null;

  switch (componentType) {
    case null:
      {
        ioComponentType = module.IOComponentType.UNKNOWNCOMPONENTTYPE;
        break;
      }

    case IntTypes.UInt8:
      {
        ioComponentType = module.IOComponentType.UCHAR;
        break;
      }

    case IntTypes.Int8:
      {
        ioComponentType = module.IOComponentType.CHAR;
        break;
      }

    case IntTypes.UInt16:
      {
        ioComponentType = module.IOComponentType.USHORT;
        break;
      }

    case IntTypes.Int16:
      {
        ioComponentType = module.IOComponentType.SHORT;
        break;
      }

    case IntTypes.UInt32:
      {
        ioComponentType = module.IOComponentType.UINT;
        break;
      }

    case IntTypes.Int32:
      {
        ioComponentType = module.IOComponentType.INT;
        break;
      }

    case IntTypes.UInt64:
      {
        ioComponentType = module.IOComponentType.ULONGLONG;
        break;
      }

    case IntTypes.Int64:
      {
        ioComponentType = module.IOComponentType.LONGLONG;
        break;
      }

    case FloatTypes.Float32:
      {
        ioComponentType = module.IOComponentType.FLOAT;
        break;
      }

    case FloatTypes.Float64:
      {
        ioComponentType = module.IOComponentType.DOUBLE;
        break;
      }

    default:
      throw new Error('Unknown IO component type');
  }

  return ioComponentType;
};

module.exports = meshJSComponentToIOComponent;

},{"./FloatTypes.js":8,"./IntTypes.js":9}],22:[function(require,module,exports){
"use strict";

var PixelTypes = require('./PixelTypes.js');

var meshJSPixelTypeToIOPixelType = function meshJSPixelTypeToIOPixelType(module, pixelType) {
  var ioPixelType = null;

  switch (pixelType) {
    case PixelTypes.Unknown:
      {
        ioPixelType = module.IOPixelType.UNKNOWNPIXELTYPE;
        break;
      }

    case PixelTypes.Scalar:
      {
        ioPixelType = module.IOPixelType.SCALAR;
        break;
      }

    case PixelTypes.RGB:
      {
        ioPixelType = module.IOPixelType.RGB;
        break;
      }

    case PixelTypes.RGBA:
      {
        ioPixelType = module.IOPixelType.RGBA;
        break;
      }

    case PixelTypes.Offset:
      {
        ioPixelType = module.IOPixelType.OFFSET;
        break;
      }

    case PixelTypes.Vector:
      {
        ioPixelType = module.IOPixelType.VECTOR;
        break;
      }

    case PixelTypes.Point:
      {
        ioPixelType = module.IOPixelType.POINT;
        break;
      }

    case PixelTypes.CovariantVector:
      {
        ioPixelType = module.IOPixelType.COVARIANTVECTOR;
        break;
      }

    case PixelTypes.SymmetricSecondRankTensor:
      {
        ioPixelType = module.IOPixelType.SYMMETRICSECONDRANKTENSOR;
        break;
      }

    case PixelTypes.DiffusionTensor3D:
      {
        ioPixelType = module.IOPixelType.DIFFUSIONTENSOR3D;
        break;
      }

    case PixelTypes.Complex:
      {
        ioPixelType = module.IOPixelType.COMPLEX;
        break;
      }

    case PixelTypes.FixedArray:
      {
        ioPixelType = module.IOPixelType.FIXEDARRAY;
        break;
      }

    case PixelTypes.Array:
      {
        ioPixelType = module.IOPixelType.ARRAY;
        break;
      }

    case PixelTypes.Matrix:
      {
        ioPixelType = module.IOPixelType.MATRIX;
        break;
      }

    case PixelTypes.VariableLengthVector:
      {
        ioPixelType = module.IOPixelType.VARIABLELENGTHVECTOR;
        break;
      }

    case PixelTypes.VariableSizeMatrix:
      {
        ioPixelType = module.IOPixelType.VARIABLESIZEMATRIX;
        break;
      }

    default:
      throw new Error('Unknown IO pixel type');
  }

  return ioPixelType;
};

module.exports = meshJSPixelTypeToIOPixelType;

},{"./PixelTypes.js":14}],23:[function(require,module,exports){
"use strict";

var Mesh = require('./Mesh.js');

var MeshType = require('./MeshType.js');

var meshIOComponentToJSComponent = require('./meshIOComponentToJSComponent.js');

var meshIOPixelTypeToJSPixelType = require('./meshIOPixelTypeToJSPixelType.js');

var readMeshEmscriptenFSFile = function readMeshEmscriptenFSFile(module, filePath) {
  var meshIO = new module.ITKMeshIO();
  meshIO.SetFileName(filePath);

  if (!meshIO.CanReadFile(filePath)) {
    throw new Error('Could not read file: ' + filePath);
  }

  meshIO.ReadMeshInformation();
  var ioDimensions = meshIO.GetPointDimension();
  var meshType = new MeshType(ioDimensions);
  var pointComponentType = meshIO.GetPointComponentType();
  meshType.pointComponentType = meshIOComponentToJSComponent(module, pointComponentType);
  var cellComponentType = meshIO.GetCellComponentType();
  meshType.cellComponentType = meshIOComponentToJSComponent(module, cellComponentType);
  var pointPixelComponentType = meshIO.GetPointPixelComponentType();
  meshType.pointPixelComponentType = meshIOComponentToJSComponent(module, pointPixelComponentType);
  var pointPixelType = meshIO.GetPointPixelType();
  meshType.pointPixelType = meshIOPixelTypeToJSPixelType(module, pointPixelType);
  meshType.pointPixelComponents = meshIO.GetNumberOfPointPixelComponents();
  var cellPixelComponentType = meshIO.GetCellPixelComponentType();
  meshType.cellPixelComponentType = meshIOComponentToJSComponent(module, cellPixelComponentType);
  var cellPixelType = meshIO.GetCellPixelType();
  meshType.cellPixelType = meshIOPixelTypeToJSPixelType(module, cellPixelType);
  meshType.cellPixelComponents = meshIO.GetNumberOfCellPixelComponents();
  var mesh = new Mesh(meshType);
  mesh.numberOfPoints = meshIO.GetNumberOfPoints();

  if (mesh.numberOfPoints > 0) {
    mesh.points = meshIO.ReadPoints();
  }

  mesh.numberOfCells = meshIO.GetNumberOfCells();

  if (mesh.numberOfCells > 0) {
    mesh.cellBufferSize = meshIO.GetCellBufferSize();
    mesh.cells = meshIO.ReadCells();
  }

  mesh.numberofPointPixels = meshIO.GetNumberOfPointPixels();

  if (mesh.numberOfPointPixels > 0) {
    mesh.pointData = meshIO.ReadPointData();
  }

  mesh.numberofCellPixels = meshIO.GetNumberOfCellPixels();

  if (mesh.numberOfCellPixels > 0) {
    mesh.cellData = meshIO.ReadCellData();
  }

  return mesh;
};

module.exports = readMeshEmscriptenFSFile;

},{"./Mesh.js":10,"./MeshType.js":12,"./meshIOComponentToJSComponent.js":19,"./meshIOPixelTypeToJSPixelType.js":20}],24:[function(require,module,exports){
"use strict";

var meshJSComponentToIOComponent = require('./meshJSComponentToIOComponent.js');

var meshJSPixelTypeToIOPixelType = require('./meshJSPixelTypeToIOPixelType.js');

var writeMeshEmscriptenFSFile = function writeMeshEmscriptenFSFile(module, _ref, mesh, filePath) {
  var useCompression = _ref.useCompression,
      binaryFileType = _ref.binaryFileType;
  var meshIO = new module.ITKMeshIO();
  meshIO.SetFileName(filePath);

  if (!meshIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath);
  }

  var dimension = mesh.meshType.dimension;
  meshIO.SetPointDimension(dimension);
  var pointIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.pointComponentType);
  meshIO.SetPointComponentType(pointIOComponentType);
  var cellIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.cellComponentType);
  meshIO.SetCellComponentType(cellIOComponentType);
  var pointPixelIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.pointPixelComponentType);
  meshIO.SetPointPixelComponentType(pointPixelIOComponentType);
  var pointIOPixelType = meshJSPixelTypeToIOPixelType(module, mesh.meshType.pointPixelType);
  meshIO.SetPointPixelType(pointIOPixelType);
  meshIO.SetNumberOfPointPixelComponents(mesh.meshType.pointPixelComponents);
  var cellPixelIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.cellPixelComponentType);
  meshIO.SetCellPixelComponentType(cellPixelIOComponentType);
  var cellIOPixelType = meshJSPixelTypeToIOPixelType(module, mesh.meshType.cellPixelType);
  meshIO.SetCellPixelType(cellIOPixelType);
  meshIO.SetNumberOfCellPixelComponents(mesh.meshType.cellPixelComponents);
  meshIO.SetUseCompression(!!useCompression);

  if (binaryFileType) {
    meshIO.SetFileType(module.FileType.BINARY);
  } else {
    meshIO.SetFileType(module.FileType.ASCII);
  }

  meshIO.SetByteOrder(module.ByteOrder.LittleEndian);
  meshIO.SetNumberOfPoints(mesh.numberOfPoints);

  if (mesh.numberOfPoints > 0) {
    meshIO.SetUpdatePoints(true);
  }

  meshIO.SetNumberOfPointPixels(mesh.numberOfPointPixels);

  if (mesh.numberOfPointPixels > 0) {
    meshIO.SetUpdatePointData(true);
  }

  meshIO.SetNumberOfCells(mesh.numberOfCells);

  if (mesh.numberOfCells > 0) {
    meshIO.SetUpdateCells(true);
  }

  meshIO.SetNumberOfCellPixels(mesh.numberOfCellPixels);
  meshIO.SetCellBufferSize(mesh.cellBufferSize);

  if (mesh.numberOfCellPixels > 0) {
    meshIO.SetUpdatePointData(true);
  }

  meshIO.WriteMeshInformation();

  if (mesh.numberOfPoints > 0) {
    var numberOfBytes = mesh.points.length * mesh.points.BYTES_PER_ELEMENT;

    var dataPtr = module._malloc(numberOfBytes);

    var dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes);
    dataHeap.set(new Uint8Array(mesh.points.buffer));
    meshIO.WritePoints(dataHeap.byteOffset);

    module._free(dataHeap.byteOffset);
  }

  if (mesh.numberOfCells > 0) {
    var _numberOfBytes = mesh.cells.length * mesh.cells.BYTES_PER_ELEMENT;

    var _dataPtr = module._malloc(_numberOfBytes);

    var _dataHeap = new Uint8Array(module.HEAPU8.buffer, _dataPtr, _numberOfBytes);

    _dataHeap.set(new Uint8Array(mesh.cells.buffer));

    meshIO.WriteCells(_dataHeap.byteOffset);

    module._free(_dataHeap.byteOffset);
  }

  if (mesh.numberOfPointPixels > 0) {
    var _numberOfBytes2 = mesh.pointData.length * mesh.pointData.BYTES_PER_ELEMENT;

    var _dataPtr2 = module._malloc(_numberOfBytes2);

    var _dataHeap2 = new Uint8Array(module.HEAPU8.buffer, _dataPtr2, _numberOfBytes2);

    _dataHeap2.set(new Uint8Array(mesh.pointData.buffer));

    meshIO.WritePointData(_dataHeap2.byteOffset);

    module._free(_dataHeap2.byteOffset);
  }

  if (mesh.numberOfCellPixels > 0) {
    var _numberOfBytes3 = mesh.cellData.length * mesh.cellData.BYTES_PER_ELEMENT;

    var _dataPtr3 = module._malloc(_numberOfBytes3);

    var _dataHeap3 = new Uint8Array(module.HEAPU8.buffer, _dataPtr3, _numberOfBytes3);

    _dataHeap3.set(new Uint8Array(mesh.cellData.buffer));

    meshIO.WriteCellData(_dataHeap3.byteOffset);

    module._free(_dataHeap3.byteOffset);
  }

  meshIO.Write();
};

module.exports = writeMeshEmscriptenFSFile;

},{"./meshJSComponentToIOComponent.js":21,"./meshJSPixelTypeToIOPixelType.js":22}]},{},[15]);
