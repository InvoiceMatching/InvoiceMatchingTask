(() => {
  var ce = globalThis;
  function te(t) {
    return (ce.__Zone_symbol_prefix || "__zone_symbol__") + t;
  }
  function ht() {
    let t = ce.performance;
    function n(I) {
      t && t.mark && t.mark(I);
    }
    function a(I, s) {
      t && t.measure && t.measure(I, s);
    }
    n("Zone");
    class e {
      static __symbol__ = te;
      static assertZonePatched() {
        if (ce.Promise !== S.ZoneAwarePromise) throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
      }
      static get root() {
        let s = e.current;
        for (; s.parent; ) s = s.parent;
        return s;
      }
      static get current() {
        return b.zone;
      }
      static get currentTask() {
        return D;
      }
      static __load_patch(s, i, r = false) {
        if (S.hasOwnProperty(s)) {
          let E = ce[te("forceDuplicateZoneCheck")] === true;
          if (!r && E) throw Error("Already loaded patch: " + s);
        } else if (!ce["__Zone_disable_" + s]) {
          let E = "Zone:" + s;
          n(E), S[s] = i(ce, e, R), a(E, E);
        }
      }
      get parent() {
        return this._parent;
      }
      get name() {
        return this._name;
      }
      _parent;
      _name;
      _properties;
      _zoneDelegate;
      constructor(s, i) {
        this._parent = s, this._name = i ? i.name || "unnamed" : "<root>", this._properties = i && i.properties || {}, this._zoneDelegate = new f(this, this._parent && this._parent._zoneDelegate, i);
      }
      get(s) {
        let i = this.getZoneWith(s);
        if (i) return i._properties[s];
      }
      getZoneWith(s) {
        let i = this;
        for (; i; ) {
          if (i._properties.hasOwnProperty(s)) return i;
          i = i._parent;
        }
        return null;
      }
      fork(s) {
        if (!s) throw new Error("ZoneSpec required!");
        return this._zoneDelegate.fork(this, s);
      }
      wrap(s, i) {
        if (typeof s != "function") throw new Error("Expecting function got: " + s);
        let r = this._zoneDelegate.intercept(this, s, i), E = this;
        return function() {
          return E.runGuarded(r, this, arguments, i);
        };
      }
      run(s, i, r, E) {
        b = { parent: b, zone: this };
        try {
          return this._zoneDelegate.invoke(this, s, i, r, E);
        } finally {
          b = b.parent;
        }
      }
      runGuarded(s, i = null, r, E) {
        b = { parent: b, zone: this };
        try {
          try {
            return this._zoneDelegate.invoke(this, s, i, r, E);
          } catch (x) {
            if (this._zoneDelegate.handleError(this, x)) throw x;
          }
        } finally {
          b = b.parent;
        }
      }
      runTask(s, i, r) {
        if (s.zone != this) throw new Error("A task can only be run in the zone of creation! (Creation: " + (s.zone || J).name + "; Execution: " + this.name + ")");
        let E = s, { type: x, data: { isPeriodic: ee = false, isRefreshable: M = false } = {} } = s;
        if (s.state === q && (x === U || x === k)) return;
        let he = s.state != A;
        he && E._transitionTo(A, d);
        let _e = D;
        D = E, b = { parent: b, zone: this };
        try {
          x == k && s.data && !ee && !M && (s.cancelFn = void 0);
          try {
            return this._zoneDelegate.invokeTask(this, E, i, r);
          } catch (Q) {
            if (this._zoneDelegate.handleError(this, Q)) throw Q;
          }
        } finally {
          let Q = s.state;
          if (Q !== q && Q !== X) if (x == U || ee || M && Q === p) he && E._transitionTo(d, A, p);
          else {
            let Te = E._zoneDelegates;
            this._updateTaskCount(E, -1), he && E._transitionTo(q, A, q), M && (E._zoneDelegates = Te);
          }
          b = b.parent, D = _e;
        }
      }
      scheduleTask(s) {
        if (s.zone && s.zone !== this) {
          let r = this;
          for (; r; ) {
            if (r === s.zone) throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${s.zone.name}`);
            r = r.parent;
          }
        }
        s._transitionTo(p, q);
        let i = [];
        s._zoneDelegates = i, s._zone = this;
        try {
          s = this._zoneDelegate.scheduleTask(this, s);
        } catch (r) {
          throw s._transitionTo(X, p, q), this._zoneDelegate.handleError(this, r), r;
        }
        return s._zoneDelegates === i && this._updateTaskCount(s, 1), s.state == p && s._transitionTo(d, p), s;
      }
      scheduleMicroTask(s, i, r, E) {
        return this.scheduleTask(new g(F, s, i, r, E, void 0));
      }
      scheduleMacroTask(s, i, r, E, x) {
        return this.scheduleTask(new g(k, s, i, r, E, x));
      }
      scheduleEventTask(s, i, r, E, x) {
        return this.scheduleTask(new g(U, s, i, r, E, x));
      }
      cancelTask(s) {
        if (s.zone != this) throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (s.zone || J).name + "; Execution: " + this.name + ")");
        if (!(s.state !== d && s.state !== A)) {
          s._transitionTo(V, d, A);
          try {
            this._zoneDelegate.cancelTask(this, s);
          } catch (i) {
            throw s._transitionTo(X, V), this._zoneDelegate.handleError(this, i), i;
          }
          return this._updateTaskCount(s, -1), s._transitionTo(q, V), s.runCount = -1, s;
        }
      }
      _updateTaskCount(s, i) {
        let r = s._zoneDelegates;
        i == -1 && (s._zoneDelegates = null);
        for (let E = 0; E < r.length; E++) r[E]._updateTaskCount(s.type, i);
      }
    }
    let c = { name: "", onHasTask: (I, s, i, r) => I.hasTask(i, r), onScheduleTask: (I, s, i, r) => I.scheduleTask(i, r), onInvokeTask: (I, s, i, r, E, x) => I.invokeTask(i, r, E, x), onCancelTask: (I, s, i, r) => I.cancelTask(i, r) };
    class f {
      get zone() {
        return this._zone;
      }
      _zone;
      _taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 };
      _parentDelegate;
      _forkDlgt;
      _forkZS;
      _forkCurrZone;
      _interceptDlgt;
      _interceptZS;
      _interceptCurrZone;
      _invokeDlgt;
      _invokeZS;
      _invokeCurrZone;
      _handleErrorDlgt;
      _handleErrorZS;
      _handleErrorCurrZone;
      _scheduleTaskDlgt;
      _scheduleTaskZS;
      _scheduleTaskCurrZone;
      _invokeTaskDlgt;
      _invokeTaskZS;
      _invokeTaskCurrZone;
      _cancelTaskDlgt;
      _cancelTaskZS;
      _cancelTaskCurrZone;
      _hasTaskDlgt;
      _hasTaskDlgtOwner;
      _hasTaskZS;
      _hasTaskCurrZone;
      constructor(s, i, r) {
        this._zone = s, this._parentDelegate = i, this._forkZS = r && (r && r.onFork ? r : i._forkZS), this._forkDlgt = r && (r.onFork ? i : i._forkDlgt), this._forkCurrZone = r && (r.onFork ? this._zone : i._forkCurrZone), this._interceptZS = r && (r.onIntercept ? r : i._interceptZS), this._interceptDlgt = r && (r.onIntercept ? i : i._interceptDlgt), this._interceptCurrZone = r && (r.onIntercept ? this._zone : i._interceptCurrZone), this._invokeZS = r && (r.onInvoke ? r : i._invokeZS), this._invokeDlgt = r && (r.onInvoke ? i : i._invokeDlgt), this._invokeCurrZone = r && (r.onInvoke ? this._zone : i._invokeCurrZone), this._handleErrorZS = r && (r.onHandleError ? r : i._handleErrorZS), this._handleErrorDlgt = r && (r.onHandleError ? i : i._handleErrorDlgt), this._handleErrorCurrZone = r && (r.onHandleError ? this._zone : i._handleErrorCurrZone), this._scheduleTaskZS = r && (r.onScheduleTask ? r : i._scheduleTaskZS), this._scheduleTaskDlgt = r && (r.onScheduleTask ? i : i._scheduleTaskDlgt), this._scheduleTaskCurrZone = r && (r.onScheduleTask ? this._zone : i._scheduleTaskCurrZone), this._invokeTaskZS = r && (r.onInvokeTask ? r : i._invokeTaskZS), this._invokeTaskDlgt = r && (r.onInvokeTask ? i : i._invokeTaskDlgt), this._invokeTaskCurrZone = r && (r.onInvokeTask ? this._zone : i._invokeTaskCurrZone), this._cancelTaskZS = r && (r.onCancelTask ? r : i._cancelTaskZS), this._cancelTaskDlgt = r && (r.onCancelTask ? i : i._cancelTaskDlgt), this._cancelTaskCurrZone = r && (r.onCancelTask ? this._zone : i._cancelTaskCurrZone), this._hasTaskZS = null, this._hasTaskDlgt = null, this._hasTaskDlgtOwner = null, this._hasTaskCurrZone = null;
        let E = r && r.onHasTask, x = i && i._hasTaskZS;
        (E || x) && (this._hasTaskZS = E ? r : c, this._hasTaskDlgt = i, this._hasTaskDlgtOwner = this, this._hasTaskCurrZone = this._zone, r.onScheduleTask || (this._scheduleTaskZS = c, this._scheduleTaskDlgt = i, this._scheduleTaskCurrZone = this._zone), r.onInvokeTask || (this._invokeTaskZS = c, this._invokeTaskDlgt = i, this._invokeTaskCurrZone = this._zone), r.onCancelTask || (this._cancelTaskZS = c, this._cancelTaskDlgt = i, this._cancelTaskCurrZone = this._zone));
      }
      fork(s, i) {
        return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, s, i) : new e(s, i);
      }
      intercept(s, i, r) {
        return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, s, i, r) : i;
      }
      invoke(s, i, r, E, x) {
        return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, s, i, r, E, x) : i.apply(r, E);
      }
      handleError(s, i) {
        return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, s, i) : true;
      }
      scheduleTask(s, i) {
        let r = i;
        if (this._scheduleTaskZS) this._hasTaskZS && r._zoneDelegates.push(this._hasTaskDlgtOwner), r = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, s, i), r || (r = i);
        else if (i.scheduleFn) i.scheduleFn(i);
        else if (i.type == F) z(i);
        else throw new Error("Task is missing scheduleFn.");
        return r;
      }
      invokeTask(s, i, r, E) {
        return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, s, i, r, E) : i.callback.apply(r, E);
      }
      cancelTask(s, i) {
        let r;
        if (this._cancelTaskZS) r = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, s, i);
        else {
          if (!i.cancelFn) throw Error("Task is not cancelable");
          r = i.cancelFn(i);
        }
        return r;
      }
      hasTask(s, i) {
        try {
          this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, s, i);
        } catch (r) {
          this.handleError(s, r);
        }
      }
      _updateTaskCount(s, i) {
        let r = this._taskCounts, E = r[s], x = r[s] = E + i;
        if (x < 0) throw new Error("More tasks executed then were scheduled.");
        if (E == 0 || x == 0) {
          let ee = { microTask: r.microTask > 0, macroTask: r.macroTask > 0, eventTask: r.eventTask > 0, change: s };
          this.hasTask(this._zone, ee);
        }
      }
    }
    class g {
      type;
      source;
      invoke;
      callback;
      data;
      scheduleFn;
      cancelFn;
      _zone = null;
      runCount = 0;
      _zoneDelegates = null;
      _state = "notScheduled";
      constructor(s, i, r, E, x, ee) {
        if (this.type = s, this.source = i, this.data = E, this.scheduleFn = x, this.cancelFn = ee, !r) throw new Error("callback is not defined");
        this.callback = r;
        let M = this;
        s === U && E && E.useG ? this.invoke = g.invokeTask : this.invoke = function() {
          return g.invokeTask.call(ce, M, this, arguments);
        };
      }
      static invokeTask(s, i, r) {
        s || (s = this), K++;
        try {
          return s.runCount++, s.zone.runTask(s, i, r);
        } finally {
          K == 1 && $(), K--;
        }
      }
      get zone() {
        return this._zone;
      }
      get state() {
        return this._state;
      }
      cancelScheduleRequest() {
        this._transitionTo(q, p);
      }
      _transitionTo(s, i, r) {
        if (this._state === i || this._state === r) this._state = s, s == q && (this._zoneDelegates = null);
        else throw new Error(`${this.type} '${this.source}': can not transition to '${s}', expecting state '${i}'${r ? " or '" + r + "'" : ""}, was '${this._state}'.`);
      }
      toString() {
        return this.data && typeof this.data.handleId < "u" ? this.data.handleId.toString() : Object.prototype.toString.call(this);
      }
      toJSON() {
        return { type: this.type, state: this.state, source: this.source, zone: this.zone.name, runCount: this.runCount };
      }
    }
    let T = te("setTimeout"), y = te("Promise"), w = te("then"), _ = [], P = false, L;
    function H(I) {
      if (L || ce[y] && (L = ce[y].resolve(0)), L) {
        let s = L[w];
        s || (s = L.then), s.call(L, I);
      } else ce[T](I, 0);
    }
    function z(I) {
      K === 0 && _.length === 0 && H($), I && _.push(I);
    }
    function $() {
      if (!P) {
        for (P = true; _.length; ) {
          let I = _;
          _ = [];
          for (let s = 0; s < I.length; s++) {
            let i = I[s];
            try {
              i.zone.runTask(i, null, null);
            } catch (r) {
              R.onUnhandledError(r);
            }
          }
        }
        R.microtaskDrainDone(), P = false;
      }
    }
    let J = { name: "NO ZONE" }, q = "notScheduled", p = "scheduling", d = "scheduled", A = "running", V = "canceling", X = "unknown", F = "microTask", k = "macroTask", U = "eventTask", S = {}, R = { symbol: te, currentZoneFrame: () => b, onUnhandledError: W, microtaskDrainDone: W, scheduleMicroTask: z, showUncaughtError: () => !e[te("ignoreConsoleErrorUncaughtError")], patchEventTarget: () => [], patchOnProperties: W, patchMethod: () => W, bindArguments: () => [], patchThen: () => W, patchMacroTask: () => W, patchEventPrototype: () => W, isIEOrEdge: () => false, getGlobalObjects: () => {
    }, ObjectDefineProperty: () => W, ObjectGetOwnPropertyDescriptor: () => {
    }, ObjectCreate: () => {
    }, ArraySlice: () => [], patchClass: () => W, wrapWithCurrentZone: () => W, filterProperties: () => [], attachOriginToPatched: () => W, _redefineProperty: () => W, patchCallbacks: () => W, nativeScheduleMicroTask: H }, b = { parent: null, zone: new e(null, null) }, D = null, K = 0;
    function W() {
    }
    return a("Zone", "Zone"), e;
  }
  function dt() {
    let t = globalThis, n = t[te("forceDuplicateZoneCheck")] === true;
    if (t.Zone && (n || typeof t.Zone.__symbol__ != "function")) throw new Error("Zone already loaded.");
    return t.Zone ??= ht(), t.Zone;
  }
  var pe = Object.getOwnPropertyDescriptor;
  var Me = Object.defineProperty;
  var Ae = Object.getPrototypeOf;
  var _t = Object.create;
  var Tt = Array.prototype.slice;
  var je = "addEventListener";
  var He = "removeEventListener";
  var Ne = te(je);
  var Ze = te(He);
  var ae = "true";
  var le = "false";
  var ve = te("");
  function Ve(t, n) {
    return Zone.current.wrap(t, n);
  }
  function xe(t, n, a, e, c) {
    return Zone.current.scheduleMacroTask(t, n, a, e, c);
  }
  var j = te;
  var we = typeof window < "u";
  var be = we ? window : void 0;
  var Y = we && be || globalThis;
  var Et = "removeAttribute";
  function Fe(t, n) {
    for (let a = t.length - 1; a >= 0; a--) typeof t[a] == "function" && (t[a] = Ve(t[a], n + "_" + a));
    return t;
  }
  function gt(t, n) {
    let a = t.constructor.name;
    for (let e = 0; e < n.length; e++) {
      let c = n[e], f = t[c];
      if (f) {
        let g = pe(t, c);
        if (!et(g)) continue;
        t[c] = ((T) => {
          let y = function() {
            return T.apply(this, Fe(arguments, a + "." + c));
          };
          return fe(y, T), y;
        })(f);
      }
    }
  }
  function et(t) {
    return t ? t.writable === false ? false : !(typeof t.get == "function" && typeof t.set > "u") : true;
  }
  var tt = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope;
  var De = !("nw" in Y) && typeof Y.process < "u" && Y.process.toString() === "[object process]";
  var Ge = !De && !tt && !!(we && be.HTMLElement);
  var nt = typeof Y.process < "u" && Y.process.toString() === "[object process]" && !tt && !!(we && be.HTMLElement);
  var Ce = {};
  var kt = j("enable_beforeunload");
  var Xe = function(t) {
    if (t = t || Y.event, !t) return;
    let n = Ce[t.type];
    n || (n = Ce[t.type] = j("ON_PROPERTY" + t.type));
    let a = this || t.target || Y, e = a[n], c;
    if (Ge && a === be && t.type === "error") {
      let f = t;
      c = e && e.call(this, f.message, f.filename, f.lineno, f.colno, f.error), c === true && t.preventDefault();
    } else c = e && e.apply(this, arguments), t.type === "beforeunload" && Y[kt] && typeof c == "string" ? t.returnValue = c : c != null && !c && t.preventDefault();
    return c;
  };
  function Ye(t, n, a) {
    let e = pe(t, n);
    if (!e && a && pe(a, n) && (e = { enumerable: true, configurable: true }), !e || !e.configurable) return;
    let c = j("on" + n + "patched");
    if (t.hasOwnProperty(c) && t[c]) return;
    delete e.writable, delete e.value;
    let f = e.get, g = e.set, T = n.slice(2), y = Ce[T];
    y || (y = Ce[T] = j("ON_PROPERTY" + T)), e.set = function(w) {
      let _ = this;
      if (!_ && t === Y && (_ = Y), !_) return;
      typeof _[y] == "function" && _.removeEventListener(T, Xe), g?.call(_, null), _[y] = w, typeof w == "function" && _.addEventListener(T, Xe, false);
    }, e.get = function() {
      let w = this;
      if (!w && t === Y && (w = Y), !w) return null;
      let _ = w[y];
      if (_) return _;
      if (f) {
        let P = f.call(this);
        if (P) return e.set.call(this, P), typeof w[Et] == "function" && w.removeAttribute(n), P;
      }
      return null;
    }, Me(t, n, e), t[c] = true;
  }
  function rt(t, n, a) {
    if (n) for (let e = 0; e < n.length; e++) Ye(t, "on" + n[e], a);
    else {
      let e = [];
      for (let c in t) c.slice(0, 2) == "on" && e.push(c);
      for (let c = 0; c < e.length; c++) Ye(t, e[c], a);
    }
  }
  var oe = j("originalInstance");
  function ye(t) {
    let n = Y[t];
    if (!n) return;
    Y[j(t)] = n, Y[t] = function() {
      let c = Fe(arguments, t);
      switch (c.length) {
        case 0:
          this[oe] = new n();
          break;
        case 1:
          this[oe] = new n(c[0]);
          break;
        case 2:
          this[oe] = new n(c[0], c[1]);
          break;
        case 3:
          this[oe] = new n(c[0], c[1], c[2]);
          break;
        case 4:
          this[oe] = new n(c[0], c[1], c[2], c[3]);
          break;
        default:
          throw new Error("Arg list too long.");
      }
    }, fe(Y[t], n);
    let a = new n(function() {
    }), e;
    for (e in a) t === "XMLHttpRequest" && e === "responseBlob" || (function(c) {
      typeof a[c] == "function" ? Y[t].prototype[c] = function() {
        return this[oe][c].apply(this[oe], arguments);
      } : Me(Y[t].prototype, c, { set: function(f) {
        typeof f == "function" ? (this[oe][c] = Ve(f, t + "." + c), fe(this[oe][c], f)) : this[oe][c] = f;
      }, get: function() {
        return this[oe][c];
      } });
    })(e);
    for (e in n) e !== "prototype" && n.hasOwnProperty(e) && (Y[t][e] = n[e]);
  }
  function ue(t, n, a) {
    let e = t;
    for (; e && !e.hasOwnProperty(n); ) e = Ae(e);
    !e && t[n] && (e = t);
    let c = j(n), f = null;
    if (e && (!(f = e[c]) || !e.hasOwnProperty(c))) {
      f = e[c] = e[n];
      let g = e && pe(e, n);
      if (et(g)) {
        let T = a(f, c, n);
        e[n] = function() {
          return T(this, arguments);
        }, fe(e[n], f);
      }
    }
    return f;
  }
  function mt(t, n, a) {
    let e = null;
    function c(f) {
      let g = f.data;
      return g.args[g.cbIdx] = function() {
        f.invoke.apply(this, arguments);
      }, e.apply(g.target, g.args), f;
    }
    e = ue(t, n, (f) => function(g, T) {
      let y = a(g, T);
      return y.cbIdx >= 0 && typeof T[y.cbIdx] == "function" ? xe(y.name, T[y.cbIdx], y, c) : f.apply(g, T);
    });
  }
  function fe(t, n) {
    t[j("OriginalDelegate")] = n;
  }
  var $e = false;
  var Le = false;
  function yt() {
    if ($e) return Le;
    $e = true;
    try {
      let t = be.navigator.userAgent;
      (t.indexOf("MSIE ") !== -1 || t.indexOf("Trident/") !== -1 || t.indexOf("Edge/") !== -1) && (Le = true);
    } catch {
    }
    return Le;
  }
  function Je(t) {
    return typeof t == "function";
  }
  function Ke(t) {
    return typeof t == "number";
  }
  var pt = { useG: true };
  var ne = {};
  var ot = {};
  var st = new RegExp("^" + ve + "(\\w+)(true|false)$");
  var it = j("propagationStopped");
  function ct(t, n) {
    let a = (n ? n(t) : t) + le, e = (n ? n(t) : t) + ae, c = ve + a, f = ve + e;
    ne[t] = {}, ne[t][le] = c, ne[t][ae] = f;
  }
  function vt(t, n, a, e) {
    let c = e && e.add || je, f = e && e.rm || He, g = e && e.listeners || "eventListeners", T = e && e.rmAll || "removeAllListeners", y = j(c), w = "." + c + ":", _ = "prependListener", P = "." + _ + ":", L = function(p, d, A) {
      if (p.isRemoved) return;
      let V = p.callback;
      typeof V == "object" && V.handleEvent && (p.callback = (k) => V.handleEvent(k), p.originalDelegate = V);
      let X;
      try {
        p.invoke(p, d, [A]);
      } catch (k) {
        X = k;
      }
      let F = p.options;
      if (F && typeof F == "object" && F.once) {
        let k = p.originalDelegate ? p.originalDelegate : p.callback;
        d[f].call(d, A.type, k, F);
      }
      return X;
    };
    function H(p, d, A) {
      if (d = d || t.event, !d) return;
      let V = p || d.target || t, X = V[ne[d.type][A ? ae : le]];
      if (X) {
        let F = [];
        if (X.length === 1) {
          let k = L(X[0], V, d);
          k && F.push(k);
        } else {
          let k = X.slice();
          for (let U = 0; U < k.length && !(d && d[it] === true); U++) {
            let S = L(k[U], V, d);
            S && F.push(S);
          }
        }
        if (F.length === 1) throw F[0];
        for (let k = 0; k < F.length; k++) {
          let U = F[k];
          n.nativeScheduleMicroTask(() => {
            throw U;
          });
        }
      }
    }
    let z = function(p) {
      return H(this, p, false);
    }, $ = function(p) {
      return H(this, p, true);
    };
    function J(p, d) {
      if (!p) return false;
      let A = true;
      d && d.useG !== void 0 && (A = d.useG);
      let V = d && d.vh, X = true;
      d && d.chkDup !== void 0 && (X = d.chkDup);
      let F = false;
      d && d.rt !== void 0 && (F = d.rt);
      let k = p;
      for (; k && !k.hasOwnProperty(c); ) k = Ae(k);
      if (!k && p[c] && (k = p), !k || k[y]) return false;
      let U = d && d.eventNameToString, S = {}, R = k[y] = k[c], b = k[j(f)] = k[f], D = k[j(g)] = k[g], K = k[j(T)] = k[T], W;
      d && d.prepend && (W = k[j(d.prepend)] = k[d.prepend]);
      function I(o, u) {
        return u ? typeof o == "boolean" ? { capture: o, passive: true } : o ? typeof o == "object" && o.passive !== false ? { ...o, passive: true } : o : { passive: true } : o;
      }
      let s = function(o) {
        if (!S.isExisting) return R.call(S.target, S.eventName, S.capture ? $ : z, S.options);
      }, i = function(o) {
        if (!o.isRemoved) {
          let u = ne[o.eventName], v;
          u && (v = u[o.capture ? ae : le]);
          let C = v && o.target[v];
          if (C) {
            for (let m = 0; m < C.length; m++) if (C[m] === o) {
              C.splice(m, 1), o.isRemoved = true, o.removeAbortListener && (o.removeAbortListener(), o.removeAbortListener = null), C.length === 0 && (o.allRemoved = true, o.target[v] = null);
              break;
            }
          }
        }
        if (o.allRemoved) return b.call(o.target, o.eventName, o.capture ? $ : z, o.options);
      }, r = function(o) {
        return R.call(S.target, S.eventName, o.invoke, S.options);
      }, E = function(o) {
        return W.call(S.target, S.eventName, o.invoke, S.options);
      }, x = function(o) {
        return b.call(o.target, o.eventName, o.invoke, o.options);
      }, ee = A ? s : r, M = A ? i : x, he = function(o, u) {
        let v = typeof u;
        return v === "function" && o.callback === u || v === "object" && o.originalDelegate === u;
      }, _e = d?.diff || he, Q = Zone[j("UNPATCHED_EVENTS")], Te = t[j("PASSIVE_EVENTS")];
      function h(o) {
        if (typeof o == "object" && o !== null) {
          let u = { ...o };
          return o.signal && (u.signal = o.signal), u;
        }
        return o;
      }
      let l = function(o, u, v, C, m = false, O = false) {
        return function() {
          let N = this || t, Z = arguments[0];
          d && d.transferEventName && (Z = d.transferEventName(Z));
          let G = arguments[1];
          if (!G) return o.apply(this, arguments);
          if (De && Z === "uncaughtException") return o.apply(this, arguments);
          let B = false;
          if (typeof G != "function") {
            if (!G.handleEvent) return o.apply(this, arguments);
            B = true;
          }
          if (V && !V(o, G, N, arguments)) return;
          let de = !!Te && Te.indexOf(Z) !== -1, se = h(I(arguments[2], de)), Ee = se?.signal;
          if (Ee?.aborted) return;
          if (Q) {
            for (let ie = 0; ie < Q.length; ie++) if (Z === Q[ie]) return de ? o.call(N, Z, G, se) : o.apply(this, arguments);
          }
          let Se = se ? typeof se == "boolean" ? true : se.capture : false, Be = se && typeof se == "object" ? se.once : false, ft = Zone.current, Oe = ne[Z];
          Oe || (ct(Z, U), Oe = ne[Z]);
          let ze = Oe[Se ? ae : le], ge = N[ze], Ue = false;
          if (ge) {
            if (Ue = true, X) {
              for (let ie = 0; ie < ge.length; ie++) if (_e(ge[ie], G)) return;
            }
          } else ge = N[ze] = [];
          let Pe, We = N.constructor.name, qe = ot[We];
          qe && (Pe = qe[Z]), Pe || (Pe = We + u + (U ? U(Z) : Z)), S.options = se, Be && (S.options.once = false), S.target = N, S.capture = Se, S.eventName = Z, S.isExisting = Ue;
          let me = A ? pt : void 0;
          me && (me.taskData = S), Ee && (S.options.signal = void 0);
          let re = ft.scheduleEventTask(Pe, G, me, v, C);
          if (Ee) {
            S.options.signal = Ee;
            let ie = () => re.zone.cancelTask(re);
            o.call(Ee, "abort", ie, { once: true }), re.removeAbortListener = () => Ee.removeEventListener("abort", ie);
          }
          if (S.target = null, me && (me.taskData = null), Be && (S.options.once = true), typeof re.options != "boolean" && (re.options = se), re.target = N, re.capture = Se, re.eventName = Z, B && (re.originalDelegate = G), O ? ge.unshift(re) : ge.push(re), m) return N;
        };
      };
      return k[c] = l(R, w, ee, M, F), W && (k[_] = l(W, P, E, M, F, true)), k[f] = function() {
        let o = this || t, u = arguments[0];
        d && d.transferEventName && (u = d.transferEventName(u));
        let v = arguments[2], C = v ? typeof v == "boolean" ? true : v.capture : false, m = arguments[1];
        if (!m) return b.apply(this, arguments);
        if (V && !V(b, m, o, arguments)) return;
        let O = ne[u], N;
        O && (N = O[C ? ae : le]);
        let Z = N && o[N];
        if (Z) for (let G = 0; G < Z.length; G++) {
          let B = Z[G];
          if (_e(B, m)) {
            if (Z.splice(G, 1), B.isRemoved = true, Z.length === 0 && (B.allRemoved = true, o[N] = null, !C && typeof u == "string")) {
              let de = ve + "ON_PROPERTY" + u;
              o[de] = null;
            }
            return B.zone.cancelTask(B), F ? o : void 0;
          }
        }
        return b.apply(this, arguments);
      }, k[g] = function() {
        let o = this || t, u = arguments[0];
        d && d.transferEventName && (u = d.transferEventName(u));
        let v = [], C = at(o, U ? U(u) : u);
        for (let m = 0; m < C.length; m++) {
          let O = C[m], N = O.originalDelegate ? O.originalDelegate : O.callback;
          v.push(N);
        }
        return v;
      }, k[T] = function() {
        let o = this || t, u = arguments[0];
        if (u) {
          d && d.transferEventName && (u = d.transferEventName(u));
          let v = ne[u];
          if (v) {
            let C = v[le], m = v[ae], O = o[C], N = o[m];
            if (O) {
              let Z = O.slice();
              for (let G = 0; G < Z.length; G++) {
                let B = Z[G], de = B.originalDelegate ? B.originalDelegate : B.callback;
                this[f].call(this, u, de, B.options);
              }
            }
            if (N) {
              let Z = N.slice();
              for (let G = 0; G < Z.length; G++) {
                let B = Z[G], de = B.originalDelegate ? B.originalDelegate : B.callback;
                this[f].call(this, u, de, B.options);
              }
            }
          }
        } else {
          let v = Object.keys(o);
          for (let C = 0; C < v.length; C++) {
            let m = v[C], O = st.exec(m), N = O && O[1];
            N && N !== "removeListener" && this[T].call(this, N);
          }
          this[T].call(this, "removeListener");
        }
        if (F) return this;
      }, fe(k[c], R), fe(k[f], b), K && fe(k[T], K), D && fe(k[g], D), true;
    }
    let q = [];
    for (let p = 0; p < a.length; p++) q[p] = J(a[p], e);
    return q;
  }
  function at(t, n) {
    if (!n) {
      let f = [];
      for (let g in t) {
        let T = st.exec(g), y = T && T[1];
        if (y && (!n || y === n)) {
          let w = t[g];
          if (w) for (let _ = 0; _ < w.length; _++) f.push(w[_]);
        }
      }
      return f;
    }
    let a = ne[n];
    a || (ct(n), a = ne[n]);
    let e = t[a[le]], c = t[a[ae]];
    return e ? c ? e.concat(c) : e.slice() : c ? c.slice() : [];
  }
  function bt(t, n) {
    let a = t.Event;
    a && a.prototype && n.patchMethod(a.prototype, "stopImmediatePropagation", (e) => function(c, f) {
      c[it] = true, e && e.apply(c, f);
    });
  }
  function Pt(t, n) {
    n.patchMethod(t, "queueMicrotask", (a) => function(e, c) {
      Zone.current.scheduleMicroTask("queueMicrotask", c[0]);
    });
  }
  var Re = j("zoneTask");
  function ke(t, n, a, e) {
    let c = null, f = null;
    n += e, a += e;
    let g = {};
    function T(w) {
      let _ = w.data;
      _.args[0] = function() {
        return w.invoke.apply(this, arguments);
      };
      let P = c.apply(t, _.args);
      return Ke(P) ? _.handleId = P : (_.handle = P, _.isRefreshable = Je(P.refresh)), w;
    }
    function y(w) {
      let { handle: _, handleId: P } = w.data;
      return f.call(t, _ ?? P);
    }
    c = ue(t, n, (w) => function(_, P) {
      if (Je(P[0])) {
        let L = { isRefreshable: false, isPeriodic: e === "Interval", delay: e === "Timeout" || e === "Interval" ? P[1] || 0 : void 0, args: P }, H = P[0];
        P[0] = function() {
          try {
            return H.apply(this, arguments);
          } finally {
            let { handle: A, handleId: V, isPeriodic: X, isRefreshable: F } = L;
            !X && !F && (V ? delete g[V] : A && (A[Re] = null));
          }
        };
        let z = xe(n, P[0], L, T, y);
        if (!z) return z;
        let { handleId: $, handle: J, isRefreshable: q, isPeriodic: p } = z.data;
        if ($) g[$] = z;
        else if (J && (J[Re] = z, q && !p)) {
          let d = J.refresh;
          J.refresh = function() {
            let { zone: A, state: V } = z;
            return V === "notScheduled" ? (z._state = "scheduled", A._updateTaskCount(z, 1)) : V === "running" && (z._state = "scheduling"), d.call(this);
          };
        }
        return J ?? $ ?? z;
      } else return w.apply(t, P);
    }), f = ue(t, a, (w) => function(_, P) {
      let L = P[0], H;
      Ke(L) ? (H = g[L], delete g[L]) : (H = L?.[Re], H ? L[Re] = null : H = L), H?.type ? H.cancelFn && H.zone.cancelTask(H) : w.apply(t, P);
    });
  }
  function Rt(t, n) {
    let { isBrowser: a, isMix: e } = n.getGlobalObjects();
    if (!a && !e || !t.customElements || !("customElements" in t)) return;
    let c = ["connectedCallback", "disconnectedCallback", "adoptedCallback", "attributeChangedCallback", "formAssociatedCallback", "formDisabledCallback", "formResetCallback", "formStateRestoreCallback"];
    n.patchCallbacks(n, t.customElements, "customElements", "define", c);
  }
  function Ct(t, n) {
    if (Zone[n.symbol("patchEventTarget")]) return;
    let { eventNames: a, zoneSymbolEventNames: e, TRUE_STR: c, FALSE_STR: f, ZONE_SYMBOL_PREFIX: g } = n.getGlobalObjects();
    for (let y = 0; y < a.length; y++) {
      let w = a[y], _ = w + f, P = w + c, L = g + _, H = g + P;
      e[w] = {}, e[w][f] = L, e[w][c] = H;
    }
    let T = t.EventTarget;
    if (!(!T || !T.prototype)) return n.patchEventTarget(t, n, [T && T.prototype]), true;
  }
  function wt(t, n) {
    n.patchEventPrototype(t, n);
  }
  function lt(t, n, a) {
    if (!a || a.length === 0) return n;
    let e = a.filter((f) => f.target === t);
    if (e.length === 0) return n;
    let c = e[0].ignoreProperties;
    return n.filter((f) => c.indexOf(f) === -1);
  }
  function Qe(t, n, a, e) {
    if (!t) return;
    let c = lt(t, n, a);
    rt(t, c, e);
  }
  function Ie(t) {
    return Object.getOwnPropertyNames(t).filter((n) => n.startsWith("on") && n.length > 2).map((n) => n.substring(2));
  }
  function Dt(t, n) {
    if (De && !nt || Zone[t.symbol("patchEvents")]) return;
    let a = n.__Zone_ignore_on_properties, e = [];
    if (Ge) {
      let c = window;
      e = e.concat(["Document", "SVGElement", "Element", "HTMLElement", "HTMLBodyElement", "HTMLMediaElement", "HTMLFrameSetElement", "HTMLFrameElement", "HTMLIFrameElement", "HTMLMarqueeElement", "Worker"]);
      let f = [];
      Qe(c, Ie(c), a && a.concat(f), Ae(c));
    }
    e = e.concat(["XMLHttpRequest", "XMLHttpRequestEventTarget", "IDBIndex", "IDBRequest", "IDBOpenDBRequest", "IDBDatabase", "IDBTransaction", "IDBCursor", "WebSocket"]);
    for (let c = 0; c < e.length; c++) {
      let f = n[e[c]];
      f?.prototype && Qe(f.prototype, Ie(f.prototype), a);
    }
  }
  function St(t) {
    t.__load_patch("legacy", (n) => {
      let a = n[t.__symbol__("legacyPatch")];
      a && a();
    }), t.__load_patch("timers", (n) => {
      let e = "clear";
      ke(n, "set", e, "Timeout"), ke(n, "set", e, "Interval"), ke(n, "set", e, "Immediate");
    }), t.__load_patch("requestAnimationFrame", (n) => {
      ke(n, "request", "cancel", "AnimationFrame"), ke(n, "mozRequest", "mozCancel", "AnimationFrame"), ke(n, "webkitRequest", "webkitCancel", "AnimationFrame");
    }), t.__load_patch("blocking", (n, a) => {
      let e = ["alert", "prompt", "confirm"];
      for (let c = 0; c < e.length; c++) {
        let f = e[c];
        ue(n, f, (g, T, y) => function(w, _) {
          return a.current.run(g, n, _, y);
        });
      }
    }), t.__load_patch("EventTarget", (n, a, e) => {
      wt(n, e), Ct(n, e);
      let c = n.XMLHttpRequestEventTarget;
      c && c.prototype && e.patchEventTarget(n, e, [c.prototype]);
    }), t.__load_patch("MutationObserver", (n, a, e) => {
      ye("MutationObserver"), ye("WebKitMutationObserver");
    }), t.__load_patch("IntersectionObserver", (n, a, e) => {
      ye("IntersectionObserver");
    }), t.__load_patch("FileReader", (n, a, e) => {
      ye("FileReader");
    }), t.__load_patch("on_property", (n, a, e) => {
      Dt(e, n);
    }), t.__load_patch("customElements", (n, a, e) => {
      Rt(n, e);
    }), t.__load_patch("XHR", (n, a) => {
      w(n);
      let e = j("xhrTask"), c = j("xhrSync"), f = j("xhrListener"), g = j("xhrScheduled"), T = j("xhrURL"), y = j("xhrErrorBeforeScheduled");
      function w(_) {
        let P = _.XMLHttpRequest;
        if (!P) return;
        let L = P.prototype;
        function H(R) {
          return R[e];
        }
        let z = L[Ne], $ = L[Ze];
        if (!z) {
          let R = _.XMLHttpRequestEventTarget;
          if (R) {
            let b = R.prototype;
            z = b[Ne], $ = b[Ze];
          }
        }
        let J = "readystatechange", q = "scheduled";
        function p(R) {
          let b = R.data, D = b.target;
          D[g] = false, D[y] = false;
          let K = D[f];
          z || (z = D[Ne], $ = D[Ze]), K && $.call(D, J, K);
          let W = D[f] = () => {
            if (D.readyState === D.DONE) if (!b.aborted && D[g] && R.state === q) {
              let s = D[a.__symbol__("loadfalse")];
              if (D.status !== 0 && s && s.length > 0) {
                let i = R.invoke;
                R.invoke = function() {
                  let r = D[a.__symbol__("loadfalse")];
                  for (let E = 0; E < r.length; E++) r[E] === R && r.splice(E, 1);
                  !b.aborted && R.state === q && i.call(R);
                }, s.push(R);
              } else R.invoke();
            } else !b.aborted && D[g] === false && (D[y] = true);
          };
          return z.call(D, J, W), D[e] || (D[e] = R), U.apply(D, b.args), D[g] = true, R;
        }
        function d() {
        }
        function A(R) {
          let b = R.data;
          return b.aborted = true, S.apply(b.target, b.args);
        }
        let V = ue(L, "open", () => function(R, b) {
          return R[c] = b[2] == false, R[T] = b[1], V.apply(R, b);
        }), X = "XMLHttpRequest.send", F = j("fetchTaskAborting"), k = j("fetchTaskScheduling"), U = ue(L, "send", () => function(R, b) {
          if (a.current[k] === true || R[c]) return U.apply(R, b);
          {
            let D = { target: R, url: R[T], isPeriodic: false, args: b, aborted: false }, K = xe(X, d, D, p, A);
            R && R[y] === true && !D.aborted && K.state === q && K.invoke();
          }
        }), S = ue(L, "abort", () => function(R, b) {
          let D = H(R);
          if (D && typeof D.type == "string") {
            if (D.cancelFn == null || D.data && D.data.aborted) return;
            D.zone.cancelTask(D);
          } else if (a.current[F] === true) return S.apply(R, b);
        });
      }
    }), t.__load_patch("geolocation", (n) => {
      n.navigator && n.navigator.geolocation && gt(n.navigator.geolocation, ["getCurrentPosition", "watchPosition"]);
    }), t.__load_patch("PromiseRejectionEvent", (n, a) => {
      function e(c) {
        return function(f) {
          at(n, c).forEach((T) => {
            let y = n.PromiseRejectionEvent;
            if (y) {
              let w = new y(c, { promise: f.promise, reason: f.rejection });
              T.invoke(w);
            }
          });
        };
      }
      n.PromiseRejectionEvent && (a[j("unhandledPromiseRejectionHandler")] = e("unhandledrejection"), a[j("rejectionHandledHandler")] = e("rejectionhandled"));
    }), t.__load_patch("queueMicrotask", (n, a, e) => {
      Pt(n, e);
    });
  }
  function Ot(t) {
    t.__load_patch("ZoneAwarePromise", (n, a, e) => {
      let c = Object.getOwnPropertyDescriptor, f = Object.defineProperty;
      function g(h) {
        if (h && h.toString === Object.prototype.toString) {
          let l = h.constructor && h.constructor.name;
          return (l || "") + ": " + JSON.stringify(h);
        }
        return h ? h.toString() : Object.prototype.toString.call(h);
      }
      let T = e.symbol, y = [], w = n[T("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== false, _ = T("Promise"), P = T("then"), L = "__creationTrace__";
      e.onUnhandledError = (h) => {
        if (e.showUncaughtError()) {
          let l = h && h.rejection;
          l ? console.error("Unhandled Promise rejection:", l instanceof Error ? l.message : l, "; Zone:", h.zone.name, "; Task:", h.task && h.task.source, "; Value:", l, l instanceof Error ? l.stack : void 0) : console.error(h);
        }
      }, e.microtaskDrainDone = () => {
        for (; y.length; ) {
          let h = y.shift();
          try {
            h.zone.runGuarded(() => {
              throw h.throwOriginal ? h.rejection : h;
            });
          } catch (l) {
            z(l);
          }
        }
      };
      let H = T("unhandledPromiseRejectionHandler");
      function z(h) {
        e.onUnhandledError(h);
        try {
          let l = a[H];
          typeof l == "function" && l.call(this, h);
        } catch {
        }
      }
      function $(h) {
        return h && typeof h.then == "function";
      }
      function J(h) {
        return h;
      }
      function q(h) {
        return M.reject(h);
      }
      let p = T("state"), d = T("value"), A = T("finally"), V = T("parentPromiseValue"), X = T("parentPromiseState"), F = "Promise.then", k = null, U = true, S = false, R = 0;
      function b(h, l) {
        return (o) => {
          try {
            I(h, l, o);
          } catch (u) {
            I(h, false, u);
          }
        };
      }
      let D = function() {
        let h = false;
        return function(o) {
          return function() {
            h || (h = true, o.apply(null, arguments));
          };
        };
      }, K = "Promise resolved with itself", W = T("currentTaskTrace");
      function I(h, l, o) {
        let u = D();
        if (h === o) throw new TypeError(K);
        if (h[p] === k) {
          let v = null;
          try {
            (typeof o == "object" || typeof o == "function") && (v = o && o.then);
          } catch (C) {
            return u(() => {
              I(h, false, C);
            })(), h;
          }
          if (l !== S && o instanceof M && o.hasOwnProperty(p) && o.hasOwnProperty(d) && o[p] !== k) i(o), I(h, o[p], o[d]);
          else if (l !== S && typeof v == "function") try {
            v.call(o, u(b(h, l)), u(b(h, false)));
          } catch (C) {
            u(() => {
              I(h, false, C);
            })();
          }
          else {
            h[p] = l;
            let C = h[d];
            if (h[d] = o, h[A] === A && l === U && (h[p] = h[X], h[d] = h[V]), l === S && o instanceof Error) {
              let m = a.currentTask && a.currentTask.data && a.currentTask.data[L];
              m && f(o, W, { configurable: true, enumerable: false, writable: true, value: m });
            }
            for (let m = 0; m < C.length; ) r(h, C[m++], C[m++], C[m++], C[m++]);
            if (C.length == 0 && l == S) {
              h[p] = R;
              let m = o;
              try {
                throw new Error("Uncaught (in promise): " + g(o) + (o && o.stack ? `
` + o.stack : ""));
              } catch (O) {
                m = O;
              }
              w && (m.throwOriginal = true), m.rejection = o, m.promise = h, m.zone = a.current, m.task = a.currentTask, y.push(m), e.scheduleMicroTask();
            }
          }
        }
        return h;
      }
      let s = T("rejectionHandledHandler");
      function i(h) {
        if (h[p] === R) {
          try {
            let l = a[s];
            l && typeof l == "function" && l.call(this, { rejection: h[d], promise: h });
          } catch {
          }
          h[p] = S;
          for (let l = 0; l < y.length; l++) h === y[l].promise && y.splice(l, 1);
        }
      }
      function r(h, l, o, u, v) {
        i(h);
        let C = h[p], m = C ? typeof u == "function" ? u : J : typeof v == "function" ? v : q;
        l.scheduleMicroTask(F, () => {
          try {
            let O = h[d], N = !!o && A === o[A];
            N && (o[V] = O, o[X] = C);
            let Z = l.run(m, void 0, N && m !== q && m !== J ? [] : [O]);
            I(o, true, Z);
          } catch (O) {
            I(o, false, O);
          }
        }, o);
      }
      let E = "function ZoneAwarePromise() { [native code] }", x = function() {
      }, ee = n.AggregateError;
      class M {
        static toString() {
          return E;
        }
        static resolve(l) {
          return l instanceof M ? l : I(new this(null), U, l);
        }
        static reject(l) {
          return I(new this(null), S, l);
        }
        static withResolvers() {
          let l = {};
          return l.promise = new M((o, u) => {
            l.resolve = o, l.reject = u;
          }), l;
        }
        static any(l) {
          if (!l || typeof l[Symbol.iterator] != "function") return Promise.reject(new ee([], "All promises were rejected"));
          let o = [], u = 0;
          try {
            for (let m of l) u++, o.push(M.resolve(m));
          } catch {
            return Promise.reject(new ee([], "All promises were rejected"));
          }
          if (u === 0) return Promise.reject(new ee([], "All promises were rejected"));
          let v = false, C = [];
          return new M((m, O) => {
            for (let N = 0; N < o.length; N++) o[N].then((Z) => {
              v || (v = true, m(Z));
            }, (Z) => {
              C.push(Z), u--, u === 0 && (v = true, O(new ee(C, "All promises were rejected")));
            });
          });
        }
        static race(l) {
          let o, u, v = new this((O, N) => {
            o = O, u = N;
          });
          function C(O) {
            o(O);
          }
          function m(O) {
            u(O);
          }
          for (let O of l) $(O) || (O = this.resolve(O)), O.then(C, m);
          return v;
        }
        static all(l) {
          return M.allWithCallback(l);
        }
        static allSettled(l) {
          return (this && this.prototype instanceof M ? this : M).allWithCallback(l, { thenCallback: (u) => ({ status: "fulfilled", value: u }), errorCallback: (u) => ({ status: "rejected", reason: u }) });
        }
        static allWithCallback(l, o) {
          let u, v, C = new this((Z, G) => {
            u = Z, v = G;
          }), m = 2, O = 0, N = [];
          for (let Z of l) {
            $(Z) || (Z = this.resolve(Z));
            let G = O;
            try {
              Z.then((B) => {
                N[G] = o ? o.thenCallback(B) : B, m--, m === 0 && u(N);
              }, (B) => {
                o ? (N[G] = o.errorCallback(B), m--, m === 0 && u(N)) : v(B);
              });
            } catch (B) {
              v(B);
            }
            m++, O++;
          }
          return m -= 2, m === 0 && u(N), C;
        }
        constructor(l) {
          let o = this;
          if (!(o instanceof M)) throw new Error("Must be an instanceof Promise.");
          o[p] = k, o[d] = [];
          try {
            let u = D();
            l && l(u(b(o, U)), u(b(o, S)));
          } catch (u) {
            I(o, false, u);
          }
        }
        get [Symbol.toStringTag]() {
          return "Promise";
        }
        get [Symbol.species]() {
          return M;
        }
        then(l, o) {
          let u = this.constructor?.[Symbol.species];
          (!u || typeof u != "function") && (u = this.constructor || M);
          let v = new u(x), C = a.current;
          return this[p] == k ? this[d].push(C, v, l, o) : r(this, C, v, l, o), v;
        }
        catch(l) {
          return this.then(null, l);
        }
        finally(l) {
          let o = this.constructor?.[Symbol.species];
          (!o || typeof o != "function") && (o = M);
          let u = new o(x);
          u[A] = A;
          let v = a.current;
          return this[p] == k ? this[d].push(v, u, l, l) : r(this, v, u, l, l), u;
        }
      }
      M.resolve = M.resolve, M.reject = M.reject, M.race = M.race, M.all = M.all;
      let he = n[_] = n.Promise;
      n.Promise = M;
      let _e = T("thenPatched");
      function Q(h) {
        let l = h.prototype, o = c(l, "then");
        if (o && (o.writable === false || !o.configurable)) return;
        let u = l.then;
        l[P] = u, h.prototype.then = function(v, C) {
          return new M((O, N) => {
            u.call(this, O, N);
          }).then(v, C);
        }, h[_e] = true;
      }
      e.patchThen = Q;
      function Te(h) {
        return function(l, o) {
          let u = h.apply(l, o);
          if (u instanceof M) return u;
          let v = u.constructor;
          return v[_e] || Q(v), u;
        };
      }
      return he && (Q(he), ue(n, "fetch", (h) => Te(h))), Promise[a.__symbol__("uncaughtPromiseErrors")] = y, M;
    });
  }
  function Nt(t) {
    t.__load_patch("toString", (n) => {
      let a = Function.prototype.toString, e = j("OriginalDelegate"), c = j("Promise"), f = j("Error"), g = function() {
        if (typeof this == "function") {
          let _ = this[e];
          if (_) return typeof _ == "function" ? a.call(_) : Object.prototype.toString.call(_);
          if (this === Promise) {
            let P = n[c];
            if (P) return a.call(P);
          }
          if (this === Error) {
            let P = n[f];
            if (P) return a.call(P);
          }
        }
        return a.call(this);
      };
      g[e] = a, Function.prototype.toString = g;
      let T = Object.prototype.toString, y = "[object Promise]";
      Object.prototype.toString = function() {
        return typeof Promise == "function" && this instanceof Promise ? y : T.call(this);
      };
    });
  }
  function Zt(t, n, a, e, c) {
    let f = Zone.__symbol__(e);
    if (n[f]) return;
    let g = n[f] = n[e];
    n[e] = function(T, y, w) {
      return y && y.prototype && c.forEach(function(_) {
        let P = `${a}.${e}::` + _, L = y.prototype;
        try {
          if (L.hasOwnProperty(_)) {
            let H = t.ObjectGetOwnPropertyDescriptor(L, _);
            H && H.value ? (H.value = t.wrapWithCurrentZone(H.value, P), t._redefineProperty(y.prototype, _, H)) : L[_] && (L[_] = t.wrapWithCurrentZone(L[_], P));
          } else L[_] && (L[_] = t.wrapWithCurrentZone(L[_], P));
        } catch {
        }
      }), g.call(n, T, y, w);
    }, t.attachOriginToPatched(n[e], g);
  }
  function Lt(t) {
    t.__load_patch("util", (n, a, e) => {
      let c = Ie(n);
      e.patchOnProperties = rt, e.patchMethod = ue, e.bindArguments = Fe, e.patchMacroTask = mt;
      let f = a.__symbol__("BLACK_LISTED_EVENTS"), g = a.__symbol__("UNPATCHED_EVENTS");
      n[g] && (n[f] = n[g]), n[f] && (a[f] = a[g] = n[f]), e.patchEventPrototype = bt, e.patchEventTarget = vt, e.isIEOrEdge = yt, e.ObjectDefineProperty = Me, e.ObjectGetOwnPropertyDescriptor = pe, e.ObjectCreate = _t, e.ArraySlice = Tt, e.patchClass = ye, e.wrapWithCurrentZone = Ve, e.filterProperties = lt, e.attachOriginToPatched = fe, e._redefineProperty = Object.defineProperty, e.patchCallbacks = Zt, e.getGlobalObjects = () => ({ globalSources: ot, zoneSymbolEventNames: ne, eventNames: c, isBrowser: Ge, isMix: nt, isNode: De, TRUE_STR: ae, FALSE_STR: le, ZONE_SYMBOL_PREFIX: ve, ADD_EVENT_LISTENER_STR: je, REMOVE_EVENT_LISTENER_STR: He });
    });
  }
  function It(t) {
    Ot(t), Nt(t), Lt(t);
  }
  var ut = dt();
  It(ut);
  St(ut);
})();

;
(() => {
  var Ed = Object.defineProperty;
  var Cd = Object.defineProperties;
  var Md = Object.getOwnPropertyDescriptors;
  var Ys = Object.getOwnPropertySymbols;
  var Sd = Object.prototype.hasOwnProperty;
  var Td = Object.prototype.propertyIsEnumerable;
  var Ks = (e, t, n) => t in e ? Ed(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
  var D = (e, t) => {
    for (var n in t ||= {}) Sd.call(t, n) && Ks(e, n, t[n]);
    if (Ys) for (var n of Ys(t)) Td.call(t, n) && Ks(e, n, t[n]);
    return e;
  };
  var B = (e, t) => Cd(e, Md(t));
  var p = (e, t) => () => (e && (t = e(e = 0)), t);
  var xd = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
  var un = (e, t, n) => new Promise((r, o) => {
    var i = (l) => {
      try {
        a(n.next(l));
      } catch (c) {
        o(c);
      }
    }, s = (l) => {
      try {
        a(n.throw(l));
      } catch (c) {
        o(c);
      }
    }, a = (l) => l.done ? r(l.value) : Promise.resolve(l.value).then(i, s);
    a((n = n.apply(e, t)).next());
  });
  function $r(e, t) {
    return Object.is(e, t);
  }
  function y(e) {
    let t = j;
    return j = e, t;
  }
  function Ur() {
    return j;
  }
  function hn(e) {
    if (dn) throw new Error("");
    if (j === null) return;
    j.consumerOnSignalRead(e);
    let t = j.nextProducerIndex++;
    if (mn(j), t < j.producerNode.length && j.producerNode[t] !== e && bt(j)) {
      let n = j.producerNode[t];
      gn(n, j.producerIndexOfThis[t]);
    }
    j.producerNode[t] !== e && (j.producerNode[t] = e, j.producerIndexOfThis[t] = bt(j) ? Xs(e, j, t) : 0), j.producerLastReadVersion[t] = e.version;
  }
  function Js() {
    Br++;
  }
  function Gr(e) {
    if (!(bt(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Br)) {
      if (!e.producerMustRecompute(e) && !Zr(e)) {
        Hr(e);
        return;
      }
      e.producerRecomputeValue(e), Hr(e);
    }
  }
  function zr(e) {
    if (e.liveConsumerNode === void 0) return;
    let t = dn;
    dn = true;
    try {
      for (let n of e.liveConsumerNode) n.dirty || Nd(n);
    } finally {
      dn = t;
    }
  }
  function Wr() {
    return j?.consumerAllowSignalWrites !== false;
  }
  function Nd(e) {
    e.dirty = true, zr(e), e.consumerMarkedDirty?.(e);
  }
  function Hr(e) {
    e.dirty = false, e.lastCleanEpoch = Br;
  }
  function pn(e) {
    return e && (e.nextProducerIndex = 0), y(e);
  }
  function qr(e, t) {
    if (y(t), !(!e || e.producerNode === void 0 || e.producerIndexOfThis === void 0 || e.producerLastReadVersion === void 0)) {
      if (bt(e)) for (let n = e.nextProducerIndex; n < e.producerNode.length; n++) gn(e.producerNode[n], e.producerIndexOfThis[n]);
      for (; e.producerNode.length > e.nextProducerIndex; ) e.producerNode.pop(), e.producerLastReadVersion.pop(), e.producerIndexOfThis.pop();
    }
  }
  function Zr(e) {
    mn(e);
    for (let t = 0; t < e.producerNode.length; t++) {
      let n = e.producerNode[t], r = e.producerLastReadVersion[t];
      if (r !== n.version || (Gr(n), r !== n.version)) return true;
    }
    return false;
  }
  function Qr(e) {
    if (mn(e), bt(e)) for (let t = 0; t < e.producerNode.length; t++) gn(e.producerNode[t], e.producerIndexOfThis[t]);
    e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0, e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
  }
  function Xs(e, t, n) {
    if (ea(e), e.liveConsumerNode.length === 0 && ta(e)) for (let r = 0; r < e.producerNode.length; r++) e.producerIndexOfThis[r] = Xs(e.producerNode[r], e, r);
    return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
  }
  function gn(e, t) {
    if (ea(e), e.liveConsumerNode.length === 1 && ta(e)) for (let r = 0; r < e.producerNode.length; r++) gn(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (e.liveConsumerNode[t] = e.liveConsumerNode[n], e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n], e.liveConsumerNode.length--, e.liveConsumerIndexOfThis.length--, t < e.liveConsumerNode.length) {
      let r = e.liveConsumerIndexOfThis[t], o = e.liveConsumerNode[t];
      mn(o), o.producerIndexOfThis[r] = t;
    }
  }
  function bt(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
  }
  function mn(e) {
    e.producerNode ??= [], e.producerIndexOfThis ??= [], e.producerLastReadVersion ??= [];
  }
  function ea(e) {
    e.liveConsumerNode ??= [], e.liveConsumerIndexOfThis ??= [];
  }
  function ta(e) {
    return e.producerNode !== void 0;
  }
  function Yr(e, t) {
    let n = Object.create(kd);
    n.computation = e, t !== void 0 && (n.equal = t);
    let r = () => {
      if (Gr(n), hn(n), n.value === fn) throw n.error;
      return n.value;
    };
    return r[le] = n, r;
  }
  function Ad() {
    throw new Error();
  }
  function ra(e) {
    na(e);
  }
  function Kr(e) {
    na = e;
  }
  function Jr(e, t) {
    let n = Object.create(eo);
    n.value = e, t !== void 0 && (n.equal = t);
    let r = () => (hn(n), n.value);
    return r[le] = n, r;
  }
  function vn(e, t) {
    Wr() || ra(e), e.equal(e.value, t) || (e.value = t, Od(e));
  }
  function Xr(e, t) {
    Wr() || ra(e), vn(e, t(e.value));
  }
  function Od(e) {
    e.version++, Js(), zr(e), Rd?.();
  }
  var j;
  var dn;
  var Br;
  var le;
  var Dt;
  var Vr;
  var jr;
  var fn;
  var kd;
  var na;
  var Rd;
  var eo;
  var to = p(() => {
    "use strict";
    j = null, dn = false, Br = 1, le = /* @__PURE__ */ Symbol("SIGNAL");
    Dt = { version: 0, lastCleanEpoch: 0, dirty: false, producerNode: void 0, producerLastReadVersion: void 0, producerIndexOfThis: void 0, nextProducerIndex: 0, liveConsumerNode: void 0, liveConsumerIndexOfThis: void 0, consumerAllowSignalWrites: false, consumerIsAlwaysLive: false, kind: "unknown", producerMustRecompute: () => false, producerRecomputeValue: () => {
    }, consumerMarkedDirty: () => {
    }, consumerOnSignalRead: () => {
    } };
    Vr = /* @__PURE__ */ Symbol("UNSET"), jr = /* @__PURE__ */ Symbol("COMPUTING"), fn = /* @__PURE__ */ Symbol("ERRORED"), kd = B(D({}, Dt), { value: Vr, dirty: true, error: null, equal: $r, kind: "computed", producerMustRecompute(e) {
      return e.value === Vr || e.value === jr;
    }, producerRecomputeValue(e) {
      if (e.value === jr) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = jr;
      let n = pn(e), r, o = false;
      try {
        r = e.computation(), y(null), o = t !== Vr && t !== fn && r !== fn && e.equal(t, r);
      } catch (i) {
        r = fn, e.error = i;
      } finally {
        qr(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      e.value = r, e.version++;
    } });
    na = Ad;
    Rd = null;
    eo = B(D({}, Dt), { equal: $r, value: void 0, kind: "signal" });
  });
  function wt() {
    return no;
  }
  function _e(e) {
    let t = no;
    return no = e, t;
  }
  var no;
  var yn;
  var ro = p(() => {
    "use strict";
    yn = /* @__PURE__ */ Symbol("NotFound");
  });
  var oa = p(() => {
    "use strict";
    to();
  });
  function C(e) {
    return typeof e == "function";
  }
  var q = p(() => {
    "use strict";
  });
  function _n(e) {
    let n = e((r) => {
      Error.call(r), r.stack = new Error().stack;
    });
    return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n;
  }
  var oo = p(() => {
    "use strict";
  });
  var In;
  var ia = p(() => {
    "use strict";
    oo();
    In = _n((e) => function(n) {
      e(this), this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = n;
    });
  });
  function Et(e, t) {
    if (e) {
      let n = e.indexOf(t);
      0 <= n && e.splice(n, 1);
    }
  }
  var io = p(() => {
    "use strict";
  });
  function bn(e) {
    return e instanceof G || e && "closed" in e && C(e.remove) && C(e.add) && C(e.unsubscribe);
  }
  function sa(e) {
    C(e) ? e() : e.unsubscribe();
  }
  var G;
  var so;
  var Ct = p(() => {
    "use strict";
    q();
    ia();
    io();
    G = class e {
      constructor(t) {
        this.initialTeardown = t, this.closed = false, this._parentage = null, this._finalizers = null;
      }
      unsubscribe() {
        let t;
        if (!this.closed) {
          this.closed = true;
          let { _parentage: n } = this;
          if (n) if (this._parentage = null, Array.isArray(n)) for (let i of n) i.remove(this);
          else n.remove(this);
          let { initialTeardown: r } = this;
          if (C(r)) try {
            r();
          } catch (i) {
            t = i instanceof In ? i.errors : [i];
          }
          let { _finalizers: o } = this;
          if (o) {
            this._finalizers = null;
            for (let i of o) try {
              sa(i);
            } catch (s) {
              t = t ?? [], s instanceof In ? t = [...t, ...s.errors] : t.push(s);
            }
          }
          if (t) throw new In(t);
        }
      }
      add(t) {
        var n;
        if (t && t !== this) if (this.closed) sa(t);
        else {
          if (t instanceof e) {
            if (t.closed || t._hasParent(this)) return;
            t._addParent(this);
          }
          (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
        }
      }
      _hasParent(t) {
        let { _parentage: n } = this;
        return n === t || Array.isArray(n) && n.includes(t);
      }
      _addParent(t) {
        let { _parentage: n } = this;
        this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
      }
      _removeParent(t) {
        let { _parentage: n } = this;
        n === t ? this._parentage = null : Array.isArray(n) && Et(n, t);
      }
      remove(t) {
        let { _finalizers: n } = this;
        n && Et(n, t), t instanceof e && t._removeParent(this);
      }
    };
    G.EMPTY = (() => {
      let e = new G();
      return e.closed = true, e;
    })();
    so = G.EMPTY;
  });
  var re;
  var Mt = p(() => {
    "use strict";
    re = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: false, useDeprecatedNextContext: false };
  });
  var Ye;
  var ao = p(() => {
    "use strict";
    Ye = { setTimeout(e, t, ...n) {
      let { delegate: r } = Ye;
      return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
    }, clearTimeout(e) {
      let { delegate: t } = Ye;
      return (t?.clearTimeout || clearTimeout)(e);
    }, delegate: void 0 };
  });
  function Dn(e) {
    Ye.setTimeout(() => {
      let { onUnhandledError: t } = re;
      if (t) t(e);
      else throw e;
    });
  }
  var lo = p(() => {
    "use strict";
    Mt();
    ao();
  });
  function co() {
  }
  var aa = p(() => {
    "use strict";
  });
  function ca(e) {
    return uo("E", void 0, e);
  }
  function ua(e) {
    return uo("N", e, void 0);
  }
  function uo(e, t, n) {
    return { kind: e, value: t, error: n };
  }
  var la;
  var da = p(() => {
    "use strict";
    la = uo("C", void 0, void 0);
  });
  function Ke(e) {
    if (re.useDeprecatedSynchronousErrorHandling) {
      let t = !Oe;
      if (t && (Oe = { errorThrown: false, error: null }), e(), t) {
        let { errorThrown: n, error: r } = Oe;
        if (Oe = null, n) throw r;
      }
    } else e();
  }
  function fa(e) {
    re.useDeprecatedSynchronousErrorHandling && Oe && (Oe.errorThrown = true, Oe.error = e);
  }
  var Oe;
  var wn = p(() => {
    "use strict";
    Mt();
    Oe = null;
  });
  function fo(e, t) {
    return jd.call(e, t);
  }
  function En(e) {
    re.useDeprecatedSynchronousErrorHandling ? fa(e) : Dn(e);
  }
  function Hd(e) {
    throw e;
  }
  function ho(e, t) {
    let { onStoppedNotification: n } = re;
    n && Ye.setTimeout(() => n(e, t));
  }
  var Pe;
  var jd;
  var po;
  var Je;
  var $d;
  var go = p(() => {
    "use strict";
    q();
    Ct();
    Mt();
    lo();
    aa();
    da();
    ao();
    wn();
    Pe = class extends G {
      constructor(t) {
        super(), this.isStopped = false, t ? (this.destination = t, bn(t) && t.add(this)) : this.destination = $d;
      }
      static create(t, n, r) {
        return new Je(t, n, r);
      }
      next(t) {
        this.isStopped ? ho(ua(t), this) : this._next(t);
      }
      error(t) {
        this.isStopped ? ho(ca(t), this) : (this.isStopped = true, this._error(t));
      }
      complete() {
        this.isStopped ? ho(la, this) : (this.isStopped = true, this._complete());
      }
      unsubscribe() {
        this.closed || (this.isStopped = true, super.unsubscribe(), this.destination = null);
      }
      _next(t) {
        this.destination.next(t);
      }
      _error(t) {
        try {
          this.destination.error(t);
        } finally {
          this.unsubscribe();
        }
      }
      _complete() {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      }
    }, jd = Function.prototype.bind;
    po = class {
      constructor(t) {
        this.partialObserver = t;
      }
      next(t) {
        let { partialObserver: n } = this;
        if (n.next) try {
          n.next(t);
        } catch (r) {
          En(r);
        }
      }
      error(t) {
        let { partialObserver: n } = this;
        if (n.error) try {
          n.error(t);
        } catch (r) {
          En(r);
        }
        else En(t);
      }
      complete() {
        let { partialObserver: t } = this;
        if (t.complete) try {
          t.complete();
        } catch (n) {
          En(n);
        }
      }
    }, Je = class extends Pe {
      constructor(t, n, r) {
        super();
        let o;
        if (C(t) || !t) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
        else {
          let i;
          this && re.useDeprecatedNextContext ? (i = Object.create(t), i.unsubscribe = () => this.unsubscribe(), o = { next: t.next && fo(t.next, i), error: t.error && fo(t.error, i), complete: t.complete && fo(t.complete, i) }) : o = t;
        }
        this.destination = new po(o);
      }
    };
    $d = { closed: true, next: co, error: Hd, complete: co };
  });
  var Xe;
  var Cn = p(() => {
    "use strict";
    Xe = typeof Symbol == "function" && Symbol.observable || "@@observable";
  });
  function Mn(e) {
    return e;
  }
  var mo = p(() => {
    "use strict";
  });
  function ha(e) {
    return e.length === 0 ? Mn : e.length === 1 ? e[0] : function(n) {
      return e.reduce((r, o) => o(r), n);
    };
  }
  var pa = p(() => {
    "use strict";
    mo();
  });
  function ga(e) {
    var t;
    return (t = e ?? re.Promise) !== null && t !== void 0 ? t : Promise;
  }
  function Bd(e) {
    return e && C(e.next) && C(e.error) && C(e.complete);
  }
  function Ud(e) {
    return e && e instanceof Pe || Bd(e) && bn(e);
  }
  var R;
  var Me = p(() => {
    "use strict";
    go();
    Ct();
    Cn();
    pa();
    Mt();
    q();
    wn();
    R = (() => {
      class e {
        constructor(n) {
          n && (this._subscribe = n);
        }
        lift(n) {
          let r = new e();
          return r.source = this, r.operator = n, r;
        }
        subscribe(n, r, o) {
          let i = Ud(n) ? n : new Je(n, r, o);
          return Ke(() => {
            let { operator: s, source: a } = this;
            i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
          }), i;
        }
        _trySubscribe(n) {
          try {
            return this._subscribe(n);
          } catch (r) {
            n.error(r);
          }
        }
        forEach(n, r) {
          return r = ga(r), new r((o, i) => {
            let s = new Je({ next: (a) => {
              try {
                n(a);
              } catch (l) {
                i(l), s.unsubscribe();
              }
            }, error: i, complete: o });
            this.subscribe(s);
          });
        }
        _subscribe(n) {
          var r;
          return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n);
        }
        [Xe]() {
          return this;
        }
        pipe(...n) {
          return ha(n)(this);
        }
        toPromise(n) {
          return n = ga(n), new n((r, o) => {
            let i;
            this.subscribe((s) => i = s, (s) => o(s), () => r(i));
          });
        }
      }
      return e.create = (t) => new e(t), e;
    })();
  });
  function Gd(e) {
    return C(e?.lift);
  }
  function ce(e) {
    return (t) => {
      if (Gd(t)) return t.lift(function(n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  var et = p(() => {
    "use strict";
    q();
  });
  function ue(e, t, n, r, o) {
    return new vo(e, t, n, r, o);
  }
  var vo;
  var St = p(() => {
    "use strict";
    go();
    vo = class extends Pe {
      constructor(t, n, r, o, i, s) {
        super(t), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = n ? function(a) {
          try {
            n(a);
          } catch (l) {
            t.error(l);
          }
        } : super._next, this._error = o ? function(a) {
          try {
            o(a);
          } catch (l) {
            t.error(l);
          } finally {
            this.unsubscribe();
          }
        } : super._error, this._complete = r ? function() {
          try {
            r();
          } catch (a) {
            t.error(a);
          } finally {
            this.unsubscribe();
          }
        } : super._complete;
      }
      unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
          let { closed: n } = this;
          super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
        }
      }
    };
  });
  var ma;
  var va = p(() => {
    "use strict";
    oo();
    ma = _n((e) => function() {
      e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
    });
  });
  var Ie;
  var Sn;
  var Tn = p(() => {
    "use strict";
    Me();
    Ct();
    va();
    io();
    wn();
    Ie = (() => {
      class e extends R {
        constructor() {
          super(), this.closed = false, this.currentObservers = null, this.observers = [], this.isStopped = false, this.hasError = false, this.thrownError = null;
        }
        lift(n) {
          let r = new Sn(this, this);
          return r.operator = n, r;
        }
        _throwIfClosed() {
          if (this.closed) throw new ma();
        }
        next(n) {
          Ke(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.currentObservers || (this.currentObservers = Array.from(this.observers));
              for (let r of this.currentObservers) r.next(n);
            }
          });
        }
        error(n) {
          Ke(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.hasError = this.isStopped = true, this.thrownError = n;
              let { observers: r } = this;
              for (; r.length; ) r.shift().error(n);
            }
          });
        }
        complete() {
          Ke(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.isStopped = true;
              let { observers: n } = this;
              for (; n.length; ) n.shift().complete();
            }
          });
        }
        unsubscribe() {
          this.isStopped = this.closed = true, this.observers = this.currentObservers = null;
        }
        get observed() {
          var n;
          return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
        }
        _trySubscribe(n) {
          return this._throwIfClosed(), super._trySubscribe(n);
        }
        _subscribe(n) {
          return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
        }
        _innerSubscribe(n) {
          let { hasError: r, isStopped: o, observers: i } = this;
          return r || o ? so : (this.currentObservers = null, i.push(n), new G(() => {
            this.currentObservers = null, Et(i, n);
          }));
        }
        _checkFinalizedStatuses(n) {
          let { hasError: r, thrownError: o, isStopped: i } = this;
          r ? n.error(o) : i && n.complete();
        }
        asObservable() {
          let n = new R();
          return n.source = this, n;
        }
      }
      return e.create = (t, n) => new Sn(t, n), e;
    })(), Sn = class extends Ie {
      constructor(t, n) {
        super(), this.destination = t, this.source = n;
      }
      next(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || r === void 0 || r.call(n, t);
      }
      error(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || r === void 0 || r.call(n, t);
      }
      complete() {
        var t, n;
        (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t);
      }
      _subscribe(t) {
        var n, r;
        return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : so;
      }
    };
  });
  var Tt;
  var ya = p(() => {
    "use strict";
    Tn();
    Tt = class extends Ie {
      constructor(t) {
        super(), this._value = t;
      }
      get value() {
        return this.getValue();
      }
      _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value), n;
      }
      getValue() {
        let { hasError: t, thrownError: n, _value: r } = this;
        if (t) throw n;
        return this._throwIfClosed(), r;
      }
      next(t) {
        super.next(this._value = t);
      }
    };
  });
  var yo;
  var _a = p(() => {
    "use strict";
    yo = { now() {
      return (yo.delegate || Date).now();
    }, delegate: void 0 };
  });
  var xt;
  var Ia = p(() => {
    "use strict";
    Tn();
    _a();
    xt = class extends Ie {
      constructor(t = 1 / 0, n = 1 / 0, r = yo) {
        super(), this._bufferSize = t, this._windowTime = n, this._timestampProvider = r, this._buffer = [], this._infiniteTimeWindow = true, this._infiniteTimeWindow = n === 1 / 0, this._bufferSize = Math.max(1, t), this._windowTime = Math.max(1, n);
      }
      next(t) {
        let { isStopped: n, _buffer: r, _infiniteTimeWindow: o, _timestampProvider: i, _windowTime: s } = this;
        n || (r.push(t), !o && r.push(i.now() + s)), this._trimBuffer(), super.next(t);
      }
      _subscribe(t) {
        this._throwIfClosed(), this._trimBuffer();
        let n = this._innerSubscribe(t), { _infiniteTimeWindow: r, _buffer: o } = this, i = o.slice();
        for (let s = 0; s < i.length && !t.closed; s += r ? 1 : 2) t.next(i[s]);
        return this._checkFinalizedStatuses(t), n;
      }
      _trimBuffer() {
        let { _bufferSize: t, _timestampProvider: n, _buffer: r, _infiniteTimeWindow: o } = this, i = (o ? 1 : 2) * t;
        if (t < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o) {
          let s = n.now(), a = 0;
          for (let l = 1; l < r.length && r[l] <= s; l += 2) a = l;
          a && r.splice(0, a + 1);
        }
      }
    };
  });
  var ba;
  var Da = p(() => {
    "use strict";
    Me();
    ba = new R((e) => e.complete());
  });
  function wa(e) {
    return e && C(e.schedule);
  }
  var Ea = p(() => {
    "use strict";
    q();
  });
  function Ca(e) {
    return e[e.length - 1];
  }
  function Ma(e) {
    return wa(Ca(e)) ? e.pop() : void 0;
  }
  function Sa(e, t) {
    return typeof Ca(e) == "number" ? e.pop() : t;
  }
  var Ta = p(() => {
    "use strict";
    Ea();
  });
  function Na(e, t, n, r) {
    function o(i) {
      return i instanceof n ? i : new n(function(s) {
        s(i);
      });
    }
    return new (n || (n = Promise))(function(i, s) {
      function a(u) {
        try {
          c(r.next(u));
        } catch (d) {
          s(d);
        }
      }
      function l(u) {
        try {
          c(r.throw(u));
        } catch (d) {
          s(d);
        }
      }
      function c(u) {
        u.done ? i(u.value) : o(u.value).then(a, l);
      }
      c((r = r.apply(e, t || [])).next());
    });
  }
  function xa(e) {
    var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
    if (n) return n.call(e);
    if (e && typeof e.length == "number") return { next: function() {
      return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
    } };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function Fe(e) {
    return this instanceof Fe ? (this.v = e, this) : new Fe(e);
  }
  function ka(e, t, n) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []), o, i = [];
    return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", s), o[Symbol.asyncIterator] = function() {
      return this;
    }, o;
    function s(f) {
      return function(g) {
        return Promise.resolve(g).then(f, d);
      };
    }
    function a(f, g) {
      r[f] && (o[f] = function(m) {
        return new Promise(function(V, A) {
          i.push([f, m, V, A]) > 1 || l(f, m);
        });
      }, g && (o[f] = g(o[f])));
    }
    function l(f, g) {
      try {
        c(r[f](g));
      } catch (m) {
        h(i[0][3], m);
      }
    }
    function c(f) {
      f.value instanceof Fe ? Promise.resolve(f.value.v).then(u, d) : h(i[0][2], f);
    }
    function u(f) {
      l("next", f);
    }
    function d(f) {
      l("throw", f);
    }
    function h(f, g) {
      f(g), i.shift(), i.length && l(i[0][0], i[0][1]);
    }
  }
  function Aa(e) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator], n;
    return t ? t.call(e) : (e = typeof xa == "function" ? xa(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
      return this;
    }, n);
    function r(i) {
      n[i] = e[i] && function(s) {
        return new Promise(function(a, l) {
          s = e[i](s), o(a, l, s.done, s.value);
        });
      };
    }
    function o(i, s, a, l) {
      Promise.resolve(l).then(function(c) {
        i({ value: c, done: a });
      }, s);
    }
  }
  var _o = p(() => {
    "use strict";
  });
  var xn;
  var Io = p(() => {
    "use strict";
    xn = (e) => e && typeof e.length == "number" && typeof e != "function";
  });
  function Nn(e) {
    return C(e?.then);
  }
  var bo = p(() => {
    "use strict";
    q();
  });
  function kn(e) {
    return C(e[Xe]);
  }
  var Do = p(() => {
    "use strict";
    Cn();
    q();
  });
  function An(e) {
    return Symbol.asyncIterator && C(e?.[Symbol.asyncIterator]);
  }
  var wo = p(() => {
    "use strict";
    q();
  });
  function Rn(e) {
    return new TypeError(`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
  }
  var Eo = p(() => {
    "use strict";
  });
  function zd() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
  }
  var On;
  var Co = p(() => {
    "use strict";
    On = zd();
  });
  function Pn(e) {
    return C(e?.[On]);
  }
  var Mo = p(() => {
    "use strict";
    Co();
    q();
  });
  function Fn(e) {
    return ka(this, arguments, function* () {
      let n = e.getReader();
      try {
        for (; ; ) {
          let { value: r, done: o } = yield Fe(n.read());
          if (o) return yield Fe(void 0);
          yield yield Fe(r);
        }
      } finally {
        n.releaseLock();
      }
    });
  }
  function Ln(e) {
    return C(e?.getReader);
  }
  var Vn = p(() => {
    "use strict";
    _o();
    q();
  });
  function Z(e) {
    if (e instanceof R) return e;
    if (e != null) {
      if (kn(e)) return Wd(e);
      if (xn(e)) return qd(e);
      if (Nn(e)) return Zd(e);
      if (An(e)) return Ra(e);
      if (Pn(e)) return Qd(e);
      if (Ln(e)) return Yd(e);
    }
    throw Rn(e);
  }
  function Wd(e) {
    return new R((t) => {
      let n = e[Xe]();
      if (C(n.subscribe)) return n.subscribe(t);
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function qd(e) {
    return new R((t) => {
      for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
      t.complete();
    });
  }
  function Zd(e) {
    return new R((t) => {
      e.then((n) => {
        t.closed || (t.next(n), t.complete());
      }, (n) => t.error(n)).then(null, Dn);
    });
  }
  function Qd(e) {
    return new R((t) => {
      for (let n of e) if (t.next(n), t.closed) return;
      t.complete();
    });
  }
  function Ra(e) {
    return new R((t) => {
      Kd(e, t).catch((n) => t.error(n));
    });
  }
  function Yd(e) {
    return Ra(Fn(e));
  }
  function Kd(e, t) {
    var n, r, o, i;
    return Na(this, void 0, void 0, function* () {
      try {
        for (n = Aa(e); r = yield n.next(), !r.done; ) {
          let s = r.value;
          if (t.next(s), t.closed) return;
        }
      } catch (s) {
        o = { error: s };
      } finally {
        try {
          r && !r.done && (i = n.return) && (yield i.call(n));
        } finally {
          if (o) throw o.error;
        }
      }
      t.complete();
    });
  }
  var Se = p(() => {
    "use strict";
    _o();
    Io();
    bo();
    Me();
    Do();
    wo();
    Eo();
    Mo();
    Vn();
    q();
    lo();
    Cn();
  });
  function Y(e, t, n, r = 0, o = false) {
    let i = t.schedule(function() {
      n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
    }, r);
    if (e.add(i), !o) return i;
  }
  var Nt = p(() => {
    "use strict";
  });
  function jn(e, t = 0) {
    return ce((n, r) => {
      n.subscribe(ue(r, (o) => Y(r, e, () => r.next(o), t), () => Y(r, e, () => r.complete(), t), (o) => Y(r, e, () => r.error(o), t)));
    });
  }
  var So = p(() => {
    "use strict";
    Nt();
    et();
    St();
  });
  function Hn(e, t = 0) {
    return ce((n, r) => {
      r.add(e.schedule(() => n.subscribe(r), t));
    });
  }
  var To = p(() => {
    "use strict";
    et();
  });
  function Oa(e, t) {
    return Z(e).pipe(Hn(t), jn(t));
  }
  var Pa = p(() => {
    "use strict";
    Se();
    So();
    To();
  });
  function Fa(e, t) {
    return Z(e).pipe(Hn(t), jn(t));
  }
  var La = p(() => {
    "use strict";
    Se();
    So();
    To();
  });
  function Va(e, t) {
    return new R((n) => {
      let r = 0;
      return t.schedule(function() {
        r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
      });
    });
  }
  var ja = p(() => {
    "use strict";
    Me();
  });
  function Ha(e, t) {
    return new R((n) => {
      let r;
      return Y(n, t, () => {
        r = e[On](), Y(n, t, () => {
          let o, i;
          try {
            ({ value: o, done: i } = r.next());
          } catch (s) {
            n.error(s);
            return;
          }
          i ? n.complete() : n.next(o);
        }, 0, true);
      }), () => C(r?.return) && r.return();
    });
  }
  var $a = p(() => {
    "use strict";
    Me();
    Co();
    q();
    Nt();
  });
  function $n(e, t) {
    if (!e) throw new Error("Iterable cannot be null");
    return new R((n) => {
      Y(n, t, () => {
        let r = e[Symbol.asyncIterator]();
        Y(n, t, () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        }, 0, true);
      });
    });
  }
  var xo = p(() => {
    "use strict";
    Me();
    Nt();
  });
  function Ba(e, t) {
    return $n(Fn(e), t);
  }
  var Ua = p(() => {
    "use strict";
    xo();
    Vn();
  });
  function Ga(e, t) {
    if (e != null) {
      if (kn(e)) return Oa(e, t);
      if (xn(e)) return Va(e, t);
      if (Nn(e)) return Fa(e, t);
      if (An(e)) return $n(e, t);
      if (Pn(e)) return Ha(e, t);
      if (Ln(e)) return Ba(e, t);
    }
    throw Rn(e);
  }
  var za = p(() => {
    "use strict";
    Pa();
    La();
    ja();
    $a();
    xo();
    Do();
    bo();
    Io();
    Mo();
    wo();
    Eo();
    Vn();
    Ua();
  });
  function Wa(e, t) {
    return t ? Ga(e, t) : Z(e);
  }
  var qa = p(() => {
    "use strict";
    za();
    Se();
  });
  function kt(e, t) {
    return ce((n, r) => {
      let o = 0;
      n.subscribe(ue(r, (i) => {
        r.next(e.call(t, i, o++));
      }));
    });
  }
  var No = p(() => {
    "use strict";
    et();
    St();
  });
  function Za(e, t, n, r, o, i, s, a) {
    let l = [], c = 0, u = 0, d = false, h = () => {
      d && !l.length && !c && t.complete();
    }, f = (m) => c < r ? g(m) : l.push(m), g = (m) => {
      i && t.next(m), c++;
      let V = false;
      Z(n(m, u++)).subscribe(ue(t, (A) => {
        o?.(A), i ? f(A) : t.next(A);
      }, () => {
        V = true;
      }, void 0, () => {
        if (V) try {
          for (c--; l.length && c < r; ) {
            let A = l.shift();
            s ? Y(t, s, () => g(A)) : g(A);
          }
          h();
        } catch (A) {
          t.error(A);
        }
      }));
    };
    return e.subscribe(ue(t, f, () => {
      d = true, h();
    })), () => {
      a?.();
    };
  }
  var Qa = p(() => {
    "use strict";
    Se();
    Nt();
    St();
  });
  function ko(e, t, n = 1 / 0) {
    return C(t) ? ko((r, o) => kt((i, s) => t(r, i, o, s))(Z(e(r, o))), n) : (typeof t == "number" && (n = t), ce((r, o) => Za(r, o, e, n)));
  }
  var Ya = p(() => {
    "use strict";
    No();
    Se();
    et();
    Qa();
    q();
  });
  function Ka(e = 1 / 0) {
    return ko(Mn, e);
  }
  var Ja = p(() => {
    "use strict";
    Ya();
    mo();
  });
  function Ao(...e) {
    let t = Ma(e), n = Sa(e, 1 / 0), r = e;
    return r.length ? r.length === 1 ? Z(r[0]) : Ka(n)(Wa(r, t)) : ba;
  }
  var Xa = p(() => {
    "use strict";
    Ja();
    Se();
    Da();
    Ta();
    qa();
  });
  var el = p(() => {
    "use strict";
  });
  function Ro(e, t) {
    return ce((n, r) => {
      let o = null, i = 0, s = false, a = () => s && !o && r.complete();
      n.subscribe(ue(r, (l) => {
        o?.unsubscribe();
        let c = 0, u = i++;
        Z(e(l, u)).subscribe(o = ue(r, (d) => r.next(t ? t(l, d, u, c++) : d), () => {
          o = null, a();
        }));
      }, () => {
        s = true, a();
      }));
    });
  }
  var tl = p(() => {
    "use strict";
    Se();
    et();
    St();
  });
  var Oo = p(() => {
    "use strict";
    Me();
    Tn();
    ya();
    Ia();
    Ct();
    Xa();
    el();
  });
  var Po = p(() => {
    "use strict";
    No();
    tl();
  });
  function Xd(e) {
    return `NG0${Math.abs(e)}`;
  }
  function ef(e, t) {
    return `${Xd(e)}${t ? ": " + t : ""}`;
  }
  function $l(e) {
    return { toString: e }.toString();
  }
  function N(e) {
    for (let t in e) if (e[t] === N) return t;
    throw Error("Could not find renamed property on target object.");
  }
  function J(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return `[${e.map(J).join(", ")}]`;
    if (e == null) return "" + e;
    let t = e.overriddenName || e.name;
    if (t) return `${t}`;
    let n = e.toString();
    if (n == null) return "" + n;
    let r = n.indexOf(`
`);
    return r >= 0 ? n.slice(0, r) : n;
  }
  function nl(e, t) {
    return e ? t ? `${e} ${t}` : e : t || "";
  }
  function Fi(e) {
    return e.__forward_ref__ = Fi, e.toString = function() {
      return J(this());
    }, e;
  }
  function ie(e) {
    return nf(e) ? e() : e;
  }
  function nf(e) {
    return typeof e == "function" && e.hasOwnProperty(tf) && e.__forward_ref__ === Fi;
  }
  function O(e) {
    return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
  }
  function dr(e) {
    return { providers: e.providers || [], imports: e.imports || [] };
  }
  function Li(e) {
    return rl(e, Bl) || rl(e, Ul);
  }
  function rl(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null;
  }
  function rf(e) {
    let t = e && (e[Bl] || e[Ul]);
    return t || null;
  }
  function ol(e) {
    return e && (e.hasOwnProperty(il) || e.hasOwnProperty(of)) ? e[il] : null;
  }
  function Gl(e) {
    return e && !!e.\u0275providers;
  }
  function Vi(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e);
  }
  function cf(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : Vi(e);
  }
  function zl(e, t) {
    throw new w(-200, e);
  }
  function ji(e, t) {
    throw new w(-201, false);
  }
  function Wl() {
    return qo;
  }
  function K(e) {
    let t = qo;
    return qo = e, t;
  }
  function ql(e, t, n) {
    let r = Li(e);
    if (r && r.providedIn == "root") return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & _.Optional) return null;
    if (t !== void 0) return t;
    ji(e, "Injector");
  }
  function gf(e, t = _.Default) {
    if (wt() === void 0) throw new w(-203, false);
    if (wt() === null) return ql(e, void 0, t);
    {
      let n = wt(), r;
      return n instanceof Zn ? r = n.injector : r = n, r.get(e, t & _.Optional ? null : void 0, t);
    }
  }
  function T(e, t = _.Default) {
    return (Wl() || gf)(ie(e), t);
  }
  function M(e, t = _.Default) {
    return T(e, fr(t));
  }
  function fr(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
  }
  function Zo(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = ie(e[n]);
      if (Array.isArray(r)) {
        if (r.length === 0) throw new w(900, false);
        let o, i = _.Default;
        for (let s = 0; s < r.length; s++) {
          let a = r[s], l = mf(a);
          typeof l == "number" ? l === -1 ? o = a.token : i |= l : o = a;
        }
        t.push(T(o, i));
      } else t.push(T(r));
    }
    return t;
  }
  function mf(e) {
    return e[df];
  }
  function vf(e, t, n, r) {
    let o = e[Qn];
    throw t[ll] && o.unshift(t[ll]), e.message = yf(`
` + e.message, o, n, r), e[ff] = o, e[Qn] = null, e;
  }
  function yf(e, t, n, r = null) {
    e = e && e.charAt(0) === `
` && e.charAt(1) == pf ? e.slice(2) : e;
    let o = J(t);
    if (Array.isArray(t)) o = t.map(J).join(" -> ");
    else if (typeof t == "object") {
      let i = [];
      for (let s in t) if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : J(a)));
      }
      o = `{${i.join(", ")}}`;
    }
    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(hf, `
  `)}`;
  }
  function Ft(e, t) {
    let n = e.hasOwnProperty(sl);
    return n ? e[sl] : null;
  }
  function Hi(e, t) {
    e.forEach((n) => Array.isArray(n) ? Hi(n, t) : t(n));
  }
  function _f(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n);
  }
  function Zl(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
  }
  function If(e, t, n, r) {
    let o = e.length;
    if (o == t) e.push(n, r);
    else if (o === 1) e.push(r, e[0]), e[0] = n;
    else {
      for (o--, e.push(e[o - 1], e[o]); o > t; ) {
        let i = o - 2;
        e[o] = e[i], o--;
      }
      e[t] = n, e[t + 1] = r;
    }
  }
  function bf(e, t, n) {
    let r = Ut(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r, If(e, r, t, n)), r;
  }
  function Fo(e, t) {
    let n = Ut(e, t);
    if (n >= 0) return e[n | 1];
  }
  function Ut(e, t) {
    return Df(e, t, 1);
  }
  function Df(e, t, n) {
    let r = 0, o = e.length >> n;
    for (; o !== r; ) {
      let i = r + (o - r >> 1), s = e[i << n];
      if (t === s) return i << n;
      s > t ? o = i : r = i + 1;
    }
    return ~(o << n);
  }
  function $i(e) {
    return e[sf] || null;
  }
  function wf(e) {
    return e[af] || null;
  }
  function Ef(e) {
    return e[lf] || null;
  }
  function Cf(e) {
    return { \u0275providers: e };
  }
  function Mf(...e) {
    return { \u0275providers: Kl(true, e), \u0275fromNgModule: true };
  }
  function Kl(e, ...t) {
    let n = [], r = /* @__PURE__ */ new Set(), o, i = (s) => {
      n.push(s);
    };
    return Hi(t, (s) => {
      let a = s;
      Qo(a, i, [], r) && (o ||= [], o.push(a));
    }), o !== void 0 && Jl(o, i), n;
  }
  function Jl(e, t) {
    for (let n = 0; n < e.length; n++) {
      let { ngModule: r, providers: o } = e[n];
      Bi(o, (i) => {
        t(i, r);
      });
    }
  }
  function Qo(e, t, n, r) {
    if (e = ie(e), !e) return false;
    let o = null, i = ol(e), s = !i && $i(e);
    if (!i && !s) {
      let l = e.ngModule;
      if (i = ol(l), i) o = l;
      else return false;
    } else {
      if (s && !s.standalone) return false;
      o = e;
    }
    let a = r.has(o);
    if (s) {
      if (a) return false;
      if (r.add(o), s.dependencies) {
        let l = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
        for (let c of l) Qo(c, t, n, r);
      }
    } else if (i) {
      if (i.imports != null && !a) {
        r.add(o);
        let c;
        Hi(i.imports, (u) => {
          Qo(u, t, n, r) && (c ||= [], c.push(u));
        }), c !== void 0 && Jl(c, t);
      }
      if (!a) {
        let c = Ft(o) || (() => new o());
        t({ provide: o, useFactory: c, deps: se }, o), t({ provide: Yl, useValue: o, multi: true }, o), t({ provide: Yn, useValue: () => T(o), multi: true }, o);
      }
      let l = i.providers;
      if (l != null && !a) {
        let c = e;
        Bi(l, (u) => {
          t(u, c);
        });
      }
    } else return false;
    return o !== e && e.providers !== void 0;
  }
  function Bi(e, t) {
    for (let n of e) Gl(n) && (n = n.\u0275providers), Array.isArray(n) ? Bi(n, t) : t(n);
  }
  function Xl(e) {
    return e !== null && typeof e == "object" && Sf in e;
  }
  function Tf(e) {
    return !!(e && e.useExisting);
  }
  function xf(e) {
    return !!(e && e.useFactory);
  }
  function Yo(e) {
    return typeof e == "function";
  }
  function Ui() {
    return Lo === void 0 && (Lo = new Kn()), Lo;
  }
  function Ko(e) {
    let t = Li(e), n = t !== null ? t.factory : Ft(e);
    if (n !== null) return n;
    if (e instanceof E) throw new w(204, false);
    if (e instanceof Function) return Nf(e);
    throw new w(204, false);
  }
  function Nf(e) {
    if (e.length > 0) throw new w(204, false);
    let n = rf(e);
    return n !== null ? () => n.factory(e) : () => new e();
  }
  function kf(e) {
    if (Xl(e)) return tt(void 0, e.useValue);
    {
      let t = Af(e);
      return tt(t, Un);
    }
  }
  function Af(e, t, n) {
    let r;
    if (Yo(e)) {
      let o = ie(e);
      return Ft(o) || Ko(o);
    } else if (Xl(e)) r = () => ie(e.useValue);
    else if (xf(e)) r = () => e.useFactory(...Zo(e.deps || []));
    else if (Tf(e)) r = (o, i) => T(ie(e.useExisting), i !== void 0 && i & _.Optional ? _.Optional : void 0);
    else {
      let o = ie(e && (e.useClass || e.provide));
      if (Rf(e)) r = () => new o(...Zo(e.deps));
      else return Ft(o) || Ko(o);
    }
    return r;
  }
  function Rt(e) {
    if (e.destroyed) throw new w(205, false);
  }
  function tt(e, t, n = false) {
    return { factory: e, value: t, multi: n ? [] : void 0 };
  }
  function Rf(e) {
    return !!e.deps;
  }
  function Of(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function";
  }
  function Pf(e) {
    return typeof e == "function" || typeof e == "object" && e instanceof E;
  }
  function Jo(e, t) {
    for (let n of e) Array.isArray(n) ? Jo(n, t) : n && Gl(n) ? Jo(n.\u0275providers, t) : t(n);
  }
  function ec(e, t) {
    let n;
    e instanceof Lt ? (Rt(e), n = e) : n = new Zn(e);
    let r, o = _e(n), i = K(void 0);
    try {
      return t();
    } finally {
      _e(o), K(i);
    }
  }
  function Ff() {
    return Wl() !== void 0 || wt() != null;
  }
  function Ve(e) {
    return Array.isArray(e) && typeof e[nc] == "object";
  }
  function ze(e) {
    return Array.isArray(e) && e[nc] === true;
  }
  function rc(e) {
    return (e.flags & 4) !== 0;
  }
  function Gt(e) {
    return e.componentOffset > -1;
  }
  function Gi(e) {
    return (e.flags & 1) === 1;
  }
  function We(e) {
    return !!e.template;
  }
  function tr(e) {
    return (e[v] & 512) !== 0;
  }
  function ht(e) {
    return (e[v] & 256) === 256;
  }
  function oc(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r;
  }
  function Vf(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = Hf), jf;
  }
  function jf() {
    let e = sc(this), t = e?.current;
    if (t) {
      let n = e.previous;
      if (n === it) e.previous = t;
      else for (let r in t) n[r] = t[r];
      e.current = null, this.ngOnChanges(t);
    }
  }
  function Hf(e, t, n, r, o) {
    let i = this.declaredInputs[r], s = sc(e) || $f(e, { previous: it, current: null }), a = s.current || (s.current = {}), l = s.previous, c = l[i];
    a[i] = new Xo(c && c.currentValue, n, l === it), oc(e, t, o, n);
  }
  function sc(e) {
    return e[ic] || null;
  }
  function $f(e, t) {
    return e[ic] = t;
  }
  function De(e) {
    for (; Array.isArray(e); ) e = e[Ee];
    return e;
  }
  function ac(e, t) {
    return De(t[e]);
  }
  function Ce(e, t) {
    return De(t[e.index]);
  }
  function zi(e, t) {
    return e.data[t];
  }
  function Ne(e, t) {
    let n = t[e];
    return Ve(n) ? n : n[Ee];
  }
  function Wi(e) {
    return (e[v] & 128) === 128;
  }
  function ct(e, t) {
    return t == null ? null : e[t];
  }
  function lc(e) {
    e[nt] = 0;
  }
  function qi(e) {
    e[v] & 1024 || (e[v] |= 1024, Wi(e) && gr(e));
  }
  function Gf(e, t) {
    for (; e > 0; ) t = t[ft], e--;
    return t;
  }
  function zt(e) {
    return !!(e[v] & 9216 || e[X]?.dirty);
  }
  function ei(e) {
    e[xe].changeDetectionScheduler?.notify(8), e[v] & 64 && (e[v] |= 1024), zt(e) && gr(e);
  }
  function gr(e) {
    e[xe].changeDetectionScheduler?.notify(0);
    let t = He(e);
    for (; t !== null && !(t[v] & 8192 || (t[v] |= 8192, !Wi(t))); ) t = He(t);
  }
  function cc(e, t) {
    if (ht(e)) throw new w(911, false);
    e[Te] === null && (e[Te] = []), e[Te].push(t);
  }
  function zf(e, t) {
    if (e[Te] === null) return;
    let n = e[Te].indexOf(t);
    n !== -1 && e[Te].splice(n, 1);
  }
  function He(e) {
    let t = e[ee];
    return ze(t) ? t[ee] : t;
  }
  function uc(e) {
    return e[Jn] ??= [];
  }
  function dc(e) {
    return e.cleanup ??= [];
  }
  function Wf() {
    return b.lFrame.elementDepthCount;
  }
  function qf() {
    b.lFrame.elementDepthCount++;
  }
  function Zf() {
    b.lFrame.elementDepthCount--;
  }
  function fc() {
    return b.bindingsEnabled;
  }
  function Qf() {
    return b.skipHydrationRootTNode !== null;
  }
  function Yf(e) {
    return b.skipHydrationRootTNode === e;
  }
  function Kf() {
    b.skipHydrationRootTNode = null;
  }
  function F() {
    return b.lFrame.lView;
  }
  function ge() {
    return b.lFrame.tView;
  }
  function Zi(e) {
    return b.lFrame.contextLView = e, e[H];
  }
  function Qi(e) {
    return b.lFrame.contextLView = null, e;
  }
  function pt() {
    let e = hc();
    for (; e !== null && e.type === 64; ) e = e.parent;
    return e;
  }
  function hc() {
    return b.lFrame.currentTNode;
  }
  function Jf() {
    let e = b.lFrame, t = e.currentTNode;
    return e.isParent ? t : t.parent;
  }
  function Wt(e, t) {
    let n = b.lFrame;
    n.currentTNode = e, n.isParent = t;
  }
  function pc() {
    return b.lFrame.isParent;
  }
  function Xf() {
    b.lFrame.isParent = false;
  }
  function gc() {
    return ti;
  }
  function fl(e) {
    let t = ti;
    return ti = e, t;
  }
  function eh(e) {
    return b.lFrame.bindingIndex = e;
  }
  function qt() {
    return b.lFrame.bindingIndex++;
  }
  function th(e) {
    let t = b.lFrame, n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e, n;
  }
  function nh() {
    return b.lFrame.inI18n;
  }
  function rh(e, t) {
    let n = b.lFrame;
    n.bindingIndex = n.bindingRootIndex = e, ni(t);
  }
  function oh() {
    return b.lFrame.currentDirectiveIndex;
  }
  function ni(e) {
    b.lFrame.currentDirectiveIndex = e;
  }
  function ih(e) {
    let t = b.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t];
  }
  function mc(e) {
    b.lFrame.currentQueryIndex = e;
  }
  function sh(e) {
    let t = e[I];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[pe] : null;
  }
  function vc(e, t, n) {
    if (n & _.SkipSelf) {
      let o = t, i = e;
      for (; o = o.parent, o === null && !(n & _.Host); ) if (o = sh(i), o === null || (i = i[ft], o.type & 10)) break;
      if (o === null) return false;
      t = o, e = i;
    }
    let r = b.lFrame = yc();
    return r.currentTNode = t, r.lView = e, true;
  }
  function Yi(e) {
    let t = yc(), n = e[I];
    b.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = false;
  }
  function yc() {
    let e = b.lFrame, t = e === null ? null : e.child;
    return t === null ? _c(e) : t;
  }
  function _c(e) {
    let t = { currentTNode: null, isParent: true, lView: null, tView: null, selectedIndex: -1, contextLView: null, elementDepthCount: 0, currentNamespace: null, currentDirectiveIndex: -1, bindingRootIndex: -1, bindingIndex: -1, currentQueryIndex: 0, parent: e, child: null, inI18n: false };
    return e !== null && (e.child = t), t;
  }
  function Ic() {
    let e = b.lFrame;
    return b.lFrame = e.parent, e.currentTNode = null, e.lView = null, e;
  }
  function Ki() {
    let e = Ic();
    e.isParent = true, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0;
  }
  function ah(e) {
    return (b.lFrame.contextLView = Gf(e, b.lFrame.contextLView))[H];
  }
  function qe() {
    return b.lFrame.selectedIndex;
  }
  function $e(e) {
    b.lFrame.selectedIndex = e;
  }
  function Dc() {
    let e = b.lFrame;
    return zi(e.tView, e.selectedIndex);
  }
  function lh() {
    return b.lFrame.currentNamespace;
  }
  function Ji() {
    return wc;
  }
  function Xi(e) {
    wc = e;
  }
  function ch(e, t, n) {
    let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
    if (r) {
      let s = Vf(t);
      (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i));
  }
  function Ec(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
      let i = e.data[n].type.prototype, { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: l, ngAfterViewChecked: c, ngOnDestroy: u } = i;
      s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), l && (e.viewHooks ??= []).push(-n, l), c && ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)), u != null && (e.destroyHooks ??= []).push(n, u);
    }
  }
  function Gn(e, t, n) {
    Cc(e, t, 3, n);
  }
  function zn(e, t, n, r) {
    (e[v] & 3) === n && Cc(e, t, n, r);
  }
  function Ho(e, t) {
    let n = e[v];
    (n & 3) === t && (n &= 16383, n += 1, e[v] = n);
  }
  function Cc(e, t, n, r) {
    let o = r !== void 0 ? e[nt] & 65535 : 0, i = r ?? -1, s = t.length - 1, a = 0;
    for (let l = o; l < s; l++) if (typeof t[l + 1] == "number") {
      if (a = t[l], r != null && a >= r) break;
    } else t[l] < 0 && (e[nt] += 65536), (a < i || i == -1) && (uh(e, n, t, l), e[nt] = (e[nt] & 4294901760) + l + 2), l++;
  }
  function hl(e, t) {
    x(4, e, t);
    let n = y(null);
    try {
      t.call(e);
    } finally {
      y(n), x(5, e, t);
    }
  }
  function uh(e, t, n, r) {
    let o = n[r] < 0, i = n[r + 1], s = o ? -n[r] : n[r], a = e[s];
    o ? e[v] >> 14 < e[nt] >> 16 && (e[v] & 3) === t && (e[v] += 16384, hl(a, i)) : hl(a, i);
  }
  function dh(e) {
    return (e.flags & 8) !== 0;
  }
  function fh(e) {
    return (e.flags & 16) !== 0;
  }
  function hh(e, t, n) {
    let r = 0;
    for (; r < n.length; ) {
      let o = n[r];
      if (typeof o == "number") {
        if (o !== 0) break;
        r++;
        let i = n[r++], s = n[r++], a = n[r++];
        e.setAttribute(t, s, a, i);
      } else {
        let i = o, s = n[++r];
        gh(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
      }
    }
    return r;
  }
  function ph(e) {
    return e === 3 || e === 4 || e === 6;
  }
  function gh(e) {
    return e.charCodeAt(0) === 64;
  }
  function es(e, t) {
    if (!(t === null || t.length === 0)) if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? pl(e, n, o, null, t[++r]) : pl(e, n, o, null, null));
      }
    }
    return e;
  }
  function pl(e, t, n, r, o) {
    let i = 0, s = e.length;
    if (t === -1) s = -1;
    else for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
    for (; i < e.length; ) {
      let a = e[i];
      if (typeof a == "number") break;
      if (a === n) {
        o !== null && (e[i + 1] = o);
        return;
      }
      i++, o !== null && i++;
    }
    s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), o !== null && e.splice(i++, 0, o);
  }
  function mh(e) {
    return e !== ot;
  }
  function ri(e) {
    return e & 32767;
  }
  function vh(e) {
    return e >> 16;
  }
  function oi(e, t) {
    let n = vh(e), r = t;
    for (; n > 0; ) r = r[ft], n--;
    return r;
  }
  function gl(e) {
    let t = ii;
    return ii = e, t;
  }
  function Ih(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(Pt) && (r = n[Pt]), r == null && (r = n[Pt] = _h++);
    let o = r & Mc, i = 1 << o;
    t.data[e + (o >> Sc)] |= i;
  }
  function Tc(e, t) {
    let n = xc(e, t);
    if (n !== -1) return n;
    let r = t[I];
    r.firstCreatePass && (e.injectorIndex = t.length, $o(r.data, e), $o(t, null), $o(r.blueprint, null));
    let o = Nc(e, t), i = e.injectorIndex;
    if (mh(o)) {
      let s = ri(o), a = oi(o, t), l = a[I].data;
      for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | l[s + c];
    }
    return t[i + 8] = o, i;
  }
  function $o(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
  }
  function xc(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex;
  }
  function Nc(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
    let n = 0, r = null, o = t;
    for (; o !== null; ) {
      if (r = Pc(o), r === null) return ot;
      if (n++, o = o[ft], r.injectorIndex !== -1) return r.injectorIndex | n << 16;
    }
    return ot;
  }
  function bh(e, t, n) {
    Ih(e, t, n);
  }
  function kc(e, t, n) {
    if (n & _.Optional || e !== void 0) return e;
    ji(t, "NodeInjector");
  }
  function Ac(e, t, n, r) {
    if (n & _.Optional && r === void 0 && (r = null), (n & (_.Self | _.Host)) === 0) {
      let o = e[st], i = K(void 0);
      try {
        return o ? o.get(t, r, n & _.Optional) : ql(t, r, n & _.Optional);
      } finally {
        K(i);
      }
    }
    return kc(r, t, n);
  }
  function Rc(e, t, n, r = _.Default, o) {
    if (e !== null) {
      if (t[v] & 2048 && !(r & _.Self)) {
        let s = Mh(e, t, n, r, de);
        if (s !== de) return s;
      }
      let i = Oc(e, t, n, r, de);
      if (i !== de) return i;
    }
    return Ac(t, n, r, o);
  }
  function Oc(e, t, n, r, o) {
    let i = Eh(n);
    if (typeof i == "function") {
      if (!vc(t, e, r)) return r & _.Host ? kc(o, n, r) : Ac(t, n, r, o);
      try {
        let s;
        if (s = i(r), s == null && !(r & _.Optional)) ji(n);
        else return s;
      } finally {
        bc();
      }
    } else if (typeof i == "number") {
      let s = null, a = xc(e, t), l = ot, c = r & _.Host ? t[fe][pe] : null;
      for ((a === -1 || r & _.SkipSelf) && (l = a === -1 ? Nc(e, t) : t[a + 8], l === ot || !vl(r, false) ? a = -1 : (s = t[I], a = ri(l), t = oi(l, t))); a !== -1; ) {
        let u = t[I];
        if (ml(i, a, u.data)) {
          let d = Dh(a, t, n, s, r, c);
          if (d !== de) return d;
        }
        l = t[a + 8], l !== ot && vl(r, t[I].data[a + 8] === c) && ml(i, a, t) ? (s = u, a = ri(l), t = oi(l, t)) : a = -1;
      }
    }
    return o;
  }
  function Dh(e, t, n, r, o, i) {
    let s = t[I], a = s.data[e + 8], l = r == null ? Gt(a) && ii : r != s && (a.type & 3) !== 0, c = o & _.Host && i === a, u = wh(a, s, n, l, c);
    return u !== null ? si(t, s, u, a, o) : de;
  }
  function wh(e, t, n, r, o) {
    let i = e.providerIndexes, s = t.data, a = i & 1048575, l = e.directiveStart, c = e.directiveEnd, u = i >> 20, d = r ? a : a + u, h = o ? a + u : c;
    for (let f = d; f < h; f++) {
      let g = s[f];
      if (f < l && n === g || f >= l && g.type === n) return f;
    }
    if (o) {
      let f = s[l];
      if (f && We(f) && f.type === n) return l;
    }
    return null;
  }
  function si(e, t, n, r, o) {
    let i = e[n], s = t.data;
    if (i instanceof $t) {
      let a = i;
      a.resolving && zl(cf(s[n]));
      let l = gl(a.canSeeViewProviders);
      a.resolving = true;
      let c, u = a.injectImpl ? K(a.injectImpl) : null, d = vc(e, r, _.Default);
      try {
        i = e[n] = a.factory(void 0, o, s, e, r), t.firstCreatePass && n >= r.directiveStart && ch(n, s[n], t);
      } finally {
        u !== null && K(u), gl(l), a.resolving = false, bc();
      }
    }
    return i;
  }
  function Eh(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(Pt) ? e[Pt] : void 0;
    return typeof t == "number" ? t >= 0 ? t & Mc : Ch : t;
  }
  function ml(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> Sc)] & r);
  }
  function vl(e, t) {
    return !(e & _.Self) && !(e & _.Host && t);
  }
  function Ch() {
    return new nr(pt(), F());
  }
  function Mh(e, t, n, r, o) {
    let i = e, s = t;
    for (; i !== null && s !== null && s[v] & 2048 && !tr(s); ) {
      let a = Oc(i, s, n, r | _.Self, de);
      if (a !== de) return a;
      let l = i.parent;
      if (!l) {
        let c = s[tc];
        if (c) {
          let u = c.get(n, de, r);
          if (u !== de) return u;
        }
        l = Pc(s), s = s[ft];
      }
      i = l;
    }
    return o;
  }
  function Pc(e) {
    let t = e[I], n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[pe] : null;
  }
  function yl(e, t = null, n = null, r) {
    let o = Sh(e, t, n, r);
    return o.resolveInjectorInitializers(), o;
  }
  function Sh(e, t = null, n = null, r, o = /* @__PURE__ */ new Set()) {
    let i = [n || se, Mf(e)];
    return r = r || (typeof e == "object" ? void 0 : J(e)), new Lt(i, t || Ui(), r || null, o);
  }
  function xh() {
    return new ai(F());
  }
  function rr(...e) {
  }
  function Hc(e) {
    let t, n;
    function r() {
      e = rr;
      try {
        n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n), t !== void 0 && clearTimeout(t);
      } catch {
      }
    }
    return t = setTimeout(() => {
      e(), r();
    }), typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => {
      e(), r();
    })), () => r();
  }
  function _l(e) {
    return queueMicrotask(() => e()), () => {
      e = rr;
    };
  }
  function rs(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable) try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if (e._nesting--, !e.hasPendingMicrotasks) try {
        e.runOutsideAngular(() => e.onStable.emit(null));
      } finally {
        e.isStable = true;
      }
    }
  }
  function Ah(e) {
    if (e.isCheckStableRunning || e.callbackScheduled) return;
    e.callbackScheduled = true;
    function t() {
      Hc(() => {
        e.callbackScheduled = false, ci(e), e.isCheckStableRunning = true, rs(e), e.isCheckStableRunning = false;
      });
    }
    e.scheduleInRootZone ? Zone.root.run(() => {
      t();
    }) : e._outer.run(() => {
      t();
    }), ci(e);
  }
  function Rh(e) {
    let t = () => {
      Ah(e);
    }, n = Nh++;
    e._inner = e._inner.fork({ name: "angular", properties: { [ns]: true, [or]: n, [or + n]: true }, onInvokeTask: (r, o, i, s, a, l) => {
      if (Oh(l)) return r.invokeTask(i, s, a, l);
      try {
        return Il(e), r.invokeTask(i, s, a, l);
      } finally {
        (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), bl(e);
      }
    }, onInvoke: (r, o, i, s, a, l, c) => {
      try {
        return Il(e), r.invoke(i, s, a, l, c);
      } finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !Ph(l) && t(), bl(e);
      }
    }, onHasTask: (r, o, i, s) => {
      r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, ci(e), rs(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask));
    }, onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), false) });
  }
  function ci(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === true ? e.hasPendingMicrotasks = true : e.hasPendingMicrotasks = false;
  }
  function Il(e) {
    e._nesting++, e.isStable && (e.isStable = false, e.onUnstable.emit(null));
  }
  function bl(e) {
    e._nesting--, rs(e);
  }
  function Oh(e) {
    return $c(e, "__ignore_ng_zone__");
  }
  function Ph(e) {
    return $c(e, "__scheduler_tick__");
  }
  function $c(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? false : e[0]?.data?.[t] === true;
  }
  function Lh() {
    return Bc(pt(), F());
  }
  function Bc(e, t) {
    return new vr(Ce(e, t));
  }
  function me(e, t) {
    let n = Jr(e, t?.equal), r = n[le];
    return n.set = (o) => vn(r, o), n.update = (o) => Xr(r, o), n.asReadonly = Vh.bind(n), n;
  }
  function Vh() {
    let e = this[le];
    if (e.readonlyFn === void 0) {
      let t = () => this();
      t[le] = e, e.readonlyFn = t;
    }
    return e.readonlyFn;
  }
  function Uc(e) {
    return (e.flags & 128) === 128;
  }
  function Hh() {
    return jh++;
  }
  function $h(e) {
    zc.set(e[pr], e);
  }
  function di(e) {
    zc.delete(e[pr]);
  }
  function Zt(e, t) {
    Ve(t) ? (e[Dl] = t[pr], $h(t)) : e[Dl] = t;
  }
  function Wc(e) {
    return Zc(e[jt]);
  }
  function qc(e) {
    return Zc(e[ae]);
  }
  function Zc(e) {
    for (; e !== null && !ze(e); ) e = e[ae];
    return e;
  }
  function Qc(e) {
    fi = e;
  }
  function Bh() {
    if (fi !== void 0) return fi;
    if (typeof document < "u") return document;
    throw new w(210, false);
  }
  function _r(e) {
    wl.has(e) || (wl.add(e), performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
  }
  function Qh(e, t, n, r) {
    Zh(e, t, n, r);
  }
  function Jc(e, t, n = false) {
    return Yh(e, t, n);
  }
  function Xc(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
      let r = y(null);
      try {
        for (let o = 0; o < n.length; o += 2) {
          let i = n[o], s = n[o + 1];
          if (s !== -1) {
            let a = e.data[s];
            mc(i), a.contentQueries(2, t[s], s);
          }
        }
      } finally {
        y(r);
      }
    }
  }
  function hi(e, t, n) {
    mc(0);
    let r = y(null);
    try {
      t(e, n);
    } finally {
      y(r);
    }
  }
  function eu(e, t, n) {
    if (rc(t)) {
      let r = y(null);
      try {
        let o = t.directiveStart, i = t.directiveEnd;
        for (let s = o; s < i; s++) {
          let a = e.data[s];
          if (a.contentQueries) {
            let l = n[s];
            a.contentQueries(1, l, s);
          }
        }
      } finally {
        y(r);
      }
    }
  }
  function Kh(e) {
    return e instanceof pi ? e.changingThisBreaksApplicationSecurity : e;
  }
  function Jh(e, t) {
    return e.createText(t);
  }
  function Xh(e, t, n) {
    e.setValue(t, n);
  }
  function tu(e, t, n) {
    return e.createElement(t, n);
  }
  function gi(e, t, n, r, o) {
    e.insertBefore(t, n, r, o);
  }
  function nu(e, t, n) {
    e.appendChild(t, n);
  }
  function El(e, t, n, r, o) {
    r !== null ? gi(e, t, n, r, o) : nu(e, t, n);
  }
  function ep(e, t, n) {
    e.removeChild(null, t, n);
  }
  function tp(e, t, n) {
    e.setAttribute(t, "style", n);
  }
  function np(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
  }
  function ru(e, t, n) {
    let { mergedAttrs: r, classes: o, styles: i } = n;
    r !== null && hh(e, t, r), o !== null && np(e, t, o), i !== null && tp(e, t, i);
  }
  function rp(e) {
    if (e.toLowerCase().startsWith("on")) throw new w(306, false);
  }
  function op(e, t, n) {
    let r = e.length;
    for (; ; ) {
      let o = e.indexOf(t, n);
      if (o === -1) return o;
      if (o === 0 || e.charCodeAt(o - 1) <= 32) {
        let i = t.length;
        if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
      }
      n = o + 1;
    }
  }
  function ip(e, t, n, r) {
    let o = 0;
    if (r) {
      for (; o < t.length && typeof t[o] == "string"; o += 2) if (t[o] === "class" && op(t[o + 1].toLowerCase(), n, 0) !== -1) return true;
    } else if (as(e)) return false;
    if (o = t.indexOf(1, o), o > -1) {
      let i;
      for (; ++o < t.length && typeof (i = t[o]) == "string"; ) if (i.toLowerCase() === n) return true;
    }
    return false;
  }
  function as(e) {
    return e.type === 4 && e.value !== ou;
  }
  function sp(e, t, n) {
    let r = e.type === 4 && !n ? ou : e.value;
    return t === r;
  }
  function ap(e, t, n) {
    let r = 4, o = e.attrs, i = o !== null ? up(o) : 0, s = false;
    for (let a = 0; a < t.length; a++) {
      let l = t[a];
      if (typeof l == "number") {
        if (!s && !oe(r) && !oe(l)) return false;
        if (s && oe(l)) continue;
        s = false, r = l | r & 1;
        continue;
      }
      if (!s) if (r & 4) {
        if (r = 2 | r & 1, l !== "" && !sp(e, l, n) || l === "" && t.length === 1) {
          if (oe(r)) return false;
          s = true;
        }
      } else if (r & 8) {
        if (o === null || !ip(e, o, l, n)) {
          if (oe(r)) return false;
          s = true;
        }
      } else {
        let c = t[++a], u = lp(l, o, as(e), n);
        if (u === -1) {
          if (oe(r)) return false;
          s = true;
          continue;
        }
        if (c !== "") {
          let d;
          if (u > i ? d = "" : d = o[u + 1].toLowerCase(), r & 2 && c !== d) {
            if (oe(r)) return false;
            s = true;
          }
        }
      }
    }
    return oe(r) || s;
  }
  function oe(e) {
    return (e & 1) === 0;
  }
  function lp(e, t, n, r) {
    if (t === null) return -1;
    let o = 0;
    if (r || !n) {
      let i = false;
      for (; o < t.length; ) {
        let s = t[o];
        if (s === e) return o;
        if (s === 3 || s === 6) i = true;
        else if (s === 1 || s === 2) {
          let a = t[++o];
          for (; typeof a == "string"; ) a = t[++o];
          continue;
        } else {
          if (s === 4) break;
          if (s === 0) {
            o += 4;
            continue;
          }
        }
        o += i ? 1 : 2;
      }
      return -1;
    } else return dp(t, e);
  }
  function cp(e, t, n = false) {
    for (let r = 0; r < t.length; r++) if (ap(e, t[r], n)) return true;
    return false;
  }
  function up(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t];
      if (ph(n)) return t;
    }
    return e.length;
  }
  function dp(e, t) {
    let n = e.indexOf(4);
    if (n > -1) for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
    return -1;
  }
  function Cl(e, t) {
    return e ? ":not(" + t.trim() + ")" : t;
  }
  function fp(e) {
    let t = e[0], n = 1, r = 2, o = "", i = false;
    for (; n < e.length; ) {
      let s = e[n];
      if (typeof s == "string") if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? o += "." + s : r & 4 && (o += " " + s);
      else o !== "" && !oe(s) && (t += Cl(i, o), o = ""), r = s, i = i || !oe(r);
      n++;
    }
    return o !== "" && (t += Cl(i, o)), t;
  }
  function hp(e) {
    return e.map(fp).join(",");
  }
  function pp(e) {
    let t = [], n = [], r = 1, o = 2;
    for (; r < e.length; ) {
      let i = e[r];
      if (typeof i == "string") o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
      else {
        if (!oe(o)) break;
        o = i;
      }
      r++;
    }
    return n.length && t.push(1, ...n), t;
  }
  function ls(e, t, n, r, o, i, s, a, l, c, u) {
    let d = te + r, h = d + o, f = gp(d, h), g = typeof c == "function" ? c() : c;
    return f[I] = { type: e, blueprint: f, template: n, queries: null, viewQuery: a, declTNode: t, data: f.slice().fill(null, d), bindingStartIndex: d, expandoStartIndex: h, hostBindingOpCodes: null, firstCreatePass: true, firstUpdatePass: true, staticViewQueries: false, staticContentQueries: false, preOrderHooks: null, preOrderCheckHooks: null, contentHooks: null, contentCheckHooks: null, viewHooks: null, viewCheckHooks: null, destroyHooks: null, cleanup: null, contentQueries: null, components: null, directiveRegistry: typeof i == "function" ? i() : i, pipeRegistry: typeof s == "function" ? s() : s, firstChild: null, schemas: l, consts: g, incompleteFirstPass: false, ssrId: u };
  }
  function gp(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : Ze);
    return n;
  }
  function mp(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = ls(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t;
  }
  function cs(e, t, n, r, o, i, s, a, l, c, u) {
    let d = t.blueprint.slice();
    return d[Ee] = o, d[v] = r | 4 | 128 | 8 | 64 | 1024, (c !== null || e && e[v] & 2048) && (d[v] |= 2048), lc(d), d[ee] = d[ft] = e, d[H] = n, d[xe] = s || e && e[xe], d[z] = a || e && e[z], d[st] = l || e && e[st] || null, d[pe] = i, d[pr] = Hh(), d[Vt] = u, d[tc] = c, d[fe] = t.type == 2 ? e[fe] : d, d;
  }
  function vp(e, t, n) {
    let r = Ce(t, e), o = mp(n), i = e[xe].rendererFactory, s = au(e, cs(e, o, null, iu(n), r, t, null, i.createRenderer(r, n), null, null, null));
    return e[t.index] = s;
  }
  function iu(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64), t;
  }
  function su(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
    return o;
  }
  function au(e, t) {
    return e[jt] ? e[ul][ae] = t : e[jt] = t, e[ul] = t, t;
  }
  function W(e = 1) {
    lu(ge(), F(), qe() + e, false);
  }
  function lu(e, t, n, r) {
    if (!r) if ((t[v] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Gn(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && zn(t, i, 0, n);
    }
    $e(n);
  }
  function mi(e, t, n, r) {
    let o = y(null);
    try {
      let [i, s, a] = e.inputs[n], l = null;
      (s & Ir.SignalBased) !== 0 && (l = t[i][le]), l !== null && l.transformFn !== void 0 ? r = l.transformFn(r) : a !== null && (r = a.call(t, r)), e.setInput !== null ? e.setInput(t, l, r, n, i) : oc(t, l, i, r);
    } finally {
      y(o);
    }
  }
  function cu(e, t, n, r, o) {
    let i = qe(), s = r & 2;
    try {
      $e(-1), s && t.length > te && lu(e, t, te, false), x(s ? 2 : 0, o), n(r, o);
    } finally {
      $e(i), x(s ? 3 : 1, o);
    }
  }
  function us(e, t, n) {
    Ep(e, t, n), (n.flags & 64) === 64 && Cp(e, t, n);
  }
  function uu(e, t, n = Ce) {
    let r = t.localNames;
    if (r !== null) {
      let o = t.index + 1;
      for (let i = 0; i < r.length; i += 2) {
        let s = r[i + 1], a = s === -1 ? n(t, e) : e[s];
        e[o++] = a;
      }
    }
  }
  function yp(e, t, n, r) {
    let i = r.get(Wh, Yc) || n === he.ShadowDom, s = e.selectRootElement(t, i);
    return _p(s), s;
  }
  function _p(e) {
    Ip(e);
  }
  function bp(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e;
  }
  function Dp(e, t, n, r, o, i, s, a) {
    if (!a && ds(t, e, n, r, o)) {
      Gt(t) && wp(n, t.index);
      return;
    }
    if (t.type & 3) {
      let l = Ce(t, n);
      r = bp(r), o = s != null ? s(o, t.value || "", r) : o, i.setProperty(l, r, o);
    } else t.type & 12;
  }
  function wp(e, t) {
    let n = Ne(t, e);
    n[v] & 16 || (n[v] |= 64);
  }
  function Ep(e, t, n) {
    let r = n.directiveStart, o = n.directiveEnd;
    Gt(n) && vp(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Tc(n, t);
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
      let a = e.data[s], l = si(t, e, s, n);
      if (Zt(l, t), i !== null && xp(t, s - r, l, a, n, i), We(a)) {
        let c = Ne(n.index, t);
        c[H] = si(t, e, s, n);
      }
    }
  }
  function Cp(e, t, n) {
    let r = n.directiveStart, o = n.directiveEnd, i = n.index, s = oh();
    try {
      $e(i);
      for (let a = r; a < o; a++) {
        let l = e.data[a], c = t[a];
        ni(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && Mp(l, c);
      }
    } finally {
      $e(-1), ni(s);
    }
  }
  function Mp(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t);
  }
  function du(e, t) {
    let n = e.directiveRegistry, r = null;
    if (n) for (let o = 0; o < n.length; o++) {
      let i = n[o];
      cp(t, i.selectors, false) && (r ??= [], We(i) ? r.unshift(i) : r.push(i));
    }
    return r;
  }
  function Sp(e, t, n, r, o, i) {
    t[I].firstUpdatePass && rp(n);
    let s = Ce(e, t);
    Tp(t[z], s, i, e.value, n, r, o);
  }
  function Tp(e, t, n, r, o, i, s) {
    if (i == null) e.removeAttribute(t, o, n);
    else {
      let a = s == null ? Vi(i) : s(i, r || "", o);
      e.setAttribute(t, o, a, n);
    }
  }
  function xp(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null) for (let a = 0; a < s.length; a += 2) {
      let l = s[a], c = s[a + 1];
      mi(r, n, l, c);
    }
  }
  function Np(e, t) {
    let n = e[st], r = n ? n.get(we, null) : null;
    r && r.handleError(t);
  }
  function ds(e, t, n, r, o) {
    let i = e.inputs?.[r], s = e.hostDirectiveInputs?.[r], a = false;
    if (s) for (let l = 0; l < s.length; l += 2) {
      let c = s[l], u = s[l + 1], d = t.data[c];
      mi(d, n[c], u, o), a = true;
    }
    if (i) for (let l of i) {
      let c = n[l], u = t.data[l];
      mi(u, c, r, o), a = true;
    }
    return a;
  }
  function kp(e, t) {
    let n = Ne(t, e), r = n[I];
    Ap(r, n);
    let o = n[Ee];
    o !== null && n[Vt] === null && (n[Vt] = Jc(o, n[st])), x(18), fs(r, n, n[H]), x(19, n[H]);
  }
  function Ap(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
  }
  function fs(e, t, n) {
    Yi(t);
    try {
      let r = e.viewQuery;
      r !== null && hi(1, r, n);
      let o = e.template;
      o !== null && cu(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = false), t[lt]?.finishViewCreation(e), e.staticContentQueries && Xc(e, t), e.staticViewQueries && hi(2, e.viewQuery, n);
      let i = e.components;
      i !== null && Rp(t, i);
    } catch (r) {
      throw e.firstCreatePass && (e.incompleteFirstPass = true, e.firstCreatePass = false), r;
    } finally {
      t[v] &= -5, Ki();
    }
  }
  function Rp(e, t) {
    for (let n = 0; n < t.length; n++) kp(e, t[n]);
  }
  function hs(e, t, n, r) {
    let o = y(null);
    try {
      let i = t.tView, a = e[v] & 4096 ? 4096 : 16, l = cs(e, i, n, a, null, t, null, null, r?.injector ?? null, r?.embeddedViewInjector ?? null, r?.dehydratedView ?? null), c = e[t.index];
      l[at] = c;
      let u = e[lt];
      return u !== null && (l[lt] = u.createEmbeddedView(i)), fs(i, l, n), l;
    } finally {
      y(o);
    }
  }
  function ps(e, t) {
    return !t || t.firstChild === null || Uc(e);
  }
  function gs(e, t) {
    return Op(e, t);
  }
  function fu(e) {
    return (e.flags & 32) === 32;
  }
  function rt(e, t, n, r, o) {
    if (r != null) {
      let i, s = false;
      ze(r) ? i = r : Ve(r) && (s = true, r = r[Ee]);
      let a = De(r);
      e === 0 && n !== null ? o == null ? nu(t, n, a) : gi(t, n, a, o || null, true) : e === 1 && n !== null ? gi(t, n, a, o || null, true) : e === 2 ? ep(t, a, s) : e === 3 && t.destroyNode(a), i != null && Wp(t, e, i, n, o);
    }
  }
  function Pp(e, t) {
    hu(e, t), t[Ee] = null, t[pe] = null;
  }
  function Fp(e, t, n, r, o, i) {
    r[Ee] = o, r[pe] = t, br(e, r, n, 1, o, i);
  }
  function hu(e, t) {
    t[xe].changeDetectionScheduler?.notify(9), br(e, t, t[z], 2, null, null);
  }
  function Lp(e) {
    let t = e[jt];
    if (!t) return Bo(e[I], e);
    for (; t; ) {
      let n = null;
      if (Ve(t)) n = t[jt];
      else {
        let r = t[Q];
        r && (n = r);
      }
      if (!n) {
        for (; t && !t[ae] && t !== e; ) Ve(t) && Bo(t[I], t), t = t[ee];
        t === null && (t = e), Ve(t) && Bo(t[I], t), n = t && t[ae];
      }
      t = n;
    }
  }
  function ms(e, t) {
    let n = e[er], r = n.indexOf(t);
    n.splice(r, 1);
  }
  function vs(e, t) {
    if (ht(t)) return;
    let n = t[z];
    n.destroyNode && br(e, t, n, 3, null, null), Lp(t);
  }
  function Bo(e, t) {
    if (ht(t)) return;
    let n = y(null);
    try {
      t[v] &= -129, t[v] |= 256, t[X] && Qr(t[X]), jp(e, t), Vp(e, t), t[I].type === 1 && t[z].destroy();
      let r = t[at];
      if (r !== null && ze(t[ee])) {
        r !== t[ee] && ms(r, t);
        let o = t[lt];
        o !== null && o.detachView(e);
      }
      di(t);
    } finally {
      y(n);
    }
  }
  function Vp(e, t) {
    let n = e.cleanup, r = t[Jn];
    if (n !== null) for (let s = 0; s < n.length - 1; s += 2) if (typeof n[s] == "string") {
      let a = n[s + 3];
      a >= 0 ? r[a]() : r[-a].unsubscribe(), s += 2;
    } else {
      let a = r[n[s + 1]];
      n[s].call(a);
    }
    r !== null && (t[Jn] = null);
    let o = t[Te];
    if (o !== null) {
      t[Te] = null;
      for (let s = 0; s < o.length; s++) {
        let a = o[s];
        a();
      }
    }
    let i = t[Xn];
    if (i !== null) {
      t[Xn] = null;
      for (let s of i) s.destroy();
    }
  }
  function jp(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null) for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof $t)) {
        let i = n[r + 1];
        if (Array.isArray(i)) for (let s = 0; s < i.length; s += 2) {
          let a = o[i[s]], l = i[s + 1];
          x(4, a, l);
          try {
            l.call(a);
          } finally {
            x(5, a, l);
          }
        }
        else {
          x(4, o, i);
          try {
            i.call(o);
          } finally {
            x(5, o, i);
          }
        }
      }
    }
  }
  function Hp(e, t, n) {
    return $p(e, t.parent, n);
  }
  function $p(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168; ) t = r, r = t.parent;
    if (r === null) return n[Ee];
    if (Gt(r)) {
      let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
      if (o === he.None || o === he.Emulated) return null;
    }
    return Ce(r, n);
  }
  function Bp(e, t, n) {
    return Gp(e, t, n);
  }
  function Up(e, t, n) {
    return e.type & 40 ? Ce(e, n) : null;
  }
  function ys(e, t, n, r) {
    let o = Hp(e, r, t), i = t[z], s = r.parent || t[pe], a = Bp(s, r, t);
    if (o != null) if (Array.isArray(n)) for (let l = 0; l < n.length; l++) El(i, o, n[l], a, false);
    else El(i, o, n, a, false);
    Ml !== void 0 && Ml(i, r, t, n, o);
  }
  function Ot(e, t) {
    if (t !== null) {
      let n = t.type;
      if (n & 3) return Ce(t, e);
      if (n & 4) return vi(-1, e[t.index]);
      if (n & 8) {
        let r = t.child;
        if (r !== null) return Ot(e, r);
        {
          let o = e[t.index];
          return ze(o) ? vi(-1, o) : De(o);
        }
      } else {
        if (n & 128) return Ot(e, t.next);
        if (n & 32) return gs(t, e)() || De(e[t.index]);
        {
          let r = pu(e, t);
          if (r !== null) {
            if (Array.isArray(r)) return r[0];
            let o = He(e[fe]);
            return Ot(o, r);
          } else return Ot(e, t.next);
        }
      }
    }
    return null;
  }
  function pu(e, t) {
    if (t !== null) {
      let r = e[fe][pe], o = t.projection;
      return r.projection[o];
    }
    return null;
  }
  function vi(e, t) {
    let n = Q + e + 1;
    if (n < t.length) {
      let r = t[n], o = r[I].firstChild;
      if (o !== null) return Ot(r, o);
    }
    return t[Ht];
  }
  function _s(e, t, n, r, o, i, s) {
    for (; n != null; ) {
      if (n.type === 128) {
        n = n.next;
        continue;
      }
      let a = r[n.index], l = n.type;
      if (s && t === 0 && (a && Zt(De(a), r), n.flags |= 2), !fu(n)) if (l & 8) _s(e, t, n.child, r, o, i, false), rt(t, e, o, a, i);
      else if (l & 32) {
        let c = gs(n, r), u;
        for (; u = c(); ) rt(t, e, o, u, i);
        rt(t, e, o, a, i);
      } else l & 16 ? zp(e, t, r, n, o, i) : rt(t, e, o, a, i);
      n = s ? n.projectionNext : n.next;
    }
  }
  function br(e, t, n, r, o, i) {
    _s(n, r, e.firstChild, t, o, i, false);
  }
  function zp(e, t, n, r, o, i) {
    let s = n[fe], l = s[pe].projection[r.projection];
    if (Array.isArray(l)) for (let c = 0; c < l.length; c++) {
      let u = l[c];
      rt(t, e, o, u, i);
    }
    else {
      let c = l, u = s[ee];
      Uc(r) && (c.flags |= 128), _s(e, t, c, u, o, i, true);
    }
  }
  function Wp(e, t, n, r, o) {
    let i = n[Ht], s = De(n);
    i !== s && rt(t, e, r, i, o);
    for (let a = Q; a < n.length; a++) {
      let l = n[a];
      br(l[I], l, e, t, r, i);
    }
  }
  function qp(e, t, n, r, o) {
    if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
      let i = r.indexOf("-") === -1 ? void 0 : Ae.DashCase;
      o == null ? e.removeStyle(n, r, i) : (typeof o == "string" && o.endsWith("!important") && (o = o.slice(0, -10), i |= Ae.Important), e.setStyle(n, r, o, i));
    }
  }
  function ir(e, t, n, r, o = false) {
    for (; n !== null; ) {
      if (n.type === 128) {
        n = o ? n.projectionNext : n.next;
        continue;
      }
      let i = t[n.index];
      i !== null && r.push(De(i)), ze(i) && Zp(i, r);
      let s = n.type;
      if (s & 8) ir(e, t, n.child, r);
      else if (s & 32) {
        let a = gs(n, t), l;
        for (; l = a(); ) r.push(l);
      } else if (s & 16) {
        let a = pu(t, n);
        if (Array.isArray(a)) r.push(...a);
        else {
          let l = He(t[fe]);
          ir(l[I], l, a, r, true);
        }
      }
      n = o ? n.projectionNext : n.next;
    }
    return r;
  }
  function Zp(e, t) {
    for (let n = Q; n < e.length; n++) {
      let r = e[n], o = r[I].firstChild;
      o !== null && ir(r[I], r, o, t);
    }
    e[Ht] !== e[Ee] && t.push(e[Ht]);
  }
  function gu(e) {
    if (e[jo] !== null) {
      for (let t of e[jo]) t.impl.addSequence(t);
      e[jo].length = 0;
    }
  }
  function Qp(e) {
    return e[X] ?? Yp(e);
  }
  function Yp(e) {
    let t = mu.pop() ?? Object.create(Jp);
    return t.lView = e, t;
  }
  function Kp(e) {
    e.lView[X] !== e && (e.lView = null, mu.push(e));
  }
  function Xp(e) {
    let t = e[X] ?? Object.create(eg);
    return t.lView = e, t;
  }
  function vu(e) {
    return e.type !== 2;
  }
  function yu(e) {
    if (e[Xn] === null) return;
    let t = true;
    for (; t; ) {
      let n = false;
      for (let r of e[Xn]) r.dirty && (n = true, r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
      t = n && !!(e[v] & 8192);
    }
  }
  function _u(e, t = true, n = 0) {
    let o = e[xe].rendererFactory, i = false;
    i || o.begin?.();
    try {
      ng(e, n);
    } catch (s) {
      throw t && Np(e, s), s;
    } finally {
      i || o.end?.();
    }
  }
  function ng(e, t) {
    let n = gc();
    try {
      fl(true), yi(e, t);
      let r = 0;
      for (; zt(e); ) {
        if (r === tg) throw new w(103, false);
        r++, yi(e, 1);
      }
    } finally {
      fl(n);
    }
  }
  function rg(e, t, n, r) {
    if (ht(t)) return;
    let o = t[v], i = false, s = false;
    Yi(t);
    let a = true, l = null, c = null;
    i || (vu(e) ? (c = Qp(t), l = pn(c)) : Ur() === null ? (a = false, c = Xp(t), l = pn(c)) : t[X] && (Qr(t[X]), t[X] = null));
    try {
      lc(t), eh(e.bindingStartIndex), n !== null && cu(e, t, n, 2, r);
      let u = (o & 3) === 3;
      if (!i) if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && Gn(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && zn(t, f, 0, null), Ho(t, 0);
      }
      if (s || og(t), yu(t), Iu(t, 0), e.contentQueries !== null && Xc(e, t), !i) if (u) {
        let f = e.contentCheckHooks;
        f !== null && Gn(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && zn(t, f, 1), Ho(t, 1);
      }
      sg(e, t);
      let d = e.components;
      d !== null && Du(t, d, 0);
      let h = e.viewQuery;
      if (h !== null && hi(2, h, r), !i) if (u) {
        let f = e.viewCheckHooks;
        f !== null && Gn(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && zn(t, f, 2), Ho(t, 2);
      }
      if (e.firstUpdatePass === true && (e.firstUpdatePass = false), t[Vo]) {
        for (let f of t[Vo]) f();
        t[Vo] = null;
      }
      i || (gu(t), t[v] &= -73);
    } catch (u) {
      throw i || gr(t), u;
    } finally {
      c !== null && (qr(c, l), a && Kp(c)), Ki();
    }
  }
  function Iu(e, t) {
    for (let n = Wc(e); n !== null; n = qc(n)) for (let r = Q; r < n.length; r++) {
      let o = n[r];
      bu(o, t);
    }
  }
  function og(e) {
    for (let t = Wc(e); t !== null; t = qc(t)) {
      if (!(t[v] & 2)) continue;
      let n = t[er];
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        qi(o);
      }
    }
  }
  function ig(e, t, n) {
    x(18);
    let r = Ne(t, e);
    bu(r, n), x(19, r[H]);
  }
  function bu(e, t) {
    Wi(e) && yi(e, t);
  }
  function yi(e, t) {
    let r = e[I], o = e[v], i = e[X], s = !!(t === 0 && o & 16);
    if (s ||= !!(o & 64 && t === 0), s ||= !!(o & 1024), s ||= !!(i?.dirty && Zr(i)), s ||= false, i && (i.dirty = false), e[v] &= -9217, s) rg(r, e, r.template, e[H]);
    else if (o & 8192) {
      yu(e), Iu(e, 1);
      let a = r.components;
      a !== null && Du(e, a, 1), gu(e);
    }
  }
  function Du(e, t, n) {
    for (let r = 0; r < t.length; r++) ig(e, t[r], n);
  }
  function sg(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null) try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) $e(~o);
        else {
          let i = o, s = n[++r], a = n[++r];
          rh(s, i);
          let l = t[i];
          x(24, l), a(2, l), x(25, l);
        }
      }
    } finally {
      $e(-1);
    }
  }
  function Is(e, t) {
    let n = gc() ? 64 : 1088;
    for (e[xe].changeDetectionScheduler?.notify(t); e; ) {
      e[v] |= n;
      let r = He(e);
      if (tr(e) && !r) return e;
      e = r;
    }
    return null;
  }
  function ag(e, t, n, r) {
    return [e, true, 0, t, null, r, null, n, null, null];
  }
  function wu(e, t) {
    let n = Q + t;
    if (n < e.length) return e[n];
  }
  function bs(e, t, n, r = true) {
    let o = t[I];
    if (lg(o, t, e, n), r) {
      let s = vi(n, e), a = t[z], l = a.parentNode(e[Ht]);
      l !== null && Fp(o, e[pe], a, t, l, s);
    }
    let i = t[Vt];
    i !== null && i.firstChild !== null && (i.firstChild = null);
  }
  function Eu(e, t) {
    let n = Ds(e, t);
    return n !== void 0 && vs(n[I], n), n;
  }
  function Ds(e, t) {
    if (e.length <= Q) return;
    let n = Q + t, r = e[n];
    if (r) {
      let o = r[at];
      o !== null && o !== e && ms(o, r), t > 0 && (e[n - 1][ae] = r[ae]);
      let i = Zl(e, Q + t);
      Pp(r[I], r);
      let s = i[lt];
      s !== null && s.detachView(i[I]), r[ee] = null, r[ae] = null, r[v] &= -129;
    }
    return r;
  }
  function lg(e, t, n, r) {
    let o = Q + r, i = n.length;
    r > 0 && (n[o - 1][ae] = t), r < i - Q ? (t[ae] = n[o], _f(n, Q + r, t)) : (n.push(t), t[ae] = null), t[ee] = n;
    let s = t[at];
    s !== null && n !== s && Cu(s, t);
    let a = t[lt];
    a !== null && a.insertView(e), ei(t), t[v] |= 128;
  }
  function Cu(e, t) {
    let n = e[er], r = t[ee];
    if (Ve(r)) e[v] |= 2;
    else {
      let o = r[ee][fe];
      t[fe] !== o && (e[v] |= 2);
    }
    n === null ? e[er] = [t] : n.push(t);
  }
  function Mu(e) {
    return zt(e._lView) || !!(e._lView[v] & 64);
  }
  function Su(e) {
    qi(e._cdRefInjectingView || e._lView);
  }
  function ws(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) i = ug(e, t, n, r, o), nh() && (i.flags |= 32);
    else if (i.type & 64) {
      i.type = n, i.value = r, i.attrs = o;
      let s = Jf();
      i.injectorIndex = s === null ? -1 : s.injectorIndex;
    }
    return Wt(i, true), i;
  }
  function ug(e, t, n, r, o) {
    let i = hc(), s = pc(), a = s ? i : i && i.parent, l = e.data[t] = fg(e, a, n, t, r, o);
    return dg(e, l, i, s), l;
  }
  function dg(e, t, n, r) {
    e.firstChild === null && (e.firstChild = t), n !== null && (r ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n));
  }
  function fg(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1, a = 0;
    return Qf() && (a |= 128), { type: n, index: r, insertBeforeIndex: null, injectorIndex: s, directiveStart: -1, directiveEnd: -1, directiveStylingLast: -1, componentOffset: -1, propertyBindings: null, flags: a, providerIndexes: 0, value: o, attrs: i, mergedAttrs: null, localNames: null, initialInputs: null, inputs: null, hostDirectiveInputs: null, outputs: null, hostDirectiveOutputs: null, directiveToIndex: null, tView: null, next: null, prev: null, projectionNext: null, child: null, parent: t, projection: null, styles: null, stylesWithoutHost: null, residualStyles: void 0, classes: null, classesWithoutHost: null, residualClasses: void 0, classBindings: 0, styleBindings: 0 };
  }
  function Es(e, t) {
    return hg(e, t);
  }
  function Sl(e, t, n) {
    let r = n ? e.styles : null, o = n ? e.classes : null, i = 0;
    if (t !== null) for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = nl(o, a);
      else if (i == 2) {
        let l = a, c = t[++s];
        r = nl(r, l + ": " + c + ";");
      }
    }
    n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o;
  }
  function xu(e, t = _.Default) {
    let n = F();
    if (n === null) return T(e, t);
    let r = pt();
    return Rc(r, n, ie(e), t);
  }
  function Nu(e, t, n, r, o) {
    let i = r === null ? null : { "": -1 }, s = o(e, n);
    if (s !== null) {
      let a, l = null, c = null, u = vg(s);
      u === null ? a = s : [a, l, c] = u, Ig(e, t, n, a, i, l, c);
    }
    i !== null && r !== null && mg(n, r, i);
  }
  function mg(e, t, n) {
    let r = e.localNames = [];
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new w(-301, false);
      r.push(t[o], i);
    }
  }
  function vg(e) {
    let t = null, n = false;
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (s === 0 && We(a) && (t = a), a.findHostDirectiveDefs !== null) {
        n = true;
        break;
      }
    }
    if (!n) return null;
    let r = null, o = null, i = null;
    for (let s of e) s.findHostDirectiveDefs !== null && (r ??= [], o ??= /* @__PURE__ */ new Map(), i ??= /* @__PURE__ */ new Map(), yg(s, r, i, o)), s === t && (r ??= [], r.push(s));
    return r !== null ? (r.push(...t === null ? e : e.slice(1)), [r, o, i]) : null;
  }
  function yg(e, t, n, r) {
    let o = t.length;
    e.findHostDirectiveDefs(e, t, r), n.set(e, [o, t.length - 1]);
  }
  function _g(e, t, n) {
    t.componentOffset = n, (e.components ??= []).push(t.index);
  }
  function Ig(e, t, n, r, o, i, s) {
    let a = r.length, l = false;
    for (let h = 0; h < a; h++) {
      let f = r[h];
      !l && We(f) && (l = true, _g(e, n, h)), bh(Tc(n, t), e, f.type);
    }
    Mg(n, e.data.length, a);
    for (let h = 0; h < a; h++) {
      let f = r[h];
      f.providersResolver && f.providersResolver(f);
    }
    let c = false, u = false, d = su(e, t, a, null);
    a > 0 && (n.directiveToIndex = /* @__PURE__ */ new Map());
    for (let h = 0; h < a; h++) {
      let f = r[h];
      if (n.mergedAttrs = es(n.mergedAttrs, f.hostAttrs), Dg(e, n, t, d, f), Cg(d, f, o), s !== null && s.has(f)) {
        let [m, V] = s.get(f);
        n.directiveToIndex.set(f.type, [d, m + n.directiveStart, V + n.directiveStart]);
      } else (i === null || !i.has(f)) && n.directiveToIndex.set(f.type, d);
      f.contentQueries !== null && (n.flags |= 4), (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (n.flags |= 64);
      let g = f.type.prototype;
      !c && (g.ngOnChanges || g.ngOnInit || g.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), c = true), !u && (g.ngOnChanges || g.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), u = true), d++;
    }
    bg(e, n, i);
  }
  function bg(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
      let o = e.data[r];
      if (n === null || !n.has(o)) Tl(0, t, o, r), Tl(1, t, o, r), Nl(t, r, false);
      else {
        let i = n.get(o);
        xl(0, t, i, r), xl(1, t, i, r), Nl(t, r, true);
      }
    }
  }
  function Tl(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o) if (o.hasOwnProperty(i)) {
      let s;
      e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {}, s[i] ??= [], s[i].push(r), ku(t, i);
    }
  }
  function xl(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o) if (o.hasOwnProperty(i)) {
      let s = o[i], a;
      e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {}, a[s] ??= [], a[s].push(r, i), ku(t, s);
    }
  }
  function ku(e, t) {
    t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16);
  }
  function Nl(e, t, n) {
    let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
    if (r === null || !n && o === null || n && i === null || as(e)) {
      e.initialInputs ??= [], e.initialInputs.push(null);
      return;
    }
    let s = null, a = 0;
    for (; a < r.length; ) {
      let l = r[a];
      if (l === 0) {
        a += 4;
        continue;
      } else if (l === 5) {
        a += 2;
        continue;
      } else if (typeof l == "number") break;
      if (!n && o.hasOwnProperty(l)) {
        let c = o[l];
        for (let u of c) if (u === t) {
          s ??= [], s.push(l, r[a + 1]);
          break;
        }
      } else if (n && i.hasOwnProperty(l)) {
        let c = i[l];
        for (let u = 0; u < c.length; u += 2) if (c[u] === t) {
          s ??= [], s.push(c[u + 1], r[a + 1]);
          break;
        }
      }
      a += 2;
    }
    e.initialInputs ??= [], e.initialInputs.push(s);
  }
  function Dg(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = Ft(o.type, true)), s = new $t(i, We(o), xu);
    e.blueprint[r] = s, n[r] = s, wg(e, t, r, su(e, n, o.hostVars, Ze), o);
  }
  function wg(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
      let s = e.hostBindingOpCodes;
      s === null && (s = e.hostBindingOpCodes = []);
      let a = ~t.index;
      Eg(s) != a && s.push(a), s.push(n, r, i);
    }
  }
  function Eg(e) {
    let t = e.length;
    for (; t > 0; ) {
      let n = e[--t];
      if (typeof n == "number" && n < 0) return n;
    }
    return 0;
  }
  function Cg(e, t, n) {
    if (n) {
      if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
      We(t) && (n[""] = e);
    }
  }
  function Mg(e, t, n) {
    e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t;
  }
  function Au(e, t, n, r, o, i, s, a) {
    let l = t.consts, c = ct(l, s), u = ws(t, e, 2, r, c);
    return i && Nu(t, n, u, ct(l, a), o), u.mergedAttrs = es(u.mergedAttrs, u.attrs), u.attrs !== null && Sl(u, u.attrs, false), u.mergedAttrs !== null && Sl(u, u.mergedAttrs, true), t.queries !== null && t.queries.elementStart(t, u), u;
  }
  function Ru(e, t) {
    Ec(e, t), rc(t) && e.queries.elementEnd(t);
  }
  function Sg(e) {
    return Object.keys(e).map((t) => {
      let [n, r, o] = e[t], i = { propName: n, templateName: t, isSignal: (r & Ir.SignalBased) !== 0 };
      return o && (i.transform = o), i;
    });
  }
  function Tg(e) {
    return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
  }
  function xg(e, t, n) {
    let r = t instanceof je ? t : t?.injector;
    return r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r), r ? new Ii(n, r) : n;
  }
  function Ng(e) {
    let t = e.get(ut, null);
    if (t === null) throw new w(407, false);
    let n = e.get(gg, null), r = e.get(Be, null);
    return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r };
  }
  function kg(e, t) {
    let n = (e.selectors[0][0] || "div").toLowerCase();
    return tu(t, n, n === "svg" ? Bf : n === "math" ? Uf : null);
  }
  function Ag(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
      let i = n[o];
      r.push(i != null && i.length ? Array.from(i) : null);
    }
  }
  function Og(e, t, n) {
    return Rg(e, t, n);
  }
  function Pg(e, t, n = null) {
    return new sr({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: true }).injector;
  }
  function Ou(e) {
    return $l(() => {
      let t = $g(e), n = B(D({}, t), { decls: e.decls, vars: e.vars, template: e.template, consts: e.consts || null, ngContentSelectors: e.ngContentSelectors, onPush: e.changeDetection === Gc.OnPush, directiveDefs: null, pipeDefs: null, dependencies: t.standalone && e.dependencies || null, getStandaloneInjector: t.standalone ? (o) => o.get(Fg).getOrCreateStandaloneInjector(n) : null, getExternalStyles: null, signals: e.signals ?? false, data: e.data || {}, encapsulation: e.encapsulation || he.Emulated, styles: e.styles || se, _: null, schemas: e.schemas || null, tView: null, id: "" });
      t.standalone && _r("NgStandalone"), Bg(n);
      let r = e.dependencies;
      return n.directiveDefs = kl(r, false), n.pipeDefs = kl(r, true), n.id = Ug(n), n;
    });
  }
  function Lg(e) {
    return $i(e) || wf(e);
  }
  function Vg(e) {
    return e !== null;
  }
  function Dr(e) {
    return $l(() => ({ type: e.type, bootstrap: e.bootstrap || se, declarations: e.declarations || se, imports: e.imports || se, exports: e.exports || se, transitiveCompileScopes: null, schemas: e.schemas || null, id: e.id || null }));
  }
  function jg(e, t) {
    if (e == null) return it;
    let n = {};
    for (let r in e) if (e.hasOwnProperty(r)) {
      let o = e[r], i, s, a, l;
      Array.isArray(o) ? (a = o[0], i = o[1], s = o[2] ?? i, l = o[3] || null) : (i = o, s = o, a = Ir.None, l = null), n[i] = [r, a, l], t[i] = s;
    }
    return n;
  }
  function Hg(e) {
    if (e == null) return it;
    let t = {};
    for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
    return t;
  }
  function $g(e) {
    let t = {};
    return { type: e.type, providersResolver: null, factory: null, hostBindings: e.hostBindings || null, hostVars: e.hostVars || 0, hostAttrs: e.hostAttrs || null, contentQueries: e.contentQueries || null, declaredInputs: t, inputConfig: e.inputs || it, exportAs: e.exportAs || null, standalone: e.standalone ?? true, signals: e.signals === true, selectors: e.selectors || se, viewQuery: e.viewQuery || null, features: e.features || null, setInput: null, findHostDirectiveDefs: null, hostDirectives: null, inputs: jg(e.inputs, t), outputs: Hg(e.outputs), debugInfo: null };
  }
  function Bg(e) {
    e.features?.forEach((t) => t(e));
  }
  function kl(e, t) {
    if (!e) return null;
    let n = t ? Ef : Lg;
    return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Vg);
  }
  function Ug(e) {
    let t = 0, n = typeof e.consts == "function" ? "" : e.consts, r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|")) t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648, "c" + t;
  }
  function mt(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? false : (e[t] = n, true);
  }
  function Gg(e, t, n, r, o, i, s, a, l) {
    let c = t.consts, u = ws(t, e, 4, s || null, a || null);
    fc() && Nu(t, n, u, ct(c, l), du), u.mergedAttrs = es(u.mergedAttrs, u.attrs), Ec(t, u);
    let d = u.tView = ls(2, u, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, c, null);
    return t.queries !== null && (t.queries.template(t, u), d.queries = t.queries.embeddedTView(u)), u;
  }
  function Ci(e, t, n, r, o, i, s, a, l, c) {
    let u = n + te, d = t.firstCreatePass ? Gg(u, t, e, r, o, i, s, a, l) : t.data[u];
    Wt(d, false);
    let h = zg(t, e, d, n);
    Ji() && ys(t, e, h, d), Zt(h, e);
    let f = ag(h, e, h, d);
    return e[u] = f, au(e, f), Og(f, d, e), Gi(d) && us(t, e, d), l != null && uu(e, d, c), d;
  }
  function Yt(e, t, n, r, o, i, s, a) {
    let l = F(), c = ge(), u = ct(c.consts, i);
    return Ci(l, c, e, t, n, r, o, u, s, a), Yt;
  }
  function Wg(e, t, n, r) {
    return Xi(true), t[z].createComment("");
  }
  function Cs(e) {
    return !!e && typeof e.then == "function";
  }
  function Zg(e) {
    return !!e && typeof e.subscribe == "function";
  }
  function Kg() {
    Kr(() => {
      throw new w(600, false);
    });
  }
  function Jg(e) {
    return e.isBoundToModule;
  }
  function Wn(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  }
  function em(e, t, n, r) {
    if (!n && !zt(e)) return;
    _u(e, t, n && !r ? 0 : 1);
  }
  function wr(e, t, n, r) {
    let o = F(), i = qt();
    if (mt(o, i, t)) {
      let s = ge(), a = Dc();
      Sp(a, o, e, t, n, r);
    }
    return wr;
  }
  function tm(e, t, n, r) {
    return mt(e, qt(), n) ? t + Vi(n) + r : Ze;
  }
  function Bn(e, t) {
    return e << 17 | t << 2;
  }
  function Ge(e) {
    return e >> 17 & 32767;
  }
  function nm(e) {
    return (e & 2) == 2;
  }
  function rm(e, t) {
    return e & 131071 | t << 17;
  }
  function Si(e) {
    return e | 2;
  }
  function dt(e) {
    return (e & 131068) >> 2;
  }
  function Go(e, t) {
    return e & -131069 | t << 2;
  }
  function om(e) {
    return (e & 1) === 1;
  }
  function Ti(e) {
    return e | 1;
  }
  function im(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings, a = Ge(s), l = dt(s);
    e[r] = n;
    let c = false, u;
    if (Array.isArray(n)) {
      let d = n;
      u = d[1], (u === null || Ut(d, u) > 0) && (c = true);
    } else u = n;
    if (o) if (l !== 0) {
      let h = Ge(e[a + 1]);
      e[r + 1] = Bn(h, a), h !== 0 && (e[h + 1] = Go(e[h + 1], r)), e[a + 1] = rm(e[a + 1], r);
    } else e[r + 1] = Bn(a, 0), a !== 0 && (e[a + 1] = Go(e[a + 1], r)), a = r;
    else e[r + 1] = Bn(l, 0), a === 0 ? a = r : e[l + 1] = Go(e[l + 1], r), l = r;
    c && (e[r + 1] = Si(e[r + 1])), Al(e, u, r, true), Al(e, u, r, false), sm(t, u, e, r, i), s = Bn(a, l), i ? t.classBindings = s : t.styleBindings = s;
  }
  function sm(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null && typeof t == "string" && Ut(i, t) >= 0 && (n[r + 1] = Ti(n[r + 1]));
  }
  function Al(e, t, n, r) {
    let o = e[n + 1], i = t === null, s = r ? Ge(o) : dt(o), a = false;
    for (; s !== 0 && (a === false || i); ) {
      let l = e[s], c = e[s + 1];
      am(l, t) && (a = true, e[s + 1] = r ? Ti(c) : Si(c)), s = r ? Ge(c) : dt(c);
    }
    a && (e[n + 1] = r ? Si(o) : Ti(o));
  }
  function am(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? true : Array.isArray(e) && typeof t == "string" ? Ut(e, t) >= 0 : false;
  }
  function Er(e, t, n) {
    let r = F(), o = qt();
    if (mt(r, o, t)) {
      let i = ge(), s = Dc();
      Dp(i, s, r, e, t, r[z], n, false);
    }
    return Er;
  }
  function Rl(e, t, n, r, o) {
    ds(t, e, n, o ? "class" : "style", r);
  }
  function Kt(e, t) {
    return lm(e, t, null, true), Kt;
  }
  function lm(e, t, n, r) {
    let o = F(), i = ge(), s = th(2);
    if (i.firstUpdatePass && um(i, e, s, r), t !== Ze && mt(o, s, t)) {
      let a = i.data[qe()];
      gm(i, a, o, o[z], e, o[s + 1] = mm(t, n), r, s);
    }
  }
  function cm(e, t) {
    return t >= e.expandoStartIndex;
  }
  function um(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
      let i = o[qe()], s = cm(e, n);
      vm(i, r) && t === null && !s && (t = false), t = dm(o, i, t, r), im(o, i, t, n, s, r);
    }
  }
  function dm(e, t, n, r) {
    let o = ih(e), i = r ? t.residualClasses : t.residualStyles;
    if (o === null) (r ? t.classBindings : t.styleBindings) === 0 && (n = zo(null, e, t, n, r), n = Bt(n, t.attrs, r), i = null);
    else {
      let s = t.directiveStylingLast;
      if (s === -1 || e[s] !== o) if (n = zo(o, e, t, n, r), i === null) {
        let l = fm(e, t, r);
        l !== void 0 && Array.isArray(l) && (l = zo(null, e, t, l[1], r), l = Bt(l, t.attrs, r), hm(e, t, r, l));
      } else i = pm(e, t, r);
    }
    return i !== void 0 && (r ? t.residualClasses = i : t.residualStyles = i), n;
  }
  function fm(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (dt(r) !== 0) return e[Ge(r)];
  }
  function hm(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[Ge(o)] = r;
  }
  function pm(e, t, n) {
    let r, o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
      let s = e[i].hostAttrs;
      r = Bt(r, s, n);
    }
    return Bt(r, t.attrs, n);
  }
  function zo(e, t, n, r, o) {
    let i = null, s = n.directiveEnd, a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], r = Bt(r, i.hostAttrs, o), i !== e); ) a++;
    return e !== null && (n.directiveStylingLast = a), r;
  }
  function Bt(e, t, n) {
    let r = n ? 1 : 2, o = -1;
    if (t !== null) for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number" ? o = s : o === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), bf(e, s, n ? true : t[++i]));
    }
    return e === void 0 ? null : e;
  }
  function gm(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3)) return;
    let l = e.data, c = l[a + 1], u = om(c) ? Ol(l, t, n, o, dt(c), s) : void 0;
    if (!ar(u)) {
      ar(i) || nm(c) && (i = Ol(l, null, n, o, a, s));
      let d = ac(qe(), n);
      qp(r, s, d, o, i);
    }
  }
  function Ol(e, t, n, r, o, i) {
    let s = t === null, a;
    for (; o > 0; ) {
      let l = e[o], c = Array.isArray(l), u = c ? l[1] : l, d = u === null, h = n[o + 1];
      h === Ze && (h = d ? se : void 0);
      let f = d ? Fo(h, r) : u === r ? h : void 0;
      if (c && !ar(f) && (f = Fo(l, r)), ar(f) && (a = f, s)) return a;
      let g = e[o + 1];
      o = s ? Ge(g) : dt(g);
    }
    if (t !== null) {
      let l = i ? t.residualClasses : t.residualStyles;
      l != null && (a = Fo(l, r));
    }
    return a;
  }
  function ar(e) {
    return e !== void 0;
  }
  function mm(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = J(Kh(e)))), e;
  }
  function vm(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0;
  }
  function Wo(e, t, n, r, o) {
    return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
  }
  function ym(e, t, n) {
    let r, o, i = 0, s = e.length - 1, a = void 0;
    if (Array.isArray(t)) {
      let l = t.length - 1;
      for (; i <= s && i <= l; ) {
        let c = e.at(i), u = t[i], d = Wo(i, c, i, u, n);
        if (d !== 0) {
          d < 0 && e.updateValue(i, u), i++;
          continue;
        }
        let h = e.at(s), f = t[l], g = Wo(s, h, l, f, n);
        if (g !== 0) {
          g < 0 && e.updateValue(s, f), s--, l--;
          continue;
        }
        let m = n(i, c), V = n(s, h), A = n(i, u);
        if (Object.is(A, V)) {
          let It = n(l, f);
          Object.is(It, m) ? (e.swap(i, s), e.updateValue(s, f), l--, s--) : e.move(s, i), e.updateValue(i, u), i++;
          continue;
        }
        if (r ??= new lr(), o ??= Fl(e, i, s, n), Ni(e, r, i, A)) e.updateValue(i, u), i++, s++;
        else if (o.has(A)) r.set(m, e.detach(i)), s--;
        else {
          let It = e.create(i, t[i]);
          e.attach(i, It), i++, s++;
        }
      }
      for (; i <= l; ) Pl(e, r, n, i, t[i]), i++;
    } else if (t != null) {
      let l = t[Symbol.iterator](), c = l.next();
      for (; !c.done && i <= s; ) {
        let u = e.at(i), d = c.value, h = Wo(i, u, i, d, n);
        if (h !== 0) h < 0 && e.updateValue(i, d), i++, c = l.next();
        else {
          r ??= new lr(), o ??= Fl(e, i, s, n);
          let f = n(i, d);
          if (Ni(e, r, i, f)) e.updateValue(i, d), i++, s++, c = l.next();
          else if (!o.has(f)) e.attach(i, e.create(i, d)), i++, s++, c = l.next();
          else {
            let g = n(i, u);
            r.set(g, e.detach(i)), s--;
          }
        }
      }
      for (; !c.done; ) Pl(e, r, n, e.length, c.value), c = l.next();
    }
    for (; i <= s; ) e.destroy(e.detach(s--));
    r?.forEach((l) => {
      e.destroy(l);
    });
  }
  function Ni(e, t, n, r) {
    return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)), t.delete(r), true) : false;
  }
  function Pl(e, t, n, r, o) {
    if (Ni(e, t, r, n(r, o))) e.updateValue(r, o);
    else {
      let i = e.create(r, o);
      e.attach(r, i);
    }
  }
  function Fl(e, t, n, r) {
    let o = /* @__PURE__ */ new Set();
    for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
    return o;
  }
  function vt(e, t) {
    _r("NgControlFlow");
    let n = F(), r = qt(), o = n[r] !== Ze ? n[r] : -1, i = o !== -1 ? cr(n, te + o) : void 0, s = 0;
    if (mt(n, r, e)) {
      let a = y(null);
      try {
        if (i !== void 0 && Eu(i, s), e !== -1) {
          let l = te + e, c = cr(n, l), u = Oi(n[I], l), d = Es(c, u.tView.ssrId), h = hs(n, u, t, { dehydratedView: d });
          bs(c, h, s, ps(u, d));
        }
      } finally {
        y(a);
      }
    } else if (i !== void 0) {
      let a = wu(i, s);
      a !== void 0 && (a[H] = t);
    }
  }
  function Lu(e, t, n, r, o, i, s, a, l, c, u, d, h) {
    _r("NgControlFlow");
    let f = F(), g = ge(), m = l !== void 0, V = F(), A = a ? s.bind(V[fe][H]) : s, It = new Ai(m, A);
    V[te + e] = It, Ci(f, g, e + 1, t, n, r, o, ct(g.consts, i)), m && Ci(f, g, e + 2, l, c, u, d, ct(g.consts, h));
  }
  function Vu(e) {
    let t = y(null), n = qe();
    try {
      let r = F(), o = r[I], i = r[n], s = n + 1, a = cr(r, s);
      if (i.liveCollection === void 0) {
        let c = Oi(o, s);
        i.liveCollection = new Ri(a, r, c);
      } else i.liveCollection.reset();
      let l = i.liveCollection;
      if (ym(l, e, i.trackByFn), l.updateIndexes(), i.hasEmptyBlock) {
        let c = qt(), u = l.length === 0;
        if (mt(r, c, u)) {
          let d = n + 2, h = cr(r, d);
          if (u) {
            let f = Oi(o, d), g = Es(h, f.tView.ssrId), m = hs(r, f, void 0, { dehydratedView: g });
            bs(h, m, 0, ps(f, g));
          } else Eu(h, 0);
        }
      }
    } finally {
      y(t);
    }
  }
  function cr(e, t) {
    return e[t];
  }
  function _m(e, t) {
    return Ds(e, t);
  }
  function Im(e, t) {
    return wu(e, t);
  }
  function Oi(e, t) {
    return zi(e, t);
  }
  function P(e, t, n, r) {
    let o = F(), i = ge(), s = te + e, a = o[z], l = i.firstCreatePass ? Au(s, i, o, t, du, fc(), n, r) : i.data[s], c = bm(i, o, l, a, t, e);
    o[s] = c;
    let u = Gi(l);
    return Wt(l, true), ru(a, c, l), !fu(l) && Ji() && ys(i, o, c, l), (Wf() === 0 || u) && Zt(c, o), qf(), u && (us(i, o, l), eu(i, l, o)), r !== null && uu(o, l), P;
  }
  function L() {
    let e = pt();
    pc() ? Xf() : (e = e.parent, Wt(e, false));
    let t = e;
    Yf(t) && Kf(), Zf();
    let n = ge();
    return n.firstCreatePass && Ru(n, t), t.classesWithoutHost != null && dh(t) && Rl(n, t, F(), t.classesWithoutHost, true), t.stylesWithoutHost != null && fh(t) && Rl(n, t, F(), t.stylesWithoutHost, false), L;
  }
  function Ms() {
    return F();
  }
  function wm(e) {
    typeof e == "string" && (Dm = e.toLowerCase().replace(/_/g, "-"));
  }
  function Ll(e, t, n) {
    return function r(o) {
      if (o === Function) return n;
      let i = Gt(e) ? Ne(e.index, t) : t;
      Is(i, 5);
      let s = t[H], a = Vl(t, s, n, o), l = r.__ngNextListenerFn__;
      for (; l; ) a = Vl(t, s, l, o) && a, l = l.__ngNextListenerFn__;
      return a;
    };
  }
  function Vl(e, t, n, r) {
    let o = y(null);
    try {
      return x(6, t, n), n(r) !== false;
    } catch (i) {
      return Em(e, i), false;
    } finally {
      x(7, t, n), y(o);
    }
  }
  function Em(e, t) {
    let n = e[st], r = n ? n.get(we, null) : null;
    r && r.handleError(t);
  }
  function jl(e, t, n, r, o, i) {
    let s = t[n], a = t[I], c = a.data[n].outputs[r], u = s[c], d = a.firstCreatePass ? dc(a) : null, h = uc(t), f = u.subscribe(i), g = h.length;
    h.push(i, f), d && d.push(o, e.index, g, -(g + 1));
  }
  function Jt(e, t, n, r) {
    let o = F(), i = ge(), s = pt();
    return Mm(i, o, o[z], s, e, t, r), Jt;
  }
  function Cm(e, t, n, r) {
    let o = e.cleanup;
    if (o != null) for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[Jn], l = o[i + 2];
        return a.length > l ? a[l] : null;
      }
      typeof s == "string" && (i += 2);
    }
    return null;
  }
  function Mm(e, t, n, r, o, i, s) {
    let a = Gi(r), c = e.firstCreatePass ? dc(e) : null, u = uc(t), d = true;
    if (r.type & 3 || s) {
      let h = Ce(r, t), f = s ? s(h) : h, g = u.length, m = s ? (A) => s(De(A[r.index])) : r.index, V = null;
      if (!s && a && (V = Cm(e, t, o, r.index)), V !== null) {
        let A = V.__ngLastListenerFn__ || V;
        A.__ngNextListenerFn__ = i, V.__ngLastListenerFn__ = i, d = false;
      } else {
        i = Ll(r, t, i), Qh(t, f, o, i);
        let A = n.listen(f, o, i);
        u.push(i, A), c && c.push(o, m, g, g + 1);
      }
    } else i = Ll(r, t, i);
    if (d) {
      let h = r.outputs?.[o], f = r.hostDirectiveOutputs?.[o];
      if (f && f.length) for (let g = 0; g < f.length; g += 2) {
        let m = f[g], V = f[g + 1];
        jl(r, t, m, V, o, i);
      }
      if (h && h.length) for (let g of h) jl(r, t, g, o, o, i);
    }
  }
  function ve(e = 1) {
    return ah(e);
  }
  function U(e, t = "") {
    let n = F(), r = ge(), o = e + te, i = r.firstCreatePass ? ws(r, o, 1, t, null) : r.data[o], s = Sm(r, n, i, t, e);
    n[o] = s, Ji() && ys(r, n, s, i), Wt(i, false);
  }
  function Re(e) {
    return Cr("", e, ""), Re;
  }
  function Cr(e, t, n) {
    let r = F(), o = tm(r, e, t, n);
    return o !== Ze && Tm(r, qe(), o), Cr;
  }
  function Tm(e, t, n) {
    let r = ac(t, e);
    Xh(e[z], r, n);
  }
  function ju({ ngZoneFactory: e, ignoreChangesOutsideZone: t, scheduleInRootZone: n }) {
    return e ??= () => new $(B(D({}, $u()), { scheduleInRootZone: n })), [{ provide: $, useFactory: e }, { provide: Yn, multi: true, useFactory: () => {
      let r = M(xm, { optional: true });
      return () => r.initialize();
    } }, { provide: Yn, multi: true, useFactory: () => {
      let r = M(km);
      return () => {
        r.initialize();
      };
    } }, t === true ? { provide: Vc, useValue: true } : [], { provide: jc, useValue: n ?? Fc }];
  }
  function Hu(e) {
    let t = e?.ignoreChangesOutsideZone, n = e?.scheduleInRootZone, r = ju({ ngZoneFactory: () => {
      let o = $u(e);
      return o.scheduleInRootZone = n, o.shouldCoalesceEventChangeDetection && _r("NgZone_CoalesceEvent"), new $(o);
    }, ignoreChangesOutsideZone: t, scheduleInRootZone: n });
    return Cf([{ provide: Nm, useValue: true }, { provide: ts, useValue: false }, r]);
  }
  function $u(e) {
    return { enableLongStackTrace: false, shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? false, shouldCoalesceRunChangeDetection: e?.runCoalescing ?? false };
  }
  function Rm() {
    return typeof $localize < "u" && $localize.locale || ur;
  }
  function At(e) {
    return !e.moduleRef;
  }
  function Pm(e) {
    let t = At(e) ? e.r3Injector : e.moduleRef.injector, n = t.get($);
    return n.run(() => {
      At(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
      let r = t.get(we, null), o;
      if (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: (i) => {
          r.handleError(i);
        } });
      }), At(e)) {
        let i = () => t.destroy(), s = e.platformInjector.get(Pi);
        s.add(i), t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
      } else {
        let i = () => e.moduleRef.destroy(), s = e.platformInjector.get(Pi);
        s.add(i), e.moduleRef.onDestroy(() => {
          Wn(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
      }
      return Lm(r, n, () => {
        let i = t.get(Fu);
        return i.runInitializers(), i.donePromise.then(() => {
          let s = t.get(Bu, ur);
          if (wm(s || ur), !t.get(Om, true)) return At(e) ? t.get(Ue) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
          if (At(e)) {
            let l = t.get(Ue);
            return e.rootComponent !== void 0 && l.bootstrap(e.rootComponent), l;
          } else return Fm(e.moduleRef, e.allPlatformModules), e.moduleRef;
        });
      });
    });
  }
  function Fm(e, t) {
    let n = e.injector.get(Ue);
    if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach((r) => n.bootstrap(r));
    else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
    else throw new w(-403, false);
    t.push(e);
  }
  function Lm(e, t, n) {
    try {
      let r = n();
      return Cs(r) ? r.catch((o) => {
        throw t.runOutsideAngular(() => e.handleError(o)), o;
      }) : r;
    } catch (r) {
      throw t.runOutsideAngular(() => e.handleError(r)), r;
    }
  }
  function Vm(e = [], t) {
    return ke.create({ name: t, providers: [{ provide: hr, useValue: "platform" }, { provide: Pi, useValue: /* @__PURE__ */ new Set([() => qn = null]) }, ...e] });
  }
  function jm(e = []) {
    if (qn) return qn;
    let t = Vm(e);
    return qn = t, Kg(), Hm(t), t;
  }
  function Hm(e) {
    let t = e.get(is, null);
    ec(e, () => {
      t?.forEach((n) => n());
    });
  }
  function Uu(e) {
    let { rootComponent: t, appProviders: n, platformProviders: r, platformRef: o } = e;
    x(8);
    try {
      let i = o?.injector ?? jm(r), s = [ju({}), { provide: Be, useExisting: Am }, ...n || []], a = new sr({ providers: s, parent: i, debugName: "", runEnvironmentInitializers: false });
      return Pm({ r3Injector: a.injector, platformInjector: i, rootComponent: t });
    } catch (i) {
      return Promise.reject(i);
    } finally {
      x(9);
    }
  }
  function Mr(e, t) {
    return Yr(e, t?.equal);
  }
  var Jd;
  var w;
  var tf;
  var Bl;
  var il;
  var Ul;
  var of;
  var E;
  var sf;
  var af;
  var lf;
  var sl;
  var Pt;
  var al;
  var _;
  var qo;
  var uf;
  var Le;
  var df;
  var Zn;
  var Qn;
  var ff;
  var hf;
  var pf;
  var ll;
  var it;
  var se;
  var Yn;
  var Ql;
  var Yl;
  var Kn;
  var Sf;
  var hr;
  var Un;
  var cl;
  var Lo;
  var je;
  var Lt;
  var Ee;
  var I;
  var v;
  var ee;
  var ae;
  var pe;
  var Vt;
  var Jn;
  var H;
  var st;
  var xe;
  var z;
  var jt;
  var ul;
  var ft;
  var fe;
  var at;
  var nt;
  var lt;
  var pr;
  var tc;
  var Te;
  var Vo;
  var Xn;
  var X;
  var jo;
  var te;
  var nc;
  var Ht;
  var Lf;
  var er;
  var Q;
  var Xo;
  var ic;
  var dl;
  var x;
  var Bf;
  var Uf;
  var b;
  var ti;
  var bc;
  var wc;
  var ot;
  var $t;
  var ii;
  var yh;
  var Mc;
  var Sc;
  var _h;
  var de;
  var nr;
  var ke;
  var Th;
  var Fc;
  var Lc;
  var ai;
  var Be;
  var ts;
  var Vc;
  var jc;
  var mr;
  var li;
  var be;
  var ns;
  var or;
  var Nh;
  var $;
  var kh;
  var ui;
  var we;
  var Fh;
  var vr;
  var Gc;
  var zc;
  var jh;
  var Dl;
  var fi;
  var os;
  var Uh;
  var is;
  var Qt;
  var ss;
  var Gh;
  var zh;
  var Yc;
  var Wh;
  var Kc;
  var yr;
  var wl;
  var qh;
  var Zh;
  var Yh;
  var he;
  var pi;
  var ou;
  var Ze;
  var Ir;
  var Ip;
  var Op;
  var Ae;
  var Gp;
  var Ml;
  var mu;
  var Jp;
  var eg;
  var tg;
  var cg;
  var Tb;
  var hg;
  var pg;
  var Tu;
  var _i;
  var gt;
  var ut;
  var gg;
  var Uo;
  var Ii;
  var bi;
  var Di;
  var wi;
  var Rg;
  var Ei;
  var sr;
  var Fg;
  var zg;
  var Pu;
  var qg;
  var Mi;
  var Qg;
  var Fu;
  var Yg;
  var Xg;
  var Ue;
  var xi;
  var lr;
  var ki;
  var Ai;
  var Ri;
  var bm;
  var ur;
  var Dm;
  var Sm;
  var xm;
  var Nm;
  var km;
  var Am;
  var Bu;
  var Pi;
  var Om;
  var qn;
  var Hl;
  var ne = p(() => {
    "use strict";
    to();
    ro();
    oa();
    ro();
    Oo();
    Po();
    Jd = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss", w = class extends Error {
      code;
      constructor(t, n) {
        super(ef(t, n)), this.code = t;
      }
    };
    tf = N({ __forward_ref__: N });
    Bl = N({ \u0275prov: N }), il = N({ \u0275inj: N }), Ul = N({ ngInjectableDef: N }), of = N({ ngInjectorDef: N }), E = class {
      _desc;
      ngMetadataName = "InjectionToken";
      \u0275prov;
      constructor(t, n) {
        this._desc = t, this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = O({ token: this, providedIn: n.providedIn || "root", factory: n.factory }));
      }
      get multi() {
        return this;
      }
      toString() {
        return `InjectionToken ${this._desc}`;
      }
    };
    sf = N({ \u0275cmp: N }), af = N({ \u0275dir: N }), lf = N({ \u0275pipe: N }), sl = N({ \u0275fac: N }), Pt = N({ __NG_ELEMENT_ID__: N }), al = N({ __NG_ENV_ID__: N });
    _ = (function(e) {
      return e[e.Default = 0] = "Default", e[e.Host = 1] = "Host", e[e.Self = 2] = "Self", e[e.SkipSelf = 4] = "SkipSelf", e[e.Optional = 8] = "Optional", e;
    })(_ || {});
    uf = {}, Le = uf, df = "__NG_DI_FLAG__", Zn = class {
      injector;
      constructor(t) {
        this.injector = t;
      }
      retrieve(t, n) {
        let r = n;
        return this.injector.get(t, r.optional ? yn : Le, r);
      }
    }, Qn = "ngTempTokenPath", ff = "ngTokenPath", hf = /\n/gm, pf = "\u0275", ll = "__source";
    it = {}, se = [], Yn = new E(""), Ql = new E("", -1), Yl = new E(""), Kn = class {
      get(t, n = Le) {
        if (n === Le) {
          let r = new Error(`NullInjectorError: No provider for ${J(t)}!`);
          throw r.name = "NullInjectorError", r;
        }
        return n;
      }
    };
    Sf = N({ provide: String, useValue: N });
    hr = new E(""), Un = {}, cl = {};
    je = class {
    }, Lt = class extends je {
      parent;
      source;
      scopes;
      records = /* @__PURE__ */ new Map();
      _ngOnDestroyHooks = /* @__PURE__ */ new Set();
      _onDestroyHooks = [];
      get destroyed() {
        return this._destroyed;
      }
      _destroyed = false;
      injectorDefTypes;
      constructor(t, n, r, o) {
        super(), this.parent = n, this.source = r, this.scopes = o, Jo(t, (s) => this.processProvider(s)), this.records.set(Ql, tt(void 0, this)), o.has("environment") && this.records.set(je, tt(void 0, this));
        let i = this.records.get(hr);
        i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(Yl, se, _.Self));
      }
      retrieve(t, n) {
        let r = n;
        return this.get(t, r.optional ? yn : Le, r);
      }
      destroy() {
        Rt(this), this._destroyed = true;
        let t = y(null);
        try {
          for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
          let n = this._onDestroyHooks;
          this._onDestroyHooks = [];
          for (let r of n) r();
        } finally {
          this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), y(t);
        }
      }
      onDestroy(t) {
        return Rt(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t);
      }
      runInContext(t) {
        Rt(this);
        let n = _e(this), r = K(void 0), o;
        try {
          return t();
        } finally {
          _e(n), K(r);
        }
      }
      get(t, n = Le, r = _.Default) {
        if (Rt(this), t.hasOwnProperty(al)) return t[al](this);
        r = fr(r);
        let o, i = _e(this), s = K(void 0);
        try {
          if (!(r & _.SkipSelf)) {
            let l = this.records.get(t);
            if (l === void 0) {
              let c = Pf(t) && Li(t);
              c && this.injectableDefInScope(c) ? l = tt(Ko(t), Un) : l = null, this.records.set(t, l);
            }
            if (l != null) return this.hydrate(t, l, r);
          }
          let a = r & _.Self ? Ui() : this.parent;
          return n = r & _.Optional && n === Le ? null : n, a.get(t, n);
        } catch (a) {
          if (a.name === "NullInjectorError") {
            if ((a[Qn] = a[Qn] || []).unshift(J(t)), i) throw a;
            return vf(a, t, "R3InjectorError", this.source);
          } else throw a;
        } finally {
          K(s), _e(i);
        }
      }
      resolveInjectorInitializers() {
        let t = y(null), n = _e(this), r = K(void 0), o;
        try {
          let i = this.get(Yn, se, _.Self);
          for (let s of i) s();
        } finally {
          _e(n), K(r), y(t);
        }
      }
      toString() {
        let t = [], n = this.records;
        for (let r of n.keys()) t.push(J(r));
        return `R3Injector[${t.join(", ")}]`;
      }
      processProvider(t) {
        t = ie(t);
        let n = Yo(t) ? t : ie(t && t.provide), r = kf(t);
        if (!Yo(t) && t.multi === true) {
          let o = this.records.get(n);
          o || (o = tt(void 0, Un, true), o.factory = () => Zo(o.multi), this.records.set(n, o)), n = t, o.multi.push(t);
        }
        this.records.set(n, r);
      }
      hydrate(t, n, r) {
        let o = y(null);
        try {
          return n.value === cl ? zl(J(t)) : n.value === Un && (n.value = cl, n.value = n.factory(void 0, r)), typeof n.value == "object" && n.value && Of(n.value) && this._ngOnDestroyHooks.add(n.value), n.value;
        } finally {
          y(o);
        }
      }
      injectableDefInScope(t) {
        if (!t.providedIn) return false;
        let n = ie(t.providedIn);
        return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n);
      }
      removeOnDestroy(t) {
        let n = this._onDestroyHooks.indexOf(t);
        n !== -1 && this._onDestroyHooks.splice(n, 1);
      }
    };
    Ee = 0, I = 1, v = 2, ee = 3, ae = 4, pe = 5, Vt = 6, Jn = 7, H = 8, st = 9, xe = 10, z = 11, jt = 12, ul = 13, ft = 14, fe = 15, at = 16, nt = 17, lt = 18, pr = 19, tc = 20, Te = 21, Vo = 22, Xn = 23, X = 24, jo = 25, te = 26, nc = 1, Ht = 7, Lf = 8, er = 9, Q = 10;
    Xo = class {
      previousValue;
      currentValue;
      firstChange;
      constructor(t, n, r) {
        this.previousValue = t, this.currentValue = n, this.firstChange = r;
      }
      isFirstChange() {
        return this.firstChange;
      }
    };
    ic = "__ngSimpleChanges__";
    dl = null, x = function(e, t = null, n) {
      dl?.(e, t, n);
    }, Bf = "svg", Uf = "math";
    b = { lFrame: _c(null), bindingsEnabled: true, skipHydrationRootTNode: null }, ti = false;
    bc = Ic;
    wc = true;
    ot = -1, $t = class {
      factory;
      injectImpl;
      resolving = false;
      canSeeViewProviders;
      multi;
      componentProviders;
      index;
      providerFactory;
      constructor(t, n, r) {
        this.factory = t, this.canSeeViewProviders = n, this.injectImpl = r;
      }
    };
    ii = true;
    yh = 256, Mc = yh - 1, Sc = 5, _h = 0, de = {};
    nr = class {
      _tNode;
      _lView;
      constructor(t, n) {
        this._tNode = t, this._lView = n;
      }
      get(t, n, r) {
        return Rc(this._tNode, this._lView, t, fr(r), n);
      }
    };
    ke = class e {
      static THROW_IF_NOT_FOUND = Le;
      static NULL = new Kn();
      static create(t, n) {
        if (Array.isArray(t)) return yl({ name: "" }, n, t, "");
        {
          let r = t.name ?? "";
          return yl({ name: r }, t.parent, t.providers, r);
        }
      }
      static \u0275prov = O({ token: e, providedIn: "any", factory: () => T(Ql) });
      static __NG_ELEMENT_ID__ = -1;
    };
    Th = new E("");
    Th.__NG_ELEMENT_ID__ = (e) => {
      let t = pt();
      if (t === null) throw new w(204, false);
      if (t.type & 2) return t.value;
      if (e & _.Optional) return null;
      throw new w(204, false);
    };
    Fc = false, Lc = /* @__PURE__ */ (() => {
      class e {
        static __NG_ELEMENT_ID__ = xh;
        static __NG_ENV_ID__ = (n) => n;
      }
      return e;
    })(), ai = class extends Lc {
      _lView;
      constructor(t) {
        super(), this._lView = t;
      }
      onDestroy(t) {
        let n = this._lView;
        return ht(n) ? (t(), () => {
        }) : (cc(n, t), () => zf(n, t));
      }
    };
    Be = class {
    }, ts = new E("", { providedIn: "root", factory: () => false }), Vc = new E(""), jc = new E(""), mr = (() => {
      class e {
        taskId = 0;
        pendingTasks = /* @__PURE__ */ new Set();
        get _hasPendingTasks() {
          return this.hasPendingTasks.value;
        }
        hasPendingTasks = new Tt(false);
        add() {
          this._hasPendingTasks || this.hasPendingTasks.next(true);
          let n = this.taskId++;
          return this.pendingTasks.add(n), n;
        }
        has(n) {
          return this.pendingTasks.has(n);
        }
        remove(n) {
          this.pendingTasks.delete(n), this.pendingTasks.size === 0 && this._hasPendingTasks && this.hasPendingTasks.next(false);
        }
        ngOnDestroy() {
          this.pendingTasks.clear(), this._hasPendingTasks && this.hasPendingTasks.next(false);
        }
        static \u0275prov = O({ token: e, providedIn: "root", factory: () => new e() });
      }
      return e;
    })(), li = class extends Ie {
      __isAsync;
      destroyRef = void 0;
      pendingTasks = void 0;
      constructor(t = false) {
        super(), this.__isAsync = t, Ff() && (this.destroyRef = M(Lc, { optional: true }) ?? void 0, this.pendingTasks = M(mr, { optional: true }) ?? void 0);
      }
      emit(t) {
        let n = y(null);
        try {
          super.next(t);
        } finally {
          y(n);
        }
      }
      subscribe(t, n, r) {
        let o = t, i = n || (() => null), s = r;
        if (t && typeof t == "object") {
          let l = t;
          o = l.next?.bind(l), i = l.error?.bind(l), s = l.complete?.bind(l);
        }
        this.__isAsync && (i = this.wrapInTimeout(i), o && (o = this.wrapInTimeout(o)), s && (s = this.wrapInTimeout(s)));
        let a = super.subscribe({ next: o, error: i, complete: s });
        return t instanceof G && t.add(a), a;
      }
      wrapInTimeout(t) {
        return (n) => {
          let r = this.pendingTasks?.add();
          setTimeout(() => {
            try {
              t(n);
            } finally {
              r !== void 0 && this.pendingTasks?.remove(r);
            }
          });
        };
      }
    }, be = li;
    ns = "isAngularZone", or = ns + "_ID", Nh = 0, $ = class e {
      hasPendingMacrotasks = false;
      hasPendingMicrotasks = false;
      isStable = true;
      onUnstable = new be(false);
      onMicrotaskEmpty = new be(false);
      onStable = new be(false);
      onError = new be(false);
      constructor(t) {
        let { enableLongStackTrace: n = false, shouldCoalesceEventChangeDetection: r = false, shouldCoalesceRunChangeDetection: o = false, scheduleInRootZone: i = Fc } = t;
        if (typeof Zone > "u") throw new w(908, false);
        Zone.assertZonePatched();
        let s = this;
        s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = false, s.scheduleInRootZone = i, Rh(s);
      }
      static isInAngularZone() {
        return typeof Zone < "u" && Zone.current.get(ns) === true;
      }
      static assertInAngularZone() {
        if (!e.isInAngularZone()) throw new w(909, false);
      }
      static assertNotInAngularZone() {
        if (e.isInAngularZone()) throw new w(909, false);
      }
      run(t, n, r) {
        return this._inner.run(t, n, r);
      }
      runTask(t, n, r, o) {
        let i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + o, t, kh, rr, rr);
        try {
          return i.runTask(s, n, r);
        } finally {
          i.cancelTask(s);
        }
      }
      runGuarded(t, n, r) {
        return this._inner.runGuarded(t, n, r);
      }
      runOutsideAngular(t) {
        return this._outer.run(t);
      }
    }, kh = {};
    ui = class {
      hasPendingMicrotasks = false;
      hasPendingMacrotasks = false;
      isStable = true;
      onUnstable = new be();
      onMicrotaskEmpty = new be();
      onStable = new be();
      onError = new be();
      run(t, n, r) {
        return t.apply(n, r);
      }
      runGuarded(t, n, r) {
        return t.apply(n, r);
      }
      runOutsideAngular(t) {
        return t();
      }
      runTask(t, n, r, o) {
        return t.apply(n, r);
      }
    };
    we = class {
      _console = console;
      handleError(t) {
        this._console.error("ERROR", t);
      }
    }, Fh = new E("", { providedIn: "root", factory: () => {
      let e = M($), t = M(we);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    } });
    vr = /* @__PURE__ */ (() => {
      class e {
        nativeElement;
        constructor(n) {
          this.nativeElement = n;
        }
        static __NG_ELEMENT_ID__ = Lh;
      }
      return e;
    })();
    Gc = (function(e) {
      return e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default", e;
    })(Gc || {}), zc = /* @__PURE__ */ new Map(), jh = 0;
    Dl = "__ngContext__";
    os = new E("", { providedIn: "root", factory: () => Uh }), Uh = "ng", is = new E(""), Qt = new E("", { providedIn: "platform", factory: () => "unknown" }), ss = new E("", { providedIn: "root", factory: () => Bh().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null }), Gh = "h", zh = "b", Yc = false, Wh = new E("", { providedIn: "root", factory: () => Yc }), Kc = (function(e) {
      return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e;
    })(Kc || {}), yr = new E(""), wl = /* @__PURE__ */ new Set();
    qh = (() => {
      class e {
        impl = null;
        execute() {
          this.impl?.execute();
        }
        static \u0275prov = O({ token: e, providedIn: "root", factory: () => new e() });
      }
      return e;
    })();
    Zh = (e, t, n, r) => {
    };
    Yh = () => null;
    he = (function(e) {
      return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e;
    })(he || {}), pi = class {
      changingThisBreaksApplicationSecurity;
      constructor(t) {
        this.changingThisBreaksApplicationSecurity = t;
      }
      toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Jd})`;
      }
    };
    ou = "ng-template";
    Ze = {};
    Ir = (function(e) {
      return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e;
    })(Ir || {});
    Ip = () => null;
    Ae = (function(e) {
      return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e;
    })(Ae || {});
    Gp = Up;
    mu = [];
    Jp = B(D({}, Dt), { consumerIsAlwaysLive: true, kind: "template", consumerMarkedDirty: (e) => {
      gr(e.lView);
    }, consumerOnSignalRead() {
      this.lView[X] = this;
    } });
    eg = B(D({}, Dt), { consumerIsAlwaysLive: true, kind: "template", consumerMarkedDirty: (e) => {
      let t = He(e.lView);
      for (; t && !vu(t[I]); ) t = He(t);
      t && qi(t);
    }, consumerOnSignalRead() {
      this.lView[X] = this;
    } });
    tg = 100;
    cg = class {
      _lView;
      _cdRefInjectingView;
      notifyErrorHandler;
      _appRef = null;
      _attachedToViewContainer = false;
      get rootNodes() {
        let t = this._lView, n = t[I];
        return ir(n, t, n.firstChild, []);
      }
      constructor(t, n, r = true) {
        this._lView = t, this._cdRefInjectingView = n, this.notifyErrorHandler = r;
      }
      get context() {
        return this._lView[H];
      }
      set context(t) {
        this._lView[H] = t;
      }
      get destroyed() {
        return ht(this._lView);
      }
      destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
          let t = this._lView[ee];
          if (ze(t)) {
            let n = t[Lf], r = n ? n.indexOf(this) : -1;
            r > -1 && (Ds(t, r), Zl(n, r));
          }
          this._attachedToViewContainer = false;
        }
        vs(this._lView[I], this._lView);
      }
      onDestroy(t) {
        cc(this._lView, t);
      }
      markForCheck() {
        Is(this._cdRefInjectingView || this._lView, 4);
      }
      detach() {
        this._lView[v] &= -129;
      }
      reattach() {
        ei(this._lView), this._lView[v] |= 128;
      }
      detectChanges() {
        this._lView[v] |= 1024, _u(this._lView, this.notifyErrorHandler);
      }
      checkNoChanges() {
      }
      attachToViewContainerRef() {
        if (this._appRef) throw new w(902, false);
        this._attachedToViewContainer = true;
      }
      detachFromAppRef() {
        this._appRef = null;
        let t = tr(this._lView), n = this._lView[at];
        n !== null && !t && ms(n, this._lView), hu(this._lView[I], this._lView);
      }
      attachToAppRef(t) {
        if (this._attachedToViewContainer) throw new w(902, false);
        this._appRef = t;
        let n = tr(this._lView), r = this._lView[at];
        r !== null && !n && Cu(r, this._lView), ei(this._lView);
      }
    };
    Tb = new RegExp(`^(\\d+)*(${zh}|${Gh})*(.*)`), hg = () => null;
    pg = class {
    }, Tu = class {
    }, _i = class {
      resolveComponentFactory(t) {
        throw Error(`No component factory found for ${J(t)}.`);
      }
    }, gt = class {
      static NULL = new _i();
    }, ut = class {
    }, gg = (() => {
      class e {
        static \u0275prov = O({ token: e, providedIn: "root", factory: () => null });
      }
      return e;
    })(), Uo = {}, Ii = class {
      injector;
      parentInjector;
      constructor(t, n) {
        this.injector = t, this.parentInjector = n;
      }
      get(t, n, r) {
        r = fr(r);
        let o = this.injector.get(t, Uo, r);
        return o !== Uo || n === Uo ? o : this.parentInjector.get(t, n, r);
      }
    };
    bi = class extends gt {
      ngModule;
      constructor(t) {
        super(), this.ngModule = t;
      }
      resolveComponentFactory(t) {
        let n = $i(t);
        return new Di(n, this.ngModule);
      }
    };
    Di = class extends Tu {
      componentDef;
      ngModule;
      selector;
      componentType;
      ngContentSelectors;
      isBoundToModule;
      cachedInputs = null;
      cachedOutputs = null;
      get inputs() {
        return this.cachedInputs ??= Sg(this.componentDef.inputs), this.cachedInputs;
      }
      get outputs() {
        return this.cachedOutputs ??= Tg(this.componentDef.outputs), this.cachedOutputs;
      }
      constructor(t, n) {
        super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = hp(t.selectors), this.ngContentSelectors = t.ngContentSelectors ?? [], this.isBoundToModule = !!n;
      }
      create(t, n, r, o) {
        x(22);
        let i = y(null);
        try {
          let s = this.componentDef, a = r ? ["ng-version", "19.2.22"] : pp(this.componentDef.selectors[0]), l = ls(0, null, null, 1, 0, null, null, null, null, [a], null), c = xg(s, o || this.ngModule, t), u = Ng(c), d = u.rendererFactory.createRenderer(null, s), h = r ? yp(d, r, s.encapsulation, c) : kg(s, d), f = cs(null, l, null, 512 | iu(s), null, null, u, d, c, null, Jc(h, c, true));
          f[te] = h, Yi(f);
          let g = null;
          try {
            let m = Au(te, l, f, "#host", () => [this.componentDef], true, 0);
            h && (ru(d, h, m), Zt(h, f)), us(l, f, m), eu(l, m, f), Ru(l, m), n !== void 0 && Ag(m, this.ngContentSelectors, n), g = Ne(m.index, f), f[H] = g[H], fs(l, f, null);
          } catch (m) {
            throw g !== null && di(g), di(f), m;
          } finally {
            x(23), Ki();
          }
          return new wi(this.componentType, f);
        } finally {
          y(i);
        }
      }
    }, wi = class extends pg {
      _rootLView;
      instance;
      hostView;
      changeDetectorRef;
      componentType;
      location;
      previousInputValues = null;
      _tNode;
      constructor(t, n) {
        super(), this._rootLView = n, this._tNode = zi(n[I], te), this.location = Bc(this._tNode, n), this.instance = Ne(this._tNode.index, n)[H], this.hostView = this.changeDetectorRef = new cg(n, void 0, false), this.componentType = t;
      }
      setInput(t, n) {
        let r = this._tNode;
        if (this.previousInputValues ??= /* @__PURE__ */ new Map(), this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n)) return;
        let o = this._rootLView, i = ds(r, o[I], o, t, n);
        this.previousInputValues.set(t, n);
        let s = Ne(r.index, o);
        Is(s, 1);
      }
      get injector() {
        return new nr(this._tNode, this._rootLView);
      }
      destroy() {
        this.hostView.destroy();
      }
      onDestroy(t) {
        this.hostView.onDestroy(t);
      }
    };
    Rg = () => false;
    Ei = class {
    }, sr = class extends Ei {
      injector;
      componentFactoryResolver = new bi(this);
      instance = null;
      constructor(t) {
        super();
        let n = new Lt([...t.providers, { provide: Ei, useValue: this }, { provide: gt, useValue: this.componentFactoryResolver }], t.parent || Ui(), t.debugName, /* @__PURE__ */ new Set(["environment"]));
        this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers();
      }
      destroy() {
        this.injector.destroy();
      }
      onDestroy(t) {
        this.injector.onDestroy(t);
      }
    };
    Fg = (() => {
      class e {
        _injector;
        cachedInjectors = /* @__PURE__ */ new Map();
        constructor(n) {
          this._injector = n;
        }
        getOrCreateStandaloneInjector(n) {
          if (!n.standalone) return null;
          if (!this.cachedInjectors.has(n)) {
            let r = Kl(false, n.type), o = r.length > 0 ? Pg([r], this._injector, `Standalone[${n.type.name}]`) : null;
            this.cachedInjectors.set(n, o);
          }
          return this.cachedInjectors.get(n);
        }
        ngOnDestroy() {
          try {
            for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
          } finally {
            this.cachedInjectors.clear();
          }
        }
        static \u0275prov = O({ token: e, providedIn: "environment", factory: () => new e(T(je)) });
      }
      return e;
    })();
    zg = Wg;
    Pu = new E(""), qg = (() => {
      class e {
        static \u0275prov = O({ token: e, providedIn: "root", factory: () => new Mi() });
      }
      return e;
    })(), Mi = class {
      queuedEffectCount = 0;
      queues = /* @__PURE__ */ new Map();
      schedule(t) {
        this.enqueue(t);
      }
      remove(t) {
        let n = t.zone, r = this.queues.get(n);
        r.has(t) && (r.delete(t), this.queuedEffectCount--);
      }
      enqueue(t) {
        let n = t.zone;
        this.queues.has(n) || this.queues.set(n, /* @__PURE__ */ new Set());
        let r = this.queues.get(n);
        r.has(t) || (this.queuedEffectCount++, r.add(t));
      }
      flush() {
        for (; this.queuedEffectCount > 0; ) for (let [t, n] of this.queues) t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n));
      }
      flushQueue(t) {
        for (let n of t) t.delete(n), this.queuedEffectCount--, n.run();
      }
    };
    Qg = new E(""), Fu = (() => {
      class e {
        resolve;
        reject;
        initialized = false;
        done = false;
        donePromise = new Promise((n, r) => {
          this.resolve = n, this.reject = r;
        });
        appInits = M(Qg, { optional: true }) ?? [];
        injector = M(ke);
        constructor() {
        }
        runInitializers() {
          if (this.initialized) return;
          let n = [];
          for (let o of this.appInits) {
            let i = ec(this.injector, o);
            if (Cs(i)) n.push(i);
            else if (Zg(i)) {
              let s = new Promise((a, l) => {
                i.subscribe({ complete: a, error: l });
              });
              n.push(s);
            }
          }
          let r = () => {
            this.done = true, this.resolve();
          };
          Promise.all(n).then(() => {
            r();
          }).catch((o) => {
            this.reject(o);
          }), n.length === 0 && r(), this.initialized = true;
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })(), Yg = new E("");
    Xg = 10, Ue = (() => {
      class e {
        _runningTick = false;
        _destroyed = false;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = M(Fh);
        afterRenderManager = M(qh);
        zonelessEnabled = M(ts);
        rootEffectScheduler = M(qg);
        dirtyFlags = 0;
        tracingSnapshot = null;
        externalTestViews = /* @__PURE__ */ new Set();
        afterTick = new Ie();
        get allViews() {
          return [...this.externalTestViews.keys(), ...this._views];
        }
        get destroyed() {
          return this._destroyed;
        }
        componentTypes = [];
        components = [];
        isStable = M(mr).hasPendingTasks.pipe(kt((n) => !n));
        constructor() {
          M(yr, { optional: true });
        }
        whenStable() {
          let n;
          return new Promise((r) => {
            n = this.isStable.subscribe({ next: (o) => {
              o && r();
            } });
          }).finally(() => {
            n.unsubscribe();
          });
        }
        _injector = M(je);
        _rendererFactory = null;
        get injector() {
          return this._injector;
        }
        bootstrap(n, r) {
          return this.bootstrapImpl(n, r);
        }
        bootstrapImpl(n, r, o = ke.NULL) {
          x(10);
          let i = n instanceof Tu;
          if (!this._injector.get(Fu).done) {
            let f = "";
            throw new w(405, f);
          }
          let a;
          i ? a = n : a = this._injector.get(gt).resolveComponentFactory(n), this.componentTypes.push(a.componentType);
          let l = Jg(a) ? void 0 : this._injector.get(Ei), c = r || a.selector, u = a.create(o, [], c, l), d = u.location.nativeElement, h = u.injector.get(Pu, null);
          return h?.registerApplication(d), u.onDestroy(() => {
            this.detachView(u.hostView), Wn(this.components, u), h?.unregisterApplication(d);
          }), this._loadComponent(u), x(11, u), u;
        }
        tick() {
          this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
        }
        _tick() {
          x(12), this.tracingSnapshot !== null ? this.tracingSnapshot.run(Kc.CHANGE_DETECTION, this.tickImpl) : this.tickImpl();
        }
        tickImpl = () => {
          if (this._runningTick) throw new w(101, false);
          let n = y(null);
          try {
            this._runningTick = true, this.synchronize();
          } catch (r) {
            this.internalErrorHandler(r);
          } finally {
            this._runningTick = false, this.tracingSnapshot?.dispose(), this.tracingSnapshot = null, y(n), this.afterTick.next(), x(13);
          }
        };
        synchronize() {
          this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(ut, null, { optional: true }));
          let n = 0;
          for (; this.dirtyFlags !== 0 && n++ < Xg; ) x(14), this.synchronizeOnce(), x(15);
        }
        synchronizeOnce() {
          if (this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()), this.dirtyFlags & 7) {
            let n = !!(this.dirtyFlags & 1);
            this.dirtyFlags &= -8, this.dirtyFlags |= 8;
            for (let { _lView: r, notifyErrorHandler: o } of this.allViews) em(r, o, n, this.zonelessEnabled);
            if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23) return;
          } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
          this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews();
        }
        syncDirtyFlagsWithViews() {
          if (this.allViews.some(({ _lView: n }) => zt(n))) {
            this.dirtyFlags |= 2;
            return;
          } else this.dirtyFlags &= -8;
        }
        attachView(n) {
          let r = n;
          this._views.push(r), r.attachToAppRef(this);
        }
        detachView(n) {
          let r = n;
          Wn(this._views, r), r.detachFromAppRef();
        }
        _loadComponent(n) {
          this.attachView(n.hostView), this.tick(), this.components.push(n), this._injector.get(Yg, []).forEach((o) => o(n));
        }
        ngOnDestroy() {
          if (!this._destroyed) try {
            this._destroyListeners.forEach((n) => n()), this._views.slice().forEach((n) => n.destroy());
          } finally {
            this._destroyed = true, this._views = [], this._destroyListeners = [];
          }
        }
        onDestroy(n) {
          return this._destroyListeners.push(n), () => Wn(this._destroyListeners, n);
        }
        destroy() {
          if (this._destroyed) throw new w(406, false);
          let n = this._injector;
          n.destroy && !n.destroyed && n.destroy();
        }
        get viewCount() {
          return this._views.length;
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })();
    xi = class {
      destroy(t) {
      }
      updateValue(t, n) {
      }
      swap(t, n) {
        let r = Math.min(t, n), o = Math.max(t, n), i = this.detach(o);
        if (o - r > 1) {
          let s = this.detach(r);
          this.attach(r, i), this.attach(o, s);
        } else this.attach(r, i);
      }
      move(t, n) {
        this.attach(n, this.detach(t));
      }
    };
    lr = class {
      kvMap = /* @__PURE__ */ new Map();
      _vMap = void 0;
      has(t) {
        return this.kvMap.has(t);
      }
      delete(t) {
        if (!this.has(t)) return false;
        let n = this.kvMap.get(t);
        return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n)) : this.kvMap.delete(t), true;
      }
      get(t) {
        return this.kvMap.get(t);
      }
      set(t, n) {
        if (this.kvMap.has(t)) {
          let r = this.kvMap.get(t);
          this._vMap === void 0 && (this._vMap = /* @__PURE__ */ new Map());
          let o = this._vMap;
          for (; o.has(r); ) r = o.get(r);
          o.set(r, n);
        } else this.kvMap.set(t, n);
      }
      forEach(t) {
        for (let [n, r] of this.kvMap) if (t(r, n), this._vMap !== void 0) {
          let o = this._vMap;
          for (; o.has(r); ) r = o.get(r), t(r, n);
        }
      }
    };
    ki = class {
      lContainer;
      $implicit;
      $index;
      constructor(t, n, r) {
        this.lContainer = t, this.$implicit = n, this.$index = r;
      }
      get $count() {
        return this.lContainer.length - Q;
      }
    }, Ai = class {
      hasEmptyBlock;
      trackByFn;
      liveCollection;
      constructor(t, n, r) {
        this.hasEmptyBlock = t, this.trackByFn = n, this.liveCollection = r;
      }
    };
    Ri = class extends xi {
      lContainer;
      hostLView;
      templateTNode;
      operationsCounter = void 0;
      needsIndexUpdate = false;
      constructor(t, n, r) {
        super(), this.lContainer = t, this.hostLView = n, this.templateTNode = r;
      }
      get length() {
        return this.lContainer.length - Q;
      }
      at(t) {
        return this.getLView(t)[H].$implicit;
      }
      attach(t, n) {
        let r = n[Vt];
        this.needsIndexUpdate ||= t !== this.length, bs(this.lContainer, n, t, ps(this.templateTNode, r));
      }
      detach(t) {
        return this.needsIndexUpdate ||= t !== this.length - 1, _m(this.lContainer, t);
      }
      create(t, n) {
        let r = Es(this.lContainer, this.templateTNode.tView.ssrId), o = hs(this.hostLView, this.templateTNode, new ki(this.lContainer, n, t), { dehydratedView: r });
        return this.operationsCounter?.recordCreate(), o;
      }
      destroy(t) {
        vs(t[I], t), this.operationsCounter?.recordDestroy();
      }
      updateValue(t, n) {
        this.getLView(t)[H].$implicit = n;
      }
      reset() {
        this.needsIndexUpdate = false, this.operationsCounter?.reset();
      }
      updateIndexes() {
        if (this.needsIndexUpdate) for (let t = 0; t < this.length; t++) this.getLView(t)[H].$index = t;
      }
      getLView(t) {
        return Im(this.lContainer, t);
      }
    };
    bm = (e, t, n, r, o, i) => (Xi(true), tu(r, o, lh()));
    ur = "en-US", Dm = ur;
    Sm = (e, t, n, r, o) => (Xi(true), Jh(t[z], r));
    xm = (() => {
      class e {
        zone = M($);
        changeDetectionScheduler = M(Be);
        applicationRef = M(Ue);
        _onMicrotaskEmptySubscription;
        initialize() {
          this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({ next: () => {
            this.changeDetectionScheduler.runningTick || this.zone.run(() => {
              this.applicationRef.tick();
            });
          } }));
        }
        ngOnDestroy() {
          this._onMicrotaskEmptySubscription?.unsubscribe();
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })(), Nm = new E("", { factory: () => false });
    km = (() => {
      class e {
        subscription = new G();
        initialized = false;
        zone = M($);
        pendingTasks = M(mr);
        initialize() {
          if (this.initialized) return;
          this.initialized = true;
          let n = null;
          !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => {
            this.subscription.add(this.zone.onStable.subscribe(() => {
              $.assertNotInAngularZone(), queueMicrotask(() => {
                n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null);
              });
            }));
          }), this.subscription.add(this.zone.onUnstable.subscribe(() => {
            $.assertInAngularZone(), n ??= this.pendingTasks.add();
          }));
        }
        ngOnDestroy() {
          this.subscription.unsubscribe();
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })(), Am = (() => {
      class e {
        appRef = M(Ue);
        taskService = M(mr);
        ngZone = M($);
        zonelessEnabled = M(ts);
        tracing = M(yr, { optional: true });
        disableScheduling = M(Vc, { optional: true }) ?? false;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{ data: { __scheduler_tick__: true } }];
        subscriptions = new G();
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(or) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (M(jc, { optional: true }) ?? false);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = false;
        runningTick = false;
        pendingRenderTaskId = null;
        constructor() {
          this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })), this.disableScheduling ||= !this.zonelessEnabled && (this.ngZone instanceof ui || !this.zoneIsDefined);
        }
        notify(n) {
          if (!this.zonelessEnabled && n === 5) return;
          let r = false;
          switch (n) {
            case 0: {
              this.appRef.dirtyFlags |= 2;
              break;
            }
            case 3:
            case 2:
            case 4:
            case 5:
            case 1: {
              this.appRef.dirtyFlags |= 4;
              break;
            }
            case 6: {
              this.appRef.dirtyFlags |= 2, r = true;
              break;
            }
            case 12: {
              this.appRef.dirtyFlags |= 16, r = true;
              break;
            }
            case 13: {
              this.appRef.dirtyFlags |= 2, r = true;
              break;
            }
            case 11: {
              r = true;
              break;
            }
            default:
              this.appRef.dirtyFlags |= 8;
          }
          if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null, !this.shouldScheduleTick(r)) return;
          let o = this.useMicrotaskScheduler ? _l : Hc;
          this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick()));
        }
        shouldScheduleTick(n) {
          return !(this.disableScheduling && !n || this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(or + this.angularZoneId));
        }
        tick() {
          if (this.runningTick || this.appRef.destroyed) return;
          if (this.appRef.dirtyFlags === 0) {
            this.cleanup();
            return;
          }
          !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
          let n = this.taskService.add();
          try {
            this.ngZone.run(() => {
              this.runningTick = true, this.appRef._tick();
            }, void 0, this.schedulerTickApplyArgs);
          } catch (r) {
            throw this.taskService.remove(n), r;
          } finally {
            this.cleanup();
          }
          this.useMicrotaskScheduler = true, _l(() => {
            this.useMicrotaskScheduler = false, this.taskService.remove(n);
          });
        }
        ngOnDestroy() {
          this.subscriptions.unsubscribe(), this.cleanup();
        }
        cleanup() {
          if (this.runningTick = false, this.cancelScheduledCallback?.(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
            let n = this.pendingRenderTaskId;
            this.pendingRenderTaskId = null, this.taskService.remove(n);
          }
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })();
    Bu = new E("", { providedIn: "root", factory: () => M(Bu, _.Optional | _.SkipSelf) || Rm() }), Pi = new E(""), Om = new E("");
    qn = null;
    Hl = class {
      [le];
      constructor(t) {
        this[le] = t;
      }
      destroy() {
        this[le].destroy();
      }
    };
  });
  var ye;
  var Gu = p(() => {
    "use strict";
    ne();
    ye = new E("");
  });
  function en() {
    return zu;
  }
  function Ss(e) {
    zu ??= e;
  }
  var zu;
  var Xt;
  var Wu = p(() => {
    "use strict";
    zu = null;
    Xt = class {
    };
  });
  function Ts(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
      let r = n.indexOf("="), [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
      if (o.trim() === t) return decodeURIComponent(i);
    }
    return null;
  }
  function Tr(e) {
    return e === qu;
  }
  var xs;
  var qu;
  var tn;
  var Zu = p(() => {
    "use strict";
    xs = "browser", qu = "server";
    tn = class {
    };
  });
  var Ns = p(() => {
    "use strict";
    Zu();
    Gu();
    Wu();
  });
  function Qu(e) {
    for (let t of e) t.remove();
  }
  function Yu(e, t) {
    let n = t.createElement("style");
    return n.textContent = e, n;
  }
  function $m(e, t, n, r) {
    let o = e.head?.querySelectorAll(`style[${xr}="${t}"],link[${xr}="${t}"]`);
    if (o) for (let i of o) i.removeAttribute(xr), i instanceof HTMLLinkElement ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), { usage: 0, elements: [i] }) : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] });
  }
  function As(e, t) {
    let n = t.createElement("link");
    return n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n;
  }
  function Wm(e) {
    return Um.replace(Fs, e);
  }
  function qm(e) {
    return Bm.replace(Fs, e);
  }
  function Xu(e, t) {
    return t.map((n) => n.replace(Fs, e));
  }
  function Ku(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0;
  }
  var kr;
  var Os;
  var nn;
  var xr;
  var Ps;
  var ks;
  var Fs;
  var Ju;
  var Bm;
  var Um;
  var Gm;
  var zm;
  var Ls;
  var rn;
  var Rs;
  var on;
  var Nr;
  var ed = p(() => {
    "use strict";
    Ns();
    ne();
    ne();
    kr = new E(""), Os = (() => {
      class e {
        _zone;
        _plugins;
        _eventNameToPlugin = /* @__PURE__ */ new Map();
        constructor(n, r) {
          this._zone = r, n.forEach((o) => {
            o.manager = this;
          }), this._plugins = n.slice().reverse();
        }
        addEventListener(n, r, o, i) {
          return this._findPluginFor(r).addEventListener(n, r, o, i);
        }
        getZone() {
          return this._zone;
        }
        _findPluginFor(n) {
          let r = this._eventNameToPlugin.get(n);
          if (r) return r;
          if (r = this._plugins.find((i) => i.supports(n)), !r) throw new w(5101, false);
          return this._eventNameToPlugin.set(n, r), r;
        }
        static \u0275fac = function(r) {
          return new (r || e)(T(kr), T($));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), nn = class {
      _doc;
      constructor(t) {
        this._doc = t;
      }
      manager;
    }, xr = "ng-app-id";
    Ps = (() => {
      class e {
        doc;
        appId;
        nonce;
        inline = /* @__PURE__ */ new Map();
        external = /* @__PURE__ */ new Map();
        hosts = /* @__PURE__ */ new Set();
        isServer;
        constructor(n, r, o, i = {}) {
          this.doc = n, this.appId = r, this.nonce = o, this.isServer = Tr(i), $m(n, r, this.inline, this.external), this.hosts.add(n.head);
        }
        addStyles(n, r) {
          for (let o of n) this.addUsage(o, this.inline, Yu);
          r?.forEach((o) => this.addUsage(o, this.external, As));
        }
        removeStyles(n, r) {
          for (let o of n) this.removeUsage(o, this.inline);
          r?.forEach((o) => this.removeUsage(o, this.external));
        }
        addUsage(n, r, o) {
          let i = r.get(n);
          i ? i.usage++ : r.set(n, { usage: 1, elements: [...this.hosts].map((s) => this.addElement(s, o(n, this.doc))) });
        }
        removeUsage(n, r) {
          let o = r.get(n);
          o && (o.usage--, o.usage <= 0 && (Qu(o.elements), r.delete(n)));
        }
        ngOnDestroy() {
          for (let [, { elements: n }] of [...this.inline, ...this.external]) Qu(n);
          this.hosts.clear();
        }
        addHost(n) {
          this.hosts.add(n);
          for (let [r, { elements: o }] of this.inline) o.push(this.addElement(n, Yu(r, this.doc)));
          for (let [r, { elements: o }] of this.external) o.push(this.addElement(n, As(r, this.doc)));
        }
        removeHost(n) {
          this.hosts.delete(n);
        }
        addElement(n, r) {
          return this.nonce && r.setAttribute("nonce", this.nonce), this.isServer && r.setAttribute(xr, this.appId), n.appendChild(r);
        }
        static \u0275fac = function(r) {
          return new (r || e)(T(ye), T(os), T(ss, 8), T(Qt));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), ks = { svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/", math: "http://www.w3.org/1998/Math/MathML" }, Fs = /%COMP%/g, Ju = "%COMP%", Bm = `_nghost-${Ju}`, Um = `_ngcontent-${Ju}`, Gm = true, zm = new E("", { providedIn: "root", factory: () => Gm });
    Ls = (() => {
      class e {
        eventManager;
        sharedStylesHost;
        appId;
        removeStylesOnCompDestroy;
        doc;
        platformId;
        ngZone;
        nonce;
        tracingService;
        rendererByCompId = /* @__PURE__ */ new Map();
        defaultRenderer;
        platformIsServer;
        constructor(n, r, o, i, s, a, l, c = null, u = null) {
          this.eventManager = n, this.sharedStylesHost = r, this.appId = o, this.removeStylesOnCompDestroy = i, this.doc = s, this.platformId = a, this.ngZone = l, this.nonce = c, this.tracingService = u, this.platformIsServer = Tr(a), this.defaultRenderer = new rn(n, s, l, this.platformIsServer, this.tracingService);
        }
        createRenderer(n, r) {
          if (!n || !r) return this.defaultRenderer;
          this.platformIsServer && r.encapsulation === he.ShadowDom && (r = B(D({}, r), { encapsulation: he.Emulated }));
          let o = this.getOrCreateRenderer(n, r);
          return o instanceof Nr ? o.applyToHost(n) : o instanceof on && o.applyStyles(), o;
        }
        getOrCreateRenderer(n, r) {
          let o = this.rendererByCompId, i = o.get(r.id);
          if (!i) {
            let s = this.doc, a = this.ngZone, l = this.eventManager, c = this.sharedStylesHost, u = this.removeStylesOnCompDestroy, d = this.platformIsServer, h = this.tracingService;
            switch (r.encapsulation) {
              case he.Emulated:
                i = new Nr(l, c, r, this.appId, u, s, a, d, h);
                break;
              case he.ShadowDom:
                return new Rs(l, c, n, r, s, a, this.nonce, d, h);
              default:
                i = new on(l, c, r, u, s, a, d, h);
                break;
            }
            o.set(r.id, i);
          }
          return i;
        }
        ngOnDestroy() {
          this.rendererByCompId.clear();
        }
        componentReplaced(n) {
          this.rendererByCompId.delete(n);
        }
        static \u0275fac = function(r) {
          return new (r || e)(T(Os), T(Ps), T(os), T(zm), T(ye), T(Qt), T($), T(ss), T(yr, 8));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), rn = class {
      eventManager;
      doc;
      ngZone;
      platformIsServer;
      tracingService;
      data = /* @__PURE__ */ Object.create(null);
      throwOnSyntheticProps = true;
      constructor(t, n, r, o, i) {
        this.eventManager = t, this.doc = n, this.ngZone = r, this.platformIsServer = o, this.tracingService = i;
      }
      destroy() {
      }
      destroyNode = null;
      createElement(t, n) {
        return n ? this.doc.createElementNS(ks[n] || n, t) : this.doc.createElement(t);
      }
      createComment(t) {
        return this.doc.createComment(t);
      }
      createText(t) {
        return this.doc.createTextNode(t);
      }
      appendChild(t, n) {
        (Ku(t) ? t.content : t).appendChild(n);
      }
      insertBefore(t, n, r) {
        t && (Ku(t) ? t.content : t).insertBefore(n, r);
      }
      removeChild(t, n) {
        n.remove();
      }
      selectRootElement(t, n) {
        let r = typeof t == "string" ? this.doc.querySelector(t) : t;
        if (!r) throw new w(-5104, false);
        return n || (r.textContent = ""), r;
      }
      parentNode(t) {
        return t.parentNode;
      }
      nextSibling(t) {
        return t.nextSibling;
      }
      setAttribute(t, n, r, o) {
        if (o) {
          n = o + ":" + n;
          let i = ks[o];
          i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
        } else t.setAttribute(n, r);
      }
      removeAttribute(t, n, r) {
        if (r) {
          let o = ks[r];
          o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
        } else t.removeAttribute(n);
      }
      addClass(t, n) {
        t.classList.add(n);
      }
      removeClass(t, n) {
        t.classList.remove(n);
      }
      setStyle(t, n, r, o) {
        o & (Ae.DashCase | Ae.Important) ? t.style.setProperty(n, r, o & Ae.Important ? "important" : "") : t.style[n] = r;
      }
      removeStyle(t, n, r) {
        r & Ae.DashCase ? t.style.removeProperty(n) : t.style[n] = "";
      }
      setProperty(t, n, r) {
        t != null && (t[n] = r);
      }
      setValue(t, n) {
        t.nodeValue = n;
      }
      listen(t, n, r, o) {
        if (typeof t == "string" && (t = en().getGlobalEventTarget(this.doc, t), !t)) throw new w(5102, false);
        let i = this.decoratePreventDefault(r);
        return this.tracingService?.wrapEventListener && (i = this.tracingService.wrapEventListener(t, n, i)), this.eventManager.addEventListener(t, n, i, o);
      }
      decoratePreventDefault(t) {
        return (n) => {
          if (n === "__ngUnwrap__") return t;
          (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) === false && n.preventDefault();
        };
      }
    };
    Rs = class extends rn {
      sharedStylesHost;
      hostEl;
      shadowRoot;
      constructor(t, n, r, o, i, s, a, l, c) {
        super(t, i, s, l, c), this.sharedStylesHost = n, this.hostEl = r, this.shadowRoot = r.attachShadow({ mode: "open" }), this.sharedStylesHost.addHost(this.shadowRoot);
        let u = o.styles;
        u = Xu(o.id, u);
        for (let h of u) {
          let f = document.createElement("style");
          a && f.setAttribute("nonce", a), f.textContent = h, this.shadowRoot.appendChild(f);
        }
        let d = o.getExternalStyles?.();
        if (d) for (let h of d) {
          let f = As(h, i);
          a && f.setAttribute("nonce", a), this.shadowRoot.appendChild(f);
        }
      }
      nodeOrShadowRoot(t) {
        return t === this.hostEl ? this.shadowRoot : t;
      }
      appendChild(t, n) {
        return super.appendChild(this.nodeOrShadowRoot(t), n);
      }
      insertBefore(t, n, r) {
        return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
      }
      removeChild(t, n) {
        return super.removeChild(null, n);
      }
      parentNode(t) {
        return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
      }
      destroy() {
        this.sharedStylesHost.removeHost(this.shadowRoot);
      }
    }, on = class extends rn {
      sharedStylesHost;
      removeStylesOnCompDestroy;
      styles;
      styleUrls;
      constructor(t, n, r, o, i, s, a, l, c) {
        super(t, i, s, a, l), this.sharedStylesHost = n, this.removeStylesOnCompDestroy = o;
        let u = r.styles;
        this.styles = c ? Xu(c, u) : u, this.styleUrls = r.getExternalStyles?.(c);
      }
      applyStyles() {
        this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
      }
      destroy() {
        this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
      }
    }, Nr = class extends on {
      contentAttr;
      hostAttr;
      constructor(t, n, r, o, i, s, a, l, c) {
        let u = o + "-" + r.id;
        super(t, n, r, i, s, a, l, c, u), this.contentAttr = Wm(u), this.hostAttr = qm(u);
      }
      applyToHost(t) {
        this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
      }
      createElement(t, n) {
        let r = super.createElement(t, n);
        return super.setAttribute(r, this.contentAttr, ""), r;
      }
    };
  });
  function Zm() {
    return sn = sn || document.head.querySelector("base"), sn ? sn.getAttribute("href") : null;
  }
  function Qm(e) {
    return new URL(e, document.baseURI).pathname;
  }
  function Vs(e) {
    return Uu(Xm(e));
  }
  function Xm(e) {
    return { appProviders: [...ov, ...e?.providers ?? []], platformProviders: rv };
  }
  function ev() {
    Ar.makeCurrent();
  }
  function tv() {
    return new we();
  }
  function nv() {
    return Qc(document), document;
  }
  var Ar;
  var sn;
  var Ym;
  var nd;
  var td;
  var Km;
  var Jm;
  var rd;
  var rv;
  var ov;
  var od = p(() => {
    "use strict";
    Ns();
    ne();
    ne();
    ed();
    Ar = class e extends Xt {
      supportsDOMEvents = true;
      static makeCurrent() {
        Ss(new e());
      }
      onAndCancel(t, n, r, o) {
        return t.addEventListener(n, r, o), () => {
          t.removeEventListener(n, r, o);
        };
      }
      dispatchEvent(t, n) {
        t.dispatchEvent(n);
      }
      remove(t) {
        t.remove();
      }
      createElement(t, n) {
        return n = n || this.getDefaultDocument(), n.createElement(t);
      }
      createHtmlDocument() {
        return document.implementation.createHTMLDocument("fakeTitle");
      }
      getDefaultDocument() {
        return document;
      }
      isElementNode(t) {
        return t.nodeType === Node.ELEMENT_NODE;
      }
      isShadowRoot(t) {
        return t instanceof DocumentFragment;
      }
      getGlobalEventTarget(t, n) {
        return n === "window" ? window : n === "document" ? t : n === "body" ? t.body : null;
      }
      getBaseHref(t) {
        let n = Zm();
        return n == null ? null : Qm(n);
      }
      resetBaseElement() {
        sn = null;
      }
      getUserAgent() {
        return window.navigator.userAgent;
      }
      getCookie(t) {
        return Ts(document.cookie, t);
      }
    }, sn = null;
    Ym = (() => {
      class e {
        build() {
          return new XMLHttpRequest();
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), nd = (() => {
      class e extends nn {
        constructor(n) {
          super(n);
        }
        supports(n) {
          return true;
        }
        addEventListener(n, r, o, i) {
          return n.addEventListener(r, o, i), () => this.removeEventListener(n, r, o, i);
        }
        removeEventListener(n, r, o, i) {
          return n.removeEventListener(r, o, i);
        }
        static \u0275fac = function(r) {
          return new (r || e)(T(ye));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), td = ["alt", "control", "meta", "shift"], Km = { "\b": "Backspace", "	": "Tab", "\x7F": "Delete", "\x1B": "Escape", Del: "Delete", Esc: "Escape", Left: "ArrowLeft", Right: "ArrowRight", Up: "ArrowUp", Down: "ArrowDown", Menu: "ContextMenu", Scroll: "ScrollLock", Win: "OS" }, Jm = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey }, rd = (() => {
      class e extends nn {
        constructor(n) {
          super(n);
        }
        supports(n) {
          return e.parseEventName(n) != null;
        }
        addEventListener(n, r, o, i) {
          let s = e.parseEventName(r), a = e.eventCallback(s.fullKey, o, this.manager.getZone());
          return this.manager.getZone().runOutsideAngular(() => en().onAndCancel(n, s.domEventName, a, i));
        }
        static parseEventName(n) {
          let r = n.toLowerCase().split("."), o = r.shift();
          if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
          let i = e._normalizeKey(r.pop()), s = "", a = r.indexOf("code");
          if (a > -1 && (r.splice(a, 1), s = "code."), td.forEach((c) => {
            let u = r.indexOf(c);
            u > -1 && (r.splice(u, 1), s += c + ".");
          }), s += i, r.length != 0 || i.length === 0) return null;
          let l = {};
          return l.domEventName = o, l.fullKey = s, l;
        }
        static matchEventFullKeyCode(n, r) {
          let o = Km[n.key] || n.key, i = "";
          return r.indexOf("code.") > -1 && (o = n.code, i = "code."), o == null || !o ? false : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), td.forEach((s) => {
            if (s !== o) {
              let a = Jm[s];
              a(n) && (i += s + ".");
            }
          }), i += o, i === r);
        }
        static eventCallback(n, r, o) {
          return (i) => {
            e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
          };
        }
        static _normalizeKey(n) {
          return n === "esc" ? "escape" : n;
        }
        static \u0275fac = function(r) {
          return new (r || e)(T(ye));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })();
    rv = [{ provide: Qt, useValue: xs }, { provide: is, useValue: ev, multi: true }, { provide: ye, useFactory: nv }], ov = [{ provide: hr, useValue: "root" }, { provide: we, useFactory: tv }, { provide: kr, useClass: nd, multi: true, deps: [ye] }, { provide: kr, useClass: rd, multi: true, deps: [ye] }, Ls, Ps, Os, { provide: ut, useExisting: Ls }, { provide: tn, useClass: Ym }, []];
  });
  var id = p(() => {
    "use strict";
    od();
  });
  function av(e) {
    return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
  }
  function lv(e) {
    return !!e && e.nodeType === Node.ELEMENT_NODE;
  }
  function cv(e, t) {
    if (!js) {
      let n = Element.prototype;
      js = n.matches || n.matchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector || n.webkitMatchesSelector;
    }
    return e.nodeType === Node.ELEMENT_NODE ? js.call(e, t) : false;
  }
  function uv(e) {
    let t = {};
    return e.forEach(({ propName: n, templateName: r, transform: o }) => {
      t[av(r)] = [n, o];
    }), t;
  }
  function dv(e, t) {
    return t.get(gt).resolveComponentFactory(e).inputs;
  }
  function fv(e, t) {
    let n = e.childNodes, r = t.map(() => []), o = -1;
    t.some((i, s) => i === "*" ? (o = s, true) : false);
    for (let i = 0, s = n.length; i < s; ++i) {
      let a = n[i], l = hv(a, t, o);
      l !== -1 && r[l].push(a);
    }
    return r;
  }
  function hv(e, t, n) {
    let r = n;
    return lv(e) && t.some((o, i) => o !== "*" && cv(e, o) ? (r = i, true) : false), r;
  }
  function sd(e, t) {
    let n = dv(e, t.injector), r = t.strategyFactory || new Hs(e, t.injector), o = uv(n);
    class i extends Bs {
      injector;
      static observedAttributes = Object.keys(o);
      get ngElementStrategy() {
        if (!this._ngElementStrategy) {
          let a = this._ngElementStrategy = r.create(this.injector || t.injector);
          n.forEach(({ propName: l, transform: c }) => {
            if (!this.hasOwnProperty(l)) return;
            let u = this[l];
            delete this[l], a.setInputValue(l, u, c);
          });
        }
        return this._ngElementStrategy;
      }
      _ngElementStrategy;
      constructor(a) {
        super(), this.injector = a;
      }
      attributeChangedCallback(a, l, c, u) {
        let [d, h] = o[a];
        this.ngElementStrategy.setInputValue(d, c, h);
      }
      connectedCallback() {
        let a = false;
        this.ngElementStrategy.events && (this.subscribeToEvents(), a = true), this.ngElementStrategy.connect(this), a || this.subscribeToEvents();
      }
      disconnectedCallback() {
        this._ngElementStrategy && this._ngElementStrategy.disconnect(), this.ngElementEventsSubscription && (this.ngElementEventsSubscription.unsubscribe(), this.ngElementEventsSubscription = null);
      }
      subscribeToEvents() {
        this.ngElementEventsSubscription = this.ngElementStrategy.events.subscribe((a) => {
          let l = new CustomEvent(a.name, { detail: a.value });
          this.dispatchEvent(l);
        });
      }
    }
    return n.forEach(({ propName: s, transform: a }) => {
      Object.defineProperty(i.prototype, s, { get() {
        return this.ngElementStrategy.getInputValue(s);
      }, set(l) {
        this.ngElementStrategy.setInputValue(s, l, a);
      }, configurable: true, enumerable: true });
    }), i;
  }
  var sv;
  var js;
  var pv;
  var Hs;
  var $s;
  var Bs;
  var ad = p(() => {
    "use strict";
    ne();
    Oo();
    Po();
    sv = { schedule(e, t) {
      let n = setTimeout(e, t);
      return () => clearTimeout(n);
    } };
    pv = 10, Hs = class {
      componentFactory;
      inputMap = /* @__PURE__ */ new Map();
      constructor(t, n) {
        this.componentFactory = n.get(gt).resolveComponentFactory(t);
        for (let r of this.componentFactory.inputs) this.inputMap.set(r.propName, r.templateName);
      }
      create(t) {
        return new $s(this.componentFactory, t, this.inputMap);
      }
    }, $s = class {
      componentFactory;
      injector;
      inputMap;
      eventEmitters = new xt(1);
      events = this.eventEmitters.pipe(Ro((t) => Ao(...t)));
      componentRef = null;
      scheduledDestroyFn = null;
      initialInputValues = /* @__PURE__ */ new Map();
      ngZone;
      elementZone;
      appRef;
      cdScheduler;
      constructor(t, n, r) {
        this.componentFactory = t, this.injector = n, this.inputMap = r, this.ngZone = this.injector.get($), this.appRef = this.injector.get(Ue), this.cdScheduler = n.get(Be), this.elementZone = typeof Zone > "u" ? null : this.ngZone.run(() => Zone.current);
      }
      connect(t) {
        this.runInZone(() => {
          if (this.scheduledDestroyFn !== null) {
            this.scheduledDestroyFn(), this.scheduledDestroyFn = null;
            return;
          }
          this.componentRef === null && this.initializeComponent(t);
        });
      }
      disconnect() {
        this.runInZone(() => {
          this.componentRef === null || this.scheduledDestroyFn !== null || (this.scheduledDestroyFn = sv.schedule(() => {
            this.componentRef !== null && (this.componentRef.destroy(), this.componentRef = null);
          }, pv));
        });
      }
      getInputValue(t) {
        return this.runInZone(() => this.componentRef === null ? this.initialInputValues.get(t) : this.componentRef.instance[t]);
      }
      setInputValue(t, n) {
        if (this.componentRef === null) {
          this.initialInputValues.set(t, n);
          return;
        }
        this.runInZone(() => {
          this.componentRef.setInput(this.inputMap.get(t) ?? t, n), Mu(this.componentRef.hostView) && (Su(this.componentRef.changeDetectorRef), this.cdScheduler.notify(6));
        });
      }
      initializeComponent(t) {
        let n = ke.create({ providers: [], parent: this.injector }), r = fv(t, this.componentFactory.ngContentSelectors);
        this.componentRef = this.componentFactory.create(n, r, t), this.initializeInputs(), this.initializeOutputs(this.componentRef), this.appRef.attachView(this.componentRef.hostView), this.componentRef.hostView.detectChanges();
      }
      initializeInputs() {
        for (let [t, n] of this.initialInputValues) this.setInputValue(t, n);
        this.initialInputValues.clear();
      }
      initializeOutputs(t) {
        let n = this.componentFactory.outputs.map(({ propName: r, templateName: o }) => {
          let i = t.instance[r];
          return new R((s) => {
            let a = i.subscribe((l) => s.next({ name: o, value: l }));
            return () => a.unsubscribe();
          });
        });
        this.eventEmitters.next(n);
      }
      runInZone(t) {
        return this.elementZone && Zone.current !== this.elementZone ? this.ngZone.run(t) : t();
      }
    }, Bs = class extends HTMLElement {
      ngElementEventsSubscription = null;
    };
  });
  var gv;
  var XD;
  var mv;
  var ld;
  var vv;
  var cd;
  var ud = p(() => {
    "use strict";
    ne();
    ne();
    gv = { "[class.ng-untouched]": "isUntouched", "[class.ng-touched]": "isTouched", "[class.ng-pristine]": "isPristine", "[class.ng-dirty]": "isDirty", "[class.ng-valid]": "isValid", "[class.ng-invalid]": "isInvalid", "[class.ng-pending]": "isPending" }, XD = B(D({}, gv), { "[class.ng-submitted]": "isSubmitted" }), mv = new E("", { providedIn: "root", factory: () => ld }), ld = "always", vv = (() => {
      class e {
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275mod = Dr({ type: e });
        static \u0275inj = dr({});
      }
      return e;
    })(), cd = (() => {
      class e {
        static withConfig(n) {
          return { ngModule: e, providers: [{ provide: mv, useValue: n.callSetDisabledState ?? ld }] };
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275mod = Dr({ type: e });
        static \u0275inj = dr({ imports: [vv] });
      }
      return e;
    })();
  });
  var S;
  var Us = p(() => {
    "use strict";
    S = { taskDuration: 300, roundDuration: null, sessionId: null, autoStart: false, startDifficulty: 1, minDifficulty: 1, maxDifficulty: 3, adaptiveDifficulty: true, correctStreakForLevelUp: 4, wrongStreakForLevelDown: 4, numberOfOptions: 8, invoiceOrder: "random", randomSeed: null, maxSubmissions: null, maxCorrectSubmissions: null, showTimer: true, showFeedback: true, showDifficulty: false, currency: "EUR", completedMessage: "You have completed all invoice matching tasks.", logLevel: "basic", mutedEvents: [] };
  });
  function yv(e) {
    let t = 2166136261;
    for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
    return t >>> 0;
  }
  function _v(e) {
    let t = e;
    return function() {
      t |= 0, t = t + 1831565813 | 0;
      let n = Math.imul(t ^ t >>> 15, 1 | t);
      return n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n, ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }
  function fd(e, t, n) {
    return e + Math.floor(n() * (t - e + 1));
  }
  function Iv(e, t) {
    let n = [...e];
    for (let r = n.length - 1; r > 0; r--) {
      let o = Math.floor(t() * (r + 1));
      [n[r], n[o]] = [n[o], n[r]];
    }
    return n;
  }
  function Rr(e) {
    let { oneDigit: t, twoDigit: n } = zs[e];
    return t + n;
  }
  function bv(e) {
    let t = Math.max(...e), n = 0, r = 0;
    for (let o = 1; o <= t; o *= 10) {
      let i = r;
      for (let s of e) i += Math.floor(s / o) % 10;
      r = Math.floor(i / 10), n += r;
    }
    return n;
  }
  function wv(e, t) {
    let { oneDigit: n, twoDigit: r, carry: o } = zs[e], i = [...Array(r).fill(an), ...Array(n).fill(ln)];
    for (let s = 0; s < Dv; s++) {
      let a = i.map((l) => fd(l.min, l.max, t));
      if (!(new Set(a).size < a.length) && bv(a) === o) return a;
    }
    return null;
  }
  function dd(e, t, n) {
    let r = e.length;
    for (let o = 0; o < 1 << r; o++) {
      let i = t;
      for (let s = 0; s < r && !(o & 1 << s && (i += e[s], i > n)); s++) ;
      if (i === n) return true;
    }
    return false;
  }
  function Ev(e, t) {
    let { oneDigit: n } = zs[e], r = Rr(e), o = Math.round(t * n / r) - n, i = ln.max - ln.min + 1 - n;
    return Math.max(0, Math.min(o, t - r, i));
  }
  function Cv(e, t, n, r, o) {
    for (let i = Ev(n, r); i >= 0; i--) {
      let s = Mv(e, t, r, i, o);
      if (s) return s;
    }
    return null;
  }
  function Mv(e, t, n, r, o) {
    let i = n - e.length, s = [];
    for (let l = 0; l < r; l++) {
      let c = [...e, ...s], u = [];
      for (let d = ln.min; d <= ln.max; d++) !c.includes(d) && !dd(c, d, t) && u.push(d);
      if (u.length === 0) break;
      s.push(u[Math.floor(o() * u.length)]);
    }
    let a = Math.min(an.max, t - 1);
    if (s.length < i && a < an.min) return null;
    for (; s.length < i; ) {
      let l = 0, c = false;
      for (; l < 1e3; ) {
        let u = fd(an.min, a, o), d = [...e, ...s];
        if (!d.includes(u) && !dd(d, u, t)) {
          s.push(u), c = true;
          break;
        }
        l++;
      }
      if (!c) return null;
    }
    return s;
  }
  function hd(e, t, n) {
    let r = Rr(e), o = Math.max(t, r), i = false;
    for (let s = 0; s < 100; s++) {
      let a = wv(e, n);
      if (!a) continue;
      let l = a.reduce((g, m) => g + m, 0), c = Cv(a, l, e, o, n);
      if (!c) {
        l > an.max && (i = true);
        continue;
      }
      let u = [...a.map((g) => ({ amount: g, isCorrect: true })), ...c.map((g) => ({ amount: g, isCorrect: false }))], d = Iv(u, n), h = d.map((g, m) => ({ id: `inv-${m + 1}`, amount: g.amount })), f = d.map((g, m) => g.isCorrect ? `inv-${m + 1}` : null).filter((g) => g !== null);
      return { round: { targetAmount: l, visibleInvoices: h, correctInvoiceIds: f }, hadRetries: i };
    }
    throw new Gs();
  }
  function pd(e, t) {
    return e === "fixed" ? _v(yv(t ?? "0")) : Math.random;
  }
  var ln;
  var an;
  var zs;
  var Dv;
  var Gs;
  var Ws = p(() => {
    "use strict";
    ln = { min: 1, max: 9 }, an = { min: 10, max: 99 }, zs = { 1: { oneDigit: 1, twoDigit: 1, carry: 0 }, 2: { oneDigit: 0, twoDigit: 2, carry: 1 }, 3: { oneDigit: 2, twoDigit: 1, carry: 1 }, 4: { oneDigit: 1, twoDigit: 2, carry: 2 }, 5: { oneDigit: 0, twoDigit: 3, carry: 3 }, 6: { oneDigit: 2, twoDigit: 2, carry: 3 } };
    Dv = 1e3;
    Gs = class extends Error {
      constructor() {
        super("Round generation failed after 100 attempts \u2014 emit error + end task");
      }
    };
  });
  function yd(e) {
    return e.replace(/[A-Z]/g, (t) => "-" + t.toLowerCase());
  }
  function Qe(e) {
    if (typeof e == "number") return Number.isFinite(e) && Number.isInteger(e) ? e : void 0;
    if (typeof e == "string") {
      let t = e.trim();
      if (t === "") return;
      let n = Number(t);
      return Number.isFinite(n) && Number.isInteger(n) ? n : void 0;
    }
  }
  function xv(e) {
    if (typeof e == "boolean") return e;
    if (typeof e == "string") {
      let t = e.trim().toLowerCase();
      if (t === "" || t === "true") return true;
      if (t === "false") return false;
    }
  }
  function Fr(e, t, n) {
    return Math.min(n, Math.max(t, e));
  }
  function Nv(e) {
    if (e === null) return { value: null };
    let t = Qe(e);
    return t === void 0 ? { value: S.taskDuration, problem: k("invalid_type", e, S.taskDuration, "taskDuration must be an integer number of seconds") } : t < 0 ? { value: 0, problem: k("out_of_range", e, 0, "taskDuration cannot be negative; using 0 (no time limit)") } : { value: t };
  }
  function kv(e) {
    if (e === null) return { value: null };
    let t = Qe(e);
    return t === void 0 ? { value: S.roundDuration, problem: k("invalid_type", e, S.roundDuration, "roundDuration must be an integer number of seconds") } : t < 0 ? { value: 0, problem: k("out_of_range", e, 0, "roundDuration cannot be negative; using 0 (no per-round limit)") } : { value: t };
  }
  function gd(e, t) {
    return e == null ? { value: null } : typeof e == "string" ? { value: e.trim() === "" ? null : e } : { value: null, problem: k("invalid_type", e, null, `${t} must be a string or null`) };
  }
  function cn(e, t, n) {
    let r = xv(e);
    return r === void 0 ? { value: n, problem: k("invalid_type", e, n, `${t} must be a boolean`) } : { value: r };
  }
  function qs(e, t, n) {
    let r = Qe(e);
    if (r === void 0) return { value: n, problem: k("invalid_type", e, n, `${t} must be an integer in [1, 6]`) };
    if (r < 1 || r > 6) {
      let o = Fr(r, 1, 6);
      return { value: o, problem: k("out_of_range", e, o, `${t} must be in [1, 6]`) };
    }
    return { value: r };
  }
  function _d(e, t, n) {
    let r = Qe(e);
    if (r === void 0) return { value: null, problem: k("invalid_type", e, null, "setDifficulty(level) requires an integer") };
    if (r < t || r > n) {
      let o = Fr(r, t, n);
      return { value: o, problem: k("out_of_range", e, o, `difficulty must be in [${t}, ${n}]`) };
    }
    return { value: r };
  }
  function md(e, t, n) {
    let r = Qe(e);
    return r === void 0 ? { value: n, problem: k("invalid_type", e, n, `${t} must be an integer >= 1`) } : r < 1 ? { value: 1, problem: k("out_of_range", e, 1, `${t} must be >= 1`) } : { value: r };
  }
  function Av(e) {
    let t = Qe(e);
    if (t === void 0) return { value: S.numberOfOptions, problem: k("invalid_type", e, S.numberOfOptions, "numberOfOptions must be an integer in [3, 12]") };
    if (t < 3 || t > 12) {
      let n = Fr(t, 3, 12);
      return { value: n, problem: k("out_of_range", e, n, "numberOfOptions must be in [3, 12]") };
    }
    return { value: t };
  }
  function Rv(e) {
    return e === "fixed" || e === "random" ? { value: e } : { value: S.invoiceOrder, problem: k("invalid_enum", e, S.invoiceOrder, 'invoiceOrder must be "fixed" or "random"') };
  }
  function Ov(e) {
    return e === "EUR" || e === "GBP" || e === "USD" ? { value: e } : { value: S.currency, problem: k("invalid_enum", e, S.currency, 'currency must be "EUR", "GBP" or "USD"') };
  }
  function vd(e, t) {
    if (e == null) return { value: null };
    let n = Qe(e);
    return n === void 0 ? { value: null, problem: k("invalid_type", e, null, `${t} must be a positive integer or null`) } : n < 1 ? { value: 1, problem: k("out_of_range", e, 1, `${t} must be >= 1; use null to disable`) } : { value: n };
  }
  function Pv(e) {
    return typeof e == "string" ? { value: e } : { value: S.completedMessage, problem: k("invalid_type", e, S.completedMessage, "completedMessage must be a string") };
  }
  function Fv(e) {
    return e === "basic" || e === "detailed" || e === "debug" ? { value: e } : { value: S.logLevel, problem: k("invalid_enum", e, S.logLevel, 'logLevel must be "basic", "detailed" or "debug"') };
  }
  function Lv(e) {
    if (e == null) return { value: [] };
    let t;
    if (Array.isArray(e)) try {
      t = [...e];
    } catch {
      return { value: [], problem: k("invalid_type", e, [], "mutedEvents array could not be read (its iterator or an element accessor threw)") };
    }
    else if (typeof e == "string") t = e.split(",").map((i) => i.trim()).filter((i) => i !== "");
    else return { value: [], problem: k("invalid_type", e, [], "mutedEvents must be an array of event-type names (or a comma-separated string)") };
    let n = [], r = [], o = false;
    for (let i of t) {
      if (typeof i != "string") {
        o = true;
        continue;
      }
      let s = i.trim();
      s !== "" && (Sv.has(s) ? n.includes(s) || n.push(s) : Tv.has(s) || r.push(s));
    }
    return o ? { value: n, problem: k("invalid_type", e, n, "mutedEvents entries must be event-type strings") } : r.length > 0 ? { value: n, problem: k("invalid_enum", e, n, `mutedEvents contains unknown event type(s): ${r.join(", ")}`) } : { value: n };
  }
  function k(e, t, n, r) {
    return { code: e, option: null, received: t, usedValue: n, message: r };
  }
  function _t(e, t) {
    let n;
    switch (e) {
      case "taskDuration":
        n = Nv(t);
        break;
      case "roundDuration":
        n = kv(t);
        break;
      case "sessionId":
        n = gd(t, "sessionId");
        break;
      case "randomSeed":
        n = gd(t, "randomSeed");
        break;
      case "autoStart":
        n = cn(t, "autoStart", S.autoStart);
        break;
      case "adaptiveDifficulty":
        n = cn(t, "adaptiveDifficulty", S.adaptiveDifficulty);
        break;
      case "showTimer":
        n = cn(t, "showTimer", S.showTimer);
        break;
      case "showFeedback":
        n = cn(t, "showFeedback", S.showFeedback);
        break;
      case "showDifficulty":
        n = cn(t, "showDifficulty", S.showDifficulty);
        break;
      case "startDifficulty":
        n = qs(t, "startDifficulty", S.startDifficulty);
        break;
      case "minDifficulty":
        n = qs(t, "minDifficulty", S.minDifficulty);
        break;
      case "maxDifficulty":
        n = qs(t, "maxDifficulty", S.maxDifficulty);
        break;
      case "correctStreakForLevelUp":
        n = md(t, "correctStreakForLevelUp", S.correctStreakForLevelUp);
        break;
      case "wrongStreakForLevelDown":
        n = md(t, "wrongStreakForLevelDown", S.wrongStreakForLevelDown);
        break;
      case "numberOfOptions":
        n = Av(t);
        break;
      case "invoiceOrder":
        n = Rv(t);
        break;
      case "currency":
        n = Ov(t);
        break;
      case "maxSubmissions":
        n = vd(t, "maxSubmissions");
        break;
      case "maxCorrectSubmissions":
        n = vd(t, "maxCorrectSubmissions");
        break;
      case "completedMessage":
        n = Pv(t);
        break;
      case "logLevel":
        n = Fv(t);
        break;
      case "mutedEvents":
        n = Lv(t);
        break;
      default:
        n = { value: S[e] };
    }
    return n.problem && (n.problem.option = e), n;
  }
  function Id(e) {
    let t = D({}, S), n = [];
    for (let o of yt) {
      if (!(o in e) || e[o] === void 0) continue;
      let { value: i, problem: s } = _t(o, e[o]);
      t[o] = i, s && n.push(s);
    }
    if (t.minDifficulty > t.maxDifficulty) {
      let o = t.minDifficulty, i = t.maxDifficulty;
      t.minDifficulty = i, t.maxDifficulty = o, n.push({ code: "range_inverted", option: "minDifficulty", received: { minDifficulty: o, maxDifficulty: i }, usedValue: { minDifficulty: i, maxDifficulty: o }, message: "minDifficulty was greater than maxDifficulty; values swapped" });
    }
    if (t.startDifficulty < t.minDifficulty || t.startDifficulty > t.maxDifficulty) {
      let o = Fr(t.startDifficulty, t.minDifficulty, t.maxDifficulty);
      n.push({ code: "out_of_range", option: "startDifficulty", received: t.startDifficulty, usedValue: o, message: "startDifficulty must be within [minDifficulty, maxDifficulty]" }), t.startDifficulty = o;
    }
    let r = 0;
    for (let o = t.minDifficulty; o <= t.maxDifficulty; o++) r = Math.max(r, Rr(o));
    return t.numberOfOptions < r && (n.push({ code: "out_of_range", option: "numberOfOptions", received: t.numberOfOptions, usedValue: r, message: `numberOfOptions must be at least ${r}, the largest correct subset in [minDifficulty, maxDifficulty]` }), t.numberOfOptions = r), { config: t, problems: n };
  }
  var yt;
  var Or;
  var Sv;
  var Tv;
  var Zs;
  var Pr;
  var Qs;
  var bd = p(() => {
    "use strict";
    Us();
    Ws();
    yt = ["taskDuration", "roundDuration", "sessionId", "autoStart", "startDifficulty", "minDifficulty", "maxDifficulty", "adaptiveDifficulty", "correctStreakForLevelUp", "wrongStreakForLevelDown", "numberOfOptions", "invoiceOrder", "randomSeed", "maxSubmissions", "maxCorrectSubmissions", "showTimer", "showFeedback", "showDifficulty", "currency", "completedMessage", "logLevel", "mutedEvents"], Or = /* @__PURE__ */ new Set(["sessionId", "adaptiveDifficulty", "correctStreakForLevelUp", "wrongStreakForLevelDown", "maxSubmissions", "maxCorrectSubmissions", "showTimer", "showFeedback", "showDifficulty", "currency", "completedMessage", "logLevel", "mutedEvents"]), Sv = /* @__PURE__ */ new Set(["roundStarted", "selectionChanged", "roundSubmitted", "difficultyChanged", "taskPaused", "taskResumed"]), Tv = /* @__PURE__ */ new Set(["taskStarted", "taskFinished", "taskCompleted", "configChanged", "error"]), Zs = /* @__PURE__ */ new Set(["taskDuration", "roundDuration", "startDifficulty", "minDifficulty", "maxDifficulty", "numberOfOptions", "invoiceOrder", "randomSeed"]);
    Pr = yt.reduce((e, t) => (e[yd(t)] = t, e), {}), Qs = yt.map(yd);
  });
  function jv(e, t) {
    if (e & 1 && (P(0, "div", 3)(1, "span", 16), U(2, "Time remaining"), L(), P(3, "span", 17), U(4), L()()), e & 2) {
      let n = ve(2);
      W(4), Re(n.formatClock(n.remainingSeconds()));
    }
  }
  function Hv(e, t) {
    e & 1 && (P(0, "div", 4)(1, "span", 16), U(2, "No time limit"), L()());
  }
  function $v(e, t) {
    if (e & 1 && (P(0, "div", 5)(1, "span", 16), U(2, "Round time"), L(), P(3, "span", 17), U(4), L()()), e & 2) {
      let n = ve(2);
      W(4), Re(n.formatClock(n.roundRemainingSeconds()));
    }
  }
  function Bv(e, t) {
    if (e & 1 && (P(0, "div", 6)(1, "span", 18), U(2, "Level"), L(), P(3, "span", 19), U(4), L()()), e & 2) {
      let n = ve(2);
      W(4), Re(n.currentLevel);
    }
  }
  function Uv(e, t) {
    if (e & 1) {
      let n = Ms();
      P(0, "li", 20)(1, "label", 21)(2, "input", 22), Jt("change", function() {
        let o = Zi(n).$implicit, i = ve(2);
        return Qi(i.toggleInvoice(o.id));
      }), L(), P(3, "span", 23), U(4, "ACQUISITIONS Inc."), L(), P(5, "span", 24), U(6), L()()();
    }
    if (e & 2) {
      let n = t.$implicit, r = t.$index, o = ve(2);
      Kt("imt-invoice-row--selected", o.isSelected(n.id)), W(2), Er("checked", o.isSelected(n.id))("disabled", !o.isRunning || o.feedbackState !== null), wr("aria-label", "Invoice " + (r + 1) + ", " + o.formatAmount(n.amount)), W(4), Re(o.formatAmount(n.amount));
    }
  }
  function Gv(e, t) {
    if (e & 1 && (P(0, "div", 25), U(1), L()), e & 2) {
      let n = ve(2);
      Kt("imt-feedback--correct", n.feedbackState === "correct")("imt-feedback--wrong", n.feedbackState === "wrong"), W(), Cr(" ", n.feedbackState === "correct" ? "Correct" : "Incorrect", " ");
    }
  }
  function zv(e, t) {
    if (e & 1) {
      let n = Ms();
      Yt(0, jv, 5, 1, "div", 3)(1, Hv, 3, 0, "div", 4)(2, $v, 5, 1, "div", 5)(3, Bv, 5, 1, "div", 6), P(4, "div", 7)(5, "span", 8), U(6, "Payment Amount"), L(), P(7, "span", 9), U(8), L()(), P(9, "div", 10)(10, "ul", 11), Lu(11, Uv, 7, 6, "li", 12, Vv), L(), P(13, "div", 13), Yt(14, Gv, 2, 5, "div", 14), P(15, "button", 15), Jt("click", function() {
        Zi(n);
        let o = ve();
        return Qi(o.onPost());
      }), U(16, " Post "), L()()();
    }
    if (e & 2) {
      let n = ve();
      vt(n.showTimerDisplay ? 0 : n.showNoTimeLimitLabel ? 1 : -1), W(2), vt(n.showRoundTimerDisplay ? 2 : -1), W(), vt(n.showDifficultyIndicator ? 3 : -1), W(5), Re(n.formatAmount(n.targetAmount())), W(3), Vu(n.invoices()), W(3), vt(n.feedbackState !== null ? 14 : -1), W(), Er("disabled", !n.isRunning || n.feedbackState !== null);
    }
  }
  function Wv(e, t) {
    if (e & 1 && (P(0, "div", 1)(1, "span", 26), U(2), L()()), e & 2) {
      let n = ve();
      W(2), Re(n.completedMessage);
    }
  }
  function qv(e, t) {
    e & 1 && (P(0, "div", 2)(1, "span", 27), U(2, "Ready"), L()());
  }
  var Vv;
  var Lr;
  var Dd = p(() => {
    "use strict";
    ne();
    ud();
    Us();
    bd();
    Ws();
    ne();
    Vv = (e, t) => t.id;
    Lr = class e {
      elementRef = M(vr);
      targetAmount = me(0);
      invoices = me([]);
      _selectedIds = me(/* @__PURE__ */ new Set());
      _state = me("idle");
      _remainingMs = me(0);
      remainingSeconds = Mr(() => Math.ceil(this._remainingMs() / 1e3));
      _roundRemainingMs = me(0);
      roundRemainingSeconds = Mr(() => Math.ceil(this._roundRemainingMs() / 1e3));
      _feedbackState = me(null);
      _config = me(D({}, S));
      get _effectiveConfig() {
        return this._config();
      }
      static _COPY_FAILED = Object.freeze({ __invoiceTask: "uncopyable_array" });
      _inputConfig = {};
      _attributeObserver = null;
      _rng = Math.random;
      _generator = hd;
      _sequence = 0;
      _taskStartedAt = -1;
      _roundIndex = -1;
      _currentDifficulty = S.startDifficulty;
      _pendingDifficulty = null;
      _correctStreak = 0;
      _wrongStreak = 0;
      _roundStartedAt = 0;
      _correctInvoiceIds = [];
      _totalSubmissions = 0;
      _totalCorrect = 0;
      _totalWrong = 0;
      _totalPausedMs = 0;
      _pausedAt = 0;
      _roundPausedMs = 0;
      _finalDurationMs = -1;
      _durationTimerId = null;
      _feedbackTimerId = null;
      _pendingRoundLoad = false;
      get isRunning() {
        return this._state() === "running";
      }
      get feedbackState() {
        return this._feedbackState();
      }
      get hasActiveRound() {
        let t = this._state();
        return t === "running" || t === "paused";
      }
      get isCompleted() {
        return this._state() === "completed";
      }
      get completedMessage() {
        return this._effectiveConfig.completedMessage;
      }
      get showTimerDisplay() {
        return this._effectiveConfig.showTimer && !!this._effectiveConfig.taskDuration && this._effectiveConfig.taskDuration > 0 && this._state() === "running";
      }
      get showNoTimeLimitLabel() {
        let { showTimer: t, taskDuration: n } = this._effectiveConfig;
        return t && (!n || n <= 0) && this._state() === "running";
      }
      get showRoundTimerDisplay() {
        let { showTimer: t, roundDuration: n } = this._effectiveConfig;
        return t && !!n && n > 0 && this._state() === "running";
      }
      get showDifficultyIndicator() {
        return this._effectiveConfig.showDifficulty && this.hasActiveRound;
      }
      formatAmount(t) {
        switch (this._effectiveConfig.currency) {
          case "GBP":
            return `\xA3${t}`;
          case "USD":
            return `$${t}`;
          default:
            return `\u20AC ${t}`;
        }
      }
      get currentLevel() {
        return this._currentDifficulty;
      }
      formatClock(t) {
        let n = Math.max(0, Math.floor(t)), r = Math.floor(n / 60), o = n % 60;
        return `${r}:${String(o).padStart(2, "0")}`;
      }
      isSelected(t) {
        return this._selectedIds().has(t);
      }
      toggleInvoice(t) {
        if (this._selectedIds.update((s) => {
          let a = new Set(s);
          return a.has(t) ? a.delete(t) : a.add(t), a;
        }), this._state() !== "running") return;
        let { logLevel: n } = this._effectiveConfig;
        if (n !== "detailed" && n !== "debug") return;
        let r = this._selectedIds(), o = this.invoices().filter((s) => r.has(s.id)).map((s) => s.id), i = this.invoices().filter((s) => r.has(s.id)).reduce((s, a) => s + a.amount, 0);
        this._emit({ eventType: "selectionChanged", invoiceId: t, isChecked: r.has(t), currentSelection: o, currentSum: i, roundRelativeTimeMs: Math.max(0, Math.round(performance.now() - this._roundStartedAt)) });
      }
      onPost() {
        this._state() === "running" && this._submitRound(false);
      }
      _submitRound(t) {
        let n = this._selectedIds(), r = this.invoices(), o = r.filter((d) => n.has(d.id)).map((d) => d.id), i = r.filter((d) => n.has(d.id)).reduce((d, h) => d + h.amount, 0), s = new Set(this._correctInvoiceIds), a = s.size === o.length && o.every((d) => s.has(d)), l = Math.max(0, Math.round(performance.now() - this._roundStartedAt - this._roundPausedMs));
        if (this._totalSubmissions++, a ? this._totalCorrect++ : this._totalWrong++, this._emit({ eventType: "roundSubmitted", targetAmount: this.targetAmount(), selectedInvoiceIds: o, correctInvoiceIds: [...this._correctInvoiceIds], selectedSum: i, isCorrect: a, reactionTimeMs: l, totalSubmissions: this._totalSubmissions, totalCorrect: this._totalCorrect, totalWrong: this._totalWrong, timedOut: t }), this._effectiveConfig.adaptiveDifficulty) {
          a ? (this._correctStreak++, this._wrongStreak = 0) : (this._wrongStreak++, this._correctStreak = 0);
          let { correctStreakForLevelUp: d, wrongStreakForLevelDown: h, minDifficulty: f, maxDifficulty: g } = this._effectiveConfig;
          if (this._correctStreak >= d) {
            if (this._currentDifficulty < g) {
              let m = this._currentDifficulty;
              this._currentDifficulty = this._currentDifficulty + 1, this._emit({ eventType: "difficultyChanged", fromLevel: m, toLevel: this._currentDifficulty, reason: "streak_up" });
            }
            this._correctStreak = 0, this._wrongStreak = 0;
          } else if (this._wrongStreak >= h) {
            if (this._currentDifficulty > f) {
              let m = this._currentDifficulty;
              this._currentDifficulty = this._currentDifficulty - 1, this._emit({ eventType: "difficultyChanged", fromLevel: m, toLevel: this._currentDifficulty, reason: "streak_down" });
            }
            this._correctStreak = 0, this._wrongStreak = 0;
          }
        }
        let { maxSubmissions: c, maxCorrectSubmissions: u } = this._effectiveConfig;
        if (c !== null && this._totalSubmissions >= c) {
          this._endTaskNaturally("max_submissions");
          return;
        }
        if (u !== null && this._totalCorrect >= u) {
          this._endTaskNaturally("max_correct_submissions");
          return;
        }
        this._effectiveConfig.showFeedback ? (this._feedbackState.set(a ? "correct" : "wrong"), this._feedbackTimerId = setTimeout(() => {
          this._feedbackTimerId = null, this._feedbackState.set(null), this._loadNewRound();
        }, 600)) : this._loadNewRound();
      }
      ngOnInit() {
        let t = this.elementRef.nativeElement;
        t.start = () => this.start(), t.pause = () => this.pause(), t.resume = () => this.resume(), t.stop = () => this.stop(), t.reset = () => this.reset(), t.getSummary = () => this.getSummary(), t.setDifficulty = (r) => this.setDifficulty(r), this._attachConfigAccessors(t), this._observeAttributes();
        let n = this._readAttributes().autoStart;
        n !== void 0 && _t("autoStart", n).value === true && this.start();
      }
      ngOnDestroy() {
        this._clearTimer(), this._attributeObserver?.disconnect(), this._attributeObserver = null;
      }
      _attachConfigAccessors(t) {
        for (let n of yt) Object.defineProperty(t, n, { configurable: true, enumerable: true, get: () => this._readOption(n), set: (r) => this._writeOption(n, r) });
        Object.defineProperty(t, "config", { configurable: true, enumerable: true, get: () => {
          let n = this._inputConfig.mutedEvents, r = D(D({}, this._effectiveConfig), this._inputConfig);
          if (n === e._COPY_FAILED) r.mutedEvents = [];
          else if (Array.isArray(r.mutedEvents)) try {
            r.mutedEvents = [...r.mutedEvents];
          } catch {
            r.mutedEvents = [];
          }
          return r;
        }, set: (n) => this.setConfig(n) });
      }
      _observeAttributes() {
        let t = this.elementRef.nativeElement;
        typeof MutationObserver > "u" || (this._attributeObserver = new MutationObserver((n) => {
          for (let r of n) r.type !== "attributes" || r.attributeName === null || !Pr[r.attributeName] || this._onAttributeChanged(r.attributeName, t.getAttribute(r.attributeName));
        }), this._attributeObserver.observe(t, { attributes: true, attributeFilter: [...Qs] }));
      }
      _readAttributes() {
        let t = this.elementRef.nativeElement, n = {};
        for (let r of Qs) {
          if (!t.hasAttribute(r)) continue;
          let o = Pr[r];
          n[o] = t.getAttribute(r) ?? "";
        }
        return n;
      }
      _onAttributeChanged(t, n) {
        let r = Pr[t];
        if (r) {
          if (n === null) {
            if (delete this._inputConfig[r], this._state() !== "idle" && Or.has(r)) {
              let o = this._applyLiveOption(r, S[r]);
              o && this._emit({ eventType: "configChanged", changes: [o] });
            }
            return;
          }
          this._writeOption(r, n);
        }
      }
      _readOption(t) {
        if (this._state() === "idle" && t in this._inputConfig && this._inputConfig[t] !== void 0) {
          let n = this._inputConfig[t];
          return n === e._COPY_FAILED ? [] : this._cloneOptionValue(n);
        }
        return this._cloneOptionValue(this._effectiveConfig[t]);
      }
      _writeOption(t, n) {
        if (this._inputConfig[t] = this._cloneOptionValue(n), t === "autoStart") {
          this._state() === "idle" && _t("autoStart", n).value === true && this.start();
          return;
        }
        if (this._state() !== "idle" && !Zs.has(t) && Or.has(t)) {
          let r = this._applyLiveOption(t, n);
          r && this._emit({ eventType: "configChanged", changes: [r] });
        }
      }
      setConfig(t) {
        if (t === null || typeof t != "object") return;
        let n = [], r = this._state() !== "idle", o = false;
        for (let i of Object.keys(t)) {
          if (!yt.includes(i)) {
            this._emitError("unknown_option", "warning", i, `Unknown config option "${i}"`, { received: t[i], usedValue: null });
            continue;
          }
          let s = i, a = t[s];
          if (this._inputConfig[s] = this._cloneOptionValue(a), s === "autoStart") {
            this._state() === "idle" && _t("autoStart", a).value === true && (o = true);
            continue;
          }
          if (!(!r || Zs.has(s)) && Or.has(s)) {
            let l = this._applyLiveOption(s, a);
            l && n.push(l);
          }
        }
        n.length > 0 && this._emit({ eventType: "configChanged", changes: n }), o && this.start();
      }
      _applyLiveOption(t, n) {
        let { value: r, problem: o } = _t(t, n);
        o && this._emitConfigProblem(o);
        let i = this._effectiveConfig[t];
        return this._optionValuesEqual(i, r) ? null : (this._config.set(B(D({}, this._effectiveConfig), { [t]: r })), (t === "adaptiveDifficulty" || t === "correctStreakForLevelUp" || t === "wrongStreakForLevelDown") && (this._correctStreak = 0, this._wrongStreak = 0), t === "adaptiveDifficulty" && r === true && (this._pendingDifficulty = null), { option: t, oldValue: this._cloneOptionValue(i), newValue: this._cloneOptionValue(r) });
      }
      _optionValuesEqual(t, n) {
        return t === n ? true : Array.isArray(t) && Array.isArray(n) ? t.length === n.length && t.every((r, o) => r === n[o]) : false;
      }
      _cloneOptionValue(t) {
        if (!Array.isArray(t)) return t;
        try {
          return [...t];
        } catch {
          return e._COPY_FAILED;
        }
      }
      _cloneConfig(t) {
        return B(D({}, t), { mutedEvents: [...t.mutedEvents] });
      }
      _emit(t) {
        let n = t.eventType;
        if (this._effectiveConfig.mutedEvents.includes(n)) return;
        let r = this._state(), o = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt)) : 0, i = Date.now(), s = D({ sequence: ++this._sequence, timestamp: new Date(i).toISOString(), unixMs: i, relativeTimeMs: o, sessionId: this._effectiveConfig.sessionId, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null, currentDifficulty: r === "running" || r === "paused" ? this._currentDifficulty : null }, t);
        this.elementRef.nativeElement.dispatchEvent(new CustomEvent("invoiceTaskEvent", { detail: s, bubbles: false, composed: false }));
      }
      _emitError(t, n, r, o, i = {}) {
        let s = {};
        "received" in i && (s.received = this._toJsonSafe(i.received)), "usedValue" in i && (s.usedValue = this._toJsonSafe(i.usedValue)), this._emit(D({ eventType: "error", code: t, severity: n, option: r, message: o }, s));
      }
      _toJsonSafe(t, n = /* @__PURE__ */ new WeakSet()) {
        if (t === null) return null;
        let r = typeof t;
        if (r === "string" || r === "boolean") return t;
        if (r === "number") return Number.isFinite(t) ? t : String(t);
        if (r === "bigint") return t.toString();
        if (r === "undefined") return "[undefined]";
        if (r === "symbol" || r === "function") return String(t);
        let o = t;
        if (n.has(o)) return "[Circular]";
        if (n.add(o), Array.isArray(t)) return t.map((s) => {
          try {
            return this._toJsonSafe(s, n);
          } catch {
            return "[Unserializable]";
          }
        });
        let i = {};
        for (let s of Object.keys(o)) try {
          i[s] = this._toJsonSafe(o[s], n);
        } catch {
          i[s] = "[Unserializable]";
        }
        return i;
      }
      _emitConfigProblem(t) {
        this._emitError(t.code, "warning", t.option, t.message, { received: this._cloneOptionValue(t.received), usedValue: this._cloneOptionValue(t.usedValue) });
      }
      _emitTaskFinished(t, n, r = {}) {
        let o = this._pausedAt > 0 ? Math.max(0, Math.round(performance.now() - this._pausedAt)) : 0, i = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs - o)) : 0;
        this._emit(D({ eventType: "taskFinished", reason: t, totalDurationMs: i, totals: { submissions: this._totalSubmissions, correct: this._totalCorrect, wrong: this._totalWrong }, endingLevel: this._currentDifficulty, unsubmittedSelection: n }, r));
      }
      _clearState() {
        this._clearTimer(), this._feedbackTimerId !== null && (clearTimeout(this._feedbackTimerId), this._feedbackTimerId = null), this._feedbackState.set(null), this._pendingRoundLoad = false, this._totalPausedMs = 0, this._pausedAt = 0, this._roundPausedMs = 0, this._finalDurationMs = -1, this._sequence = 0, this._taskStartedAt = -1, this._roundIndex = -1, this._roundStartedAt = 0, this._totalSubmissions = 0, this._totalCorrect = 0, this._totalWrong = 0, this._currentDifficulty = this._effectiveConfig.startDifficulty, this._pendingDifficulty = null, this._correctStreak = 0, this._wrongStreak = 0, this._correctInvoiceIds = [], this._selectedIds.set(/* @__PURE__ */ new Set()), this.targetAmount.set(0), this.invoices.set([]);
      }
      _clearTimer() {
        this._durationTimerId !== null && (clearInterval(this._durationTimerId), this._durationTimerId = null), this._remainingMs.set(0), this._roundRemainingMs.set(0);
      }
      _onDurationTick() {
        if (this._state() !== "running") return;
        let { taskDuration: t, roundDuration: n } = this._effectiveConfig;
        if (t && t > 0) {
          let o = this._taskStartedAt + t * 1e3 + this._totalPausedMs - performance.now();
          if (this._remainingMs.set(Math.max(0, o)), o <= 0) {
            this._endTaskNaturally("duration_elapsed");
            return;
          }
        }
        if (this._feedbackTimerId === null && n && n > 0 && this._roundIndex >= 0) {
          let o = this._roundStartedAt + n * 1e3 + this._roundPausedMs - performance.now();
          this._roundRemainingMs.set(Math.max(0, o)), o <= 0 && this._submitRound(true);
        }
      }
      _endTaskNaturally(t) {
        this._feedbackTimerId !== null && (clearTimeout(this._feedbackTimerId), this._feedbackTimerId = null), this._feedbackState.set(null), this._clearTimer();
        let n = this._selectedIds(), r = this.invoices().filter((a) => n.has(a.id)).map((a) => a.id), o = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs)) : 0, i = { reason: t, totalDurationMs: o, totals: { submissions: this._totalSubmissions, correct: this._totalCorrect, wrong: this._totalWrong }, endingLevel: this._currentDifficulty, unsubmittedSelection: r }, s = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null };
        this._finalDurationMs = o, this._state.set("completed"), this._emit(D(D({ eventType: "taskFinished" }, s), i)), this._emit(D(D({ eventType: "taskCompleted" }, s), i));
      }
      _loadNewRound() {
        if (this._roundPausedMs = 0, this._selectedIds.set(/* @__PURE__ */ new Set()), this._pendingDifficulty !== null) {
          let i = this._pendingDifficulty;
          if (this._pendingDifficulty = null, i !== this._currentDifficulty) {
            let s = this._currentDifficulty;
            this._currentDifficulty = i, this._emit({ eventType: "difficultyChanged", fromLevel: s, toLevel: i, reason: "host_set" });
          }
        }
        let t, n;
        try {
          let i = this._generator(this._currentDifficulty, this._effectiveConfig.numberOfOptions, this._rng);
          t = i.round, n = i.hadRetries;
        } catch (i) {
          let s = i instanceof Error ? i.message : "Unexpected internal error during round generation", a = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null };
          this._finalDurationMs = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs)) : 0, this._clearTimer(), this._state.set("error"), this._emitTaskFinished("error", [], a), this._emit(D({ eventType: "error", code: "internal_error", severity: "error", option: null, message: s }, a));
          return;
        }
        this._roundIndex++, n && this._emitError("internal_error", "warning", null, "Round generation required retries; a valid round was eventually found."), this._roundStartedAt = performance.now();
        let { roundDuration: r } = this._effectiveConfig;
        r && r > 0 && this._roundRemainingMs.set(r * 1e3), this.targetAmount.set(t.targetAmount), this.invoices.set(t.visibleInvoices), this._correctInvoiceIds = t.correctInvoiceIds;
        let o = this._taskStartedAt >= 0 ? Math.max(0, Math.round(this._roundStartedAt - this._taskStartedAt)) : 0;
        this._emit({ eventType: "roundStarted", relativeTimeMs: o, targetAmount: t.targetAmount, visibleInvoices: t.visibleInvoices.map((i) => D({}, i)), correctInvoiceIds: [...t.correctInvoiceIds] });
      }
      start() {
        if (this._state() !== "idle") {
          this._emitError("invalid_state_transition", "warning", null, "start() called outside of idle state");
          return;
        }
        let t = D(D({}, this._readAttributes()), this._inputConfig), { config: n, problems: r } = Id(t);
        this._config.set(n), this._rng = pd(n.invoiceOrder, n.randomSeed), this._sequence = 0, this._roundIndex = -1, this._currentDifficulty = n.startDifficulty, this._pendingDifficulty = null, this._correctStreak = 0, this._wrongStreak = 0, this._totalSubmissions = 0, this._totalCorrect = 0, this._totalWrong = 0, this._totalPausedMs = 0, this._finalDurationMs = -1, this._taskStartedAt = performance.now(), this._state.set("running");
        let { taskDuration: o, roundDuration: i } = this._effectiveConfig;
        (o && o > 0 || i && i > 0) && (o && o > 0 && this._remainingMs.set(o * 1e3), this._durationTimerId = setInterval(() => this._onDurationTick(), 250));
        let s = Date.now();
        this.elementRef.nativeElement.dispatchEvent(new CustomEvent("invoiceTaskEvent", { detail: { eventType: "taskStarted", sequence: ++this._sequence, timestamp: new Date(s).toISOString(), unixMs: s, relativeTimeMs: 0, sessionId: this._effectiveConfig.sessionId, roundIndex: null, currentDifficulty: this._currentDifficulty, effectiveConfig: this._cloneConfig(this._effectiveConfig) }, bubbles: false, composed: false }));
        for (let a of r) this._emitConfigProblem(a);
        this._loadNewRound();
      }
      pause() {
        if (this._state() !== "running") {
          this._emitError("invalid_state_transition", "warning", null, "pause() called outside of running state");
          return;
        }
        this._feedbackTimerId !== null && (clearTimeout(this._feedbackTimerId), this._feedbackTimerId = null, this._feedbackState.set(null), this._pendingRoundLoad = true), this._pausedAt = performance.now(), this._state.set("paused");
        let t = this._selectedIds(), n = this.invoices().filter((o) => t.has(o.id)).map((o) => o.id), { logLevel: r } = this._effectiveConfig;
        (r === "detailed" || r === "debug") && this._emit({ eventType: "taskPaused", currentSelection: n });
      }
      resume() {
        if (this._state() !== "paused") {
          this._emitError("invalid_state_transition", "warning", null, "resume() called outside of paused state");
          return;
        }
        let t = Math.max(0, Math.round(performance.now() - this._pausedAt));
        this._totalPausedMs += t, this._roundPausedMs += t, this._pausedAt = 0, this._state.set("running");
        let { logLevel: n } = this._effectiveConfig;
        (n === "detailed" || n === "debug") && this._emit({ eventType: "taskResumed", pausedDurationMs: t }), this._pendingRoundLoad && (this._pendingRoundLoad = false, this._loadNewRound());
      }
      stop() {
        let t = this._state();
        if (t !== "running" && t !== "paused") {
          this._emitError("invalid_state_transition", "warning", null, "stop() called outside of running or paused state");
          return;
        }
        let n = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null }, r = this._selectedIds(), o = this.invoices().filter((i) => r.has(i.id)).map((i) => i.id);
        this._state.set("idle"), this._emitTaskFinished("stopped", o, n), this._clearState();
      }
      reset() {
        let t = this._state();
        if (t === "running" || t === "paused") {
          let n = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null }, r = this._selectedIds(), o = this.invoices().filter((i) => r.has(i.id)).map((i) => i.id);
          this._state.set("idle"), this._emitTaskFinished("reset", o, n);
        } else this._state.set("idle");
        this._clearState();
      }
      getSummary() {
        let t = this._state(), n = t === "paused" && this._pausedAt > 0 ? Math.max(0, performance.now() - this._pausedAt) : 0, r = this._finalDurationMs >= 0 ? this._finalDurationMs : this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs - n)) : 0;
        return { state: t, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null, currentDifficulty: t === "running" || t === "paused" ? this._currentDifficulty : null, totals: { submissions: this._totalSubmissions, correct: this._totalCorrect, wrong: this._totalWrong }, effectiveConfig: this._cloneConfig(this._effectiveConfig), sessionId: this._effectiveConfig.sessionId, elapsedMs: r };
      }
      setDifficulty(t) {
        let n = this._state();
        if (n !== "running" && n !== "paused") {
          this._emitError("invalid_state_transition", "warning", null, "setDifficulty() called outside of running or paused state", { received: t, usedValue: null });
          return;
        }
        if (this._effectiveConfig.adaptiveDifficulty) {
          this._emitError("adaptive_difficulty_enabled", "warning", null, "setDifficulty() is ignored while adaptiveDifficulty is enabled; set adaptiveDifficulty:false to control difficulty externally", { received: t, usedValue: null });
          return;
        }
        let { minDifficulty: r, maxDifficulty: o } = this._effectiveConfig, { value: i, problem: s } = _d(t, r, o);
        s && this._emitConfigProblem(s), s?.code !== "invalid_type" && (this._pendingDifficulty = i);
      }
      static \u0275fac = function(n) {
        return new (n || e)();
      };
      static \u0275cmp = Ou({ type: e, selectors: [["app-invoice-matching-task"]], decls: 4, vars: 1, consts: [[1, "imt-container"], [1, "imt-completed"], [1, "imt-ready"], ["role", "timer", "aria-live", "off", 1, "imt-timer"], ["role", "status", 1, "imt-timer", "imt-timer--no-limit"], ["role", "timer", "aria-live", "off", 1, "imt-timer", "imt-timer--round"], ["role", "status", 1, "imt-difficulty"], [1, "imt-target-panel"], [1, "imt-target-label"], [1, "imt-target-amount"], [1, "imt-invoices-panel"], ["role", "group", "aria-label", "Invoice options", 1, "imt-invoice-list"], [1, "imt-invoice-row", 3, "imt-invoice-row--selected"], [1, "imt-footer"], ["role", "status", "aria-live", "polite", 1, "imt-feedback", 3, "imt-feedback--correct", "imt-feedback--wrong"], ["type", "button", 1, "imt-post-button", 3, "click", "disabled"], [1, "imt-timer-label"], [1, "imt-timer-value"], [1, "imt-difficulty-label"], [1, "imt-difficulty-value"], [1, "imt-invoice-row"], [1, "imt-invoice-label"], ["type", "checkbox", 1, "imt-invoice-checkbox", 3, "change", "checked", "disabled"], [1, "imt-invoice-customer"], [1, "imt-invoice-amount"], ["role", "status", "aria-live", "polite", 1, "imt-feedback"], [1, "imt-completed-message"], [1, "imt-ready-label"]], template: function(n, r) {
        n & 1 && (P(0, "div", 0), Yt(1, zv, 17, 6)(2, Wv, 3, 1, "div", 1)(3, qv, 3, 0, "div", 2), L()), n & 2 && (W(), vt(r.hasActiveRound ? 1 : r.isCompleted ? 2 : 3));
      }, dependencies: [cd], styles: ["[_nghost-%COMP%]{display:block;font-family:var(--invoice-task-font-family, system-ui, sans-serif);background:var(--invoice-task-background, #ffffff);color:#222;border:1px solid var(--invoice-task-border-color, #e0e0e0);border-radius:6px;overflow:hidden;max-width:640px}.imt-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.imt-target-panel[_ngcontent-%COMP%]{padding:1.25rem 1.5rem;background:#f5f5f5;border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);display:flex;align-items:baseline;gap:1rem}.imt-target-label[_ngcontent-%COMP%]{font-size:.78rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#6b6b6b;white-space:nowrap}.imt-target-amount[_ngcontent-%COMP%]{font-size:2rem;font-weight:700;color:#111}.imt-invoices-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:.75rem}.imt-invoice-list[_ngcontent-%COMP%]{flex:1;list-style:none;margin:0;padding:0;overflow-y:auto}.imt-invoice-row[_ngcontent-%COMP%]{border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0)}.imt-invoice-row[_ngcontent-%COMP%]:last-child{border-bottom:none}.imt-invoice-row--selected[_ngcontent-%COMP%]{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;padding:.5rem;cursor:pointer;-webkit-user-select:none;user-select:none}.imt-invoice-label[_ngcontent-%COMP%]:hover{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-checkbox[_ngcontent-%COMP%]{width:1.1rem;height:1.1rem;flex-shrink:0;cursor:pointer;accent-color:var(--invoice-task-primary-color, #111111)}.imt-invoice-checkbox[_ngcontent-%COMP%]:focus-visible, .imt-post-button[_ngcontent-%COMP%]:focus-visible{outline:2px solid var(--invoice-task-primary-color, #111111);outline-offset:2px}.imt-invoice-label[_ngcontent-%COMP%]:focus-within{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-customer[_ngcontent-%COMP%]{flex:1;font-size:.875rem;color:#666}.imt-invoice-amount[_ngcontent-%COMP%]{font-size:.9rem;font-weight:600;color:#222;min-width:4rem;text-align:right}.imt-footer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;padding-top:.75rem;border-top:1px solid var(--invoice-task-border-color, #e0e0e0);margin-top:.5rem}.imt-post-button[_ngcontent-%COMP%]{padding:.45rem 1.5rem;background:var(--invoice-task-primary-color, #111111);color:#fff;border:none;border-radius:4px;font-size:.9rem;font-weight:600;cursor:pointer}.imt-post-button[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:not-allowed}.imt-post-button[_ngcontent-%COMP%]:not(:disabled):hover{filter:brightness(1.4)}.imt-post-button[_ngcontent-%COMP%]:not(:disabled):active{filter:brightness(.95)}.imt-feedback[_ngcontent-%COMP%]{flex:1;padding:.3rem .75rem;border-radius:4px;font-size:.85rem;font-weight:600;align-self:center}.imt-feedback--correct[_ngcontent-%COMP%]{background:#d4edda;color:#155724}.imt-feedback--wrong[_ngcontent-%COMP%]{background:#f8d7da;color:#721c24}.imt-timer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;align-items:center;gap:.5rem;padding:.35rem 1.5rem;background:var(--invoice-task-background, #ffffff);border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);font-size:.8rem}.imt-timer-label[_ngcontent-%COMP%]{color:#6f6f6f}.imt-timer-value[_ngcontent-%COMP%]{font-weight:700;color:#222;min-width:3rem;text-align:right}.imt-timer--no-limit[_ngcontent-%COMP%]{justify-content:flex-start}.imt-timer--round[_ngcontent-%COMP%]{background:var(--invoice-task-highlight-color, #f5f5f5);color:#444}.imt-difficulty[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.4rem;padding:.3rem 1.5rem;background:var(--invoice-task-background, #ffffff);border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);font-size:.8rem}.imt-difficulty-label[_ngcontent-%COMP%]{text-transform:uppercase;letter-spacing:.05em;color:#6f6f6f;font-size:.7rem}.imt-difficulty-value[_ngcontent-%COMP%]{font-weight:700;color:var(--invoice-task-primary-color, #111111)}.imt-completed[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem;text-align:center}.imt-completed-message[_ngcontent-%COMP%]{font-size:1rem;color:#333;line-height:1.5}.imt-ready[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem}.imt-ready-label[_ngcontent-%COMP%]{font-size:1rem;color:#767676;letter-spacing:.04em}"] });
    };
  });
  var Zv = xd((wd) => {
    ne();
    id();
    ad();
    Dd();
    un(null, null, function* () {
      let e = yield Vs({ providers: [Hu({ eventCoalescing: true })] }), t = sd(Lr, { injector: e.injector });
      customElements.define("invoice-matching-task", t);
    }).catch(console.error);
  });
  var stdin_default = Zv();
})();
