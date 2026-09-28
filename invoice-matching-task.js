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
  var wd = Object.defineProperty;
  var Ed = Object.defineProperties;
  var Cd = Object.getOwnPropertyDescriptors;
  var Qs = Object.getOwnPropertySymbols;
  var Md = Object.prototype.hasOwnProperty;
  var Sd = Object.prototype.propertyIsEnumerable;
  var Ys = (e, t, n) => t in e ? wd(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
  var D = (e, t) => {
    for (var n in t ||= {}) Md.call(t, n) && Ys(e, n, t[n]);
    if (Qs) for (var n of Qs(t)) Sd.call(t, n) && Ys(e, n, t[n]);
    return e;
  };
  var B = (e, t) => Ed(e, Cd(t));
  var p = (e, t) => () => (e && (t = e(e = 0)), t);
  var Td = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
  var cn = (e, t, n) => new Promise((r, o) => {
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
  function Vr(e, t) {
    return Object.is(e, t);
  }
  function y(e) {
    let t = j;
    return j = e, t;
  }
  function Hr() {
    return j;
  }
  function fn(e) {
    if (un) throw new Error("");
    if (j === null) return;
    j.consumerOnSignalRead(e);
    let t = j.nextProducerIndex++;
    if (gn(j), t < j.producerNode.length && j.producerNode[t] !== e && Dt(j)) {
      let n = j.producerNode[t];
      pn(n, j.producerIndexOfThis[t]);
    }
    j.producerNode[t] !== e && (j.producerNode[t] = e, j.producerIndexOfThis[t] = Dt(j) ? Js(e, j, t) : 0), j.producerLastReadVersion[t] = e.version;
  }
  function Ks() {
    jr++;
  }
  function $r(e) {
    if (!(Dt(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === jr)) {
      if (!e.producerMustRecompute(e) && !zr(e)) {
        Lr(e);
        return;
      }
      e.producerRecomputeValue(e), Lr(e);
    }
  }
  function Br(e) {
    if (e.liveConsumerNode === void 0) return;
    let t = un;
    un = true;
    try {
      for (let n of e.liveConsumerNode) n.dirty || xd(n);
    } finally {
      un = t;
    }
  }
  function Ur() {
    return j?.consumerAllowSignalWrites !== false;
  }
  function xd(e) {
    e.dirty = true, Br(e), e.consumerMarkedDirty?.(e);
  }
  function Lr(e) {
    e.dirty = false, e.lastCleanEpoch = jr;
  }
  function hn(e) {
    return e && (e.nextProducerIndex = 0), y(e);
  }
  function Gr(e, t) {
    if (y(t), !(!e || e.producerNode === void 0 || e.producerIndexOfThis === void 0 || e.producerLastReadVersion === void 0)) {
      if (Dt(e)) for (let n = e.nextProducerIndex; n < e.producerNode.length; n++) pn(e.producerNode[n], e.producerIndexOfThis[n]);
      for (; e.producerNode.length > e.nextProducerIndex; ) e.producerNode.pop(), e.producerLastReadVersion.pop(), e.producerIndexOfThis.pop();
    }
  }
  function zr(e) {
    gn(e);
    for (let t = 0; t < e.producerNode.length; t++) {
      let n = e.producerNode[t], r = e.producerLastReadVersion[t];
      if (r !== n.version || ($r(n), r !== n.version)) return true;
    }
    return false;
  }
  function Wr(e) {
    if (gn(e), Dt(e)) for (let t = 0; t < e.producerNode.length; t++) pn(e.producerNode[t], e.producerIndexOfThis[t]);
    e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0, e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
  }
  function Js(e, t, n) {
    if (Xs(e), e.liveConsumerNode.length === 0 && ea(e)) for (let r = 0; r < e.producerNode.length; r++) e.producerIndexOfThis[r] = Js(e.producerNode[r], e, r);
    return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
  }
  function pn(e, t) {
    if (Xs(e), e.liveConsumerNode.length === 1 && ea(e)) for (let r = 0; r < e.producerNode.length; r++) pn(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (e.liveConsumerNode[t] = e.liveConsumerNode[n], e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n], e.liveConsumerNode.length--, e.liveConsumerIndexOfThis.length--, t < e.liveConsumerNode.length) {
      let r = e.liveConsumerIndexOfThis[t], o = e.liveConsumerNode[t];
      gn(o), o.producerIndexOfThis[r] = t;
    }
  }
  function Dt(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
  }
  function gn(e) {
    e.producerNode ??= [], e.producerIndexOfThis ??= [], e.producerLastReadVersion ??= [];
  }
  function Xs(e) {
    e.liveConsumerNode ??= [], e.liveConsumerIndexOfThis ??= [];
  }
  function ea(e) {
    return e.producerNode !== void 0;
  }
  function qr(e, t) {
    let n = Object.create(Nd);
    n.computation = e, t !== void 0 && (n.equal = t);
    let r = () => {
      if ($r(n), fn(n), n.value === dn) throw n.error;
      return n.value;
    };
    return r[le] = n, r;
  }
  function Ad() {
    throw new Error();
  }
  function na(e) {
    ta(e);
  }
  function Zr(e) {
    ta = e;
  }
  function Qr(e, t) {
    let n = Object.create(Kr);
    n.value = e, t !== void 0 && (n.equal = t);
    let r = () => (fn(n), n.value);
    return r[le] = n, r;
  }
  function mn(e, t) {
    Ur() || na(e), e.equal(e.value, t) || (e.value = t, Rd(e));
  }
  function Yr(e, t) {
    Ur() || na(e), mn(e, t(e.value));
  }
  function Rd(e) {
    e.version++, Ks(), Br(e), kd?.();
  }
  var j;
  var un;
  var jr;
  var le;
  var wt;
  var Pr;
  var Fr;
  var dn;
  var Nd;
  var ta;
  var kd;
  var Kr;
  var Jr = p(() => {
    "use strict";
    j = null, un = false, jr = 1, le = /* @__PURE__ */ Symbol("SIGNAL");
    wt = { version: 0, lastCleanEpoch: 0, dirty: false, producerNode: void 0, producerLastReadVersion: void 0, producerIndexOfThis: void 0, nextProducerIndex: 0, liveConsumerNode: void 0, liveConsumerIndexOfThis: void 0, consumerAllowSignalWrites: false, consumerIsAlwaysLive: false, kind: "unknown", producerMustRecompute: () => false, producerRecomputeValue: () => {
    }, consumerMarkedDirty: () => {
    }, consumerOnSignalRead: () => {
    } };
    Pr = /* @__PURE__ */ Symbol("UNSET"), Fr = /* @__PURE__ */ Symbol("COMPUTING"), dn = /* @__PURE__ */ Symbol("ERRORED"), Nd = B(D({}, wt), { value: Pr, dirty: true, error: null, equal: Vr, kind: "computed", producerMustRecompute(e) {
      return e.value === Pr || e.value === Fr;
    }, producerRecomputeValue(e) {
      if (e.value === Fr) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = Fr;
      let n = hn(e), r, o = false;
      try {
        r = e.computation(), y(null), o = t !== Pr && t !== dn && r !== dn && e.equal(t, r);
      } catch (i) {
        r = dn, e.error = i;
      } finally {
        Gr(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      e.value = r, e.version++;
    } });
    ta = Ad;
    kd = null;
    Kr = B(D({}, wt), { equal: Vr, value: void 0, kind: "signal" });
  });
  function Et() {
    return Xr;
  }
  function _e(e) {
    let t = Xr;
    return Xr = e, t;
  }
  var Xr;
  var vn;
  var eo = p(() => {
    "use strict";
    vn = /* @__PURE__ */ Symbol("NotFound");
  });
  var ra = p(() => {
    "use strict";
    Jr();
  });
  function C(e) {
    return typeof e == "function";
  }
  var q = p(() => {
    "use strict";
  });
  function yn(e) {
    let n = e((r) => {
      Error.call(r), r.stack = new Error().stack;
    });
    return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n;
  }
  var to = p(() => {
    "use strict";
  });
  var _n;
  var oa = p(() => {
    "use strict";
    to();
    _n = yn((e) => function(n) {
      e(this), this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = n;
    });
  });
  function Ct(e, t) {
    if (e) {
      let n = e.indexOf(t);
      0 <= n && e.splice(n, 1);
    }
  }
  var no = p(() => {
    "use strict";
  });
  function In(e) {
    return e instanceof G || e && "closed" in e && C(e.remove) && C(e.add) && C(e.unsubscribe);
  }
  function ia(e) {
    C(e) ? e() : e.unsubscribe();
  }
  var G;
  var ro;
  var Mt = p(() => {
    "use strict";
    q();
    oa();
    no();
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
            t = i instanceof _n ? i.errors : [i];
          }
          let { _finalizers: o } = this;
          if (o) {
            this._finalizers = null;
            for (let i of o) try {
              ia(i);
            } catch (s) {
              t = t ?? [], s instanceof _n ? t = [...t, ...s.errors] : t.push(s);
            }
          }
          if (t) throw new _n(t);
        }
      }
      add(t) {
        var n;
        if (t && t !== this) if (this.closed) ia(t);
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
        n === t ? this._parentage = null : Array.isArray(n) && Ct(n, t);
      }
      remove(t) {
        let { _finalizers: n } = this;
        n && Ct(n, t), t instanceof e && t._removeParent(this);
      }
    };
    G.EMPTY = (() => {
      let e = new G();
      return e.closed = true, e;
    })();
    ro = G.EMPTY;
  });
  var re;
  var St = p(() => {
    "use strict";
    re = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: false, useDeprecatedNextContext: false };
  });
  var Qe;
  var oo = p(() => {
    "use strict";
    Qe = { setTimeout(e, t, ...n) {
      let { delegate: r } = Qe;
      return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
    }, clearTimeout(e) {
      let { delegate: t } = Qe;
      return (t?.clearTimeout || clearTimeout)(e);
    }, delegate: void 0 };
  });
  function bn(e) {
    Qe.setTimeout(() => {
      let { onUnhandledError: t } = re;
      if (t) t(e);
      else throw e;
    });
  }
  var io = p(() => {
    "use strict";
    St();
    oo();
  });
  function so() {
  }
  var sa = p(() => {
    "use strict";
  });
  function la(e) {
    return ao("E", void 0, e);
  }
  function ca(e) {
    return ao("N", e, void 0);
  }
  function ao(e, t, n) {
    return { kind: e, value: t, error: n };
  }
  var aa;
  var ua = p(() => {
    "use strict";
    aa = ao("C", void 0, void 0);
  });
  function Ye(e) {
    if (re.useDeprecatedSynchronousErrorHandling) {
      let t = !Re;
      if (t && (Re = { errorThrown: false, error: null }), e(), t) {
        let { errorThrown: n, error: r } = Re;
        if (Re = null, n) throw r;
      }
    } else e();
  }
  function da(e) {
    re.useDeprecatedSynchronousErrorHandling && Re && (Re.errorThrown = true, Re.error = e);
  }
  var Re;
  var Dn = p(() => {
    "use strict";
    St();
    Re = null;
  });
  function lo(e, t) {
    return Vd.call(e, t);
  }
  function wn(e) {
    re.useDeprecatedSynchronousErrorHandling ? da(e) : bn(e);
  }
  function jd(e) {
    throw e;
  }
  function co(e, t) {
    let { onStoppedNotification: n } = re;
    n && Qe.setTimeout(() => n(e, t));
  }
  var Oe;
  var Vd;
  var uo;
  var Ke;
  var Hd;
  var fo = p(() => {
    "use strict";
    q();
    Mt();
    St();
    io();
    sa();
    ua();
    oo();
    Dn();
    Oe = class extends G {
      constructor(t) {
        super(), this.isStopped = false, t ? (this.destination = t, In(t) && t.add(this)) : this.destination = Hd;
      }
      static create(t, n, r) {
        return new Ke(t, n, r);
      }
      next(t) {
        this.isStopped ? co(ca(t), this) : this._next(t);
      }
      error(t) {
        this.isStopped ? co(la(t), this) : (this.isStopped = true, this._error(t));
      }
      complete() {
        this.isStopped ? co(aa, this) : (this.isStopped = true, this._complete());
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
    }, Vd = Function.prototype.bind;
    uo = class {
      constructor(t) {
        this.partialObserver = t;
      }
      next(t) {
        let { partialObserver: n } = this;
        if (n.next) try {
          n.next(t);
        } catch (r) {
          wn(r);
        }
      }
      error(t) {
        let { partialObserver: n } = this;
        if (n.error) try {
          n.error(t);
        } catch (r) {
          wn(r);
        }
        else wn(t);
      }
      complete() {
        let { partialObserver: t } = this;
        if (t.complete) try {
          t.complete();
        } catch (n) {
          wn(n);
        }
      }
    }, Ke = class extends Oe {
      constructor(t, n, r) {
        super();
        let o;
        if (C(t) || !t) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
        else {
          let i;
          this && re.useDeprecatedNextContext ? (i = Object.create(t), i.unsubscribe = () => this.unsubscribe(), o = { next: t.next && lo(t.next, i), error: t.error && lo(t.error, i), complete: t.complete && lo(t.complete, i) }) : o = t;
        }
        this.destination = new uo(o);
      }
    };
    Hd = { closed: true, next: so, error: jd, complete: so };
  });
  var Je;
  var En = p(() => {
    "use strict";
    Je = typeof Symbol == "function" && Symbol.observable || "@@observable";
  });
  function Cn(e) {
    return e;
  }
  var ho = p(() => {
    "use strict";
  });
  function fa(e) {
    return e.length === 0 ? Cn : e.length === 1 ? e[0] : function(n) {
      return e.reduce((r, o) => o(r), n);
    };
  }
  var ha = p(() => {
    "use strict";
    ho();
  });
  function pa(e) {
    var t;
    return (t = e ?? re.Promise) !== null && t !== void 0 ? t : Promise;
  }
  function $d(e) {
    return e && C(e.next) && C(e.error) && C(e.complete);
  }
  function Bd(e) {
    return e && e instanceof Oe || $d(e) && In(e);
  }
  var R;
  var Me = p(() => {
    "use strict";
    fo();
    Mt();
    En();
    ha();
    St();
    q();
    Dn();
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
          let i = Bd(n) ? n : new Ke(n, r, o);
          return Ye(() => {
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
          return r = pa(r), new r((o, i) => {
            let s = new Ke({ next: (a) => {
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
        [Je]() {
          return this;
        }
        pipe(...n) {
          return fa(n)(this);
        }
        toPromise(n) {
          return n = pa(n), new n((r, o) => {
            let i;
            this.subscribe((s) => i = s, (s) => o(s), () => r(i));
          });
        }
      }
      return e.create = (t) => new e(t), e;
    })();
  });
  function Ud(e) {
    return C(e?.lift);
  }
  function ce(e) {
    return (t) => {
      if (Ud(t)) return t.lift(function(n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  var Xe = p(() => {
    "use strict";
    q();
  });
  function ue(e, t, n, r, o) {
    return new po(e, t, n, r, o);
  }
  var po;
  var Tt = p(() => {
    "use strict";
    fo();
    po = class extends Oe {
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
  var ga;
  var ma = p(() => {
    "use strict";
    to();
    ga = yn((e) => function() {
      e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
    });
  });
  var Ie;
  var Mn;
  var Sn = p(() => {
    "use strict";
    Me();
    Mt();
    ma();
    no();
    Dn();
    Ie = (() => {
      class e extends R {
        constructor() {
          super(), this.closed = false, this.currentObservers = null, this.observers = [], this.isStopped = false, this.hasError = false, this.thrownError = null;
        }
        lift(n) {
          let r = new Mn(this, this);
          return r.operator = n, r;
        }
        _throwIfClosed() {
          if (this.closed) throw new ga();
        }
        next(n) {
          Ye(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.currentObservers || (this.currentObservers = Array.from(this.observers));
              for (let r of this.currentObservers) r.next(n);
            }
          });
        }
        error(n) {
          Ye(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.hasError = this.isStopped = true, this.thrownError = n;
              let { observers: r } = this;
              for (; r.length; ) r.shift().error(n);
            }
          });
        }
        complete() {
          Ye(() => {
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
          return r || o ? ro : (this.currentObservers = null, i.push(n), new G(() => {
            this.currentObservers = null, Ct(i, n);
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
      return e.create = (t, n) => new Mn(t, n), e;
    })(), Mn = class extends Ie {
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
        return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : ro;
      }
    };
  });
  var xt;
  var va = p(() => {
    "use strict";
    Sn();
    xt = class extends Ie {
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
  var go;
  var ya = p(() => {
    "use strict";
    go = { now() {
      return (go.delegate || Date).now();
    }, delegate: void 0 };
  });
  var Nt;
  var _a = p(() => {
    "use strict";
    Sn();
    ya();
    Nt = class extends Ie {
      constructor(t = 1 / 0, n = 1 / 0, r = go) {
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
  var Ia;
  var ba = p(() => {
    "use strict";
    Me();
    Ia = new R((e) => e.complete());
  });
  function Da(e) {
    return e && C(e.schedule);
  }
  var wa = p(() => {
    "use strict";
    q();
  });
  function Ea(e) {
    return e[e.length - 1];
  }
  function Ca(e) {
    return Da(Ea(e)) ? e.pop() : void 0;
  }
  function Ma(e, t) {
    return typeof Ea(e) == "number" ? e.pop() : t;
  }
  var Sa = p(() => {
    "use strict";
    wa();
  });
  function xa(e, t, n, r) {
    function o(i) {
      return i instanceof n ? i : new n(function(s) {
        s(i);
      });
    }
    return new (n || (n = Promise))(function(i, s) {
      function a(u) {
        try {
          c(r.next(u));
        } catch (f) {
          s(f);
        }
      }
      function l(u) {
        try {
          c(r.throw(u));
        } catch (f) {
          s(f);
        }
      }
      function c(u) {
        u.done ? i(u.value) : o(u.value).then(a, l);
      }
      c((r = r.apply(e, t || [])).next());
    });
  }
  function Ta(e) {
    var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
    if (n) return n.call(e);
    if (e && typeof e.length == "number") return { next: function() {
      return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
    } };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function Pe(e) {
    return this instanceof Pe ? (this.v = e, this) : new Pe(e);
  }
  function Na(e, t, n) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []), o, i = [];
    return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", s), o[Symbol.asyncIterator] = function() {
      return this;
    }, o;
    function s(d) {
      return function(g) {
        return Promise.resolve(g).then(d, f);
      };
    }
    function a(d, g) {
      r[d] && (o[d] = function(m) {
        return new Promise(function(V, k) {
          i.push([d, m, V, k]) > 1 || l(d, m);
        });
      }, g && (o[d] = g(o[d])));
    }
    function l(d, g) {
      try {
        c(r[d](g));
      } catch (m) {
        h(i[0][3], m);
      }
    }
    function c(d) {
      d.value instanceof Pe ? Promise.resolve(d.value.v).then(u, f) : h(i[0][2], d);
    }
    function u(d) {
      l("next", d);
    }
    function f(d) {
      l("throw", d);
    }
    function h(d, g) {
      d(g), i.shift(), i.length && l(i[0][0], i[0][1]);
    }
  }
  function Aa(e) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator], n;
    return t ? t.call(e) : (e = typeof Ta == "function" ? Ta(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
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
  var mo = p(() => {
    "use strict";
  });
  var Tn;
  var vo = p(() => {
    "use strict";
    Tn = (e) => e && typeof e.length == "number" && typeof e != "function";
  });
  function xn(e) {
    return C(e?.then);
  }
  var yo = p(() => {
    "use strict";
    q();
  });
  function Nn(e) {
    return C(e[Je]);
  }
  var _o = p(() => {
    "use strict";
    En();
    q();
  });
  function An(e) {
    return Symbol.asyncIterator && C(e?.[Symbol.asyncIterator]);
  }
  var Io = p(() => {
    "use strict";
    q();
  });
  function kn(e) {
    return new TypeError(`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
  }
  var bo = p(() => {
    "use strict";
  });
  function Gd() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
  }
  var Rn;
  var Do = p(() => {
    "use strict";
    Rn = Gd();
  });
  function On(e) {
    return C(e?.[Rn]);
  }
  var wo = p(() => {
    "use strict";
    Do();
    q();
  });
  function Pn(e) {
    return Na(this, arguments, function* () {
      let n = e.getReader();
      try {
        for (; ; ) {
          let { value: r, done: o } = yield Pe(n.read());
          if (o) return yield Pe(void 0);
          yield yield Pe(r);
        }
      } finally {
        n.releaseLock();
      }
    });
  }
  function Fn(e) {
    return C(e?.getReader);
  }
  var Ln = p(() => {
    "use strict";
    mo();
    q();
  });
  function Z(e) {
    if (e instanceof R) return e;
    if (e != null) {
      if (Nn(e)) return zd(e);
      if (Tn(e)) return Wd(e);
      if (xn(e)) return qd(e);
      if (An(e)) return ka(e);
      if (On(e)) return Zd(e);
      if (Fn(e)) return Qd(e);
    }
    throw kn(e);
  }
  function zd(e) {
    return new R((t) => {
      let n = e[Je]();
      if (C(n.subscribe)) return n.subscribe(t);
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function Wd(e) {
    return new R((t) => {
      for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
      t.complete();
    });
  }
  function qd(e) {
    return new R((t) => {
      e.then((n) => {
        t.closed || (t.next(n), t.complete());
      }, (n) => t.error(n)).then(null, bn);
    });
  }
  function Zd(e) {
    return new R((t) => {
      for (let n of e) if (t.next(n), t.closed) return;
      t.complete();
    });
  }
  function ka(e) {
    return new R((t) => {
      Yd(e, t).catch((n) => t.error(n));
    });
  }
  function Qd(e) {
    return ka(Pn(e));
  }
  function Yd(e, t) {
    var n, r, o, i;
    return xa(this, void 0, void 0, function* () {
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
    mo();
    vo();
    yo();
    Me();
    _o();
    Io();
    bo();
    wo();
    Ln();
    q();
    io();
    En();
  });
  function Y(e, t, n, r = 0, o = false) {
    let i = t.schedule(function() {
      n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
    }, r);
    if (e.add(i), !o) return i;
  }
  var At = p(() => {
    "use strict";
  });
  function Vn(e, t = 0) {
    return ce((n, r) => {
      n.subscribe(ue(r, (o) => Y(r, e, () => r.next(o), t), () => Y(r, e, () => r.complete(), t), (o) => Y(r, e, () => r.error(o), t)));
    });
  }
  var Eo = p(() => {
    "use strict";
    At();
    Xe();
    Tt();
  });
  function jn(e, t = 0) {
    return ce((n, r) => {
      r.add(e.schedule(() => n.subscribe(r), t));
    });
  }
  var Co = p(() => {
    "use strict";
    Xe();
  });
  function Ra(e, t) {
    return Z(e).pipe(jn(t), Vn(t));
  }
  var Oa = p(() => {
    "use strict";
    Se();
    Eo();
    Co();
  });
  function Pa(e, t) {
    return Z(e).pipe(jn(t), Vn(t));
  }
  var Fa = p(() => {
    "use strict";
    Se();
    Eo();
    Co();
  });
  function La(e, t) {
    return new R((n) => {
      let r = 0;
      return t.schedule(function() {
        r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
      });
    });
  }
  var Va = p(() => {
    "use strict";
    Me();
  });
  function ja(e, t) {
    return new R((n) => {
      let r;
      return Y(n, t, () => {
        r = e[Rn](), Y(n, t, () => {
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
  var Ha = p(() => {
    "use strict";
    Me();
    Do();
    q();
    At();
  });
  function Hn(e, t) {
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
  var Mo = p(() => {
    "use strict";
    Me();
    At();
  });
  function $a(e, t) {
    return Hn(Pn(e), t);
  }
  var Ba = p(() => {
    "use strict";
    Mo();
    Ln();
  });
  function Ua(e, t) {
    if (e != null) {
      if (Nn(e)) return Ra(e, t);
      if (Tn(e)) return La(e, t);
      if (xn(e)) return Pa(e, t);
      if (An(e)) return Hn(e, t);
      if (On(e)) return ja(e, t);
      if (Fn(e)) return $a(e, t);
    }
    throw kn(e);
  }
  var Ga = p(() => {
    "use strict";
    Oa();
    Fa();
    Va();
    Ha();
    Mo();
    _o();
    yo();
    vo();
    wo();
    Io();
    bo();
    Ln();
    Ba();
  });
  function za(e, t) {
    return t ? Ua(e, t) : Z(e);
  }
  var Wa = p(() => {
    "use strict";
    Ga();
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
  var So = p(() => {
    "use strict";
    Xe();
    Tt();
  });
  function qa(e, t, n, r, o, i, s, a) {
    let l = [], c = 0, u = 0, f = false, h = () => {
      f && !l.length && !c && t.complete();
    }, d = (m) => c < r ? g(m) : l.push(m), g = (m) => {
      i && t.next(m), c++;
      let V = false;
      Z(n(m, u++)).subscribe(ue(t, (k) => {
        o?.(k), i ? d(k) : t.next(k);
      }, () => {
        V = true;
      }, void 0, () => {
        if (V) try {
          for (c--; l.length && c < r; ) {
            let k = l.shift();
            s ? Y(t, s, () => g(k)) : g(k);
          }
          h();
        } catch (k) {
          t.error(k);
        }
      }));
    };
    return e.subscribe(ue(t, d, () => {
      f = true, h();
    })), () => {
      a?.();
    };
  }
  var Za = p(() => {
    "use strict";
    Se();
    At();
    Tt();
  });
  function To(e, t, n = 1 / 0) {
    return C(t) ? To((r, o) => kt((i, s) => t(r, i, o, s))(Z(e(r, o))), n) : (typeof t == "number" && (n = t), ce((r, o) => qa(r, o, e, n)));
  }
  var Qa = p(() => {
    "use strict";
    So();
    Se();
    Xe();
    Za();
    q();
  });
  function Ya(e = 1 / 0) {
    return To(Cn, e);
  }
  var Ka = p(() => {
    "use strict";
    Qa();
    ho();
  });
  function xo(...e) {
    let t = Ca(e), n = Ma(e, 1 / 0), r = e;
    return r.length ? r.length === 1 ? Z(r[0]) : Ya(n)(za(r, t)) : Ia;
  }
  var Ja = p(() => {
    "use strict";
    Ka();
    Se();
    ba();
    Sa();
    Wa();
  });
  var Xa = p(() => {
    "use strict";
  });
  function No(e, t) {
    return ce((n, r) => {
      let o = null, i = 0, s = false, a = () => s && !o && r.complete();
      n.subscribe(ue(r, (l) => {
        o?.unsubscribe();
        let c = 0, u = i++;
        Z(e(l, u)).subscribe(o = ue(r, (f) => r.next(t ? t(l, f, u, c++) : f), () => {
          o = null, a();
        }));
      }, () => {
        s = true, a();
      }));
    });
  }
  var el = p(() => {
    "use strict";
    Se();
    Xe();
    Tt();
  });
  var Ao = p(() => {
    "use strict";
    Me();
    Sn();
    va();
    _a();
    Mt();
    Ja();
    Xa();
  });
  var ko = p(() => {
    "use strict";
    So();
    el();
  });
  function Jd(e) {
    return `NG0${Math.abs(e)}`;
  }
  function Xd(e, t) {
    return `${Jd(e)}${t ? ": " + t : ""}`;
  }
  function Hl(e) {
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
  function tl(e, t) {
    return e ? t ? `${e} ${t}` : e : t || "";
  }
  function Ri(e) {
    return e.__forward_ref__ = Ri, e.toString = function() {
      return J(this());
    }, e;
  }
  function ie(e) {
    return tf(e) ? e() : e;
  }
  function tf(e) {
    return typeof e == "function" && e.hasOwnProperty(ef) && e.__forward_ref__ === Ri;
  }
  function O(e) {
    return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
  }
  function ur(e) {
    return { providers: e.providers || [], imports: e.imports || [] };
  }
  function Oi(e) {
    return nl(e, $l) || nl(e, Bl);
  }
  function nl(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null;
  }
  function nf(e) {
    let t = e && (e[$l] || e[Bl]);
    return t || null;
  }
  function rl(e) {
    return e && (e.hasOwnProperty(ol) || e.hasOwnProperty(rf)) ? e[ol] : null;
  }
  function Ul(e) {
    return e && !!e.\u0275providers;
  }
  function Pi(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e);
  }
  function lf(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : Pi(e);
  }
  function Gl(e, t) {
    throw new w(-200, e);
  }
  function Fi(e, t) {
    throw new w(-201, false);
  }
  function zl() {
    return Go;
  }
  function K(e) {
    let t = Go;
    return Go = e, t;
  }
  function Wl(e, t, n) {
    let r = Oi(e);
    if (r && r.providedIn == "root") return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & _.Optional) return null;
    if (t !== void 0) return t;
    Fi(e, "Injector");
  }
  function pf(e, t = _.Default) {
    if (Et() === void 0) throw new w(-203, false);
    if (Et() === null) return Wl(e, void 0, t);
    {
      let n = Et(), r;
      return n instanceof qn ? r = n.injector : r = n, r.get(e, t & _.Optional ? null : void 0, t);
    }
  }
  function T(e, t = _.Default) {
    return (zl() || pf)(ie(e), t);
  }
  function M(e, t = _.Default) {
    return T(e, dr(t));
  }
  function dr(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
  }
  function zo(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = ie(e[n]);
      if (Array.isArray(r)) {
        if (r.length === 0) throw new w(900, false);
        let o, i = _.Default;
        for (let s = 0; s < r.length; s++) {
          let a = r[s], l = gf(a);
          typeof l == "number" ? l === -1 ? o = a.token : i |= l : o = a;
        }
        t.push(T(o, i));
      } else t.push(T(r));
    }
    return t;
  }
  function gf(e) {
    return e[uf];
  }
  function mf(e, t, n, r) {
    let o = e[Zn];
    throw t[al] && o.unshift(t[al]), e.message = vf(`
` + e.message, o, n, r), e[df] = o, e[Zn] = null, e;
  }
  function vf(e, t, n, r = null) {
    e = e && e.charAt(0) === `
` && e.charAt(1) == hf ? e.slice(2) : e;
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
    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(ff, `
  `)}`;
  }
  function Lt(e, t) {
    let n = e.hasOwnProperty(il);
    return n ? e[il] : null;
  }
  function Li(e, t) {
    e.forEach((n) => Array.isArray(n) ? Li(n, t) : t(n));
  }
  function yf(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n);
  }
  function ql(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
  }
  function _f(e, t, n, r) {
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
  function If(e, t, n) {
    let r = Gt(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r, _f(e, r, t, n)), r;
  }
  function Ro(e, t) {
    let n = Gt(e, t);
    if (n >= 0) return e[n | 1];
  }
  function Gt(e, t) {
    return bf(e, t, 1);
  }
  function bf(e, t, n) {
    let r = 0, o = e.length >> n;
    for (; o !== r; ) {
      let i = r + (o - r >> 1), s = e[i << n];
      if (t === s) return i << n;
      s > t ? o = i : r = i + 1;
    }
    return ~(o << n);
  }
  function Vi(e) {
    return e[of] || null;
  }
  function Df(e) {
    return e[sf] || null;
  }
  function wf(e) {
    return e[af] || null;
  }
  function Ef(e) {
    return { \u0275providers: e };
  }
  function Cf(...e) {
    return { \u0275providers: Yl(true, e), \u0275fromNgModule: true };
  }
  function Yl(e, ...t) {
    let n = [], r = /* @__PURE__ */ new Set(), o, i = (s) => {
      n.push(s);
    };
    return Li(t, (s) => {
      let a = s;
      Wo(a, i, [], r) && (o ||= [], o.push(a));
    }), o !== void 0 && Kl(o, i), n;
  }
  function Kl(e, t) {
    for (let n = 0; n < e.length; n++) {
      let { ngModule: r, providers: o } = e[n];
      ji(o, (i) => {
        t(i, r);
      });
    }
  }
  function Wo(e, t, n, r) {
    if (e = ie(e), !e) return false;
    let o = null, i = rl(e), s = !i && Vi(e);
    if (!i && !s) {
      let l = e.ngModule;
      if (i = rl(l), i) o = l;
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
        for (let c of l) Wo(c, t, n, r);
      }
    } else if (i) {
      if (i.imports != null && !a) {
        r.add(o);
        let c;
        Li(i.imports, (u) => {
          Wo(u, t, n, r) && (c ||= [], c.push(u));
        }), c !== void 0 && Kl(c, t);
      }
      if (!a) {
        let c = Lt(o) || (() => new o());
        t({ provide: o, useFactory: c, deps: se }, o), t({ provide: Ql, useValue: o, multi: true }, o), t({ provide: Qn, useValue: () => T(o), multi: true }, o);
      }
      let l = i.providers;
      if (l != null && !a) {
        let c = e;
        ji(l, (u) => {
          t(u, c);
        });
      }
    } else return false;
    return o !== e && e.providers !== void 0;
  }
  function ji(e, t) {
    for (let n of e) Ul(n) && (n = n.\u0275providers), Array.isArray(n) ? ji(n, t) : t(n);
  }
  function Jl(e) {
    return e !== null && typeof e == "object" && Mf in e;
  }
  function Sf(e) {
    return !!(e && e.useExisting);
  }
  function Tf(e) {
    return !!(e && e.useFactory);
  }
  function qo(e) {
    return typeof e == "function";
  }
  function Hi() {
    return Oo === void 0 && (Oo = new Yn()), Oo;
  }
  function Zo(e) {
    let t = Oi(e), n = t !== null ? t.factory : Lt(e);
    if (n !== null) return n;
    if (e instanceof E) throw new w(204, false);
    if (e instanceof Function) return xf(e);
    throw new w(204, false);
  }
  function xf(e) {
    if (e.length > 0) throw new w(204, false);
    let n = nf(e);
    return n !== null ? () => n.factory(e) : () => new e();
  }
  function Nf(e) {
    if (Jl(e)) return et(void 0, e.useValue);
    {
      let t = Af(e);
      return et(t, Bn);
    }
  }
  function Af(e, t, n) {
    let r;
    if (qo(e)) {
      let o = ie(e);
      return Lt(o) || Zo(o);
    } else if (Jl(e)) r = () => ie(e.useValue);
    else if (Tf(e)) r = () => e.useFactory(...zo(e.deps || []));
    else if (Sf(e)) r = (o, i) => T(ie(e.useExisting), i !== void 0 && i & _.Optional ? _.Optional : void 0);
    else {
      let o = ie(e && (e.useClass || e.provide));
      if (kf(e)) r = () => new o(...zo(e.deps));
      else return Lt(o) || Zo(o);
    }
    return r;
  }
  function Ot(e) {
    if (e.destroyed) throw new w(205, false);
  }
  function et(e, t, n = false) {
    return { factory: e, value: t, multi: n ? [] : void 0 };
  }
  function kf(e) {
    return !!e.deps;
  }
  function Rf(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function";
  }
  function Of(e) {
    return typeof e == "function" || typeof e == "object" && e instanceof E;
  }
  function Qo(e, t) {
    for (let n of e) Array.isArray(n) ? Qo(n, t) : n && Ul(n) ? Qo(n.\u0275providers, t) : t(n);
  }
  function Xl(e, t) {
    let n;
    e instanceof Vt ? (Ot(e), n = e) : n = new qn(e);
    let r, o = _e(n), i = K(void 0);
    try {
      return t();
    } finally {
      _e(o), K(i);
    }
  }
  function Pf() {
    return zl() !== void 0 || Et() != null;
  }
  function Le(e) {
    return Array.isArray(e) && typeof e[tc] == "object";
  }
  function Ge(e) {
    return Array.isArray(e) && e[tc] === true;
  }
  function nc(e) {
    return (e.flags & 4) !== 0;
  }
  function zt(e) {
    return e.componentOffset > -1;
  }
  function $i(e) {
    return (e.flags & 1) === 1;
  }
  function ze(e) {
    return !!e.template;
  }
  function er(e) {
    return (e[v] & 512) !== 0;
  }
  function ft(e) {
    return (e[v] & 256) === 256;
  }
  function rc(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r;
  }
  function Lf(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = jf), Vf;
  }
  function Vf() {
    let e = ic(this), t = e?.current;
    if (t) {
      let n = e.previous;
      if (n === ot) e.previous = t;
      else for (let r in t) n[r] = t[r];
      e.current = null, this.ngOnChanges(t);
    }
  }
  function jf(e, t, n, r, o) {
    let i = this.declaredInputs[r], s = ic(e) || Hf(e, { previous: ot, current: null }), a = s.current || (s.current = {}), l = s.previous, c = l[i];
    a[i] = new Yo(c && c.currentValue, n, l === ot), rc(e, t, o, n);
  }
  function ic(e) {
    return e[oc] || null;
  }
  function Hf(e, t) {
    return e[oc] = t;
  }
  function De(e) {
    for (; Array.isArray(e); ) e = e[Ee];
    return e;
  }
  function sc(e, t) {
    return De(t[e]);
  }
  function Ce(e, t) {
    return De(t[e.index]);
  }
  function Bi(e, t) {
    return e.data[t];
  }
  function Ne(e, t) {
    let n = t[e];
    return Le(n) ? n : n[Ee];
  }
  function Ui(e) {
    return (e[v] & 128) === 128;
  }
  function lt(e, t) {
    return t == null ? null : e[t];
  }
  function ac(e) {
    e[tt] = 0;
  }
  function Gi(e) {
    e[v] & 1024 || (e[v] |= 1024, Ui(e) && pr(e));
  }
  function Uf(e, t) {
    for (; e > 0; ) t = t[dt], e--;
    return t;
  }
  function Wt(e) {
    return !!(e[v] & 9216 || e[X]?.dirty);
  }
  function Ko(e) {
    e[xe].changeDetectionScheduler?.notify(8), e[v] & 64 && (e[v] |= 1024), Wt(e) && pr(e);
  }
  function pr(e) {
    e[xe].changeDetectionScheduler?.notify(0);
    let t = je(e);
    for (; t !== null && !(t[v] & 8192 || (t[v] |= 8192, !Ui(t))); ) t = je(t);
  }
  function lc(e, t) {
    if (ft(e)) throw new w(911, false);
    e[Te] === null && (e[Te] = []), e[Te].push(t);
  }
  function Gf(e, t) {
    if (e[Te] === null) return;
    let n = e[Te].indexOf(t);
    n !== -1 && e[Te].splice(n, 1);
  }
  function je(e) {
    let t = e[ee];
    return Ge(t) ? t[ee] : t;
  }
  function cc(e) {
    return e[Kn] ??= [];
  }
  function uc(e) {
    return e.cleanup ??= [];
  }
  function zf() {
    return b.lFrame.elementDepthCount;
  }
  function Wf() {
    b.lFrame.elementDepthCount++;
  }
  function qf() {
    b.lFrame.elementDepthCount--;
  }
  function dc() {
    return b.bindingsEnabled;
  }
  function Zf() {
    return b.skipHydrationRootTNode !== null;
  }
  function Qf(e) {
    return b.skipHydrationRootTNode === e;
  }
  function Yf() {
    b.skipHydrationRootTNode = null;
  }
  function F() {
    return b.lFrame.lView;
  }
  function ge() {
    return b.lFrame.tView;
  }
  function zi(e) {
    return b.lFrame.contextLView = e, e[H];
  }
  function Wi(e) {
    return b.lFrame.contextLView = null, e;
  }
  function ht() {
    let e = fc();
    for (; e !== null && e.type === 64; ) e = e.parent;
    return e;
  }
  function fc() {
    return b.lFrame.currentTNode;
  }
  function Kf() {
    let e = b.lFrame, t = e.currentTNode;
    return e.isParent ? t : t.parent;
  }
  function qt(e, t) {
    let n = b.lFrame;
    n.currentTNode = e, n.isParent = t;
  }
  function hc() {
    return b.lFrame.isParent;
  }
  function Jf() {
    b.lFrame.isParent = false;
  }
  function pc() {
    return Jo;
  }
  function dl(e) {
    let t = Jo;
    return Jo = e, t;
  }
  function Xf(e) {
    return b.lFrame.bindingIndex = e;
  }
  function Zt() {
    return b.lFrame.bindingIndex++;
  }
  function eh(e) {
    let t = b.lFrame, n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e, n;
  }
  function th() {
    return b.lFrame.inI18n;
  }
  function nh(e, t) {
    let n = b.lFrame;
    n.bindingIndex = n.bindingRootIndex = e, Xo(t);
  }
  function rh() {
    return b.lFrame.currentDirectiveIndex;
  }
  function Xo(e) {
    b.lFrame.currentDirectiveIndex = e;
  }
  function oh(e) {
    let t = b.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t];
  }
  function gc(e) {
    b.lFrame.currentQueryIndex = e;
  }
  function ih(e) {
    let t = e[I];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[pe] : null;
  }
  function mc(e, t, n) {
    if (n & _.SkipSelf) {
      let o = t, i = e;
      for (; o = o.parent, o === null && !(n & _.Host); ) if (o = ih(i), o === null || (i = i[dt], o.type & 10)) break;
      if (o === null) return false;
      t = o, e = i;
    }
    let r = b.lFrame = vc();
    return r.currentTNode = t, r.lView = e, true;
  }
  function qi(e) {
    let t = vc(), n = e[I];
    b.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = false;
  }
  function vc() {
    let e = b.lFrame, t = e === null ? null : e.child;
    return t === null ? yc(e) : t;
  }
  function yc(e) {
    let t = { currentTNode: null, isParent: true, lView: null, tView: null, selectedIndex: -1, contextLView: null, elementDepthCount: 0, currentNamespace: null, currentDirectiveIndex: -1, bindingRootIndex: -1, bindingIndex: -1, currentQueryIndex: 0, parent: e, child: null, inI18n: false };
    return e !== null && (e.child = t), t;
  }
  function _c() {
    let e = b.lFrame;
    return b.lFrame = e.parent, e.currentTNode = null, e.lView = null, e;
  }
  function Zi() {
    let e = _c();
    e.isParent = true, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0;
  }
  function sh(e) {
    return (b.lFrame.contextLView = Uf(e, b.lFrame.contextLView))[H];
  }
  function We() {
    return b.lFrame.selectedIndex;
  }
  function He(e) {
    b.lFrame.selectedIndex = e;
  }
  function bc() {
    let e = b.lFrame;
    return Bi(e.tView, e.selectedIndex);
  }
  function ah() {
    return b.lFrame.currentNamespace;
  }
  function Qi() {
    return Dc;
  }
  function Yi(e) {
    Dc = e;
  }
  function lh(e, t, n) {
    let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
    if (r) {
      let s = Lf(t);
      (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i));
  }
  function wc(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
      let i = e.data[n].type.prototype, { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: l, ngAfterViewChecked: c, ngOnDestroy: u } = i;
      s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), l && (e.viewHooks ??= []).push(-n, l), c && ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)), u != null && (e.destroyHooks ??= []).push(n, u);
    }
  }
  function Un(e, t, n) {
    Ec(e, t, 3, n);
  }
  function Gn(e, t, n, r) {
    (e[v] & 3) === n && Ec(e, t, n, r);
  }
  function Lo(e, t) {
    let n = e[v];
    (n & 3) === t && (n &= 16383, n += 1, e[v] = n);
  }
  function Ec(e, t, n, r) {
    let o = r !== void 0 ? e[tt] & 65535 : 0, i = r ?? -1, s = t.length - 1, a = 0;
    for (let l = o; l < s; l++) if (typeof t[l + 1] == "number") {
      if (a = t[l], r != null && a >= r) break;
    } else t[l] < 0 && (e[tt] += 65536), (a < i || i == -1) && (ch(e, n, t, l), e[tt] = (e[tt] & 4294901760) + l + 2), l++;
  }
  function fl(e, t) {
    x(4, e, t);
    let n = y(null);
    try {
      t.call(e);
    } finally {
      y(n), x(5, e, t);
    }
  }
  function ch(e, t, n, r) {
    let o = n[r] < 0, i = n[r + 1], s = o ? -n[r] : n[r], a = e[s];
    o ? e[v] >> 14 < e[tt] >> 16 && (e[v] & 3) === t && (e[v] += 16384, fl(a, i)) : fl(a, i);
  }
  function uh(e) {
    return (e.flags & 8) !== 0;
  }
  function dh(e) {
    return (e.flags & 16) !== 0;
  }
  function fh(e, t, n) {
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
        ph(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
      }
    }
    return r;
  }
  function hh(e) {
    return e === 3 || e === 4 || e === 6;
  }
  function ph(e) {
    return e.charCodeAt(0) === 64;
  }
  function Ki(e, t) {
    if (!(t === null || t.length === 0)) if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? hl(e, n, o, null, t[++r]) : hl(e, n, o, null, null));
      }
    }
    return e;
  }
  function hl(e, t, n, r, o) {
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
  function gh(e) {
    return e !== rt;
  }
  function ei(e) {
    return e & 32767;
  }
  function mh(e) {
    return e >> 16;
  }
  function ti(e, t) {
    let n = mh(e), r = t;
    for (; n > 0; ) r = r[dt], n--;
    return r;
  }
  function pl(e) {
    let t = ni;
    return ni = e, t;
  }
  function _h(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(Ft) && (r = n[Ft]), r == null && (r = n[Ft] = yh++);
    let o = r & Cc, i = 1 << o;
    t.data[e + (o >> Mc)] |= i;
  }
  function Sc(e, t) {
    let n = Tc(e, t);
    if (n !== -1) return n;
    let r = t[I];
    r.firstCreatePass && (e.injectorIndex = t.length, Vo(r.data, e), Vo(t, null), Vo(r.blueprint, null));
    let o = xc(e, t), i = e.injectorIndex;
    if (gh(o)) {
      let s = ei(o), a = ti(o, t), l = a[I].data;
      for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | l[s + c];
    }
    return t[i + 8] = o, i;
  }
  function Vo(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
  }
  function Tc(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex;
  }
  function xc(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
    let n = 0, r = null, o = t;
    for (; o !== null; ) {
      if (r = Oc(o), r === null) return rt;
      if (n++, o = o[dt], r.injectorIndex !== -1) return r.injectorIndex | n << 16;
    }
    return rt;
  }
  function Ih(e, t, n) {
    _h(e, t, n);
  }
  function Nc(e, t, n) {
    if (n & _.Optional || e !== void 0) return e;
    Fi(t, "NodeInjector");
  }
  function Ac(e, t, n, r) {
    if (n & _.Optional && r === void 0 && (r = null), (n & (_.Self | _.Host)) === 0) {
      let o = e[it], i = K(void 0);
      try {
        return o ? o.get(t, r, n & _.Optional) : Wl(t, r, n & _.Optional);
      } finally {
        K(i);
      }
    }
    return Nc(r, t, n);
  }
  function kc(e, t, n, r = _.Default, o) {
    if (e !== null) {
      if (t[v] & 2048 && !(r & _.Self)) {
        let s = Ch(e, t, n, r, de);
        if (s !== de) return s;
      }
      let i = Rc(e, t, n, r, de);
      if (i !== de) return i;
    }
    return Ac(t, n, r, o);
  }
  function Rc(e, t, n, r, o) {
    let i = wh(n);
    if (typeof i == "function") {
      if (!mc(t, e, r)) return r & _.Host ? Nc(o, n, r) : Ac(t, n, r, o);
      try {
        let s;
        if (s = i(r), s == null && !(r & _.Optional)) Fi(n);
        else return s;
      } finally {
        Ic();
      }
    } else if (typeof i == "number") {
      let s = null, a = Tc(e, t), l = rt, c = r & _.Host ? t[fe][pe] : null;
      for ((a === -1 || r & _.SkipSelf) && (l = a === -1 ? xc(e, t) : t[a + 8], l === rt || !ml(r, false) ? a = -1 : (s = t[I], a = ei(l), t = ti(l, t))); a !== -1; ) {
        let u = t[I];
        if (gl(i, a, u.data)) {
          let f = bh(a, t, n, s, r, c);
          if (f !== de) return f;
        }
        l = t[a + 8], l !== rt && ml(r, t[I].data[a + 8] === c) && gl(i, a, t) ? (s = u, a = ei(l), t = ti(l, t)) : a = -1;
      }
    }
    return o;
  }
  function bh(e, t, n, r, o, i) {
    let s = t[I], a = s.data[e + 8], l = r == null ? zt(a) && ni : r != s && (a.type & 3) !== 0, c = o & _.Host && i === a, u = Dh(a, s, n, l, c);
    return u !== null ? ri(t, s, u, a, o) : de;
  }
  function Dh(e, t, n, r, o) {
    let i = e.providerIndexes, s = t.data, a = i & 1048575, l = e.directiveStart, c = e.directiveEnd, u = i >> 20, f = r ? a : a + u, h = o ? a + u : c;
    for (let d = f; d < h; d++) {
      let g = s[d];
      if (d < l && n === g || d >= l && g.type === n) return d;
    }
    if (o) {
      let d = s[l];
      if (d && ze(d) && d.type === n) return l;
    }
    return null;
  }
  function ri(e, t, n, r, o) {
    let i = e[n], s = t.data;
    if (i instanceof Bt) {
      let a = i;
      a.resolving && Gl(lf(s[n]));
      let l = pl(a.canSeeViewProviders);
      a.resolving = true;
      let c, u = a.injectImpl ? K(a.injectImpl) : null, f = mc(e, r, _.Default);
      try {
        i = e[n] = a.factory(void 0, o, s, e, r), t.firstCreatePass && n >= r.directiveStart && lh(n, s[n], t);
      } finally {
        u !== null && K(u), pl(l), a.resolving = false, Ic();
      }
    }
    return i;
  }
  function wh(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(Ft) ? e[Ft] : void 0;
    return typeof t == "number" ? t >= 0 ? t & Cc : Eh : t;
  }
  function gl(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> Mc)] & r);
  }
  function ml(e, t) {
    return !(e & _.Self) && !(e & _.Host && t);
  }
  function Eh() {
    return new tr(ht(), F());
  }
  function Ch(e, t, n, r, o) {
    let i = e, s = t;
    for (; i !== null && s !== null && s[v] & 2048 && !er(s); ) {
      let a = Rc(i, s, n, r | _.Self, de);
      if (a !== de) return a;
      let l = i.parent;
      if (!l) {
        let c = s[ec];
        if (c) {
          let u = c.get(n, de, r);
          if (u !== de) return u;
        }
        l = Oc(s), s = s[dt];
      }
      i = l;
    }
    return o;
  }
  function Oc(e) {
    let t = e[I], n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[pe] : null;
  }
  function vl(e, t = null, n = null, r) {
    let o = Mh(e, t, n, r);
    return o.resolveInjectorInitializers(), o;
  }
  function Mh(e, t = null, n = null, r, o = /* @__PURE__ */ new Set()) {
    let i = [n || se, Cf(e)];
    return r = r || (typeof e == "object" ? void 0 : J(e)), new Vt(i, t || Hi(), r || null, o);
  }
  function Th() {
    return new oi(F());
  }
  function nr(...e) {
  }
  function jc(e) {
    let t, n;
    function r() {
      e = nr;
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
  function yl(e) {
    return queueMicrotask(() => e()), () => {
      e = nr;
    };
  }
  function es(e) {
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
      jc(() => {
        e.callbackScheduled = false, si(e), e.isCheckStableRunning = true, es(e), e.isCheckStableRunning = false;
      });
    }
    e.scheduleInRootZone ? Zone.root.run(() => {
      t();
    }) : e._outer.run(() => {
      t();
    }), si(e);
  }
  function kh(e) {
    let t = () => {
      Ah(e);
    }, n = xh++;
    e._inner = e._inner.fork({ name: "angular", properties: { [Xi]: true, [rr]: n, [rr + n]: true }, onInvokeTask: (r, o, i, s, a, l) => {
      if (Rh(l)) return r.invokeTask(i, s, a, l);
      try {
        return _l(e), r.invokeTask(i, s, a, l);
      } finally {
        (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), Il(e);
      }
    }, onInvoke: (r, o, i, s, a, l, c) => {
      try {
        return _l(e), r.invoke(i, s, a, l, c);
      } finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !Oh(l) && t(), Il(e);
      }
    }, onHasTask: (r, o, i, s) => {
      r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, si(e), es(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask));
    }, onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), false) });
  }
  function si(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === true ? e.hasPendingMicrotasks = true : e.hasPendingMicrotasks = false;
  }
  function _l(e) {
    e._nesting++, e.isStable && (e.isStable = false, e.onUnstable.emit(null));
  }
  function Il(e) {
    e._nesting--, es(e);
  }
  function Rh(e) {
    return Hc(e, "__ignore_ng_zone__");
  }
  function Oh(e) {
    return Hc(e, "__scheduler_tick__");
  }
  function Hc(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? false : e[0]?.data?.[t] === true;
  }
  function Fh() {
    return $c(ht(), F());
  }
  function $c(e, t) {
    return new mr(Ce(e, t));
  }
  function me(e, t) {
    let n = Qr(e, t?.equal), r = n[le];
    return n.set = (o) => mn(r, o), n.update = (o) => Yr(r, o), n.asReadonly = Lh.bind(n), n;
  }
  function Lh() {
    let e = this[le];
    if (e.readonlyFn === void 0) {
      let t = () => this();
      t[le] = e, e.readonlyFn = t;
    }
    return e.readonlyFn;
  }
  function Bc(e) {
    return (e.flags & 128) === 128;
  }
  function jh() {
    return Vh++;
  }
  function Hh(e) {
    Gc.set(e[hr], e);
  }
  function li(e) {
    Gc.delete(e[hr]);
  }
  function Qt(e, t) {
    Le(t) ? (e[bl] = t[hr], Hh(t)) : e[bl] = t;
  }
  function zc(e) {
    return qc(e[Ht]);
  }
  function Wc(e) {
    return qc(e[ae]);
  }
  function qc(e) {
    for (; e !== null && !Ge(e); ) e = e[ae];
    return e;
  }
  function Zc(e) {
    ci = e;
  }
  function $h() {
    if (ci !== void 0) return ci;
    if (typeof document < "u") return document;
    throw new w(210, false);
  }
  function yr(e) {
    Dl.has(e) || (Dl.add(e), performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
  }
  function Zh(e, t, n, r) {
    qh(e, t, n, r);
  }
  function Kc(e, t, n = false) {
    return Qh(e, t, n);
  }
  function Jc(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
      let r = y(null);
      try {
        for (let o = 0; o < n.length; o += 2) {
          let i = n[o], s = n[o + 1];
          if (s !== -1) {
            let a = e.data[s];
            gc(i), a.contentQueries(2, t[s], s);
          }
        }
      } finally {
        y(r);
      }
    }
  }
  function ui(e, t, n) {
    gc(0);
    let r = y(null);
    try {
      t(e, n);
    } finally {
      y(r);
    }
  }
  function Xc(e, t, n) {
    if (nc(t)) {
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
  function Yh(e) {
    return e instanceof di ? e.changingThisBreaksApplicationSecurity : e;
  }
  function Kh(e, t) {
    return e.createText(t);
  }
  function Jh(e, t, n) {
    e.setValue(t, n);
  }
  function eu(e, t, n) {
    return e.createElement(t, n);
  }
  function fi(e, t, n, r, o) {
    e.insertBefore(t, n, r, o);
  }
  function tu(e, t, n) {
    e.appendChild(t, n);
  }
  function wl(e, t, n, r, o) {
    r !== null ? fi(e, t, n, r, o) : tu(e, t, n);
  }
  function Xh(e, t, n) {
    e.removeChild(null, t, n);
  }
  function ep(e, t, n) {
    e.setAttribute(t, "style", n);
  }
  function tp(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
  }
  function nu(e, t, n) {
    let { mergedAttrs: r, classes: o, styles: i } = n;
    r !== null && fh(e, t, r), o !== null && tp(e, t, o), i !== null && ep(e, t, i);
  }
  function np(e) {
    if (e.toLowerCase().startsWith("on")) throw new w(306, false);
  }
  function rp(e, t, n) {
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
  function op(e, t, n, r) {
    let o = 0;
    if (r) {
      for (; o < t.length && typeof t[o] == "string"; o += 2) if (t[o] === "class" && rp(t[o + 1].toLowerCase(), n, 0) !== -1) return true;
    } else if (os(e)) return false;
    if (o = t.indexOf(1, o), o > -1) {
      let i;
      for (; ++o < t.length && typeof (i = t[o]) == "string"; ) if (i.toLowerCase() === n) return true;
    }
    return false;
  }
  function os(e) {
    return e.type === 4 && e.value !== ru;
  }
  function ip(e, t, n) {
    let r = e.type === 4 && !n ? ru : e.value;
    return t === r;
  }
  function sp(e, t, n) {
    let r = 4, o = e.attrs, i = o !== null ? cp(o) : 0, s = false;
    for (let a = 0; a < t.length; a++) {
      let l = t[a];
      if (typeof l == "number") {
        if (!s && !oe(r) && !oe(l)) return false;
        if (s && oe(l)) continue;
        s = false, r = l | r & 1;
        continue;
      }
      if (!s) if (r & 4) {
        if (r = 2 | r & 1, l !== "" && !ip(e, l, n) || l === "" && t.length === 1) {
          if (oe(r)) return false;
          s = true;
        }
      } else if (r & 8) {
        if (o === null || !op(e, o, l, n)) {
          if (oe(r)) return false;
          s = true;
        }
      } else {
        let c = t[++a], u = ap(l, o, os(e), n);
        if (u === -1) {
          if (oe(r)) return false;
          s = true;
          continue;
        }
        if (c !== "") {
          let f;
          if (u > i ? f = "" : f = o[u + 1].toLowerCase(), r & 2 && c !== f) {
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
  function ap(e, t, n, r) {
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
    } else return up(t, e);
  }
  function lp(e, t, n = false) {
    for (let r = 0; r < t.length; r++) if (sp(e, t[r], n)) return true;
    return false;
  }
  function cp(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t];
      if (hh(n)) return t;
    }
    return e.length;
  }
  function up(e, t) {
    let n = e.indexOf(4);
    if (n > -1) for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
    return -1;
  }
  function El(e, t) {
    return e ? ":not(" + t.trim() + ")" : t;
  }
  function dp(e) {
    let t = e[0], n = 1, r = 2, o = "", i = false;
    for (; n < e.length; ) {
      let s = e[n];
      if (typeof s == "string") if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? o += "." + s : r & 4 && (o += " " + s);
      else o !== "" && !oe(s) && (t += El(i, o), o = ""), r = s, i = i || !oe(r);
      n++;
    }
    return o !== "" && (t += El(i, o)), t;
  }
  function fp(e) {
    return e.map(dp).join(",");
  }
  function hp(e) {
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
  function is(e, t, n, r, o, i, s, a, l, c, u) {
    let f = te + r, h = f + o, d = pp(f, h), g = typeof c == "function" ? c() : c;
    return d[I] = { type: e, blueprint: d, template: n, queries: null, viewQuery: a, declTNode: t, data: d.slice().fill(null, f), bindingStartIndex: f, expandoStartIndex: h, hostBindingOpCodes: null, firstCreatePass: true, firstUpdatePass: true, staticViewQueries: false, staticContentQueries: false, preOrderHooks: null, preOrderCheckHooks: null, contentHooks: null, contentCheckHooks: null, viewHooks: null, viewCheckHooks: null, destroyHooks: null, cleanup: null, contentQueries: null, components: null, directiveRegistry: typeof i == "function" ? i() : i, pipeRegistry: typeof s == "function" ? s() : s, firstChild: null, schemas: l, consts: g, incompleteFirstPass: false, ssrId: u };
  }
  function pp(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : qe);
    return n;
  }
  function gp(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = is(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t;
  }
  function ss(e, t, n, r, o, i, s, a, l, c, u) {
    let f = t.blueprint.slice();
    return f[Ee] = o, f[v] = r | 4 | 128 | 8 | 64 | 1024, (c !== null || e && e[v] & 2048) && (f[v] |= 2048), ac(f), f[ee] = f[dt] = e, f[H] = n, f[xe] = s || e && e[xe], f[z] = a || e && e[z], f[it] = l || e && e[it] || null, f[pe] = i, f[hr] = jh(), f[jt] = u, f[ec] = c, f[fe] = t.type == 2 ? e[fe] : f, f;
  }
  function mp(e, t, n) {
    let r = Ce(t, e), o = gp(n), i = e[xe].rendererFactory, s = su(e, ss(e, o, null, ou(n), r, t, null, i.createRenderer(r, n), null, null, null));
    return e[t.index] = s;
  }
  function ou(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64), t;
  }
  function iu(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
    return o;
  }
  function su(e, t) {
    return e[Ht] ? e[cl][ae] = t : e[Ht] = t, e[cl] = t, t;
  }
  function W(e = 1) {
    au(ge(), F(), We() + e, false);
  }
  function au(e, t, n, r) {
    if (!r) if ((t[v] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Un(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Gn(t, i, 0, n);
    }
    He(n);
  }
  function hi(e, t, n, r) {
    let o = y(null);
    try {
      let [i, s, a] = e.inputs[n], l = null;
      (s & _r.SignalBased) !== 0 && (l = t[i][le]), l !== null && l.transformFn !== void 0 ? r = l.transformFn(r) : a !== null && (r = a.call(t, r)), e.setInput !== null ? e.setInput(t, l, r, n, i) : rc(t, l, i, r);
    } finally {
      y(o);
    }
  }
  function lu(e, t, n, r, o) {
    let i = We(), s = r & 2;
    try {
      He(-1), s && t.length > te && au(e, t, te, false), x(s ? 2 : 0, o), n(r, o);
    } finally {
      He(i), x(s ? 3 : 1, o);
    }
  }
  function as(e, t, n) {
    wp(e, t, n), (n.flags & 64) === 64 && Ep(e, t, n);
  }
  function cu(e, t, n = Ce) {
    let r = t.localNames;
    if (r !== null) {
      let o = t.index + 1;
      for (let i = 0; i < r.length; i += 2) {
        let s = r[i + 1], a = s === -1 ? n(t, e) : e[s];
        e[o++] = a;
      }
    }
  }
  function vp(e, t, n, r) {
    let i = r.get(zh, Qc) || n === he.ShadowDom, s = e.selectRootElement(t, i);
    return yp(s), s;
  }
  function yp(e) {
    _p(e);
  }
  function Ip(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e;
  }
  function bp(e, t, n, r, o, i, s, a) {
    if (!a && ls(t, e, n, r, o)) {
      zt(t) && Dp(n, t.index);
      return;
    }
    if (t.type & 3) {
      let l = Ce(t, n);
      r = Ip(r), o = s != null ? s(o, t.value || "", r) : o, i.setProperty(l, r, o);
    } else t.type & 12;
  }
  function Dp(e, t) {
    let n = Ne(t, e);
    n[v] & 16 || (n[v] |= 64);
  }
  function wp(e, t, n) {
    let r = n.directiveStart, o = n.directiveEnd;
    zt(n) && mp(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Sc(n, t);
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
      let a = e.data[s], l = ri(t, e, s, n);
      if (Qt(l, t), i !== null && Tp(t, s - r, l, a, n, i), ze(a)) {
        let c = Ne(n.index, t);
        c[H] = ri(t, e, s, n);
      }
    }
  }
  function Ep(e, t, n) {
    let r = n.directiveStart, o = n.directiveEnd, i = n.index, s = rh();
    try {
      He(i);
      for (let a = r; a < o; a++) {
        let l = e.data[a], c = t[a];
        Xo(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && Cp(l, c);
      }
    } finally {
      He(-1), Xo(s);
    }
  }
  function Cp(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t);
  }
  function uu(e, t) {
    let n = e.directiveRegistry, r = null;
    if (n) for (let o = 0; o < n.length; o++) {
      let i = n[o];
      lp(t, i.selectors, false) && (r ??= [], ze(i) ? r.unshift(i) : r.push(i));
    }
    return r;
  }
  function Mp(e, t, n, r, o, i) {
    t[I].firstUpdatePass && np(n);
    let s = Ce(e, t);
    Sp(t[z], s, i, e.value, n, r, o);
  }
  function Sp(e, t, n, r, o, i, s) {
    if (i == null) e.removeAttribute(t, o, n);
    else {
      let a = s == null ? Pi(i) : s(i, r || "", o);
      e.setAttribute(t, o, a, n);
    }
  }
  function Tp(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null) for (let a = 0; a < s.length; a += 2) {
      let l = s[a], c = s[a + 1];
      hi(r, n, l, c);
    }
  }
  function xp(e, t) {
    let n = e[it], r = n ? n.get(we, null) : null;
    r && r.handleError(t);
  }
  function ls(e, t, n, r, o) {
    let i = e.inputs?.[r], s = e.hostDirectiveInputs?.[r], a = false;
    if (s) for (let l = 0; l < s.length; l += 2) {
      let c = s[l], u = s[l + 1], f = t.data[c];
      hi(f, n[c], u, o), a = true;
    }
    if (i) for (let l of i) {
      let c = n[l], u = t.data[l];
      hi(u, c, r, o), a = true;
    }
    return a;
  }
  function Np(e, t) {
    let n = Ne(t, e), r = n[I];
    Ap(r, n);
    let o = n[Ee];
    o !== null && n[jt] === null && (n[jt] = Kc(o, n[it])), x(18), cs(r, n, n[H]), x(19, n[H]);
  }
  function Ap(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
  }
  function cs(e, t, n) {
    qi(t);
    try {
      let r = e.viewQuery;
      r !== null && ui(1, r, n);
      let o = e.template;
      o !== null && lu(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = false), t[at]?.finishViewCreation(e), e.staticContentQueries && Jc(e, t), e.staticViewQueries && ui(2, e.viewQuery, n);
      let i = e.components;
      i !== null && kp(t, i);
    } catch (r) {
      throw e.firstCreatePass && (e.incompleteFirstPass = true, e.firstCreatePass = false), r;
    } finally {
      t[v] &= -5, Zi();
    }
  }
  function kp(e, t) {
    for (let n = 0; n < t.length; n++) Np(e, t[n]);
  }
  function us(e, t, n, r) {
    let o = y(null);
    try {
      let i = t.tView, a = e[v] & 4096 ? 4096 : 16, l = ss(e, i, n, a, null, t, null, null, r?.injector ?? null, r?.embeddedViewInjector ?? null, r?.dehydratedView ?? null), c = e[t.index];
      l[st] = c;
      let u = e[at];
      return u !== null && (l[at] = u.createEmbeddedView(i)), cs(i, l, n), l;
    } finally {
      y(o);
    }
  }
  function ds(e, t) {
    return !t || t.firstChild === null || Bc(e);
  }
  function fs(e, t) {
    return Rp(e, t);
  }
  function du(e) {
    return (e.flags & 32) === 32;
  }
  function nt(e, t, n, r, o) {
    if (r != null) {
      let i, s = false;
      Ge(r) ? i = r : Le(r) && (s = true, r = r[Ee]);
      let a = De(r);
      e === 0 && n !== null ? o == null ? tu(t, n, a) : fi(t, n, a, o || null, true) : e === 1 && n !== null ? fi(t, n, a, o || null, true) : e === 2 ? Xh(t, a, s) : e === 3 && t.destroyNode(a), i != null && zp(t, e, i, n, o);
    }
  }
  function Op(e, t) {
    fu(e, t), t[Ee] = null, t[pe] = null;
  }
  function Pp(e, t, n, r, o, i) {
    r[Ee] = o, r[pe] = t, Ir(e, r, n, 1, o, i);
  }
  function fu(e, t) {
    t[xe].changeDetectionScheduler?.notify(9), Ir(e, t, t[z], 2, null, null);
  }
  function Fp(e) {
    let t = e[Ht];
    if (!t) return jo(e[I], e);
    for (; t; ) {
      let n = null;
      if (Le(t)) n = t[Ht];
      else {
        let r = t[Q];
        r && (n = r);
      }
      if (!n) {
        for (; t && !t[ae] && t !== e; ) Le(t) && jo(t[I], t), t = t[ee];
        t === null && (t = e), Le(t) && jo(t[I], t), n = t && t[ae];
      }
      t = n;
    }
  }
  function hs(e, t) {
    let n = e[Xn], r = n.indexOf(t);
    n.splice(r, 1);
  }
  function ps(e, t) {
    if (ft(t)) return;
    let n = t[z];
    n.destroyNode && Ir(e, t, n, 3, null, null), Fp(t);
  }
  function jo(e, t) {
    if (ft(t)) return;
    let n = y(null);
    try {
      t[v] &= -129, t[v] |= 256, t[X] && Wr(t[X]), Vp(e, t), Lp(e, t), t[I].type === 1 && t[z].destroy();
      let r = t[st];
      if (r !== null && Ge(t[ee])) {
        r !== t[ee] && hs(r, t);
        let o = t[at];
        o !== null && o.detachView(e);
      }
      li(t);
    } finally {
      y(n);
    }
  }
  function Lp(e, t) {
    let n = e.cleanup, r = t[Kn];
    if (n !== null) for (let s = 0; s < n.length - 1; s += 2) if (typeof n[s] == "string") {
      let a = n[s + 3];
      a >= 0 ? r[a]() : r[-a].unsubscribe(), s += 2;
    } else {
      let a = r[n[s + 1]];
      n[s].call(a);
    }
    r !== null && (t[Kn] = null);
    let o = t[Te];
    if (o !== null) {
      t[Te] = null;
      for (let s = 0; s < o.length; s++) {
        let a = o[s];
        a();
      }
    }
    let i = t[Jn];
    if (i !== null) {
      t[Jn] = null;
      for (let s of i) s.destroy();
    }
  }
  function Vp(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null) for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof Bt)) {
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
  function jp(e, t, n) {
    return Hp(e, t.parent, n);
  }
  function Hp(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168; ) t = r, r = t.parent;
    if (r === null) return n[Ee];
    if (zt(r)) {
      let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
      if (o === he.None || o === he.Emulated) return null;
    }
    return Ce(r, n);
  }
  function $p(e, t, n) {
    return Up(e, t, n);
  }
  function Bp(e, t, n) {
    return e.type & 40 ? Ce(e, n) : null;
  }
  function gs(e, t, n, r) {
    let o = jp(e, r, t), i = t[z], s = r.parent || t[pe], a = $p(s, r, t);
    if (o != null) if (Array.isArray(n)) for (let l = 0; l < n.length; l++) wl(i, o, n[l], a, false);
    else wl(i, o, n, a, false);
    Cl !== void 0 && Cl(i, r, t, n, o);
  }
  function Pt(e, t) {
    if (t !== null) {
      let n = t.type;
      if (n & 3) return Ce(t, e);
      if (n & 4) return pi(-1, e[t.index]);
      if (n & 8) {
        let r = t.child;
        if (r !== null) return Pt(e, r);
        {
          let o = e[t.index];
          return Ge(o) ? pi(-1, o) : De(o);
        }
      } else {
        if (n & 128) return Pt(e, t.next);
        if (n & 32) return fs(t, e)() || De(e[t.index]);
        {
          let r = hu(e, t);
          if (r !== null) {
            if (Array.isArray(r)) return r[0];
            let o = je(e[fe]);
            return Pt(o, r);
          } else return Pt(e, t.next);
        }
      }
    }
    return null;
  }
  function hu(e, t) {
    if (t !== null) {
      let r = e[fe][pe], o = t.projection;
      return r.projection[o];
    }
    return null;
  }
  function pi(e, t) {
    let n = Q + e + 1;
    if (n < t.length) {
      let r = t[n], o = r[I].firstChild;
      if (o !== null) return Pt(r, o);
    }
    return t[$t];
  }
  function ms(e, t, n, r, o, i, s) {
    for (; n != null; ) {
      if (n.type === 128) {
        n = n.next;
        continue;
      }
      let a = r[n.index], l = n.type;
      if (s && t === 0 && (a && Qt(De(a), r), n.flags |= 2), !du(n)) if (l & 8) ms(e, t, n.child, r, o, i, false), nt(t, e, o, a, i);
      else if (l & 32) {
        let c = fs(n, r), u;
        for (; u = c(); ) nt(t, e, o, u, i);
        nt(t, e, o, a, i);
      } else l & 16 ? Gp(e, t, r, n, o, i) : nt(t, e, o, a, i);
      n = s ? n.projectionNext : n.next;
    }
  }
  function Ir(e, t, n, r, o, i) {
    ms(n, r, e.firstChild, t, o, i, false);
  }
  function Gp(e, t, n, r, o, i) {
    let s = n[fe], l = s[pe].projection[r.projection];
    if (Array.isArray(l)) for (let c = 0; c < l.length; c++) {
      let u = l[c];
      nt(t, e, o, u, i);
    }
    else {
      let c = l, u = s[ee];
      Bc(r) && (c.flags |= 128), ms(e, t, c, u, o, i, true);
    }
  }
  function zp(e, t, n, r, o) {
    let i = n[$t], s = De(n);
    i !== s && nt(t, e, r, i, o);
    for (let a = Q; a < n.length; a++) {
      let l = n[a];
      Ir(l[I], l, e, t, r, i);
    }
  }
  function Wp(e, t, n, r, o) {
    if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
      let i = r.indexOf("-") === -1 ? void 0 : ke.DashCase;
      o == null ? e.removeStyle(n, r, i) : (typeof o == "string" && o.endsWith("!important") && (o = o.slice(0, -10), i |= ke.Important), e.setStyle(n, r, o, i));
    }
  }
  function or(e, t, n, r, o = false) {
    for (; n !== null; ) {
      if (n.type === 128) {
        n = o ? n.projectionNext : n.next;
        continue;
      }
      let i = t[n.index];
      i !== null && r.push(De(i)), Ge(i) && qp(i, r);
      let s = n.type;
      if (s & 8) or(e, t, n.child, r);
      else if (s & 32) {
        let a = fs(n, t), l;
        for (; l = a(); ) r.push(l);
      } else if (s & 16) {
        let a = hu(t, n);
        if (Array.isArray(a)) r.push(...a);
        else {
          let l = je(t[fe]);
          or(l[I], l, a, r, true);
        }
      }
      n = o ? n.projectionNext : n.next;
    }
    return r;
  }
  function qp(e, t) {
    for (let n = Q; n < e.length; n++) {
      let r = e[n], o = r[I].firstChild;
      o !== null && or(r[I], r, o, t);
    }
    e[$t] !== e[Ee] && t.push(e[$t]);
  }
  function pu(e) {
    if (e[Fo] !== null) {
      for (let t of e[Fo]) t.impl.addSequence(t);
      e[Fo].length = 0;
    }
  }
  function Zp(e) {
    return e[X] ?? Qp(e);
  }
  function Qp(e) {
    let t = gu.pop() ?? Object.create(Kp);
    return t.lView = e, t;
  }
  function Yp(e) {
    e.lView[X] !== e && (e.lView = null, gu.push(e));
  }
  function Jp(e) {
    let t = e[X] ?? Object.create(Xp);
    return t.lView = e, t;
  }
  function mu(e) {
    return e.type !== 2;
  }
  function vu(e) {
    if (e[Jn] === null) return;
    let t = true;
    for (; t; ) {
      let n = false;
      for (let r of e[Jn]) r.dirty && (n = true, r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
      t = n && !!(e[v] & 8192);
    }
  }
  function yu(e, t = true, n = 0) {
    let o = e[xe].rendererFactory, i = false;
    i || o.begin?.();
    try {
      tg(e, n);
    } catch (s) {
      throw t && xp(e, s), s;
    } finally {
      i || o.end?.();
    }
  }
  function tg(e, t) {
    let n = pc();
    try {
      dl(true), gi(e, t);
      let r = 0;
      for (; Wt(e); ) {
        if (r === eg) throw new w(103, false);
        r++, gi(e, 1);
      }
    } finally {
      dl(n);
    }
  }
  function ng(e, t, n, r) {
    if (ft(t)) return;
    let o = t[v], i = false, s = false;
    qi(t);
    let a = true, l = null, c = null;
    i || (mu(e) ? (c = Zp(t), l = hn(c)) : Hr() === null ? (a = false, c = Jp(t), l = hn(c)) : t[X] && (Wr(t[X]), t[X] = null));
    try {
      ac(t), Xf(e.bindingStartIndex), n !== null && lu(e, t, n, 2, r);
      let u = (o & 3) === 3;
      if (!i) if (u) {
        let d = e.preOrderCheckHooks;
        d !== null && Un(t, d, null);
      } else {
        let d = e.preOrderHooks;
        d !== null && Gn(t, d, 0, null), Lo(t, 0);
      }
      if (s || rg(t), vu(t), _u(t, 0), e.contentQueries !== null && Jc(e, t), !i) if (u) {
        let d = e.contentCheckHooks;
        d !== null && Un(t, d);
      } else {
        let d = e.contentHooks;
        d !== null && Gn(t, d, 1), Lo(t, 1);
      }
      ig(e, t);
      let f = e.components;
      f !== null && bu(t, f, 0);
      let h = e.viewQuery;
      if (h !== null && ui(2, h, r), !i) if (u) {
        let d = e.viewCheckHooks;
        d !== null && Un(t, d);
      } else {
        let d = e.viewHooks;
        d !== null && Gn(t, d, 2), Lo(t, 2);
      }
      if (e.firstUpdatePass === true && (e.firstUpdatePass = false), t[Po]) {
        for (let d of t[Po]) d();
        t[Po] = null;
      }
      i || (pu(t), t[v] &= -73);
    } catch (u) {
      throw i || pr(t), u;
    } finally {
      c !== null && (Gr(c, l), a && Yp(c)), Zi();
    }
  }
  function _u(e, t) {
    for (let n = zc(e); n !== null; n = Wc(n)) for (let r = Q; r < n.length; r++) {
      let o = n[r];
      Iu(o, t);
    }
  }
  function rg(e) {
    for (let t = zc(e); t !== null; t = Wc(t)) {
      if (!(t[v] & 2)) continue;
      let n = t[Xn];
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        Gi(o);
      }
    }
  }
  function og(e, t, n) {
    x(18);
    let r = Ne(t, e);
    Iu(r, n), x(19, r[H]);
  }
  function Iu(e, t) {
    Ui(e) && gi(e, t);
  }
  function gi(e, t) {
    let r = e[I], o = e[v], i = e[X], s = !!(t === 0 && o & 16);
    if (s ||= !!(o & 64 && t === 0), s ||= !!(o & 1024), s ||= !!(i?.dirty && zr(i)), s ||= false, i && (i.dirty = false), e[v] &= -9217, s) ng(r, e, r.template, e[H]);
    else if (o & 8192) {
      vu(e), _u(e, 1);
      let a = r.components;
      a !== null && bu(e, a, 1), pu(e);
    }
  }
  function bu(e, t, n) {
    for (let r = 0; r < t.length; r++) og(e, t[r], n);
  }
  function ig(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null) try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) He(~o);
        else {
          let i = o, s = n[++r], a = n[++r];
          nh(s, i);
          let l = t[i];
          x(24, l), a(2, l), x(25, l);
        }
      }
    } finally {
      He(-1);
    }
  }
  function vs(e, t) {
    let n = pc() ? 64 : 1088;
    for (e[xe].changeDetectionScheduler?.notify(t); e; ) {
      e[v] |= n;
      let r = je(e);
      if (er(e) && !r) return e;
      e = r;
    }
    return null;
  }
  function sg(e, t, n, r) {
    return [e, true, 0, t, null, r, null, n, null, null];
  }
  function Du(e, t) {
    let n = Q + t;
    if (n < e.length) return e[n];
  }
  function ys(e, t, n, r = true) {
    let o = t[I];
    if (ag(o, t, e, n), r) {
      let s = pi(n, e), a = t[z], l = a.parentNode(e[$t]);
      l !== null && Pp(o, e[pe], a, t, l, s);
    }
    let i = t[jt];
    i !== null && i.firstChild !== null && (i.firstChild = null);
  }
  function wu(e, t) {
    let n = _s(e, t);
    return n !== void 0 && ps(n[I], n), n;
  }
  function _s(e, t) {
    if (e.length <= Q) return;
    let n = Q + t, r = e[n];
    if (r) {
      let o = r[st];
      o !== null && o !== e && hs(o, r), t > 0 && (e[n - 1][ae] = r[ae]);
      let i = ql(e, Q + t);
      Op(r[I], r);
      let s = i[at];
      s !== null && s.detachView(i[I]), r[ee] = null, r[ae] = null, r[v] &= -129;
    }
    return r;
  }
  function ag(e, t, n, r) {
    let o = Q + r, i = n.length;
    r > 0 && (n[o - 1][ae] = t), r < i - Q ? (t[ae] = n[o], yf(n, Q + r, t)) : (n.push(t), t[ae] = null), t[ee] = n;
    let s = t[st];
    s !== null && n !== s && Eu(s, t);
    let a = t[at];
    a !== null && a.insertView(e), Ko(t), t[v] |= 128;
  }
  function Eu(e, t) {
    let n = e[Xn], r = t[ee];
    if (Le(r)) e[v] |= 2;
    else {
      let o = r[ee][fe];
      t[fe] !== o && (e[v] |= 2);
    }
    n === null ? e[Xn] = [t] : n.push(t);
  }
  function Cu(e) {
    return Wt(e._lView) || !!(e._lView[v] & 64);
  }
  function Mu(e) {
    Gi(e._cdRefInjectingView || e._lView);
  }
  function Is(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) i = cg(e, t, n, r, o), th() && (i.flags |= 32);
    else if (i.type & 64) {
      i.type = n, i.value = r, i.attrs = o;
      let s = Kf();
      i.injectorIndex = s === null ? -1 : s.injectorIndex;
    }
    return qt(i, true), i;
  }
  function cg(e, t, n, r, o) {
    let i = fc(), s = hc(), a = s ? i : i && i.parent, l = e.data[t] = dg(e, a, n, t, r, o);
    return ug(e, l, i, s), l;
  }
  function ug(e, t, n, r) {
    e.firstChild === null && (e.firstChild = t), n !== null && (r ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n));
  }
  function dg(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1, a = 0;
    return Zf() && (a |= 128), { type: n, index: r, insertBeforeIndex: null, injectorIndex: s, directiveStart: -1, directiveEnd: -1, directiveStylingLast: -1, componentOffset: -1, propertyBindings: null, flags: a, providerIndexes: 0, value: o, attrs: i, mergedAttrs: null, localNames: null, initialInputs: null, inputs: null, hostDirectiveInputs: null, outputs: null, hostDirectiveOutputs: null, directiveToIndex: null, tView: null, next: null, prev: null, projectionNext: null, child: null, parent: t, projection: null, styles: null, stylesWithoutHost: null, residualStyles: void 0, classes: null, classesWithoutHost: null, residualClasses: void 0, classBindings: 0, styleBindings: 0 };
  }
  function bs(e, t) {
    return fg(e, t);
  }
  function Ml(e, t, n) {
    let r = n ? e.styles : null, o = n ? e.classes : null, i = 0;
    if (t !== null) for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = tl(o, a);
      else if (i == 2) {
        let l = a, c = t[++s];
        r = tl(r, l + ": " + c + ";");
      }
    }
    n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o;
  }
  function Tu(e, t = _.Default) {
    let n = F();
    if (n === null) return T(e, t);
    let r = ht();
    return kc(r, n, ie(e), t);
  }
  function xu(e, t, n, r, o) {
    let i = r === null ? null : { "": -1 }, s = o(e, n);
    if (s !== null) {
      let a, l = null, c = null, u = mg(s);
      u === null ? a = s : [a, l, c] = u, _g(e, t, n, a, i, l, c);
    }
    i !== null && r !== null && gg(n, r, i);
  }
  function gg(e, t, n) {
    let r = e.localNames = [];
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new w(-301, false);
      r.push(t[o], i);
    }
  }
  function mg(e) {
    let t = null, n = false;
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (s === 0 && ze(a) && (t = a), a.findHostDirectiveDefs !== null) {
        n = true;
        break;
      }
    }
    if (!n) return null;
    let r = null, o = null, i = null;
    for (let s of e) s.findHostDirectiveDefs !== null && (r ??= [], o ??= /* @__PURE__ */ new Map(), i ??= /* @__PURE__ */ new Map(), vg(s, r, i, o)), s === t && (r ??= [], r.push(s));
    return r !== null ? (r.push(...t === null ? e : e.slice(1)), [r, o, i]) : null;
  }
  function vg(e, t, n, r) {
    let o = t.length;
    e.findHostDirectiveDefs(e, t, r), n.set(e, [o, t.length - 1]);
  }
  function yg(e, t, n) {
    t.componentOffset = n, (e.components ??= []).push(t.index);
  }
  function _g(e, t, n, r, o, i, s) {
    let a = r.length, l = false;
    for (let h = 0; h < a; h++) {
      let d = r[h];
      !l && ze(d) && (l = true, yg(e, n, h)), Ih(Sc(n, t), e, d.type);
    }
    Cg(n, e.data.length, a);
    for (let h = 0; h < a; h++) {
      let d = r[h];
      d.providersResolver && d.providersResolver(d);
    }
    let c = false, u = false, f = iu(e, t, a, null);
    a > 0 && (n.directiveToIndex = /* @__PURE__ */ new Map());
    for (let h = 0; h < a; h++) {
      let d = r[h];
      if (n.mergedAttrs = Ki(n.mergedAttrs, d.hostAttrs), bg(e, n, t, f, d), Eg(f, d, o), s !== null && s.has(d)) {
        let [m, V] = s.get(d);
        n.directiveToIndex.set(d.type, [f, m + n.directiveStart, V + n.directiveStart]);
      } else (i === null || !i.has(d)) && n.directiveToIndex.set(d.type, f);
      d.contentQueries !== null && (n.flags |= 4), (d.hostBindings !== null || d.hostAttrs !== null || d.hostVars !== 0) && (n.flags |= 64);
      let g = d.type.prototype;
      !c && (g.ngOnChanges || g.ngOnInit || g.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), c = true), !u && (g.ngOnChanges || g.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), u = true), f++;
    }
    Ig(e, n, i);
  }
  function Ig(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
      let o = e.data[r];
      if (n === null || !n.has(o)) Sl(0, t, o, r), Sl(1, t, o, r), xl(t, r, false);
      else {
        let i = n.get(o);
        Tl(0, t, i, r), Tl(1, t, i, r), xl(t, r, true);
      }
    }
  }
  function Sl(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o) if (o.hasOwnProperty(i)) {
      let s;
      e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {}, s[i] ??= [], s[i].push(r), Nu(t, i);
    }
  }
  function Tl(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o) if (o.hasOwnProperty(i)) {
      let s = o[i], a;
      e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {}, a[s] ??= [], a[s].push(r, i), Nu(t, s);
    }
  }
  function Nu(e, t) {
    t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16);
  }
  function xl(e, t, n) {
    let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
    if (r === null || !n && o === null || n && i === null || os(e)) {
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
  function bg(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = Lt(o.type, true)), s = new Bt(i, ze(o), Tu);
    e.blueprint[r] = s, n[r] = s, Dg(e, t, r, iu(e, n, o.hostVars, qe), o);
  }
  function Dg(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
      let s = e.hostBindingOpCodes;
      s === null && (s = e.hostBindingOpCodes = []);
      let a = ~t.index;
      wg(s) != a && s.push(a), s.push(n, r, i);
    }
  }
  function wg(e) {
    let t = e.length;
    for (; t > 0; ) {
      let n = e[--t];
      if (typeof n == "number" && n < 0) return n;
    }
    return 0;
  }
  function Eg(e, t, n) {
    if (n) {
      if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
      ze(t) && (n[""] = e);
    }
  }
  function Cg(e, t, n) {
    e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t;
  }
  function Au(e, t, n, r, o, i, s, a) {
    let l = t.consts, c = lt(l, s), u = Is(t, e, 2, r, c);
    return i && xu(t, n, u, lt(l, a), o), u.mergedAttrs = Ki(u.mergedAttrs, u.attrs), u.attrs !== null && Ml(u, u.attrs, false), u.mergedAttrs !== null && Ml(u, u.mergedAttrs, true), t.queries !== null && t.queries.elementStart(t, u), u;
  }
  function ku(e, t) {
    wc(e, t), nc(t) && e.queries.elementEnd(t);
  }
  function Mg(e) {
    return Object.keys(e).map((t) => {
      let [n, r, o] = e[t], i = { propName: n, templateName: t, isSignal: (r & _r.SignalBased) !== 0 };
      return o && (i.transform = o), i;
    });
  }
  function Sg(e) {
    return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
  }
  function Tg(e, t, n) {
    let r = t instanceof Ve ? t : t?.injector;
    return r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r), r ? new vi(n, r) : n;
  }
  function xg(e) {
    let t = e.get(ct, null);
    if (t === null) throw new w(407, false);
    let n = e.get(pg, null), r = e.get($e, null);
    return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r };
  }
  function Ng(e, t) {
    let n = (e.selectors[0][0] || "div").toLowerCase();
    return eu(t, n, n === "svg" ? $f : n === "math" ? Bf : null);
  }
  function Ag(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
      let i = n[o];
      r.push(i != null && i.length ? Array.from(i) : null);
    }
  }
  function Rg(e, t, n) {
    return kg(e, t, n);
  }
  function Og(e, t, n = null) {
    return new ir({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: true }).injector;
  }
  function Ru(e) {
    return Hl(() => {
      let t = Hg(e), n = B(D({}, t), { decls: e.decls, vars: e.vars, template: e.template, consts: e.consts || null, ngContentSelectors: e.ngContentSelectors, onPush: e.changeDetection === Uc.OnPush, directiveDefs: null, pipeDefs: null, dependencies: t.standalone && e.dependencies || null, getStandaloneInjector: t.standalone ? (o) => o.get(Pg).getOrCreateStandaloneInjector(n) : null, getExternalStyles: null, signals: e.signals ?? false, data: e.data || {}, encapsulation: e.encapsulation || he.Emulated, styles: e.styles || se, _: null, schemas: e.schemas || null, tView: null, id: "" });
      t.standalone && yr("NgStandalone"), $g(n);
      let r = e.dependencies;
      return n.directiveDefs = Nl(r, false), n.pipeDefs = Nl(r, true), n.id = Bg(n), n;
    });
  }
  function Fg(e) {
    return Vi(e) || Df(e);
  }
  function Lg(e) {
    return e !== null;
  }
  function br(e) {
    return Hl(() => ({ type: e.type, bootstrap: e.bootstrap || se, declarations: e.declarations || se, imports: e.imports || se, exports: e.exports || se, transitiveCompileScopes: null, schemas: e.schemas || null, id: e.id || null }));
  }
  function Vg(e, t) {
    if (e == null) return ot;
    let n = {};
    for (let r in e) if (e.hasOwnProperty(r)) {
      let o = e[r], i, s, a, l;
      Array.isArray(o) ? (a = o[0], i = o[1], s = o[2] ?? i, l = o[3] || null) : (i = o, s = o, a = _r.None, l = null), n[i] = [r, a, l], t[i] = s;
    }
    return n;
  }
  function jg(e) {
    if (e == null) return ot;
    let t = {};
    for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
    return t;
  }
  function Hg(e) {
    let t = {};
    return { type: e.type, providersResolver: null, factory: null, hostBindings: e.hostBindings || null, hostVars: e.hostVars || 0, hostAttrs: e.hostAttrs || null, contentQueries: e.contentQueries || null, declaredInputs: t, inputConfig: e.inputs || ot, exportAs: e.exportAs || null, standalone: e.standalone ?? true, signals: e.signals === true, selectors: e.selectors || se, viewQuery: e.viewQuery || null, features: e.features || null, setInput: null, findHostDirectiveDefs: null, hostDirectives: null, inputs: Vg(e.inputs, t), outputs: jg(e.outputs), debugInfo: null };
  }
  function $g(e) {
    e.features?.forEach((t) => t(e));
  }
  function Nl(e, t) {
    if (!e) return null;
    let n = t ? wf : Fg;
    return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Lg);
  }
  function Bg(e) {
    let t = 0, n = typeof e.consts == "function" ? "" : e.consts, r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|")) t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648, "c" + t;
  }
  function gt(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? false : (e[t] = n, true);
  }
  function Ug(e, t, n, r, o, i, s, a, l) {
    let c = t.consts, u = Is(t, e, 4, s || null, a || null);
    dc() && xu(t, n, u, lt(c, l), uu), u.mergedAttrs = Ki(u.mergedAttrs, u.attrs), wc(t, u);
    let f = u.tView = is(2, u, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, c, null);
    return t.queries !== null && (t.queries.template(t, u), f.queries = t.queries.embeddedTView(u)), u;
  }
  function Di(e, t, n, r, o, i, s, a, l, c) {
    let u = n + te, f = t.firstCreatePass ? Ug(u, t, e, r, o, i, s, a, l) : t.data[u];
    qt(f, false);
    let h = Gg(t, e, f, n);
    Qi() && gs(t, e, h, f), Qt(h, e);
    let d = sg(h, e, h, f);
    return e[u] = d, su(e, d), Rg(d, f, e), $i(f) && as(t, e, f), l != null && cu(e, f, c), f;
  }
  function Kt(e, t, n, r, o, i, s, a) {
    let l = F(), c = ge(), u = lt(c.consts, i);
    return Di(l, c, e, t, n, r, o, u, s, a), Kt;
  }
  function zg(e, t, n, r) {
    return Yi(true), t[z].createComment("");
  }
  function Ds(e) {
    return !!e && typeof e.then == "function";
  }
  function qg(e) {
    return !!e && typeof e.subscribe == "function";
  }
  function Yg() {
    Zr(() => {
      throw new w(600, false);
    });
  }
  function Kg(e) {
    return e.isBoundToModule;
  }
  function zn(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  }
  function Xg(e, t, n, r) {
    if (!n && !Wt(e)) return;
    yu(e, t, n && !r ? 0 : 1);
  }
  function Dr(e, t, n, r) {
    let o = F(), i = Zt();
    if (gt(o, i, t)) {
      let s = ge(), a = bc();
      Mp(a, o, e, t, n, r);
    }
    return Dr;
  }
  function em(e, t, n, r) {
    return gt(e, Zt(), n) ? t + Pi(n) + r : qe;
  }
  function $n(e, t) {
    return e << 17 | t << 2;
  }
  function Ue(e) {
    return e >> 17 & 32767;
  }
  function tm(e) {
    return (e & 2) == 2;
  }
  function nm(e, t) {
    return e & 131071 | t << 17;
  }
  function Ei(e) {
    return e | 2;
  }
  function ut(e) {
    return (e & 131068) >> 2;
  }
  function $o(e, t) {
    return e & -131069 | t << 2;
  }
  function rm(e) {
    return (e & 1) === 1;
  }
  function Ci(e) {
    return e | 1;
  }
  function om(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings, a = Ue(s), l = ut(s);
    e[r] = n;
    let c = false, u;
    if (Array.isArray(n)) {
      let f = n;
      u = f[1], (u === null || Gt(f, u) > 0) && (c = true);
    } else u = n;
    if (o) if (l !== 0) {
      let h = Ue(e[a + 1]);
      e[r + 1] = $n(h, a), h !== 0 && (e[h + 1] = $o(e[h + 1], r)), e[a + 1] = nm(e[a + 1], r);
    } else e[r + 1] = $n(a, 0), a !== 0 && (e[a + 1] = $o(e[a + 1], r)), a = r;
    else e[r + 1] = $n(l, 0), a === 0 ? a = r : e[l + 1] = $o(e[l + 1], r), l = r;
    c && (e[r + 1] = Ei(e[r + 1])), Al(e, u, r, true), Al(e, u, r, false), im(t, u, e, r, i), s = $n(a, l), i ? t.classBindings = s : t.styleBindings = s;
  }
  function im(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null && typeof t == "string" && Gt(i, t) >= 0 && (n[r + 1] = Ci(n[r + 1]));
  }
  function Al(e, t, n, r) {
    let o = e[n + 1], i = t === null, s = r ? Ue(o) : ut(o), a = false;
    for (; s !== 0 && (a === false || i); ) {
      let l = e[s], c = e[s + 1];
      sm(l, t) && (a = true, e[s + 1] = r ? Ci(c) : Ei(c)), s = r ? Ue(c) : ut(c);
    }
    a && (e[n + 1] = r ? Ei(o) : Ci(o));
  }
  function sm(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? true : Array.isArray(e) && typeof t == "string" ? Gt(e, t) >= 0 : false;
  }
  function wr(e, t, n) {
    let r = F(), o = Zt();
    if (gt(r, o, t)) {
      let i = ge(), s = bc();
      bp(i, s, r, e, t, r[z], n, false);
    }
    return wr;
  }
  function kl(e, t, n, r, o) {
    ls(t, e, n, o ? "class" : "style", r);
  }
  function Jt(e, t) {
    return am(e, t, null, true), Jt;
  }
  function am(e, t, n, r) {
    let o = F(), i = ge(), s = eh(2);
    if (i.firstUpdatePass && cm(i, e, s, r), t !== qe && gt(o, s, t)) {
      let a = i.data[We()];
      pm(i, a, o, o[z], e, o[s + 1] = gm(t, n), r, s);
    }
  }
  function lm(e, t) {
    return t >= e.expandoStartIndex;
  }
  function cm(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
      let i = o[We()], s = lm(e, n);
      mm(i, r) && t === null && !s && (t = false), t = um(o, i, t, r), om(o, i, t, n, s, r);
    }
  }
  function um(e, t, n, r) {
    let o = oh(e), i = r ? t.residualClasses : t.residualStyles;
    if (o === null) (r ? t.classBindings : t.styleBindings) === 0 && (n = Bo(null, e, t, n, r), n = Ut(n, t.attrs, r), i = null);
    else {
      let s = t.directiveStylingLast;
      if (s === -1 || e[s] !== o) if (n = Bo(o, e, t, n, r), i === null) {
        let l = dm(e, t, r);
        l !== void 0 && Array.isArray(l) && (l = Bo(null, e, t, l[1], r), l = Ut(l, t.attrs, r), fm(e, t, r, l));
      } else i = hm(e, t, r);
    }
    return i !== void 0 && (r ? t.residualClasses = i : t.residualStyles = i), n;
  }
  function dm(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (ut(r) !== 0) return e[Ue(r)];
  }
  function fm(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[Ue(o)] = r;
  }
  function hm(e, t, n) {
    let r, o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
      let s = e[i].hostAttrs;
      r = Ut(r, s, n);
    }
    return Ut(r, t.attrs, n);
  }
  function Bo(e, t, n, r, o) {
    let i = null, s = n.directiveEnd, a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], r = Ut(r, i.hostAttrs, o), i !== e); ) a++;
    return e !== null && (n.directiveStylingLast = a), r;
  }
  function Ut(e, t, n) {
    let r = n ? 1 : 2, o = -1;
    if (t !== null) for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number" ? o = s : o === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), If(e, s, n ? true : t[++i]));
    }
    return e === void 0 ? null : e;
  }
  function pm(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3)) return;
    let l = e.data, c = l[a + 1], u = rm(c) ? Rl(l, t, n, o, ut(c), s) : void 0;
    if (!sr(u)) {
      sr(i) || tm(c) && (i = Rl(l, null, n, o, a, s));
      let f = sc(We(), n);
      Wp(r, s, f, o, i);
    }
  }
  function Rl(e, t, n, r, o, i) {
    let s = t === null, a;
    for (; o > 0; ) {
      let l = e[o], c = Array.isArray(l), u = c ? l[1] : l, f = u === null, h = n[o + 1];
      h === qe && (h = f ? se : void 0);
      let d = f ? Ro(h, r) : u === r ? h : void 0;
      if (c && !sr(d) && (d = Ro(l, r)), sr(d) && (a = d, s)) return a;
      let g = e[o + 1];
      o = s ? Ue(g) : ut(g);
    }
    if (t !== null) {
      let l = i ? t.residualClasses : t.residualStyles;
      l != null && (a = Ro(l, r));
    }
    return a;
  }
  function sr(e) {
    return e !== void 0;
  }
  function gm(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = J(Yh(e)))), e;
  }
  function mm(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0;
  }
  function Uo(e, t, n, r, o) {
    return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
  }
  function vm(e, t, n) {
    let r, o, i = 0, s = e.length - 1, a = void 0;
    if (Array.isArray(t)) {
      let l = t.length - 1;
      for (; i <= s && i <= l; ) {
        let c = e.at(i), u = t[i], f = Uo(i, c, i, u, n);
        if (f !== 0) {
          f < 0 && e.updateValue(i, u), i++;
          continue;
        }
        let h = e.at(s), d = t[l], g = Uo(s, h, l, d, n);
        if (g !== 0) {
          g < 0 && e.updateValue(s, d), s--, l--;
          continue;
        }
        let m = n(i, c), V = n(s, h), k = n(i, u);
        if (Object.is(k, V)) {
          let bt = n(l, d);
          Object.is(bt, m) ? (e.swap(i, s), e.updateValue(s, d), l--, s--) : e.move(s, i), e.updateValue(i, u), i++;
          continue;
        }
        if (r ??= new ar(), o ??= Pl(e, i, s, n), Si(e, r, i, k)) e.updateValue(i, u), i++, s++;
        else if (o.has(k)) r.set(m, e.detach(i)), s--;
        else {
          let bt = e.create(i, t[i]);
          e.attach(i, bt), i++, s++;
        }
      }
      for (; i <= l; ) Ol(e, r, n, i, t[i]), i++;
    } else if (t != null) {
      let l = t[Symbol.iterator](), c = l.next();
      for (; !c.done && i <= s; ) {
        let u = e.at(i), f = c.value, h = Uo(i, u, i, f, n);
        if (h !== 0) h < 0 && e.updateValue(i, f), i++, c = l.next();
        else {
          r ??= new ar(), o ??= Pl(e, i, s, n);
          let d = n(i, f);
          if (Si(e, r, i, d)) e.updateValue(i, f), i++, s++, c = l.next();
          else if (!o.has(d)) e.attach(i, e.create(i, f)), i++, s++, c = l.next();
          else {
            let g = n(i, u);
            r.set(g, e.detach(i)), s--;
          }
        }
      }
      for (; !c.done; ) Ol(e, r, n, e.length, c.value), c = l.next();
    }
    for (; i <= s; ) e.destroy(e.detach(s--));
    r?.forEach((l) => {
      e.destroy(l);
    });
  }
  function Si(e, t, n, r) {
    return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)), t.delete(r), true) : false;
  }
  function Ol(e, t, n, r, o) {
    if (Si(e, t, r, n(r, o))) e.updateValue(r, o);
    else {
      let i = e.create(r, o);
      e.attach(r, i);
    }
  }
  function Pl(e, t, n, r) {
    let o = /* @__PURE__ */ new Set();
    for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
    return o;
  }
  function mt(e, t) {
    yr("NgControlFlow");
    let n = F(), r = Zt(), o = n[r] !== qe ? n[r] : -1, i = o !== -1 ? lr(n, te + o) : void 0, s = 0;
    if (gt(n, r, e)) {
      let a = y(null);
      try {
        if (i !== void 0 && wu(i, s), e !== -1) {
          let l = te + e, c = lr(n, l), u = Ai(n[I], l), f = bs(c, u.tView.ssrId), h = us(n, u, t, { dehydratedView: f });
          ys(c, h, s, ds(u, f));
        }
      } finally {
        y(a);
      }
    } else if (i !== void 0) {
      let a = Du(i, s);
      a !== void 0 && (a[H] = t);
    }
  }
  function Fu(e, t, n, r, o, i, s, a, l, c, u, f, h) {
    yr("NgControlFlow");
    let d = F(), g = ge(), m = l !== void 0, V = F(), k = a ? s.bind(V[fe][H]) : s, bt = new xi(m, k);
    V[te + e] = bt, Di(d, g, e + 1, t, n, r, o, lt(g.consts, i)), m && Di(d, g, e + 2, l, c, u, f, lt(g.consts, h));
  }
  function Lu(e) {
    let t = y(null), n = We();
    try {
      let r = F(), o = r[I], i = r[n], s = n + 1, a = lr(r, s);
      if (i.liveCollection === void 0) {
        let c = Ai(o, s);
        i.liveCollection = new Ni(a, r, c);
      } else i.liveCollection.reset();
      let l = i.liveCollection;
      if (vm(l, e, i.trackByFn), l.updateIndexes(), i.hasEmptyBlock) {
        let c = Zt(), u = l.length === 0;
        if (gt(r, c, u)) {
          let f = n + 2, h = lr(r, f);
          if (u) {
            let d = Ai(o, f), g = bs(h, d.tView.ssrId), m = us(r, d, void 0, { dehydratedView: g });
            ys(h, m, 0, ds(d, g));
          } else wu(h, 0);
        }
      }
    } finally {
      y(t);
    }
  }
  function lr(e, t) {
    return e[t];
  }
  function ym(e, t) {
    return _s(e, t);
  }
  function _m(e, t) {
    return Du(e, t);
  }
  function Ai(e, t) {
    return Bi(e, t);
  }
  function P(e, t, n, r) {
    let o = F(), i = ge(), s = te + e, a = o[z], l = i.firstCreatePass ? Au(s, i, o, t, uu, dc(), n, r) : i.data[s], c = Im(i, o, l, a, t, e);
    o[s] = c;
    let u = $i(l);
    return qt(l, true), nu(a, c, l), !du(l) && Qi() && gs(i, o, c, l), (zf() === 0 || u) && Qt(c, o), Wf(), u && (as(i, o, l), Xc(i, l, o)), r !== null && cu(o, l), P;
  }
  function L() {
    let e = ht();
    hc() ? Jf() : (e = e.parent, qt(e, false));
    let t = e;
    Qf(t) && Yf(), qf();
    let n = ge();
    return n.firstCreatePass && ku(n, t), t.classesWithoutHost != null && uh(t) && kl(n, t, F(), t.classesWithoutHost, true), t.stylesWithoutHost != null && dh(t) && kl(n, t, F(), t.stylesWithoutHost, false), L;
  }
  function ws() {
    return F();
  }
  function Dm(e) {
    typeof e == "string" && (bm = e.toLowerCase().replace(/_/g, "-"));
  }
  function Fl(e, t, n) {
    return function r(o) {
      if (o === Function) return n;
      let i = zt(e) ? Ne(e.index, t) : t;
      vs(i, 5);
      let s = t[H], a = Ll(t, s, n, o), l = r.__ngNextListenerFn__;
      for (; l; ) a = Ll(t, s, l, o) && a, l = l.__ngNextListenerFn__;
      return a;
    };
  }
  function Ll(e, t, n, r) {
    let o = y(null);
    try {
      return x(6, t, n), n(r) !== false;
    } catch (i) {
      return wm(e, i), false;
    } finally {
      x(7, t, n), y(o);
    }
  }
  function wm(e, t) {
    let n = e[it], r = n ? n.get(we, null) : null;
    r && r.handleError(t);
  }
  function Vl(e, t, n, r, o, i) {
    let s = t[n], a = t[I], c = a.data[n].outputs[r], u = s[c], f = a.firstCreatePass ? uc(a) : null, h = cc(t), d = u.subscribe(i), g = h.length;
    h.push(i, d), f && f.push(o, e.index, g, -(g + 1));
  }
  function Xt(e, t, n, r) {
    let o = F(), i = ge(), s = ht();
    return Cm(i, o, o[z], s, e, t, r), Xt;
  }
  function Em(e, t, n, r) {
    let o = e.cleanup;
    if (o != null) for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[Kn], l = o[i + 2];
        return a.length > l ? a[l] : null;
      }
      typeof s == "string" && (i += 2);
    }
    return null;
  }
  function Cm(e, t, n, r, o, i, s) {
    let a = $i(r), c = e.firstCreatePass ? uc(e) : null, u = cc(t), f = true;
    if (r.type & 3 || s) {
      let h = Ce(r, t), d = s ? s(h) : h, g = u.length, m = s ? (k) => s(De(k[r.index])) : r.index, V = null;
      if (!s && a && (V = Em(e, t, o, r.index)), V !== null) {
        let k = V.__ngLastListenerFn__ || V;
        k.__ngNextListenerFn__ = i, V.__ngLastListenerFn__ = i, f = false;
      } else {
        i = Fl(r, t, i), Zh(t, d, o, i);
        let k = n.listen(d, o, i);
        u.push(i, k), c && c.push(o, m, g, g + 1);
      }
    } else i = Fl(r, t, i);
    if (f) {
      let h = r.outputs?.[o], d = r.hostDirectiveOutputs?.[o];
      if (d && d.length) for (let g = 0; g < d.length; g += 2) {
        let m = d[g], V = d[g + 1];
        Vl(r, t, m, V, o, i);
      }
      if (h && h.length) for (let g of h) Vl(r, t, g, o, o, i);
    }
  }
  function ve(e = 1) {
    return sh(e);
  }
  function U(e, t = "") {
    let n = F(), r = ge(), o = e + te, i = r.firstCreatePass ? Is(r, o, 1, t, null) : r.data[o], s = Mm(r, n, i, t, e);
    n[o] = s, Qi() && gs(r, n, s, i), qt(i, false);
  }
  function vt(e) {
    return yt("", e, ""), vt;
  }
  function yt(e, t, n) {
    let r = F(), o = em(r, e, t, n);
    return o !== qe && Sm(r, We(), o), yt;
  }
  function Sm(e, t, n) {
    let r = sc(t, e);
    Jh(e[z], r, n);
  }
  function Vu({ ngZoneFactory: e, ignoreChangesOutsideZone: t, scheduleInRootZone: n }) {
    return e ??= () => new $(B(D({}, Hu()), { scheduleInRootZone: n })), [{ provide: $, useFactory: e }, { provide: Qn, multi: true, useFactory: () => {
      let r = M(Tm, { optional: true });
      return () => r.initialize();
    } }, { provide: Qn, multi: true, useFactory: () => {
      let r = M(Nm);
      return () => {
        r.initialize();
      };
    } }, t === true ? { provide: Lc, useValue: true } : [], { provide: Vc, useValue: n ?? Pc }];
  }
  function ju(e) {
    let t = e?.ignoreChangesOutsideZone, n = e?.scheduleInRootZone, r = Vu({ ngZoneFactory: () => {
      let o = Hu(e);
      return o.scheduleInRootZone = n, o.shouldCoalesceEventChangeDetection && yr("NgZone_CoalesceEvent"), new $(o);
    }, ignoreChangesOutsideZone: t, scheduleInRootZone: n });
    return Ef([{ provide: xm, useValue: true }, { provide: Ji, useValue: false }, r]);
  }
  function Hu(e) {
    return { enableLongStackTrace: false, shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? false, shouldCoalesceRunChangeDetection: e?.runCoalescing ?? false };
  }
  function km() {
    return typeof $localize < "u" && $localize.locale || cr;
  }
  function Rt(e) {
    return !e.moduleRef;
  }
  function Om(e) {
    let t = Rt(e) ? e.r3Injector : e.moduleRef.injector, n = t.get($);
    return n.run(() => {
      Rt(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
      let r = t.get(we, null), o;
      if (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: (i) => {
          r.handleError(i);
        } });
      }), Rt(e)) {
        let i = () => t.destroy(), s = e.platformInjector.get(ki);
        s.add(i), t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
      } else {
        let i = () => e.moduleRef.destroy(), s = e.platformInjector.get(ki);
        s.add(i), e.moduleRef.onDestroy(() => {
          zn(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
      }
      return Fm(r, n, () => {
        let i = t.get(Pu);
        return i.runInitializers(), i.donePromise.then(() => {
          let s = t.get($u, cr);
          if (Dm(s || cr), !t.get(Rm, true)) return Rt(e) ? t.get(Be) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
          if (Rt(e)) {
            let l = t.get(Be);
            return e.rootComponent !== void 0 && l.bootstrap(e.rootComponent), l;
          } else return Pm(e.moduleRef, e.allPlatformModules), e.moduleRef;
        });
      });
    });
  }
  function Pm(e, t) {
    let n = e.injector.get(Be);
    if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach((r) => n.bootstrap(r));
    else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
    else throw new w(-403, false);
    t.push(e);
  }
  function Fm(e, t, n) {
    try {
      let r = n();
      return Ds(r) ? r.catch((o) => {
        throw t.runOutsideAngular(() => e.handleError(o)), o;
      }) : r;
    } catch (r) {
      throw t.runOutsideAngular(() => e.handleError(r)), r;
    }
  }
  function Lm(e = [], t) {
    return Ae.create({ name: t, providers: [{ provide: fr, useValue: "platform" }, { provide: ki, useValue: /* @__PURE__ */ new Set([() => Wn = null]) }, ...e] });
  }
  function Vm(e = []) {
    if (Wn) return Wn;
    let t = Lm(e);
    return Wn = t, Yg(), jm(t), t;
  }
  function jm(e) {
    let t = e.get(ns, null);
    Xl(e, () => {
      t?.forEach((n) => n());
    });
  }
  function Bu(e) {
    let { rootComponent: t, appProviders: n, platformProviders: r, platformRef: o } = e;
    x(8);
    try {
      let i = o?.injector ?? Vm(r), s = [Vu({}), { provide: $e, useExisting: Am }, ...n || []], a = new ir({ providers: s, parent: i, debugName: "", runEnvironmentInitializers: false });
      return Om({ r3Injector: a.injector, platformInjector: i, rootComponent: t });
    } catch (i) {
      return Promise.reject(i);
    } finally {
      x(9);
    }
  }
  function Er(e, t) {
    return qr(e, t?.equal);
  }
  var Kd;
  var w;
  var ef;
  var $l;
  var ol;
  var Bl;
  var rf;
  var E;
  var of;
  var sf;
  var af;
  var il;
  var Ft;
  var sl;
  var _;
  var Go;
  var cf;
  var Fe;
  var uf;
  var qn;
  var Zn;
  var df;
  var ff;
  var hf;
  var al;
  var ot;
  var se;
  var Qn;
  var Zl;
  var Ql;
  var Yn;
  var Mf;
  var fr;
  var Bn;
  var ll;
  var Oo;
  var Ve;
  var Vt;
  var Ee;
  var I;
  var v;
  var ee;
  var ae;
  var pe;
  var jt;
  var Kn;
  var H;
  var it;
  var xe;
  var z;
  var Ht;
  var cl;
  var dt;
  var fe;
  var st;
  var tt;
  var at;
  var hr;
  var ec;
  var Te;
  var Po;
  var Jn;
  var X;
  var Fo;
  var te;
  var tc;
  var $t;
  var Ff;
  var Xn;
  var Q;
  var Yo;
  var oc;
  var ul;
  var x;
  var $f;
  var Bf;
  var b;
  var Jo;
  var Ic;
  var Dc;
  var rt;
  var Bt;
  var ni;
  var vh;
  var Cc;
  var Mc;
  var yh;
  var de;
  var tr;
  var Ae;
  var Sh;
  var Pc;
  var Fc;
  var oi;
  var $e;
  var Ji;
  var Lc;
  var Vc;
  var gr;
  var ii;
  var be;
  var Xi;
  var rr;
  var xh;
  var $;
  var Nh;
  var ai;
  var we;
  var Ph;
  var mr;
  var Uc;
  var Gc;
  var Vh;
  var bl;
  var ci;
  var ts;
  var Bh;
  var ns;
  var Yt;
  var rs;
  var Uh;
  var Gh;
  var Qc;
  var zh;
  var Yc;
  var vr;
  var Dl;
  var Wh;
  var qh;
  var Qh;
  var he;
  var di;
  var ru;
  var qe;
  var _r;
  var _p;
  var Rp;
  var ke;
  var Up;
  var Cl;
  var gu;
  var Kp;
  var Xp;
  var eg;
  var lg;
  var Cb;
  var fg;
  var hg;
  var Su;
  var mi;
  var pt;
  var ct;
  var pg;
  var Ho;
  var vi;
  var yi;
  var _i;
  var Ii;
  var kg;
  var bi;
  var ir;
  var Pg;
  var Gg;
  var Ou;
  var Wg;
  var wi;
  var Zg;
  var Pu;
  var Qg;
  var Jg;
  var Be;
  var Mi;
  var ar;
  var Ti;
  var xi;
  var Ni;
  var Im;
  var cr;
  var bm;
  var Mm;
  var Tm;
  var xm;
  var Nm;
  var Am;
  var $u;
  var ki;
  var Rm;
  var Wn;
  var jl;
  var ne = p(() => {
    "use strict";
    Jr();
    eo();
    ra();
    eo();
    Ao();
    ko();
    Kd = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss", w = class extends Error {
      code;
      constructor(t, n) {
        super(Xd(t, n)), this.code = t;
      }
    };
    ef = N({ __forward_ref__: N });
    $l = N({ \u0275prov: N }), ol = N({ \u0275inj: N }), Bl = N({ ngInjectableDef: N }), rf = N({ ngInjectorDef: N }), E = class {
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
    of = N({ \u0275cmp: N }), sf = N({ \u0275dir: N }), af = N({ \u0275pipe: N }), il = N({ \u0275fac: N }), Ft = N({ __NG_ELEMENT_ID__: N }), sl = N({ __NG_ENV_ID__: N });
    _ = (function(e) {
      return e[e.Default = 0] = "Default", e[e.Host = 1] = "Host", e[e.Self = 2] = "Self", e[e.SkipSelf = 4] = "SkipSelf", e[e.Optional = 8] = "Optional", e;
    })(_ || {});
    cf = {}, Fe = cf, uf = "__NG_DI_FLAG__", qn = class {
      injector;
      constructor(t) {
        this.injector = t;
      }
      retrieve(t, n) {
        let r = n;
        return this.injector.get(t, r.optional ? vn : Fe, r);
      }
    }, Zn = "ngTempTokenPath", df = "ngTokenPath", ff = /\n/gm, hf = "\u0275", al = "__source";
    ot = {}, se = [], Qn = new E(""), Zl = new E("", -1), Ql = new E(""), Yn = class {
      get(t, n = Fe) {
        if (n === Fe) {
          let r = new Error(`NullInjectorError: No provider for ${J(t)}!`);
          throw r.name = "NullInjectorError", r;
        }
        return n;
      }
    };
    Mf = N({ provide: String, useValue: N });
    fr = new E(""), Bn = {}, ll = {};
    Ve = class {
    }, Vt = class extends Ve {
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
        super(), this.parent = n, this.source = r, this.scopes = o, Qo(t, (s) => this.processProvider(s)), this.records.set(Zl, et(void 0, this)), o.has("environment") && this.records.set(Ve, et(void 0, this));
        let i = this.records.get(fr);
        i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(Ql, se, _.Self));
      }
      retrieve(t, n) {
        let r = n;
        return this.get(t, r.optional ? vn : Fe, r);
      }
      destroy() {
        Ot(this), this._destroyed = true;
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
        return Ot(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t);
      }
      runInContext(t) {
        Ot(this);
        let n = _e(this), r = K(void 0), o;
        try {
          return t();
        } finally {
          _e(n), K(r);
        }
      }
      get(t, n = Fe, r = _.Default) {
        if (Ot(this), t.hasOwnProperty(sl)) return t[sl](this);
        r = dr(r);
        let o, i = _e(this), s = K(void 0);
        try {
          if (!(r & _.SkipSelf)) {
            let l = this.records.get(t);
            if (l === void 0) {
              let c = Of(t) && Oi(t);
              c && this.injectableDefInScope(c) ? l = et(Zo(t), Bn) : l = null, this.records.set(t, l);
            }
            if (l != null) return this.hydrate(t, l, r);
          }
          let a = r & _.Self ? Hi() : this.parent;
          return n = r & _.Optional && n === Fe ? null : n, a.get(t, n);
        } catch (a) {
          if (a.name === "NullInjectorError") {
            if ((a[Zn] = a[Zn] || []).unshift(J(t)), i) throw a;
            return mf(a, t, "R3InjectorError", this.source);
          } else throw a;
        } finally {
          K(s), _e(i);
        }
      }
      resolveInjectorInitializers() {
        let t = y(null), n = _e(this), r = K(void 0), o;
        try {
          let i = this.get(Qn, se, _.Self);
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
        let n = qo(t) ? t : ie(t && t.provide), r = Nf(t);
        if (!qo(t) && t.multi === true) {
          let o = this.records.get(n);
          o || (o = et(void 0, Bn, true), o.factory = () => zo(o.multi), this.records.set(n, o)), n = t, o.multi.push(t);
        }
        this.records.set(n, r);
      }
      hydrate(t, n, r) {
        let o = y(null);
        try {
          return n.value === ll ? Gl(J(t)) : n.value === Bn && (n.value = ll, n.value = n.factory(void 0, r)), typeof n.value == "object" && n.value && Rf(n.value) && this._ngOnDestroyHooks.add(n.value), n.value;
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
    Ee = 0, I = 1, v = 2, ee = 3, ae = 4, pe = 5, jt = 6, Kn = 7, H = 8, it = 9, xe = 10, z = 11, Ht = 12, cl = 13, dt = 14, fe = 15, st = 16, tt = 17, at = 18, hr = 19, ec = 20, Te = 21, Po = 22, Jn = 23, X = 24, Fo = 25, te = 26, tc = 1, $t = 7, Ff = 8, Xn = 9, Q = 10;
    Yo = class {
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
    oc = "__ngSimpleChanges__";
    ul = null, x = function(e, t = null, n) {
      ul?.(e, t, n);
    }, $f = "svg", Bf = "math";
    b = { lFrame: yc(null), bindingsEnabled: true, skipHydrationRootTNode: null }, Jo = false;
    Ic = _c;
    Dc = true;
    rt = -1, Bt = class {
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
    ni = true;
    vh = 256, Cc = vh - 1, Mc = 5, yh = 0, de = {};
    tr = class {
      _tNode;
      _lView;
      constructor(t, n) {
        this._tNode = t, this._lView = n;
      }
      get(t, n, r) {
        return kc(this._tNode, this._lView, t, dr(r), n);
      }
    };
    Ae = class e {
      static THROW_IF_NOT_FOUND = Fe;
      static NULL = new Yn();
      static create(t, n) {
        if (Array.isArray(t)) return vl({ name: "" }, n, t, "");
        {
          let r = t.name ?? "";
          return vl({ name: r }, t.parent, t.providers, r);
        }
      }
      static \u0275prov = O({ token: e, providedIn: "any", factory: () => T(Zl) });
      static __NG_ELEMENT_ID__ = -1;
    };
    Sh = new E("");
    Sh.__NG_ELEMENT_ID__ = (e) => {
      let t = ht();
      if (t === null) throw new w(204, false);
      if (t.type & 2) return t.value;
      if (e & _.Optional) return null;
      throw new w(204, false);
    };
    Pc = false, Fc = /* @__PURE__ */ (() => {
      class e {
        static __NG_ELEMENT_ID__ = Th;
        static __NG_ENV_ID__ = (n) => n;
      }
      return e;
    })(), oi = class extends Fc {
      _lView;
      constructor(t) {
        super(), this._lView = t;
      }
      onDestroy(t) {
        let n = this._lView;
        return ft(n) ? (t(), () => {
        }) : (lc(n, t), () => Gf(n, t));
      }
    };
    $e = class {
    }, Ji = new E("", { providedIn: "root", factory: () => false }), Lc = new E(""), Vc = new E(""), gr = (() => {
      class e {
        taskId = 0;
        pendingTasks = /* @__PURE__ */ new Set();
        get _hasPendingTasks() {
          return this.hasPendingTasks.value;
        }
        hasPendingTasks = new xt(false);
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
    })(), ii = class extends Ie {
      __isAsync;
      destroyRef = void 0;
      pendingTasks = void 0;
      constructor(t = false) {
        super(), this.__isAsync = t, Pf() && (this.destroyRef = M(Fc, { optional: true }) ?? void 0, this.pendingTasks = M(gr, { optional: true }) ?? void 0);
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
    }, be = ii;
    Xi = "isAngularZone", rr = Xi + "_ID", xh = 0, $ = class e {
      hasPendingMacrotasks = false;
      hasPendingMicrotasks = false;
      isStable = true;
      onUnstable = new be(false);
      onMicrotaskEmpty = new be(false);
      onStable = new be(false);
      onError = new be(false);
      constructor(t) {
        let { enableLongStackTrace: n = false, shouldCoalesceEventChangeDetection: r = false, shouldCoalesceRunChangeDetection: o = false, scheduleInRootZone: i = Pc } = t;
        if (typeof Zone > "u") throw new w(908, false);
        Zone.assertZonePatched();
        let s = this;
        s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = false, s.scheduleInRootZone = i, kh(s);
      }
      static isInAngularZone() {
        return typeof Zone < "u" && Zone.current.get(Xi) === true;
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
        let i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + o, t, Nh, nr, nr);
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
    }, Nh = {};
    ai = class {
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
    }, Ph = new E("", { providedIn: "root", factory: () => {
      let e = M($), t = M(we);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    } });
    mr = /* @__PURE__ */ (() => {
      class e {
        nativeElement;
        constructor(n) {
          this.nativeElement = n;
        }
        static __NG_ELEMENT_ID__ = Fh;
      }
      return e;
    })();
    Uc = (function(e) {
      return e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default", e;
    })(Uc || {}), Gc = /* @__PURE__ */ new Map(), Vh = 0;
    bl = "__ngContext__";
    ts = new E("", { providedIn: "root", factory: () => Bh }), Bh = "ng", ns = new E(""), Yt = new E("", { providedIn: "platform", factory: () => "unknown" }), rs = new E("", { providedIn: "root", factory: () => $h().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null }), Uh = "h", Gh = "b", Qc = false, zh = new E("", { providedIn: "root", factory: () => Qc }), Yc = (function(e) {
      return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e;
    })(Yc || {}), vr = new E(""), Dl = /* @__PURE__ */ new Set();
    Wh = (() => {
      class e {
        impl = null;
        execute() {
          this.impl?.execute();
        }
        static \u0275prov = O({ token: e, providedIn: "root", factory: () => new e() });
      }
      return e;
    })();
    qh = (e, t, n, r) => {
    };
    Qh = () => null;
    he = (function(e) {
      return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e;
    })(he || {}), di = class {
      changingThisBreaksApplicationSecurity;
      constructor(t) {
        this.changingThisBreaksApplicationSecurity = t;
      }
      toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Kd})`;
      }
    };
    ru = "ng-template";
    qe = {};
    _r = (function(e) {
      return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e;
    })(_r || {});
    _p = () => null;
    ke = (function(e) {
      return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e;
    })(ke || {});
    Up = Bp;
    gu = [];
    Kp = B(D({}, wt), { consumerIsAlwaysLive: true, kind: "template", consumerMarkedDirty: (e) => {
      pr(e.lView);
    }, consumerOnSignalRead() {
      this.lView[X] = this;
    } });
    Xp = B(D({}, wt), { consumerIsAlwaysLive: true, kind: "template", consumerMarkedDirty: (e) => {
      let t = je(e.lView);
      for (; t && !mu(t[I]); ) t = je(t);
      t && Gi(t);
    }, consumerOnSignalRead() {
      this.lView[X] = this;
    } });
    eg = 100;
    lg = class {
      _lView;
      _cdRefInjectingView;
      notifyErrorHandler;
      _appRef = null;
      _attachedToViewContainer = false;
      get rootNodes() {
        let t = this._lView, n = t[I];
        return or(n, t, n.firstChild, []);
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
        return ft(this._lView);
      }
      destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
          let t = this._lView[ee];
          if (Ge(t)) {
            let n = t[Ff], r = n ? n.indexOf(this) : -1;
            r > -1 && (_s(t, r), ql(n, r));
          }
          this._attachedToViewContainer = false;
        }
        ps(this._lView[I], this._lView);
      }
      onDestroy(t) {
        lc(this._lView, t);
      }
      markForCheck() {
        vs(this._cdRefInjectingView || this._lView, 4);
      }
      detach() {
        this._lView[v] &= -129;
      }
      reattach() {
        Ko(this._lView), this._lView[v] |= 128;
      }
      detectChanges() {
        this._lView[v] |= 1024, yu(this._lView, this.notifyErrorHandler);
      }
      checkNoChanges() {
      }
      attachToViewContainerRef() {
        if (this._appRef) throw new w(902, false);
        this._attachedToViewContainer = true;
      }
      detachFromAppRef() {
        this._appRef = null;
        let t = er(this._lView), n = this._lView[st];
        n !== null && !t && hs(n, this._lView), fu(this._lView[I], this._lView);
      }
      attachToAppRef(t) {
        if (this._attachedToViewContainer) throw new w(902, false);
        this._appRef = t;
        let n = er(this._lView), r = this._lView[st];
        r !== null && !n && Eu(r, this._lView), Ko(this._lView);
      }
    };
    Cb = new RegExp(`^(\\d+)*(${Gh}|${Uh})*(.*)`), fg = () => null;
    hg = class {
    }, Su = class {
    }, mi = class {
      resolveComponentFactory(t) {
        throw Error(`No component factory found for ${J(t)}.`);
      }
    }, pt = class {
      static NULL = new mi();
    }, ct = class {
    }, pg = (() => {
      class e {
        static \u0275prov = O({ token: e, providedIn: "root", factory: () => null });
      }
      return e;
    })(), Ho = {}, vi = class {
      injector;
      parentInjector;
      constructor(t, n) {
        this.injector = t, this.parentInjector = n;
      }
      get(t, n, r) {
        r = dr(r);
        let o = this.injector.get(t, Ho, r);
        return o !== Ho || n === Ho ? o : this.parentInjector.get(t, n, r);
      }
    };
    yi = class extends pt {
      ngModule;
      constructor(t) {
        super(), this.ngModule = t;
      }
      resolveComponentFactory(t) {
        let n = Vi(t);
        return new _i(n, this.ngModule);
      }
    };
    _i = class extends Su {
      componentDef;
      ngModule;
      selector;
      componentType;
      ngContentSelectors;
      isBoundToModule;
      cachedInputs = null;
      cachedOutputs = null;
      get inputs() {
        return this.cachedInputs ??= Mg(this.componentDef.inputs), this.cachedInputs;
      }
      get outputs() {
        return this.cachedOutputs ??= Sg(this.componentDef.outputs), this.cachedOutputs;
      }
      constructor(t, n) {
        super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = fp(t.selectors), this.ngContentSelectors = t.ngContentSelectors ?? [], this.isBoundToModule = !!n;
      }
      create(t, n, r, o) {
        x(22);
        let i = y(null);
        try {
          let s = this.componentDef, a = r ? ["ng-version", "19.2.22"] : hp(this.componentDef.selectors[0]), l = is(0, null, null, 1, 0, null, null, null, null, [a], null), c = Tg(s, o || this.ngModule, t), u = xg(c), f = u.rendererFactory.createRenderer(null, s), h = r ? vp(f, r, s.encapsulation, c) : Ng(s, f), d = ss(null, l, null, 512 | ou(s), null, null, u, f, c, null, Kc(h, c, true));
          d[te] = h, qi(d);
          let g = null;
          try {
            let m = Au(te, l, d, "#host", () => [this.componentDef], true, 0);
            h && (nu(f, h, m), Qt(h, d)), as(l, d, m), Xc(l, m, d), ku(l, m), n !== void 0 && Ag(m, this.ngContentSelectors, n), g = Ne(m.index, d), d[H] = g[H], cs(l, d, null);
          } catch (m) {
            throw g !== null && li(g), li(d), m;
          } finally {
            x(23), Zi();
          }
          return new Ii(this.componentType, d);
        } finally {
          y(i);
        }
      }
    }, Ii = class extends hg {
      _rootLView;
      instance;
      hostView;
      changeDetectorRef;
      componentType;
      location;
      previousInputValues = null;
      _tNode;
      constructor(t, n) {
        super(), this._rootLView = n, this._tNode = Bi(n[I], te), this.location = $c(this._tNode, n), this.instance = Ne(this._tNode.index, n)[H], this.hostView = this.changeDetectorRef = new lg(n, void 0, false), this.componentType = t;
      }
      setInput(t, n) {
        let r = this._tNode;
        if (this.previousInputValues ??= /* @__PURE__ */ new Map(), this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n)) return;
        let o = this._rootLView, i = ls(r, o[I], o, t, n);
        this.previousInputValues.set(t, n);
        let s = Ne(r.index, o);
        vs(s, 1);
      }
      get injector() {
        return new tr(this._tNode, this._rootLView);
      }
      destroy() {
        this.hostView.destroy();
      }
      onDestroy(t) {
        this.hostView.onDestroy(t);
      }
    };
    kg = () => false;
    bi = class {
    }, ir = class extends bi {
      injector;
      componentFactoryResolver = new yi(this);
      instance = null;
      constructor(t) {
        super();
        let n = new Vt([...t.providers, { provide: bi, useValue: this }, { provide: pt, useValue: this.componentFactoryResolver }], t.parent || Hi(), t.debugName, /* @__PURE__ */ new Set(["environment"]));
        this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers();
      }
      destroy() {
        this.injector.destroy();
      }
      onDestroy(t) {
        this.injector.onDestroy(t);
      }
    };
    Pg = (() => {
      class e {
        _injector;
        cachedInjectors = /* @__PURE__ */ new Map();
        constructor(n) {
          this._injector = n;
        }
        getOrCreateStandaloneInjector(n) {
          if (!n.standalone) return null;
          if (!this.cachedInjectors.has(n)) {
            let r = Yl(false, n.type), o = r.length > 0 ? Og([r], this._injector, `Standalone[${n.type.name}]`) : null;
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
        static \u0275prov = O({ token: e, providedIn: "environment", factory: () => new e(T(Ve)) });
      }
      return e;
    })();
    Gg = zg;
    Ou = new E(""), Wg = (() => {
      class e {
        static \u0275prov = O({ token: e, providedIn: "root", factory: () => new wi() });
      }
      return e;
    })(), wi = class {
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
    Zg = new E(""), Pu = (() => {
      class e {
        resolve;
        reject;
        initialized = false;
        done = false;
        donePromise = new Promise((n, r) => {
          this.resolve = n, this.reject = r;
        });
        appInits = M(Zg, { optional: true }) ?? [];
        injector = M(Ae);
        constructor() {
        }
        runInitializers() {
          if (this.initialized) return;
          let n = [];
          for (let o of this.appInits) {
            let i = Xl(this.injector, o);
            if (Ds(i)) n.push(i);
            else if (qg(i)) {
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
    })(), Qg = new E("");
    Jg = 10, Be = (() => {
      class e {
        _runningTick = false;
        _destroyed = false;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = M(Ph);
        afterRenderManager = M(Wh);
        zonelessEnabled = M(Ji);
        rootEffectScheduler = M(Wg);
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
        isStable = M(gr).hasPendingTasks.pipe(kt((n) => !n));
        constructor() {
          M(vr, { optional: true });
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
        _injector = M(Ve);
        _rendererFactory = null;
        get injector() {
          return this._injector;
        }
        bootstrap(n, r) {
          return this.bootstrapImpl(n, r);
        }
        bootstrapImpl(n, r, o = Ae.NULL) {
          x(10);
          let i = n instanceof Su;
          if (!this._injector.get(Pu).done) {
            let d = "";
            throw new w(405, d);
          }
          let a;
          i ? a = n : a = this._injector.get(pt).resolveComponentFactory(n), this.componentTypes.push(a.componentType);
          let l = Kg(a) ? void 0 : this._injector.get(bi), c = r || a.selector, u = a.create(o, [], c, l), f = u.location.nativeElement, h = u.injector.get(Ou, null);
          return h?.registerApplication(f), u.onDestroy(() => {
            this.detachView(u.hostView), zn(this.components, u), h?.unregisterApplication(f);
          }), this._loadComponent(u), x(11, u), u;
        }
        tick() {
          this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
        }
        _tick() {
          x(12), this.tracingSnapshot !== null ? this.tracingSnapshot.run(Yc.CHANGE_DETECTION, this.tickImpl) : this.tickImpl();
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
          this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(ct, null, { optional: true }));
          let n = 0;
          for (; this.dirtyFlags !== 0 && n++ < Jg; ) x(14), this.synchronizeOnce(), x(15);
        }
        synchronizeOnce() {
          if (this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()), this.dirtyFlags & 7) {
            let n = !!(this.dirtyFlags & 1);
            this.dirtyFlags &= -8, this.dirtyFlags |= 8;
            for (let { _lView: r, notifyErrorHandler: o } of this.allViews) Xg(r, o, n, this.zonelessEnabled);
            if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23) return;
          } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
          this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews();
        }
        syncDirtyFlagsWithViews() {
          if (this.allViews.some(({ _lView: n }) => Wt(n))) {
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
          zn(this._views, r), r.detachFromAppRef();
        }
        _loadComponent(n) {
          this.attachView(n.hostView), this.tick(), this.components.push(n), this._injector.get(Qg, []).forEach((o) => o(n));
        }
        ngOnDestroy() {
          if (!this._destroyed) try {
            this._destroyListeners.forEach((n) => n()), this._views.slice().forEach((n) => n.destroy());
          } finally {
            this._destroyed = true, this._views = [], this._destroyListeners = [];
          }
        }
        onDestroy(n) {
          return this._destroyListeners.push(n), () => zn(this._destroyListeners, n);
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
    Mi = class {
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
    ar = class {
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
    Ti = class {
      lContainer;
      $implicit;
      $index;
      constructor(t, n, r) {
        this.lContainer = t, this.$implicit = n, this.$index = r;
      }
      get $count() {
        return this.lContainer.length - Q;
      }
    }, xi = class {
      hasEmptyBlock;
      trackByFn;
      liveCollection;
      constructor(t, n, r) {
        this.hasEmptyBlock = t, this.trackByFn = n, this.liveCollection = r;
      }
    };
    Ni = class extends Mi {
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
        let r = n[jt];
        this.needsIndexUpdate ||= t !== this.length, ys(this.lContainer, n, t, ds(this.templateTNode, r));
      }
      detach(t) {
        return this.needsIndexUpdate ||= t !== this.length - 1, ym(this.lContainer, t);
      }
      create(t, n) {
        let r = bs(this.lContainer, this.templateTNode.tView.ssrId), o = us(this.hostLView, this.templateTNode, new Ti(this.lContainer, n, t), { dehydratedView: r });
        return this.operationsCounter?.recordCreate(), o;
      }
      destroy(t) {
        ps(t[I], t), this.operationsCounter?.recordDestroy();
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
        return _m(this.lContainer, t);
      }
    };
    Im = (e, t, n, r, o, i) => (Yi(true), eu(r, o, ah()));
    cr = "en-US", bm = cr;
    Mm = (e, t, n, r, o) => (Yi(true), Kh(t[z], r));
    Tm = (() => {
      class e {
        zone = M($);
        changeDetectionScheduler = M($e);
        applicationRef = M(Be);
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
    })(), xm = new E("", { factory: () => false });
    Nm = (() => {
      class e {
        subscription = new G();
        initialized = false;
        zone = M($);
        pendingTasks = M(gr);
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
        appRef = M(Be);
        taskService = M(gr);
        ngZone = M($);
        zonelessEnabled = M(Ji);
        tracing = M(vr, { optional: true });
        disableScheduling = M(Lc, { optional: true }) ?? false;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{ data: { __scheduler_tick__: true } }];
        subscriptions = new G();
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(rr) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (M(Vc, { optional: true }) ?? false);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = false;
        runningTick = false;
        pendingRenderTaskId = null;
        constructor() {
          this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })), this.disableScheduling ||= !this.zonelessEnabled && (this.ngZone instanceof ai || !this.zoneIsDefined);
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
          let o = this.useMicrotaskScheduler ? yl : jc;
          this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick()));
        }
        shouldScheduleTick(n) {
          return !(this.disableScheduling && !n || this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(rr + this.angularZoneId));
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
          this.useMicrotaskScheduler = true, yl(() => {
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
    $u = new E("", { providedIn: "root", factory: () => M($u, _.Optional | _.SkipSelf) || km() }), ki = new E(""), Rm = new E("");
    Wn = null;
    jl = class {
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
  var Uu = p(() => {
    "use strict";
    ne();
    ye = new E("");
  });
  function tn() {
    return Gu;
  }
  function Es(e) {
    Gu ??= e;
  }
  var Gu;
  var en;
  var zu = p(() => {
    "use strict";
    Gu = null;
    en = class {
    };
  });
  function Cs(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
      let r = n.indexOf("="), [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
      if (o.trim() === t) return decodeURIComponent(i);
    }
    return null;
  }
  function Mr(e) {
    return e === Wu;
  }
  var Ms;
  var Wu;
  var nn;
  var qu = p(() => {
    "use strict";
    Ms = "browser", Wu = "server";
    nn = class {
    };
  });
  var Ss = p(() => {
    "use strict";
    qu();
    Uu();
    zu();
  });
  function Zu(e) {
    for (let t of e) t.remove();
  }
  function Qu(e, t) {
    let n = t.createElement("style");
    return n.textContent = e, n;
  }
  function Hm(e, t, n, r) {
    let o = e.head?.querySelectorAll(`style[${Sr}="${t}"],link[${Sr}="${t}"]`);
    if (o) for (let i of o) i.removeAttribute(Sr), i instanceof HTMLLinkElement ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), { usage: 0, elements: [i] }) : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] });
  }
  function xs(e, t) {
    let n = t.createElement("link");
    return n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n;
  }
  function zm(e) {
    return Bm.replace(Rs, e);
  }
  function Wm(e) {
    return $m.replace(Rs, e);
  }
  function Ju(e, t) {
    return t.map((n) => n.replace(Rs, e));
  }
  function Yu(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0;
  }
  var xr;
  var As;
  var rn;
  var Sr;
  var ks;
  var Ts;
  var Rs;
  var Ku;
  var $m;
  var Bm;
  var Um;
  var Gm;
  var Os;
  var on;
  var Ns;
  var sn;
  var Tr;
  var Xu = p(() => {
    "use strict";
    Ss();
    ne();
    ne();
    xr = new E(""), As = (() => {
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
          return new (r || e)(T(xr), T($));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), rn = class {
      _doc;
      constructor(t) {
        this._doc = t;
      }
      manager;
    }, Sr = "ng-app-id";
    ks = (() => {
      class e {
        doc;
        appId;
        nonce;
        inline = /* @__PURE__ */ new Map();
        external = /* @__PURE__ */ new Map();
        hosts = /* @__PURE__ */ new Set();
        isServer;
        constructor(n, r, o, i = {}) {
          this.doc = n, this.appId = r, this.nonce = o, this.isServer = Mr(i), Hm(n, r, this.inline, this.external), this.hosts.add(n.head);
        }
        addStyles(n, r) {
          for (let o of n) this.addUsage(o, this.inline, Qu);
          r?.forEach((o) => this.addUsage(o, this.external, xs));
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
          o && (o.usage--, o.usage <= 0 && (Zu(o.elements), r.delete(n)));
        }
        ngOnDestroy() {
          for (let [, { elements: n }] of [...this.inline, ...this.external]) Zu(n);
          this.hosts.clear();
        }
        addHost(n) {
          this.hosts.add(n);
          for (let [r, { elements: o }] of this.inline) o.push(this.addElement(n, Qu(r, this.doc)));
          for (let [r, { elements: o }] of this.external) o.push(this.addElement(n, xs(r, this.doc)));
        }
        removeHost(n) {
          this.hosts.delete(n);
        }
        addElement(n, r) {
          return this.nonce && r.setAttribute("nonce", this.nonce), this.isServer && r.setAttribute(Sr, this.appId), n.appendChild(r);
        }
        static \u0275fac = function(r) {
          return new (r || e)(T(ye), T(ts), T(rs, 8), T(Yt));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), Ts = { svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/", math: "http://www.w3.org/1998/Math/MathML" }, Rs = /%COMP%/g, Ku = "%COMP%", $m = `_nghost-${Ku}`, Bm = `_ngcontent-${Ku}`, Um = true, Gm = new E("", { providedIn: "root", factory: () => Um });
    Os = (() => {
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
          this.eventManager = n, this.sharedStylesHost = r, this.appId = o, this.removeStylesOnCompDestroy = i, this.doc = s, this.platformId = a, this.ngZone = l, this.nonce = c, this.tracingService = u, this.platformIsServer = Mr(a), this.defaultRenderer = new on(n, s, l, this.platformIsServer, this.tracingService);
        }
        createRenderer(n, r) {
          if (!n || !r) return this.defaultRenderer;
          this.platformIsServer && r.encapsulation === he.ShadowDom && (r = B(D({}, r), { encapsulation: he.Emulated }));
          let o = this.getOrCreateRenderer(n, r);
          return o instanceof Tr ? o.applyToHost(n) : o instanceof sn && o.applyStyles(), o;
        }
        getOrCreateRenderer(n, r) {
          let o = this.rendererByCompId, i = o.get(r.id);
          if (!i) {
            let s = this.doc, a = this.ngZone, l = this.eventManager, c = this.sharedStylesHost, u = this.removeStylesOnCompDestroy, f = this.platformIsServer, h = this.tracingService;
            switch (r.encapsulation) {
              case he.Emulated:
                i = new Tr(l, c, r, this.appId, u, s, a, f, h);
                break;
              case he.ShadowDom:
                return new Ns(l, c, n, r, s, a, this.nonce, f, h);
              default:
                i = new sn(l, c, r, u, s, a, f, h);
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
          return new (r || e)(T(As), T(ks), T(ts), T(Gm), T(ye), T(Yt), T($), T(rs), T(vr, 8));
        };
        static \u0275prov = O({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), on = class {
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
        return n ? this.doc.createElementNS(Ts[n] || n, t) : this.doc.createElement(t);
      }
      createComment(t) {
        return this.doc.createComment(t);
      }
      createText(t) {
        return this.doc.createTextNode(t);
      }
      appendChild(t, n) {
        (Yu(t) ? t.content : t).appendChild(n);
      }
      insertBefore(t, n, r) {
        t && (Yu(t) ? t.content : t).insertBefore(n, r);
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
          let i = Ts[o];
          i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
        } else t.setAttribute(n, r);
      }
      removeAttribute(t, n, r) {
        if (r) {
          let o = Ts[r];
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
        o & (ke.DashCase | ke.Important) ? t.style.setProperty(n, r, o & ke.Important ? "important" : "") : t.style[n] = r;
      }
      removeStyle(t, n, r) {
        r & ke.DashCase ? t.style.removeProperty(n) : t.style[n] = "";
      }
      setProperty(t, n, r) {
        t != null && (t[n] = r);
      }
      setValue(t, n) {
        t.nodeValue = n;
      }
      listen(t, n, r, o) {
        if (typeof t == "string" && (t = tn().getGlobalEventTarget(this.doc, t), !t)) throw new w(5102, false);
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
    Ns = class extends on {
      sharedStylesHost;
      hostEl;
      shadowRoot;
      constructor(t, n, r, o, i, s, a, l, c) {
        super(t, i, s, l, c), this.sharedStylesHost = n, this.hostEl = r, this.shadowRoot = r.attachShadow({ mode: "open" }), this.sharedStylesHost.addHost(this.shadowRoot);
        let u = o.styles;
        u = Ju(o.id, u);
        for (let h of u) {
          let d = document.createElement("style");
          a && d.setAttribute("nonce", a), d.textContent = h, this.shadowRoot.appendChild(d);
        }
        let f = o.getExternalStyles?.();
        if (f) for (let h of f) {
          let d = xs(h, i);
          a && d.setAttribute("nonce", a), this.shadowRoot.appendChild(d);
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
    }, sn = class extends on {
      sharedStylesHost;
      removeStylesOnCompDestroy;
      styles;
      styleUrls;
      constructor(t, n, r, o, i, s, a, l, c) {
        super(t, i, s, a, l), this.sharedStylesHost = n, this.removeStylesOnCompDestroy = o;
        let u = r.styles;
        this.styles = c ? Ju(c, u) : u, this.styleUrls = r.getExternalStyles?.(c);
      }
      applyStyles() {
        this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
      }
      destroy() {
        this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
      }
    }, Tr = class extends sn {
      contentAttr;
      hostAttr;
      constructor(t, n, r, o, i, s, a, l, c) {
        let u = o + "-" + r.id;
        super(t, n, r, i, s, a, l, c, u), this.contentAttr = zm(u), this.hostAttr = Wm(u);
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
  function qm() {
    return an = an || document.head.querySelector("base"), an ? an.getAttribute("href") : null;
  }
  function Zm(e) {
    return new URL(e, document.baseURI).pathname;
  }
  function Ps(e) {
    return Bu(Jm(e));
  }
  function Jm(e) {
    return { appProviders: [...rv, ...e?.providers ?? []], platformProviders: nv };
  }
  function Xm() {
    Nr.makeCurrent();
  }
  function ev() {
    return new we();
  }
  function tv() {
    return Zc(document), document;
  }
  var Nr;
  var an;
  var Qm;
  var td;
  var ed;
  var Ym;
  var Km;
  var nd;
  var nv;
  var rv;
  var rd = p(() => {
    "use strict";
    Ss();
    ne();
    ne();
    Xu();
    Nr = class e extends en {
      supportsDOMEvents = true;
      static makeCurrent() {
        Es(new e());
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
        let n = qm();
        return n == null ? null : Zm(n);
      }
      resetBaseElement() {
        an = null;
      }
      getUserAgent() {
        return window.navigator.userAgent;
      }
      getCookie(t) {
        return Cs(document.cookie, t);
      }
    }, an = null;
    Qm = (() => {
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
    })(), td = (() => {
      class e extends rn {
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
    })(), ed = ["alt", "control", "meta", "shift"], Ym = { "\b": "Backspace", "	": "Tab", "\x7F": "Delete", "\x1B": "Escape", Del: "Delete", Esc: "Escape", Left: "ArrowLeft", Right: "ArrowRight", Up: "ArrowUp", Down: "ArrowDown", Menu: "ContextMenu", Scroll: "ScrollLock", Win: "OS" }, Km = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey }, nd = (() => {
      class e extends rn {
        constructor(n) {
          super(n);
        }
        supports(n) {
          return e.parseEventName(n) != null;
        }
        addEventListener(n, r, o, i) {
          let s = e.parseEventName(r), a = e.eventCallback(s.fullKey, o, this.manager.getZone());
          return this.manager.getZone().runOutsideAngular(() => tn().onAndCancel(n, s.domEventName, a, i));
        }
        static parseEventName(n) {
          let r = n.toLowerCase().split("."), o = r.shift();
          if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
          let i = e._normalizeKey(r.pop()), s = "", a = r.indexOf("code");
          if (a > -1 && (r.splice(a, 1), s = "code."), ed.forEach((c) => {
            let u = r.indexOf(c);
            u > -1 && (r.splice(u, 1), s += c + ".");
          }), s += i, r.length != 0 || i.length === 0) return null;
          let l = {};
          return l.domEventName = o, l.fullKey = s, l;
        }
        static matchEventFullKeyCode(n, r) {
          let o = Ym[n.key] || n.key, i = "";
          return r.indexOf("code.") > -1 && (o = n.code, i = "code."), o == null || !o ? false : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), ed.forEach((s) => {
            if (s !== o) {
              let a = Km[s];
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
    nv = [{ provide: Yt, useValue: Ms }, { provide: ns, useValue: Xm, multi: true }, { provide: ye, useFactory: tv }], rv = [{ provide: fr, useValue: "root" }, { provide: we, useFactory: ev }, { provide: xr, useClass: td, multi: true, deps: [ye] }, { provide: xr, useClass: nd, multi: true, deps: [ye] }, Os, ks, As, { provide: ct, useExisting: Os }, { provide: nn, useClass: Qm }, []];
  });
  var od = p(() => {
    "use strict";
    rd();
  });
  function sv(e) {
    return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
  }
  function av(e) {
    return !!e && e.nodeType === Node.ELEMENT_NODE;
  }
  function lv(e, t) {
    if (!Fs) {
      let n = Element.prototype;
      Fs = n.matches || n.matchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector || n.webkitMatchesSelector;
    }
    return e.nodeType === Node.ELEMENT_NODE ? Fs.call(e, t) : false;
  }
  function cv(e) {
    let t = {};
    return e.forEach(({ propName: n, templateName: r, transform: o }) => {
      t[sv(r)] = [n, o];
    }), t;
  }
  function uv(e, t) {
    return t.get(pt).resolveComponentFactory(e).inputs;
  }
  function dv(e, t) {
    let n = e.childNodes, r = t.map(() => []), o = -1;
    t.some((i, s) => i === "*" ? (o = s, true) : false);
    for (let i = 0, s = n.length; i < s; ++i) {
      let a = n[i], l = fv(a, t, o);
      l !== -1 && r[l].push(a);
    }
    return r;
  }
  function fv(e, t, n) {
    let r = n;
    return av(e) && t.some((o, i) => o !== "*" && lv(e, o) ? (r = i, true) : false), r;
  }
  function id(e, t) {
    let n = uv(e, t.injector), r = t.strategyFactory || new Ls(e, t.injector), o = cv(n);
    class i extends js {
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
        let [f, h] = o[a];
        this.ngElementStrategy.setInputValue(f, c, h);
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
  var iv;
  var Fs;
  var hv;
  var Ls;
  var Vs;
  var js;
  var sd = p(() => {
    "use strict";
    ne();
    Ao();
    ko();
    iv = { schedule(e, t) {
      let n = setTimeout(e, t);
      return () => clearTimeout(n);
    } };
    hv = 10, Ls = class {
      componentFactory;
      inputMap = /* @__PURE__ */ new Map();
      constructor(t, n) {
        this.componentFactory = n.get(pt).resolveComponentFactory(t);
        for (let r of this.componentFactory.inputs) this.inputMap.set(r.propName, r.templateName);
      }
      create(t) {
        return new Vs(this.componentFactory, t, this.inputMap);
      }
    }, Vs = class {
      componentFactory;
      injector;
      inputMap;
      eventEmitters = new Nt(1);
      events = this.eventEmitters.pipe(No((t) => xo(...t)));
      componentRef = null;
      scheduledDestroyFn = null;
      initialInputValues = /* @__PURE__ */ new Map();
      ngZone;
      elementZone;
      appRef;
      cdScheduler;
      constructor(t, n, r) {
        this.componentFactory = t, this.injector = n, this.inputMap = r, this.ngZone = this.injector.get($), this.appRef = this.injector.get(Be), this.cdScheduler = n.get($e), this.elementZone = typeof Zone > "u" ? null : this.ngZone.run(() => Zone.current);
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
          this.componentRef === null || this.scheduledDestroyFn !== null || (this.scheduledDestroyFn = iv.schedule(() => {
            this.componentRef !== null && (this.componentRef.destroy(), this.componentRef = null);
          }, hv));
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
          this.componentRef.setInput(this.inputMap.get(t) ?? t, n), Cu(this.componentRef.hostView) && (Mu(this.componentRef.changeDetectorRef), this.cdScheduler.notify(6));
        });
      }
      initializeComponent(t) {
        let n = Ae.create({ providers: [], parent: this.injector }), r = dv(t, this.componentFactory.ngContentSelectors);
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
    }, js = class extends HTMLElement {
      ngElementEventsSubscription = null;
    };
  });
  var pv;
  var YD;
  var gv;
  var ad;
  var mv;
  var ld;
  var cd = p(() => {
    "use strict";
    ne();
    ne();
    pv = { "[class.ng-untouched]": "isUntouched", "[class.ng-touched]": "isTouched", "[class.ng-pristine]": "isPristine", "[class.ng-dirty]": "isDirty", "[class.ng-valid]": "isValid", "[class.ng-invalid]": "isInvalid", "[class.ng-pending]": "isPending" }, YD = B(D({}, pv), { "[class.ng-submitted]": "isSubmitted" }), gv = new E("", { providedIn: "root", factory: () => ad }), ad = "always", mv = (() => {
      class e {
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275mod = br({ type: e });
        static \u0275inj = ur({});
      }
      return e;
    })(), ld = (() => {
      class e {
        static withConfig(n) {
          return { ngModule: e, providers: [{ provide: gv, useValue: n.callSetDisabledState ?? ad }] };
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275mod = br({ type: e });
        static \u0275inj = ur({ imports: [mv] });
      }
      return e;
    })();
  });
  var S;
  var Hs = p(() => {
    "use strict";
    S = { taskDuration: 300, roundDuration: null, sessionId: null, autoStart: false, startDifficulty: 1, minDifficulty: 1, maxDifficulty: 3, adaptiveDifficulty: true, correctStreakForLevelUp: 4, wrongStreakForLevelDown: 4, numberOfOptions: 8, invoiceOrder: "random", randomSeed: null, maxSubmissions: null, maxCorrectSubmissions: null, showTimer: true, showFeedback: true, showDifficulty: false, completedMessage: "You have completed all invoice matching tasks.", logLevel: "basic", mutedEvents: [] };
  });
  function vv(e) {
    let t = 2166136261;
    for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
    return t >>> 0;
  }
  function yv(e) {
    let t = e;
    return function() {
      t |= 0, t = t + 1831565813 | 0;
      let n = Math.imul(t ^ t >>> 15, 1 | t);
      return n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n, ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }
  function ud(e, t, n) {
    return e + Math.floor(n() * (t - e + 1));
  }
  function _v(e, t) {
    let n = [...e];
    for (let r = n.length - 1; r > 0; r--) {
      let o = Math.floor(t() * (r + 1));
      [n[r], n[o]] = [n[o], n[r]];
    }
    return n;
  }
  function Gs(e) {
    let { oneDigit: t, twoDigit: n } = Us[e];
    return t + n;
  }
  function Iv(e) {
    let t = Math.max(...e), n = 0, r = 0;
    for (let o = 1; o <= t; o *= 10) {
      let i = r;
      for (let s of e) i += Math.floor(s / o) % 10;
      r = Math.floor(i / 10), n += r;
    }
    return n;
  }
  function Dv(e, t) {
    let { oneDigit: n, twoDigit: r, carry: o } = Us[e], i = [...Array(r).fill($s), ...Array(n).fill(dd)];
    for (let s = 0; s < bv; s++) {
      let a = i.map((l) => ud(l.min, l.max, t));
      if (!(new Set(a).size < a.length) && Iv(a) === o) return a;
    }
    return null;
  }
  function wv(e, t, n) {
    let r = e.length;
    for (let o = 0; o < 1 << r; o++) {
      let i = t;
      for (let s = 0; s < r && !(o & 1 << s && (i += e[s], i > n)); s++) ;
      if (i === n) return true;
    }
    return false;
  }
  function Ev(e, t, n, r, o) {
    let i = Us[n].oneDigit > 0 ? dd.min : $s.min, s = $s.max, a = r - e.length, l = [];
    for (let c = 0; c < a; c++) {
      let u = 0, f = false;
      for (; u < 1e3; ) {
        let h = ud(i, s, o), d = [...e, ...l];
        if (!d.includes(h) && !wv(d, h, t)) {
          l.push(h), f = true;
          break;
        }
        u++;
      }
      if (!f) return null;
    }
    return l;
  }
  function fd(e, t, n) {
    let r = Gs(e), o = Math.max(t, r), i = false;
    for (let s = 0; s < 100; s++) {
      let a = Dv(e, n);
      if (!a) continue;
      let l = a.reduce((g, m) => g + m, 0), c = Ev(a, l, e, o, n);
      if (!c) {
        i = true;
        continue;
      }
      let u = [...a.map((g) => ({ amount: g, isCorrect: true })), ...c.map((g) => ({ amount: g, isCorrect: false }))], f = _v(u, n), h = f.map((g, m) => ({ id: `inv-${m + 1}`, amount: g.amount })), d = f.map((g, m) => g.isCorrect ? `inv-${m + 1}` : null).filter((g) => g !== null);
      return { round: { targetAmount: l, visibleInvoices: h, correctInvoiceIds: d }, hadRetries: i };
    }
    throw new Bs();
  }
  function hd(e, t) {
    return e === "fixed" ? yv(vv(t ?? "0")) : Math.random;
  }
  var dd;
  var $s;
  var Us;
  var bv;
  var Bs;
  var zs = p(() => {
    "use strict";
    dd = { min: 1, max: 9 }, $s = { min: 10, max: 99 }, Us = { 1: { oneDigit: 1, twoDigit: 1, carry: 0 }, 2: { oneDigit: 0, twoDigit: 2, carry: 1 }, 3: { oneDigit: 2, twoDigit: 1, carry: 1 }, 4: { oneDigit: 1, twoDigit: 2, carry: 2 }, 5: { oneDigit: 0, twoDigit: 3, carry: 3 }, 6: { oneDigit: 2, twoDigit: 2, carry: 3 } };
    bv = 1e3;
    Bs = class extends Error {
      constructor() {
        super("Round generation failed after 100 attempts \u2014 emit error + end task");
      }
    };
  });
  function vd(e) {
    return e.replace(/[A-Z]/g, (t) => "-" + t.toLowerCase());
  }
  function Ze(e) {
    if (typeof e == "number") return Number.isFinite(e) && Number.isInteger(e) ? e : void 0;
    if (typeof e == "string") {
      let t = e.trim();
      if (t === "") return;
      let n = Number(t);
      return Number.isFinite(n) && Number.isInteger(n) ? n : void 0;
    }
  }
  function Sv(e) {
    if (typeof e == "boolean") return e;
    if (typeof e == "string") {
      let t = e.trim().toLowerCase();
      if (t === "" || t === "true") return true;
      if (t === "false") return false;
    }
  }
  function Rr(e, t, n) {
    return Math.min(n, Math.max(t, e));
  }
  function Tv(e) {
    if (e === null) return { value: null };
    let t = Ze(e);
    return t === void 0 ? { value: S.taskDuration, problem: A("invalid_type", e, S.taskDuration, "taskDuration must be an integer number of seconds") } : t < 0 ? { value: 0, problem: A("out_of_range", e, 0, "taskDuration cannot be negative; using 0 (no time limit)") } : { value: t };
  }
  function xv(e) {
    if (e === null) return { value: null };
    let t = Ze(e);
    return t === void 0 ? { value: S.roundDuration, problem: A("invalid_type", e, S.roundDuration, "roundDuration must be an integer number of seconds") } : t < 0 ? { value: 0, problem: A("out_of_range", e, 0, "roundDuration cannot be negative; using 0 (no per-round limit)") } : { value: t };
  }
  function pd(e, t) {
    return e == null ? { value: null } : typeof e == "string" ? { value: e.trim() === "" ? null : e } : { value: null, problem: A("invalid_type", e, null, `${t} must be a string or null`) };
  }
  function ln(e, t, n) {
    let r = Sv(e);
    return r === void 0 ? { value: n, problem: A("invalid_type", e, n, `${t} must be a boolean`) } : { value: r };
  }
  function Ws(e, t, n) {
    let r = Ze(e);
    if (r === void 0) return { value: n, problem: A("invalid_type", e, n, `${t} must be an integer in [1, 6]`) };
    if (r < 1 || r > 6) {
      let o = Rr(r, 1, 6);
      return { value: o, problem: A("out_of_range", e, o, `${t} must be in [1, 6]`) };
    }
    return { value: r };
  }
  function yd(e, t, n) {
    let r = Ze(e);
    if (r === void 0) return { value: null, problem: A("invalid_type", e, null, "setDifficulty(level) requires an integer") };
    if (r < t || r > n) {
      let o = Rr(r, t, n);
      return { value: o, problem: A("out_of_range", e, o, `difficulty must be in [${t}, ${n}]`) };
    }
    return { value: r };
  }
  function gd(e, t, n) {
    let r = Ze(e);
    return r === void 0 ? { value: n, problem: A("invalid_type", e, n, `${t} must be an integer >= 1`) } : r < 1 ? { value: 1, problem: A("out_of_range", e, 1, `${t} must be >= 1`) } : { value: r };
  }
  function Nv(e) {
    let t = Ze(e);
    if (t === void 0) return { value: S.numberOfOptions, problem: A("invalid_type", e, S.numberOfOptions, "numberOfOptions must be an integer in [3, 12]") };
    if (t < 3 || t > 12) {
      let n = Rr(t, 3, 12);
      return { value: n, problem: A("out_of_range", e, n, "numberOfOptions must be in [3, 12]") };
    }
    return { value: t };
  }
  function Av(e) {
    return e === "fixed" || e === "random" ? { value: e } : { value: S.invoiceOrder, problem: A("invalid_enum", e, S.invoiceOrder, 'invoiceOrder must be "fixed" or "random"') };
  }
  function md(e, t) {
    if (e == null) return { value: null };
    let n = Ze(e);
    return n === void 0 ? { value: null, problem: A("invalid_type", e, null, `${t} must be a positive integer or null`) } : n < 1 ? { value: 1, problem: A("out_of_range", e, 1, `${t} must be >= 1; use null to disable`) } : { value: n };
  }
  function kv(e) {
    return typeof e == "string" ? { value: e } : { value: S.completedMessage, problem: A("invalid_type", e, S.completedMessage, "completedMessage must be a string") };
  }
  function Rv(e) {
    return e === "basic" || e === "detailed" || e === "debug" ? { value: e } : { value: S.logLevel, problem: A("invalid_enum", e, S.logLevel, 'logLevel must be "basic", "detailed" or "debug"') };
  }
  function Ov(e) {
    if (e == null) return { value: [] };
    let t;
    if (Array.isArray(e)) try {
      t = [...e];
    } catch {
      return { value: [], problem: A("invalid_type", e, [], "mutedEvents array could not be read (its iterator or an element accessor threw)") };
    }
    else if (typeof e == "string") t = e.split(",").map((i) => i.trim()).filter((i) => i !== "");
    else return { value: [], problem: A("invalid_type", e, [], "mutedEvents must be an array of event-type names (or a comma-separated string)") };
    let n = [], r = [], o = false;
    for (let i of t) {
      if (typeof i != "string") {
        o = true;
        continue;
      }
      let s = i.trim();
      s !== "" && (Cv.has(s) ? n.includes(s) || n.push(s) : Mv.has(s) || r.push(s));
    }
    return o ? { value: n, problem: A("invalid_type", e, n, "mutedEvents entries must be event-type strings") } : r.length > 0 ? { value: n, problem: A("invalid_enum", e, n, `mutedEvents contains unknown event type(s): ${r.join(", ")}`) } : { value: n };
  }
  function A(e, t, n, r) {
    return { code: e, option: null, received: t, usedValue: n, message: r };
  }
  function It(e, t) {
    let n;
    switch (e) {
      case "taskDuration":
        n = Tv(t);
        break;
      case "roundDuration":
        n = xv(t);
        break;
      case "sessionId":
        n = pd(t, "sessionId");
        break;
      case "randomSeed":
        n = pd(t, "randomSeed");
        break;
      case "autoStart":
        n = ln(t, "autoStart", S.autoStart);
        break;
      case "adaptiveDifficulty":
        n = ln(t, "adaptiveDifficulty", S.adaptiveDifficulty);
        break;
      case "showTimer":
        n = ln(t, "showTimer", S.showTimer);
        break;
      case "showFeedback":
        n = ln(t, "showFeedback", S.showFeedback);
        break;
      case "showDifficulty":
        n = ln(t, "showDifficulty", S.showDifficulty);
        break;
      case "startDifficulty":
        n = Ws(t, "startDifficulty", S.startDifficulty);
        break;
      case "minDifficulty":
        n = Ws(t, "minDifficulty", S.minDifficulty);
        break;
      case "maxDifficulty":
        n = Ws(t, "maxDifficulty", S.maxDifficulty);
        break;
      case "correctStreakForLevelUp":
        n = gd(t, "correctStreakForLevelUp", S.correctStreakForLevelUp);
        break;
      case "wrongStreakForLevelDown":
        n = gd(t, "wrongStreakForLevelDown", S.wrongStreakForLevelDown);
        break;
      case "numberOfOptions":
        n = Nv(t);
        break;
      case "invoiceOrder":
        n = Av(t);
        break;
      case "maxSubmissions":
        n = md(t, "maxSubmissions");
        break;
      case "maxCorrectSubmissions":
        n = md(t, "maxCorrectSubmissions");
        break;
      case "completedMessage":
        n = kv(t);
        break;
      case "logLevel":
        n = Rv(t);
        break;
      case "mutedEvents":
        n = Ov(t);
        break;
      default:
        n = { value: S[e] };
    }
    return n.problem && (n.problem.option = e), n;
  }
  function _d(e) {
    let t = D({}, S), n = [];
    for (let o of _t) {
      if (!(o in e) || e[o] === void 0) continue;
      let { value: i, problem: s } = It(o, e[o]);
      t[o] = i, s && n.push(s);
    }
    if (t.minDifficulty > t.maxDifficulty) {
      let o = t.minDifficulty, i = t.maxDifficulty;
      t.minDifficulty = i, t.maxDifficulty = o, n.push({ code: "range_inverted", option: "minDifficulty", received: { minDifficulty: o, maxDifficulty: i }, usedValue: { minDifficulty: i, maxDifficulty: o }, message: "minDifficulty was greater than maxDifficulty; values swapped" });
    }
    if (t.startDifficulty < t.minDifficulty || t.startDifficulty > t.maxDifficulty) {
      let o = Rr(t.startDifficulty, t.minDifficulty, t.maxDifficulty);
      n.push({ code: "out_of_range", option: "startDifficulty", received: t.startDifficulty, usedValue: o, message: "startDifficulty must be within [minDifficulty, maxDifficulty]" }), t.startDifficulty = o;
    }
    let r = 0;
    for (let o = t.minDifficulty; o <= t.maxDifficulty; o++) r = Math.max(r, Gs(o));
    return t.numberOfOptions < r && (n.push({ code: "out_of_range", option: "numberOfOptions", received: t.numberOfOptions, usedValue: r, message: `numberOfOptions must be at least ${r}, the largest correct subset in [minDifficulty, maxDifficulty]` }), t.numberOfOptions = r), { config: t, problems: n };
  }
  var _t;
  var Ar;
  var Cv;
  var Mv;
  var qs;
  var kr;
  var Zs;
  var Id = p(() => {
    "use strict";
    Hs();
    zs();
    _t = ["taskDuration", "roundDuration", "sessionId", "autoStart", "startDifficulty", "minDifficulty", "maxDifficulty", "adaptiveDifficulty", "correctStreakForLevelUp", "wrongStreakForLevelDown", "numberOfOptions", "invoiceOrder", "randomSeed", "maxSubmissions", "maxCorrectSubmissions", "showTimer", "showFeedback", "showDifficulty", "completedMessage", "logLevel", "mutedEvents"], Ar = /* @__PURE__ */ new Set(["sessionId", "adaptiveDifficulty", "correctStreakForLevelUp", "wrongStreakForLevelDown", "maxSubmissions", "maxCorrectSubmissions", "showTimer", "showFeedback", "showDifficulty", "completedMessage", "logLevel", "mutedEvents"]), Cv = /* @__PURE__ */ new Set(["roundStarted", "selectionChanged", "roundSubmitted", "difficultyChanged", "taskPaused", "taskResumed"]), Mv = /* @__PURE__ */ new Set(["taskStarted", "taskFinished", "taskCompleted", "configChanged", "error"]), qs = /* @__PURE__ */ new Set(["taskDuration", "roundDuration", "startDifficulty", "minDifficulty", "maxDifficulty", "numberOfOptions", "invoiceOrder", "randomSeed"]);
    kr = _t.reduce((e, t) => (e[vd(t)] = t, e), {}), Zs = _t.map(vd);
  });
  function Fv(e, t) {
    if (e & 1 && (P(0, "div", 3)(1, "span", 16), U(2, "Time remaining"), L(), P(3, "span", 17), U(4), L()()), e & 2) {
      let n = ve(2);
      W(4), vt(n.formatClock(n.remainingSeconds()));
    }
  }
  function Lv(e, t) {
    e & 1 && (P(0, "div", 4)(1, "span", 16), U(2, "No time limit"), L()());
  }
  function Vv(e, t) {
    if (e & 1 && (P(0, "div", 5)(1, "span", 16), U(2, "Round time"), L(), P(3, "span", 17), U(4), L()()), e & 2) {
      let n = ve(2);
      W(4), vt(n.formatClock(n.roundRemainingSeconds()));
    }
  }
  function jv(e, t) {
    if (e & 1 && (P(0, "div", 6)(1, "span", 18), U(2, "Level"), L(), P(3, "span", 19), U(4), L()()), e & 2) {
      let n = ve(2);
      W(4), vt(n.currentLevel);
    }
  }
  function Hv(e, t) {
    if (e & 1) {
      let n = ws();
      P(0, "li", 20)(1, "label", 21)(2, "input", 22), Xt("change", function() {
        let o = zi(n).$implicit, i = ve(2);
        return Wi(i.toggleInvoice(o.id));
      }), L(), P(3, "span", 23), U(4, "ACQUISITIONS Inc."), L(), P(5, "span", 24), U(6), L()()();
    }
    if (e & 2) {
      let n = t.$implicit, r = t.$index, o = ve(2);
      Jt("imt-invoice-row--selected", o.isSelected(n.id)), W(2), wr("checked", o.isSelected(n.id))("disabled", !o.isRunning || o.feedbackState !== null), Dr("aria-label", "Invoice " + (r + 1) + ", \u20AC " + n.amount), W(4), yt("\u20AC ", n.amount, "");
    }
  }
  function $v(e, t) {
    if (e & 1 && (P(0, "div", 25), U(1), L()), e & 2) {
      let n = ve(2);
      Jt("imt-feedback--correct", n.feedbackState === "correct")("imt-feedback--wrong", n.feedbackState === "wrong"), W(), yt(" ", n.feedbackState === "correct" ? "Correct" : "Incorrect", " ");
    }
  }
  function Bv(e, t) {
    if (e & 1) {
      let n = ws();
      Kt(0, Fv, 5, 1, "div", 3)(1, Lv, 3, 0, "div", 4)(2, Vv, 5, 1, "div", 5)(3, jv, 5, 1, "div", 6), P(4, "div", 7)(5, "span", 8), U(6, "Payment Amount"), L(), P(7, "span", 9), U(8), L()(), P(9, "div", 10)(10, "ul", 11), Fu(11, Hv, 7, 6, "li", 12, Pv), L(), P(13, "div", 13), Kt(14, $v, 2, 5, "div", 14), P(15, "button", 15), Xt("click", function() {
        zi(n);
        let o = ve();
        return Wi(o.onPost());
      }), U(16, " Post "), L()()();
    }
    if (e & 2) {
      let n = ve();
      mt(n.showTimerDisplay ? 0 : n.showNoTimeLimitLabel ? 1 : -1), W(2), mt(n.showRoundTimerDisplay ? 2 : -1), W(), mt(n.showDifficultyIndicator ? 3 : -1), W(5), yt("\u20AC ", n.targetAmount(), ""), W(3), Lu(n.invoices()), W(3), mt(n.feedbackState !== null ? 14 : -1), W(), wr("disabled", !n.isRunning || n.feedbackState !== null);
    }
  }
  function Uv(e, t) {
    if (e & 1 && (P(0, "div", 1)(1, "span", 26), U(2), L()()), e & 2) {
      let n = ve();
      W(2), vt(n.completedMessage);
    }
  }
  function Gv(e, t) {
    e & 1 && (P(0, "div", 2)(1, "span", 27), U(2, "Ready"), L()());
  }
  var Pv;
  var Or;
  var bd = p(() => {
    "use strict";
    ne();
    cd();
    Hs();
    Id();
    zs();
    ne();
    Pv = (e, t) => t.id;
    Or = class e {
      elementRef = M(mr);
      targetAmount = me(0);
      invoices = me([]);
      _selectedIds = me(/* @__PURE__ */ new Set());
      _state = me("idle");
      _remainingMs = me(0);
      remainingSeconds = Er(() => Math.ceil(this._remainingMs() / 1e3));
      _roundRemainingMs = me(0);
      roundRemainingSeconds = Er(() => Math.ceil(this._roundRemainingMs() / 1e3));
      _feedbackState = me(null);
      _config = me(D({}, S));
      get _effectiveConfig() {
        return this._config();
      }
      static _COPY_FAILED = Object.freeze({ __invoiceTask: "uncopyable_array" });
      _inputConfig = {};
      _attributeObserver = null;
      _rng = Math.random;
      _generator = fd;
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
        let n = this._selectedIds(), r = this.invoices(), o = r.filter((f) => n.has(f.id)).map((f) => f.id), i = r.filter((f) => n.has(f.id)).reduce((f, h) => f + h.amount, 0), s = new Set(this._correctInvoiceIds), a = s.size === o.length && o.every((f) => s.has(f)), l = Math.max(0, Math.round(performance.now() - this._roundStartedAt - this._roundPausedMs));
        if (this._totalSubmissions++, a ? this._totalCorrect++ : this._totalWrong++, this._emit({ eventType: "roundSubmitted", targetAmount: this.targetAmount(), selectedInvoiceIds: o, correctInvoiceIds: [...this._correctInvoiceIds], selectedSum: i, isCorrect: a, reactionTimeMs: l, totalSubmissions: this._totalSubmissions, totalCorrect: this._totalCorrect, totalWrong: this._totalWrong, timedOut: t }), this._effectiveConfig.adaptiveDifficulty) {
          a ? (this._correctStreak++, this._wrongStreak = 0) : (this._wrongStreak++, this._correctStreak = 0);
          let { correctStreakForLevelUp: f, wrongStreakForLevelDown: h, minDifficulty: d, maxDifficulty: g } = this._effectiveConfig;
          if (this._correctStreak >= f) {
            if (this._currentDifficulty < g) {
              let m = this._currentDifficulty;
              this._currentDifficulty = this._currentDifficulty + 1, this._emit({ eventType: "difficultyChanged", fromLevel: m, toLevel: this._currentDifficulty, reason: "streak_up" });
            }
            this._correctStreak = 0, this._wrongStreak = 0;
          } else if (this._wrongStreak >= h) {
            if (this._currentDifficulty > d) {
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
        n !== void 0 && It("autoStart", n).value === true && this.start();
      }
      ngOnDestroy() {
        this._clearTimer(), this._attributeObserver?.disconnect(), this._attributeObserver = null;
      }
      _attachConfigAccessors(t) {
        for (let n of _t) Object.defineProperty(t, n, { configurable: true, enumerable: true, get: () => this._readOption(n), set: (r) => this._writeOption(n, r) });
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
          for (let r of n) r.type !== "attributes" || r.attributeName === null || !kr[r.attributeName] || this._onAttributeChanged(r.attributeName, t.getAttribute(r.attributeName));
        }), this._attributeObserver.observe(t, { attributes: true, attributeFilter: [...Zs] }));
      }
      _readAttributes() {
        let t = this.elementRef.nativeElement, n = {};
        for (let r of Zs) {
          if (!t.hasAttribute(r)) continue;
          let o = kr[r];
          n[o] = t.getAttribute(r) ?? "";
        }
        return n;
      }
      _onAttributeChanged(t, n) {
        let r = kr[t];
        if (r) {
          if (n === null) {
            if (delete this._inputConfig[r], this._state() !== "idle" && Ar.has(r)) {
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
          this._state() === "idle" && It("autoStart", n).value === true && this.start();
          return;
        }
        if (this._state() !== "idle" && !qs.has(t) && Ar.has(t)) {
          let r = this._applyLiveOption(t, n);
          r && this._emit({ eventType: "configChanged", changes: [r] });
        }
      }
      setConfig(t) {
        if (t === null || typeof t != "object") return;
        let n = [], r = this._state() !== "idle", o = false;
        for (let i of Object.keys(t)) {
          if (!_t.includes(i)) {
            this._emitError("unknown_option", "warning", i, `Unknown config option "${i}"`, { received: t[i], usedValue: null });
            continue;
          }
          let s = i, a = t[s];
          if (this._inputConfig[s] = this._cloneOptionValue(a), s === "autoStart") {
            this._state() === "idle" && It("autoStart", a).value === true && (o = true);
            continue;
          }
          if (!(!r || qs.has(s)) && Ar.has(s)) {
            let l = this._applyLiveOption(s, a);
            l && n.push(l);
          }
        }
        n.length > 0 && this._emit({ eventType: "configChanged", changes: n }), o && this.start();
      }
      _applyLiveOption(t, n) {
        let { value: r, problem: o } = It(t, n);
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
        let t = D(D({}, this._readAttributes()), this._inputConfig), { config: n, problems: r } = _d(t);
        this._config.set(n), this._rng = hd(n.invoiceOrder, n.randomSeed), this._sequence = 0, this._roundIndex = -1, this._currentDifficulty = n.startDifficulty, this._pendingDifficulty = null, this._correctStreak = 0, this._wrongStreak = 0, this._totalSubmissions = 0, this._totalCorrect = 0, this._totalWrong = 0, this._totalPausedMs = 0, this._finalDurationMs = -1, this._taskStartedAt = performance.now(), this._state.set("running");
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
        let { minDifficulty: r, maxDifficulty: o } = this._effectiveConfig, { value: i, problem: s } = yd(t, r, o);
        s && this._emitConfigProblem(s), s?.code !== "invalid_type" && (this._pendingDifficulty = i);
      }
      static \u0275fac = function(n) {
        return new (n || e)();
      };
      static \u0275cmp = Ru({ type: e, selectors: [["app-invoice-matching-task"]], decls: 4, vars: 1, consts: [[1, "imt-container"], [1, "imt-completed"], [1, "imt-ready"], ["role", "timer", "aria-live", "off", 1, "imt-timer"], ["role", "status", 1, "imt-timer", "imt-timer--no-limit"], ["role", "timer", "aria-live", "off", 1, "imt-timer", "imt-timer--round"], ["role", "status", 1, "imt-difficulty"], [1, "imt-target-panel"], [1, "imt-target-label"], [1, "imt-target-amount"], [1, "imt-invoices-panel"], ["role", "group", "aria-label", "Invoice options", 1, "imt-invoice-list"], [1, "imt-invoice-row", 3, "imt-invoice-row--selected"], [1, "imt-footer"], ["role", "status", "aria-live", "polite", 1, "imt-feedback", 3, "imt-feedback--correct", "imt-feedback--wrong"], ["type", "button", 1, "imt-post-button", 3, "click", "disabled"], [1, "imt-timer-label"], [1, "imt-timer-value"], [1, "imt-difficulty-label"], [1, "imt-difficulty-value"], [1, "imt-invoice-row"], [1, "imt-invoice-label"], ["type", "checkbox", 1, "imt-invoice-checkbox", 3, "change", "checked", "disabled"], [1, "imt-invoice-customer"], [1, "imt-invoice-amount"], ["role", "status", "aria-live", "polite", 1, "imt-feedback"], [1, "imt-completed-message"], [1, "imt-ready-label"]], template: function(n, r) {
        n & 1 && (P(0, "div", 0), Kt(1, Bv, 17, 6)(2, Uv, 3, 1, "div", 1)(3, Gv, 3, 0, "div", 2), L()), n & 2 && (W(), mt(r.hasActiveRound ? 1 : r.isCompleted ? 2 : 3));
      }, dependencies: [ld], styles: ["[_nghost-%COMP%]{display:block;font-family:var(--invoice-task-font-family, system-ui, sans-serif);background:var(--invoice-task-background, #ffffff);color:#222;border:1px solid var(--invoice-task-border-color, #e0e0e0);border-radius:6px;overflow:hidden;max-width:640px}.imt-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.imt-target-panel[_ngcontent-%COMP%]{padding:1.25rem 1.5rem;background:#f5f5f5;border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);display:flex;align-items:baseline;gap:1rem}.imt-target-label[_ngcontent-%COMP%]{font-size:.78rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#6b6b6b;white-space:nowrap}.imt-target-amount[_ngcontent-%COMP%]{font-size:2rem;font-weight:700;color:#111}.imt-invoices-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:.75rem}.imt-invoice-list[_ngcontent-%COMP%]{flex:1;list-style:none;margin:0;padding:0;overflow-y:auto}.imt-invoice-row[_ngcontent-%COMP%]{border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0)}.imt-invoice-row[_ngcontent-%COMP%]:last-child{border-bottom:none}.imt-invoice-row--selected[_ngcontent-%COMP%]{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;padding:.5rem;cursor:pointer;-webkit-user-select:none;user-select:none}.imt-invoice-label[_ngcontent-%COMP%]:hover{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-checkbox[_ngcontent-%COMP%]{width:1.1rem;height:1.1rem;flex-shrink:0;cursor:pointer;accent-color:var(--invoice-task-primary-color, #111111)}.imt-invoice-checkbox[_ngcontent-%COMP%]:focus-visible, .imt-post-button[_ngcontent-%COMP%]:focus-visible{outline:2px solid var(--invoice-task-primary-color, #111111);outline-offset:2px}.imt-invoice-label[_ngcontent-%COMP%]:focus-within{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-customer[_ngcontent-%COMP%]{flex:1;font-size:.875rem;color:#666}.imt-invoice-amount[_ngcontent-%COMP%]{font-size:.9rem;font-weight:600;color:#222;min-width:4rem;text-align:right}.imt-footer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;padding-top:.75rem;border-top:1px solid var(--invoice-task-border-color, #e0e0e0);margin-top:.5rem}.imt-post-button[_ngcontent-%COMP%]{padding:.45rem 1.5rem;background:var(--invoice-task-primary-color, #111111);color:#fff;border:none;border-radius:4px;font-size:.9rem;font-weight:600;cursor:pointer}.imt-post-button[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:not-allowed}.imt-post-button[_ngcontent-%COMP%]:not(:disabled):hover{filter:brightness(1.4)}.imt-post-button[_ngcontent-%COMP%]:not(:disabled):active{filter:brightness(.95)}.imt-feedback[_ngcontent-%COMP%]{flex:1;padding:.3rem .75rem;border-radius:4px;font-size:.85rem;font-weight:600;align-self:center}.imt-feedback--correct[_ngcontent-%COMP%]{background:#d4edda;color:#155724}.imt-feedback--wrong[_ngcontent-%COMP%]{background:#f8d7da;color:#721c24}.imt-timer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;align-items:center;gap:.5rem;padding:.35rem 1.5rem;background:var(--invoice-task-background, #ffffff);border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);font-size:.8rem}.imt-timer-label[_ngcontent-%COMP%]{color:#6f6f6f}.imt-timer-value[_ngcontent-%COMP%]{font-weight:700;color:#222;min-width:3rem;text-align:right}.imt-timer--no-limit[_ngcontent-%COMP%]{justify-content:flex-start}.imt-timer--round[_ngcontent-%COMP%]{background:var(--invoice-task-highlight-color, #f5f5f5);color:#444}.imt-difficulty[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.4rem;padding:.3rem 1.5rem;background:var(--invoice-task-background, #ffffff);border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);font-size:.8rem}.imt-difficulty-label[_ngcontent-%COMP%]{text-transform:uppercase;letter-spacing:.05em;color:#6f6f6f;font-size:.7rem}.imt-difficulty-value[_ngcontent-%COMP%]{font-weight:700;color:var(--invoice-task-primary-color, #111111)}.imt-completed[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem;text-align:center}.imt-completed-message[_ngcontent-%COMP%]{font-size:1rem;color:#333;line-height:1.5}.imt-ready[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem}.imt-ready-label[_ngcontent-%COMP%]{font-size:1rem;color:#767676;letter-spacing:.04em}"] });
    };
  });
  var zv = Td((Dd) => {
    ne();
    od();
    sd();
    bd();
    cn(null, null, function* () {
      let e = yield Ps({ providers: [ju({ eventCoalescing: true })] }), t = id(Or, { injector: e.injector });
      customElements.define("invoice-matching-task", t);
    }).catch(console.error);
  });
  var stdin_default = zv();
})();
