// RequestAnimationFrame Polyfill
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.2.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    function lib$es6$promise$asap$$asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    var lib$es6$promise$asap$$default = lib$es6$promise$asap$$asap;
    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$default(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$default;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$default(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

function Timemap(dateObj) {
    'use strict';

    var dateObj = dateObj || new Date(),
    month = dateObj.getMonth(), // cus javascript starts month at 0
    day = dateObj.getDate(),
    dayOfWeek = dateObj.getDay(),
    year = dateObj.getFullYear(),
    time = dateObj.getTime(),
    hour = dateObj.getHours(),
    minutes = dateObj.getMinutes(),
    seconds = dateObj.getSeconds();

    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    function format(str) {
        return str.replace(/Y/, year) // 2015
        .replace(/y/, year.toString().substr(2,3)) //15
        .replace(/mm/, month+1) //5, 9, 11
        .replace(/MM/, (month.toString().length > 1) ? month + 1 : '0'+(month+1)) // 05, 09, 11
        .replace(/M/, months[month]) // January, March, June
        .replace(/m/, months[month].toString().substr(0,3)) // Jan, Mar, Jun
        .replace(/dd/, day) // 1, 5, 20, 26
        .replace(/DD/, (day.toString().length > 1) ? day : '0'+day) // 01, 04, 15, 22
        .replace(/d/, days[dayOfWeek].toString().substr(0,3)) // Mon, Tue
        .replace(/D/, days[dayOfWeek]); // Monday, Tuesday
    }
    
    return {
        date: dateObj,
        format: format
    };
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = Timemap;
}

var kickback = (function(kickback) {
    'use strict';
    // make a new object
    kickback = {};

    // private method
    function _serialize(obj) {
        var str = [];
        for(var p in obj){
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    };

    // main public method
    kickback.request = function(kbOptions) {
        // options configuration and defaults
        if(typeof kbOptions === 'string') {
            // assume it's a url and we are using GET 
            var tmp = kbOptions;
            kbOptions = {};
            kbOptions.url = tmp;
            tmp = null;
        }

        kbOptions.url = (kbOptions.url) ? kbOptions.url : '/';
        kbOptions.data = (kbOptions.data) ? kbOptions.data : null;
        kbOptions.method = (kbOptions.method) ? kbOptions.method : 'GET';
        kbOptions.headers = (kbOptions.headers) ? kbOptions.headers : false;
        kbOptions.cors = (kbOptions.cors) ? kbOptions.cors : false;
        kbOptions.async = (kbOptions.async) ? kbOptions.async : true;
        kbOptions.serialize = (kbOptions.serialize) ? kbOptions.serialize : false;
        kbOptions.auto = (kbOptions.auto) ? kbOptions.auto : false; 
        Object.defineProperty(kbOptions, 'tmp', {
            configurable: true,
            writable: true
        });

        if(kbOptions.auto === true) {
            if(typeof window.FormData !== 'undefined') { 
                if(kbOptions.data instanceof HTMLElement) {
                    kbOptions.data = new FormData(kbOptions.data);
                } else if (typeof kbOptions.data === 'object' && kbOptions.data instanceof Array === false) {
                    kbOptions.tmp = kbOptions.data;
                    kbOptions.data = new FormData();
                    Object.keys(kbOptions.tmp).forEach(function(key) {
                        kbOptions.data.append(key, kbOptions.tmp[key]);
                    });
                    delete kbOptions.tmp;
                } else {
                    throw new Error('Submit data as object or HTMLElement');
                }
            } else {
                if(kbOptions.data instanceof HTMLElement) {
                    kbOptions.tmp = {};
                    [].forEach.call(kbOptions.data, function(elem) {
                        kbOptions.tmp[elem.name] = elem.value;
                    });
                    kbOptions.data = kbOptions.tmp;
                    delete kbOptions.tmp;
                }
                
                kbOptions.serialize = true;
            }
        }

        if(kbOptions.serialize === true) {
            kbOptions.data = _serialize(kbOptions.data);
        }

        if(kbOptions.data instanceof FormData) {
            console.log('formDATA');
        } else {
            console.log('notFormData');
        } 

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(kbOptions.method, kbOptions.url, kbOptions.async);

            // check status
            xhr.onload = function() {
                if(xhr.status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(Error('Error: ', xhr.statusTxt));
                }
            };

            // network error
            xhr.onerror = function() {
                reject(Error('Network Error'));
            };

            // set headers
            if(kbOptions.headers !== false) {
                kbOptions.headers.type = kbOptions.headers.type || 'Content-Type';
                kbOptions.headers.value = kbOptions.headers.value || 'text/plain;charset=UTF-8';
                xhr.setRequestHeader(kbOptions.headers.type, kbOptions.headers.value);
            }
            
            if(kbOptions.headers === false && kbOptions.method.toLowerCase() === 'post' && kbOptions.serialize === true) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            // make the request
            if(kbOptions.method.toLowerCase() === 'get') {
                xhr.send(null);
            } else {
                xhr.send(kbOptions.data);
            }
        });
    }; // end main method


    return kickback;

}(kickback));

// see if we are in node if so support it!
if(typeof module !== 'undefined' && module.exports) {
    module.exports = kickback;
}

(function() {
  'use strict';

  var contactForm = document.getElementById('contact');
  var submitBtn = document.querySelector('button[type="submit"]');

  [].forEach.call(contactForm, function(input) {
    if(input.nodeName !== 'BUTTON') {
      input.addEventListener('focus', function(e) {
        var inputName = e.target.name;
        var inputLabel = document.querySelector('label[for="'+inputName+'"]');
        inputLabel.classList.add('active');
      }, false);
      input.addEventListener('blur', function(e) {
        var inputName = e.target.name;
        var inputLabel = document.querySelector('label[for="'+inputName+'"]');
        if(e.target.value.length) {
          inputLabel.classList.add('valid');
        }
        if(!e.target.value.length) {
          inputLabel.classList.remove('valid');
          inputLabel.classList.add('error');
        }
        inputLabel.classList.remove('active');
      }, false);
    }
  });

  document.addEventListener('submit', function(e) {
    e.preventDefault();
    var formError = {};

    [].forEach.call(contactForm, function(formInput) {
      if(formInput.nodeName !== 'BUTTON') {
        if(formInput.value == '') {
          formError[formInput.name] = 'required';
        } else {
          var inputLabel = document.querySelector('label[for="'+formInput.name+'"]');
          inputLabel.classList.remove('error');
          inputLabel.classList.add('valid');
        }
      }
    });

    if(Object.keys(formError).length) {
      for(var error in formError) {
        if(formError.hasOwnProperty(error)) {
          var errorLabel = document.querySelector('label[for="'+error+'"]');
          errorLabel.classList.add('error');
          console.log('Error '+error+' '+formError[error]);
        }
      }
    } else {
      document.body.style.cursor = 'wait';
      submitBtn.setAttribute('disabled', true);
      kickback.request({
        url: '/contact',
        data: {
            name_full: contactForm.name_full.value,
            email: contactForm.email.value,
            msg: contactForm.msg.value
        },
        method: 'POST',
        serialize: true
      })
      .then(function(response) {
        if(response.success === true) {
          console.log('SUCCESS', response);
          document.body.style.cursor = 'initial';
          submitBtn.removeAttribute('disabled');
        } else if(response.code.length) {
          console.log('hmmm', response);
          document.body.style.cursor = 'initial';
          submitBtn.removeAttribute('disabled');
        } else {
          console.log('dang', response);
          document.body.style.cursor = 'initial';
          submitBtn.removeAttribute('disabled');
        }
        return response;
      })['catch'](function (err) {
        return new Error('Prom fail: ',err);
      });
    }

  }, false);
})();

(function(window) {
    'use strict';

    var scrollTimer = null,
        scrollCacheTimer = null,
        cacheScrollPos = 0,
        scrollDirection;

    var skillsList = document.querySelectorAll('.skill-bar');

    var navmenu = document.querySelector('ul[role="menubar"]'),
        menubar = document.getElementById('main-nav'),
        masthead = document.getElementById('masthead');

    var sections = [
            '#about',
            '#work',
            '#skills',
            '#projects',
            '#education'
        ];

    var initialBGColor = '#eaeaea',
        bGColor_1 = '#AFB4D8',
        bGColor_2 = '#6F94BE',
        bGColor_3 = '#6EAEB3',
        bGColor_4 = '#66CF97',
        bGColor_5 = '#49DB45',
        bGColor_6 = '#1DE410';

    function scrollSetCached() {
        cacheScrollPos = window.scrollY;
        console.log('set cache Y', cacheScrollPos);
    }

    function handleScroll() {
        console.log('scrolling stopped');
        console.log('dir', scrollDirection);
        if(scrollDirection == 'down') {
          navmenu.classList.remove('active');
          menubar.classList.add('hide-nav');
        }
    }

    function listSkills(status) {
      if(!status) {
        console.log('SKILLS NOT view remove list');
        Array.prototype.forEach.call(skillsList, function(item) {
          item.classList.remove('active');
        });
      } else {
        console.log('SKILLS in view add list');
        Array.prototype.forEach.call(skillsList, function(item) {
          item.classList.add('active');
        });
      }
    }

    function isElementVisible(elem) {
        if(typeof elem === 'string') {
          var elemAnchor = document.querySelector('a[href="'+elem+'"]');
          elem = document.querySelector(elem);
        }

        if(!elem) {
          return false;
        }

        var rect = elem.getBoundingClientRect();

        if(rect.top > (window.innerHeight - 150) || rect.bottom < 150) {
            console.log(elem, 'is NOT in view');
            if(elem.classList.contains('in-view')) {
                elem.classList.remove('in-view');
            }
            if(elemAnchor.classList.contains('active-nav')) {
                elemAnchor.classList.remove('active-nav');
            }

            return false;
        } else {
            console.log(elem, 'is in view');
            console.log(elemAnchor, 'is active');
            elem.classList.add('in-view');
            elemAnchor.classList.add('active-nav');

            return true;
        }
    }

    window.onscroll = function detectScroll(e) {
        if(scrollTimer != null) {
            clearTimeout(scrollTimer);
        }

        if(scrollCacheTimer != null) {
            clearTimeout(scrollCacheTimer);
        }

        if(cacheScrollPos < window.scrollY) {
            //scrolling down
            scrollDirection = 'down';
            //menubar.classList.add('hide-nav');
        }
        if(cacheScrollPos > window.scrollY) {
            //scrolling up
            scrollDirection = 'up';
            menubar.classList.remove('hide-nav');
        }

        scrollTimer = setTimeout(handleScroll, 500);
        scrollCacheTimer = setTimeout(scrollSetCached, 100);

        if(window.scrollY == 0) { masthead.style.backgroundColor = initialBGColor; }
        if(window.scrollY > 0 && window.scrollY <= 20) { masthead.style.backgroundColor = bGColor_1; }
        if(window.scrollY >= 21 && window.scrollY <= 40) { masthead.style.backgroundColor = bGColor_2; }
        if(window.scrollY >= 41 && window.scrollY <= 60) { masthead.style.backgroundColor = bGColor_3; }
        if(window.scrollY >= 61 && window.scrollY <= 80) { masthead.style.backgroundColor = bGColor_4; }
        if(window.scrollY >= 81 && window.scrollY <= 100) { masthead.style.backgroundColor = bGColor_5; }
        if(window.scrollY >= 101 && window.scrollY <= 120) { masthead.style.backgroundColor = bGColor_6; }
        if(window.scrollY >= 121) { masthead.style.backgroundColor = initialBGColor; }

        sections.forEach(function(elem) {
            isElementVisible(elem);
            if(elem == '#skills') {
              if(isElementVisible(elem)) {
                listSkills(true);
              } else {
                listSkills(false);
              }
            }
        });
    };

})(window);

(function() {

    'use strict';

    // Function to animate the scroll
    var smoothScroll = function(anchor, duration, offset) {

      // Calculate how far and how fast to scroll
      var startLocation = window.pageYOffset;
      var endLocation = anchor.offsetTop;
      var distance = endLocation - startLocation;
      var increments = distance / (duration / 16);
      var stopAnimation, runAnimation, travelled;

      if(offset > 0) {
        endLocation = endLocation - offset;
      }

      // Scroll the page by an increment, and check if it's time to stop
      var animateScroll = function() {
        window.scrollBy(0, increments);
        travelled = window.pageYOffset;

        runAnimation = requestAnimationFrame(animateScroll);

        // If scrolling down
          if (increments >= 0) {
            // Stop animation when you reach the anchor OR the bottom of the page
              if ((travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight)) {
                cancelAnimationFrame(runAnimation);
              }
          }
          // If scrolling up
          else {
            // Stop animation when you reach the anchor OR the top of the page
              if (travelled <= (endLocation || 0)) {
                cancelAnimationFrame(runAnimation);
              }
          }
      };

      // Loop the animation function
      runAnimation = requestAnimationFrame(animateScroll);

    };

    // When the smooth scroll link is clicked
    document.addEventListener('click', function(e) {
    // event delegation
    if(e.target && e.target.nodeName == 'A') {
        if(e.target.classList.contains('scroll')) {
            e.preventDefault();

            // Get anchor link and calculate distance from the top
            var dataID = e.target.getAttribute('href');
            var dataTarget = document.querySelector(dataID);
            var dataSpeed = (e.target.getAttribute('data-scroll-speed')) ? e.target.getAttribute('data-scroll-speed') : 500;
            var dataOffset = (e.target.getAttribute('data-scroll-offset')) ? e.target.getAttribute('data-scroll-offset') : 0;

            // If the anchor exists
            if (dataTarget) {
              // Scroll to the anchor
              smoothScroll(dataTarget, dataSpeed, dataOffset);
            }
        }
    }

    }, false);

})();

window.addEventListener('load', function() {
    var gitfeed;
    var feedContainer = document.getElementById('feed');
    var gitRegEx = /(<a.*?href\s*=\s*[\"'])\s*/ig;
    var gitURL = "https://github.com";

    function feedBuilder(feed, limit) {
        limit = limit || 3;

        for(var i = 0; i < limit; i++) {
            var elem = document.createElement('div');
            var processedFeed = feed[i].content[0]._.replace(gitRegEx, "$1"+gitURL);
            elem.classList.add('alert');
            elem.innerHTML = processedFeed;
            feedContainer.appendChild(elem);
        }

        return;
    }

    kickback.request({
        url: '/feed',
        method: 'GET'
    })
    .then(function(response) {
        gitfeed = JSON.parse(response);
        var entries = gitfeed.feed.entry;

        feedBuilder(entries, 6);

        return;
    })['catch'](function(err) {
        return err;
    });

}, false);

(function(window) {
  var toggleCodeBtn = document.getElementById('toggle-code'),
      aboutCode = document.getElementById('code-about'),
      aboutBare = document.getElementById('bare-about'),
      aboutSection = document.getElementById('about');

  var menuBtn = document.getElementById('menu-btn'),
      menuNav = document.getElementById('main-nav'),
      mainMenu = document.querySelector('ul[role="menubar"]'),
      mastHead = document.getElementById('masthead');

  menuBtn.addEventListener('click', function(e) {
    menuBtn.classList.toggle('active');
    mainMenu.classList.toggle('active');
  }, false);

  toggleCodeBtn.addEventListener('click', function(e) {
    var aboutRect = aboutSection.getBoundingClientRect(),
        bareRect = aboutBare.getBoundingClientRect();
    if(e.target.classList.contains('active')) {
      e.target.classList.remove('active');
      aboutCode.classList.remove('active');
      var delayDisplay = window.setTimeout(function() {
        aboutCode.style.display = 'none';
        aboutBare.style.display = 'inline-block';
        window.clearTimeout(delayDisplay);
      }, 1100);
    } else {
      aboutCode.style.top = '0px';
      aboutCode.style.right = '-'+aboutRect.width+'px';
      aboutCode.style.display = 'inline-block';
      aboutBare.style.left = '-'+aboutRect.width+'px';
      var delayDisplay = window.setTimeout(function() {
        aboutBare.style.display = 'none';
        aboutCode.classList.add('active');
        window.clearTimeout(delayDisplay);
      }, 500);
      e.target.classList.add('active');
    }
  }, false);

  function positionNav() { 
    if(window.innerWidth < 740) {
      if(!mainMenu.classList.contains('side-menu')) {
        mainMenu.classList.add('side-menu');
        menuNav.removeChild(mainMenu);
        mastHead.appendChild(mainMenu);
      }
    } else {
      if(mainMenu.classList.contains('side-menu')) {
        mastHead.removeChild(mainMenu);
        menuNav.insertBefore(mainMenu, menuBtn);
        mainMenu.classList.remove('side-menu');
      }
    }
  }

  window.addEventListener('load', positionNav, false);
  window.onresize = positionNav;

})(window);
