true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

/* Encode and Decode games from URLs */


/**
 * Decode a URL into a game
 * @param {URL} url
 * @returns {Game}
 */
function decode(url) {
  const sp = url.searchParams;
  /**
   * Return value of a parameter or default
   * @template {string | number} T
   * @param {string} key
   * @param {T} def
   * @returns {T}
   */
  function P(key, def) {
    const result = sp.get(key);
    if (!result) {
      return def;
    }
    if (typeof def === "string") {
      return /** @type {T} */ (result);
    } else if (typeof def === "number") {
      return /** @type {T} */ (parseInt(result));
    }
    return def;
  }

  let t0 = P("s", 0) / 10;
  /** @type {Game} */
  const game = {
    title: P("t", "untitled"),
    video: P("v", ""),
    start: t0,
    timePoints: [],
  };
  const prompts = [];
  for (const [key, value] of sp) {
    if (key == "d") {
      prompts.push(value);
    }
  }
  const interval = P("i", 0) / 10;
  const end = P("e", 0) / 10;
  const prompt = P("p", "");
  if (interval && end && prompt) {
    for (let t = t0 + interval; t <= end; t += interval) {
      game.timePoints.push({
        time: t,
        choices: [{ prompt, next: 0 }],
      });
    }
  } else {
    let pat = /[tT](?<time>\d+)(?<choices>(?:[cbqpnN]\d+)+)/g;
    let cpat = /(?<key>[cbqp])(?<prompt>\d+)(?:(?<sign>[nN])(?<next>\d+))?/g;
    for (const match of P("g", "").matchAll(pat)) {
      const groups = match.groups;
      if (!groups) continue;
      t0 += parseInt(groups.time) / 10;
      /** @type {TimePoint} tp */
      const tp = {
        time: t0,
        choices: [],
      };
      for (const cmatch of groups.choices.matchAll(cpat)) {
        const groups = cmatch.groups;
        if (!groups) continue;
        const choice = {
          prompt: prompts[+groups.prompt],
          next: 0,
        };
        const key = groups.key;
        if (key == "b") {
          choice.next = -1;
        } else if (key == "q") {
          choice.next = -2;
        } else if (key == "p") {
          choice.next =
            (parseInt(groups.next) / 10) * { n: 1, N: -1 }[groups.sign] + t0;
        }
        tp.choices.push(choice);
      }
      game.timePoints.push(tp);
    }
  }
  return game;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var events = {exports: {}};

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
events.exports = EventEmitter;
events.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

var eventsExports = events.exports;
const EventEmitter$1 = /*@__PURE__*/getDefaultExportFromCjs(eventsExports);

// Copyright (c) Feross Aboukhadijeh
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//


const YOUTUBE_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

const YOUTUBE_STATES = {
  "-1": "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "cued",
};

const YOUTUBE_ERROR = {
  // The request contains an invalid parameter value. For example, this error
  // occurs if you specify a videoId that does not have 11 characters, or if the
  // videoId contains invalid characters, such as exclamation points or asterisks.
  INVALID_PARAM: 2,

  // The requested content cannot be played in an HTML5 player or another error
  // related to the HTML5 player has occurred.
  HTML5_ERROR: 5,

  // The video requested was not found. This error occurs when a video has been
  // removed (for any reason) or has been marked as private.
  NOT_FOUND: 100,

  // The owner of the requested video does not allow it to be played in embedded
  // players.
  UNPLAYABLE_1: 101,

  // This error is the same as 101. It's just a 101 error in disguise!
  UNPLAYABLE_2: 150,
};

const loadIframeAPICallbacks = [];

/**
 * YouTube Player. Exposes a better API, with nicer events.
 * @param {HTMLElement|string} element
 */
class YouTubePlayer extends EventEmitter$1 {
  /**
   * @param {HTMLElement|string} element
   * @param {Object} opts
   */
  constructor(element, opts = {}) {
    super();

    /** @type {HTMLElement} */
    let elem;
    if (typeof element === "string") {
      const e = document.querySelector(element);
      if (!(e instanceof HTMLElement)) {
        throw Error("Invalid Selector");
      }
      elem = e;
    } else {
      elem = element;
    }

    if (elem.id) {
      this._id = elem.id; // use existing element id
    } else {
      this._id = elem.id = "ytplayer-" + Math.random().toString(16).slice(2, 8);
    }

    this._opts = Object.assign(
      {
        width: 640,
        height: 360,
        autoplay: false,
        captions: false,
        controls: true,
        keyboard: true,
        fullscreen: true,
        annotations: true,
        modestBranding: false,
        related: true,
        timeupdateFrequency: 1000,
        playsInline: true,
        start: 0,
      },
      opts,
    );
    console.log(this._opts);

    this.videoId = null;
    this.destroyed = false;

    this._api = null;
    this._autoplay = false; // autoplay the first video?
    this._player = null;
    this._ready = false; // is player ready?
    this._queue = [];

    this._interval = null;

    // Setup listeners for 'timeupdate' events. The YouTube Player does not fire
    // 'timeupdate' events, so they are simulated using a setInterval().
    this._startInterval = this._startInterval.bind(this);
    this._stopInterval = this._stopInterval.bind(this);

    this.on("playing", this._startInterval);
    this.on("unstarted", this._stopInterval);
    this.on("ended", this._stopInterval);
    this.on("paused", this._stopInterval);
    this.on("buffering", this._stopInterval);

    this._loadIframeAPI(
      /** @param {any} err
       * @param {any} api
       */
      (err, api) => {
        if (err)
          return this._destroy(new Error("YouTube Iframe API failed to load"));
        this._api = api;

        // If load(videoId, [autoplay, [size]]) was called before Iframe API
        // loaded, ensure it gets called again now
        if (this.videoId) this.load(this.videoId, this._autoplay, this._start);
      },
    );
  }

  /** @param {string} videoId */
  load(videoId, autoplay = false, start = 0) {
    if (this.destroyed) return;

    this.videoId = videoId;
    this._autoplay = autoplay;
    this._start = start;

    // If the Iframe API is not ready yet, do nothing. Once the Iframe API is
    // ready, `load(this.videoId)` will be called.
    if (!this._api) return;

    // If there is no player instance, create one.
    if (!this._player) {
      this._createPlayer(videoId);
      return;
    }

    // If the player instance is not ready yet, do nothing. Once the player
    // instance is ready, `load(this.videoId)` will be called. This ensures that
    // the last call to `load()` is the one that takes effect.
    if (!this._ready) return;

    // If the player instance is ready, load the given `videoId`.
    if (autoplay) {
      this._player.loadVideoById(videoId, start);
    } else {
      this._player.cueVideoById(videoId, start);
    }
  }

  play() {
    if (this._ready) this._player.playVideo();
    else this._queueCommand("play");
  }

  pause() {
    if (this._ready) this._player.pauseVideo();
    else this._queueCommand("pause");
  }

  stop() {
    if (this._ready) this._player.stopVideo();
    else this._queueCommand("stop");
  }

  /** @param {number} seconds */
  seek(seconds) {
    if (this._ready) this._player.seekTo(seconds, true);
    else this._queueCommand("seek", seconds);
  }

  /** @param {number} volume */
  setVolume(volume) {
    if (this._ready) this._player.setVolume(volume);
    else this._queueCommand("setVolume", volume);
  }

  getVolume() {
    return (this._ready && this._player.getVolume()) || 0;
  }

  mute() {
    if (this._ready) this._player.mute();
    else this._queueCommand("mute");
  }

  unMute() {
    if (this._ready) this._player.unMute();
    else this._queueCommand("unMute");
  }

  isMuted() {
    return (this._ready && this._player.isMuted()) || false;
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setSize(width, height) {
    if (this._ready) this._player.setSize(width, height);
    else this._queueCommand("setSize", width, height);
  }

  /**
   * @param {number} rate
   */
  setPlaybackRate(rate) {
    if (this._ready) this._player.setPlaybackRate(rate);
    else this._queueCommand("setPlaybackRate", rate);
  }

  getPlaybackRate() {
    return (this._ready && this._player.getPlaybackRate()) || 1;
  }

  getAvailablePlaybackRates() {
    return (this._ready && this._player.getAvailablePlaybackRates()) || [1];
  }

  getDuration() {
    return (this._ready && this._player.getDuration()) || 0;
  }

  getProgress() {
    return (this._ready && this._player.getVideoLoadedFraction()) || 0;
  }

  getState() {
    return (
      (this._ready && YOUTUBE_STATES[this._player.getPlayerState()]) ||
      "unstarted"
    );
  }

  getCurrentTime() {
    return (this._ready && this._player.getCurrentTime()) || 0;
  }

  destroy() {
    this._destroy();
  }

  /** @param {any} err
   */
  _destroy(err = undefined) {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this._player) {
      this._player.stopVideo && this._player.stopVideo();
      this._player.destroy();
    }

    this.videoId = null;

    this._id = "";
    this._opts = null;
    this._api = null;
    this._player = null;
    this._ready = false;
    this._queue = [];

    this._stopInterval();

    this.removeListener("playing", this._startInterval);
    this.removeListener("paused", this._stopInterval);
    this.removeListener("buffering", this._stopInterval);
    this.removeListener("unstarted", this._stopInterval);
    this.removeListener("ended", this._stopInterval);

    if (err) this.emit("error", err);
  }

  /** @param {string} command
   * @param {any} args
   */
  _queueCommand(command, ...args) {
    if (this.destroyed) return;
    this._queue.push([command, args]);
  }

  _flushQueue() {
    while (this._queue.length) {
      const command = this._queue.shift();
      this[command[0]].apply(this, command[1]);
    }
  }

  /** @param {function} cb */
  _loadIframeAPI(cb) {
    // If API is loaded, there is nothing else to do
    if (window["YT"] && typeof window["YT"].Player === "function") {
      return cb(null, window["YT"]);
    }

    // Otherwise, queue callback until API is loaded
    loadIframeAPICallbacks.push(cb);

    const scripts = Array.from(document.getElementsByTagName("script"));
    const isLoading = scripts.some(
      (script) => script.src === YOUTUBE_IFRAME_API_SRC,
    );

    // If API <script> tag is not present in the page, inject it. Ensures that
    // if user includes a hardcoded <script> tag in HTML for performance, another
    // one will not be added
    if (!isLoading) {
      loadScript(YOUTUBE_IFRAME_API_SRC).catch((err) => {
        while (loadIframeAPICallbacks.length) {
          const loadCb = loadIframeAPICallbacks.shift();
          loadCb(err);
        }
      });
    }

    const prevOnYouTubeIframeAPIReady = window["onYouTubeIframeAPIReady"];
    window["onYouTubeIframeAPIReady"] = () => {
      if (typeof prevOnYouTubeIframeAPIReady === "function") {
        prevOnYouTubeIframeAPIReady();
      }
      while (loadIframeAPICallbacks.length) {
        const loadCb = loadIframeAPICallbacks.shift();
        loadCb(null, window["YT"]);
      }
    };
  }

  /** @param {string} videoId */
  _createPlayer(videoId) {
    if (this.destroyed) return;

    const opts = this._opts;

    this._player = new this._api.Player(this._id, {
      width: opts.width,
      height: opts.height,
      videoId: videoId,

      // (Not part of documented API) This parameter controls the hostname that
      // videos are loaded from. Set to `'https://www.youtube-nocookie.com'`
      // for enhanced privacy.
      host: opts.host,

      playerVars: {
        // This parameter specifies whether the initial video will automatically
        // start to play when the player loads. Supported values are 0 or 1. The
        // default value is 0.
        autoplay: opts.autoplay ? 1 : 0,

        // Setting the parameter's value to 1 causes closed captions to be shown
        // by default, even if the user has turned captions off. The default
        // behavior is based on user preference.
        cc_load_policy:
          opts.captions != null ? (opts.captions !== false ? 1 : 0) : undefined, // default to not setting this option

        // Sets the player's interface language. The parameter value is an ISO
        // 639-1 two-letter language code or a fully specified locale. For
        // example, fr and fr-ca are both valid values. Other language input
        // codes, such as IETF language tags (BCP 47) might also be handled
        // properly.
        hl:
          opts.captions != null && opts.captions !== false
            ? opts.captions
            : undefined, // default to not setting this option

        // This parameter specifies the default language that the player will
        // use to display captions. Set the parameter's value to an ISO 639-1
        // two-letter language code.
        cc_lang_pref:
          opts.captions != null && opts.captions !== false
            ? opts.captions
            : undefined, // default to not setting this option

        // This parameter indicates whether the video player controls are
        // displayed. For IFrame embeds that load a Flash player, it also defines
        // when the controls display in the player as well as when the player
        // will load. Supported values are:
        //   - controls=0 – Player controls do not display in the player. For
        //                  IFrame embeds, the Flash player loads immediately.
        //   - controls=1 – (default) Player controls display in the player. For
        //                  IFrame embeds, the controls display immediately and
        //                  the Flash player also loads immediately.
        //   - controls=2 – Player controls display in the player. For IFrame
        //                  embeds, the controls display and the Flash player
        //                  loads after the user initiates the video playback.
        controls: opts.controls ? 2 : 0,

        // Setting the parameter's value to 1 causes the player to not respond to
        // keyboard controls. The default value is 0, which means that keyboard
        // controls are enabled.
        disablekb: opts.keyboard ? 0 : 1,

        // Setting the parameter's value to 1 enables the player to be
        // controlled via IFrame or JavaScript Player API calls. The default
        // value is 0, which means that the player cannot be controlled using
        // those APIs.
        enablejsapi: 1,

        // Setting this parameter to 0 prevents the fullscreen button from
        // displaying in the player. The default value is 1, which causes the
        // fullscreen button to display.
        fs: opts.fullscreen ? 1 : 0,

        // Setting the parameter's value to 1 causes video annotations to be
        // shown by default, whereas setting to 3 causes video annotations to not
        // be shown by default. The default value is 1.
        iv_load_policy: opts.annotations ? 1 : 3,

        // This parameter lets you use a YouTube player that does not show a
        // YouTube logo. Set the parameter value to 1 to prevent the YouTube logo
        // from displaying in the control bar. Note that a small YouTube text
        // label will still display in the upper-right corner of a paused video
        // when the user's mouse pointer hovers over the player.
        modestbranding: opts.modestBranding ? 1 : 0,

        // This parameter provides an extra security measure for the IFrame API
        // and is only supported for IFrame embeds. If you are using the IFrame
        // API, which means you are setting the enablejsapi parameter value to 1,
        // you should always specify your domain as the origin parameter value.
        origin: window.location.origin,

        // This parameter controls whether videos play inline or fullscreen in an
        // HTML5 player on iOS. Valid values are:
        //   - 0: This value causes fullscreen playback. This is currently the
        //        default value, though the default is subject to change.
        //   - 1: This value causes inline playback for UIWebViews created with
        //        the allowsInlineMediaPlayback property set to TRUE.
        playsinline: opts.playsInline ? 1 : 0,

        // This parameter indicates whether the player should show related
        // videos from the same channel (0) or from any channel (1) when
        // playback of the video ends. The default value is 1.
        rel: opts.related ? 1 : 0,

        // (Not part of documented API) Allow html elements with higher z-index
        // to be shown on top of the YouTube player.
        wmode: "opaque",

        // This parameter causes the player to begin playing the video at the given number
        // of seconds from the start of the video. The parameter value is a positive integer.
        // Note that similar to the seek function, the player will look for the closest
        // keyframe to the time you specify. This means that sometimes the play head may seek
        // to just before the requested time, usually no more than around two seconds.
        start: opts.start,
      },
      events: {
        onReady: () => this._onReady(),
        onStateChange: (/** @type {any} */ data) => this._onStateChange(data),
        onPlaybackQualityChange: (/** @type {any} */ data) =>
          this._onPlaybackQualityChange(data),
        onPlaybackRateChange: (/** @type {any} */ data) =>
          this._onPlaybackRateChange(data),
        onError: (/** @type {any} */ data) => this._onError(data),
      },
    });
  }

  /**
   * This event fires when the player has finished loading and is ready to begin
   * receiving API calls.
   */
  _onReady() {
    if (this.destroyed) return;

    this._ready = true;

    // Once the player is ready, always call `load(videoId, [autoplay, [size]])`
    // to handle these possible cases:
    //
    //   1. `load(videoId, true)` was called before the player was ready. Ensure that
    //      the selected video starts to play.
    //
    //   2. `load(videoId, false)` was called before the player was ready. Now the
    //      player is ready and there's nothing to do.
    //
    //   3. `load(videoId, [autoplay])` was called multiple times before the player
    //      was ready. Therefore, the player was initialized with the wrong videoId,
    //      so load the latest videoId and potentially autoplay it.
    this.load(this.videoId || "", this._autoplay, this._start);

    this._flushQueue();
  }

  /**
   * Called when the player's state changes. We emit friendly events so the user
   * doesn't need to use YouTube's YT.PlayerState.* event constants.
   */
  _onStateChange(data) {
    if (this.destroyed) return;

    const state = YOUTUBE_STATES[data.data];

    if (state) {
      // Send a 'timeupdate' anytime the state changes. When the video halts for any
      // reason ('paused', 'buffering', or 'ended') no further 'timeupdate' events
      // should fire until the video unhalts.
      if (["paused", "buffering", "ended"].includes(state))
        this._onTimeupdate();

      this.emit(state);

      // When the video changes ('unstarted' or 'cued') or starts ('playing') then a
      // 'timeupdate' should follow afterwards (never before!) to reset the time.
      if (["unstarted", "playing", "cued"].includes(state))
        this._onTimeupdate();
    } else {
      throw new Error("Unrecognized state change: " + data);
    }
  }

  /**
   * This event fires whenever the video playback quality changes. Possible
   * values are: 'small', 'medium', 'large', 'hd720', 'hd1080', 'highres'.
   */
  _onPlaybackQualityChange(data) {
    if (this.destroyed) return;
    this.emit("playbackQualityChange", data.data);
  }

  /**
   * This event fires whenever the video playback rate changes.
   */
  _onPlaybackRateChange(data) {
    if (this.destroyed) return;
    this.emit("playbackRateChange", data.data);
  }

  /**
   * This event fires if an error occurs in the player.
   */
  _onError(data) {
    if (this.destroyed) return;

    const code = Number(data.data);

    // The HTML5_ERROR error occurs when the YouTube player needs to switch from
    // HTML5 to Flash to show an ad. Ignore it.
    if (code === YOUTUBE_ERROR.HTML5_ERROR) return;

    // The remaining error types occur when the YouTube player cannot play the
    // given video. This is not a fatal error. Report it as unplayable so the user
    // has an opportunity to play another video.
    if (
      code === YOUTUBE_ERROR.UNPLAYABLE_1 ||
      code === YOUTUBE_ERROR.UNPLAYABLE_2 ||
      code === YOUTUBE_ERROR.NOT_FOUND ||
      code === YOUTUBE_ERROR.INVALID_PARAM
    ) {
      return this.emit("unplayable", this.videoId);
    }

    // Unexpected error, does not match any known type
    this._destroy(
      new Error("YouTube Player Error. Unknown error code: " + code),
    );
  }

  /**
   * This event fires when the time indicated by the `getCurrentTime()` method
   * has been updated.
   */
  _onTimeupdate() {
    this.emit("timeupdate", this.getCurrentTime());
  }

  _startInterval() {
    this._interval = /** @type {any} */ (
      setInterval(() => this._onTimeupdate(), this._opts.timeupdateFrequency)
    );
  }

  _stopInterval() {
    clearInterval(this._interval);
    this._interval = null;
  }
}

/*! load-script2. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
function loadScript(src, attrs, parentNode) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;

    for (const [k, v] of Object.entries({})) {
      script.setAttribute(k, v);
    }

    script.onload = () => {
      script.onerror = script.onload = null;
      resolve(script);
    };

    script.onerror = () => {
      script.onerror = script.onload = null;
      reject(new Error(`Failed to load ${src}`));
    };

    const node =
      document.head || document.getElementsByTagName("head")[0];
    node.appendChild(script);
  });
}

const links = [
	"./?v=x1cnJ_pOAdQ&s=0&t=789+%28BSD%29&i=200&e=1078&p=more",
	"./?v=SzQsHlLKgoE&s=0&t=The+Wonky+Donkey&i=300&e=1574&p=Play+more",
	"./?v=oyEl36GLTP0&s=0&t=number+blocks+1+numberss&g=t300c0q1t300c0q1t600c0q1t600c0q1t900c0q1&d=more&d=finish",
	"./?v=Q7fdSnyuN5s&s=0&t=Bluey+theme+song-+More&i=100&e=6128&p=More+Bluey",
	"./?v=h4UJlFOhyCM&s=0&t=CVI-+Wheels+on+The+Bus+prompt+%40+15&i=150&e=1120&p=Clap+Clap+Clap",
	"./?v=GzrjwOQpAl0&s=0&t=Wheels+on+the+bus-+CORE+Go&g=t241c0t53c0t528c0t104c0t813c0t158c0t927c0t217c0t1054c0t293c0&d=go",
	"./?v=e_04ZrNroTo&s=0&t=Wheels+on+Bus+Coco&g=t425c0t153c0t581c0t312c0t727c0t466c0t881c0t620c0t1035c0&d=More+bus",
	"./?v=tQwVKr8rCYw&s=0&t=Encanto&g=t200c0q1t200c0q1t400c0q1t800c0q1t1000c0q1&d=More&d=Finished",
	"./?v=gghDRJVxFxU&s=7&t=Singing+Walrus+HELLO+core+word&g=t399c0t177c0t595c0t322c0t897c0&d=Hello%21",
	"./?v=tVlcKp3bWH8&s=0&t=Hello+Song&g=t160c0t160c1t254c0t316c1&d=Hello&d=How+are+you%3F",
	"./?v=inJO-Y8HtkU&s=600&t=Baby+Einstein%2Fwater&i=400&e=14049&p=help",
	"./?v=5oYKonYBujg&s=0&t=Old+McDonald-+Animal+ID&g=t160c0t310c1t510c2t640c3t840c4t960c5&d=Cow&d=Horse&d=Pig&d=Sheep&d=Duck&d=Rooster",
	"./?v=CyRNozcBASI&s=6&t=Play+Bubbles+%28GO+STOP%29&g=t409c0t146c1t624c0t278c1t848c0t416c1t1065c0t488c2t1194c3&d=STOP&d=GO&d=MORE&d=Finished",
	"./?v=-GSnmRZlgc4&s=0&t=Pete+The+Cat+I+Love+My+White+Shoes&i=230&e=2361&p=more",
	"./?v=e_04ZrNroTo&s=0&t=Wheels+on+the+Bus&i=100&e=2286&p=more",
	"./?v=0Losyoi_t84&s=0&t=Super+Simple+Duck+Songs+-+3+mins%2C+more%3F&i=1800&e=20526&p=more%3F",
	"./?v=HabRQmcUGd0&s=0&t=CVI+twinkle+twinkle%2C+prompt+%40+verse&g=t48c0t99c0t142c0&d=",
	"./?v=PY6RDXTEKDY&s=0&t=Pete+the+Cat+Falling+for+Autumn&i=250&e=2450&p=Hit+the+switch+for+more+story",
	"./?v=g15c8dGXHD8&s=0&t=We+are+going+to+school%3B+go%2FI+need%2Fdon%27t+need+that&g=t161c0t221c1t419c2t651c3t712c3t869c0&d=go&d=I+need+that%21&d=go+to+school&d=I+don%27t+need+that%21",
	"./?v=ylSsCCXRxkI&s=0&t=Classic+Disney+Songs&i=200&e=69700&p=More+Music",
	"./?v=QA48wTGbU7A&s=58.5&t=Cocomelon+-+Head%2C+Shoulders%2C+Knees+and+Toes+-+no+intro&g=t866c0t191c0t1011c0t305c0t1484q1&d=more&d=finished",
	"./?v=cPAbx5kgCJo&s=0&t=Moana%3A+How+Far+I%27ll+Go+%28MORE%29&i=300&e=1555&p=Do+you+want+more%3F",
	"./?v=0j6AZhZFb7A&s=0&t=5+Little+Monkeys+-+More&i=250&e=1101&p=more",
	"./?v=OwRmivbNgQk&s=0&t=Let%27s+Go+To+The+Zoo-+CORE+Go&g=t101c0t64c0t364c0t125c0t617c0t188c0t852c0t251c0t1076c0t314c0t1319c0t377c0t1618c0t438c0&d=go",
	"./?v=yomkyCFHfHM&s=65.3&t=Pete+the+Cat+Fall+Into+Autumn+%22What+Happens+Next%22&g=t974c0t571c0t1223c0t1018c0t1502c0t1249c0t1736c0t1857c0t2087c0t2588q1b2&d=What+happens+next%3F&d=I%27m+all+done.&d=Let%27s+read+again%21",
	"./?v=2S__fbCGwOM&s=0&t=Ants+Go+Marching+One+By+One&i=80&e=2320&p=More",
	"./?v=R1Hrkqep8nU&s=7&t=Me-Super+Simple+Songs+%28ME%29&g=t347c0t102c0t400c0t579c0t453c0t681c0t830c0t783c0t1031c0t883c0&d=me",
	"./?v=pnZbiKKydWU&s=0&t=Moana+How+far+I%27ll+go&i=120&e=1572&p=More+song",
	"./?v=DyOO1V8i7oQ&s=0&t=Cocomelon+Wheels+on+the+Camper&g=t315c0t153c0t468c0t382c0t622c0t574c0t774c0&d=More+music",
	"./?v=Ytxnyf3sJSQ&s=0&t=Rocking+in+My+School+Shoes+Pete+the+Cat+%28In%29&g=t56c0t50c0t112c0t299c0t166c0t348c0t556c0t401c0t609c0t478c0t714c0t613c0t766c0t665c0t1096c0t718c0t1150c0t817c0t1205c0t870c0t1256c0t1046c0t1310c0t1099c0t1363c0&d=in",
	"./?v=93lrosBEW-Q&s=0&t=Shiny+Moana+S1&g=t400c0q1t400c0q1t800c0q1t800c0q1t1200c0q1&d=more&d=finish",
	"./?v=r4KTqce-9Z0&s=0&t=You%27re+welcome+Disney+for+N&i=250&e=1590&p=Look+to+play",
	"./?v=lHhheCf0G1I&s=0&t=Hot+Dog+Mickey+Letters&g=t169c0t65c1t276c2t159c3t513c4&d=pluto+p&d=goofy+g&d=tootles+t&d=donald+d&d=mickey+m",
	"./?v=pnQR7w0fyTE&s=90&t=Mickey+Mouse+Clubhouse+Daisy+Bo+Peep+%22more%22&g=t1084c0t342c0t1571c0t616c0t1744c0t736c1&d=more&d=all+done",
	"./?v=GrKQvyXpNgc&s=0&t=Taylor+Swift+Cruel+Summer&i=150&e=1806&p=More+Music",
	"./?v=Yp5nPGWWMh4&s=0&t=Encanto&i=180&e=2950&p=+",
	"./?v=L0MK7qz13bU&s=0&t=Let+It+Go%3A+Frozen+%2810+seconds-more+music%29&i=100&e=2430&p=more+music",
	"./?v=LuGMCB2sjkU&s=0&t=CVI+The+Very+Hungry+Caterpillar&g=t100c0t100c0t200c0t200c0t300c0t300c0t400c0t400c0t500c0t500c0t600c0t600c0t700c0t700c1&d=more&d=finished",
	"./?v=MeRIpU4Ibo4&s=0&t=number+blocks+0+numberss&g=t300c0q1t300c0q1t600c0q1t600c0q1&d=more&d=finish",
	"./?v=8xg3vE8Ie_E&s=0&t=Taylor+Swift+Love+Story&g=t150c0q1t150c0q1t450c0q1t450c0q1t1050c0q1&d=more&d=finished",
	"./?v=e_04ZrNroTo&s=0&t=Wheels+on+the+Bus+%22more%22&i=100&e=2286&p=More",
	"./?v=0lS9btv3GVk&s=5&t=10+Apples+%28MORE+ON%29&g=t130c0t37c1t289c1t132c1t505c1t375c2&d=ON&d=MORE+ON&d=FINISHED",
	"./?v=yWirdnSDsV4&s=0&t=Wheels+on+the+bus+super+simple+songs&g=t150c0t200c0t300c0t500c0t600c0t920c1&d=Turn+on&d=Turn+off",
	"./?v=SWvBAQf7v8g&s=0&t=Usher%27s+ABC+in+Action+Song&g=t254c0t215c0t462c0t402c0&d=Play+More+Music",
	"./?v=EYb2QfjKe_4&s=0&t=You%27ve+Got+a+Friend+in+Me+%28ME%29&g=t172c0t169c0t340c0t373c0t523c0t528c0t607c0&d=me",
	"./?v=XqZsoesa55w&s=0&t=Baby+Shark+-+Pinkfong+Version&i=250&e=1360&p=+more",
	"./?v=IMEwzzyBP7w&s=0&t=Mickey+Mouse+Club+House&i=100&e=836&p=More",
	"./?v=5zXtxtrGKEw&s=0&t=Halloween+Want+More&i=200&e=33700&p=want+more",
	"./?v=cPAbx5kgCJo&s=0&t=Moana-+How+Far-+Prompt+%40+20%2F30&g=t212c0t199c0t418c0t406c0t710c0t703c0&d=",
	"./?v=Ec1cz_jHQM8&s=0&t=GO+AWAY+scary+monster&g=t318c0t48c0t409c0t138c0t457c0t361c0t597c1&d=go+away&d=all+done",
	"./?v=JWCZ0VbfjMk&s=0&t=Core+HELP&g=t213c0t87c0t368c0t244c0t516c0t485c0t668c0t724c0t822c0t979c1&d=HELP&d=ALL+DONE",
	"./?v=Qx91ff77yzM&s=5&t=Friend+Like+Me+%28ME%29&g=t458c0t100c0t654c0t791c0t720c0&d=me",
	"./?v=Mc9My7TnxFU&s=0&t=brown+bear+%2F+more+please&g=t152c0t148c0t282c0t260c0t417c0t359c0t552c0t471c0t667c0t575c0t803c0&d=more+please",
	"./?v=YA2YZx_rcCY&s=0&t=1+to+10+CVI&g=t93c0t59c1t165c2t139c3t256c4t246c5t362c6t367c7t498c8&d=2&d=3&d=4&d=5&d=6&d=7&d=8&d=9&d=10",
	"./?v=-0icbqvmehs&s=0&t=Wheels+on+the+Bus-Pete+the+Cat+%28Go%29&i=70&e=1537&p=Go",
	"./?v=hqzvHfy-Ij0&s=0&t=twinkle+twinkle+cocomelon&i=200&e=1953&p=more",
	"./?v=rHtq5GIIUV8&s=0&t=Halloween+Songs+-+Core+Words%2C+Numbers&g=t280c0t190c1t446c2t342c3t714c4t602c5t1011c4t813c0t1184c1t1003c2t1376c3t1293c6t1532c6t1437c6t1673c6t1580c6t1814c6t1721c6t1955c6t1862c6t2106c7&d=4&d=3&d=2&d=1&d=5&d=more&d=turn&d=goodnight",
	"./?v=bvWRMAU6V-c&s=0&t=Encanto+-+We+Don%27t+Talk+About+Bruno&g=t246c0t321c0t434c0t556c0t619c0t742c0t871c0t1003c0t1122q1&d=more&d=finished",
	"./?v=9Wsod3lPlYY&s=0&t=No%2C+David&g=t98c0t45c0t138c0t108c0t236c1t174c2t338c3t304c4t394c5t363c6t437c7t462c8t528c9t474c10&d=No&d=quiet&d=don%27t&d=go&d=down&d=stop&d=put&d=not&d=no&d=yes&d=I+love+you",
	"./?v=xoyEDrMDirA&s=0&t=Red+Light%2C+Green+Light+%28stop%29&g=t130c0t35c0t167c0t180c0t204c0t216c0t342c0t363c0t450c0t419c0t476c0t489c0t513c0&d=Stop",
	"./?v=N6uDZw7-3z8&s=0&t=Mickey+Mouse+Clubhouse+-+Theme&g=t100c0q1t100c0q1t200c0q1t200c0q1t300c0q1t300c0q1t400c0q1&d=More&d=All+done",
	"./?v=79DijItQXMM&s=0&t=You%27re+Welcome-+Moana%2C+Core+Words%2C+Some+Gestalts&g=t25c0t16c1t33c1t37c2t101c3t98c4t165c5t127c6t273c7t199c8t539c9t291c10t619c11t418c12t783c13t438c14t931c11t487c15t1138c1&d=You+are+saying&d=Thank+you&d=What%3F+No+No+No&d=see&d=How+do+you+feel%3F&d=Open&d=Yes%2C+it%27s+me&d=say&d=it%27s+good+%28ok%29&d=let%27s+have+fun&d=What+can+I+say&d=it%27s+good&d=go+on+and+on&d=look+where&d=look+at+that&d=I+gotta+go",
	"./?v=79DijItQXMM&s=0&t=Moana&i=150&e=1690&p=More+music",
	"./?v=e_04ZrNroTo&s=0&t=Cocomelon+Wheels+on+the+Bus+-+more&i=200&e=2286&p=more",
	"./?v=cPAbx5kgCJo&s=0&t=Moana-+Angelica&i=120&e=1555&p=Hit+the+switch+for+more+music",
	"./?v=lHhheCf0G1I&s=4&t=Mickey+Mouse+Clubhouse+Hot+Dog&i=130&e=867&p=+",
	"./?v=0gyI6ykDwds&s=0&t=We%27re+Going+On+a+Bear+Hunt&g=t257c0t173c0t212c0t348c0t352c0t412c0t482c0t560c0t596c0t693c0t746c0t885c0t908c0t962c0t1038c0t1118c1t1123c0t1600c0t1198c0&d=Turn+the+page&d=Turn+the+page+-+sssshh%21",
	"./?v=jp-D1eX1oaY&s=0&t=Candy+corn+countdown&i=200&e=1242&p=More+Candy+corn",
	"./?v=yOHoHrwwRyk&s=0&t=Thomas+the+Tank+Engine&i=150&e=7113&p=Go",
	"./?v=L0MK7qz13bU&s=0&t=Frozen-+More&i=250&e=2426&p=More+Elsa",
	"./?v=b2rBhpVDzO8&s=0&t=Sesame+Street-Go&i=60&e=474&p=GO",
	"./?v=erteyzvS9Ds&s=0&t=Super+Simple+One+Little+Finger&i=200&e=1494&p=More+Music",
	"./?v=-GSnmRZlgc4&s=0&t=Pete+I+Love+My+White+Shoes+%28Mixed+WH+%3Fs%29&g=t235c0t328c1t652c2t656c3t1602c4&d=Look%21+Pete+loves+his+white&d=What+did+Pete+step+in%3F&d=What+color+are+Pete%27s+shoes%3F&d=Pete%27s+shoes+are+not+clean.+They+are&d=How+does+Pete+feel%3F",
	"./?v=Va1rfqpF35Q&s=5&t=Who+is+at+the+door%3F+Halloween&g=t337c0t452c0t784c0t909c0t1294c0t948c1t1390c2&d=Who+is+it%3F&d=Oh+No%21++It%27s+a+ghost&d=The+End",
	"./?v=-GSnmRZlgc4&s=0&t=Pete+I+Love+My+White+Shoes+%28%22goodness%2C+no%22%29&g=t633c0t365c0t1021c0t821c0&d=Goodness%2C+no%21",
	"./?v=TeQ_TTyLGMs&s=0&t=Do+-+Frozen+%28Do+You+Want+to+Build+a+Snowman%3F%29&g=t101c0t211c0t373c0t1357c0&d=Do",
	"./?v=GoSq-yZcJ-4&s=0&t=Walking+in+the+Jungle&i=150&e=2041&p=Play",
	"./?v=tXpGpix2_vw&s=0&t=Flash+forward+superhero+book&g=t300c0q1t300c0q1t600c0q1&d=more&d=finish",
	"./?v=eeUz08JdIC4&s=0&t=Sesame+Street+Baby+Shark+Prompt+%40+20&i=200&e=1691&p=+",
	"./?v=bBeZSuHI4Qc&s=0&t=What+Else+Can+I+Do%3F+Encanto+S1&g=t400c0q1t400c0q1t800c0q1t800c0q1&d=more&d=finish",
	"./?v=GR2o6k8aPlI&s=0&t=Baby+Shark%3A+More+Please&i=200&e=1897&p=More+Please",
	"./?v=_HbEejSqE9Y&s=38&t=Baby+Einstein+Objects-Visual+Stimulation&g=t453c0t320c0t750c0t560c0t1005q1&d=I+want+more%21&d=All+done%21",
	"./?v=1a2Smau__Dk&s=0&t=Giraffes+Can%27t+Dance&i=250&e=2947&p=Press+more+to+read+the+book",
	"./?v=ieCxOOY0RTs&s=0&t=Storybots+Days+of+the+week+%28more%29&i=150&e=767&p=More+Storybots",
	"./?v=jKKrfr4To14&s=0&t=Waiting+On+A+Miracle+Encanto+S1&g=t400c0q1t400c0q1t800c0q1t800c0q1&d=more&d=finish",
	"./?v=gbib1qt-YSg&s=0&t=Llama+Llama+Time+to+Share+Core+Words&g=t265c0t75c1t378c2t201c3t512c4t323c5t623c2t533c6t723c7t575c8t888c9t783c10t1035c2t995c11&d=who&d=look&d=they+play&d=open&d=he+sad&d=he+make&d=what+do&d=she+take&d=not+like&d=he+feel+sad&d=do+different&d=they+like",
	"./?v=oWgTqLCLE8k&s=0&t=Can%27t+Stop+the+Feeling+Trolls&i=150&e=1448&p=more",
	"./?v=a3ugFqLSoQs&s=0&t=Baby+Einstein+get+up+and+go&i=450&e=16256&p=yes",
	"./?v=DEHBrmZxAf8&s=0&t=Zoom+Zoom+%28MORE%29&i=200&e=1051&p=Do+you+want+more%3F",
	"./?v=e-ORhEE9VVg&s=0&t=Taylor+Swift+Blank+Space&g=t150c0q1t150c0q1t450c0q1t450c0q1t1050c0q1t950c0q1&d=more&d=finished"
];

/** @param {Game} game */
function play(game) {
  const message = document.getElementById("message");

  if (!message) throw Error("bad dom");

  const player = new YouTubePlayer("#app", {
    timeupdateFrequency: 20,
    controls: false,
    modestBranding: true,
    related: false,
    keyboard: false,
    fullscreen: true,
    annotations: false,
  });

  let TPIndex = 0;
  let Duration = 0;

  player.load(game.video, false, game.start);
  showPrompt({ time: 0, choices: [{ prompt: "Play", next: -1 }] }, 0);
  player.on("timeupdate", (seconds) => {
    if (seconds >= game.timePoints[TPIndex].time) {
      const tp = game.timePoints;
      player.pause();
      showPrompt(tp[TPIndex], -1);
    }
  });
  player.on("playing", () => {
    if (Duration == 0) {
      Duration = player.getDuration();
      if (Duration > 0) {
        game.timePoints.push({
          time: Duration,
          choices: [{ prompt: "Again?", next: -1 }],
        });
      }
    }
  });
  player.on("ended", () => {
    const tp = game.timePoints;
    showPrompt(tp[tp.length - 1], 0);
  });

  /** @param {TimePoint} tp
   * @param {number} select
   * */
  function showPrompt(tp, select) {
    if (!message) return;
    message.replaceChildren();
    const prompts = tp.choices.map(
      (choice, index) =>
        `<button ${index == select ? "selected" : ""} next=${choice.next}>${choice.prompt}</button>`,
    );
    message.innerHTML = prompts.join("");
    message.removeAttribute("hide");
  }

  const movers = new Set([" ", "ArrowRight"]);
  const choosers = new Set(["Enter", "ArrowLeft"]);
  document.addEventListener("keyup", (event) => {
    if (movers.has(event.key)) {
      const buttons = [...message.querySelectorAll("button")];
      const selected = /** @type {HTMLButtonElement} */ (
        message.querySelector("button[selected]")
      );
      let index = 0;
      if (selected) {
        index = (buttons.indexOf(selected) + 1) % buttons.length;
        selected.removeAttribute("selected");
      }
      buttons[index].setAttribute("selected", "");
    } else if (choosers.has(event.key)) {
      const selected = /** @type {HTMLButtonElement} */ (
        message.querySelector("button[selected]")
      );
      if (selected) {
        choose(selected);
      }
    }
  });

  message.addEventListener("pointerup", (event) => {
    if (event.target instanceof HTMLButtonElement) {
      choose(event.target);
    }
  });

  /** @param {HTMLButtonElement} button */
  function choose(button) {
    const next = parseInt(button.getAttribute("next") || "0");
    if (next == 0) {
      TPIndex += 1;
      go();
    } else if (next == -1) {
      TPIndex = 0;
      player.seek(game.start);
      go();
    } else if (next == -2) {
      console.log("quit");
    } else {
      player.seek(next);
      for (let i = 0; i < game.timePoints.length; i++) {
        if (game.timePoints[i].time >= next) {
          TPIndex = i;
          break;
        }
      }
      go();
    }
  }

  function go() {
    if (!message) throw Error("bad dom");
    message.setAttribute("hide", "");
    player.play();
  }
}

if (location.search) {
  const game = decode(new URL(location.href));
  console.log({ game });
  play(game);
} else {
  const html = [];
  for (const link of links) {
    const url = new URL(location.href);
    url.search = link.slice(3);
    const sp = url.searchParams;
    const videoId = sp.get("v");
    const src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const cell = `
      <a href="${url}">
        <figure>
          <img src="${src}"\>
          <figcaption>${sp.get("t")}</figcaption>
        </figure>
      </a>`;
    html.push(cell);
  }
  const app = document.getElementById("app");
  if (!app) {
    throw Error("Bad Dom");
  }
  const message = document.getElementById("message");
  if (!message) {
    throw Error("Bad Dom");
  }
  app.innerHTML = html.join("");
  message.style.display = "none";
}
//# sourceMappingURL=index.js.map
