!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t(require("react"), require("react-dom")))
    : "function" == typeof define && define.amd
      ? define(["react", "react-dom"], t)
      : "object" == typeof exports
        ? (exports.ReactGridLayout = t(require("react"), require("react-dom")))
        : (e.ReactGridLayout = t(e.React, e.ReactDOM));
})(self, function (e, t) {
  return (function () {
    var r = {
        325: function (e, t, r) {
          (e.exports = r(606).default),
            (e.exports.utils = r(872)),
            (e.exports.Responsive = r(94).default),
            (e.exports.Responsive.utils = r(271)),
            (e.exports.WidthProvider = r(663).default);
        },
        606: function (e, t, r) {
          "use strict";
          r.d(t, {
            default: function () {
              return V;
            },
          });
          var n = r(359),
            o = r.n(n),
            a = r(307),
            i = r.n(a),
            s = r(10),
            u = r(872);
          function l(e) {
            var t = e.margin,
              r = e.containerPadding,
              n = e.containerWidth,
              o = e.cols;
            return (n - t[0] * (o - 1) - 2 * r[0]) / o;
          }
          function c(e, t, r) {
            return Number.isFinite(e) ? Math.round(t * e + Math.max(0, e - 1) * r) : e;
          }
          function f(e, t, r, n, o, a) {
            var i = e.margin,
              s = e.containerPadding,
              u = e.rowHeight,
              f = l(e),
              p = {};
            return (
              a && a.resizing
                ? ((p.width = Math.round(a.resizing.width)), (p.height = Math.round(a.resizing.height)))
                : ((p.width = c(n, f, i[0])), (p.height = c(o, u, i[1]))),
              a && a.dragging
                ? ((p.top = Math.round(a.dragging.top)), (p.left = Math.round(a.dragging.left)))
                : ((p.top = Math.round((u + i[1]) * r + s[1])), (p.left = Math.round((f + i[0]) * t + s[0]))),
              p
            );
          }
          function p(e, t, r, n, o) {
            var a = e.margin,
              i = e.cols,
              s = e.rowHeight,
              u = e.maxRows,
              c = l(e),
              f = Math.round((r - a[0]) / (c + a[0])),
              p = Math.round((t - a[1]) / (s + a[1]));
            return { x: (f = d(f, 0, i - n)), y: (p = d(p, 0, u - o)) };
          }
          function d(e, t, r) {
            return Math.max(Math.min(e, r), t);
          }
          var y = r(697),
            h = r.n(y),
            g = r(193),
            b = r(706),
            m = h().arrayOf(h().oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])),
            v = h().oneOfType([h().node, h().func]),
            w = {
              className: h().string,
              style: h().object,
              width: h().number,
              autoSize: h().bool,
              cols: h().number,
              draggableCancel: h().string,
              draggableHandle: h().string,
              verticalCompact: function (e) {
                e.verticalCompact;
              },
              compactType: h().oneOf(["vertical", "horizontal"]),
              layout: function (e) {
                var t = e.layout;
                void 0 !== t && r(872).validateLayout(t, "layout");
              },
              margin: h().arrayOf(h().number),
              containerPadding: h().arrayOf(h().number),
              rowHeight: h().number,
              maxRows: h().number,
              isBounded: h().bool,
              isDraggable: h().bool,
              isResizable: h().bool,
              allowOverlap: h().bool,
              preventCollision: h().bool,
              useCSSTransforms: h().bool,
              transformScale: h().number,
              isDroppable: h().bool,
              resizeHandles: m,
              resizeHandle: v,
              onLayoutChange: h().func,
              onDragStart: h().func,
              onDrag: h().func,
              onDragStop: h().func,
              onResizeStart: h().func,
              onResize: h().func,
              onResizeStop: h().func,
              onDrop: h().func,
              droppingItem: h().shape({
                i: h().string.isRequired,
                w: h().number.isRequired,
                h: h().number.isRequired,
              }),
              children: function (e, t) {
                var r = e[t],
                  n = {};
                o().Children.forEach(r, function (e) {
                  if (null != (null == e ? void 0 : e.key)) {
                    if (n[e.key]) throw new Error('Duplicate child key "' + e.key + '" found! This will cause problems in ReactGridLayout.');
                    n[e.key] = !0;
                  }
                });
              },
              innerRef: h().any,
            };
          function O(e) {
            return (
              (O =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }),
              O(e)
            );
          }
          function S(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function j(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? S(Object(r), !0).forEach(function (t) {
                    C(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : S(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function P(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }
          function D(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
            }
          }
          function x(e, t) {
            return (
              (x =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              x(e, t)
            );
          }
          function R(e, t) {
            if (t && ("object" === O(t) || "function" == typeof t)) return t;
            if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
            return _(e);
          }
          function _(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }
          function z(e) {
            return (
              (z = Object.setPrototypeOf
                ? Object.getPrototypeOf
                : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                  }),
              z(e)
            );
          }
          function C(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          var k = (function (e) {
            !(function (e, t) {
              if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
              (e.prototype = Object.create(t && t.prototype, {
                constructor: { value: e, writable: !0, configurable: !0 },
              })),
                Object.defineProperty(e, "prototype", { writable: !1 }),
                t && x(e, t);
            })(y, e);
            var t,
              r,
              n,
              a,
              i =
                ((n = y),
                (a = (function () {
                  if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                  if (Reflect.construct.sham) return !1;
                  if ("function" == typeof Proxy) return !0;
                  try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
                  } catch (e) {
                    return !1;
                  }
                })()),
                function () {
                  var e,
                    t = z(n);
                  if (a) {
                    var r = z(this).constructor;
                    e = Reflect.construct(t, arguments, r);
                  } else e = t.apply(this, arguments);
                  return R(this, e);
                });
            function y() {
              var e;
              P(this, y);
              for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
              return (
                C(_((e = i.call.apply(i, [this].concat(r)))), "state", {
                  resizing: null,
                  dragging: null,
                  className: "",
                }),
                C(_(e), "elementRef", o().createRef()),
                C(_(e), "onDragStart", function (t, r) {
                  var n = r.node,
                    o = e.props,
                    a = o.onDragStart,
                    i = o.transformScale;
                  if (a) {
                    var s = { top: 0, left: 0 },
                      u = n.offsetParent;
                    if (u) {
                      var l = u.getBoundingClientRect(),
                        c = n.getBoundingClientRect(),
                        f = c.left / i,
                        d = l.left / i,
                        y = c.top / i,
                        h = l.top / i;
                      (s.left = f - d + u.scrollLeft), (s.top = y - h + u.scrollTop), e.setState({ dragging: s });
                      var g = p(e.getPositionParams(), s.top, s.left, e.props.w, e.props.h),
                        b = g.x,
                        m = g.y;
                      return a.call(_(e), e.props.i, b, m, {
                        e: t,
                        node: n,
                        newPosition: s,
                      });
                    }
                  }
                }),
                C(_(e), "onDrag", function (t, r) {
                  var n = r.node,
                    o = r.deltaX,
                    a = r.deltaY,
                    i = e.props.onDrag;
                  if (i) {
                    if (!e.state.dragging) throw new Error("onDrag called before onDragStart.");
                    var s = e.state.dragging.top + a,
                      u = e.state.dragging.left + o,
                      f = e.props,
                      y = f.isBounded,
                      h = f.i,
                      g = f.w,
                      b = f.h,
                      m = f.containerWidth,
                      v = e.getPositionParams();
                    if (y) {
                      var w = n.offsetParent;
                      if (w) {
                        var O = e.props,
                          S = O.margin,
                          j = O.rowHeight;
                        (s = d(s, 0, w.clientHeight - c(b, j, S[1]))), (u = d(u, 0, m - c(g, l(v), S[0])));
                      }
                    }
                    var P = { top: s, left: u };
                    e.setState({ dragging: P });
                    var D = p(v, s, u, g, b),
                      x = D.x,
                      R = D.y;
                    return i.call(_(e), h, x, R, {
                      e: t,
                      node: n,
                      newPosition: P,
                    });
                  }
                }),
                C(_(e), "onDragStop", function (t, r) {
                  var n = r.node,
                    o = e.props.onDragStop;
                  if (o) {
                    if (!e.state.dragging) throw new Error("onDragEnd called before onDragStart.");
                    var a = e.props,
                      i = a.w,
                      s = a.h,
                      u = a.i,
                      l = e.state.dragging,
                      c = l.left,
                      f = l.top,
                      d = { top: f, left: c };
                    e.setState({ dragging: null });
                    var y = p(e.getPositionParams(), f, c, i, s),
                      h = y.x,
                      g = y.y;
                    return o.call(_(e), u, h, g, {
                      e: t,
                      node: n,
                      newPosition: d,
                    });
                  }
                }),
                C(_(e), "onResizeStop", function (t, r) {
                  e.onResizeHandler(t, r, "onResizeStop");
                }),
                C(_(e), "onResizeStart", function (t, r) {
                  e.onResizeHandler(t, r, "onResizeStart");
                }),
                C(_(e), "onResize", function (t, r) {
                  e.onResizeHandler(t, r, "onResize");
                }),
                e
              );
            }
            return (
              (t = y),
              (r = [
                {
                  key: "shouldComponentUpdate",
                  value: function (e, t) {
                    if (this.props.children !== e.children) return !0;
                    if (this.props.droppingPosition !== e.droppingPosition) return !0;
                    var r = f(this.getPositionParams(this.props), this.props.x, this.props.y, this.props.w, this.props.h, this.state),
                      n = f(this.getPositionParams(e), e.x, e.y, e.w, e.h, t);
                    return !(0, u.fastPositionEqual)(r, n) || this.props.useCSSTransforms !== e.useCSSTransforms;
                  },
                },
                {
                  key: "componentDidMount",
                  value: function () {
                    this.moveDroppingItem({});
                  },
                },
                {
                  key: "componentDidUpdate",
                  value: function (e) {
                    this.moveDroppingItem(e);
                  },
                },
                {
                  key: "moveDroppingItem",
                  value: function (e) {
                    var t = this.props.droppingPosition;
                    if (t) {
                      var r = this.elementRef.current;
                      if (r) {
                        var n = e.droppingPosition || { left: 0, top: 0 },
                          o = this.state.dragging,
                          a = (o && t.left !== n.left) || t.top !== n.top;
                        if (o) {
                          if (a) {
                            var i = t.left - o.left,
                              s = t.top - o.top;
                            this.onDrag(t.e, { node: r, deltaX: i, deltaY: s });
                          }
                        } else
                          this.onDragStart(t.e, {
                            node: r,
                            deltaX: t.left,
                            deltaY: t.top,
                          });
                      }
                    }
                  },
                },
                {
                  key: "getPositionParams",
                  value: function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.props;
                    return {
                      cols: e.cols,
                      containerPadding: e.containerPadding,
                      containerWidth: e.containerWidth,
                      margin: e.margin,
                      maxRows: e.maxRows,
                      rowHeight: e.rowHeight,
                    };
                  },
                },
                {
                  key: "createStyle",
                  value: function (e) {
                    var t,
                      r = this.props,
                      n = r.usePercentages,
                      o = r.containerWidth;
                    return (
                      r.useCSSTransforms
                        ? (t = (0, u.setTransform)(e))
                        : ((t = (0, u.setTopLeft)(e)), n && ((t.left = (0, u.perc)(e.left / o)), (t.width = (0, u.perc)(e.width / o)))),
                      t
                    );
                  },
                },
                {
                  key: "mixinDraggable",
                  value: function (e, t) {
                    return o().createElement(
                      g.DraggableCore,
                      {
                        disabled: !t,
                        onStart: this.onDragStart,
                        onDrag: this.onDrag,
                        onStop: this.onDragStop,
                        handle: this.props.handle,
                        cancel: ".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : ""),
                        scale: this.props.transformScale,
                        nodeRef: this.elementRef,
                      },
                      e
                    );
                  },
                },
                {
                  key: "mixinResizable",
                  value: function (e, t, r) {
                    var n = this.props,
                      a = n.cols,
                      i = n.x,
                      s = n.minW,
                      u = n.minH,
                      l = n.maxW,
                      c = n.maxH,
                      p = n.transformScale,
                      d = n.resizeHandles,
                      y = n.resizeHandle,
                      h = this.getPositionParams(),
                      g = f(h, 0, 0, a - i, 0).width,
                      m = f(h, 0, 0, s, u),
                      v = f(h, 0, 0, l, c),
                      w = [m.width, m.height],
                      O = [Math.min(v.width, g), Math.min(v.height, 1 / 0)];
                    return o().createElement(
                      b.Resizable,
                      {
                        draggableOpts: { disabled: !r },
                        className: r ? void 0 : "react-resizable-hide",
                        width: t.width,
                        height: t.height,
                        minConstraints: w,
                        maxConstraints: O,
                        onResizeStop: this.onResizeStop,
                        onResizeStart: this.onResizeStart,
                        onResize: this.onResize,
                        transformScale: p,
                        resizeHandles: d,
                        handle: y,
                      },
                      e
                    );
                  },
                },
                {
                  key: "onResizeHandler",
                  value: function (e, t, r) {
                    var n = t.node,
                      o = t.size,
                      a = this.props[r];
                    if (a) {
                      var i = this.props,
                        s = i.cols,
                        u = i.x,
                        c = i.y,
                        f = i.i,
                        p = i.maxH,
                        y = i.minH,
                        h = this.props,
                        g = h.minW,
                        b = h.maxW,
                        m = (function (e, t, r, n, o) {
                          var a = e.margin,
                            i = e.maxRows,
                            s = e.cols,
                            u = e.rowHeight,
                            c = l(e),
                            f = Math.round((t + a[0]) / (c + a[0])),
                            p = Math.round((r + a[1]) / (u + a[1]));
                          return {
                            w: (f = d(f, 0, s - n)),
                            h: (p = d(p, 0, i - o)),
                          };
                        })(this.getPositionParams(), o.width, o.height, u, c),
                        v = m.w,
                        w = m.h;
                      (v = d(v, (g = Math.max(g, 1)), (b = Math.min(b, s - u)))),
                        (w = d(w, y, p)),
                        this.setState({
                          resizing: "onResizeStop" === r ? null : o,
                        }),
                        a.call(this, f, v, w, { e: e, node: n, size: o });
                    }
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      t = e.x,
                      r = e.y,
                      n = e.w,
                      a = e.h,
                      i = e.isDraggable,
                      u = e.isResizable,
                      l = e.droppingPosition,
                      c = e.useCSSTransforms,
                      p = f(this.getPositionParams(), t, r, n, a, this.state),
                      d = o().Children.only(this.props.children),
                      y = o().cloneElement(d, {
                        ref: this.elementRef,
                        className: (0, s.default)("react-grid-item", d.props.className, this.props.className, {
                          static: this.props.static,
                          resizing: Boolean(this.state.resizing),
                          "react-draggable": i,
                          "react-draggable-dragging": Boolean(this.state.dragging),
                          dropping: Boolean(l),
                          cssTransforms: c,
                        }),
                        style: j(j(j({}, this.props.style), d.props.style), this.createStyle(p)),
                      });
                    return (y = this.mixinResizable(y, p, u)), this.mixinDraggable(y, i);
                  },
                },
              ]),
              r && D(t.prototype, r),
              Object.defineProperty(t, "prototype", { writable: !1 }),
              y
            );
          })(o().Component);
          function E(e) {
            return (
              (E =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }),
              E(e)
            );
          }
          function T(e) {
            return (
              (function (e) {
                if (Array.isArray(e)) return W(e);
              })(e) ||
              (function (e) {
                if (("undefined" != typeof Symbol && null != e[Symbol.iterator]) || null != e["@@iterator"]) return Array.from(e);
              })(e) ||
              N(e) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
              })()
            );
          }
          function M(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function H(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? M(Object(r), !0).forEach(function (t) {
                    Y(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : M(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function L(e, t) {
            return (
              (function (e) {
                if (Array.isArray(e)) return e;
              })(e) ||
              (function (e, t) {
                var r = null == e ? null : ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
                if (null != r) {
                  var n,
                    o,
                    a = [],
                    i = !0,
                    s = !1;
                  try {
                    for (r = r.call(e); !(i = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); i = !0);
                  } catch (e) {
                    (s = !0), (o = e);
                  } finally {
                    try {
                      i || null == r.return || r.return();
                    } finally {
                      if (s) throw o;
                    }
                  }
                  return a;
                }
              })(e, t) ||
              N(e, t) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
              })()
            );
          }
          function N(e, t) {
            if (e) {
              if ("string" == typeof e) return W(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              return (
                "Object" === r && e.constructor && (r = e.constructor.name),
                "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? W(e, t) : void 0
              );
            }
          }
          function W(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n;
          }
          function A(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }
          function I(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
            }
          }
          function B(e, t) {
            return (
              (B =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              B(e, t)
            );
          }
          function q(e, t) {
            if (t && ("object" === E(t) || "function" == typeof t)) return t;
            if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
            return U(e);
          }
          function U(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }
          function X(e) {
            return (
              (X = Object.setPrototypeOf
                ? Object.getPrototypeOf
                : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                  }),
              X(e)
            );
          }
          function Y(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          C(k, "propTypes", {
            children: h().element,
            cols: h().number.isRequired,
            containerWidth: h().number.isRequired,
            rowHeight: h().number.isRequired,
            margin: h().array.isRequired,
            maxRows: h().number.isRequired,
            containerPadding: h().array.isRequired,
            x: h().number.isRequired,
            y: h().number.isRequired,
            w: h().number.isRequired,
            h: h().number.isRequired,
            minW: function (e, t) {
              var r = e[t];
              return "number" != typeof r
                ? new Error("minWidth not Number")
                : r > e.w || r > e.maxW
                  ? new Error("minWidth larger than item width/maxWidth")
                  : void 0;
            },
            maxW: function (e, t) {
              var r = e[t];
              return "number" != typeof r
                ? new Error("maxWidth not Number")
                : r < e.w || r < e.minW
                  ? new Error("maxWidth smaller than item width/minWidth")
                  : void 0;
            },
            minH: function (e, t) {
              var r = e[t];
              return "number" != typeof r
                ? new Error("minHeight not Number")
                : r > e.h || r > e.maxH
                  ? new Error("minHeight larger than item height/maxHeight")
                  : void 0;
            },
            maxH: function (e, t) {
              var r = e[t];
              return "number" != typeof r
                ? new Error("maxHeight not Number")
                : r < e.h || r < e.minH
                  ? new Error("maxHeight smaller than item height/minHeight")
                  : void 0;
            },
            i: h().string.isRequired,
            resizeHandles: m,
            resizeHandle: v,
            onDragStop: h().func,
            onDragStart: h().func,
            onDrag: h().func,
            onResizeStop: h().func,
            onResizeStart: h().func,
            onResize: h().func,
            isDraggable: h().bool.isRequired,
            isResizable: h().bool.isRequired,
            isBounded: h().bool.isRequired,
            static: h().bool,
            useCSSTransforms: h().bool.isRequired,
            transformScale: h().number,
            className: h().string,
            handle: h().string,
            cancel: h().string,
            droppingPosition: h().shape({
              e: h().object.isRequired,
              left: h().number.isRequired,
              top: h().number.isRequired,
            }),
          }),
            C(k, "defaultProps", {
              className: "",
              cancel: "",
              handle: "",
              minH: 1,
              minW: 1,
              maxH: 1 / 0,
              maxW: 1 / 0,
              transformScale: 1,
            });
          var F = "react-grid-layout",
            G = !1;
          try {
            G = /firefox/i.test(navigator.userAgent);
          } catch (e) {}
          var V = (function (e) {
            !(function (e, t) {
              if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
              (e.prototype = Object.create(t && t.prototype, {
                constructor: { value: e, writable: !0, configurable: !0 },
              })),
                Object.defineProperty(e, "prototype", { writable: !1 }),
                t && B(e, t);
            })(f, e);
            var t,
              r,
              o,
              a,
              l,
              c =
                ((a = f),
                (l = (function () {
                  if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                  if (Reflect.construct.sham) return !1;
                  if ("function" == typeof Proxy) return !0;
                  try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
                  } catch (e) {
                    return !1;
                  }
                })()),
                function () {
                  var e,
                    t = X(a);
                  if (l) {
                    var r = X(this).constructor;
                    e = Reflect.construct(t, arguments, r);
                  } else e = t.apply(this, arguments);
                  return q(this, e);
                });
            function f() {
              var e;
              A(this, f);
              for (var t = arguments.length, r = new Array(t), o = 0; o < t; o++) r[o] = arguments[o];
              return (
                Y(U((e = c.call.apply(c, [this].concat(r)))), "state", {
                  activeDrag: null,
                  layout: (0, u.synchronizeLayoutWithChildren)(
                    e.props.layout,
                    e.props.children,
                    e.props.cols,
                    (0, u.compactType)(e.props),
                    e.props.allowOverlap
                  ),
                  mounted: !1,
                  oldDragItem: null,
                  oldLayout: null,
                  oldResizeItem: null,
                  droppingDOMNode: null,
                  children: [],
                }),
                Y(U(e), "dragEnterCounter", 0),
                Y(U(e), "onDragStart", function (t, r, n, o) {
                  var a = o.e,
                    i = o.node,
                    s = e.state.layout,
                    l = (0, u.getLayoutItem)(s, t);
                  if (l)
                    return (
                      e.setState({
                        oldDragItem: (0, u.cloneLayoutItem)(l),
                        oldLayout: s,
                      }),
                      e.props.onDragStart(s, l, l, null, a, i)
                    );
                }),
                Y(U(e), "onDrag", function (t, r, n, o) {
                  var a = o.e,
                    i = o.node,
                    s = e.state.oldDragItem,
                    l = e.state.layout,
                    c = e.props,
                    f = c.cols,
                    p = c.allowOverlap,
                    d = c.preventCollision,
                    y = (0, u.getLayoutItem)(l, t);
                  if (y) {
                    var h = {
                      w: y.w,
                      h: y.h,
                      x: y.x,
                      y: y.y,
                      placeholder: !0,
                      i: t,
                    };
                    (l = (0, u.moveElement)(l, y, r, n, !0, d, (0, u.compactType)(e.props), f, p)),
                      e.props.onDrag(l, s, y, h, a, i),
                      e.setState({
                        layout: p ? l : (0, u.compact)(l, (0, u.compactType)(e.props), f),
                        activeDrag: h,
                      });
                  }
                }),
                Y(U(e), "onDragStop", function (t, r, n, o) {
                  var a = o.e,
                    i = o.node;
                  if (e.state.activeDrag) {
                    var s = e.state.oldDragItem,
                      l = e.state.layout,
                      c = e.props,
                      f = c.cols,
                      p = c.preventCollision,
                      d = c.allowOverlap,
                      y = (0, u.getLayoutItem)(l, t);
                    if (y) {
                      (l = (0, u.moveElement)(l, y, r, n, !0, p, (0, u.compactType)(e.props), f, d)), e.props.onDragStop(l, s, y, null, a, i);
                      var h = d ? l : (0, u.compact)(l, (0, u.compactType)(e.props), f),
                        g = e.state.oldLayout;
                      e.setState({
                        activeDrag: null,
                        layout: h,
                        oldDragItem: null,
                        oldLayout: null,
                      }),
                        e.onLayoutMaybeChanged(h, g);
                    }
                  }
                }),
                Y(U(e), "onResizeStart", function (t, r, n, o) {
                  var a = o.e,
                    i = o.node,
                    s = e.state.layout,
                    l = (0, u.getLayoutItem)(s, t);
                  l &&
                    (e.setState({
                      oldResizeItem: (0, u.cloneLayoutItem)(l),
                      oldLayout: e.state.layout,
                    }),
                    e.props.onResizeStart(s, l, l, null, a, i));
                }),
                Y(U(e), "onResize", function (t, r, n, o) {
                  var a = o.e,
                    i = o.node,
                    s = e.state,
                    l = s.layout,
                    c = s.oldResizeItem,
                    f = e.props,
                    p = f.cols,
                    d = f.preventCollision,
                    y = f.allowOverlap,
                    h = (0, u.withLayoutItem)(l, t, function (e) {
                      var t;
                      if (d && !y) {
                        var o = (0, u.getAllCollisions)(l, H(H({}, e), {}, { w: r, h: n })).filter(function (t) {
                          return t.i !== e.i;
                        });
                        if ((t = o.length > 0)) {
                          var a = 1 / 0,
                            i = 1 / 0;
                          o.forEach(function (t) {
                            t.x > e.x && (a = Math.min(a, t.x)), t.y > e.y && (i = Math.min(i, t.y));
                          }),
                            Number.isFinite(a) && (e.w = a - e.x),
                            Number.isFinite(i) && (e.h = i - e.y);
                        }
                      }
                      return t || ((e.w = r), (e.h = n)), e;
                    }),
                    g = L(h, 2),
                    b = g[0],
                    m = g[1];
                  if (m) {
                    var v = {
                      w: m.w,
                      h: m.h,
                      x: m.x,
                      y: m.y,
                      static: !0,
                      i: t,
                    };
                    e.props.onResize(b, c, m, v, a, i),
                      e.setState({
                        layout: y ? b : (0, u.compact)(b, (0, u.compactType)(e.props), p),
                        activeDrag: v,
                      });
                  }
                }),
                Y(U(e), "onResizeStop", function (t, r, n, o) {
                  var a = o.e,
                    i = o.node,
                    s = e.state,
                    l = s.layout,
                    c = s.oldResizeItem,
                    f = e.props,
                    p = f.cols,
                    d = f.allowOverlap,
                    y = (0, u.getLayoutItem)(l, t);
                  e.props.onResizeStop(l, c, y, null, a, i);
                  var h = d ? l : (0, u.compact)(l, (0, u.compactType)(e.props), p),
                    g = e.state.oldLayout;
                  e.setState({
                    activeDrag: null,
                    layout: h,
                    oldResizeItem: null,
                    oldLayout: null,
                  }),
                    e.onLayoutMaybeChanged(h, g);
                }),
                Y(U(e), "onDragOver", function (t) {
                  var r;
                  if ((t.preventDefault(), t.stopPropagation(), G && (null === (r = t.nativeEvent.target) || void 0 === r || !r.classList.contains(F))))
                    return !1;
                  var o = e.props,
                    a = o.droppingItem,
                    i = o.onDropDragOver,
                    s = o.margin,
                    u = o.cols,
                    l = o.rowHeight,
                    c = o.maxRows,
                    f = o.width,
                    d = o.containerPadding,
                    y = o.transformScale,
                    h = null == i ? void 0 : i(t);
                  if (!1 === h) return e.state.droppingDOMNode && e.removeDroppingPlaceholder(), !1;
                  var g = H(H({}, a), h),
                    b = e.state.layout,
                    m = t.nativeEvent,
                    v = m.layerX,
                    w = m.layerY,
                    O = { left: v / y, top: w / y, e: t };
                  if (e.state.droppingDOMNode) {
                    if (e.state.droppingPosition) {
                      var S = e.state.droppingPosition,
                        j = S.left,
                        P = S.top;
                      (j != v || P != w) && e.setState({ droppingPosition: O });
                    }
                  } else {
                    var D = p(
                      {
                        cols: u,
                        margin: s,
                        maxRows: c,
                        rowHeight: l,
                        containerWidth: f,
                        containerPadding: d || s,
                      },
                      w,
                      v,
                      g.w,
                      g.h
                    );
                    e.setState({
                      droppingDOMNode: n.createElement("div", { key: g.i }),
                      droppingPosition: O,
                      layout: [].concat(T(b), [H(H({}, g), {}, { x: D.x, y: D.y, static: !1, isDraggable: !0 })]),
                    });
                  }
                }),
                Y(U(e), "removeDroppingPlaceholder", function () {
                  var t = e.props,
                    r = t.droppingItem,
                    n = t.cols,
                    o = e.state.layout,
                    a = (0, u.compact)(
                      o.filter(function (e) {
                        return e.i !== r.i;
                      }),
                      (0, u.compactType)(e.props),
                      n
                    );
                  e.setState({
                    layout: a,
                    droppingDOMNode: null,
                    activeDrag: null,
                    droppingPosition: void 0,
                  });
                }),
                Y(U(e), "onDragLeave", function (t) {
                  t.preventDefault(), t.stopPropagation(), e.dragEnterCounter--, 0 === e.dragEnterCounter && e.removeDroppingPlaceholder();
                }),
                Y(U(e), "onDragEnter", function (t) {
                  t.preventDefault(), t.stopPropagation(), e.dragEnterCounter++;
                }),
                Y(U(e), "onDrop", function (t) {
                  t.preventDefault(), t.stopPropagation();
                  var r = e.props.droppingItem,
                    n = e.state.layout,
                    o = n.find(function (e) {
                      return e.i === r.i;
                    });
                  (e.dragEnterCounter = 0), e.removeDroppingPlaceholder(), e.props.onDrop(n, o, t);
                }),
                e
              );
            }
            return (
              (t = f),
              (o = [
                {
                  key: "getDerivedStateFromProps",
                  value: function (e, t) {
                    var r;
                    return t.activeDrag
                      ? null
                      : (i()(e.layout, t.propsLayout) && e.compactType === t.compactType
                          ? (0, u.childrenEqual)(e.children, t.children) || (r = t.layout)
                          : (r = e.layout),
                        r
                          ? {
                              layout: (0, u.synchronizeLayoutWithChildren)(r, e.children, e.cols, (0, u.compactType)(e), e.allowOverlap),
                              compactType: e.compactType,
                              children: e.children,
                              propsLayout: e.layout,
                            }
                          : null);
                  },
                },
              ]),
              (r = [
                {
                  key: "componentDidMount",
                  value: function () {
                    this.setState({ mounted: !0 }), this.onLayoutMaybeChanged(this.state.layout, this.props.layout);
                  },
                },
                {
                  key: "shouldComponentUpdate",
                  value: function (e, t) {
                    return (
                      this.props.children !== e.children ||
                      !(0, u.fastRGLPropsEqual)(this.props, e, i()) ||
                      this.state.activeDrag !== t.activeDrag ||
                      this.state.mounted !== t.mounted ||
                      this.state.droppingPosition !== t.droppingPosition
                    );
                  },
                },
                {
                  key: "componentDidUpdate",
                  value: function (e, t) {
                    if (!this.state.activeDrag) {
                      var r = this.state.layout,
                        n = t.layout;
                      this.onLayoutMaybeChanged(r, n);
                    }
                  },
                },
                {
                  key: "containerHeight",
                  value: function () {
                    if (this.props.autoSize) {
                      var e = (0, u.bottom)(this.state.layout),
                        t = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
                      return e * this.props.rowHeight + (e - 1) * this.props.margin[1] + 2 * t + "px";
                    }
                  },
                },
                {
                  key: "onLayoutMaybeChanged",
                  value: function (e, t) {
                    t || (t = this.state.layout), i()(t, e) || this.props.onLayoutChange(e);
                  },
                },
                {
                  key: "placeholder",
                  value: function () {
                    var e = this.state.activeDrag;
                    if (!e) return null;
                    var t = this.props,
                      r = t.width,
                      o = t.cols,
                      a = t.margin,
                      i = t.containerPadding,
                      s = t.rowHeight,
                      u = t.maxRows,
                      l = t.useCSSTransforms,
                      c = t.transformScale;
                    return n.createElement(
                      k,
                      {
                        w: e.w,
                        h: e.h,
                        x: e.x,
                        y: e.y,
                        i: e.i,
                        className: "react-grid-placeholder",
                        containerWidth: r,
                        cols: o,
                        margin: a,
                        containerPadding: i || a,
                        maxRows: u,
                        rowHeight: s,
                        isDraggable: !1,
                        isResizable: !1,
                        isBounded: !1,
                        useCSSTransforms: l,
                        transformScale: c,
                      },
                      n.createElement("div", null)
                    );
                  },
                },
                {
                  key: "processGridItem",
                  value: function (e, t) {
                    if (e && e.key) {
                      var r = (0, u.getLayoutItem)(this.state.layout, String(e.key));
                      if (!r) return null;
                      var o = this.props,
                        a = o.width,
                        i = o.cols,
                        s = o.margin,
                        l = o.containerPadding,
                        c = o.rowHeight,
                        f = o.maxRows,
                        p = o.isDraggable,
                        d = o.isResizable,
                        y = o.isBounded,
                        h = o.useCSSTransforms,
                        g = o.transformScale,
                        b = o.draggableCancel,
                        m = o.draggableHandle,
                        v = o.resizeHandles,
                        w = o.resizeHandle,
                        O = this.state,
                        S = O.mounted,
                        j = O.droppingPosition,
                        P = "boolean" == typeof r.isDraggable ? r.isDraggable : !r.static && p,
                        D = "boolean" == typeof r.isResizable ? r.isResizable : !r.static && d,
                        x = r.resizeHandles || v,
                        R = P && y && !1 !== r.isBounded;
                      return n.createElement(
                        k,
                        {
                          containerWidth: a,
                          cols: i,
                          margin: s,
                          containerPadding: l || s,
                          maxRows: f,
                          rowHeight: c,
                          cancel: b,
                          handle: m,
                          onDragStop: this.onDragStop,
                          onDragStart: this.onDragStart,
                          onDrag: this.onDrag,
                          onResizeStart: this.onResizeStart,
                          onResize: this.onResize,
                          onResizeStop: this.onResizeStop,
                          isDraggable: P,
                          isResizable: D,
                          isBounded: R,
                          useCSSTransforms: h && S,
                          usePercentages: !S,
                          transformScale: g,
                          w: r.w,
                          h: r.h,
                          x: r.x,
                          y: r.y,
                          i: r.i,
                          minH: r.minH,
                          minW: r.minW,
                          maxH: r.maxH,
                          maxW: r.maxW,
                          static: r.static,
                          droppingPosition: t ? j : void 0,
                          resizeHandles: x,
                          resizeHandle: w,
                        },
                        e
                      );
                    }
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var e = this,
                      t = this.props,
                      r = t.className,
                      o = t.style,
                      a = t.isDroppable,
                      i = t.innerRef,
                      l = (0, s.default)(F, r),
                      c = H({ height: this.containerHeight() }, o);
                    return n.createElement(
                      "div",
                      {
                        ref: i,
                        className: l,
                        style: c,
                        onDrop: a ? this.onDrop : u.noop,
                        onDragLeave: a ? this.onDragLeave : u.noop,
                        onDragEnter: a ? this.onDragEnter : u.noop,
                        onDragOver: a ? this.onDragOver : u.noop,
                      },
                      n.Children.map(this.props.children, function (t) {
                        return e.processGridItem(t);
                      }),
                      a && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, !0),
                      this.placeholder()
                    );
                  },
                },
              ]) && I(t.prototype, r),
              o && I(t, o),
              Object.defineProperty(t, "prototype", { writable: !1 }),
              f
            );
          })(n.Component);
          Y(V, "displayName", "ReactGridLayout"),
            Y(V, "propTypes", w),
            Y(V, "defaultProps", {
              autoSize: !0,
              cols: 12,
              className: "",
              style: {},
              draggableHandle: "",
              draggableCancel: "",
              containerPadding: null,
              rowHeight: 150,
              maxRows: 1 / 0,
              layout: [],
              margin: [10, 10],
              isBounded: !1,
              isDraggable: !0,
              isResizable: !0,
              allowOverlap: !1,
              isDroppable: !1,
              useCSSTransforms: !0,
              transformScale: 1,
              verticalCompact: !0,
              compactType: "vertical",
              preventCollision: !1,
              droppingItem: { i: "__dropping-elem__", h: 1, w: 1 },
              resizeHandles: ["se"],
              onLayoutChange: u.noop,
              onDragStart: u.noop,
              onDrag: u.noop,
              onDragStop: u.noop,
              onResizeStart: u.noop,
              onResize: u.noop,
              onResizeStop: u.noop,
              onDrop: u.noop,
              onDropDragOver: u.noop,
            });
        },
        94: function (e, t, r) {
          "use strict";
          r.d(t, {
            default: function () {
              return D;
            },
          });
          var n = r(359),
            o = r(697),
            a = r.n(o),
            i = r(307),
            s = r.n(i),
            u = r(872),
            l = r(271),
            c = r(606);
          function f(e) {
            return (
              (f =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }),
              f(e)
            );
          }
          var p = ["breakpoint", "breakpoints", "cols", "layouts", "margin", "containerPadding", "onBreakpointChange", "onLayoutChange", "onWidthChange"];
          function d() {
            return (
              (d =
                Object.assign ||
                function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
                  }
                  return e;
                }),
              d.apply(this, arguments)
            );
          }
          function y(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function h(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? y(Object(r), !0).forEach(function (t) {
                    S(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : y(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function g(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }
          function b(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
            }
          }
          function m(e, t) {
            return (
              (m =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              m(e, t)
            );
          }
          function v(e, t) {
            if (t && ("object" === f(t) || "function" == typeof t)) return t;
            if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
            return w(e);
          }
          function w(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }
          function O(e) {
            return (
              (O = Object.setPrototypeOf
                ? Object.getPrototypeOf
                : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                  }),
              O(e)
            );
          }
          function S(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          var j = function (e) {
            return Object.prototype.toString.call(e);
          };
          function P(e, t) {
            return null == e ? null : Array.isArray(e) ? e : e[t];
          }
          var D = (function (e) {
            !(function (e, t) {
              if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
              (e.prototype = Object.create(t && t.prototype, {
                constructor: { value: e, writable: !0, configurable: !0 },
              })),
                Object.defineProperty(e, "prototype", { writable: !1 }),
                t && m(e, t);
            })(y, e);
            var t,
              r,
              o,
              a,
              i,
              f =
                ((a = y),
                (i = (function () {
                  if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                  if (Reflect.construct.sham) return !1;
                  if ("function" == typeof Proxy) return !0;
                  try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
                  } catch (e) {
                    return !1;
                  }
                })()),
                function () {
                  var e,
                    t = O(a);
                  if (i) {
                    var r = O(this).constructor;
                    e = Reflect.construct(t, arguments, r);
                  } else e = t.apply(this, arguments);
                  return v(this, e);
                });
            function y() {
              var e;
              g(this, y);
              for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
              return (
                S(w((e = f.call.apply(f, [this].concat(r)))), "state", e.generateInitialState()),
                S(w(e), "onLayoutChange", function (t) {
                  e.props.onLayoutChange(t, h(h({}, e.props.layouts), {}, S({}, e.state.breakpoint, t)));
                }),
                e
              );
            }
            return (
              (t = y),
              (o = [
                {
                  key: "getDerivedStateFromProps",
                  value: function (e, t) {
                    if (!s()(e.layouts, t.layouts)) {
                      var r = t.breakpoint,
                        n = t.cols;
                      return {
                        layout: (0, l.findOrGenerateResponsiveLayout)(e.layouts, e.breakpoints, r, r, n, e.compactType),
                        layouts: e.layouts,
                      };
                    }
                    return null;
                  },
                },
              ]),
              (r = [
                {
                  key: "generateInitialState",
                  value: function () {
                    var e = this.props,
                      t = e.width,
                      r = e.breakpoints,
                      n = e.layouts,
                      o = e.cols,
                      a = (0, l.getBreakpointFromWidth)(r, t),
                      i = (0, l.getColsFromBreakpoint)(a, o),
                      s = !1 === this.props.verticalCompact ? null : this.props.compactType;
                    return {
                      layout: (0, l.findOrGenerateResponsiveLayout)(n, r, a, a, i, s),
                      breakpoint: a,
                      cols: i,
                    };
                  },
                },
                {
                  key: "componentDidUpdate",
                  value: function (e) {
                    (this.props.width == e.width &&
                      this.props.breakpoint === e.breakpoint &&
                      s()(this.props.breakpoints, e.breakpoints) &&
                      s()(this.props.cols, e.cols)) ||
                      this.onWidthChange(e);
                  },
                },
                {
                  key: "onWidthChange",
                  value: function (e) {
                    var t = this.props,
                      r = t.breakpoints,
                      n = t.cols,
                      o = t.layouts,
                      a = t.compactType,
                      i = this.props.breakpoint || (0, l.getBreakpointFromWidth)(this.props.breakpoints, this.props.width),
                      s = this.state.breakpoint,
                      c = (0, l.getColsFromBreakpoint)(i, n),
                      f = h({}, o);
                    if (s !== i || e.breakpoints !== r || e.cols !== n) {
                      s in f || (f[s] = (0, u.cloneLayout)(this.state.layout));
                      var p = (0, l.findOrGenerateResponsiveLayout)(f, r, i, s, c, a);
                      (p = (0, u.synchronizeLayoutWithChildren)(p, this.props.children, c, a, this.props.allowOverlap)),
                        (f[i] = p),
                        this.props.onLayoutChange(p, f),
                        this.props.onBreakpointChange(i, c),
                        this.setState({ breakpoint: i, layout: p, cols: c });
                    }
                    var d = P(this.props.margin, i),
                      y = P(this.props.containerPadding, i);
                    this.props.onWidthChange(this.props.width, d, c, y);
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      t = (e.breakpoint, e.breakpoints, e.cols, e.layouts, e.margin),
                      r = e.containerPadding,
                      o =
                        (e.onBreakpointChange,
                        e.onLayoutChange,
                        e.onWidthChange,
                        (function (e, t) {
                          if (null == e) return {};
                          var r,
                            n,
                            o = (function (e, t) {
                              if (null == e) return {};
                              var r,
                                n,
                                o = {},
                                a = Object.keys(e);
                              for (n = 0; n < a.length; n++) (r = a[n]), t.indexOf(r) >= 0 || (o[r] = e[r]);
                              return o;
                            })(e, t);
                          if (Object.getOwnPropertySymbols) {
                            var a = Object.getOwnPropertySymbols(e);
                            for (n = 0; n < a.length; n++) (r = a[n]), t.indexOf(r) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r]));
                          }
                          return o;
                        })(e, p));
                    return n.createElement(
                      c.default,
                      d({}, o, {
                        margin: P(t, this.state.breakpoint),
                        containerPadding: P(r, this.state.breakpoint),
                        onLayoutChange: this.onLayoutChange,
                        layout: this.state.layout,
                        cols: this.state.cols,
                      })
                    );
                  },
                },
              ]) && b(t.prototype, r),
              o && b(t, o),
              Object.defineProperty(t, "prototype", { writable: !1 }),
              y
            );
          })(n.Component);
          S(D, "propTypes", {
            breakpoint: a().string,
            breakpoints: a().object,
            allowOverlap: a().bool,
            cols: a().object,
            margin: a().oneOfType([a().array, a().object]),
            containerPadding: a().oneOfType([a().array, a().object]),
            layouts: function (e, t) {
              if ("[object Object]" !== j(e[t])) throw new Error("Layout property must be an object. Received: " + j(e[t]));
              Object.keys(e[t]).forEach(function (t) {
                if (!(t in e.breakpoints)) throw new Error("Each key in layouts must align with a key in breakpoints.");
                (0, u.validateLayout)(e.layouts[t], "layouts." + t);
              });
            },
            width: a().number.isRequired,
            onBreakpointChange: a().func,
            onLayoutChange: a().func,
            onWidthChange: a().func,
          }),
            S(D, "defaultProps", {
              breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
              cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
              containerPadding: {
                lg: null,
                md: null,
                sm: null,
                xs: null,
                xxs: null,
              },
              layouts: {},
              margin: [10, 10],
              allowOverlap: !1,
              onBreakpointChange: u.noop,
              onLayoutChange: u.noop,
              onWidthChange: u.noop,
            });
        },
        663: function (e, t, r) {
          "use strict";
          r.d(t, {
            default: function () {
              return b;
            },
          });
          var n = r(359),
            o = r(697),
            a = r.n(o),
            i = r(10);
          function s(e) {
            return (
              (s =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }),
              s(e)
            );
          }
          var u = ["measureBeforeMount"];
          function l() {
            return (
              (l =
                Object.assign ||
                function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
                  }
                  return e;
                }),
              l.apply(this, arguments)
            );
          }
          function c(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }
          function f(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
            }
          }
          function p(e, t) {
            return (
              (p =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              p(e, t)
            );
          }
          function d(e, t) {
            if (t && ("object" === s(t) || "function" == typeof t)) return t;
            if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
            return y(e);
          }
          function y(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }
          function h(e) {
            return (
              (h = Object.setPrototypeOf
                ? Object.getPrototypeOf
                : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                  }),
              h(e)
            );
          }
          function g(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          function b(e) {
            var t;
            return (
              (t = (function (t) {
                !(function (e, t) {
                  if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                  (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, writable: !0, configurable: !0 },
                  })),
                    Object.defineProperty(e, "prototype", { writable: !1 }),
                    t && p(e, t);
                })(m, t);
                var r,
                  o,
                  a,
                  s,
                  b =
                    ((a = m),
                    (s = (function () {
                      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                      if (Reflect.construct.sham) return !1;
                      if ("function" == typeof Proxy) return !0;
                      try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
                      } catch (e) {
                        return !1;
                      }
                    })()),
                    function () {
                      var e,
                        t = h(a);
                      if (s) {
                        var r = h(this).constructor;
                        e = Reflect.construct(t, arguments, r);
                      } else e = t.apply(this, arguments);
                      return d(this, e);
                    });
                function m() {
                  var e;
                  c(this, m);
                  for (var t = arguments.length, r = new Array(t), o = 0; o < t; o++) r[o] = arguments[o];
                  return (
                    g(y((e = b.call.apply(b, [this].concat(r)))), "state", {
                      width: 1280,
                    }),
                    g(y(e), "elementRef", n.createRef()),
                    g(y(e), "mounted", !1),
                    g(y(e), "onWindowResize", function () {
                      if (e.mounted) {
                        var t = e.elementRef.current;
                        t instanceof HTMLElement && t.offsetWidth && e.setState({ width: t.offsetWidth });
                      }
                    }),
                    e
                  );
                }
                return (
                  (r = m),
                  (o = [
                    {
                      key: "componentDidMount",
                      value: function () {
                        (this.mounted = !0), window.addEventListener("resize", this.onWindowResize), this.onWindowResize();
                      },
                    },
                    {
                      key: "componentWillUnmount",
                      value: function () {
                        (this.mounted = !1), window.removeEventListener("resize", this.onWindowResize);
                      },
                    },
                    {
                      key: "render",
                      value: function () {
                        var t = this.props,
                          r = t.measureBeforeMount,
                          o = (function (e, t) {
                            if (null == e) return {};
                            var r,
                              n,
                              o = (function (e, t) {
                                if (null == e) return {};
                                var r,
                                  n,
                                  o = {},
                                  a = Object.keys(e);
                                for (n = 0; n < a.length; n++) (r = a[n]), t.indexOf(r) >= 0 || (o[r] = e[r]);
                                return o;
                              })(e, t);
                            if (Object.getOwnPropertySymbols) {
                              var a = Object.getOwnPropertySymbols(e);
                              for (n = 0; n < a.length; n++)
                                (r = a[n]), t.indexOf(r) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r]));
                            }
                            return o;
                          })(t, u);
                        return r && !this.mounted
                          ? n.createElement("div", {
                              className: (0, i.default)(this.props.className, "react-grid-layout"),
                              style: this.props.style,
                              ref: this.elementRef,
                            })
                          : n.createElement(e, l({ innerRef: this.elementRef }, o, this.state));
                      },
                    },
                  ]) && f(r.prototype, o),
                  Object.defineProperty(r, "prototype", { writable: !1 }),
                  m
                );
              })(n.Component)),
              g(t, "defaultProps", { measureBeforeMount: !1 }),
              g(t, "propTypes", { measureBeforeMount: a().bool }),
              t
            );
          }
        },
        378: function (e) {
          e.exports = function (e, t, r) {
            return (
              e === t ||
              (e.className === t.className &&
                r(e.style, t.style) &&
                e.width === t.width &&
                e.autoSize === t.autoSize &&
                e.cols === t.cols &&
                e.draggableCancel === t.draggableCancel &&
                e.draggableHandle === t.draggableHandle &&
                r(e.verticalCompact, t.verticalCompact) &&
                r(e.compactType, t.compactType) &&
                r(e.layout, t.layout) &&
                r(e.margin, t.margin) &&
                r(e.containerPadding, t.containerPadding) &&
                e.rowHeight === t.rowHeight &&
                e.maxRows === t.maxRows &&
                e.isBounded === t.isBounded &&
                e.isDraggable === t.isDraggable &&
                e.isResizable === t.isResizable &&
                e.allowOverlap === t.allowOverlap &&
                e.preventCollision === t.preventCollision &&
                e.useCSSTransforms === t.useCSSTransforms &&
                e.transformScale === t.transformScale &&
                e.isDroppable === t.isDroppable &&
                r(e.resizeHandles, t.resizeHandles) &&
                r(e.resizeHandle, t.resizeHandle) &&
                e.onLayoutChange === t.onLayoutChange &&
                e.onDragStart === t.onDragStart &&
                e.onDrag === t.onDrag &&
                e.onDragStop === t.onDragStop &&
                e.onResizeStart === t.onResizeStart &&
                e.onResize === t.onResize &&
                e.onResizeStop === t.onResizeStop &&
                e.onDrop === t.onDrop &&
                r(e.droppingItem, t.droppingItem) &&
                r(e.innerRef, t.innerRef))
            );
          };
        },
        271: function (e, t, r) {
          "use strict";
          r.r(t),
            r.d(t, {
              getBreakpointFromWidth: function () {
                return o;
              },
              getColsFromBreakpoint: function () {
                return a;
              },
              findOrGenerateResponsiveLayout: function () {
                return i;
              },
              sortBreakpoints: function () {
                return s;
              },
            });
          var n = r(872);
          function o(e, t) {
            for (var r = s(e), n = r[0], o = 1, a = r.length; o < a; o++) {
              var i = r[o];
              t > e[i] && (n = i);
            }
            return n;
          }
          function a(e, t) {
            if (!t[e]) throw new Error("ResponsiveReactGridLayout: `cols` entry for breakpoint " + e + " is missing!");
            return t[e];
          }
          function i(e, t, r, o, a, i) {
            if (e[r]) return (0, n.cloneLayout)(e[r]);
            for (var u = e[o], l = s(t), c = l.slice(l.indexOf(r)), f = 0, p = c.length; f < p; f++) {
              var d = c[f];
              if (e[d]) {
                u = e[d];
                break;
              }
            }
            return (u = (0, n.cloneLayout)(u || [])), (0, n.compact)((0, n.correctBounds)(u, { cols: a }), i, a);
          }
          function s(e) {
            return Object.keys(e).sort(function (t, r) {
              return e[t] - e[r];
            });
          }
        },
        872: function (e, t, r) {
          "use strict";
          r.r(t),
            r.d(t, {
              bottom: function () {
                return c;
              },
              cloneLayout: function () {
                return f;
              },
              modifyLayout: function () {
                return p;
              },
              withLayoutItem: function () {
                return d;
              },
              cloneLayoutItem: function () {
                return y;
              },
              childrenEqual: function () {
                return h;
              },
              fastRGLPropsEqual: function () {
                return g;
              },
              fastPositionEqual: function () {
                return b;
              },
              collides: function () {
                return m;
              },
              compact: function () {
                return v;
              },
              compactItem: function () {
                return S;
              },
              correctBounds: function () {
                return j;
              },
              getLayoutItem: function () {
                return P;
              },
              getFirstCollision: function () {
                return D;
              },
              getAllCollisions: function () {
                return x;
              },
              getStatics: function () {
                return R;
              },
              moveElement: function () {
                return _;
              },
              moveElementAwayFromCollision: function () {
                return z;
              },
              perc: function () {
                return C;
              },
              setTransform: function () {
                return k;
              },
              setTopLeft: function () {
                return E;
              },
              sortLayoutItems: function () {
                return T;
              },
              sortLayoutItemsByRowCol: function () {
                return M;
              },
              sortLayoutItemsByColRow: function () {
                return H;
              },
              synchronizeLayoutWithChildren: function () {
                return L;
              },
              validateLayout: function () {
                return N;
              },
              compactType: function () {
                return W;
              },
              noop: function () {
                return A;
              },
            });
          var n = r(307),
            o = r.n(n),
            a = r(359),
            i = r.n(a);
          function s(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function u(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? s(Object(r), !0).forEach(function (t) {
                    l(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : s(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function l(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          function c(e) {
            for (var t, r = 0, n = 0, o = e.length; n < o; n++) (t = e[n].y + e[n].h) > r && (r = t);
            return r;
          }
          function f(e) {
            for (var t = Array(e.length), r = 0, n = e.length; r < n; r++) t[r] = y(e[r]);
            return t;
          }
          function p(e, t) {
            for (var r = Array(e.length), n = 0, o = e.length; n < o; n++) t.i === e[n].i ? (r[n] = t) : (r[n] = e[n]);
            return r;
          }
          function d(e, t, r) {
            var n = P(e, t);
            return n ? [(e = p(e, (n = r(y(n))))), n] : [e, null];
          }
          function y(e) {
            return {
              w: e.w,
              h: e.h,
              x: e.x,
              y: e.y,
              i: e.i,
              minW: e.minW,
              maxW: e.maxW,
              minH: e.minH,
              maxH: e.maxH,
              moved: Boolean(e.moved),
              static: Boolean(e.static),
              isDraggable: e.isDraggable,
              isResizable: e.isResizable,
              resizeHandles: e.resizeHandles,
              isBounded: e.isBounded,
            };
          }
          function h(e, t) {
            return o()(
              i().Children.map(e, function (e) {
                return null == e ? void 0 : e.key;
              }),
              i().Children.map(t, function (e) {
                return null == e ? void 0 : e.key;
              })
            );
          }
          var g = r(378);
          function b(e, t) {
            return e.left === t.left && e.top === t.top && e.width === t.width && e.height === t.height;
          }
          function m(e, t) {
            return !(e.i === t.i || e.x + e.w <= t.x || e.x >= t.x + t.w || e.y + e.h <= t.y || e.y >= t.y + t.h);
          }
          function v(e, t, r) {
            for (var n = R(e), o = T(e, t), a = Array(e.length), i = 0, s = o.length; i < s; i++) {
              var u = y(o[i]);
              u.static || ((u = S(n, u, t, r, o)), n.push(u)), (a[e.indexOf(o[i])] = u), (u.moved = !1);
            }
            return a;
          }
          var w = { x: "w", y: "h" };
          function O(e, t, r, n) {
            var o = w[n];
            t[n] += 1;
            for (
              var a =
                e
                  .map(function (e) {
                    return e.i;
                  })
                  .indexOf(t.i) + 1;
              a < e.length;
              a++
            ) {
              var i = e[a];
              if (!i.static) {
                if (i.y > t.y + t.h) break;
                m(t, i) && O(e, i, r + t[o], n);
              }
            }
            t[n] = r;
          }
          function S(e, t, r, n, o) {
            var a,
              i = "horizontal" === r;
            if ("vertical" === r) for (t.y = Math.min(c(e), t.y); t.y > 0 && !D(e, t); ) t.y--;
            else if (i) for (; t.x > 0 && !D(e, t); ) t.x--;
            for (; (a = D(e, t)); ) i ? O(o, t, a.x + a.w, "x") : O(o, t, a.y + a.h, "y"), i && t.x + t.w > n && ((t.x = n - t.w), t.y++);
            return (t.y = Math.max(t.y, 0)), (t.x = Math.max(t.x, 0)), t;
          }
          function j(e, t) {
            for (var r = R(e), n = 0, o = e.length; n < o; n++) {
              var a = e[n];
              if ((a.x + a.w > t.cols && (a.x = t.cols - a.w), a.x < 0 && ((a.x = 0), (a.w = t.cols)), a.static)) for (; D(r, a); ) a.y++;
              else r.push(a);
            }
            return e;
          }
          function P(e, t) {
            for (var r = 0, n = e.length; r < n; r++) if (e[r].i === t) return e[r];
          }
          function D(e, t) {
            for (var r = 0, n = e.length; r < n; r++) if (m(e[r], t)) return e[r];
          }
          function x(e, t) {
            return e.filter(function (e) {
              return m(e, t);
            });
          }
          function R(e) {
            return e.filter(function (e) {
              return e.static;
            });
          }
          function _(e, t, r, n, o, a, i, s, u) {
            if (t.static && !0 !== t.isDraggable) return e;
            if (t.y === n && t.x === r) return e;
            "Moving element ".concat(t.i, " to [").concat(String(r), ",").concat(String(n), "] from [").concat(t.x, ",").concat(t.y, "]");
            var l = t.x,
              c = t.y;
            "number" == typeof r && (t.x = r), "number" == typeof n && (t.y = n), (t.moved = !0);
            var p = T(e, i);
            ("vertical" === i && "number" == typeof n ? c >= n : "horizontal" === i && "number" == typeof r && l >= r) && (p = p.reverse());
            var d = x(p, t),
              y = d.length > 0;
            if (y && u) return f(e);
            if (y && a) return "Collision prevented on ".concat(t.i, ", reverting."), (t.x = l), (t.y = c), (t.moved = !1), e;
            for (var h = 0, g = d.length; h < g; h++) {
              var b = d[h];
              "Resolving collision between ".concat(t.i, " at [").concat(t.x, ",").concat(t.y, "] and ").concat(b.i, " at [").concat(b.x, ",").concat(b.y, "]"),
                b.moved || (e = b.static ? z(e, b, t, o, i, s) : z(e, t, b, o, i, s));
            }
            return e;
          }
          function z(e, t, r, n, o, a) {
            var i = "horizontal" === o,
              s = "horizontal" !== o,
              u = t.static;
            if (n) {
              n = !1;
              var l = {
                x: i ? Math.max(t.x - r.w, 0) : r.x,
                y: s ? Math.max(t.y - r.h, 0) : r.y,
                w: r.w,
                h: r.h,
                i: "-1",
              };
              if (!D(e, l))
                return (
                  "Doing reverse collision on ".concat(r.i, " up to [").concat(l.x, ",").concat(l.y, "]."),
                  _(e, r, i ? l.x : void 0, s ? l.y : void 0, n, u, o, a)
                );
            }
            return _(e, r, i ? r.x + 1 : void 0, s ? r.y + 1 : void 0, n, u, o, a);
          }
          function C(e) {
            return 100 * e + "%";
          }
          function k(e) {
            var t = e.top,
              r = e.left,
              n = e.width,
              o = e.height,
              a = "translate(".concat(r, "px,").concat(t, "px)");
            return {
              transform: a,
              WebkitTransform: a,
              MozTransform: a,
              msTransform: a,
              OTransform: a,
              width: "".concat(n, "px"),
              height: "".concat(o, "px"),
              position: "absolute",
            };
          }
          function E(e) {
            var t = e.top,
              r = e.left,
              n = e.width,
              o = e.height;
            return {
              top: "".concat(t, "px"),
              left: "".concat(r, "px"),
              width: "".concat(n, "px"),
              height: "".concat(o, "px"),
              position: "absolute",
            };
          }
          function T(e, t) {
            return "horizontal" === t ? H(e) : "vertical" === t ? M(e) : e;
          }
          function M(e) {
            return e.slice(0).sort(function (e, t) {
              return e.y > t.y || (e.y === t.y && e.x > t.x) ? 1 : e.y === t.y && e.x === t.x ? 0 : -1;
            });
          }
          function H(e) {
            return e.slice(0).sort(function (e, t) {
              return e.x > t.x || (e.x === t.x && e.y > t.y) ? 1 : -1;
            });
          }
          function L(e, t, r, n, o) {
            e = e || [];
            var a = [];
            i().Children.forEach(t, function (t) {
              if (null != (null == t ? void 0 : t.key)) {
                var r = P(e, String(t.key));
                if (r) a.push(y(r));
                else {
                  var n = t.props["data-grid"] || t.props._grid;
                  n ? a.push(y(u(u({}, n), {}, { i: t.key }))) : a.push(y({ w: 1, h: 1, x: 0, y: c(a), i: String(t.key) }));
                }
              }
            });
            var s = j(a, { cols: r });
            return o ? s : v(s, n, r);
          }
          function N(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Layout",
              r = ["x", "y", "w", "h"];
            if (!Array.isArray(e)) throw new Error(t + " must be an array!");
            for (var n = 0, o = e.length; n < o; n++)
              for (var a = e[n], i = 0; i < r.length; i++)
                if ("number" != typeof a[r[i]]) throw new Error("ReactGridLayout: " + t + "[" + n + "]." + r[i] + " must be a number!");
          }
          function W(e) {
            var t = e || {},
              r = t.verticalCompact,
              n = t.compactType;
            return !1 === r ? null : n;
          }
          var A = function () {};
        },
        10: function (e, t, r) {
          "use strict";
          function n(e) {
            var t,
              r,
              o = "";
            if ("string" == typeof e || "number" == typeof e) o += e;
            else if ("object" == typeof e)
              if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (r = n(e[t])) && (o && (o += " "), (o += r));
              else for (t in e) e[t] && (o && (o += " "), (o += t));
            return o;
          }
          function o() {
            for (var e, t, r = 0, o = ""; r < arguments.length; ) (e = arguments[r++]) && (t = n(e)) && (o && (o += " "), (o += t));
            return o;
          }
          r.r(t),
            r.d(t, {
              default: function () {
                return o;
              },
            });
        },
        307: function (e, t, r) {
          e = r.nmd(e);
          var n = "__lodash_hash_undefined__",
            o = 9007199254740991,
            a = "[object Arguments]",
            i = "[object Array]",
            s = "[object Boolean]",
            u = "[object Date]",
            l = "[object Error]",
            c = "[object Function]",
            f = "[object Map]",
            p = "[object Number]",
            d = "[object Object]",
            y = "[object Promise]",
            h = "[object RegExp]",
            g = "[object Set]",
            b = "[object String]",
            m = "[object WeakMap]",
            v = "[object ArrayBuffer]",
            w = "[object DataView]",
            O = /^\[object .+?Constructor\]$/,
            S = /^(?:0|[1-9]\d*)$/,
            j = {};
          (j["[object Float32Array]"] =
            j["[object Float64Array]"] =
            j["[object Int8Array]"] =
            j["[object Int16Array]"] =
            j["[object Int32Array]"] =
            j["[object Uint8Array]"] =
            j["[object Uint8ClampedArray]"] =
            j["[object Uint16Array]"] =
            j["[object Uint32Array]"] =
              !0),
            (j[a] = j[i] = j[v] = j[s] = j[w] = j[u] = j[l] = j[c] = j[f] = j[p] = j[d] = j[h] = j[g] = j[b] = j[m] = !1);
          var P = "object" == typeof r.g && r.g && r.g.Object === Object && r.g,
            D = "object" == typeof self && self && self.Object === Object && self,
            x = P || D || Function("return this")(),
            R = t && !t.nodeType && t,
            _ = R && e && !e.nodeType && e,
            z = _ && _.exports === R,
            C = z && P.process,
            k = (function () {
              try {
                return C && C.binding && C.binding("util");
              } catch (e) {}
            })(),
            E = k && k.isTypedArray;
          function T(e, t) {
            for (var r = -1, n = null == e ? 0 : e.length; ++r < n; ) if (t(e[r], r, e)) return !0;
            return !1;
          }
          function M(e) {
            var t = -1,
              r = Array(e.size);
            return (
              e.forEach(function (e, n) {
                r[++t] = [n, e];
              }),
              r
            );
          }
          function H(e) {
            var t = -1,
              r = Array(e.size);
            return (
              e.forEach(function (e) {
                r[++t] = e;
              }),
              r
            );
          }
          var L,
            N,
            W,
            A = Array.prototype,
            I = Function.prototype,
            B = Object.prototype,
            q = x["__core-js_shared__"],
            U = I.toString,
            X = B.hasOwnProperty,
            Y = (L = /[^.]+$/.exec((q && q.keys && q.keys.IE_PROTO) || "")) ? "Symbol(src)_1." + L : "",
            F = B.toString,
            G = RegExp(
              "^" +
                U.call(X)
                  .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
                "$"
            ),
            V = z ? x.Buffer : void 0,
            $ = x.Symbol,
            K = x.Uint8Array,
            J = B.propertyIsEnumerable,
            Q = A.splice,
            Z = $ ? $.toStringTag : void 0,
            ee = Object.getOwnPropertySymbols,
            te = V ? V.isBuffer : void 0,
            re =
              ((N = Object.keys),
              (W = Object),
              function (e) {
                return N(W(e));
              }),
            ne = _e(x, "DataView"),
            oe = _e(x, "Map"),
            ae = _e(x, "Promise"),
            ie = _e(x, "Set"),
            se = _e(x, "WeakMap"),
            ue = _e(Object, "create"),
            le = Ee(ne),
            ce = Ee(oe),
            fe = Ee(ae),
            pe = Ee(ie),
            de = Ee(se),
            ye = $ ? $.prototype : void 0,
            he = ye ? ye.valueOf : void 0;
          function ge(e) {
            var t = -1,
              r = null == e ? 0 : e.length;
            for (this.clear(); ++t < r; ) {
              var n = e[t];
              this.set(n[0], n[1]);
            }
          }
          function be(e) {
            var t = -1,
              r = null == e ? 0 : e.length;
            for (this.clear(); ++t < r; ) {
              var n = e[t];
              this.set(n[0], n[1]);
            }
          }
          function me(e) {
            var t = -1,
              r = null == e ? 0 : e.length;
            for (this.clear(); ++t < r; ) {
              var n = e[t];
              this.set(n[0], n[1]);
            }
          }
          function ve(e) {
            var t = -1,
              r = null == e ? 0 : e.length;
            for (this.__data__ = new me(); ++t < r; ) this.add(e[t]);
          }
          function we(e) {
            var t = (this.__data__ = new be(e));
            this.size = t.size;
          }
          function Oe(e, t) {
            for (var r = e.length; r--; ) if (Te(e[r][0], t)) return r;
            return -1;
          }
          function Se(e) {
            return null == e
              ? void 0 === e
                ? "[object Undefined]"
                : "[object Null]"
              : Z && Z in Object(e)
                ? (function (e) {
                    var t = X.call(e, Z),
                      r = e[Z];
                    try {
                      e[Z] = void 0;
                      var n = !0;
                    } catch (e) {}
                    var o = F.call(e);
                    return n && (t ? (e[Z] = r) : delete e[Z]), o;
                  })(e)
                : (function (e) {
                    return F.call(e);
                  })(e);
          }
          function je(e) {
            return Ie(e) && Se(e) == a;
          }
          function Pe(e, t, r, n, o) {
            return (
              e === t ||
              (null == e || null == t || (!Ie(e) && !Ie(t))
                ? e != e && t != t
                : (function (e, t, r, n, o, c) {
                    var y = He(e),
                      m = He(t),
                      O = y ? i : Ce(e),
                      S = m ? i : Ce(t),
                      j = (O = O == a ? d : O) == d,
                      P = (S = S == a ? d : S) == d,
                      D = O == S;
                    if (D && Le(e)) {
                      if (!Le(t)) return !1;
                      (y = !0), (j = !1);
                    }
                    if (D && !j)
                      return (
                        c || (c = new we()),
                        y || Be(e)
                          ? De(e, t, r, n, o, c)
                          : (function (e, t, r, n, o, a, i) {
                              switch (r) {
                                case w:
                                  if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
                                  (e = e.buffer), (t = t.buffer);
                                case v:
                                  return !(e.byteLength != t.byteLength || !a(new K(e), new K(t)));
                                case s:
                                case u:
                                case p:
                                  return Te(+e, +t);
                                case l:
                                  return e.name == t.name && e.message == t.message;
                                case h:
                                case b:
                                  return e == t + "";
                                case f:
                                  var c = M;
                                case g:
                                  var d = 1 & n;
                                  if ((c || (c = H), e.size != t.size && !d)) return !1;
                                  var y = i.get(e);
                                  if (y) return y == t;
                                  (n |= 2), i.set(e, t);
                                  var m = De(c(e), c(t), n, o, a, i);
                                  return i.delete(e), m;
                                case "[object Symbol]":
                                  if (he) return he.call(e) == he.call(t);
                              }
                              return !1;
                            })(e, t, O, r, n, o, c)
                      );
                    if (!(1 & r)) {
                      var x = j && X.call(e, "__wrapped__"),
                        R = P && X.call(t, "__wrapped__");
                      if (x || R) {
                        var _ = x ? e.value() : e,
                          z = R ? t.value() : t;
                        return c || (c = new we()), o(_, z, r, n, c);
                      }
                    }
                    return (
                      !!D &&
                      (c || (c = new we()),
                      (function (e, t, r, n, o, a) {
                        var i = 1 & r,
                          s = xe(e),
                          u = s.length;
                        if (u != xe(t).length && !i) return !1;
                        for (var l = u; l--; ) {
                          var c = s[l];
                          if (!(i ? c in t : X.call(t, c))) return !1;
                        }
                        var f = a.get(e);
                        if (f && a.get(t)) return f == t;
                        var p = !0;
                        a.set(e, t), a.set(t, e);
                        for (var d = i; ++l < u; ) {
                          var y = e[(c = s[l])],
                            h = t[c];
                          if (n) var g = i ? n(h, y, c, t, e, a) : n(y, h, c, e, t, a);
                          if (!(void 0 === g ? y === h || o(y, h, r, n, a) : g)) {
                            p = !1;
                            break;
                          }
                          d || (d = "constructor" == c);
                        }
                        if (p && !d) {
                          var b = e.constructor,
                            m = t.constructor;
                          b == m ||
                            !("constructor" in e) ||
                            !("constructor" in t) ||
                            ("function" == typeof b && b instanceof b && "function" == typeof m && m instanceof m) ||
                            (p = !1);
                        }
                        return a.delete(e), a.delete(t), p;
                      })(e, t, r, n, o, c))
                    );
                  })(e, t, r, n, Pe, o))
            );
          }
          function De(e, t, r, n, o, a) {
            var i = 1 & r,
              s = e.length,
              u = t.length;
            if (s != u && !(i && u > s)) return !1;
            var l = a.get(e);
            if (l && a.get(t)) return l == t;
            var c = -1,
              f = !0,
              p = 2 & r ? new ve() : void 0;
            for (a.set(e, t), a.set(t, e); ++c < s; ) {
              var d = e[c],
                y = t[c];
              if (n) var h = i ? n(y, d, c, t, e, a) : n(d, y, c, e, t, a);
              if (void 0 !== h) {
                if (h) continue;
                f = !1;
                break;
              }
              if (p) {
                if (
                  !T(t, function (e, t) {
                    if (((i = t), !p.has(i) && (d === e || o(d, e, r, n, a)))) return p.push(t);
                    var i;
                  })
                ) {
                  f = !1;
                  break;
                }
              } else if (d !== y && !o(d, y, r, n, a)) {
                f = !1;
                break;
              }
            }
            return a.delete(e), a.delete(t), f;
          }
          function xe(e) {
            return (function (e, t, r) {
              var n = t(e);
              return He(e)
                ? n
                : (function (e, t) {
                    for (var r = -1, n = t.length, o = e.length; ++r < n; ) e[o + r] = t[r];
                    return e;
                  })(n, r(e));
            })(e, qe, ze);
          }
          function Re(e, t) {
            var r,
              n,
              o = e.__data__;
            return ("string" == (n = typeof (r = t)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== r : null === r)
              ? o["string" == typeof t ? "string" : "hash"]
              : o.map;
          }
          function _e(e, t) {
            var r = (function (e, t) {
              return null == e ? void 0 : e[t];
            })(e, t);
            return (function (e) {
              return (
                !(
                  !Ae(e) ||
                  (function (e) {
                    return !!Y && Y in e;
                  })(e)
                ) && (Ne(e) ? G : O).test(Ee(e))
              );
            })(r)
              ? r
              : void 0;
          }
          (ge.prototype.clear = function () {
            (this.__data__ = ue ? ue(null) : {}), (this.size = 0);
          }),
            (ge.prototype.delete = function (e) {
              var t = this.has(e) && delete this.__data__[e];
              return (this.size -= t ? 1 : 0), t;
            }),
            (ge.prototype.get = function (e) {
              var t = this.__data__;
              if (ue) {
                var r = t[e];
                return r === n ? void 0 : r;
              }
              return X.call(t, e) ? t[e] : void 0;
            }),
            (ge.prototype.has = function (e) {
              var t = this.__data__;
              return ue ? void 0 !== t[e] : X.call(t, e);
            }),
            (ge.prototype.set = function (e, t) {
              var r = this.__data__;
              return (this.size += this.has(e) ? 0 : 1), (r[e] = ue && void 0 === t ? n : t), this;
            }),
            (be.prototype.clear = function () {
              (this.__data__ = []), (this.size = 0);
            }),
            (be.prototype.delete = function (e) {
              var t = this.__data__,
                r = Oe(t, e);
              return !(r < 0 || (r == t.length - 1 ? t.pop() : Q.call(t, r, 1), --this.size, 0));
            }),
            (be.prototype.get = function (e) {
              var t = this.__data__,
                r = Oe(t, e);
              return r < 0 ? void 0 : t[r][1];
            }),
            (be.prototype.has = function (e) {
              return Oe(this.__data__, e) > -1;
            }),
            (be.prototype.set = function (e, t) {
              var r = this.__data__,
                n = Oe(r, e);
              return n < 0 ? (++this.size, r.push([e, t])) : (r[n][1] = t), this;
            }),
            (me.prototype.clear = function () {
              (this.size = 0),
                (this.__data__ = {
                  hash: new ge(),
                  map: new (oe || be)(),
                  string: new ge(),
                });
            }),
            (me.prototype.delete = function (e) {
              var t = Re(this, e).delete(e);
              return (this.size -= t ? 1 : 0), t;
            }),
            (me.prototype.get = function (e) {
              return Re(this, e).get(e);
            }),
            (me.prototype.has = function (e) {
              return Re(this, e).has(e);
            }),
            (me.prototype.set = function (e, t) {
              var r = Re(this, e),
                n = r.size;
              return r.set(e, t), (this.size += r.size == n ? 0 : 1), this;
            }),
            (ve.prototype.add = ve.prototype.push =
              function (e) {
                return this.__data__.set(e, n), this;
              }),
            (ve.prototype.has = function (e) {
              return this.__data__.has(e);
            }),
            (we.prototype.clear = function () {
              (this.__data__ = new be()), (this.size = 0);
            }),
            (we.prototype.delete = function (e) {
              var t = this.__data__,
                r = t.delete(e);
              return (this.size = t.size), r;
            }),
            (we.prototype.get = function (e) {
              return this.__data__.get(e);
            }),
            (we.prototype.has = function (e) {
              return this.__data__.has(e);
            }),
            (we.prototype.set = function (e, t) {
              var r = this.__data__;
              if (r instanceof be) {
                var n = r.__data__;
                if (!oe || n.length < 199) return n.push([e, t]), (this.size = ++r.size), this;
                r = this.__data__ = new me(n);
              }
              return r.set(e, t), (this.size = r.size), this;
            });
          var ze = ee
              ? function (e) {
                  return null == e
                    ? []
                    : ((e = Object(e)),
                      (function (t, r) {
                        for (var n = -1, o = null == t ? 0 : t.length, a = 0, i = []; ++n < o; ) {
                          var s = t[n];
                          (u = s), J.call(e, u) && (i[a++] = s);
                        }
                        var u;
                        return i;
                      })(ee(e)));
                }
              : function () {
                  return [];
                },
            Ce = Se;
          function ke(e, t) {
            return !!(t = null == t ? o : t) && ("number" == typeof e || S.test(e)) && e > -1 && e % 1 == 0 && e < t;
          }
          function Ee(e) {
            if (null != e) {
              try {
                return U.call(e);
              } catch (e) {}
              try {
                return e + "";
              } catch (e) {}
            }
            return "";
          }
          function Te(e, t) {
            return e === t || (e != e && t != t);
          }
          ((ne && Ce(new ne(new ArrayBuffer(1))) != w) ||
            (oe && Ce(new oe()) != f) ||
            (ae && Ce(ae.resolve()) != y) ||
            (ie && Ce(new ie()) != g) ||
            (se && Ce(new se()) != m)) &&
            (Ce = function (e) {
              var t = Se(e),
                r = t == d ? e.constructor : void 0,
                n = r ? Ee(r) : "";
              if (n)
                switch (n) {
                  case le:
                    return w;
                  case ce:
                    return f;
                  case fe:
                    return y;
                  case pe:
                    return g;
                  case de:
                    return m;
                }
              return t;
            });
          var Me = je(
              (function () {
                return arguments;
              })()
            )
              ? je
              : function (e) {
                  return Ie(e) && X.call(e, "callee") && !J.call(e, "callee");
                },
            He = Array.isArray,
            Le =
              te ||
              function () {
                return !1;
              };
          function Ne(e) {
            if (!Ae(e)) return !1;
            var t = Se(e);
            return t == c || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t;
          }
          function We(e) {
            return "number" == typeof e && e > -1 && e % 1 == 0 && e <= o;
          }
          function Ae(e) {
            var t = typeof e;
            return null != e && ("object" == t || "function" == t);
          }
          function Ie(e) {
            return null != e && "object" == typeof e;
          }
          var Be = E
            ? (function (e) {
                return function (t) {
                  return e(t);
                };
              })(E)
            : function (e) {
                return Ie(e) && We(e.length) && !!j[Se(e)];
              };
          function qe(e) {
            return null != (t = e) && We(t.length) && !Ne(t)
              ? (function (e, t) {
                  var r = He(e),
                    n = !r && Me(e),
                    o = !r && !n && Le(e),
                    a = !r && !n && !o && Be(e),
                    i = r || n || o || a,
                    s = i
                      ? (function (e, t) {
                          for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
                          return n;
                        })(e.length, String)
                      : [],
                    u = s.length;
                  for (var l in e)
                    (!t && !X.call(e, l)) ||
                      (i &&
                        ("length" == l ||
                          (o && ("offset" == l || "parent" == l)) ||
                          (a && ("buffer" == l || "byteLength" == l || "byteOffset" == l)) ||
                          ke(l, u))) ||
                      s.push(l);
                  return s;
                })(e)
              : (function (e) {
                  if (((r = (t = e) && t.constructor), t !== (("function" == typeof r && r.prototype) || B))) return re(e);
                  var t,
                    r,
                    n = [];
                  for (var o in Object(e)) X.call(e, o) && "constructor" != o && n.push(o);
                  return n;
                })(e);
            var t;
          }
          e.exports = function (e, t) {
            return Pe(e, t);
          };
        },
        703: function (e, t, r) {
          "use strict";
          var n = r(414);
          function o() {}
          function a() {}
          (a.resetWarningCache = o),
            (e.exports = function () {
              function e(e, t, r, o, a, i) {
                if (i !== n) {
                  var s = new Error(
                    "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
                  );
                  throw ((s.name = "Invariant Violation"), s);
                }
              }
              function t() {
                return e;
              }
              e.isRequired = e;
              var r = {
                array: e,
                bigint: e,
                bool: e,
                func: e,
                number: e,
                object: e,
                string: e,
                symbol: e,
                any: e,
                arrayOf: t,
                element: e,
                elementType: e,
                instanceOf: t,
                node: e,
                objectOf: t,
                oneOf: t,
                oneOfType: t,
                shape: t,
                exact: t,
                checkPropTypes: a,
                resetWarningCache: o,
              };
              return (r.PropTypes = r), r;
            });
        },
        697: function (e, t, r) {
          e.exports = r(703)();
        },
        414: function (e) {
          "use strict";
          e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
        },
        668: function (e, t, r) {
          "use strict";
          function n(e) {
            return (
              (n =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }),
              n(e)
            );
          }
          Object.defineProperty(t, "__esModule", { value: !0 }),
            Object.defineProperty(t, "DraggableCore", {
              enumerable: !0,
              get: function () {
                return f.default;
              },
            }),
            (t.default = void 0);
          var o = (function (e, t) {
              if (e && e.__esModule) return e;
              if (null === e || ("object" !== n(e) && "function" != typeof e)) return { default: e };
              var r = h(t);
              if (r && r.has(e)) return r.get(e);
              var o = {},
                a = Object.defineProperty && Object.getOwnPropertyDescriptor;
              for (var i in e)
                if ("default" !== i && Object.prototype.hasOwnProperty.call(e, i)) {
                  var s = a ? Object.getOwnPropertyDescriptor(e, i) : null;
                  s && (s.get || s.set) ? Object.defineProperty(o, i, s) : (o[i] = e[i]);
                }
              return (o.default = e), r && r.set(e, o), o;
            })(r(359)),
            a = y(r(697)),
            i = y(r(318)),
            s = y(r(10)),
            u = r(825),
            l = r(849),
            c = r(280),
            f = y(r(783)),
            p = y(r(904)),
            d = [
              "axis",
              "bounds",
              "children",
              "defaultPosition",
              "defaultClassName",
              "defaultClassNameDragging",
              "defaultClassNameDragged",
              "position",
              "positionOffset",
              "scale",
            ];
          function y(e) {
            return e && e.__esModule ? e : { default: e };
          }
          function h(e) {
            if ("function" != typeof WeakMap) return null;
            var t = new WeakMap(),
              r = new WeakMap();
            return (h = function (e) {
              return e ? r : t;
            })(e);
          }
          function g() {
            return (
              (g =
                Object.assign ||
                function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
                  }
                  return e;
                }),
              g.apply(this, arguments)
            );
          }
          function b(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function m(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? b(Object(r), !0).forEach(function (t) {
                    D(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : b(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function v(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n;
          }
          function w(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
            }
          }
          function O(e, t) {
            return (
              (O =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              O(e, t)
            );
          }
          function S(e, t) {
            if (t && ("object" === n(t) || "function" == typeof t)) return t;
            if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
            return j(e);
          }
          function j(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }
          function P(e) {
            return (
              (P = Object.setPrototypeOf
                ? Object.getPrototypeOf
                : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                  }),
              P(e)
            );
          }
          function D(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          var x = (function (e) {
            !(function (e, t) {
              if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
              (e.prototype = Object.create(t && t.prototype, {
                constructor: { value: e, writable: !0, configurable: !0 },
              })),
                t && O(e, t);
            })(h, e);
            var t,
              r,
              n,
              a,
              c,
              y =
                ((a = h),
                (c = (function () {
                  if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                  if (Reflect.construct.sham) return !1;
                  if ("function" == typeof Proxy) return !0;
                  try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
                  } catch (e) {
                    return !1;
                  }
                })()),
                function () {
                  var e,
                    t = P(a);
                  if (c) {
                    var r = P(this).constructor;
                    e = Reflect.construct(t, arguments, r);
                  } else e = t.apply(this, arguments);
                  return S(this, e);
                });
            function h(e) {
              var t;
              return (
                (function (e, t) {
                  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                })(this, h),
                D(j((t = y.call(this, e))), "onDragStart", function (e, r) {
                  if (((0, p.default)("Draggable: onDragStart: %j", r), !1 === t.props.onStart(e, (0, l.createDraggableData)(j(t), r)))) return !1;
                  t.setState({ dragging: !0, dragged: !0 });
                }),
                D(j(t), "onDrag", function (e, r) {
                  if (!t.state.dragging) return !1;
                  (0, p.default)("Draggable: onDrag: %j", r);
                  var n,
                    o,
                    a = (0, l.createDraggableData)(j(t), r),
                    i = { x: a.x, y: a.y };
                  if (t.props.bounds) {
                    var s = i.x,
                      u = i.y;
                    (i.x += t.state.slackX), (i.y += t.state.slackY);
                    var c =
                        ((n = (0, l.getBoundPosition)(j(t), i.x, i.y)),
                        (o = 2),
                        (function (e) {
                          if (Array.isArray(e)) return e;
                        })(n) ||
                          (function (e, t) {
                            var r = null == e ? null : ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
                            if (null != r) {
                              var n,
                                o,
                                a = [],
                                i = !0,
                                s = !1;
                              try {
                                for (r = r.call(e); !(i = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); i = !0);
                              } catch (e) {
                                (s = !0), (o = e);
                              } finally {
                                try {
                                  i || null == r.return || r.return();
                                } finally {
                                  if (s) throw o;
                                }
                              }
                              return a;
                            }
                          })(n, o) ||
                          (function (e, t) {
                            if (e) {
                              if ("string" == typeof e) return v(e, t);
                              var r = Object.prototype.toString.call(e).slice(8, -1);
                              return (
                                "Object" === r && e.constructor && (r = e.constructor.name),
                                "Map" === r || "Set" === r
                                  ? Array.from(e)
                                  : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                                    ? v(e, t)
                                    : void 0
                              );
                            }
                          })(n, o) ||
                          (function () {
                            throw new TypeError(
                              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                            );
                          })()),
                      f = c[0],
                      d = c[1];
                    (i.x = f),
                      (i.y = d),
                      (i.slackX = t.state.slackX + (s - i.x)),
                      (i.slackY = t.state.slackY + (u - i.y)),
                      (a.x = i.x),
                      (a.y = i.y),
                      (a.deltaX = i.x - t.state.x),
                      (a.deltaY = i.y - t.state.y);
                  }
                  if (!1 === t.props.onDrag(e, a)) return !1;
                  t.setState(i);
                }),
                D(j(t), "onDragStop", function (e, r) {
                  if (!t.state.dragging) return !1;
                  if (!1 === t.props.onStop(e, (0, l.createDraggableData)(j(t), r))) return !1;
                  (0, p.default)("Draggable: onDragStop: %j", r);
                  var n = { dragging: !1, slackX: 0, slackY: 0 };
                  if (Boolean(t.props.position)) {
                    var o = t.props.position,
                      a = o.x,
                      i = o.y;
                    (n.x = a), (n.y = i);
                  }
                  t.setState(n);
                }),
                (t.state = {
                  dragging: !1,
                  dragged: !1,
                  x: e.position ? e.position.x : e.defaultPosition.x,
                  y: e.position ? e.position.y : e.defaultPosition.y,
                  prevPropsPosition: m({}, e.position),
                  slackX: 0,
                  slackY: 0,
                  isElementSVG: !1,
                }),
                !e.position ||
                  e.onDrag ||
                  e.onStop ||
                  console.warn(
                    "A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element."
                  ),
                t
              );
            }
            return (
              (t = h),
              (n = [
                {
                  key: "getDerivedStateFromProps",
                  value: function (e, t) {
                    var r = e.position,
                      n = t.prevPropsPosition;
                    return !r || (n && r.x === n.x && r.y === n.y)
                      ? null
                      : ((0, p.default)("Draggable: getDerivedStateFromProps %j", { position: r, prevPropsPosition: n }),
                        { x: r.x, y: r.y, prevPropsPosition: m({}, r) });
                  },
                },
              ]),
              (r = [
                {
                  key: "componentDidMount",
                  value: function () {
                    void 0 !== window.SVGElement && this.findDOMNode() instanceof window.SVGElement && this.setState({ isElementSVG: !0 });
                  },
                },
                {
                  key: "componentWillUnmount",
                  value: function () {
                    this.setState({ dragging: !1 });
                  },
                },
                {
                  key: "findDOMNode",
                  value: function () {
                    var e, t, r;
                    return null !== (e = null === (t = this.props) || void 0 === t || null === (r = t.nodeRef) || void 0 === r ? void 0 : r.current) &&
                      void 0 !== e
                      ? e
                      : i.default.findDOMNode(this);
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var e,
                      t = this.props,
                      r = (t.axis, t.bounds, t.children),
                      n = t.defaultPosition,
                      a = t.defaultClassName,
                      i = t.defaultClassNameDragging,
                      c = t.defaultClassNameDragged,
                      p = t.position,
                      y = t.positionOffset,
                      h =
                        (t.scale,
                        (function (e, t) {
                          if (null == e) return {};
                          var r,
                            n,
                            o = (function (e, t) {
                              if (null == e) return {};
                              var r,
                                n,
                                o = {},
                                a = Object.keys(e);
                              for (n = 0; n < a.length; n++) (r = a[n]), t.indexOf(r) >= 0 || (o[r] = e[r]);
                              return o;
                            })(e, t);
                          if (Object.getOwnPropertySymbols) {
                            var a = Object.getOwnPropertySymbols(e);
                            for (n = 0; n < a.length; n++) (r = a[n]), t.indexOf(r) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r]));
                          }
                          return o;
                        })(t, d)),
                      b = {},
                      v = null,
                      w = !Boolean(p) || this.state.dragging,
                      O = p || n,
                      S = {
                        x: (0, l.canDragX)(this) && w ? this.state.x : O.x,
                        y: (0, l.canDragY)(this) && w ? this.state.y : O.y,
                      };
                    this.state.isElementSVG ? (v = (0, u.createSVGTransform)(S, y)) : (b = (0, u.createCSSTransform)(S, y));
                    var j = (0, s.default)(r.props.className || "", a, (D((e = {}), i, this.state.dragging), D(e, c, this.state.dragged), e));
                    return o.createElement(
                      f.default,
                      g({}, h, {
                        onStart: this.onDragStart,
                        onDrag: this.onDrag,
                        onStop: this.onDragStop,
                      }),
                      o.cloneElement(o.Children.only(r), {
                        className: j,
                        style: m(m({}, r.props.style), b),
                        transform: v,
                      })
                    );
                  },
                },
              ]) && w(t.prototype, r),
              n && w(t, n),
              h
            );
          })(o.Component);
          (t.default = x),
            D(x, "displayName", "Draggable"),
            D(
              x,
              "propTypes",
              m(
                m({}, f.default.propTypes),
                {},
                {
                  axis: a.default.oneOf(["both", "x", "y", "none"]),
                  bounds: a.default.oneOfType([
                    a.default.shape({
                      left: a.default.number,
                      right: a.default.number,
                      top: a.default.number,
                      bottom: a.default.number,
                    }),
                    a.default.string,
                    a.default.oneOf([!1]),
                  ]),
                  defaultClassName: a.default.string,
                  defaultClassNameDragging: a.default.string,
                  defaultClassNameDragged: a.default.string,
                  defaultPosition: a.default.shape({
                    x: a.default.number,
                    y: a.default.number,
                  }),
                  positionOffset: a.default.shape({
                    x: a.default.oneOfType([a.default.number, a.default.string]),
                    y: a.default.oneOfType([a.default.number, a.default.string]),
                  }),
                  position: a.default.shape({
                    x: a.default.number,
                    y: a.default.number,
                  }),
                  className: c.dontSetMe,
                  style: c.dontSetMe,
                  transform: c.dontSetMe,
                }
              )
            ),
            D(
              x,
              "defaultProps",
              m(
                m({}, f.default.defaultProps),
                {},
                {
                  axis: "both",
                  bounds: !1,
                  defaultClassName: "react-draggable",
                  defaultClassNameDragging: "react-draggable-dragging",
                  defaultClassNameDragged: "react-draggable-dragged",
                  defaultPosition: { x: 0, y: 0 },
                  scale: 1,
                }
              )
            );
        },
        783: function (e, t, r) {
          "use strict";
          function n(e) {
            return (
              (n =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }),
              n(e)
            );
          }
          Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = void 0);
          var o = (function (e, t) {
              if (e && e.__esModule) return e;
              if (null === e || ("object" !== n(e) && "function" != typeof e)) return { default: e };
              var r = p(t);
              if (r && r.has(e)) return r.get(e);
              var o = {},
                a = Object.defineProperty && Object.getOwnPropertyDescriptor;
              for (var i in e)
                if ("default" !== i && Object.prototype.hasOwnProperty.call(e, i)) {
                  var s = a ? Object.getOwnPropertyDescriptor(e, i) : null;
                  s && (s.get || s.set) ? Object.defineProperty(o, i, s) : (o[i] = e[i]);
                }
              return (o.default = e), r && r.set(e, o), o;
            })(r(359)),
            a = f(r(697)),
            i = f(r(318)),
            s = r(825),
            u = r(849),
            l = r(280),
            c = f(r(904));
          function f(e) {
            return e && e.__esModule ? e : { default: e };
          }
          function p(e) {
            if ("function" != typeof WeakMap) return null;
            var t = new WeakMap(),
              r = new WeakMap();
            return (p = function (e) {
              return e ? r : t;
            })(e);
          }
          function d(e, t) {
            return (
              (function (e) {
                if (Array.isArray(e)) return e;
              })(e) ||
              (function (e, t) {
                var r = null == e ? null : ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
                if (null != r) {
                  var n,
                    o,
                    a = [],
                    i = !0,
                    s = !1;
                  try {
                    for (r = r.call(e); !(i = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); i = !0);
                  } catch (e) {
                    (s = !0), (o = e);
                  } finally {
                    try {
                      i || null == r.return || r.return();
                    } finally {
                      if (s) throw o;
                    }
                  }
                  return a;
                }
              })(e, t) ||
              (function (e, t) {
                if (e) {
                  if ("string" == typeof e) return y(e, t);
                  var r = Object.prototype.toString.call(e).slice(8, -1);
                  return (
                    "Object" === r && e.constructor && (r = e.constructor.name),
                    "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? y(e, t) : void 0
                  );
                }
              })(e, t) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
              })()
            );
          }
          function y(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n;
          }
          function h(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }
          function g(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
            }
          }
          function b(e, t) {
            return (
              (b =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              b(e, t)
            );
          }
          function m(e, t) {
            if (t && ("object" === n(t) || "function" == typeof t)) return t;
            if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
            return v(e);
          }
          function v(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }
          function w(e) {
            return (
              (w = Object.setPrototypeOf
                ? Object.getPrototypeOf
                : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                  }),
              w(e)
            );
          }
          function O(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          var S = { start: "touchstart", move: "touchmove", stop: "touchend" },
            j = { start: "mousedown", move: "mousemove", stop: "mouseup" },
            P = j,
            D = (function (e) {
              !(function (e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                (e.prototype = Object.create(t && t.prototype, {
                  constructor: { value: e, writable: !0, configurable: !0 },
                })),
                  t && b(e, t);
              })(f, e);
              var t,
                r,
                n,
                a,
                l =
                  ((n = f),
                  (a = (function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
                    } catch (e) {
                      return !1;
                    }
                  })()),
                  function () {
                    var e,
                      t = w(n);
                    if (a) {
                      var r = w(this).constructor;
                      e = Reflect.construct(t, arguments, r);
                    } else e = t.apply(this, arguments);
                    return m(this, e);
                  });
              function f() {
                var e;
                h(this, f);
                for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
                return (
                  O(v((e = l.call.apply(l, [this].concat(r)))), "state", {
                    dragging: !1,
                    lastX: NaN,
                    lastY: NaN,
                    touchIdentifier: null,
                  }),
                  O(v(e), "mounted", !1),
                  O(v(e), "handleDragStart", function (t) {
                    if ((e.props.onMouseDown(t), !e.props.allowAnyClick && "number" == typeof t.button && 0 !== t.button)) return !1;
                    var r = e.findDOMNode();
                    if (!r || !r.ownerDocument || !r.ownerDocument.body) throw new Error("<DraggableCore> not mounted on DragStart!");
                    var n = r.ownerDocument;
                    if (
                      !(
                        e.props.disabled ||
                        !(t.target instanceof n.defaultView.Node) ||
                        (e.props.handle && !(0, s.matchesSelectorAndParentsTo)(t.target, e.props.handle, r)) ||
                        (e.props.cancel && (0, s.matchesSelectorAndParentsTo)(t.target, e.props.cancel, r))
                      )
                    ) {
                      "touchstart" === t.type && t.preventDefault();
                      var o = (0, s.getTouchIdentifier)(t);
                      e.setState({ touchIdentifier: o });
                      var a = (0, u.getControlPosition)(t, o, v(e));
                      if (null != a) {
                        var i = a.x,
                          l = a.y,
                          f = (0, u.createCoreData)(v(e), i, l);
                        (0, c.default)("DraggableCore: handleDragStart: %j", f),
                          (0, c.default)("calling", e.props.onStart),
                          !1 !== e.props.onStart(t, f) &&
                            !1 !== e.mounted &&
                            (e.props.enableUserSelectHack && (0, s.addUserSelectStyles)(n),
                            e.setState({ dragging: !0, lastX: i, lastY: l }),
                            (0, s.addEvent)(n, P.move, e.handleDrag),
                            (0, s.addEvent)(n, P.stop, e.handleDragStop));
                      }
                    }
                  }),
                  O(v(e), "handleDrag", function (t) {
                    var r = (0, u.getControlPosition)(t, e.state.touchIdentifier, v(e));
                    if (null != r) {
                      var n = r.x,
                        o = r.y;
                      if (Array.isArray(e.props.grid)) {
                        var a = n - e.state.lastX,
                          i = o - e.state.lastY,
                          s = d((0, u.snapToGrid)(e.props.grid, a, i), 2);
                        if (((a = s[0]), (i = s[1]), !a && !i)) return;
                        (n = e.state.lastX + a), (o = e.state.lastY + i);
                      }
                      var l = (0, u.createCoreData)(v(e), n, o);
                      if (((0, c.default)("DraggableCore: handleDrag: %j", l), !1 !== e.props.onDrag(t, l) && !1 !== e.mounted))
                        e.setState({ lastX: n, lastY: o });
                      else
                        try {
                          e.handleDragStop(new MouseEvent("mouseup"));
                        } catch (t) {
                          var f = document.createEvent("MouseEvents");
                          f.initMouseEvent("mouseup", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), e.handleDragStop(f);
                        }
                    }
                  }),
                  O(v(e), "handleDragStop", function (t) {
                    if (e.state.dragging) {
                      var r = (0, u.getControlPosition)(t, e.state.touchIdentifier, v(e));
                      if (null != r) {
                        var n = r.x,
                          o = r.y,
                          a = (0, u.createCoreData)(v(e), n, o);
                        if (!1 === e.props.onStop(t, a) || !1 === e.mounted) return !1;
                        var i = e.findDOMNode();
                        i && e.props.enableUserSelectHack && (0, s.removeUserSelectStyles)(i.ownerDocument),
                          (0, c.default)("DraggableCore: handleDragStop: %j", a),
                          e.setState({ dragging: !1, lastX: NaN, lastY: NaN }),
                          i &&
                            ((0, c.default)("DraggableCore: Removing handlers"),
                            (0, s.removeEvent)(i.ownerDocument, P.move, e.handleDrag),
                            (0, s.removeEvent)(i.ownerDocument, P.stop, e.handleDragStop));
                      }
                    }
                  }),
                  O(v(e), "onMouseDown", function (t) {
                    return (P = j), e.handleDragStart(t);
                  }),
                  O(v(e), "onMouseUp", function (t) {
                    return (P = j), e.handleDragStop(t);
                  }),
                  O(v(e), "onTouchStart", function (t) {
                    return (P = S), e.handleDragStart(t);
                  }),
                  O(v(e), "onTouchEnd", function (t) {
                    return (P = S), e.handleDragStop(t);
                  }),
                  e
                );
              }
              return (
                (t = f),
                (r = [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.mounted = !0;
                      var e = this.findDOMNode();
                      e &&
                        (0, s.addEvent)(e, S.start, this.onTouchStart, {
                          passive: !1,
                        });
                    },
                  },
                  {
                    key: "componentWillUnmount",
                    value: function () {
                      this.mounted = !1;
                      var e = this.findDOMNode();
                      if (e) {
                        var t = e.ownerDocument;
                        (0, s.removeEvent)(t, j.move, this.handleDrag),
                          (0, s.removeEvent)(t, S.move, this.handleDrag),
                          (0, s.removeEvent)(t, j.stop, this.handleDragStop),
                          (0, s.removeEvent)(t, S.stop, this.handleDragStop),
                          (0, s.removeEvent)(e, S.start, this.onTouchStart, {
                            passive: !1,
                          }),
                          this.props.enableUserSelectHack && (0, s.removeUserSelectStyles)(t);
                      }
                    },
                  },
                  {
                    key: "findDOMNode",
                    value: function () {
                      var e, t, r;
                      return null !== (e = null === (t = this.props) || void 0 === t || null === (r = t.nodeRef) || void 0 === r ? void 0 : r.current) &&
                        void 0 !== e
                        ? e
                        : i.default.findDOMNode(this);
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      return o.cloneElement(o.Children.only(this.props.children), {
                        onMouseDown: this.onMouseDown,
                        onMouseUp: this.onMouseUp,
                        onTouchEnd: this.onTouchEnd,
                      });
                    },
                  },
                ]) && g(t.prototype, r),
                f
              );
            })(o.Component);
          (t.default = D),
            O(D, "displayName", "DraggableCore"),
            O(D, "propTypes", {
              allowAnyClick: a.default.bool,
              disabled: a.default.bool,
              enableUserSelectHack: a.default.bool,
              offsetParent: function (e, t) {
                if (e[t] && 1 !== e[t].nodeType) throw new Error("Draggable's offsetParent must be a DOM Node.");
              },
              grid: a.default.arrayOf(a.default.number),
              handle: a.default.string,
              cancel: a.default.string,
              nodeRef: a.default.object,
              onStart: a.default.func,
              onDrag: a.default.func,
              onStop: a.default.func,
              onMouseDown: a.default.func,
              scale: a.default.number,
              className: l.dontSetMe,
              style: l.dontSetMe,
              transform: l.dontSetMe,
            }),
            O(D, "defaultProps", {
              allowAnyClick: !1,
              disabled: !1,
              enableUserSelectHack: !0,
              onStart: function () {},
              onDrag: function () {},
              onStop: function () {},
              onMouseDown: function () {},
              scale: 1,
            });
        },
        193: function (e, t, r) {
          "use strict";
          var n = r(668),
            o = n.default,
            a = n.DraggableCore;
          (e.exports = o), (e.exports.default = o), (e.exports.DraggableCore = a);
        },
        825: function (e, t, r) {
          "use strict";
          function n(e) {
            return (
              (n =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    }),
              n(e)
            );
          }
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.matchesSelector = f),
            (t.matchesSelectorAndParentsTo = function (e, t, r) {
              var n = e;
              do {
                if (f(n, t)) return !0;
                if (n === r) return !1;
                n = n.parentNode;
              } while (n);
              return !1;
            }),
            (t.addEvent = function (e, t, r, n) {
              if (e) {
                var o = u({ capture: !0 }, n);
                e.addEventListener ? e.addEventListener(t, r, o) : e.attachEvent ? e.attachEvent("on" + t, r) : (e["on" + t] = r);
              }
            }),
            (t.removeEvent = function (e, t, r, n) {
              if (e) {
                var o = u({ capture: !0 }, n);
                e.removeEventListener ? e.removeEventListener(t, r, o) : e.detachEvent ? e.detachEvent("on" + t, r) : (e["on" + t] = null);
              }
            }),
            (t.outerHeight = function (e) {
              var t = e.clientHeight,
                r = e.ownerDocument.defaultView.getComputedStyle(e);
              return (t += (0, o.int)(r.borderTopWidth)) + (0, o.int)(r.borderBottomWidth);
            }),
            (t.outerWidth = function (e) {
              var t = e.clientWidth,
                r = e.ownerDocument.defaultView.getComputedStyle(e);
              return (t += (0, o.int)(r.borderLeftWidth)) + (0, o.int)(r.borderRightWidth);
            }),
            (t.innerHeight = function (e) {
              var t = e.clientHeight,
                r = e.ownerDocument.defaultView.getComputedStyle(e);
              return (t -= (0, o.int)(r.paddingTop)) - (0, o.int)(r.paddingBottom);
            }),
            (t.innerWidth = function (e) {
              var t = e.clientWidth,
                r = e.ownerDocument.defaultView.getComputedStyle(e);
              return (t -= (0, o.int)(r.paddingLeft)) - (0, o.int)(r.paddingRight);
            }),
            (t.offsetXYFromParent = function (e, t, r) {
              var n = t === t.ownerDocument.body ? { left: 0, top: 0 } : t.getBoundingClientRect();
              return {
                x: (e.clientX + t.scrollLeft - n.left) / r,
                y: (e.clientY + t.scrollTop - n.top) / r,
              };
            }),
            (t.createCSSTransform = function (e, t) {
              var r = p(e, t, "px");
              return l({}, (0, a.browserPrefixToKey)("transform", a.default), r);
            }),
            (t.createSVGTransform = function (e, t) {
              return p(e, t, "");
            }),
            (t.getTranslation = p),
            (t.getTouch = function (e, t) {
              return (
                (e.targetTouches &&
                  (0, o.findInArray)(e.targetTouches, function (e) {
                    return t === e.identifier;
                  })) ||
                (e.changedTouches &&
                  (0, o.findInArray)(e.changedTouches, function (e) {
                    return t === e.identifier;
                  }))
              );
            }),
            (t.getTouchIdentifier = function (e) {
              return e.targetTouches && e.targetTouches[0]
                ? e.targetTouches[0].identifier
                : e.changedTouches && e.changedTouches[0]
                  ? e.changedTouches[0].identifier
                  : void 0;
            }),
            (t.addUserSelectStyles = function (e) {
              if (e) {
                var t = e.getElementById("react-draggable-style-el");
                t ||
                  (((t = e.createElement("style")).type = "text/css"),
                  (t.id = "react-draggable-style-el"),
                  (t.innerHTML = ".react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n"),
                  (t.innerHTML += ".react-draggable-transparent-selection *::selection {all: inherit;}\n"),
                  e.getElementsByTagName("head")[0].appendChild(t)),
                  e.body && d(e.body, "react-draggable-transparent-selection");
              }
            }),
            (t.removeUserSelectStyles = function (e) {
              if (e)
                try {
                  if ((e.body && y(e.body, "react-draggable-transparent-selection"), e.selection)) e.selection.empty();
                  else {
                    var t = (e.defaultView || window).getSelection();
                    t && "Caret" !== t.type && t.removeAllRanges();
                  }
                } catch (e) {}
            }),
            (t.addClassName = d),
            (t.removeClassName = y);
          var o = r(280),
            a = (function (e, t) {
              if (e && e.__esModule) return e;
              if (null === e || ("object" !== n(e) && "function" != typeof e)) return { default: e };
              var r = i(t);
              if (r && r.has(e)) return r.get(e);
              var o = {},
                a = Object.defineProperty && Object.getOwnPropertyDescriptor;
              for (var s in e)
                if ("default" !== s && Object.prototype.hasOwnProperty.call(e, s)) {
                  var u = a ? Object.getOwnPropertyDescriptor(e, s) : null;
                  u && (u.get || u.set) ? Object.defineProperty(o, s, u) : (o[s] = e[s]);
                }
              return (o.default = e), r && r.set(e, o), o;
            })(r(650));
          function i(e) {
            if ("function" != typeof WeakMap) return null;
            var t = new WeakMap(),
              r = new WeakMap();
            return (i = function (e) {
              return e ? r : t;
            })(e);
          }
          function s(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function u(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? s(Object(r), !0).forEach(function (t) {
                    l(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : s(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function l(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          var c = "";
          function f(e, t) {
            return (
              c ||
                (c = (0, o.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function (t) {
                  return (0, o.isFunction)(e[t]);
                })),
              !!(0, o.isFunction)(e[c]) && e[c](t)
            );
          }
          function p(e, t, r) {
            var n = e.x,
              o = e.y,
              a = "translate(".concat(n).concat(r, ",").concat(o).concat(r, ")");
            if (t) {
              var i = "".concat("string" == typeof t.x ? t.x : t.x + r),
                s = "".concat("string" == typeof t.y ? t.y : t.y + r);
              a = "translate(".concat(i, ", ").concat(s, ")") + a;
            }
            return a;
          }
          function d(e, t) {
            e.classList ? e.classList.add(t) : e.className.match(new RegExp("(?:^|\\s)".concat(t, "(?!\\S)"))) || (e.className += " ".concat(t));
          }
          function y(e, t) {
            e.classList ? e.classList.remove(t) : (e.className = e.className.replace(new RegExp("(?:^|\\s)".concat(t, "(?!\\S)"), "g"), ""));
          }
        },
        650: function (e, t) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.getPrefix = n),
            (t.browserPrefixToKey = o),
            (t.browserPrefixToStyle = function (e, t) {
              return t ? "-".concat(t.toLowerCase(), "-").concat(e) : e;
            }),
            (t.default = void 0);
          var r = ["Moz", "Webkit", "O", "ms"];
          function n() {
            var e,
              t,
              n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "transform";
            if ("undefined" == typeof window) return "";
            var a = null === (e = window.document) || void 0 === e || null === (t = e.documentElement) || void 0 === t ? void 0 : t.style;
            if (!a) return "";
            if (n in a) return "";
            for (var i = 0; i < r.length; i++) if (o(n, r[i]) in a) return r[i];
            return "";
          }
          function o(e, t) {
            return t
              ? "".concat(t).concat(
                  (function (e) {
                    for (var t = "", r = !0, n = 0; n < e.length; n++) r ? ((t += e[n].toUpperCase()), (r = !1)) : "-" === e[n] ? (r = !0) : (t += e[n]);
                    return t;
                  })(e)
                )
              : e;
          }
          var a = n();
          t.default = a;
        },
        904: function (e, t) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = function () {});
        },
        849: function (e, t, r) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.getBoundPosition = function (e, t, r) {
              if (!e.props.bounds) return [t, r];
              var i = e.props.bounds;
              i =
                "string" == typeof i
                  ? i
                  : (function (e) {
                      return {
                        left: e.left,
                        top: e.top,
                        right: e.right,
                        bottom: e.bottom,
                      };
                    })(i);
              var s = a(e);
              if ("string" == typeof i) {
                var u,
                  l = s.ownerDocument,
                  c = l.defaultView;
                if (!((u = "parent" === i ? s.parentNode : l.querySelector(i)) instanceof c.HTMLElement))
                  throw new Error('Bounds selector "' + i + '" could not find an element.');
                var f = u,
                  p = c.getComputedStyle(s),
                  d = c.getComputedStyle(f);
                i = {
                  left: -s.offsetLeft + (0, n.int)(d.paddingLeft) + (0, n.int)(p.marginLeft),
                  top: -s.offsetTop + (0, n.int)(d.paddingTop) + (0, n.int)(p.marginTop),
                  right: (0, o.innerWidth)(f) - (0, o.outerWidth)(s) - s.offsetLeft + (0, n.int)(d.paddingRight) - (0, n.int)(p.marginRight),
                  bottom: (0, o.innerHeight)(f) - (0, o.outerHeight)(s) - s.offsetTop + (0, n.int)(d.paddingBottom) - (0, n.int)(p.marginBottom),
                };
              }
              return (
                (0, n.isNum)(i.right) && (t = Math.min(t, i.right)),
                (0, n.isNum)(i.bottom) && (r = Math.min(r, i.bottom)),
                (0, n.isNum)(i.left) && (t = Math.max(t, i.left)),
                (0, n.isNum)(i.top) && (r = Math.max(r, i.top)),
                [t, r]
              );
            }),
            (t.snapToGrid = function (e, t, r) {
              return [Math.round(t / e[0]) * e[0], Math.round(r / e[1]) * e[1]];
            }),
            (t.canDragX = function (e) {
              return "both" === e.props.axis || "x" === e.props.axis;
            }),
            (t.canDragY = function (e) {
              return "both" === e.props.axis || "y" === e.props.axis;
            }),
            (t.getControlPosition = function (e, t, r) {
              var n = "number" == typeof t ? (0, o.getTouch)(e, t) : null;
              if ("number" == typeof t && !n) return null;
              var i = a(r),
                s = r.props.offsetParent || i.offsetParent || i.ownerDocument.body;
              return (0, o.offsetXYFromParent)(n || e, s, r.props.scale);
            }),
            (t.createCoreData = function (e, t, r) {
              var o = e.state,
                i = !(0, n.isNum)(o.lastX),
                s = a(e);
              return i
                ? {
                    node: s,
                    deltaX: 0,
                    deltaY: 0,
                    lastX: t,
                    lastY: r,
                    x: t,
                    y: r,
                  }
                : {
                    node: s,
                    deltaX: t - o.lastX,
                    deltaY: r - o.lastY,
                    lastX: o.lastX,
                    lastY: o.lastY,
                    x: t,
                    y: r,
                  };
            }),
            (t.createDraggableData = function (e, t) {
              var r = e.props.scale;
              return {
                node: t.node,
                x: e.state.x + t.deltaX / r,
                y: e.state.y + t.deltaY / r,
                deltaX: t.deltaX / r,
                deltaY: t.deltaY / r,
                lastX: e.state.x,
                lastY: e.state.y,
              };
            });
          var n = r(280),
            o = r(825);
          function a(e) {
            var t = e.findDOMNode();
            if (!t) throw new Error("<DraggableCore>: Unmounted during event!");
            return t;
          }
        },
        280: function (e, t) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.findInArray = function (e, t) {
              for (var r = 0, n = e.length; r < n; r++) if (t.apply(t, [e[r], r, e])) return e[r];
            }),
            (t.isFunction = function (e) {
              return "function" == typeof e || "[object Function]" === Object.prototype.toString.call(e);
            }),
            (t.isNum = function (e) {
              return "number" == typeof e && !isNaN(e);
            }),
            (t.int = function (e) {
              return parseInt(e, 10);
            }),
            (t.dontSetMe = function (e, t, r) {
              if (e[t]) return new Error("Invalid prop ".concat(t, " passed to ").concat(r, " - do not set this, set it on the child."));
            });
        },
        827: function (e, t, r) {
          "use strict";
          (t.__esModule = !0), (t.default = void 0);
          var n = (function (e, t) {
              if (e && e.__esModule) return e;
              if (null === e || ("object" != typeof e && "function" != typeof e)) return { default: e };
              var r = u(t);
              if (r && r.has(e)) return r.get(e);
              var n = {},
                o = Object.defineProperty && Object.getOwnPropertyDescriptor;
              for (var a in e)
                if ("default" !== a && Object.prototype.hasOwnProperty.call(e, a)) {
                  var i = o ? Object.getOwnPropertyDescriptor(e, a) : null;
                  i && (i.get || i.set) ? Object.defineProperty(n, a, i) : (n[a] = e[a]);
                }
              return (n.default = e), r && r.set(e, n), n;
            })(r(359)),
            o = r(193),
            a = r(69),
            i = r(448),
            s = [
              "children",
              "className",
              "draggableOpts",
              "width",
              "height",
              "handle",
              "handleSize",
              "lockAspectRatio",
              "axis",
              "minConstraints",
              "maxConstraints",
              "onResize",
              "onResizeStop",
              "onResizeStart",
              "resizeHandles",
              "transformScale",
            ];
          function u(e) {
            if ("function" != typeof WeakMap) return null;
            var t = new WeakMap(),
              r = new WeakMap();
            return (u = function (e) {
              return e ? r : t;
            })(e);
          }
          function l() {
            return (
              (l =
                Object.assign ||
                function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
                  }
                  return e;
                }),
              l.apply(this, arguments)
            );
          }
          function c(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function f(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? c(Object(r), !0).forEach(function (t) {
                    p(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : c(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function p(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          function d(e, t) {
            return (
              (d =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              d(e, t)
            );
          }
          var y = (function (e) {
            var t, r;
            function i() {
              for (var t, r = arguments.length, n = new Array(r), o = 0; o < r; o++) n[o] = arguments[o];
              return ((t = e.call.apply(e, [this].concat(n)) || this).handleRefs = {}), (t.lastHandleRect = null), (t.slack = null), t;
            }
            (r = e), ((t = i).prototype = Object.create(r.prototype)), (t.prototype.constructor = t), d(t, r);
            var u = i.prototype;
            return (
              (u.componentWillUnmount = function () {
                this.resetData();
              }),
              (u.resetData = function () {
                this.lastHandleRect = this.slack = null;
              }),
              (u.runConstraints = function (e, t) {
                var r = this.props,
                  n = r.minConstraints,
                  o = r.maxConstraints,
                  a = r.lockAspectRatio;
                if (!n && !o && !a) return [e, t];
                if (a) {
                  var i = this.props.width / this.props.height,
                    s = e - this.props.width,
                    u = t - this.props.height;
                  Math.abs(s) > Math.abs(u * i) ? (t = e / i) : (e = t * i);
                }
                var l = e,
                  c = t,
                  f = this.slack || [0, 0],
                  p = f[0],
                  d = f[1];
                return (
                  (e += p),
                  (t += d),
                  n && ((e = Math.max(n[0], e)), (t = Math.max(n[1], t))),
                  o && ((e = Math.min(o[0], e)), (t = Math.min(o[1], t))),
                  (this.slack = [p + (l - e), d + (c - t)]),
                  [e, t]
                );
              }),
              (u.resizeHandler = function (e, t) {
                var r = this;
                return function (n, o) {
                  var a = o.node,
                    i = o.deltaX,
                    s = o.deltaY;
                  "onResizeStart" === e && r.resetData();
                  var u = ("both" === r.props.axis || "x" === r.props.axis) && "n" !== t && "s" !== t,
                    l = ("both" === r.props.axis || "y" === r.props.axis) && "e" !== t && "w" !== t;
                  if (u || l) {
                    var c = t[0],
                      f = t[t.length - 1],
                      p = a.getBoundingClientRect();
                    null != r.lastHandleRect && ("w" === f && (i += p.left - r.lastHandleRect.left), "n" === c && (s += p.top - r.lastHandleRect.top)),
                      (r.lastHandleRect = p),
                      "w" === f && (i = -i),
                      "n" === c && (s = -s);
                    var d = r.props.width + (u ? i / r.props.transformScale : 0),
                      y = r.props.height + (l ? s / r.props.transformScale : 0),
                      h = r.runConstraints(d, y);
                    (d = h[0]), (y = h[1]);
                    var g = d !== r.props.width || y !== r.props.height,
                      b = "function" == typeof r.props[e] ? r.props[e] : null;
                    b &&
                      !("onResize" === e && !g) &&
                      (null == n.persist || n.persist(),
                      b(n, {
                        node: a,
                        size: { width: d, height: y },
                        handle: t,
                      })),
                      "onResizeStop" === e && r.resetData();
                  }
                };
              }),
              (u.renderResizeHandle = function (e, t) {
                var r = this.props.handle;
                if (!r)
                  return n.createElement("span", {
                    className: "react-resizable-handle react-resizable-handle-" + e,
                    ref: t,
                  });
                if ("function" == typeof r) return r(e, t);
                var o = f({ ref: t }, "string" == typeof r.type ? {} : { handleAxis: e });
                return n.cloneElement(r, o);
              }),
              (u.render = function () {
                var e = this,
                  t = this.props,
                  r = t.children,
                  i = t.className,
                  u = t.draggableOpts,
                  c =
                    (t.width,
                    t.height,
                    t.handle,
                    t.handleSize,
                    t.lockAspectRatio,
                    t.axis,
                    t.minConstraints,
                    t.maxConstraints,
                    t.onResize,
                    t.onResizeStop,
                    t.onResizeStart,
                    t.resizeHandles),
                  p =
                    (t.transformScale,
                    (function (e, t) {
                      if (null == e) return {};
                      var r,
                        n,
                        o = {},
                        a = Object.keys(e);
                      for (n = 0; n < a.length; n++) (r = a[n]), t.indexOf(r) >= 0 || (o[r] = e[r]);
                      return o;
                    })(t, s));
                return (0, a.cloneElement)(
                  r,
                  f(
                    f({}, p),
                    {},
                    {
                      className: (i ? i + " " : "") + "react-resizable",
                      children: [].concat(
                        r.props.children,
                        c.map(function (t) {
                          var r,
                            a = null != (r = e.handleRefs[t]) ? r : (e.handleRefs[t] = n.createRef());
                          return n.createElement(
                            o.DraggableCore,
                            l({}, u, {
                              nodeRef: a,
                              key: "resizableHandle-" + t,
                              onStop: e.resizeHandler("onResizeStop", t),
                              onStart: e.resizeHandler("onResizeStart", t),
                              onDrag: e.resizeHandler("onResize", t),
                            }),
                            e.renderResizeHandle(t, a)
                          );
                        })
                      ),
                    }
                  )
                );
              }),
              i
            );
          })(n.Component);
          (t.default = y),
            (y.propTypes = i.resizableProps),
            (y.defaultProps = {
              axis: "both",
              handleSize: [20, 20],
              lockAspectRatio: !1,
              minConstraints: [20, 20],
              maxConstraints: [1 / 0, 1 / 0],
              resizeHandles: ["se"],
              transformScale: 1,
            });
        },
        735: function (e, t, r) {
          "use strict";
          t.default = void 0;
          var n = (function (e, t) {
              if (e && e.__esModule) return e;
              if (null === e || ("object" != typeof e && "function" != typeof e)) return { default: e };
              var r = l(t);
              if (r && r.has(e)) return r.get(e);
              var n = {},
                o = Object.defineProperty && Object.getOwnPropertyDescriptor;
              for (var a in e)
                if ("default" !== a && Object.prototype.hasOwnProperty.call(e, a)) {
                  var i = o ? Object.getOwnPropertyDescriptor(e, a) : null;
                  i && (i.get || i.set) ? Object.defineProperty(n, a, i) : (n[a] = e[a]);
                }
              return (n.default = e), r && r.set(e, n), n;
            })(r(359)),
            o = u(r(697)),
            a = u(r(827)),
            i = r(448),
            s = [
              "handle",
              "handleSize",
              "onResize",
              "onResizeStart",
              "onResizeStop",
              "draggableOpts",
              "minConstraints",
              "maxConstraints",
              "lockAspectRatio",
              "axis",
              "width",
              "height",
              "resizeHandles",
              "style",
              "transformScale",
            ];
          function u(e) {
            return e && e.__esModule ? e : { default: e };
          }
          function l(e) {
            if ("function" != typeof WeakMap) return null;
            var t = new WeakMap(),
              r = new WeakMap();
            return (l = function (e) {
              return e ? r : t;
            })(e);
          }
          function c() {
            return (
              (c =
                Object.assign ||
                function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
                  }
                  return e;
                }),
              c.apply(this, arguments)
            );
          }
          function f(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function p(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? f(Object(r), !0).forEach(function (t) {
                    d(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : f(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function d(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
          function y(e, t) {
            return (
              (y =
                Object.setPrototypeOf ||
                function (e, t) {
                  return (e.__proto__ = t), e;
                }),
              y(e, t)
            );
          }
          var h = (function (e) {
            var t, r;
            function o() {
              for (var t, r = arguments.length, n = new Array(r), o = 0; o < r; o++) n[o] = arguments[o];
              return (
                ((t = e.call.apply(e, [this].concat(n)) || this).state = {
                  width: t.props.width,
                  height: t.props.height,
                  propsWidth: t.props.width,
                  propsHeight: t.props.height,
                }),
                (t.onResize = function (e, r) {
                  var n = r.size;
                  t.props.onResize
                    ? (null == e.persist || e.persist(),
                      t.setState(n, function () {
                        return t.props.onResize && t.props.onResize(e, r);
                      }))
                    : t.setState(n);
                }),
                t
              );
            }
            return (
              (r = e),
              ((t = o).prototype = Object.create(r.prototype)),
              (t.prototype.constructor = t),
              y(t, r),
              (o.getDerivedStateFromProps = function (e, t) {
                return t.propsWidth !== e.width || t.propsHeight !== e.height
                  ? {
                      width: e.width,
                      height: e.height,
                      propsWidth: e.width,
                      propsHeight: e.height,
                    }
                  : null;
              }),
              (o.prototype.render = function () {
                var e = this.props,
                  t = e.handle,
                  r = e.handleSize,
                  o = (e.onResize, e.onResizeStart),
                  i = e.onResizeStop,
                  u = e.draggableOpts,
                  l = e.minConstraints,
                  f = e.maxConstraints,
                  d = e.lockAspectRatio,
                  y = e.axis,
                  h = (e.width, e.height, e.resizeHandles),
                  g = e.style,
                  b = e.transformScale,
                  m = (function (e, t) {
                    if (null == e) return {};
                    var r,
                      n,
                      o = {},
                      a = Object.keys(e);
                    for (n = 0; n < a.length; n++) (r = a[n]), t.indexOf(r) >= 0 || (o[r] = e[r]);
                    return o;
                  })(e, s);
                return n.createElement(
                  a.default,
                  {
                    axis: y,
                    draggableOpts: u,
                    handle: t,
                    handleSize: r,
                    height: this.state.height,
                    lockAspectRatio: d,
                    maxConstraints: f,
                    minConstraints: l,
                    onResizeStart: o,
                    onResize: this.onResize,
                    onResizeStop: i,
                    resizeHandles: h,
                    transformScale: b,
                    width: this.state.width,
                  },
                  n.createElement(
                    "div",
                    c({}, m, {
                      style: p(
                        p({}, g),
                        {},
                        {
                          width: this.state.width + "px",
                          height: this.state.height + "px",
                        }
                      ),
                    })
                  )
                );
              }),
              o
            );
          })(n.Component);
          (t.default = h), (h.propTypes = p(p({}, i.resizableProps), {}, { children: o.default.element }));
        },
        448: function (e, t, r) {
          "use strict";
          (t.__esModule = !0), (t.resizableProps = void 0);
          var n,
            o = (n = r(697)) && n.__esModule ? n : { default: n };
          r(193);
          var a = {
            axis: o.default.oneOf(["both", "x", "y", "none"]),
            className: o.default.string,
            children: o.default.element.isRequired,
            draggableOpts: o.default.shape({
              allowAnyClick: o.default.bool,
              cancel: o.default.string,
              children: o.default.node,
              disabled: o.default.bool,
              enableUserSelectHack: o.default.bool,
              offsetParent: o.default.node,
              grid: o.default.arrayOf(o.default.number),
              handle: o.default.string,
              nodeRef: o.default.object,
              onStart: o.default.func,
              onDrag: o.default.func,
              onStop: o.default.func,
              onMouseDown: o.default.func,
              scale: o.default.number,
            }),
            height: o.default.number.isRequired,
            handle: o.default.oneOfType([o.default.node, o.default.func]),
            handleSize: o.default.arrayOf(o.default.number),
            lockAspectRatio: o.default.bool,
            maxConstraints: o.default.arrayOf(o.default.number),
            minConstraints: o.default.arrayOf(o.default.number),
            onResizeStop: o.default.func,
            onResizeStart: o.default.func,
            onResize: o.default.func,
            resizeHandles: o.default.arrayOf(o.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])),
            transformScale: o.default.number,
            width: o.default.number.isRequired,
          };
          t.resizableProps = a;
        },
        69: function (e, t, r) {
          "use strict";
          (t.__esModule = !0),
            (t.cloneElement = function (e, t) {
              return (
                t.style && e.props.style && (t.style = i(i({}, e.props.style), t.style)),
                t.className && e.props.className && (t.className = e.props.className + " " + t.className),
                o.default.cloneElement(e, t)
              );
            });
          var n,
            o = (n = r(359)) && n.__esModule ? n : { default: n };
          function a(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t &&
                (n = n.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function i(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? a(Object(r), !0).forEach(function (t) {
                    s(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : a(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          }
          function s(e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          }
        },
        706: function (e, t, r) {
          "use strict";
          (e.exports = function () {
            throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
          }),
            (e.exports.Resizable = r(827).default),
            (e.exports.ResizableBox = r(735).default);
        },
        359: function (t) {
          "use strict";
          t.exports = e;
        },
        318: function (e) {
          "use strict";
          e.exports = t;
        },
      },
      n = {};
    function o(e) {
      var t = n[e];
      if (void 0 !== t) return t.exports;
      var a = (n[e] = { id: e, loaded: !1, exports: {} });
      return r[e](a, a.exports, o), (a.loaded = !0), a.exports;
    }
    return (
      (o.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return o.d(t, { a: t }), t;
      }),
      (o.d = function (e, t) {
        for (var r in t) o.o(t, r) && !o.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
      }),
      (o.g = (function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (e) {
          if ("object" == typeof window) return window;
        }
      })()),
      (o.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (o.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (o.nmd = function (e) {
        return (e.paths = []), e.children || (e.children = []), e;
      }),
      o(325)
    );
  })();
});
