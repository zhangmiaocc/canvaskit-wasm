var CanvasKitInit = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function(CanvasKitInit) {
            CanvasKitInit = CanvasKitInit || {};


            null;
            var u;
            u || (u = typeof CanvasKitInit !== 'undefined' ? CanvasKitInit : {});
            var da = Object.assign,
                ha, ia;
            u.ready = new Promise(function(a, b) {
                ha = a;
                ia = b
            });
            (function(a) {
                a.Sd = a.Sd || [];
                a.Sd.push(function() {
                    a.MakeSWCanvasSurface = function(b) { var d = b; if ("CANVAS" !== d.tagName && (d = document.getElementById(b), !d)) throw "Canvas with id " + b + " was not found"; if (b = a.MakeSurface(d.width, d.height)) b.Nd = d; return b };
                    a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
                    a.MakeSurface = function(b, d) {
                        var f = { width: b, height: d, colorType: a.ColorType.RGBA_8888, alphaType: a.AlphaType.Unpremul, colorSpace: a.ColorSpace.SRGB },
                            h = b * d * 4,
                            l = a._malloc(h);
                        if (f = a.Surface._makeRasterDirect(f,
                                l, 4 * b)) f.Nd = null, f.Cf = b, f.zf = d, f.Bf = h, f.bf = l, f.getCanvas().clear(a.TRANSPARENT);
                        return f
                    };
                    a.MakeRasterDirectSurface = function(b, d, f) { return a.Surface._makeRasterDirect(b, d.byteOffset, f) };
                    a.Surface.prototype.flush = function(b) {
                        a.Od(this.Md);
                        this._flush();
                        if (this.Nd) {
                            var d = new Uint8ClampedArray(a.HEAPU8.buffer, this.bf, this.Bf);
                            d = new ImageData(d, this.Cf, this.zf);
                            b ? this.Nd.getContext("2d").putImageData(d, 0, 0, b[0], b[1], b[2] - b[0], b[3] - b[1]) : this.Nd.getContext("2d").putImageData(d, 0, 0)
                        }
                    };
                    a.Surface.prototype.dispose =
                        function() {
                            this.bf && a._free(this.bf);
                            this.delete()
                        };
                    a.Od = a.Od || function() {}
                })
            })(u);
            (function(a) {
                a.Sd = a.Sd || [];
                a.Sd.push(function() {
                    function b(l, n, q) { return l && l.hasOwnProperty(n) ? l[n] : q }

                    function d(l) {
                        var n = ka(la);
                        la[n] = l;
                        return n
                    }

                    function f(l) { return l.naturalHeight || l.videoHeight || l.displayHeight || l.height }

                    function h(l) { return l.naturalWidth || l.videoWidth || l.displayWidth || l.width }
                    a.GetWebGLContext = function(l, n) {
                        if (!l) throw "null canvas passed into makeWebGLContext";
                        var q = {
                            alpha: b(n, "alpha", 1),
                            depth: b(n, "depth", 1),
                            stencil: b(n, "stencil", 8),
                            antialias: b(n, "antialias", 0),
                            premultipliedAlpha: b(n,
                                "premultipliedAlpha", 1),
                            preserveDrawingBuffer: b(n, "preserveDrawingBuffer", 0),
                            preferLowPowerToHighPerformance: b(n, "preferLowPowerToHighPerformance", 0),
                            failIfMajorPerformanceCaveat: b(n, "failIfMajorPerformanceCaveat", 0),
                            enableExtensionsByDefault: b(n, "enableExtensionsByDefault", 1),
                            explicitSwapControl: b(n, "explicitSwapControl", 0),
                            renderViaOffscreenBackBuffer: b(n, "renderViaOffscreenBackBuffer", 0)
                        };
                        q.majorVersion = n && n.majorVersion ? n.majorVersion : "undefined" !== typeof WebGL2RenderingContext ? 2 : 1;
                        if (q.explicitSwapControl) throw "explicitSwapControl is not supported";
                        l = ma(l, q);
                        if (!l) return 0;
                        na(l);
                        return l
                    };
                    a.deleteContext = function(l) {
                        v === ra[l] && (v = null);
                        "object" === typeof JSEvents && JSEvents.Hg(ra[l].je.canvas);
                        ra[l] && ra[l].je.canvas && (ra[l].je.canvas.yf = void 0);
                        ra[l] = null
                    };
                    a._setTextureCleanup({
                        deleteTexture: function(l, n) {
                            var q = la[n];
                            q && ra[l].je.deleteTexture(q);
                            la[n] = null
                        }
                    });
                    a.MakeGrContext = function(l) {
                        if (!this.Od(l)) return null;
                        var n = this._MakeGrContext();
                        if (!n) return null;
                        n.Md = l;
                        return n
                    };
                    a.MakeOnScreenGLSurface = function(l, n, q, w) {
                        if (!this.Od(l.Md)) return null;
                        n = this._MakeOnScreenGLSurface(l, n, q, w);
                        if (!n) return null;
                        n.Md = l.Md;
                        return n
                    };
                    a.MakeRenderTarget = function() {
                        var l = arguments[0];
                        if (!this.Od(l.Md)) return null;
                        if (3 === arguments.length) { var n = this._MakeRenderTargetWH(l, arguments[1], arguments[2]); if (!n) return null } else if (2 === arguments.length) { if (n = this._MakeRenderTargetII(l, arguments[1]), !n) return null } else return null;
                        n.Md = l.Md;
                        return n
                    };
                    a.MakeWebGLCanvasSurface = function(l, n, q) {
                        n = n || null;
                        var w = l,
                            x = "undefined" !== typeof OffscreenCanvas && w instanceof OffscreenCanvas;
                        if (!("undefined" !== typeof HTMLCanvasElement && w instanceof HTMLCanvasElement || x || (w = document.getElementById(l), w))) throw "Canvas with id " + l + " was not found";
                        l = this.GetWebGLContext(w, q);
                        if (!l || 0 > l) throw "failed to create webgl context: err " + l;
                        l = this.MakeGrContext(l);
                        n = this.MakeOnScreenGLSurface(l, w.width, w.height, n);
                        return n ? n : (n = w.cloneNode(!0), w.parentNode.replaceChild(n, w), n.classList.add("ck-replaced"), a.MakeSWCanvasSurface(n))
                    };
                    a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
                    a.Surface.prototype.makeImageFromTexture =
                        function(l, n) {
                            a.Od(this.Md);
                            l = d(l);
                            if (n = this._makeImageFromTexture(this.Md, l, n)) n.Ke = l;
                            return n
                        };
                    a.Surface.prototype.makeImageFromTextureSource = function(l, n) {
                        n || (n = { height: f(l), width: h(l), colorType: a.ColorType.RGBA_8888, alphaType: a.AlphaType.Unpremul });
                        n.colorSpace || (n.colorSpace = a.ColorSpace.SRGB);
                        a.Od(this.Md);
                        var q = v.je,
                            w = q.createTexture();
                        q.bindTexture(q.TEXTURE_2D, w);
                        2 === v.version ? q.texImage2D(q.TEXTURE_2D, 0, q.RGBA, n.width, n.height, 0, q.RGBA, q.UNSIGNED_BYTE, l) : q.texImage2D(q.TEXTURE_2D, 0, q.RGBA,
                            q.RGBA, q.UNSIGNED_BYTE, l);
                        q.bindTexture(q.TEXTURE_2D, null);
                        return this.makeImageFromTexture(w, n)
                    };
                    a.Surface.prototype.updateTextureFromSource = function(l, n) {
                        if (l.Ke) {
                            a.Od(this.Md);
                            var q = v.je,
                                w = la[l.Ke];
                            q.bindTexture(q.TEXTURE_2D, w);
                            2 === v.version ? q.texImage2D(q.TEXTURE_2D, 0, q.RGBA, h(n), f(n), 0, q.RGBA, q.UNSIGNED_BYTE, n) : q.texImage2D(q.TEXTURE_2D, 0, q.RGBA, q.RGBA, q.UNSIGNED_BYTE, n);
                            q.bindTexture(q.TEXTURE_2D, null);
                            this._resetContext();
                            la[l.Ke] = null;
                            l.Ke = d(w);
                            n = l.getImageInfo();
                            n.colorSpace = l.getColorSpace();
                            q = this._makeImageFromTexture(this.Md, l.Ke, n);
                            w = l.Ld.Qd;
                            var x = l.Ld.$d;
                            l.Ld.Qd = q.Ld.Qd;
                            l.Ld.$d = q.Ld.$d;
                            q.Ld.Qd = w;
                            q.Ld.$d = x;
                            q.delete();
                            n.colorSpace.delete()
                        }
                    };
                    a.MakeLazyImageFromTextureSource = function(l, n) {
                        n || (n = { height: f(l), width: h(l), colorType: a.ColorType.RGBA_8888, alphaType: a.AlphaType.Unpremul });
                        n.colorSpace || (n.colorSpace = a.ColorSpace.SRGB);
                        var q = {
                            makeTexture: function() {
                                var w = v,
                                    x = w.je,
                                    K = x.createTexture();
                                x.bindTexture(x.TEXTURE_2D, K);
                                2 === w.version ? x.texImage2D(x.TEXTURE_2D, 0, x.RGBA, n.width, n.height,
                                    0, x.RGBA, x.UNSIGNED_BYTE, l) : x.texImage2D(x.TEXTURE_2D, 0, x.RGBA, x.RGBA, x.UNSIGNED_BYTE, l);
                                x.bindTexture(x.TEXTURE_2D, null);
                                return d(K)
                            },
                            freeSrc: function() {}
                        };
                        "VideoFrame" === l.constructor.name && (q.freeSrc = function() { l.close() });
                        return a.Image._makeFromGenerator(n, q)
                    };
                    a.Od = function(l) { return l ? na(l) : !1 }
                })
            })(u);
            (function(a) {
                function b(e, c, g, m, r) { for (var y = 0; y < e.length; y++) c[y * g + (y * r + m + g) % g] = e[y]; return c }

                function d(e) { for (var c = e * e, g = Array(c); c--;) g[c] = 0 === c % (e + 1) ? 1 : 0; return g }

                function f(e) { return e ? e.constructor === Float32Array && 4 === e.length : !1 }

                function h(e) { return (q(255 * e[3]) << 24 | q(255 * e[0]) << 16 | q(255 * e[1]) << 8 | q(255 * e[2]) << 0) >>> 0 }

                function l(e) {
                    if (e && e._ck) return e;
                    if (e instanceof Float32Array) { for (var c = Math.floor(e.length / 4), g = new Uint32Array(c), m = 0; m < c; m++) g[m] = h(e.slice(4 * m, 4 * (m + 1))); return g }
                    if (e instanceof Uint32Array) return e;
                    if (e instanceof Array && e[0] instanceof Float32Array) return e.map(h)
                }

                function n(e) { if (void 0 === e) return 1; var c = parseFloat(e); return e && -1 !== e.indexOf("%") ? c / 100 : c }

                function q(e) { return Math.round(Math.max(0, Math.min(e || 0, 255))) }

                function w(e, c) { c && c._ck || a._free(e) }

                function x(e, c, g) {
                    if (!e || !e.length) return S;
                    if (e && e._ck) return e.byteOffset;
                    var m = a[c].BYTES_PER_ELEMENT;
                    g || (g = a._malloc(e.length * m));
                    a[c].set(e, g / m);
                    return g
                }

                function K(e) {
                    var c = { de: S, count: e.length, Le: a.ColorType.RGBA_F32 };
                    if (e instanceof Float32Array) c.de = x(e, "HEAPF32"), c.count = e.length / 4;
                    else if (e instanceof Uint32Array) c.de = x(e, "HEAPU32"), c.Le = a.ColorType.RGBA_8888;
                    else if (e instanceof Array) {
                        if (e && e.length) {
                            for (var g = a._malloc(16 * e.length), m = 0, r = g / 4, y = 0; y < e.length; y++)
                                for (var C = 0; 4 > C; C++) a.HEAPF32[r + m] = e[y][C], m++;
                            e = g
                        } else e = S;
                        c.de = e
                    } else throw "Invalid argument to copyFlexibleColorArray, Not a color array " + typeof e;
                    return c
                }

                function J(e) {
                    if (!e) return S;
                    if (e.length) {
                        if (6 === e.length || 9 === e.length) return x(e, "HEAPF32",
                            Oa), 6 === e.length && a.HEAPF32.set(Fd, 6 + Oa / 4), Oa;
                        if (16 === e.length) {
                            var c = yb.toTypedArray();
                            c[0] = e[0];
                            c[1] = e[1];
                            c[2] = e[3];
                            c[3] = e[4];
                            c[4] = e[5];
                            c[5] = e[7];
                            c[6] = e[12];
                            c[7] = e[13];
                            c[8] = e[15];
                            return Oa
                        }
                        throw "invalid matrix size";
                    }
                    c = yb.toTypedArray();
                    c[0] = e.m11;
                    c[1] = e.m21;
                    c[2] = e.m41;
                    c[3] = e.m12;
                    c[4] = e.m22;
                    c[5] = e.m42;
                    c[6] = e.m14;
                    c[7] = e.m24;
                    c[8] = e.m44;
                    return Oa
                }

                function Q(e) {
                    if (!e) return S;
                    var c = Yb.toTypedArray();
                    if (e.length) {
                        if (16 !== e.length && 6 !== e.length && 9 !== e.length) throw "invalid matrix size";
                        if (16 === e.length) return x(e,
                            "HEAPF32", Za);
                        c.fill(0);
                        c[0] = e[0];
                        c[1] = e[1];
                        c[3] = e[2];
                        c[4] = e[3];
                        c[5] = e[4];
                        c[7] = e[5];
                        c[12] = e[6];
                        c[13] = e[7];
                        c[15] = e[8];
                        6 === e.length && (c[12] = 0, c[13] = 0, c[15] = 1);
                        return Za
                    }
                    c[0] = e.m11;
                    c[1] = e.m21;
                    c[2] = e.m31;
                    c[3] = e.m41;
                    c[4] = e.m12;
                    c[5] = e.m22;
                    c[6] = e.m32;
                    c[7] = e.m42;
                    c[8] = e.m13;
                    c[9] = e.m23;
                    c[10] = e.m33;
                    c[11] = e.m43;
                    c[12] = e.m14;
                    c[13] = e.m24;
                    c[14] = e.m34;
                    c[15] = e.m44;
                    return Za
                }

                function A(e, c) { return x(e, "HEAPF32", c || fb) }

                function M(e, c, g, m) {
                    var r = Zb.toTypedArray();
                    r[0] = e;
                    r[1] = c;
                    r[2] = g;
                    r[3] = m;
                    return fb
                }

                function U(e) {
                    for (var c =
                            new Float32Array(4), g = 0; 4 > g; g++) c[g] = a.HEAPF32[e / 4 + g];
                    return c
                }

                function T(e, c) { return x(e, "HEAPF32", c || ea) }

                function oa(e, c) { return x(e, "HEAPF32", c || $b) }

                function wa() { for (var e = 0, c = 0; c < arguments.length - 1; c += 2) e += arguments[c] * arguments[c + 1]; return e }

                function gb(e, c, g) {
                    for (var m = Array(e.length), r = 0; r < g; r++)
                        for (var y = 0; y < g; y++) {
                            for (var C = 0, I = 0; I < g; I++) C += e[g * r + I] * c[g * I + y];
                            m[r * g + y] = C
                        }
                    return m
                }

                function hb(e, c) { for (var g = gb(c[0], c[1], e), m = 2; m < c.length;) g = gb(g, c[m], e), m++; return g }
                a.Color = function(e, c, g,
                    m) { void 0 === m && (m = 1); return a.Color4f(q(e) / 255, q(c) / 255, q(g) / 255, m) };
                a.ColorAsInt = function(e, c, g, m) { void 0 === m && (m = 255); return (q(m) << 24 | q(e) << 16 | q(c) << 8 | q(g) << 0 & 268435455) >>> 0 };
                a.Color4f = function(e, c, g, m) { void 0 === m && (m = 1); return Float32Array.of(e, c, g, m) };
                Object.defineProperty(a, "TRANSPARENT", { get: function() { return a.Color4f(0, 0, 0, 0) } });
                Object.defineProperty(a, "BLACK", { get: function() { return a.Color4f(0, 0, 0, 1) } });
                Object.defineProperty(a, "WHITE", { get: function() { return a.Color4f(1, 1, 1, 1) } });
                Object.defineProperty(a,
                    "RED", { get: function() { return a.Color4f(1, 0, 0, 1) } });
                Object.defineProperty(a, "GREEN", { get: function() { return a.Color4f(0, 1, 0, 1) } });
                Object.defineProperty(a, "BLUE", { get: function() { return a.Color4f(0, 0, 1, 1) } });
                Object.defineProperty(a, "YELLOW", { get: function() { return a.Color4f(1, 1, 0, 1) } });
                Object.defineProperty(a, "CYAN", { get: function() { return a.Color4f(0, 1, 1, 1) } });
                Object.defineProperty(a, "MAGENTA", { get: function() { return a.Color4f(1, 0, 1, 1) } });
                a.getColorComponents = function(e) {
                    return [Math.floor(255 * e[0]), Math.floor(255 *
                        e[1]), Math.floor(255 * e[2]), e[3]]
                };
                a.parseColorString = function(e, c) {
                    e = e.toLowerCase();
                    if (e.startsWith("#")) {
                        c = 255;
                        switch (e.length) {
                            case 9:
                                c = parseInt(e.slice(7, 9), 16);
                            case 7:
                                var g = parseInt(e.slice(1, 3), 16);
                                var m = parseInt(e.slice(3, 5), 16);
                                var r = parseInt(e.slice(5, 7), 16);
                                break;
                            case 5:
                                c = 17 * parseInt(e.slice(4, 5), 16);
                            case 4:
                                g = 17 * parseInt(e.slice(1, 2), 16), m = 17 * parseInt(e.slice(2, 3), 16), r = 17 * parseInt(e.slice(3, 4), 16)
                        }
                        return a.Color(g, m, r, c / 255)
                    }
                    return e.startsWith("rgba") ? (e = e.slice(5, -1), e = e.split(","), a.Color(+e[0], +e[1], +e[2], n(e[3]))) : e.startsWith("rgb") ? (e = e.slice(4, -1), e = e.split(","), a.Color(+e[0], +e[1], +e[2], n(e[3]))) : e.startsWith("gray(") || e.startsWith("hsl") || !c || (e = c[e], void 0 === e) ? a.BLACK : e
                };
                a.multiplyByAlpha = function(e, c) {
                    e = e.slice();
                    e[3] = Math.max(0, Math.min(e[3] * c, 1));
                    return e
                };
                a.Malloc = function(e, c) {
                    var g = a._malloc(c * e.BYTES_PER_ELEMENT);
                    return {
                        _ck: !0,
                        length: c,
                        byteOffset: g,
                        pe: null,
                        subarray: function(m, r) {
                            m = this.toTypedArray().subarray(m, r);
                            m._ck = !0;
                            return m
                        },
                        toTypedArray: function() {
                            if (this.pe && this.pe.length) return this.pe;
                            this.pe = new e(a.HEAPU8.buffer, g, c);
                            this.pe._ck = !0;
                            return this.pe
                        }
                    }
                };
                a.Free = function(e) {
                    a._free(e.byteOffset);
                    e.byteOffset = S;
                    e.toTypedArray = null;
                    e.pe = null
                };
                var Oa = S,
                    yb, Za = S,
                    Yb, fb = S,
                    Zb, pa, ea = S,
                    Ic, Ta = S,
                    Jc, ac = S,
                    Kc, bc = S,
                    Lc, cc = S,
                    Mc, $b = S,
                    Nc, Oc = S,
                    Fd = Float32Array.of(0, 0, 1),
                    S = 0;
                a.onRuntimeInitialized = function() {
                    function e(c, g, m, r, y, C) {
                        C || (C = 4 * r.width, r.colorType === a.ColorType.RGBA_F16 ? C *= 2 : r.colorType === a.ColorType.RGBA_F32 && (C *= 4));
                        var I = C * r.height;
                        var L = y ? y.byteOffset : a._malloc(I);
                        if (!c._readPixels(r, L, C,
                                g, m)) return y || a._free(L), null;
                        if (y) return y.toTypedArray();
                        switch (r.colorType) {
                            case a.ColorType.RGBA_8888:
                            case a.ColorType.RGBA_F16:
                                c = (new Uint8Array(a.HEAPU8.buffer, L, I)).slice();
                                break;
                            case a.ColorType.RGBA_F32:
                                c = (new Float32Array(a.HEAPU8.buffer, L, I)).slice();
                                break;
                            default:
                                return null
                        }
                        a._free(L);
                        return c
                    }
                    Zb = a.Malloc(Float32Array, 4);
                    fb = Zb.byteOffset;
                    Yb = a.Malloc(Float32Array, 16);
                    Za = Yb.byteOffset;
                    yb = a.Malloc(Float32Array, 9);
                    Oa = yb.byteOffset;
                    Mc = a.Malloc(Float32Array, 12);
                    $b = Mc.byteOffset;
                    Nc = a.Malloc(Float32Array,
                        12);
                    Oc = Nc.byteOffset;
                    pa = a.Malloc(Float32Array, 4);
                    ea = pa.byteOffset;
                    Ic = a.Malloc(Float32Array, 4);
                    Ta = Ic.byteOffset;
                    Jc = a.Malloc(Float32Array, 3);
                    ac = Jc.byteOffset;
                    Kc = a.Malloc(Float32Array, 3);
                    bc = Kc.byteOffset;
                    Lc = a.Malloc(Int32Array, 4);
                    cc = Lc.byteOffset;
                    a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
                    a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
                    a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
                    a.GlyphRunFlags = { IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace };
                    a.Path.MakeFromCmds = function(c) {
                        var g = x(c, "HEAPF32"),
                            m = a.Path._MakeFromCmds(g, c.length);
                        w(g, c);
                        return m
                    };
                    a.Path.MakeFromVerbsPointsWeights = function(c, g, m) {
                        var r = x(c, "HEAPU8"),
                            y = x(g, "HEAPF32"),
                            C = x(m, "HEAPF32"),
                            I = a.Path._MakeFromVerbsPointsWeights(r, c.length, y, g.length, C, m && m.length || 0);
                        w(r, c);
                        w(y, g);
                        w(C, m);
                        return I
                    };
                    a.Path.prototype.addArc = function(c, g, m) {
                        c = T(c);
                        this._addArc(c, g, m);
                        return this
                    };
                    a.Path.prototype.addOval = function(c, g, m) {
                        void 0 === m && (m = 1);
                        c = T(c);
                        this._addOval(c, !!g, m);
                        return this
                    };
                    a.Path.prototype.addPath = function() {
                        var c = Array.prototype.slice.call(arguments),
                            g = c[0],
                            m = !1;
                        "boolean" === typeof c[c.length - 1] && (m = c.pop());
                        if (1 === c.length) this._addPath(g, 1, 0, 0, 0, 1, 0, 0, 0, 1, m);
                        else if (2 === c.length) c = c[1], this._addPath(g, c[0], c[1], c[2], c[3], c[4], c[5], c[6] || 0, c[7] || 0, c[8] || 1, m);
                        else if (7 === c.length || 10 === c.length) this._addPath(g, c[1], c[2], c[3], c[4], c[5], c[6], c[7] || 0, c[8] || 0, c[9] || 1, m);
                        else return null;
                        return this
                    };
                    a.Path.prototype.addPoly = function(c, g) {
                        var m = x(c, "HEAPF32");
                        this._addPoly(m, c.length / 2, g);
                        w(m, c);
                        return this
                    };
                    a.Path.prototype.addRect = function(c, g) {
                        c =
                            T(c);
                        this._addRect(c, !!g);
                        return this
                    };
                    a.Path.prototype.addRRect = function(c, g) {
                        c = oa(c);
                        this._addRRect(c, !!g);
                        return this
                    };
                    a.Path.prototype.addVerbsPointsWeights = function(c, g, m) {
                        var r = x(c, "HEAPU8"),
                            y = x(g, "HEAPF32"),
                            C = x(m, "HEAPF32");
                        this._addVerbsPointsWeights(r, c.length, y, g.length, C, m && m.length || 0);
                        w(r, c);
                        w(y, g);
                        w(C, m)
                    };
                    a.Path.prototype.arc = function(c, g, m, r, y, C) {
                        c = a.LTRBRect(c - m, g - m, c + m, g + m);
                        y = (y - r) / Math.PI * 180 - 360 * !!C;
                        C = new a.Path;
                        C.addArc(c, r / Math.PI * 180, y);
                        this.addPath(C, !0);
                        C.delete();
                        return this
                    };
                    a.Path.prototype.arcToOval = function(c, g, m, r) {
                        c = T(c);
                        this._arcToOval(c, g, m, r);
                        return this
                    };
                    a.Path.prototype.arcToRotated = function(c, g, m, r, y, C, I) { this._arcToRotated(c, g, m, !!r, !!y, C, I); return this };
                    a.Path.prototype.arcToTangent = function(c, g, m, r, y) { this._arcToTangent(c, g, m, r, y); return this };
                    a.Path.prototype.close = function() { this._close(); return this };
                    a.Path.prototype.conicTo = function(c, g, m, r, y) { this._conicTo(c, g, m, r, y); return this };
                    a.Path.prototype.computeTightBounds = function(c) {
                        this._computeTightBounds(ea);
                        var g = pa.toTypedArray();
                        return c ? (c.set(g), c) : g.slice()
                    };
                    a.Path.prototype.cubicTo = function(c, g, m, r, y, C) { this._cubicTo(c, g, m, r, y, C); return this };
                    a.Path.prototype.dash = function(c, g, m) { return this._dash(c, g, m) ? this : null };
                    a.Path.prototype.getBounds = function(c) { this._getBounds(ea); var g = pa.toTypedArray(); return c ? (c.set(g), c) : g.slice() };
                    a.Path.prototype.lineTo = function(c, g) { this._lineTo(c, g); return this };
                    a.Path.prototype.moveTo = function(c, g) { this._moveTo(c, g); return this };
                    a.Path.prototype.offset = function(c,
                        g) { this._transform(1, 0, c, 0, 1, g, 0, 0, 1); return this };
                    a.Path.prototype.quadTo = function(c, g, m, r) { this._quadTo(c, g, m, r); return this };
                    a.Path.prototype.rArcTo = function(c, g, m, r, y, C, I) { this._rArcTo(c, g, m, r, y, C, I); return this };
                    a.Path.prototype.rConicTo = function(c, g, m, r, y) { this._rConicTo(c, g, m, r, y); return this };
                    a.Path.prototype.rCubicTo = function(c, g, m, r, y, C) { this._rCubicTo(c, g, m, r, y, C); return this };
                    a.Path.prototype.rLineTo = function(c, g) { this._rLineTo(c, g); return this };
                    a.Path.prototype.rMoveTo = function(c, g) {
                        this._rMoveTo(c,
                            g);
                        return this
                    };
                    a.Path.prototype.rQuadTo = function(c, g, m, r) { this._rQuadTo(c, g, m, r); return this };
                    a.Path.prototype.stroke = function(c) {
                        c = c || {};
                        c.width = c.width || 1;
                        c.miter_limit = c.miter_limit || 4;
                        c.cap = c.cap || a.StrokeCap.Butt;
                        c.join = c.join || a.StrokeJoin.Miter;
                        c.precision = c.precision || 1;
                        return this._stroke(c) ? this : null
                    };
                    a.Path.prototype.transform = function() {
                        if (1 === arguments.length) {
                            var c = arguments[0];
                            this._transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6] || 0, c[7] || 0, c[8] || 1)
                        } else if (6 === arguments.length || 9 ===
                            arguments.length) c = arguments, this._transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6] || 0, c[7] || 0, c[8] || 1);
                        else throw "transform expected to take 1 or 9 arguments. Got " + arguments.length;
                        return this
                    };
                    a.Path.prototype.trim = function(c, g, m) { return this._trim(c, g, !!m) ? this : null };
                    a.Image.prototype.makeShaderCubic = function(c, g, m, r, y) { y = J(y); return this._makeShaderCubic(c, g, m, r, y) };
                    a.Image.prototype.makeShaderOptions = function(c, g, m, r, y) { y = J(y); return this._makeShaderOptions(c, g, m, r, y) };
                    a.Image.prototype.readPixels =
                        function(c, g, m, r, y) { return e(this, c, g, m, r, y) };
                    a.Canvas.prototype.clear = function(c) {
                        a.Od(this.Md);
                        c = A(c);
                        this._clear(c)
                    };
                    a.Canvas.prototype.clipRRect = function(c, g, m) {
                        a.Od(this.Md);
                        c = oa(c);
                        this._clipRRect(c, g, m)
                    };
                    a.Canvas.prototype.clipRect = function(c, g, m) {
                        a.Od(this.Md);
                        c = T(c);
                        this._clipRect(c, g, m)
                    };
                    a.Canvas.prototype.concat = function(c) {
                        a.Od(this.Md);
                        c = Q(c);
                        this._concat(c)
                    };
                    a.Canvas.prototype.drawArc = function(c, g, m, r, y) {
                        a.Od(this.Md);
                        c = T(c);
                        this._drawArc(c, g, m, r, y)
                    };
                    a.Canvas.prototype.drawAtlas = function(c,
                        g, m, r, y, C, I) {
                        if (c && r && g && m && g.length === m.length) {
                            a.Od(this.Md);
                            y || (y = a.BlendMode.SrcOver);
                            var L = x(g, "HEAPF32"),
                                O = x(m, "HEAPF32"),
                                V = m.length / 4,
                                t = x(l(C), "HEAPU32");
                            if (I && "B" in I && "C" in I) this._drawAtlasCubic(c, O, L, t, V, y, I.B, I.C, r);
                            else {
                                let F = a.FilterMode.Linear,
                                    R = a.MipmapMode.None;
                                I && (F = I.filter, "mipmap" in I && (R = I.mipmap));
                                this._drawAtlasOptions(c, O, L, t, V, y, F, R, r)
                            }
                            w(L, g);
                            w(O, m);
                            w(t, C)
                        }
                    };
                    a.Canvas.prototype.drawCircle = function(c, g, m, r) {
                        a.Od(this.Md);
                        this._drawCircle(c, g, m, r)
                    };
                    a.Canvas.prototype.drawColor =
                        function(c, g) {
                            a.Od(this.Md);
                            c = A(c);
                            void 0 !== g ? this._drawColor(c, g) : this._drawColor(c)
                        };
                    a.Canvas.prototype.drawColorInt = function(c, g) {
                        a.Od(this.Md);
                        this._drawColorInt(c, g || a.BlendMode.SrcOver)
                    };
                    a.Canvas.prototype.drawColorComponents = function(c, g, m, r, y) {
                        a.Od(this.Md);
                        c = M(c, g, m, r);
                        void 0 !== y ? this._drawColor(c, y) : this._drawColor(c)
                    };
                    a.Canvas.prototype.drawDRRect = function(c, g, m) {
                        a.Od(this.Md);
                        c = oa(c, $b);
                        g = oa(g, Oc);
                        this._drawDRRect(c, g, m)
                    };
                    a.Canvas.prototype.drawGlyphs = function(c, g, m, r, y, C) {
                        if (!(2 * c.length <=
                                g.length)) throw "Not enough positions for the array of gyphs";
                        a.Od(this.Md);
                        const I = x(c, "HEAPU16"),
                            L = x(g, "HEAPF32");
                        this._drawGlyphs(c.length, I, L, m, r, y, C);
                        w(L, g);
                        w(I, c)
                    };
                    a.Canvas.prototype.drawImage = function(c, g, m, r) {
                        a.Od(this.Md);
                        this._drawImage(c, g, m, r || null)
                    };
                    a.Canvas.prototype.drawImageCubic = function(c, g, m, r, y, C) {
                        a.Od(this.Md);
                        this._drawImageCubic(c, g, m, r, y, C || null)
                    };
                    a.Canvas.prototype.drawImageOptions = function(c, g, m, r, y, C) {
                        a.Od(this.Md);
                        this._drawImageOptions(c, g, m, r, y, C || null)
                    };
                    a.Canvas.prototype.drawImageNine =
                        function(c, g, m, r, y) {
                            a.Od(this.Md);
                            g = x(g, "HEAP32", cc);
                            m = T(m);
                            this._drawImageNine(c, g, m, r, y || null)
                        };
                    a.Canvas.prototype.drawImageRect = function(c, g, m, r, y) {
                        a.Od(this.Md);
                        T(g, ea);
                        T(m, Ta);
                        this._drawImageRect(c, ea, Ta, r, !!y)
                    };
                    a.Canvas.prototype.drawImageRectCubic = function(c, g, m, r, y, C) {
                        a.Od(this.Md);
                        T(g, ea);
                        T(m, Ta);
                        this._drawImageRectCubic(c, ea, Ta, r, y, C || null)
                    };
                    a.Canvas.prototype.drawImageRectOptions = function(c, g, m, r, y, C) {
                        a.Od(this.Md);
                        T(g, ea);
                        T(m, Ta);
                        this._drawImageRectOptions(c, ea, Ta, r, y, C || null)
                    };
                    a.Canvas.prototype.drawLine =
                        function(c, g, m, r, y) {
                            a.Od(this.Md);
                            this._drawLine(c, g, m, r, y)
                        };
                    a.Canvas.prototype.drawOval = function(c, g) {
                        a.Od(this.Md);
                        c = T(c);
                        this._drawOval(c, g)
                    };
                    a.Canvas.prototype.drawPaint = function(c) {
                        a.Od(this.Md);
                        this._drawPaint(c)
                    };
                    a.Canvas.prototype.drawParagraph = function(c, g, m) {
                        a.Od(this.Md);
                        this._drawParagraph(c, g, m)
                    };
                    a.Canvas.prototype.drawPatch = function(c, g, m, r, y) {
                        if (24 > c.length) throw "Need 12 cubic points";
                        if (g && 4 > g.length) throw "Need 4 colors";
                        if (m && 8 > m.length) throw "Need 4 shader coordinates";
                        a.Od(this.Md);
                        const C = x(c, "HEAPF32"),
                            I = g ? x(l(g), "HEAPU32") : S,
                            L = m ? x(m, "HEAPF32") : S;
                        r || (r = a.BlendMode.Modulate);
                        this._drawPatch(C, I, L, r, y);
                        w(L, m);
                        w(I, g);
                        w(C, c)
                    };
                    a.Canvas.prototype.drawPath = function(c, g) {
                        a.Od(this.Md);
                        this._drawPath(c, g)
                    };
                    a.Canvas.prototype.drawPicture = function(c) {
                        a.Od(this.Md);
                        this._drawPicture(c)
                    };
                    a.Canvas.prototype.drawPoints = function(c, g, m) {
                        a.Od(this.Md);
                        var r = x(g, "HEAPF32");
                        this._drawPoints(c, r, g.length / 2, m);
                        w(r, g)
                    };
                    a.Canvas.prototype.drawRRect = function(c, g) {
                        a.Od(this.Md);
                        c = oa(c);
                        this._drawRRect(c,
                            g)
                    };
                    a.Canvas.prototype.drawRect = function(c, g) {
                        a.Od(this.Md);
                        c = T(c);
                        this._drawRect(c, g)
                    };
                    a.Canvas.prototype.drawRect4f = function(c, g, m, r, y) {
                        a.Od(this.Md);
                        this._drawRect4f(c, g, m, r, y)
                    };
                    a.Canvas.prototype.drawShadow = function(c, g, m, r, y, C, I) {
                        a.Od(this.Md);
                        var L = x(y, "HEAPF32"),
                            O = x(C, "HEAPF32");
                        g = x(g, "HEAPF32", ac);
                        m = x(m, "HEAPF32", bc);
                        this._drawShadow(c, g, m, r, L, O, I);
                        w(L, y);
                        w(O, C)
                    };
                    a.getShadowLocalBounds = function(c, g, m, r, y, C, I) {
                        c = J(c);
                        m = x(m, "HEAPF32", ac);
                        r = x(r, "HEAPF32", bc);
                        if (!this._getShadowLocalBounds(c,
                                g, m, r, y, C, ea)) return null;
                        g = pa.toTypedArray();
                        return I ? (I.set(g), I) : g.slice()
                    };
                    a.Canvas.prototype.drawTextBlob = function(c, g, m, r) {
                        a.Od(this.Md);
                        this._drawTextBlob(c, g, m, r)
                    };
                    a.Canvas.prototype.drawVertices = function(c, g, m) {
                        a.Od(this.Md);
                        this._drawVertices(c, g, m)
                    };
                    a.Canvas.prototype.getLocalToDevice = function() { this._getLocalToDevice(Za); for (var c = Za, g = Array(16), m = 0; 16 > m; m++) g[m] = a.HEAPF32[c / 4 + m]; return g };
                    a.Canvas.prototype.getTotalMatrix = function() {
                        this._getTotalMatrix(Oa);
                        for (var c = Array(9), g = 0; 9 > g; g++) c[g] =
                            a.HEAPF32[Oa / 4 + g];
                        return c
                    };
                    a.Canvas.prototype.makeSurface = function(c) {
                        c = this._makeSurface(c);
                        c.Md = this.Md;
                        return c
                    };
                    a.Canvas.prototype.readPixels = function(c, g, m, r, y) { a.Od(this.Md); return e(this, c, g, m, r, y) };
                    a.Canvas.prototype.saveLayer = function(c, g, m, r) { g = T(g); return this._saveLayer(c || null, g, m || null, r || 0) };
                    a.Canvas.prototype.writePixels = function(c, g, m, r, y, C, I, L) {
                        if (c.byteLength % (g * m)) throw "pixels length must be a multiple of the srcWidth * srcHeight";
                        a.Od(this.Md);
                        var O = c.byteLength / (g * m);
                        C = C || a.AlphaType.Unpremul;
                        I = I || a.ColorType.RGBA_8888;
                        L = L || a.ColorSpace.SRGB;
                        var V = O * g;
                        O = x(c, "HEAPU8");
                        g = this._writePixels({ width: g, height: m, colorType: I, alphaType: C, colorSpace: L }, O, V, r, y);
                        w(O, c);
                        return g
                    };
                    a.ColorFilter.MakeBlend = function(c, g) { c = A(c); return a.ColorFilter._MakeBlend(c, g) };
                    a.ColorFilter.MakeMatrix = function(c) {
                        if (!c || 20 !== c.length) throw "invalid color matrix";
                        var g = x(c, "HEAPF32"),
                            m = a.ColorFilter._makeMatrix(g);
                        w(g, c);
                        return m
                    };
                    a.ContourMeasure.prototype.getPosTan = function(c, g) {
                        this._getPosTan(c, ea);
                        c = pa.toTypedArray();
                        return g ? (g.set(c), g) : c.slice()
                    };
                    a.ImageFilter.MakeMatrixTransform = function(c, g, m) { c = J(c); if ("B" in g && "C" in g) return a.ImageFilter._MakeMatrixTransformCubic(c, g.Ag, g.Bg, m); const r = g.filter; let y = a.MipmapMode.None; "mipmap" in g && (y = g.mipmap); return a.ImageFilter._MakeMatrixTransformOptions(c, r, y, m) };
                    a.Paint.prototype.getColor = function() { this._getColor(fb); return U(fb) };
                    a.Paint.prototype.setColor = function(c, g) {
                        g = g || null;
                        c = A(c);
                        this._setColor(c, g)
                    };
                    a.Paint.prototype.setColorComponents = function(c, g, m,
                        r, y) {
                        y = y || null;
                        c = M(c, g, m, r);
                        this._setColor(c, y)
                    };
                    a.Path.prototype.getPoint = function(c, g) {
                        this._getPoint(c, ea);
                        c = pa.toTypedArray();
                        return g ? (g[0] = c[0], g[1] = c[1], g) : c.slice(0, 2)
                    };
                    a.PictureRecorder.prototype.beginRecording = function(c) { c = T(c); return this._beginRecording(c) };
                    a.Surface.prototype.getCanvas = function() {
                        var c = this._getCanvas();
                        c.Md = this.Md;
                        return c
                    };
                    a.Surface.prototype.makeImageSnapshot = function(c) {
                        a.Od(this.Md);
                        c = x(c, "HEAP32", cc);
                        return this._makeImageSnapshot(c)
                    };
                    a.Surface.prototype.makeSurface =
                        function(c) {
                            a.Od(this.Md);
                            c = this._makeSurface(c);
                            c.Md = this.Md;
                            return c
                        };
                    a.Surface.prototype.requestAnimationFrame = function(c, g) {
                        this.Ge || (this.Ge = this.getCanvas());
                        requestAnimationFrame(function() {
                            a.Od(this.Md);
                            c(this.Ge);
                            this.flush(g)
                        }.bind(this))
                    };
                    a.Surface.prototype.drawOnce = function(c, g) {
                        this.Ge || (this.Ge = this.getCanvas());
                        requestAnimationFrame(function() {
                            a.Od(this.Md);
                            c(this.Ge);
                            this.flush(g);
                            this.dispose()
                        }.bind(this))
                    };
                    a.PathEffect.MakeDash = function(c, g) {
                        g || (g = 0);
                        if (!c.length || 1 === c.length %
                            2) throw "Intervals array must have even length";
                        var m = x(c, "HEAPF32");
                        g = a.PathEffect._MakeDash(m, c.length, g);
                        w(m, c);
                        return g
                    };
                    a.PathEffect.MakeLine2D = function(c, g) { g = J(g); return a.PathEffect._MakeLine2D(c, g) };
                    a.PathEffect.MakePath2D = function(c, g) { c = J(c); return a.PathEffect._MakePath2D(c, g) };
                    a.Shader.MakeColor = function(c, g) {
                        g = g || null;
                        c = A(c);
                        return a.Shader._MakeColor(c, g)
                    };
                    a.Shader.Blend = a.Shader.MakeBlend;
                    a.Shader.Color = a.Shader.MakeColor;
                    a.Shader.MakeLinearGradient = function(c, g, m, r, y, C, I, L) {
                        L = L || null;
                        var O = K(m),
                            V = x(r, "HEAPF32");
                        I = I || 0;
                        C = J(C);
                        var t = pa.toTypedArray();
                        t.set(c);
                        t.set(g, 2);
                        c = a.Shader._MakeLinearGradient(ea, O.de, O.Le, V, O.count, y, I, C, L);
                        w(O.de, m);
                        r && w(V, r);
                        return c
                    };
                    a.Shader.MakeRadialGradient = function(c, g, m, r, y, C, I, L) {
                        L = L || null;
                        var O = K(m),
                            V = x(r, "HEAPF32");
                        I = I || 0;
                        C = J(C);
                        c = a.Shader._MakeRadialGradient(c[0], c[1], g, O.de, O.Le, V, O.count, y, I, C, L);
                        w(O.de, m);
                        r && w(V, r);
                        return c
                    };
                    a.Shader.MakeSweepGradient = function(c, g, m, r, y, C, I, L, O, V) {
                        V = V || null;
                        var t = K(m),
                            F = x(r, "HEAPF32");
                        I = I || 0;
                        L = L || 0;
                        O = O ||
                            360;
                        C = J(C);
                        c = a.Shader._MakeSweepGradient(c, g, t.de, t.Le, F, t.count, y, L, O, I, C, V);
                        w(t.de, m);
                        r && w(F, r);
                        return c
                    };
                    a.Shader.MakeTwoPointConicalGradient = function(c, g, m, r, y, C, I, L, O, V) {
                        V = V || null;
                        var t = K(y),
                            F = x(C, "HEAPF32");
                        O = O || 0;
                        L = J(L);
                        var R = pa.toTypedArray();
                        R.set(c);
                        R.set(m, 2);
                        c = a.Shader._MakeTwoPointConicalGradient(ea, g, r, t.de, t.Le, F, t.count, I, O, L, V);
                        w(t.de, y);
                        C && w(F, C);
                        return c
                    };
                    a.Vertices.prototype.bounds = function(c) { this._bounds(ea); var g = pa.toTypedArray(); return c ? (c.set(g), c) : g.slice() };
                    a.Sd && a.Sd.forEach(function(c) { c() })
                };
                a.computeTonalColors = function(e) {
                    var c = x(e.ambient, "HEAPF32"),
                        g = x(e.spot, "HEAPF32");
                    this._computeTonalColors(c, g);
                    var m = { ambient: U(c), spot: U(g) };
                    w(c, e.ambient);
                    w(g, e.spot);
                    return m
                };
                a.LTRBRect = function(e, c, g, m) { return Float32Array.of(e, c, g, m) };
                a.XYWHRect = function(e, c, g, m) { return Float32Array.of(e, c, e + g, c + m) };
                a.LTRBiRect = function(e, c, g, m) { return Int32Array.of(e, c, g, m) };
                a.XYWHiRect = function(e, c, g, m) { return Int32Array.of(e, c, e + g, c + m) };
                a.RRectXY = function(e, c, g) {
                    return Float32Array.of(e[0], e[1], e[2], e[3],
                        c, g, c, g, c, g, c, g)
                };
                a.MakeAnimatedImageFromEncoded = function(e) {
                    e = new Uint8Array(e);
                    var c = a._malloc(e.byteLength);
                    a.HEAPU8.set(e, c);
                    return (e = a._decodeAnimatedImage(c, e.byteLength)) ? e : null
                };
                a.MakeImageFromEncoded = function(e) {
                    e = new Uint8Array(e);
                    var c = a._malloc(e.byteLength);
                    a.HEAPU8.set(e, c);
                    return (e = a._decodeImage(c, e.byteLength)) ? e : null
                };
                var ib = null;
                a.MakeImageFromCanvasImageSource = function(e) {
                    var c = e.width,
                        g = e.height;
                    ib || (ib = document.createElement("canvas"));
                    ib.width = c;
                    ib.height = g;
                    var m = ib.getContext("2d", { Jg: !0 });
                    m.drawImage(e, 0, 0);
                    e = m.getImageData(0, 0, c, g);
                    return a.MakeImage({ width: c, height: g, alphaType: a.AlphaType.Unpremul, colorType: a.ColorType.RGBA_8888, colorSpace: a.ColorSpace.SRGB }, e.data, 4 * c)
                };
                a.MakeImage = function(e, c, g) {
                    var m = a._malloc(c.length);
                    a.HEAPU8.set(c, m);
                    return a._MakeImage(e, m, c.length, g)
                };
                a.MakeVertices = function(e, c, g, m, r, y) {
                    var C = r && r.length || 0,
                        I = 0;
                    g && g.length && (I |= 1);
                    m && m.length && (I |= 2);
                    void 0 === y || y || (I |= 4);
                    e = new a._VerticesBuilder(e, c.length / 2, C, I);
                    x(c, "HEAPF32", e.positions());
                    e.texCoords() && x(g, "HEAPF32", e.texCoords());
                    e.colors() && x(l(m), "HEAPU32", e.colors());
                    e.indices() && x(r, "HEAPU16", e.indices());
                    return e.detach()
                };
                a.Matrix = {};
                a.Matrix.identity = function() { return d(3) };
                a.Matrix.invert = function(e) {
                    var c = e[0] * e[4] * e[8] + e[1] * e[5] * e[6] + e[2] * e[3] * e[7] - e[2] * e[4] * e[6] - e[1] * e[3] * e[8] - e[0] * e[5] * e[7];
                    return c ? [(e[4] * e[8] - e[5] * e[7]) / c, (e[2] * e[7] - e[1] * e[8]) / c, (e[1] * e[5] - e[2] * e[4]) / c, (e[5] * e[6] - e[3] * e[8]) / c, (e[0] * e[8] - e[2] * e[6]) / c, (e[2] * e[3] - e[0] * e[5]) / c, (e[3] * e[7] - e[4] * e[6]) / c, (e[1] *
                        e[6] - e[0] * e[7]) / c, (e[0] * e[4] - e[1] * e[3]) / c] : null
                };
                a.Matrix.mapPoints = function(e, c) {
                    for (var g = 0; g < c.length; g += 2) {
                        var m = c[g],
                            r = c[g + 1],
                            y = e[6] * m + e[7] * r + e[8],
                            C = e[3] * m + e[4] * r + e[5];
                        c[g] = (e[0] * m + e[1] * r + e[2]) / y;
                        c[g + 1] = C / y
                    }
                    return c
                };
                a.Matrix.multiply = function() { return hb(3, arguments) };
                a.Matrix.rotated = function(e, c, g) {
                    c = c || 0;
                    g = g || 0;
                    var m = Math.sin(e);
                    e = Math.cos(e);
                    return [e, -m, wa(m, g, 1 - e, c), m, e, wa(-m, c, 1 - e, g), 0, 0, 1]
                };
                a.Matrix.scaled = function(e, c, g, m) {
                    g = g || 0;
                    m = m || 0;
                    var r = b([e, c], d(3), 3, 0, 1);
                    return b([g - e * g, m - c *
                        m
                    ], r, 3, 2, 0)
                };
                a.Matrix.skewed = function(e, c, g, m) {
                    g = g || 0;
                    m = m || 0;
                    var r = b([e, c], d(3), 3, 1, -1);
                    return b([-e * g, -c * m], r, 3, 2, 0)
                };
                a.Matrix.translated = function(e, c) { return b(arguments, d(3), 3, 2, 0) };
                a.Vector = {};
                a.Vector.dot = function(e, c) { return e.map(function(g, m) { return g * c[m] }).reduce(function(g, m) { return g + m }) };
                a.Vector.lengthSquared = function(e) { return a.Vector.dot(e, e) };
                a.Vector.length = function(e) { return Math.sqrt(a.Vector.lengthSquared(e)) };
                a.Vector.mulScalar = function(e, c) {
                    return e.map(function(g) {
                        return g *
                            c
                    })
                };
                a.Vector.add = function(e, c) { return e.map(function(g, m) { return g + c[m] }) };
                a.Vector.sub = function(e, c) { return e.map(function(g, m) { return g - c[m] }) };
                a.Vector.dist = function(e, c) { return a.Vector.length(a.Vector.sub(e, c)) };
                a.Vector.normalize = function(e) { return a.Vector.mulScalar(e, 1 / a.Vector.length(e)) };
                a.Vector.cross = function(e, c) { return [e[1] * c[2] - e[2] * c[1], e[2] * c[0] - e[0] * c[2], e[0] * c[1] - e[1] * c[0]] };
                a.M44 = {};
                a.M44.identity = function() { return d(4) };
                a.M44.translated = function(e) { return b(e, d(4), 4, 3, 0) };
                a.M44.scaled =
                    function(e) { return b(e, d(4), 4, 0, 1) };
                a.M44.rotated = function(e, c) { return a.M44.rotatedUnitSinCos(a.Vector.normalize(e), Math.sin(c), Math.cos(c)) };
                a.M44.rotatedUnitSinCos = function(e, c, g) {
                    var m = e[0],
                        r = e[1];
                    e = e[2];
                    var y = 1 - g;
                    return [y * m * m + g, y * m * r - c * e, y * m * e + c * r, 0, y * m * r + c * e, y * r * r + g, y * r * e - c * m, 0, y * m * e - c * r, y * r * e + c * m, y * e * e + g, 0, 0, 0, 0, 1]
                };
                a.M44.lookat = function(e, c, g) {
                    c = a.Vector.normalize(a.Vector.sub(c, e));
                    g = a.Vector.normalize(g);
                    g = a.Vector.normalize(a.Vector.cross(c, g));
                    var m = a.M44.identity();
                    b(g, m, 4, 0, 0);
                    b(a.Vector.cross(g,
                        c), m, 4, 1, 0);
                    b(a.Vector.mulScalar(c, -1), m, 4, 2, 0);
                    b(e, m, 4, 3, 0);
                    e = a.M44.invert(m);
                    return null === e ? a.M44.identity() : e
                };
                a.M44.perspective = function(e, c, g) {
                    var m = 1 / (c - e);
                    g /= 2;
                    g = Math.cos(g) / Math.sin(g);
                    return [g, 0, 0, 0, 0, g, 0, 0, 0, 0, (c + e) * m, 2 * c * e * m, 0, 0, -1, 1]
                };
                a.M44.rc = function(e, c, g) { return e[4 * c + g] };
                a.M44.multiply = function() { return hb(4, arguments) };
                a.M44.invert = function(e) {
                    var c = e[0],
                        g = e[4],
                        m = e[8],
                        r = e[12],
                        y = e[1],
                        C = e[5],
                        I = e[9],
                        L = e[13],
                        O = e[2],
                        V = e[6],
                        t = e[10],
                        F = e[14],
                        R = e[3],
                        aa = e[7],
                        ja = e[11];
                    e = e[15];
                    var qa = c * C - g *
                        y,
                        xa = c * I - m * y,
                        Da = c * L - r * y,
                        fa = g * I - m * C,
                        G = g * L - r * C,
                        k = m * L - r * I,
                        p = O * aa - V * R,
                        z = O * ja - t * R,
                        B = O * e - F * R,
                        D = V * ja - t * aa,
                        E = V * e - F * aa,
                        N = t * e - F * ja,
                        ba = qa * N - xa * E + Da * D + fa * B - G * z + k * p,
                        ca = 1 / ba;
                    if (0 === ba || Infinity === ca) return null;
                    qa *= ca;
                    xa *= ca;
                    Da *= ca;
                    fa *= ca;
                    G *= ca;
                    k *= ca;
                    p *= ca;
                    z *= ca;
                    B *= ca;
                    D *= ca;
                    E *= ca;
                    N *= ca;
                    c = [C * N - I * E + L * D, I * B - y * N - L * z, y * E - C * B + L * p, C * z - y * D - I * p, m * E - g * N - r * D, c * N - m * B + r * z, g * B - c * E - r * p, c * D - g * z + m * p, aa * k - ja * G + e * fa, ja * Da - R * k - e * xa, R * G - aa * Da + e * qa, aa * xa - R * fa - ja * qa, t * G - V * k - F * fa, O * k - t * Da + F * xa, V * Da - O * G - F * qa, O * fa - V * xa + t * qa];
                    return c.every(function(Ia) {
                        return !isNaN(Ia) &&
                            Infinity !== Ia && -Infinity !== Ia
                    }) ? c : null
                };
                a.M44.transpose = function(e) { return [e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]] };
                a.M44.mustInvert = function(e) { e = a.M44.invert(e); if (null === e) throw "Matrix not invertible"; return e };
                a.M44.setupCamera = function(e, c, g) {
                    var m = a.M44.lookat(g.eye, g.coa, g.up);
                    g = a.M44.perspective(g.near, g.far, g.angle);
                    c = [(e[2] - e[0]) / 2, (e[3] - e[1]) / 2, c];
                    e = a.M44.multiply(a.M44.translated([(e[0] + e[2]) / 2, (e[1] + e[3]) / 2, 0]), a.M44.scaled(c));
                    return a.M44.multiply(e,
                        g, m, a.M44.mustInvert(e))
                };
                a.ColorMatrix = {};
                a.ColorMatrix.identity = function() {
                    var e = new Float32Array(20);
                    e[0] = 1;
                    e[6] = 1;
                    e[12] = 1;
                    e[18] = 1;
                    return e
                };
                a.ColorMatrix.scaled = function(e, c, g, m) {
                    var r = new Float32Array(20);
                    r[0] = e;
                    r[6] = c;
                    r[12] = g;
                    r[18] = m;
                    return r
                };
                var Gd = [
                    [6, 7, 11, 12],
                    [0, 10, 2, 12],
                    [0, 1, 5, 6]
                ];
                a.ColorMatrix.rotated = function(e, c, g) {
                    var m = a.ColorMatrix.identity();
                    e = Gd[e];
                    m[e[0]] = g;
                    m[e[1]] = c;
                    m[e[2]] = -c;
                    m[e[3]] = g;
                    return m
                };
                a.ColorMatrix.postTranslate = function(e, c, g, m, r) {
                    e[4] += c;
                    e[9] += g;
                    e[14] += m;
                    e[19] +=
                        r;
                    return e
                };
                a.ColorMatrix.concat = function(e, c) {
                    for (var g = new Float32Array(20), m = 0, r = 0; 20 > r; r += 5) {
                        for (var y = 0; 4 > y; y++) g[m++] = e[r] * c[y] + e[r + 1] * c[y + 5] + e[r + 2] * c[y + 10] + e[r + 3] * c[y + 15];
                        g[m++] = e[r] * c[4] + e[r + 1] * c[9] + e[r + 2] * c[14] + e[r + 3] * c[19] + e[r + 4]
                    }
                    return g
                };
                (function(e) {
                    e.Sd = e.Sd || [];
                    e.Sd.push(function() {
                        function c(t) {
                            if (!t || !t.length) return [];
                            for (var F = [], R = 0; R < t.length; R += 5) {
                                var aa = e.LTRBRect(t[R], t[R + 1], t[R + 2], t[R + 3]);
                                aa.direction = 0 === t[R + 4] ? e.TextDirection.RTL : e.TextDirection.LTR;
                                F.push(aa)
                            }
                            e._free(t.byteOffset);
                            return F
                        }

                        function g(t) {
                            t = t || {};
                            void 0 === t.weight && (t.weight = e.FontWeight.Normal);
                            t.width = t.width || e.FontWidth.Normal;
                            t.slant = t.slant || e.FontSlant.Upright;
                            return t
                        }

                        function m(t) {
                            if (!t || !t.length) return S;
                            for (var F = [], R = 0; R < t.length; R++) {
                                var aa = r(t[R]);
                                F.push(aa)
                            }
                            return x(F, "HEAPU32")
                        }

                        function r(t) {
                            if (I[t]) return I[t];
                            var F = sa(t) + 1,
                                R = e._malloc(F);
                            ta(t, H, R, F);
                            return I[t] = R
                        }

                        function y(t) {
                            t._colorPtr = A(t.color);
                            t._foregroundColorPtr = S;
                            t._backgroundColorPtr = S;
                            t._decorationColorPtr = S;
                            t.foregroundColor &&
                                (t._foregroundColorPtr = A(t.foregroundColor, L));
                            t.backgroundColor && (t._backgroundColorPtr = A(t.backgroundColor, O));
                            t.decorationColor && (t._decorationColorPtr = A(t.decorationColor, V));
                            Array.isArray(t.fontFamilies) && t.fontFamilies.length ? (t._fontFamiliesPtr = m(t.fontFamilies), t._fontFamiliesLen = t.fontFamilies.length) : (t._fontFamiliesPtr = S, t._fontFamiliesLen = 0);
                            if (t.locale) {
                                var F = t.locale;
                                t._localePtr = r(F);
                                t._localeLen = sa(F) + 1
                            } else t._localePtr = S, t._localeLen = 0;
                            if (Array.isArray(t.shadows) && t.shadows.length) {
                                F =
                                    t.shadows;
                                var R = F.map(function(fa) { return fa.color || e.BLACK }),
                                    aa = F.map(function(fa) { return fa.blurRadius || 0 });
                                t._shadowLen = F.length;
                                for (var ja = e._malloc(8 * F.length), qa = ja / 4, xa = 0; xa < F.length; xa++) {
                                    var Da = F[xa].offset || [0, 0];
                                    e.HEAPF32[qa] = Da[0];
                                    e.HEAPF32[qa + 1] = Da[1];
                                    qa += 2
                                }
                                t._shadowColorsPtr = K(R).de;
                                t._shadowOffsetsPtr = ja;
                                t._shadowBlurRadiiPtr = x(aa, "HEAPF32")
                            } else t._shadowLen = 0, t._shadowColorsPtr = S, t._shadowOffsetsPtr = S, t._shadowBlurRadiiPtr = S;
                            Array.isArray(t.fontFeatures) && t.fontFeatures.length ? (F =
                                t.fontFeatures, R = F.map(function(fa) { return fa.name }), aa = F.map(function(fa) { return fa.value }), t._fontFeatureLen = F.length, t._fontFeatureNamesPtr = m(R), t._fontFeatureValuesPtr = x(aa, "HEAPU32")) : (t._fontFeatureLen = 0, t._fontFeatureNamesPtr = S, t._fontFeatureValuesPtr = S)
                        }

                        function C(t) {
                            e._free(t._fontFamiliesPtr);
                            e._free(t._shadowColorsPtr);
                            e._free(t._shadowOffsetsPtr);
                            e._free(t._shadowBlurRadiiPtr);
                            e._free(t._fontFeatureNamesPtr);
                            e._free(t._fontFeatureValuesPtr)
                        }
                        e.Paragraph.prototype.getRectsForRange = function(t,
                            F, R, aa) { t = this._getRectsForRange(t, F, R, aa); return c(t) };
                        e.Paragraph.prototype.getRectsForPlaceholders = function() { var t = this._getRectsForPlaceholders(); return c(t) };
                        e.TypefaceFontProvider.prototype.registerFont = function(t, F) {
                            t = e.Typeface.MakeFreeTypeFaceFromData(t);
                            if (!t) return null;
                            F = r(F);
                            this._registerFont(t, F)
                        };
                        e.ParagraphStyle = function(t) {
                            t.disableHinting = t.disableHinting || !1;
                            if (t.ellipsis) {
                                var F = t.ellipsis;
                                t._ellipsisPtr = r(F);
                                t._ellipsisLen = sa(F) + 1
                            } else t._ellipsisPtr = S, t._ellipsisLen = 0;
                            t.heightMultiplier =
                                t.heightMultiplier || 0;
                            t.maxLines = t.maxLines || 0;
                            F = (F = t.strutStyle) || {};
                            F.strutEnabled = F.strutEnabled || !1;
                            F.strutEnabled && Array.isArray(F.fontFamilies) && F.fontFamilies.length ? (F._fontFamiliesPtr = m(F.fontFamilies), F._fontFamiliesLen = F.fontFamilies.length) : (F._fontFamiliesPtr = S, F._fontFamiliesLen = 0);
                            F.fontStyle = g(F.fontStyle);
                            F.fontSize = F.fontSize || 0;
                            F.heightMultiplier = F.heightMultiplier || 0;
                            F.halfLeading = F.halfLeading || !1;
                            F.leading = F.leading || 0;
                            F.forceStrutHeight = F.forceStrutHeight || !1;
                            t.strutStyle = F;
                            t.textAlign = t.textAlign || e.TextAlign.Start;
                            t.textDirection = t.textDirection || e.TextDirection.LTR;
                            t.textHeightBehavior = t.textHeightBehavior || e.TextHeightBehavior.All;
                            t.textStyle = e.TextStyle(t.textStyle);
                            return t
                        };
                        e.TextStyle = function(t) {
                            t.color || (t.color = e.BLACK);
                            t.decoration = t.decoration || 0;
                            t.decorationThickness = t.decorationThickness || 0;
                            t.decorationStyle = t.decorationStyle || e.DecorationStyle.Solid;
                            t.textBaseline = t.textBaseline || e.TextBaseline.Alphabetic;
                            t.fontSize = t.fontSize || 0;
                            t.letterSpacing = t.letterSpacing ||
                                0;
                            t.wordSpacing = t.wordSpacing || 0;
                            t.heightMultiplier = t.heightMultiplier || 0;
                            t.halfLeading = t.halfLeading || !1;
                            t.fontStyle = g(t.fontStyle);
                            return t
                        };
                        var I = {},
                            L = e._malloc(16),
                            O = e._malloc(16),
                            V = e._malloc(16);
                        e.ParagraphBuilder.Make = function(t, F) {
                            y(t.textStyle);
                            F = e.ParagraphBuilder._Make(t, F);
                            C(t.textStyle);
                            return F
                        };
                        e.ParagraphBuilder.MakeFromFontProvider = function(t, F) {
                            y(t.textStyle);
                            F = e.ParagraphBuilder._MakeFromFontProvider(t, F);
                            C(t.textStyle);
                            return F
                        };
                        e.ParagraphBuilder.ShapeText = function(t, F, R) {
                            let aa =
                                0;
                            for (const ja of F) aa += ja.length;
                            if (aa !== t.length) throw "Accumulated block lengths must equal text.length";
                            return e.ParagraphBuilder._ShapeText(t, F, R)
                        };
                        e.ParagraphBuilder.prototype.pushStyle = function(t) {
                            y(t);
                            this._pushStyle(t);
                            C(t)
                        };
                        e.ParagraphBuilder.prototype.pushPaintStyle = function(t, F, R) {
                            y(t);
                            this._pushPaintStyle(t, F, R);
                            C(t)
                        };
                        e.ParagraphBuilder.prototype.addPlaceholder = function(t, F, R, aa, ja) {
                            R = R || e.PlaceholderAlignment.Baseline;
                            aa = aa || e.TextBaseline.Alphabetic;
                            this._addPlaceholder(t || 0, F || 0, R,
                                aa, ja || 0)
                        }
                    })
                })(u);
                a.MakeManagedAnimation = function(e, c, g, m, r) {
                    if (!a._MakeManagedAnimation) throw "Not compiled with MakeManagedAnimation";
                    g || (g = "");
                    if (!c) return a._MakeManagedAnimation(e, 0, S, S, S, g, m, r);
                    for (var y = [], C = [], I = [], L = Object.keys(c || {}), O = 0; O < L.length; O++) {
                        var V = L[O],
                            t = new Uint8Array(c[V]),
                            F = a._malloc(t.byteLength);
                        a.HEAPU8.set(t, F);
                        C.push(F);
                        I.push(t.byteLength);
                        t = sa(V) + 1;
                        F = a._malloc(t);
                        ta(V, H, F, t);
                        y.push(F)
                    }
                    c = x(y, "HEAPU32");
                    C = x(C, "HEAPU32");
                    I = x(I, "HEAPU32");
                    e = a._MakeManagedAnimation(e, L.length,
                        c, C, I, g, m, r);
                    a._free(c);
                    a._free(C);
                    a._free(I);
                    return e
                };
                (function(e) {
                    e.Sd = e.Sd || [];
                    e.Sd.push(function() {
                        e.Animation.prototype.render = function(c, g) {
                            T(g, ea);
                            this._render(c, ea)
                        };
                        e.Animation.prototype.size = function(c) { this._size(ea); var g = pa.toTypedArray(); return c ? (c[0] = g[0], c[1] = g[1], c) : g.slice(0, 2) };
                        e.ManagedAnimation && (e.ManagedAnimation.prototype.render = function(c, g) {
                            T(g, ea);
                            this._render(c, ea)
                        }, e.ManagedAnimation.prototype.seek = function(c, g) {
                            this._seek(c, ea);
                            c = pa.toTypedArray();
                            return g ? (g.set(c),
                                g) : c.slice()
                        }, e.ManagedAnimation.prototype.seekFrame = function(c, g) {
                            this._seekFrame(c, ea);
                            c = pa.toTypedArray();
                            return g ? (g.set(c), g) : c.slice()
                        }, e.ManagedAnimation.prototype.setColor = function(c, g) { g = A(g); return this._setColor(c, g) }, e.ManagedAnimation.prototype.size = function(c) { this._size(ea); var g = pa.toTypedArray(); return c ? (c[0] = g[0], c[1] = g[1], c) : g.slice(0, 2) })
                    })
                })(u);
                a.MakeParticles = function(e, c) {
                    if (!a._MakeParticles) throw "Not compiled with MakeParticles";
                    if (!c) return a._MakeParticles(e, 0, S, S, S);
                    for (var g = [], m = [], r = [], y = Object.keys(c || {}), C = 0; C < y.length; C++) {
                        var I = y[C],
                            L = new Uint8Array(c[I]),
                            O = a._malloc(L.byteLength);
                        a.HEAPU8.set(L, O);
                        m.push(O);
                        r.push(L.byteLength);
                        L = sa(I) + 1;
                        O = a._malloc(L);
                        ta(I, H, O, L);
                        g.push(O)
                    }
                    c = x(g, "HEAPU32");
                    m = x(m, "HEAPU32");
                    r = x(r, "HEAPU32");
                    e = a._MakeParticles(e, y.length, c, m, r);
                    a._free(c);
                    a._free(m);
                    a._free(r);
                    return e
                };
                a.Sd = a.Sd || [];
                a.Sd.push(function() {
                    a.ParticleEffect.prototype.uniforms = function() {
                        var e = this._uniformPtr(),
                            c = this.getUniformFloatCount();
                        return !e || 0 >= c ? new Float32Array :
                            new Float32Array(a.HEAPU8.buffer, e, c)
                    };
                    a.ParticleEffect.prototype.setPosition = function(e) { this._setPosition(e[0], e[1]) }
                });
                a.Sd = a.Sd || [];
                a.Sd.push(function() {
                    a.Path.prototype.op = function(e, c) { return this._op(e, c) ? this : null };
                    a.Path.prototype.simplify = function() { return this._simplify() ? this : null }
                });
                a.Sd = a.Sd || [];
                a.Sd.push(function() {
                    a.Canvas.prototype.drawText = function(e, c, g, m, r) {
                        var y = sa(e),
                            C = a._malloc(y + 1);
                        ta(e, H, C, y + 1);
                        this._drawSimpleText(C, y, c, g, r, m);
                        a._free(C)
                    };
                    a.Font.prototype.getGlyphBounds =
                        function(e, c, g) {
                            var m = x(e, "HEAPU16"),
                                r = a._malloc(16 * e.length);
                            this._getGlyphWidthBounds(m, e.length, S, r, c || null);
                            c = new Float32Array(a.HEAPU8.buffer, r, 4 * e.length);
                            w(m, e);
                            if (g) return g.set(c), a._free(r), g;
                            e = Float32Array.from(c);
                            a._free(r);
                            return e
                        };
                    a.Font.prototype.getGlyphIDs = function(e, c, g) {
                        c || (c = e.length);
                        var m = sa(e) + 1,
                            r = a._malloc(m);
                        ta(e, H, r, m);
                        e = a._malloc(2 * c);
                        c = this._getGlyphIDs(r, m - 1, c, e);
                        a._free(r);
                        if (0 > c) return a._free(e), null;
                        r = new Uint16Array(a.HEAPU8.buffer, e, c);
                        if (g) return g.set(r), a._free(e),
                            g;
                        g = Uint16Array.from(r);
                        a._free(e);
                        return g
                    };
                    a.Font.prototype.getGlyphIntercepts = function(e, c, g, m) {
                        var r = x(e, "HEAPU16"),
                            y = x(c, "HEAPF32");
                        return this._getGlyphIntercepts(r, e.length, !(e && e._ck), y, c.length, !(c && c._ck), g, m)
                    };
                    a.Font.prototype.getGlyphWidths = function(e, c, g) {
                        var m = x(e, "HEAPU16"),
                            r = a._malloc(4 * e.length);
                        this._getGlyphWidthBounds(m, e.length, r, S, c || null);
                        c = new Float32Array(a.HEAPU8.buffer, r, e.length);
                        w(m, e);
                        if (g) return g.set(c), a._free(r), g;
                        e = Float32Array.from(c);
                        a._free(r);
                        return e
                    };
                    a.FontMgr.FromData =
                        function() {
                            if (!arguments.length) return null;
                            var e = arguments;
                            1 === e.length && Array.isArray(e[0]) && (e = arguments[0]);
                            if (!e.length) return null;
                            for (var c = [], g = [], m = 0; m < e.length; m++) {
                                var r = new Uint8Array(e[m]),
                                    y = x(r, "HEAPU8");
                                c.push(y);
                                g.push(r.byteLength)
                            }
                            c = x(c, "HEAPU32");
                            g = x(g, "HEAPU32");
                            e = a.FontMgr._fromData(c, g, e.length);
                            a._free(c);
                            a._free(g);
                            return e
                        };
                    a.Typeface.MakeFreeTypeFaceFromData = function(e) {
                        e = new Uint8Array(e);
                        var c = x(e, "HEAPU8");
                        return (e = a.Typeface._MakeFreeTypeFaceFromData(c, e.byteLength)) ?
                            e : null
                    };
                    a.Typeface.prototype.getGlyphIDs = function(e, c, g) {
                        c || (c = e.length);
                        var m = sa(e) + 1,
                            r = a._malloc(m);
                        ta(e, H, r, m);
                        e = a._malloc(2 * c);
                        c = this._getGlyphIDs(r, m - 1, c, e);
                        a._free(r);
                        if (0 > c) return a._free(e), null;
                        r = new Uint16Array(a.HEAPU8.buffer, e, c);
                        if (g) return g.set(r), a._free(e), g;
                        g = Uint16Array.from(r);
                        a._free(e);
                        return g
                    };
                    a.TextBlob.MakeOnPath = function(e, c, g, m) {
                        if (e && e.length && c && c.countPoints()) {
                            if (1 === c.countPoints()) return this.MakeFromText(e, g);
                            m || (m = 0);
                            var r = g.getGlyphIDs(e);
                            r = g.getGlyphWidths(r);
                            var y = [];
                            c = new a.ContourMeasureIter(c, !1, 1);
                            for (var C = c.next(), I = new Float32Array(4), L = 0; L < e.length && C; L++) {
                                var O = r[L];
                                m += O / 2;
                                if (m > C.length()) {
                                    C.delete();
                                    C = c.next();
                                    if (!C) { e = e.substring(0, L); break }
                                    m = O / 2
                                }
                                C.getPosTan(m, I);
                                var V = I[2],
                                    t = I[3];
                                y.push(V, t, I[0] - O / 2 * V, I[1] - O / 2 * t);
                                m += O / 2
                            }
                            e = this.MakeFromRSXform(e, y, g);
                            C && C.delete();
                            c.delete();
                            return e
                        }
                    };
                    a.TextBlob.MakeFromRSXform = function(e, c, g) {
                        var m = sa(e) + 1,
                            r = a._malloc(m);
                        ta(e, H, r, m);
                        e = x(c, "HEAPF32");
                        g = a.TextBlob._MakeFromRSXform(r, m - 1, e, g);
                        a._free(r);
                        return g ?
                            g : null
                    };
                    a.TextBlob.MakeFromRSXformGlyphs = function(e, c, g) {
                        var m = x(e, "HEAPU16");
                        c = x(c, "HEAPF32");
                        g = a.TextBlob._MakeFromRSXformGlyphs(m, 2 * e.length, c, g);
                        w(m, e);
                        return g ? g : null
                    };
                    a.TextBlob.MakeFromGlyphs = function(e, c) {
                        var g = x(e, "HEAPU16");
                        c = a.TextBlob._MakeFromGlyphs(g, 2 * e.length, c);
                        w(g, e);
                        return c ? c : null
                    };
                    a.TextBlob.MakeFromText = function(e, c) {
                        var g = sa(e) + 1,
                            m = a._malloc(g);
                        ta(e, H, m, g);
                        e = a.TextBlob._MakeFromText(m, g - 1, c);
                        a._free(m);
                        return e ? e : null
                    };
                    a.MallocGlyphIDs = function(e) {
                        return a.Malloc(Uint16Array,
                            e)
                    }
                });
                a.Sd = a.Sd || [];
                a.Sd.push(function() {
                    a.MakePicture = function(e) {
                        e = new Uint8Array(e);
                        var c = a._malloc(e.byteLength);
                        a.HEAPU8.set(e, c);
                        return (e = a._MakePicture(c, e.byteLength)) ? e : null
                    }
                });
                a.Sd = a.Sd || [];
                a.Sd.push(function() {
                    a.RuntimeEffect.Make = function(e, c) { return a.RuntimeEffect._Make(e, { onError: c || function(g) { console.log("RuntimeEffect error", g) } }) };
                    a.RuntimeEffect.prototype.makeShader = function(e, c, g) {
                        var m = x(e, "HEAPF32");
                        g = J(g);
                        return this._makeShader(m, 4 * e.length, !!c, g)
                    };
                    a.RuntimeEffect.prototype.makeShaderWithChildren =
                        function(e, c, g, m) {
                            var r = x(e, "HEAPF32");
                            m = J(m);
                            for (var y = [], C = 0; C < g.length; C++) y.push(g[C].Ld.Qd);
                            g = x(y, "HEAPU32");
                            return this._makeShaderWithChildren(r, 4 * e.length, !!c, g, y.length, m)
                        }
                });
                (function() {
                    function e(G) {
                        for (var k = 0; k < G.length; k++)
                            if (void 0 !== G[k] && !Number.isFinite(G[k])) return !1;
                        return !0
                    }

                    function c(G) {
                        var k = a.getColorComponents(G);
                        G = k[0];
                        var p = k[1],
                            z = k[2];
                        k = k[3];
                        if (1 === k) return G = G.toString(16).toLowerCase(), p = p.toString(16).toLowerCase(), z = z.toString(16).toLowerCase(), G = 1 === G.length ? "0" + G :
                            G, p = 1 === p.length ? "0" + p : p, z = 1 === z.length ? "0" + z : z, "#" + G + p + z;
                        k = 0 === k || 1 === k ? k : k.toFixed(8);
                        return "rgba(" + G + ", " + p + ", " + z + ", " + k + ")"
                    }

                    function g(G) { return a.parseColorString(G, xa) }

                    function m(G) {
                        G = Da.exec(G);
                        if (!G) return null;
                        var k = parseFloat(G[4]),
                            p = 16;
                        switch (G[5]) {
                            case "em":
                            case "rem":
                                p = 16 * k;
                                break;
                            case "pt":
                                p = 4 * k / 3;
                                break;
                            case "px":
                                p = k;
                                break;
                            case "pc":
                                p = 16 * k;
                                break;
                            case "in":
                                p = 96 * k;
                                break;
                            case "cm":
                                p = 96 * k / 2.54;
                                break;
                            case "mm":
                                p = 96 / 25.4 * k;
                                break;
                            case "q":
                                p = 96 / 25.4 / 4 * k;
                                break;
                            case "%":
                                p = 16 / 75 * k
                        }
                        return {
                            style: G[1],
                            variant: G[2],
                            weight: G[3],
                            sizePx: p,
                            family: G[6].trim()
                        }
                    }

                    function r(G) {
                        this.Nd = G;
                        this.Rd = new a.Paint;
                        this.Rd.setAntiAlias(!0);
                        this.Rd.setStrokeMiter(10);
                        this.Rd.setStrokeCap(a.StrokeCap.Butt);
                        this.Rd.setStrokeJoin(a.StrokeJoin.Miter);
                        this.Re = "10px monospace";
                        this.ne = new a.Font(null, 10);
                        this.ne.setSubpixel(!0);
                        this.ce = this.he = a.BLACK;
                        this.ue = 0;
                        this.Ie = a.TRANSPARENT;
                        this.we = this.ve = 0;
                        this.Je = this.ke = 1;
                        this.He = 0;
                        this.te = [];
                        this.Pd = a.BlendMode.SrcOver;
                        this.Rd.setStrokeWidth(this.Je);
                        this.Rd.setBlendMode(this.Pd);
                        this.Ud = new a.Path;
                        this.Vd = a.Matrix.identity();
                        this.lf = [];
                        this.Ae = [];
                        this.me = function() {
                            this.Ud.delete();
                            this.Rd.delete();
                            this.ne.delete();
                            this.Ae.forEach(function(k) { k.me() })
                        };
                        Object.defineProperty(this, "currentTransform", { enumerable: !0, get: function() { return { a: this.Vd[0], c: this.Vd[1], e: this.Vd[2], b: this.Vd[3], d: this.Vd[4], f: this.Vd[5] } }, set: function(k) { k.a && this.setTransform(k.a, k.b, k.c, k.d, k.e, k.f) } });
                        Object.defineProperty(this, "fillStyle", {
                            enumerable: !0,
                            get: function() {
                                return f(this.ce) ? c(this.ce) :
                                    this.ce
                            },
                            set: function(k) { "string" === typeof k ? this.ce = g(k) : k.se && (this.ce = k) }
                        });
                        Object.defineProperty(this, "font", {
                            enumerable: !0,
                            get: function() { return this.Re },
                            set: function(k) {
                                var p = m(k),
                                    z = p.family;
                                p.typeface = fa[z] ? fa[z][(p.style || "normal") + "|" + (p.variant || "normal") + "|" + (p.weight || "normal")] || fa[z]["*"] : null;
                                p && (this.ne.setSize(p.sizePx), this.ne.setTypeface(p.typeface), this.Re = k)
                            }
                        });
                        Object.defineProperty(this, "globalAlpha", {
                            enumerable: !0,
                            get: function() { return this.ke },
                            set: function(k) {
                                !isFinite(k) ||
                                    0 > k || 1 < k || (this.ke = k)
                            }
                        });
                        Object.defineProperty(this, "globalCompositeOperation", {
                            enumerable: !0,
                            get: function() {
                                switch (this.Pd) {
                                    case a.BlendMode.SrcOver:
                                        return "source-over";
                                    case a.BlendMode.DstOver:
                                        return "destination-over";
                                    case a.BlendMode.Src:
                                        return "copy";
                                    case a.BlendMode.Dst:
                                        return "destination";
                                    case a.BlendMode.Clear:
                                        return "clear";
                                    case a.BlendMode.SrcIn:
                                        return "source-in";
                                    case a.BlendMode.DstIn:
                                        return "destination-in";
                                    case a.BlendMode.SrcOut:
                                        return "source-out";
                                    case a.BlendMode.DstOut:
                                        return "destination-out";
                                    case a.BlendMode.SrcATop:
                                        return "source-atop";
                                    case a.BlendMode.DstATop:
                                        return "destination-atop";
                                    case a.BlendMode.Xor:
                                        return "xor";
                                    case a.BlendMode.Plus:
                                        return "lighter";
                                    case a.BlendMode.Multiply:
                                        return "multiply";
                                    case a.BlendMode.Screen:
                                        return "screen";
                                    case a.BlendMode.Overlay:
                                        return "overlay";
                                    case a.BlendMode.Darken:
                                        return "darken";
                                    case a.BlendMode.Lighten:
                                        return "lighten";
                                    case a.BlendMode.ColorDodge:
                                        return "color-dodge";
                                    case a.BlendMode.ColorBurn:
                                        return "color-burn";
                                    case a.BlendMode.HardLight:
                                        return "hard-light";
                                    case a.BlendMode.SoftLight:
                                        return "soft-light";
                                    case a.BlendMode.Difference:
                                        return "difference";
                                    case a.BlendMode.Exclusion:
                                        return "exclusion";
                                    case a.BlendMode.Hue:
                                        return "hue";
                                    case a.BlendMode.Saturation:
                                        return "saturation";
                                    case a.BlendMode.Color:
                                        return "color";
                                    case a.BlendMode.Luminosity:
                                        return "luminosity"
                                }
                            },
                            set: function(k) {
                                switch (k) {
                                    case "source-over":
                                        this.Pd = a.BlendMode.SrcOver;
                                        break;
                                    case "destination-over":
                                        this.Pd = a.BlendMode.DstOver;
                                        break;
                                    case "copy":
                                        this.Pd = a.BlendMode.Src;
                                        break;
                                    case "destination":
                                        this.Pd =
                                            a.BlendMode.Dst;
                                        break;
                                    case "clear":
                                        this.Pd = a.BlendMode.Clear;
                                        break;
                                    case "source-in":
                                        this.Pd = a.BlendMode.SrcIn;
                                        break;
                                    case "destination-in":
                                        this.Pd = a.BlendMode.DstIn;
                                        break;
                                    case "source-out":
                                        this.Pd = a.BlendMode.SrcOut;
                                        break;
                                    case "destination-out":
                                        this.Pd = a.BlendMode.DstOut;
                                        break;
                                    case "source-atop":
                                        this.Pd = a.BlendMode.SrcATop;
                                        break;
                                    case "destination-atop":
                                        this.Pd = a.BlendMode.DstATop;
                                        break;
                                    case "xor":
                                        this.Pd = a.BlendMode.Xor;
                                        break;
                                    case "lighter":
                                        this.Pd = a.BlendMode.Plus;
                                        break;
                                    case "plus-lighter":
                                        this.Pd =
                                            a.BlendMode.Plus;
                                        break;
                                    case "plus-darker":
                                        throw "plus-darker is not supported";
                                    case "multiply":
                                        this.Pd = a.BlendMode.Multiply;
                                        break;
                                    case "screen":
                                        this.Pd = a.BlendMode.Screen;
                                        break;
                                    case "overlay":
                                        this.Pd = a.BlendMode.Overlay;
                                        break;
                                    case "darken":
                                        this.Pd = a.BlendMode.Darken;
                                        break;
                                    case "lighten":
                                        this.Pd = a.BlendMode.Lighten;
                                        break;
                                    case "color-dodge":
                                        this.Pd = a.BlendMode.ColorDodge;
                                        break;
                                    case "color-burn":
                                        this.Pd = a.BlendMode.ColorBurn;
                                        break;
                                    case "hard-light":
                                        this.Pd = a.BlendMode.HardLight;
                                        break;
                                    case "soft-light":
                                        this.Pd =
                                            a.BlendMode.SoftLight;
                                        break;
                                    case "difference":
                                        this.Pd = a.BlendMode.Difference;
                                        break;
                                    case "exclusion":
                                        this.Pd = a.BlendMode.Exclusion;
                                        break;
                                    case "hue":
                                        this.Pd = a.BlendMode.Hue;
                                        break;
                                    case "saturation":
                                        this.Pd = a.BlendMode.Saturation;
                                        break;
                                    case "color":
                                        this.Pd = a.BlendMode.Color;
                                        break;
                                    case "luminosity":
                                        this.Pd = a.BlendMode.Luminosity;
                                        break;
                                    default:
                                        return
                                }
                                this.Rd.setBlendMode(this.Pd)
                            }
                        });
                        Object.defineProperty(this, "imageSmoothingEnabled", { enumerable: !0, get: function() { return !0 }, set: function() {} });
                        Object.defineProperty(this,
                            "imageSmoothingQuality", { enumerable: !0, get: function() { return "high" }, set: function() {} });
                        Object.defineProperty(this, "lineCap", {
                            enumerable: !0,
                            get: function() {
                                switch (this.Rd.getStrokeCap()) {
                                    case a.StrokeCap.Butt:
                                        return "butt";
                                    case a.StrokeCap.Round:
                                        return "round";
                                    case a.StrokeCap.Square:
                                        return "square"
                                }
                            },
                            set: function(k) {
                                switch (k) {
                                    case "butt":
                                        this.Rd.setStrokeCap(a.StrokeCap.Butt);
                                        break;
                                    case "round":
                                        this.Rd.setStrokeCap(a.StrokeCap.Round);
                                        break;
                                    case "square":
                                        this.Rd.setStrokeCap(a.StrokeCap.Square)
                                }
                            }
                        });
                        Object.defineProperty(this,
                            "lineDashOffset", { enumerable: !0, get: function() { return this.He }, set: function(k) { isFinite(k) && (this.He = k) } });
                        Object.defineProperty(this, "lineJoin", {
                            enumerable: !0,
                            get: function() {
                                switch (this.Rd.getStrokeJoin()) {
                                    case a.StrokeJoin.Miter:
                                        return "miter";
                                    case a.StrokeJoin.Round:
                                        return "round";
                                    case a.StrokeJoin.Bevel:
                                        return "bevel"
                                }
                            },
                            set: function(k) {
                                switch (k) {
                                    case "miter":
                                        this.Rd.setStrokeJoin(a.StrokeJoin.Miter);
                                        break;
                                    case "round":
                                        this.Rd.setStrokeJoin(a.StrokeJoin.Round);
                                        break;
                                    case "bevel":
                                        this.Rd.setStrokeJoin(a.StrokeJoin.Bevel)
                                }
                            }
                        });
                        Object.defineProperty(this, "lineWidth", { enumerable: !0, get: function() { return this.Rd.getStrokeWidth() }, set: function(k) { 0 >= k || !k || (this.Je = k, this.Rd.setStrokeWidth(k)) } });
                        Object.defineProperty(this, "miterLimit", { enumerable: !0, get: function() { return this.Rd.getStrokeMiter() }, set: function(k) { 0 >= k || !k || this.Rd.setStrokeMiter(k) } });
                        Object.defineProperty(this, "shadowBlur", { enumerable: !0, get: function() { return this.ue }, set: function(k) { 0 > k || !isFinite(k) || (this.ue = k) } });
                        Object.defineProperty(this, "shadowColor", { enumerable: !0, get: function() { return c(this.Ie) }, set: function(k) { this.Ie = g(k) } });
                        Object.defineProperty(this, "shadowOffsetX", { enumerable: !0, get: function() { return this.ve }, set: function(k) { isFinite(k) && (this.ve = k) } });
                        Object.defineProperty(this, "shadowOffsetY", { enumerable: !0, get: function() { return this.we }, set: function(k) { isFinite(k) && (this.we = k) } });
                        Object.defineProperty(this, "strokeStyle", {
                            enumerable: !0,
                            get: function() { return c(this.he) },
                            set: function(k) {
                                "string" === typeof k ? this.he = g(k) : k.se && (this.he =
                                    k)
                            }
                        });
                        this.arc = function(k, p, z, B, D, E) { F(this.Ud, k, p, z, z, 0, B, D, E) };
                        this.arcTo = function(k, p, z, B, D) { O(this.Ud, k, p, z, B, D) };
                        this.beginPath = function() {
                            this.Ud.delete();
                            this.Ud = new a.Path
                        };
                        this.bezierCurveTo = function(k, p, z, B, D, E) {
                            var N = this.Ud;
                            e([k, p, z, B, D, E]) && (N.isEmpty() && N.moveTo(k, p), N.cubicTo(k, p, z, B, D, E))
                        };
                        this.clearRect = function(k, p, z, B) {
                            this.Rd.setStyle(a.PaintStyle.Fill);
                            this.Rd.setBlendMode(a.BlendMode.Clear);
                            this.Nd.drawRect(a.XYWHRect(k, p, z, B), this.Rd);
                            this.Rd.setBlendMode(this.Pd)
                        };
                        this.clip =
                            function(k, p) {
                                "string" === typeof k ? (p = k, k = this.Ud) : k && k.af && (k = k.Wd);
                                k || (k = this.Ud);
                                k = k.copy();
                                p && "evenodd" === p.toLowerCase() ? k.setFillType(a.FillType.EvenOdd) : k.setFillType(a.FillType.Winding);
                                this.Nd.clipPath(k, a.ClipOp.Intersect, !0);
                                k.delete()
                            };
                        this.closePath = function() { V(this.Ud) };
                        this.createImageData = function() {
                            if (1 === arguments.length) { var k = arguments[0]; return new I(new Uint8ClampedArray(4 * k.width * k.height), k.width, k.height) }
                            if (2 === arguments.length) {
                                k = arguments[0];
                                var p = arguments[1];
                                return new I(new Uint8ClampedArray(4 *
                                    k * p), k, p)
                            }
                            throw "createImageData expects 1 or 2 arguments, got " + arguments.length;
                        };
                        this.createLinearGradient = function(k, p, z, B) {
                            if (e(arguments)) {
                                var D = new L(k, p, z, B);
                                this.Ae.push(D);
                                return D
                            }
                        };
                        this.createPattern = function(k, p) {
                            k = new ja(k, p);
                            this.Ae.push(k);
                            return k
                        };
                        this.createRadialGradient = function(k, p, z, B, D, E) {
                            if (e(arguments)) {
                                var N = new qa(k, p, z, B, D, E);
                                this.Ae.push(N);
                                return N
                            }
                        };
                        this.drawImage = function(k) {
                            k instanceof C && (k = k.tf());
                            var p = this.Qe();
                            if (3 === arguments.length || 5 === arguments.length) var z =
                                a.XYWHRect(arguments[1], arguments[2], arguments[3] || k.width(), arguments[4] || k.height()),
                                B = a.XYWHRect(0, 0, k.width(), k.height());
                            else if (9 === arguments.length) z = a.XYWHRect(arguments[5], arguments[6], arguments[7], arguments[8]), B = a.XYWHRect(arguments[1], arguments[2], arguments[3], arguments[4]);
                            else throw "invalid number of args for drawImage, need 3, 5, or 9; got " + arguments.length;
                            this.Nd.drawImageRect(k, B, z, p, !1);
                            p.dispose()
                        };
                        this.ellipse = function(k, p, z, B, D, E, N, ba) { F(this.Ud, k, p, z, B, D, E, N, ba) };
                        this.Qe = function() {
                            var k =
                                this.Rd.copy();
                            k.setStyle(a.PaintStyle.Fill);
                            if (f(this.ce)) {
                                var p = a.multiplyByAlpha(this.ce, this.ke);
                                k.setColor(p)
                            } else p = this.ce.se(this.Vd), k.setColor(a.Color(0, 0, 0, this.ke)), k.setShader(p);
                            k.dispose = function() { this.delete() };
                            return k
                        };
                        this.fill = function(k, p) {
                            "string" === typeof k ? (p = k, k = this.Ud) : k && k.af && (k = k.Wd);
                            if ("evenodd" === p) this.Ud.setFillType(a.FillType.EvenOdd);
                            else {
                                if ("nonzero" !== p && p) throw "invalid fill rule";
                                this.Ud.setFillType(a.FillType.Winding)
                            }
                            k || (k = this.Ud);
                            p = this.Qe();
                            var z = this.xe(p);
                            z && (this.Nd.save(), this.qe(), this.Nd.drawPath(k, z), this.Nd.restore(), z.dispose());
                            this.Nd.drawPath(k, p);
                            p.dispose()
                        };
                        this.fillRect = function(k, p, z, B) {
                            var D = this.Qe(),
                                E = this.xe(D);
                            E && (this.Nd.save(), this.qe(), this.Nd.drawRect(a.XYWHRect(k, p, z, B), E), this.Nd.restore(), E.dispose());
                            this.Nd.drawRect(a.XYWHRect(k, p, z, B), D);
                            D.dispose()
                        };
                        this.fillText = function(k, p, z) {
                            var B = this.Qe();
                            k = a.TextBlob.MakeFromText(k, this.ne);
                            var D = this.xe(B);
                            D && (this.Nd.save(), this.qe(), this.Nd.drawTextBlob(k, p, z, D), this.Nd.restore(),
                                D.dispose());
                            this.Nd.drawTextBlob(k, p, z, B);
                            k.delete();
                            B.dispose()
                        };
                        this.getImageData = function(k, p, z, B) { return (k = this.Nd.readPixels(k, p, { width: z, height: B, colorType: a.ColorType.RGBA_8888, alphaType: a.AlphaType.Unpremul, colorSpace: a.ColorSpace.SRGB })) ? new I(new Uint8ClampedArray(k.buffer), z, B) : null };
                        this.getLineDash = function() { return this.te.slice() };
                        this.mf = function(k) {
                            var p = a.Matrix.invert(this.Vd);
                            a.Matrix.mapPoints(p, k);
                            return k
                        };
                        this.isPointInPath = function(k, p, z) {
                            var B = arguments;
                            if (3 === B.length) var D =
                                this.Ud;
                            else if (4 === B.length) D = B[0], k = B[1], p = B[2], z = B[3];
                            else throw "invalid arg count, need 3 or 4, got " + B.length;
                            if (!isFinite(k) || !isFinite(p)) return !1;
                            z = z || "nonzero";
                            if ("nonzero" !== z && "evenodd" !== z) return !1;
                            B = this.mf([k, p]);
                            k = B[0];
                            p = B[1];
                            D.setFillType("nonzero" === z ? a.FillType.Winding : a.FillType.EvenOdd);
                            return D.contains(k, p)
                        };
                        this.isPointInStroke = function(k, p) {
                            var z = arguments;
                            if (2 === z.length) var B = this.Ud;
                            else if (3 === z.length) B = z[0], k = z[1], p = z[2];
                            else throw "invalid arg count, need 2 or 3, got " +
                                z.length;
                            if (!isFinite(k) || !isFinite(p)) return !1;
                            z = this.mf([k, p]);
                            k = z[0];
                            p = z[1];
                            B = B.copy();
                            B.setFillType(a.FillType.Winding);
                            B.stroke({ width: this.lineWidth, miter_limit: this.miterLimit, cap: this.Rd.getStrokeCap(), join: this.Rd.getStrokeJoin(), precision: .3 });
                            z = B.contains(k, p);
                            B.delete();
                            return z
                        };
                        this.lineTo = function(k, p) { R(this.Ud, k, p) };
                        this.measureText = function(k) {
                            k = this.ne.getGlyphIDs(k);
                            k = this.ne.getGlyphWidths(k);
                            let p = 0;
                            for (const z of k) p += z;
                            return { width: p }
                        };
                        this.moveTo = function(k, p) {
                            var z = this.Ud;
                            e([k, p]) && z.moveTo(k, p)
                        };
                        this.putImageData = function(k, p, z, B, D, E, N) {
                            if (e([p, z, B, D, E, N]))
                                if (void 0 === B) this.Nd.writePixels(k.data, k.width, k.height, p, z);
                                else if (B = B || 0, D = D || 0, E = E || k.width, N = N || k.height, 0 > E && (B += E, E = Math.abs(E)), 0 > N && (D += N, N = Math.abs(N)), 0 > B && (E += B, B = 0), 0 > D && (N += D, D = 0), !(0 >= E || 0 >= N)) {
                                k = a.MakeImage({ width: k.width, height: k.height, alphaType: a.AlphaType.Unpremul, colorType: a.ColorType.RGBA_8888, colorSpace: a.ColorSpace.SRGB }, k.data, 4 * k.width);
                                var ba = a.XYWHRect(B, D, E, N);
                                p = a.XYWHRect(p + B, z + D,
                                    E, N);
                                z = a.Matrix.invert(this.Vd);
                                this.Nd.save();
                                this.Nd.concat(z);
                                this.Nd.drawImageRect(k, ba, p, null, !1);
                                this.Nd.restore();
                                k.delete()
                            }
                        };
                        this.quadraticCurveTo = function(k, p, z, B) {
                            var D = this.Ud;
                            e([k, p, z, B]) && (D.isEmpty() && D.moveTo(k, p), D.quadTo(k, p, z, B))
                        };
                        this.rect = function(k, p, z, B) {
                            var D = this.Ud;
                            k = a.XYWHRect(k, p, z, B);
                            e(k) && D.addRect(k)
                        };
                        this.resetTransform = function() {
                            this.Ud.transform(this.Vd);
                            var k = a.Matrix.invert(this.Vd);
                            this.Nd.concat(k);
                            this.Vd = this.Nd.getTotalMatrix()
                        };
                        this.restore = function() {
                            var k =
                                this.lf.pop();
                            if (k) {
                                var p = a.Matrix.multiply(this.Vd, a.Matrix.invert(k.Ff));
                                this.Ud.transform(p);
                                this.Rd.delete();
                                this.Rd = k.dg;
                                this.te = k.$f;
                                this.Je = k.vg;
                                this.he = k.ug;
                                this.ce = k.fs;
                                this.ve = k.sg;
                                this.we = k.tg;
                                this.ue = k.hg;
                                this.Ie = k.rg;
                                this.ke = k.Nf;
                                this.Pd = k.Of;
                                this.He = k.ag;
                                this.Re = k.Mf;
                                this.Nd.restore();
                                this.Vd = this.Nd.getTotalMatrix()
                            }
                        };
                        this.rotate = function(k) {
                            if (isFinite(k)) {
                                var p = a.Matrix.rotated(-k);
                                this.Ud.transform(p);
                                this.Nd.rotate(k / Math.PI * 180, 0, 0);
                                this.Vd = this.Nd.getTotalMatrix()
                            }
                        };
                        this.save =
                            function() {
                                if (this.ce.re) {
                                    var k = this.ce.re();
                                    this.Ae.push(k)
                                } else k = this.ce;
                                if (this.he.re) {
                                    var p = this.he.re();
                                    this.Ae.push(p)
                                } else p = this.he;
                                this.lf.push({ Ff: this.Vd.slice(), $f: this.te.slice(), vg: this.Je, ug: p, fs: k, sg: this.ve, tg: this.we, hg: this.ue, rg: this.Ie, Nf: this.ke, ag: this.He, Of: this.Pd, dg: this.Rd.copy(), Mf: this.Re });
                                this.Nd.save()
                            };
                        this.scale = function(k, p) {
                            if (e(arguments)) {
                                var z = a.Matrix.scaled(1 / k, 1 / p);
                                this.Ud.transform(z);
                                this.Nd.scale(k, p);
                                this.Vd = this.Nd.getTotalMatrix()
                            }
                        };
                        this.setLineDash =
                            function(k) {
                                for (var p = 0; p < k.length; p++)
                                    if (!isFinite(k[p]) || 0 > k[p]) return;
                                1 === k.length % 2 && Array.prototype.push.apply(k, k);
                                this.te = k
                            };
                        this.setTransform = function(k, p, z, B, D, E) { e(arguments) && (this.resetTransform(), this.transform(k, p, z, B, D, E)) };
                        this.qe = function() {
                            var k = a.Matrix.invert(this.Vd);
                            this.Nd.concat(k);
                            this.Nd.concat(a.Matrix.translated(this.ve, this.we));
                            this.Nd.concat(this.Vd)
                        };
                        this.xe = function(k) {
                            var p = a.multiplyByAlpha(this.Ie, this.ke);
                            if (!a.getColorComponents(p)[3] || !(this.ue || this.we || this.ve)) return null;
                            k = k.copy();
                            k.setColor(p);
                            var z = a.MaskFilter.MakeBlur(a.BlurStyle.Normal, this.ue / 2, !1);
                            k.setMaskFilter(z);
                            k.dispose = function() {
                                z.delete();
                                this.delete()
                            };
                            return k
                        };
                        this.cf = function() {
                            var k = this.Rd.copy();
                            k.setStyle(a.PaintStyle.Stroke);
                            if (f(this.he)) {
                                var p = a.multiplyByAlpha(this.he, this.ke);
                                k.setColor(p)
                            } else p = this.he.se(this.Vd), k.setColor(a.Color(0, 0, 0, this.ke)), k.setShader(p);
                            k.setStrokeWidth(this.Je);
                            if (this.te.length) {
                                var z = a.PathEffect.MakeDash(this.te, this.He);
                                k.setPathEffect(z)
                            }
                            k.dispose = function() {
                                z &&
                                    z.delete();
                                this.delete()
                            };
                            return k
                        };
                        this.stroke = function(k) {
                            k = k ? k.Wd : this.Ud;
                            var p = this.cf(),
                                z = this.xe(p);
                            z && (this.Nd.save(), this.qe(), this.Nd.drawPath(k, z), this.Nd.restore(), z.dispose());
                            this.Nd.drawPath(k, p);
                            p.dispose()
                        };
                        this.strokeRect = function(k, p, z, B) {
                            var D = this.cf(),
                                E = this.xe(D);
                            E && (this.Nd.save(), this.qe(), this.Nd.drawRect(a.XYWHRect(k, p, z, B), E), this.Nd.restore(), E.dispose());
                            this.Nd.drawRect(a.XYWHRect(k, p, z, B), D);
                            D.dispose()
                        };
                        this.strokeText = function(k, p, z) {
                            var B = this.cf();
                            k = a.TextBlob.MakeFromText(k,
                                this.ne);
                            var D = this.xe(B);
                            D && (this.Nd.save(), this.qe(), this.Nd.drawTextBlob(k, p, z, D), this.Nd.restore(), D.dispose());
                            this.Nd.drawTextBlob(k, p, z, B);
                            k.delete();
                            B.dispose()
                        };
                        this.translate = function(k, p) {
                            if (e(arguments)) {
                                var z = a.Matrix.translated(-k, -p);
                                this.Ud.transform(z);
                                this.Nd.translate(k, p);
                                this.Vd = this.Nd.getTotalMatrix()
                            }
                        };
                        this.transform = function(k, p, z, B, D, E) {
                            k = [k, z, D, p, B, E, 0, 0, 1];
                            p = a.Matrix.invert(k);
                            this.Ud.transform(p);
                            this.Nd.concat(k);
                            this.Vd = this.Nd.getTotalMatrix()
                        };
                        this.addHitRegion = function() {};
                        this.clearHitRegions = function() {};
                        this.drawFocusIfNeeded = function() {};
                        this.removeHitRegion = function() {};
                        this.scrollPathIntoView = function() {};
                        Object.defineProperty(this, "canvas", { value: null, writable: !1 })
                    }

                    function y(G) {
                        this.df = G;
                        this.Md = new r(G.getCanvas());
                        this.Se = [];
                        this.decodeImage = function(k) {
                            k = a.MakeImageFromEncoded(k);
                            if (!k) throw "Invalid input";
                            this.Se.push(k);
                            return new C(k)
                        };
                        this.loadFont = function(k, p) {
                            k = a.Typeface.MakeFreeTypeFaceFromData(k);
                            if (!k) return null;
                            this.Se.push(k);
                            var z = (p.style ||
                                "normal") + "|" + (p.variant || "normal") + "|" + (p.weight || "normal");
                            p = p.family;
                            fa[p] || (fa[p] = { "*": k });
                            fa[p][z] = k
                        };
                        this.makePath2D = function(k) {
                            k = new aa(k);
                            this.Se.push(k.Wd);
                            return k
                        };
                        this.getContext = function(k) { return "2d" === k ? this.Md : null };
                        this.toDataURL = function(k, p) {
                            this.df.flush();
                            var z = this.df.makeImageSnapshot();
                            if (z) {
                                k = k || "image/png";
                                var B = a.ImageFormat.PNG;
                                "image/jpeg" === k && (B = a.ImageFormat.JPEG);
                                if (p = z.encodeToBytes(B, p || .92)) {
                                    z.delete();
                                    k = "data:" + k + ";base64,";
                                    if ("undefined" !== typeof Buffer) p = Buffer.from(p).toString("base64");
                                    else {
                                        z = 0;
                                        B = p.length;
                                        for (var D = "", E; z < B;) E = p.slice(z, Math.min(z + 32768, B)), D += String.fromCharCode.apply(null, E), z += 32768;
                                        p = btoa(D)
                                    }
                                    return k + p
                                }
                            }
                        };
                        this.dispose = function() {
                            this.Md.me();
                            this.Se.forEach(function(k) { k.delete() });
                            this.df.dispose()
                        }
                    }

                    function C(G) {
                        this.width = G.width();
                        this.height = G.height();
                        this.naturalWidth = this.width;
                        this.naturalHeight = this.height;
                        this.tf = function() { return G }
                    }

                    function I(G, k, p) {
                        if (!k || 0 === p) throw "invalid dimensions, width and height must be non-zero";
                        if (G.length % 4) throw "arr must be a multiple of 4";
                        p = p || G.length / (4 * k);
                        Object.defineProperty(this, "data", { value: G, writable: !1 });
                        Object.defineProperty(this, "height", { value: p, writable: !1 });
                        Object.defineProperty(this, "width", { value: k, writable: !1 })
                    }

                    function L(G, k, p, z) {
                        this.Yd = null;
                        this.ee = [];
                        this.ae = [];
                        this.addColorStop = function(B, D) {
                            if (0 > B || 1 < B || !isFinite(B)) throw "offset must be between 0 and 1 inclusively";
                            D = g(D);
                            var E = this.ae.indexOf(B);
                            if (-1 !== E) this.ee[E] = D;
                            else {
                                for (E = 0; E < this.ae.length && !(this.ae[E] > B); E++);
                                this.ae.splice(E, 0, B);
                                this.ee.splice(E,
                                    0, D)
                            }
                        };
                        this.re = function() {
                            var B = new L(G, k, p, z);
                            B.ee = this.ee.slice();
                            B.ae = this.ae.slice();
                            return B
                        };
                        this.me = function() { this.Yd && (this.Yd.delete(), this.Yd = null) };
                        this.se = function(B) {
                            var D = [G, k, p, z];
                            a.Matrix.mapPoints(B, D);
                            B = D[0];
                            var E = D[1],
                                N = D[2];
                            D = D[3];
                            this.me();
                            return this.Yd = a.Shader.MakeLinearGradient([B, E], [N, D], this.ee, this.ae, a.TileMode.Clamp)
                        }
                    }

                    function O(G, k, p, z, B, D) {
                        if (e([k, p, z, B, D])) {
                            if (0 > D) throw "radii cannot be negative";
                            G.isEmpty() && G.moveTo(k, p);
                            G.arcToTangent(k, p, z, B, D)
                        }
                    }

                    function V(G) {
                        if (!G.isEmpty()) {
                            var k =
                                G.getBounds();
                            (k[3] - k[1] || k[2] - k[0]) && G.close()
                        }
                    }

                    function t(G, k, p, z, B, D, E) {
                        E = (E - D) / Math.PI * 180;
                        D = D / Math.PI * 180;
                        k = a.LTRBRect(k - z, p - B, k + z, p + B);
                        1E-5 > Math.abs(Math.abs(E) - 360) ? (p = E / 2, G.arcToOval(k, D, p, !1), G.arcToOval(k, D + p, p, !1)) : G.arcToOval(k, D, E, !1)
                    }

                    function F(G, k, p, z, B, D, E, N, ba) {
                        if (e([k, p, z, B, D, E, N])) {
                            if (0 > z || 0 > B) throw "radii cannot be negative";
                            var ca = 2 * Math.PI,
                                Ia = E % ca;
                            0 > Ia && (Ia += ca);
                            var $a = Ia - E;
                            E = Ia;
                            N += $a;
                            !ba && N - E >= ca ? N = E + ca : ba && E - N >= ca ? N = E - ca : !ba && E > N ? N = E + (ca - (E - N) % ca) : ba && E < N && (N = E - (ca - (N - E) % ca));
                            D ? (ba = a.Matrix.rotated(D, k, p), D = a.Matrix.rotated(-D, k, p), G.transform(D), t(G, k, p, z, B, E, N), G.transform(ba)) : t(G, k, p, z, B, E, N)
                        }
                    }

                    function R(G, k, p) { e([k, p]) && (G.isEmpty() && G.moveTo(k, p), G.lineTo(k, p)) }

                    function aa(G) {
                        this.Wd = null;
                        this.Wd = "string" === typeof G ? a.Path.MakeFromSVGString(G) : G && G.af ? G.Wd.copy() : new a.Path;
                        this.af = function() { return this.Wd };
                        this.addPath = function(k, p) {
                            p || (p = { a: 1, c: 0, e: 0, b: 0, d: 1, f: 0 });
                            this.Wd.addPath(k.Wd, [p.a, p.c, p.e, p.b, p.d, p.f])
                        };
                        this.arc = function(k, p, z, B, D, E) {
                            F(this.Wd, k, p, z,
                                z, 0, B, D, E)
                        };
                        this.arcTo = function(k, p, z, B, D) { O(this.Wd, k, p, z, B, D) };
                        this.bezierCurveTo = function(k, p, z, B, D, E) {
                            var N = this.Wd;
                            e([k, p, z, B, D, E]) && (N.isEmpty() && N.moveTo(k, p), N.cubicTo(k, p, z, B, D, E))
                        };
                        this.closePath = function() { V(this.Wd) };
                        this.ellipse = function(k, p, z, B, D, E, N, ba) { F(this.Wd, k, p, z, B, D, E, N, ba) };
                        this.lineTo = function(k, p) { R(this.Wd, k, p) };
                        this.moveTo = function(k, p) {
                            var z = this.Wd;
                            e([k, p]) && z.moveTo(k, p)
                        };
                        this.quadraticCurveTo = function(k, p, z, B) {
                            var D = this.Wd;
                            e([k, p, z, B]) && (D.isEmpty() && D.moveTo(k, p),
                                D.quadTo(k, p, z, B))
                        };
                        this.rect = function(k, p, z, B) {
                            var D = this.Wd;
                            k = a.XYWHRect(k, p, z, B);
                            e(k) && D.addRect(k)
                        }
                    }

                    function ja(G, k) {
                        this.Yd = null;
                        G instanceof C && (G = G.tf());
                        this.Af = G;
                        this._transform = a.Matrix.identity();
                        "" === k && (k = "repeat");
                        switch (k) {
                            case "repeat-x":
                                this.ye = a.TileMode.Repeat;
                                this.ze = a.TileMode.Decal;
                                break;
                            case "repeat-y":
                                this.ye = a.TileMode.Decal;
                                this.ze = a.TileMode.Repeat;
                                break;
                            case "repeat":
                                this.ze = this.ye = a.TileMode.Repeat;
                                break;
                            case "no-repeat":
                                this.ze = this.ye = a.TileMode.Decal;
                                break;
                            default:
                                throw "invalid repetition mode " +
                                    k;
                        }
                        this.setTransform = function(p) {
                            p = [p.a, p.c, p.e, p.b, p.d, p.f, 0, 0, 1];
                            e(p) && (this._transform = p)
                        };
                        this.re = function() {
                            var p = new ja;
                            p.ye = this.ye;
                            p.ze = this.ze;
                            return p
                        };
                        this.me = function() { this.Yd && (this.Yd.delete(), this.Yd = null) };
                        this.se = function() { this.me(); return this.Yd = this.Af.makeShaderCubic(this.ye, this.ze, 1 / 3, 1 / 3, this._transform) }
                    }

                    function qa(G, k, p, z, B, D) {
                        this.Yd = null;
                        this.ee = [];
                        this.ae = [];
                        this.addColorStop = function(E, N) {
                            if (0 > E || 1 < E || !isFinite(E)) throw "offset must be between 0 and 1 inclusively";
                            N = g(N);
                            var ba = this.ae.indexOf(E);
                            if (-1 !== ba) this.ee[ba] = N;
                            else {
                                for (ba = 0; ba < this.ae.length && !(this.ae[ba] > E); ba++);
                                this.ae.splice(ba, 0, E);
                                this.ee.splice(ba, 0, N)
                            }
                        };
                        this.re = function() {
                            var E = new qa(G, k, p, z, B, D);
                            E.ee = this.ee.slice();
                            E.ae = this.ae.slice();
                            return E
                        };
                        this.me = function() { this.Yd && (this.Yd.delete(), this.Yd = null) };
                        this.se = function(E) {
                            var N = [G, k, z, B];
                            a.Matrix.mapPoints(E, N);
                            var ba = N[0],
                                ca = N[1],
                                Ia = N[2];
                            N = N[3];
                            var $a = (Math.abs(E[0]) + Math.abs(E[4])) / 2;
                            E = p * $a;
                            $a *= D;
                            this.me();
                            return this.Yd = a.Shader.MakeTwoPointConicalGradient([ba,
                                ca
                            ], E, [Ia, N], $a, this.ee, this.ae, a.TileMode.Clamp)
                        }
                    }
                    a._testing = {};
                    var xa = {
                        aliceblue: Float32Array.of(.941, .973, 1, 1),
                        antiquewhite: Float32Array.of(.98, .922, .843, 1),
                        aqua: Float32Array.of(0, 1, 1, 1),
                        aquamarine: Float32Array.of(.498, 1, .831, 1),
                        azure: Float32Array.of(.941, 1, 1, 1),
                        beige: Float32Array.of(.961, .961, .863, 1),
                        bisque: Float32Array.of(1, .894, .769, 1),
                        black: Float32Array.of(0, 0, 0, 1),
                        blanchedalmond: Float32Array.of(1, .922, .804, 1),
                        blue: Float32Array.of(0, 0, 1, 1),
                        blueviolet: Float32Array.of(.541, .169, .886, 1),
                        brown: Float32Array.of(.647,
                            .165, .165, 1),
                        burlywood: Float32Array.of(.871, .722, .529, 1),
                        cadetblue: Float32Array.of(.373, .62, .627, 1),
                        chartreuse: Float32Array.of(.498, 1, 0, 1),
                        chocolate: Float32Array.of(.824, .412, .118, 1),
                        coral: Float32Array.of(1, .498, .314, 1),
                        cornflowerblue: Float32Array.of(.392, .584, .929, 1),
                        cornsilk: Float32Array.of(1, .973, .863, 1),
                        crimson: Float32Array.of(.863, .078, .235, 1),
                        cyan: Float32Array.of(0, 1, 1, 1),
                        darkblue: Float32Array.of(0, 0, .545, 1),
                        darkcyan: Float32Array.of(0, .545, .545, 1),
                        darkgoldenrod: Float32Array.of(.722, .525, .043,
                            1),
                        darkgray: Float32Array.of(.663, .663, .663, 1),
                        darkgreen: Float32Array.of(0, .392, 0, 1),
                        darkgrey: Float32Array.of(.663, .663, .663, 1),
                        darkkhaki: Float32Array.of(.741, .718, .42, 1),
                        darkmagenta: Float32Array.of(.545, 0, .545, 1),
                        darkolivegreen: Float32Array.of(.333, .42, .184, 1),
                        darkorange: Float32Array.of(1, .549, 0, 1),
                        darkorchid: Float32Array.of(.6, .196, .8, 1),
                        darkred: Float32Array.of(.545, 0, 0, 1),
                        darksalmon: Float32Array.of(.914, .588, .478, 1),
                        darkseagreen: Float32Array.of(.561, .737, .561, 1),
                        darkslateblue: Float32Array.of(.282,
                            .239, .545, 1),
                        darkslategray: Float32Array.of(.184, .31, .31, 1),
                        darkslategrey: Float32Array.of(.184, .31, .31, 1),
                        darkturquoise: Float32Array.of(0, .808, .82, 1),
                        darkviolet: Float32Array.of(.58, 0, .827, 1),
                        deeppink: Float32Array.of(1, .078, .576, 1),
                        deepskyblue: Float32Array.of(0, .749, 1, 1),
                        dimgray: Float32Array.of(.412, .412, .412, 1),
                        dimgrey: Float32Array.of(.412, .412, .412, 1),
                        dodgerblue: Float32Array.of(.118, .565, 1, 1),
                        firebrick: Float32Array.of(.698, .133, .133, 1),
                        floralwhite: Float32Array.of(1, .98, .941, 1),
                        forestgreen: Float32Array.of(.133,
                            .545, .133, 1),
                        fuchsia: Float32Array.of(1, 0, 1, 1),
                        gainsboro: Float32Array.of(.863, .863, .863, 1),
                        ghostwhite: Float32Array.of(.973, .973, 1, 1),
                        gold: Float32Array.of(1, .843, 0, 1),
                        goldenrod: Float32Array.of(.855, .647, .125, 1),
                        gray: Float32Array.of(.502, .502, .502, 1),
                        green: Float32Array.of(0, .502, 0, 1),
                        greenyellow: Float32Array.of(.678, 1, .184, 1),
                        grey: Float32Array.of(.502, .502, .502, 1),
                        honeydew: Float32Array.of(.941, 1, .941, 1),
                        hotpink: Float32Array.of(1, .412, .706, 1),
                        indianred: Float32Array.of(.804, .361, .361, 1),
                        indigo: Float32Array.of(.294,
                            0, .51, 1),
                        ivory: Float32Array.of(1, 1, .941, 1),
                        khaki: Float32Array.of(.941, .902, .549, 1),
                        lavender: Float32Array.of(.902, .902, .98, 1),
                        lavenderblush: Float32Array.of(1, .941, .961, 1),
                        lawngreen: Float32Array.of(.486, .988, 0, 1),
                        lemonchiffon: Float32Array.of(1, .98, .804, 1),
                        lightblue: Float32Array.of(.678, .847, .902, 1),
                        lightcoral: Float32Array.of(.941, .502, .502, 1),
                        lightcyan: Float32Array.of(.878, 1, 1, 1),
                        lightgoldenrodyellow: Float32Array.of(.98, .98, .824, 1),
                        lightgray: Float32Array.of(.827, .827, .827, 1),
                        lightgreen: Float32Array.of(.565,
                            .933, .565, 1),
                        lightgrey: Float32Array.of(.827, .827, .827, 1),
                        lightpink: Float32Array.of(1, .714, .757, 1),
                        lightsalmon: Float32Array.of(1, .627, .478, 1),
                        lightseagreen: Float32Array.of(.125, .698, .667, 1),
                        lightskyblue: Float32Array.of(.529, .808, .98, 1),
                        lightslategray: Float32Array.of(.467, .533, .6, 1),
                        lightslategrey: Float32Array.of(.467, .533, .6, 1),
                        lightsteelblue: Float32Array.of(.69, .769, .871, 1),
                        lightyellow: Float32Array.of(1, 1, .878, 1),
                        lime: Float32Array.of(0, 1, 0, 1),
                        limegreen: Float32Array.of(.196, .804, .196, 1),
                        linen: Float32Array.of(.98,
                            .941, .902, 1),
                        magenta: Float32Array.of(1, 0, 1, 1),
                        maroon: Float32Array.of(.502, 0, 0, 1),
                        mediumaquamarine: Float32Array.of(.4, .804, .667, 1),
                        mediumblue: Float32Array.of(0, 0, .804, 1),
                        mediumorchid: Float32Array.of(.729, .333, .827, 1),
                        mediumpurple: Float32Array.of(.576, .439, .859, 1),
                        mediumseagreen: Float32Array.of(.235, .702, .443, 1),
                        mediumslateblue: Float32Array.of(.482, .408, .933, 1),
                        mediumspringgreen: Float32Array.of(0, .98, .604, 1),
                        mediumturquoise: Float32Array.of(.282, .82, .8, 1),
                        mediumvioletred: Float32Array.of(.78, .082, .522,
                            1),
                        midnightblue: Float32Array.of(.098, .098, .439, 1),
                        mintcream: Float32Array.of(.961, 1, .98, 1),
                        mistyrose: Float32Array.of(1, .894, .882, 1),
                        moccasin: Float32Array.of(1, .894, .71, 1),
                        navajowhite: Float32Array.of(1, .871, .678, 1),
                        navy: Float32Array.of(0, 0, .502, 1),
                        oldlace: Float32Array.of(.992, .961, .902, 1),
                        olive: Float32Array.of(.502, .502, 0, 1),
                        olivedrab: Float32Array.of(.42, .557, .137, 1),
                        orange: Float32Array.of(1, .647, 0, 1),
                        orangered: Float32Array.of(1, .271, 0, 1),
                        orchid: Float32Array.of(.855, .439, .839, 1),
                        palegoldenrod: Float32Array.of(.933,
                            .91, .667, 1),
                        palegreen: Float32Array.of(.596, .984, .596, 1),
                        paleturquoise: Float32Array.of(.686, .933, .933, 1),
                        palevioletred: Float32Array.of(.859, .439, .576, 1),
                        papayawhip: Float32Array.of(1, .937, .835, 1),
                        peachpuff: Float32Array.of(1, .855, .725, 1),
                        peru: Float32Array.of(.804, .522, .247, 1),
                        pink: Float32Array.of(1, .753, .796, 1),
                        plum: Float32Array.of(.867, .627, .867, 1),
                        powderblue: Float32Array.of(.69, .878, .902, 1),
                        purple: Float32Array.of(.502, 0, .502, 1),
                        rebeccapurple: Float32Array.of(.4, .2, .6, 1),
                        red: Float32Array.of(1, 0, 0, 1),
                        rosybrown: Float32Array.of(.737, .561, .561, 1),
                        royalblue: Float32Array.of(.255, .412, .882, 1),
                        saddlebrown: Float32Array.of(.545, .271, .075, 1),
                        salmon: Float32Array.of(.98, .502, .447, 1),
                        sandybrown: Float32Array.of(.957, .643, .376, 1),
                        seagreen: Float32Array.of(.18, .545, .341, 1),
                        seashell: Float32Array.of(1, .961, .933, 1),
                        sienna: Float32Array.of(.627, .322, .176, 1),
                        silver: Float32Array.of(.753, .753, .753, 1),
                        skyblue: Float32Array.of(.529, .808, .922, 1),
                        slateblue: Float32Array.of(.416, .353, .804, 1),
                        slategray: Float32Array.of(.439, .502,
                            .565, 1),
                        slategrey: Float32Array.of(.439, .502, .565, 1),
                        snow: Float32Array.of(1, .98, .98, 1),
                        springgreen: Float32Array.of(0, 1, .498, 1),
                        steelblue: Float32Array.of(.275, .51, .706, 1),
                        tan: Float32Array.of(.824, .706, .549, 1),
                        teal: Float32Array.of(0, .502, .502, 1),
                        thistle: Float32Array.of(.847, .749, .847, 1),
                        tomato: Float32Array.of(1, .388, .278, 1),
                        transparent: Float32Array.of(0, 0, 0, 0),
                        turquoise: Float32Array.of(.251, .878, .816, 1),
                        violet: Float32Array.of(.933, .51, .933, 1),
                        wheat: Float32Array.of(.961, .871, .702, 1),
                        white: Float32Array.of(1,
                            1, 1, 1),
                        whitesmoke: Float32Array.of(.961, .961, .961, 1),
                        yellow: Float32Array.of(1, 1, 0, 1),
                        yellowgreen: Float32Array.of(.604, .804, .196, 1)
                    };
                    a._testing.parseColor = g;
                    a._testing.colorToString = c;
                    var Da = RegExp("(italic|oblique|normal|)\\s*(small-caps|normal|)\\s*(bold|bolder|lighter|[1-9]00|normal|)\\s*([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)"),
                        fa = { "Noto Mono": { "*": null }, monospace: { "*": null } };
                    a._testing.parseFontString = m;
                    a.MakeCanvas = function(G, k) { return (G = a.MakeSurface(G, k)) ? new y(G) : null };
                    a.ImageData =
                        function() {
                            if (2 === arguments.length) {
                                var G = arguments[0],
                                    k = arguments[1];
                                return new I(new Uint8ClampedArray(4 * G * k), G, k)
                            }
                            if (3 === arguments.length) {
                                var p = arguments[0];
                                if (p.prototype.constructor !== Uint8ClampedArray) throw "bytes must be given as a Uint8ClampedArray";
                                G = arguments[1];
                                k = arguments[2];
                                if (p % 4) throw "bytes must be given in a multiple of 4";
                                if (p % G) throw "bytes must divide evenly by width";
                                if (k && k !== p / (4 * G)) throw "invalid height given";
                                return new I(p, G, p / (4 * G))
                            }
                            throw "invalid number of arguments - takes 2 or 3, saw " +
                                arguments.length;
                        }
                })()
            })(u);
            var ua = da({}, u),
                va = "./this.program",
                ya = (a, b) => { throw b; },
                za = "object" === typeof window,
                Aa = "function" === typeof importScripts,
                Ba = "object" === typeof process && "object" === typeof process.versions && "string" === typeof process.versions.node,
                Ca = "",
                Ea, Fa, Ga, fs, Ha, Ja;
            if (Ba) Ca = Aa ? require("path").dirname(Ca) + "/" : __dirname + "/", Ja = () => { Ha || (fs = require("fs"), Ha = require("path")) }, Ea = function(a, b) {
                Ja();
                a = Ha.normalize(a);
                return fs.readFileSync(a, b ? null : "utf8")
            }, Ga = a => {
                a = Ea(a, !0);
                a.buffer || (a = new Uint8Array(a));
                return a
            }, Fa = (a, b, d) => {
                Ja();
                a = Ha.normalize(a);
                fs.readFile(a, function(f, h) { f ? d(f) : b(h.buffer) })
            }, 1 < process.argv.length && (va = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), process.on("uncaughtException", function(a) { if (!(a instanceof Ka)) throw a; }), process.on("unhandledRejection",
                function(a) { throw a; }), ya = (a, b) => {
                if (noExitRuntime || 0 < La) throw process.exitCode = a, b;
                b instanceof Ka || Ma("exiting due to exception: " + b);
                process.exit(a)
            }, u.inspect = function() { return "[Emscripten Module object]" };
            else if (za || Aa) Aa ? Ca = self.location.href : "undefined" !== typeof document && document.currentScript && (Ca = document.currentScript.src), _scriptDir && (Ca = _scriptDir), 0 !== Ca.indexOf("blob:") ? Ca = Ca.substr(0, Ca.replace(/[?#].*/, "").lastIndexOf("/") + 1) : Ca = "", Ea = a => {
                var b = new XMLHttpRequest;
                b.open("GET", a, !1);
                b.send(null);
                return b.responseText
            }, Aa && (Ga = a => {
                var b = new XMLHttpRequest;
                b.open("GET", a, !1);
                b.responseType = "arraybuffer";
                b.send(null);
                return new Uint8Array(b.response)
            }), Fa = (a, b, d) => {
                var f = new XMLHttpRequest;
                f.open("GET", a, !0);
                f.responseType = "arraybuffer";
                f.onload = () => { 200 == f.status || 0 == f.status && f.response ? b(f.response) : d() };
                f.onerror = d;
                f.send(null)
            };
            var Na = u.print || console.log.bind(console),
                Ma = u.printErr || console.warn.bind(console);
            da(u, ua);
            ua = null;
            u.thisProgram && (va = u.thisProgram);
            u.quit && (ya = u.quit);
            var Pa = 0,
                Qa;
            u.wasmBinary && (Qa = u.wasmBinary);
            var noExitRuntime = u.noExitRuntime || !0;
            "object" !== typeof WebAssembly && Ra("no native wasm support detected");
            var Sa, Ua = !1,
                Va = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;

            function Wa(a, b, d) {
                var f = b + d;
                for (d = b; a[d] && !(d >= f);) ++d;
                if (16 < d - b && a.subarray && Va) return Va.decode(a.subarray(b, d));
                for (f = ""; b < d;) {
                    var h = a[b++];
                    if (h & 128) {
                        var l = a[b++] & 63;
                        if (192 == (h & 224)) f += String.fromCharCode((h & 31) << 6 | l);
                        else {
                            var n = a[b++] & 63;
                            h = 224 == (h & 240) ? (h & 15) << 12 | l << 6 | n : (h & 7) << 18 | l << 12 | n << 6 | a[b++] & 63;
                            65536 > h ? f += String.fromCharCode(h) : (h -= 65536, f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023))
                        }
                    } else f += String.fromCharCode(h)
                }
                return f
            }

            function Xa(a, b) { return a ? Wa(H, a, b) : "" }

            function ta(a, b, d, f) {
                if (!(0 < f)) return 0;
                var h = d;
                f = d + f - 1;
                for (var l = 0; l < a.length; ++l) {
                    var n = a.charCodeAt(l);
                    if (55296 <= n && 57343 >= n) {
                        var q = a.charCodeAt(++l);
                        n = 65536 + ((n & 1023) << 10) | q & 1023
                    }
                    if (127 >= n) {
                        if (d >= f) break;
                        b[d++] = n
                    } else {
                        if (2047 >= n) {
                            if (d + 1 >= f) break;
                            b[d++] = 192 | n >> 6
                        } else {
                            if (65535 >= n) {
                                if (d + 2 >= f) break;
                                b[d++] = 224 | n >> 12
                            } else {
                                if (d + 3 >= f) break;
                                b[d++] = 240 | n >> 18;
                                b[d++] = 128 | n >> 12 & 63
                            }
                            b[d++] = 128 | n >> 6 & 63
                        }
                        b[d++] = 128 | n & 63
                    }
                }
                b[d] = 0;
                return d - h
            }

            function sa(a) {
                for (var b = 0, d = 0; d < a.length; ++d) {
                    var f = a.charCodeAt(d);
                    55296 <= f && 57343 >= f && (f = 65536 + ((f & 1023) << 10) | a.charCodeAt(++d) & 1023);
                    127 >= f ? ++b : b = 2047 >= f ? b + 2 : 65535 >= f ? b + 3 : b + 4
                }
                return b
            }
            var Ya = "undefined" !== typeof TextDecoder ? new TextDecoder("utf-16le") : void 0;

            function ab(a, b) {
                var d = a >> 1;
                for (var f = d + b / 2; !(d >= f) && bb[d];) ++d;
                d <<= 1;
                if (32 < d - a && Ya) return Ya.decode(H.subarray(a, d));
                d = "";
                for (f = 0; !(f >= b / 2); ++f) {
                    var h = cb[a + 2 * f >> 1];
                    if (0 == h) break;
                    d += String.fromCharCode(h)
                }
                return d
            }

            function db(a, b, d) {
                void 0 === d && (d = 2147483647);
                if (2 > d) return 0;
                d -= 2;
                var f = b;
                d = d < 2 * a.length ? d / 2 : a.length;
                for (var h = 0; h < d; ++h) cb[b >> 1] = a.charCodeAt(h), b += 2;
                cb[b >> 1] = 0;
                return b - f
            }

            function eb(a) { return 2 * a.length }

            function jb(a, b) {
                for (var d = 0, f = ""; !(d >= b / 4);) {
                    var h = P[a + 4 * d >> 2];
                    if (0 == h) break;
                    ++d;
                    65536 <= h ? (h -= 65536, f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023)) : f += String.fromCharCode(h)
                }
                return f
            }

            function kb(a, b, d) {
                void 0 === d && (d = 2147483647);
                if (4 > d) return 0;
                var f = b;
                d = f + d - 4;
                for (var h = 0; h < a.length; ++h) {
                    var l = a.charCodeAt(h);
                    if (55296 <= l && 57343 >= l) {
                        var n = a.charCodeAt(++h);
                        l = 65536 + ((l & 1023) << 10) | n & 1023
                    }
                    P[b >> 2] = l;
                    b += 4;
                    if (b + 4 > d) break
                }
                P[b >> 2] = 0;
                return b - f
            }

            function lb(a) {
                for (var b = 0, d = 0; d < a.length; ++d) {
                    var f = a.charCodeAt(d);
                    55296 <= f && 57343 >= f && ++d;
                    b += 4
                }
                return b
            }
            var mb, nb, H, cb, bb, P, ob, W, pb;

            function qb() {
                var a = Sa.buffer;
                mb = a;
                u.HEAP8 = nb = new Int8Array(a);
                u.HEAP16 = cb = new Int16Array(a);
                u.HEAP32 = P = new Int32Array(a);
                u.HEAPU8 = H = new Uint8Array(a);
                u.HEAPU16 = bb = new Uint16Array(a);
                u.HEAPU32 = ob = new Uint32Array(a);
                u.HEAPF32 = W = new Float32Array(a);
                u.HEAPF64 = pb = new Float64Array(a)
            }
            var rb, sb = [],
                tb = [],
                ub = [],
                La = 0;

            function vb() {
                var a = u.preRun.shift();
                sb.unshift(a)
            }
            var wb = 0,
                xb = null,
                zb = null;
            u.preloadedImages = {};
            u.preloadedAudios = {};

            function Ra(a) {
                if (u.onAbort) u.onAbort(a);
                a = "Aborted(" + a + ")";
                Ma(a);
                Ua = !0;
                a = new WebAssembly.RuntimeError(a + ". Build with -s ASSERTIONS=1 for more info.");
                ia(a);
                throw a;
            }

            function Ab() { return Bb.startsWith("data:application/octet-stream;base64,") }
            var Bb;
            Bb = "canvaskit.wasm";
            if (!Ab()) {
                var Cb = Bb;
                Bb = u.locateFile ? u.locateFile(Cb, Ca) : Ca + Cb
            }

            function Db() { var a = Bb; try { if (a == Bb && Qa) return new Uint8Array(Qa); if (Ga) return Ga(a); throw "both async and sync fetching of the wasm failed"; } catch (b) { Ra(b) } }

            function Eb() { if (!Qa && (za || Aa)) { if ("function" === typeof fetch && !Bb.startsWith("file://")) return fetch(Bb, { credentials: "same-origin" }).then(function(a) { if (!a.ok) throw "failed to load wasm binary file at '" + Bb + "'"; return a.arrayBuffer() }).catch(function() { return Db() }); if (Fa) return new Promise(function(a, b) { Fa(Bb, function(d) { a(new Uint8Array(d)) }, b) }) } return Promise.resolve().then(function() { return Db() }) }

            function Fb(a) {
                for (; 0 < a.length;) {
                    var b = a.shift();
                    if ("function" == typeof b) b(u);
                    else { var d = b.Dg; "number" === typeof d ? void 0 === b.ef ? Gb(d)() : Gb(d)(b.ef) : d(void 0 === b.ef ? null : b.ef) }
                }
            }

            function Gb(a) { return rb.get(a) }

            function Hb(a) {
                this.Qd = a - 16;
                this.mg = function(b) { P[this.Qd + 4 >> 2] = b };
                this.jg = function(b) { P[this.Qd + 8 >> 2] = b };
                this.kg = function() { P[this.Qd >> 2] = 0 };
                this.ig = function() { nb[this.Qd + 12 >> 0] = 0 };
                this.lg = function() { nb[this.Qd + 13 >> 0] = 0 };
                this.Xf = function(b, d) {
                    this.mg(b);
                    this.jg(d);
                    this.kg();
                    this.ig();
                    this.lg()
                }
            }
            var Ib = 0,
                Jb = {},
                Kb = [null, [],
                    []
                ],
                Lb = {},
                Mb = {};

            function Nb(a) {
                for (; a.length;) {
                    var b = a.pop();
                    a.pop()(b)
                }
            }

            function Ob(a) { return this.fromWireType(ob[a >> 2]) }
            var Pb = {},
                Qb = {},
                Rb = {};

            function Sb(a) {
                if (void 0 === a) return "_unknown";
                a = a.replace(/[^a-zA-Z0-9_]/g, "$");
                var b = a.charCodeAt(0);
                return 48 <= b && 57 >= b ? "_" + a : a
            }

            function Tb(a, b) { a = Sb(a); return function() { null; return b.apply(this, arguments) } }

            function Ub(a) {
                var b = Error,
                    d = Tb(a, function(f) {
                        this.name = a;
                        this.message = f;
                        f = Error(f).stack;
                        void 0 !== f && (this.stack = this.toString() + "\n" + f.replace(/^Error(:[^\n]*)?\n/, ""))
                    });
                d.prototype = Object.create(b.prototype);
                d.prototype.constructor = d;
                d.prototype.toString = function() { return void 0 === this.message ? this.name : this.name + ": " + this.message };
                return d
            }
            var Vb = void 0;

            function Wb(a) { throw new Vb(a); }

            function Xb(a, b, d) {
                function f(q) {
                    q = d(q);
                    q.length !== a.length && Wb("Mismatched type converter count");
                    for (var w = 0; w < a.length; ++w) dc(a[w], q[w])
                }
                a.forEach(function(q) { Rb[q] = b });
                var h = Array(b.length),
                    l = [],
                    n = 0;
                b.forEach(function(q, w) {
                    Qb.hasOwnProperty(q) ? h[w] = Qb[q] : (l.push(q), Pb.hasOwnProperty(q) || (Pb[q] = []), Pb[q].push(function() {
                        h[w] = Qb[q];
                        ++n;
                        n === l.length && f(h)
                    }))
                });
                0 === l.length && f(h)
            }

            function ec(a) {
                switch (a) {
                    case 1:
                        return 0;
                    case 2:
                        return 1;
                    case 4:
                        return 2;
                    case 8:
                        return 3;
                    default:
                        throw new TypeError("Unknown type size: " + a);
                }
            }
            var fc = void 0;

            function gc(a) { for (var b = ""; H[a];) b += fc[H[a++]]; return b }
            var hc = void 0;

            function X(a) { throw new hc(a); }

            function dc(a, b, d = {}) {
                if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
                var f = b.name;
                a || X('type "' + f + '" must have a positive integer typeid pointer');
                if (Qb.hasOwnProperty(a)) {
                    if (d.Wf) return;
                    X("Cannot register type '" + f + "' twice")
                }
                Qb[a] = b;
                delete Rb[a];
                Pb.hasOwnProperty(a) && (b = Pb[a], delete Pb[a], b.forEach(function(h) { h() }))
            }

            function ic(a) { X(a.Ld.Xd.Td.name + " instance already deleted") }
            var jc = !1;

            function kc() {}

            function lc(a) {
                --a.count.value;
                0 === a.count.value && (a.$d ? a.ge.le(a.$d) : a.Xd.Td.le(a.Qd))
            }

            function mc(a) {
                if ("undefined" === typeof FinalizationGroup) return mc = b => b, a;
                jc = new FinalizationGroup(function(b) { for (var d = b.next(); !d.done; d = b.next()) d = d.value, d.Qd ? lc(d) : console.warn("object already deleted: " + d.Qd) });
                mc = b => { jc.register(b, b.Ld, b.Ld); return b };
                kc = b => { jc.unregister(b.Ld) };
                return mc(a)
            }
            var nc = void 0,
                oc = [];

            function pc() {
                for (; oc.length;) {
                    var a = oc.pop();
                    a.Ld.De = !1;
                    a["delete"]()
                }
            }

            function qc() {}
            var rc = {};

            function sc(a, b, d) {
                if (void 0 === a[b].Zd) {
                    var f = a[b];
                    a[b] = function() { a[b].Zd.hasOwnProperty(arguments.length) || X("Function '" + d + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + a[b].Zd + ")!"); return a[b].Zd[arguments.length].apply(this, arguments) };
                    a[b].Zd = [];
                    a[b].Zd[f.Be] = f
                }
            }

            function tc(a, b, d) { u.hasOwnProperty(a) ? ((void 0 === d || void 0 !== u[a].Zd && void 0 !== u[a].Zd[d]) && X("Cannot register public name '" + a + "' twice"), sc(u, a, a), u.hasOwnProperty(d) && X("Cannot register multiple overloads of a function with the same number of arguments (" + d + ")!"), u[a].Zd[d] = b) : (u[a] = b, void 0 !== d && (u[a].Fg = d)) }

            function uc(a, b, d, f, h, l, n, q) {
                this.name = a;
                this.constructor = b;
                this.Ee = d;
                this.le = f;
                this.ie = h;
                this.Pf = l;
                this.Pe = n;
                this.Jf = q;
                this.fg = []
            }

            function vc(a, b, d) { for (; b !== d;) b.Pe || X("Expected null or instance of " + d.name + ", got an instance of " + b.name), a = b.Pe(a), b = b.ie; return a }

            function wc(a, b) {
                if (null === b) return this.gf && X("null is not a valid " + this.name), 0;
                b.Ld || X('Cannot pass "' + xc(b) + '" as a ' + this.name);
                b.Ld.Qd || X("Cannot pass deleted object as a pointer of type " + this.name);
                return vc(b.Ld.Qd, b.Ld.Xd.Td, this.Td)
            }

            function yc(a, b) {
                if (null === b) {
                    this.gf && X("null is not a valid " + this.name);
                    if (this.Ue) {
                        var d = this.hf();
                        null !== a && a.push(this.le, d);
                        return d
                    }
                    return 0
                }
                b.Ld || X('Cannot pass "' + xc(b) + '" as a ' + this.name);
                b.Ld.Qd || X("Cannot pass deleted object as a pointer of type " + this.name);
                !this.Te && b.Ld.Xd.Te && X("Cannot convert argument of type " + (b.Ld.ge ? b.Ld.ge.name : b.Ld.Xd.name) + " to parameter type " + this.name);
                d = vc(b.Ld.Qd, b.Ld.Xd.Td, this.Td);
                if (this.Ue) switch (void 0 === b.Ld.$d && X("Passing raw pointer to smart pointer is illegal"),
                    this.qg) {
                    case 0:
                        b.Ld.ge === this ? d = b.Ld.$d : X("Cannot convert argument of type " + (b.Ld.ge ? b.Ld.ge.name : b.Ld.Xd.name) + " to parameter type " + this.name);
                        break;
                    case 1:
                        d = b.Ld.$d;
                        break;
                    case 2:
                        if (b.Ld.ge === this) d = b.Ld.$d;
                        else {
                            var f = b.clone();
                            d = this.gg(d, zc(function() { f["delete"]() }));
                            null !== a && a.push(this.le, d)
                        }
                        break;
                    default:
                        X("Unsupporting sharing policy")
                }
                return d
            }

            function Ac(a, b) {
                if (null === b) return this.gf && X("null is not a valid " + this.name), 0;
                b.Ld || X('Cannot pass "' + xc(b) + '" as a ' + this.name);
                b.Ld.Qd || X("Cannot pass deleted object as a pointer of type " + this.name);
                b.Ld.Xd.Te && X("Cannot convert argument of type " + b.Ld.Xd.name + " to parameter type " + this.name);
                return vc(b.Ld.Qd, b.Ld.Xd.Td, this.Td)
            }

            function Bc(a, b, d) {
                if (b === d) return a;
                if (void 0 === d.ie) return null;
                a = Bc(a, b, d.ie);
                return null === a ? null : d.Jf(a)
            }
            var Cc = {};

            function Dc(a, b) { for (void 0 === b && X("ptr should not be undefined"); a.ie;) b = a.Pe(b), a = a.ie; return Cc[b] }

            function Ec(a, b) {
                b.Xd && b.Qd || Wb("makeClassHandle requires ptr and ptrType");
                !!b.ge !== !!b.$d && Wb("Both smartPtrType and smartPtr must be specified");
                b.count = { value: 1 };
                return mc(Object.create(a, { Ld: { value: b } }))
            }

            function Fc(a, b, d, f, h, l, n, q, w, x, K) {
                this.name = a;
                this.Td = b;
                this.gf = d;
                this.Te = f;
                this.Ue = h;
                this.eg = l;
                this.qg = n;
                this.vf = q;
                this.hf = w;
                this.gg = x;
                this.le = K;
                h || void 0 !== b.ie ? this.toWireType = yc : (this.toWireType = f ? wc : Ac, this.fe = null)
            }

            function Gc(a, b, d) {
                u.hasOwnProperty(a) || Wb("Replacing nonexistant public symbol");
                void 0 !== u[a].Zd && void 0 !== d ? u[a].Zd[d] = b : (u[a] = b, u[a].Be = d)
            }

            function Hc(a, b) {
                var d = [];
                return function() {
                    d.length = arguments.length;
                    for (var f = 0; f < arguments.length; f++) d[f] = arguments[f];
                    a.includes("j") ? (f = u["dynCall_" + a], f = d && d.length ? f.apply(null, [b].concat(d)) : f.call(null, b)) : f = Gb(b).apply(null, d);
                    return f
                }
            }

            function Pc(a, b) { a = gc(a); var d = a.includes("j") ? Hc(a, b) : Gb(b); "function" !== typeof d && X("unknown function pointer with signature " + a + ": " + b); return d }
            var Qc = void 0;

            function Rc(a) {
                a = Sc(a);
                var b = gc(a);
                Tc(a);
                return b
            }

            function Uc(a, b) {
                function d(l) { h[l] || Qb[l] || (Rb[l] ? Rb[l].forEach(d) : (f.push(l), h[l] = !0)) }
                var f = [],
                    h = {};
                b.forEach(d);
                throw new Qc(a + ": " + f.map(Rc).join([", "]));
            }

            function Vc(a, b, d, f, h) {
                var l = b.length;
                2 > l && X("argTypes array size mismatch! Must at least get return value and 'this' types!");
                var n = null !== b[1] && null !== d,
                    q = !1;
                for (d = 1; d < b.length; ++d)
                    if (null !== b[d] && void 0 === b[d].fe) { q = !0; break }
                var w = "void" !== b[0].name,
                    x = l - 2,
                    K = Array(x),
                    J = [],
                    Q = [];
                return function() {
                    arguments.length !== x && X("function " + a + " called with " + arguments.length + " arguments, expected " + x + " args!");
                    Q.length = 0;
                    J.length = n ? 2 : 1;
                    J[0] = h;
                    if (n) {
                        var A = b[1].toWireType(Q, this);
                        J[1] = A
                    }
                    for (var M = 0; M < x; ++M) K[M] =
                        b[M + 2].toWireType(Q, arguments[M]), J.push(K[M]);
                    M = f.apply(null, J);
                    if (q) Nb(Q);
                    else
                        for (var U = n ? 1 : 2; U < b.length; U++) {
                            var T = 1 === U ? A : K[U - 2];
                            null !== b[U].fe && b[U].fe(T)
                        }
                    A = w ? b[0].fromWireType(M) : void 0;
                    return A
                }
            }

            function Wc(a, b) { for (var d = [], f = 0; f < a; f++) d.push(P[(b >> 2) + f]); return d }
            var Xc = [],
                Yc = [{}, { value: void 0 }, { value: null }, { value: !0 }, { value: !1 }];

            function Zc(a) { 4 < a && 0 === --Yc[a].jf && (Yc[a] = void 0, Xc.push(a)) }

            function $c(a) { a || X("Cannot use deleted val. handle = " + a); return Yc[a].value }

            function zc(a) {
                switch (a) {
                    case void 0:
                        return 1;
                    case null:
                        return 2;
                    case !0:
                        return 3;
                    case !1:
                        return 4;
                    default:
                        var b = Xc.length ? Xc.pop() : Yc.length;
                        Yc[b] = { jf: 1, value: a };
                        return b
                }
            }

            function ad(a, b, d) {
                switch (b) {
                    case 0:
                        return function(f) { return this.fromWireType((d ? nb : H)[f]) };
                    case 1:
                        return function(f) { return this.fromWireType((d ? cb : bb)[f >> 1]) };
                    case 2:
                        return function(f) { return this.fromWireType((d ? P : ob)[f >> 2]) };
                    default:
                        throw new TypeError("Unknown integer type: " + a);
                }
            }

            function bd(a, b) {
                var d = Qb[a];
                void 0 === d && X(b + " has unknown type " + Rc(a));
                return d
            }

            function xc(a) { if (null === a) return "null"; var b = typeof a; return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a }

            function cd(a, b) {
                switch (b) {
                    case 2:
                        return function(d) { return this.fromWireType(W[d >> 2]) };
                    case 3:
                        return function(d) { return this.fromWireType(pb[d >> 3]) };
                    default:
                        throw new TypeError("Unknown float type: " + a);
                }
            }

            function dd(a, b, d) {
                switch (b) {
                    case 0:
                        return d ? function(f) { return nb[f] } : function(f) { return H[f] };
                    case 1:
                        return d ? function(f) { return cb[f >> 1] } : function(f) { return bb[f >> 1] };
                    case 2:
                        return d ? function(f) { return P[f >> 2] } : function(f) { return ob[f >> 2] };
                    default:
                        throw new TypeError("Unknown integer type: " + a);
                }
            }
            var ed = {};

            function fd(a) { var b = ed[a]; return void 0 === b ? gc(a) : b }
            var gd = [];

            function hd() {
                function a(b) {
                    b.$$$embind_global$$$ = b;
                    var d = "object" === typeof $$$embind_global$$$ && b.$$$embind_global$$$ === b;
                    d || delete b.$$$embind_global$$$;
                    return d
                }
                if ("object" === typeof globalThis) return globalThis;
                if ("object" === typeof $$$embind_global$$$) return $$$embind_global$$$;
                "object" === typeof global && a(global) ? $$$embind_global$$$ = global : "object" === typeof self && a(self) && ($$$embind_global$$$ = self);
                if ("object" === typeof $$$embind_global$$$) return $$$embind_global$$$;
                throw Error("unable to get global object.");
            }

            function jd(a) {
                var b = gd.length;
                gd.push(a);
                return b
            }

            function kd(a, b) { for (var d = Array(a), f = 0; f < a; ++f) d[f] = bd(P[(b >> 2) + f], "parameter " + f); return d }
            var ld = [];

            function md(a) {
                var b = Array(a + 1);
                return function(d, f, h) {
                    b[0] = d;
                    for (var l = 0; l < a; ++l) {
                        var n = bd(P[(f >> 2) + l], "parameter " + l);
                        b[l + 1] = n.readValueFromPointer(h);
                        h += n.argPackAdvance
                    }
                    d = new(d.bind.apply(d, b));
                    return zc(d)
                }
            }
            var nd = {},
                od;
            od = Ba ? () => { var a = process.hrtime(); return 1E3 * a[0] + a[1] / 1E6 } : () => performance.now();

            function pd(a) {
                var b = a.getExtension("ANGLE_instanced_arrays");
                b && (a.vertexAttribDivisor = function(d, f) { b.vertexAttribDivisorANGLE(d, f) }, a.drawArraysInstanced = function(d, f, h, l) { b.drawArraysInstancedANGLE(d, f, h, l) }, a.drawElementsInstanced = function(d, f, h, l, n) { b.drawElementsInstancedANGLE(d, f, h, l, n) })
            }

            function qd(a) {
                var b = a.getExtension("OES_vertex_array_object");
                b && (a.createVertexArray = function() { return b.createVertexArrayOES() }, a.deleteVertexArray = function(d) { b.deleteVertexArrayOES(d) }, a.bindVertexArray = function(d) { b.bindVertexArrayOES(d) }, a.isVertexArray = function(d) { return b.isVertexArrayOES(d) })
            }

            function rd(a) {
                var b = a.getExtension("WEBGL_draw_buffers");
                b && (a.drawBuffers = function(d, f) { b.drawBuffersWEBGL(d, f) })
            }
            var sd = 1,
                td = [],
                ud = [],
                vd = [],
                wd = [],
                la = [],
                xd = [],
                yd = [],
                ra = [],
                zd = [],
                Ad = [],
                Bd = {},
                Cd = {},
                Dd = 4;

            function Ed(a) { Hd || (Hd = a) }

            function ka(a) { for (var b = sd++, d = a.length; d < b; d++) a[d] = null; return b }

            function ma(a, b) { a.sf || (a.sf = a.getContext, a.getContext = function(f, h) { h = a.sf(f, h); return "webgl" == f == h instanceof WebGLRenderingContext ? h : null }); var d = 1 < b.majorVersion ? a.getContext("webgl2", b) : a.getContext("webgl", b); return d ? Id(d, b) : 0 }

            function Id(a, b) {
                var d = ka(ra),
                    f = { Vf: d, attributes: b, version: b.majorVersion, je: a };
                a.canvas && (a.canvas.yf = f);
                ra[d] = f;
                ("undefined" === typeof b.Kf || b.Kf) && Jd(f);
                return d
            }

            function na(a) {
                v = ra[a];
                u.Cg = Y = v && v.je;
                return !(a && !Y)
            }

            function Jd(a) {
                a || (a = v);
                if (!a.Yf) {
                    a.Yf = !0;
                    var b = a.je;
                    pd(b);
                    qd(b);
                    rd(b);
                    b.pf = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
                    b.uf = b.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");
                    2 <= a.version && (b.qf = b.getExtension("EXT_disjoint_timer_query_webgl2"));
                    if (2 > a.version || !b.qf) b.qf = b.getExtension("EXT_disjoint_timer_query");
                    b.Eg = b.getExtension("WEBGL_multi_draw");
                    (b.getSupportedExtensions() || []).forEach(function(d) { d.includes("lose_context") || d.includes("debug") || b.getExtension(d) })
                }
            }
            var v, Hd, Kd = [];

            function Ld(a, b, d, f) {
                for (var h = 0; h < a; h++) {
                    var l = Y[d](),
                        n = l && ka(f);
                    l ? (l.name = n, f[n] = l) : Ed(1282);
                    P[b + 4 * h >> 2] = n
                }
            }

            function Md(a, b) {
                if (b) {
                    var d = void 0;
                    switch (a) {
                        case 36346:
                            d = 1;
                            break;
                        case 36344:
                            return;
                        case 34814:
                        case 36345:
                            d = 0;
                            break;
                        case 34466:
                            var f = Y.getParameter(34467);
                            d = f ? f.length : 0;
                            break;
                        case 33309:
                            if (2 > v.version) { Ed(1282); return }
                            d = 2 * (Y.getSupportedExtensions() || []).length;
                            break;
                        case 33307:
                        case 33308:
                            if (2 > v.version) { Ed(1280); return }
                            d = 33307 == a ? 3 : 0
                    }
                    if (void 0 === d) switch (f = Y.getParameter(a), typeof f) {
                        case "number":
                            d = f;
                            break;
                        case "boolean":
                            d = f ? 1 : 0;
                            break;
                        case "string":
                            Ed(1280);
                            return;
                        case "object":
                            if (null === f) switch (a) {
                                case 34964:
                                case 35725:
                                case 34965:
                                case 36006:
                                case 36007:
                                case 32873:
                                case 34229:
                                case 36662:
                                case 36663:
                                case 35053:
                                case 35055:
                                case 36010:
                                case 35097:
                                case 35869:
                                case 32874:
                                case 36389:
                                case 35983:
                                case 35368:
                                case 34068:
                                    d =
                                        0;
                                    break;
                                default:
                                    Ed(1280);
                                    return
                            } else {
                                if (f instanceof Float32Array || f instanceof Uint32Array || f instanceof Int32Array || f instanceof Array) { for (a = 0; a < f.length; ++a) P[b + 4 * a >> 2] = f[a]; return }
                                try { d = f.name | 0 } catch (h) {
                                    Ed(1280);
                                    Ma("GL_INVALID_ENUM in glGet0v: Unknown object returned from WebGL getParameter(" + a + ")! (error: " + h + ")");
                                    return
                                }
                            }
                            break;
                        default:
                            Ed(1280);
                            Ma("GL_INVALID_ENUM in glGet0v: Native code calling glGet0v(" + a + ") and it returns " + f + " of type " + typeof f + "!");
                            return
                    }
                    P[b >> 2] = d
                } else Ed(1281)
            }

            function Nd(a) {
                var b = sa(a) + 1,
                    d = Od(b);
                ta(a, H, d, b);
                return d
            }

            function Pd(a) { return "]" == a.slice(-1) && a.lastIndexOf("[") }

            function Qd(a) { a -= 5120; return 0 == a ? nb : 1 == a ? H : 2 == a ? cb : 4 == a ? P : 6 == a ? W : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ? ob : bb }

            function Rd(a, b, d, f, h) {
                a = Qd(a);
                var l = 31 - Math.clz32(a.BYTES_PER_ELEMENT),
                    n = Dd;
                return a.subarray(h >> l, h + f * (d * ({ 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4, 26917: 2, 26918: 2, 29846: 3, 29847: 4 }[b - 6402] || 1) * (1 << l) + n - 1 & -n) >> l)
            }

            function Z(a) {
                var b = Y.Gf;
                if (b) { var d = b.Oe[a]; "number" === typeof d && (b.Oe[a] = d = Y.getUniformLocation(b, b.wf[a] + (0 < d ? "[" + d + "]" : ""))); return d }
                Ed(1282)
            }
            var Sd = [],
                Td = [],
                Ud = {};

            function Vd() {
                if (!Wd) {
                    var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: ("object" === typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: va || "./this.program" },
                        b;
                    for (b in Ud) void 0 === Ud[b] ? delete a[b] : a[b] = Ud[b];
                    var d = [];
                    for (b in a) d.push(b + "=" + a[b]);
                    Wd = d
                }
                return Wd
            }
            var Wd;

            function Xd(a) { return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400) }

            function Yd(a, b) { for (var d = 0, f = 0; f <= b; d += a[f++]); return d }
            var Zd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                $d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            function ae(a, b) {
                for (a = new Date(a.getTime()); 0 < b;) {
                    var d = a.getMonth(),
                        f = (Xd(a.getFullYear()) ? Zd : $d)[d];
                    if (b > f - a.getDate()) b -= f - a.getDate() + 1, a.setDate(1), 11 > d ? a.setMonth(d + 1) : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1));
                    else { a.setDate(a.getDate() + b); break }
                }
                return a
            }

            function be(a, b, d, f) {
                function h(A, M, U) { for (A = "number" === typeof A ? A.toString() : A || ""; A.length < M;) A = U[0] + A; return A }

                function l(A, M) { return h(A, M, "0") }

                function n(A, M) {
                    function U(oa) { return 0 > oa ? -1 : 0 < oa ? 1 : 0 }
                    var T;
                    0 === (T = U(A.getFullYear() - M.getFullYear())) && 0 === (T = U(A.getMonth() - M.getMonth())) && (T = U(A.getDate() - M.getDate()));
                    return T
                }

                function q(A) {
                    switch (A.getDay()) {
                        case 0:
                            return new Date(A.getFullYear() - 1, 11, 29);
                        case 1:
                            return A;
                        case 2:
                            return new Date(A.getFullYear(), 0, 3);
                        case 3:
                            return new Date(A.getFullYear(),
                                0, 2);
                        case 4:
                            return new Date(A.getFullYear(), 0, 1);
                        case 5:
                            return new Date(A.getFullYear() - 1, 11, 31);
                        case 6:
                            return new Date(A.getFullYear() - 1, 11, 30)
                    }
                }

                function w(A) {
                    A = ae(new Date(A.be + 1900, 0, 1), A.$e);
                    var M = new Date(A.getFullYear() + 1, 0, 4),
                        U = q(new Date(A.getFullYear(), 0, 4));
                    M = q(M);
                    return 0 >= n(U, A) ? 0 >= n(M, A) ? A.getFullYear() + 1 : A.getFullYear() : A.getFullYear() - 1
                }
                var x = P[f + 40 >> 2];
                f = {
                    yg: P[f >> 2],
                    xg: P[f + 4 >> 2],
                    Ye: P[f + 8 >> 2],
                    Ne: P[f + 12 >> 2],
                    Fe: P[f + 16 >> 2],
                    be: P[f + 20 >> 2],
                    Ze: P[f + 24 >> 2],
                    $e: P[f + 28 >> 2],
                    Ig: P[f + 32 >> 2],
                    wg: P[f +
                        36 >> 2],
                    zg: x ? Xa(x) : ""
                };
                d = Xa(d);
                x = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
                for (var K in x) d = d.replace(new RegExp(K, "g"), x[K]);
                var J = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                    Q = "January February March April May June July August September October November December".split(" ");
                x = {
                    "%a": function(A) { return J[A.Ze].substring(0, 3) },
                    "%A": function(A) { return J[A.Ze] },
                    "%b": function(A) { return Q[A.Fe].substring(0, 3) },
                    "%B": function(A) { return Q[A.Fe] },
                    "%C": function(A) { return l((A.be + 1900) / 100 | 0, 2) },
                    "%d": function(A) { return l(A.Ne, 2) },
                    "%e": function(A) { return h(A.Ne, 2, " ") },
                    "%g": function(A) { return w(A).toString().substring(2) },
                    "%G": function(A) { return w(A) },
                    "%H": function(A) {
                        return l(A.Ye,
                            2)
                    },
                    "%I": function(A) {
                        A = A.Ye;
                        0 == A ? A = 12 : 12 < A && (A -= 12);
                        return l(A, 2)
                    },
                    "%j": function(A) { return l(A.Ne + Yd(Xd(A.be + 1900) ? Zd : $d, A.Fe - 1), 3) },
                    "%m": function(A) { return l(A.Fe + 1, 2) },
                    "%M": function(A) { return l(A.xg, 2) },
                    "%n": function() { return "\n" },
                    "%p": function(A) { return 0 <= A.Ye && 12 > A.Ye ? "AM" : "PM" },
                    "%S": function(A) { return l(A.yg, 2) },
                    "%t": function() { return "\t" },
                    "%u": function(A) { return A.Ze || 7 },
                    "%U": function(A) {
                        var M = new Date(A.be + 1900, 0, 1),
                            U = 0 === M.getDay() ? M : ae(M, 7 - M.getDay());
                        A = new Date(A.be + 1900, A.Fe, A.Ne);
                        return 0 >
                            n(U, A) ? l(Math.ceil((31 - U.getDate() + (Yd(Xd(A.getFullYear()) ? Zd : $d, A.getMonth() - 1) - 31) + A.getDate()) / 7), 2) : 0 === n(U, M) ? "01" : "00"
                    },
                    "%V": function(A) {
                        var M = new Date(A.be + 1901, 0, 4),
                            U = q(new Date(A.be + 1900, 0, 4));
                        M = q(M);
                        var T = ae(new Date(A.be + 1900, 0, 1), A.$e);
                        return 0 > n(T, U) ? "53" : 0 >= n(M, T) ? "01" : l(Math.ceil((U.getFullYear() < A.be + 1900 ? A.$e + 32 - U.getDate() : A.$e + 1 - U.getDate()) / 7), 2)
                    },
                    "%w": function(A) { return A.Ze },
                    "%W": function(A) {
                        var M = new Date(A.be, 0, 1),
                            U = 1 === M.getDay() ? M : ae(M, 0 === M.getDay() ? 1 : 7 - M.getDay() + 1);
                        A =
                            new Date(A.be + 1900, A.Fe, A.Ne);
                        return 0 > n(U, A) ? l(Math.ceil((31 - U.getDate() + (Yd(Xd(A.getFullYear()) ? Zd : $d, A.getMonth() - 1) - 31) + A.getDate()) / 7), 2) : 0 === n(U, M) ? "01" : "00"
                    },
                    "%y": function(A) { return (A.be + 1900).toString().substring(2) },
                    "%Y": function(A) { return A.be + 1900 },
                    "%z": function(A) {
                        A = A.wg;
                        var M = 0 <= A;
                        A = Math.abs(A) / 60;
                        return (M ? "+" : "-") + String("0000" + (A / 60 * 100 + A % 60)).slice(-4)
                    },
                    "%Z": function(A) { return A.zg },
                    "%%": function() { return "%" }
                };
                for (K in x) d.includes(K) && (d = d.replace(new RegExp(K, "g"), x[K](f)));
                K = ce(d);
                if (K.length > b) return 0;
                nb.set(K, a);
                return K.length - 1
            }
            Vb = u.InternalError = Ub("InternalError");
            for (var de = Array(256), ee = 0; 256 > ee; ++ee) de[ee] = String.fromCharCode(ee);
            fc = de;
            hc = u.BindingError = Ub("BindingError");
            qc.prototype.isAliasOf = function(a) {
                if (!(this instanceof qc && a instanceof qc)) return !1;
                var b = this.Ld.Xd.Td,
                    d = this.Ld.Qd,
                    f = a.Ld.Xd.Td;
                for (a = a.Ld.Qd; b.ie;) d = b.Pe(d), b = b.ie;
                for (; f.ie;) a = f.Pe(a), f = f.ie;
                return b === f && d === a
            };
            qc.prototype.clone = function() {
                this.Ld.Qd || ic(this);
                if (this.Ld.Me) return this.Ld.count.value += 1, this;
                var a = mc,
                    b = Object,
                    d = b.create,
                    f = Object.getPrototypeOf(this),
                    h = this.Ld;
                a = a(d.call(b, f, { Ld: { value: { count: h.count, De: h.De, Me: h.Me, Qd: h.Qd, Xd: h.Xd, $d: h.$d, ge: h.ge } } }));
                a.Ld.count.value += 1;
                a.Ld.De = !1;
                return a
            };
            qc.prototype["delete"] = function() {
                this.Ld.Qd || ic(this);
                this.Ld.De && !this.Ld.Me && X("Object already scheduled for deletion");
                kc(this);
                lc(this.Ld);
                this.Ld.Me || (this.Ld.$d = void 0, this.Ld.Qd = void 0)
            };
            qc.prototype.isDeleted = function() { return !this.Ld.Qd };
            qc.prototype.deleteLater = function() {
                this.Ld.Qd || ic(this);
                this.Ld.De && !this.Ld.Me && X("Object already scheduled for deletion");
                oc.push(this);
                1 === oc.length && nc && nc(pc);
                this.Ld.De = !0;
                return this
            };
            Fc.prototype.Qf = function(a) { this.vf && (a = this.vf(a)); return a };
            Fc.prototype.nf = function(a) { this.le && this.le(a) };
            Fc.prototype.argPackAdvance = 8;
            Fc.prototype.readValueFromPointer = Ob;
            Fc.prototype.deleteObject = function(a) { if (null !== a) a["delete"]() };
            Fc.prototype.fromWireType = function(a) {
                function b() { return this.Ue ? Ec(this.Td.Ee, { Xd: this.eg, Qd: d, ge: this, $d: a }) : Ec(this.Td.Ee, { Xd: this, Qd: a }) }
                var d = this.Qf(a);
                if (!d) return this.nf(a), null;
                var f = Dc(this.Td, d);
                if (void 0 !== f) {
                    if (0 === f.Ld.count.value) return f.Ld.Qd = d, f.Ld.$d = a, f.clone();
                    f = f.clone();
                    this.nf(a);
                    return f
                }
                f = this.Td.Pf(d);
                f = rc[f];
                if (!f) return b.call(this);
                f = this.Te ? f.Ef : f.pointerType;
                var h = Bc(d, this.Td, f.Td);
                return null === h ? b.call(this) : this.Ue ? Ec(f.Td.Ee, { Xd: f, Qd: h, ge: this, $d: a }) : Ec(f.Td.Ee, { Xd: f, Qd: h })
            };
            u.getInheritedInstanceCount = function() { return Object.keys(Cc).length };
            u.getLiveInheritedInstances = function() {
                var a = [],
                    b;
                for (b in Cc) Cc.hasOwnProperty(b) && a.push(Cc[b]);
                return a
            };
            u.flushPendingDeletes = pc;
            u.setDelayFunction = function(a) {
                nc = a;
                oc.length && nc && nc(pc)
            };
            Qc = u.UnboundTypeError = Ub("UnboundTypeError");
            u.count_emval_handles = function() { for (var a = 0, b = 5; b < Yc.length; ++b) void 0 !== Yc[b] && ++a; return a };
            u.get_first_emval = function() {
                for (var a = 5; a < Yc.length; ++a)
                    if (void 0 !== Yc[a]) return Yc[a];
                return null
            };
            for (var Y, fe = 0; 32 > fe; ++fe) Kd.push(Array(fe));
            var ge = new Float32Array(288);
            for (fe = 0; 288 > fe; ++fe) Sd[fe] = ge.subarray(0, fe + 1);
            var he = new Int32Array(288);
            for (fe = 0; 288 > fe; ++fe) Td[fe] = he.subarray(0, fe + 1);

            function ce(a) {
                var b = Array(sa(a) + 1);
                ta(a, b, 0, b.length);
                return b
            }
            var ze = {
                W: function(a) { return Od(a + 16) + 16 },
                T: function(a, b, d) {
                    (new Hb(a)).Xf(b, d);
                    Ib++;
                    throw a;
                },
                P: function() { return 0 },
                Bb: function() {},
                zb: function() {},
                Eb: function() { return 0 },
                yb: function() {},
                vb: function(a, b, d, f, h, l) {
                    l <<= 12;
                    if (0 !== (f & 16) && 0 !== a % 65536) b = -28;
                    else if (0 !== (f & 32)) {
                        a = 65536 * Math.ceil(b / 65536);
                        var n = ie(65536, a);
                        n ? (H.fill(0, n, n + a), a = n) : a = 0;
                        a ? (Jb[a] = { cg: a, bg: b, Df: !0, fd: h, Gg: d, flags: f, offset: l }, b = a) : b = -48
                    } else b = -52;
                    return b
                },
                ub: function(a, b) {
                    var d = Jb[a];
                    0 !== b && d ? (b === d.bg && (Jb[a] = null, d.Df &&
                        Tc(d.cg)), a = 0) : a = -28;
                    return a
                },
                Q: function() {},
                Ab: function() {},
                v: function(a) {
                    var b = Mb[a];
                    delete Mb[a];
                    var d = b.hf,
                        f = b.le,
                        h = b.rf,
                        l = h.map(function(n) { return n.Uf }).concat(h.map(function(n) { return n.og }));
                    Xb([a], l, function(n) {
                        var q = {};
                        h.forEach(function(w, x) {
                            var K = n[x],
                                J = w.Sf,
                                Q = w.Tf,
                                A = n[x + h.length],
                                M = w.ng,
                                U = w.pg;
                            q[w.Lf] = {
                                read: function(T) { return K.fromWireType(J(Q, T)) },
                                write: function(T, oa) {
                                    var wa = [];
                                    M(U, T, A.toWireType(wa, oa));
                                    Nb(wa)
                                }
                            }
                        });
                        return [{
                            name: b.name,
                            fromWireType: function(w) {
                                var x = {},
                                    K;
                                for (K in q) x[K] =
                                    q[K].read(w);
                                f(w);
                                return x
                            },
                            toWireType: function(w, x) {
                                for (var K in q)
                                    if (!(K in x)) throw new TypeError('Missing field:  "' + K + '"');
                                var J = d();
                                for (K in q) q[K].write(J, x[K]);
                                null !== w && w.push(f, J);
                                return J
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: Ob,
                            fe: f
                        }]
                    })
                },
                ob: function() {},
                Gb: function(a, b, d, f, h) {
                    var l = ec(d);
                    b = gc(b);
                    dc(a, {
                        name: b,
                        fromWireType: function(n) { return !!n },
                        toWireType: function(n, q) { return q ? f : h },
                        argPackAdvance: 8,
                        readValueFromPointer: function(n) {
                            if (1 === d) var q = nb;
                            else if (2 === d) q = cb;
                            else if (4 === d) q =
                                P;
                            else throw new TypeError("Unknown boolean type size: " + b);
                            return this.fromWireType(q[n >> l])
                        },
                        fe: null
                    })
                },
                k: function(a, b, d, f, h, l, n, q, w, x, K, J, Q) {
                    K = gc(K);
                    l = Pc(h, l);
                    q && (q = Pc(n, q));
                    x && (x = Pc(w, x));
                    Q = Pc(J, Q);
                    var A = Sb(K);
                    tc(A, function() { Uc("Cannot construct " + K + " due to unbound types", [f]) });
                    Xb([a, b, d], f ? [f] : [], function(M) {
                        M = M[0];
                        if (f) { var U = M.Td; var T = U.Ee } else T = qc.prototype;
                        M = Tb(A, function() {
                            if (Object.getPrototypeOf(this) !== oa) throw new hc("Use 'new' to construct " + K);
                            if (void 0 === wa.oe) throw new hc(K +
                                " has no accessible constructor");
                            var hb = wa.oe[arguments.length];
                            if (void 0 === hb) throw new hc("Tried to invoke ctor of " + K + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(wa.oe).toString() + ") parameters instead!");
                            return hb.apply(this, arguments)
                        });
                        var oa = Object.create(T, { constructor: { value: M } });
                        M.prototype = oa;
                        var wa = new uc(K, M, oa, Q, U, l, q, x);
                        U = new Fc(K, wa, !0, !1, !1);
                        T = new Fc(K + "*", wa, !1, !1, !1);
                        var gb = new Fc(K + " const*", wa, !1, !0, !1);
                        rc[a] = { pointerType: T, Ef: gb };
                        Gc(A,
                            M);
                        return [U, T, gb]
                    })
                },
                e: function(a, b, d, f, h, l, n) {
                    var q = Wc(d, f);
                    b = gc(b);
                    l = Pc(h, l);
                    Xb([], [a], function(w) {
                        function x() { Uc("Cannot call " + K + " due to unbound types", q) }
                        w = w[0];
                        var K = w.name + "." + b;
                        b.startsWith("@@") && (b = Symbol[b.substring(2)]);
                        var J = w.Td.constructor;
                        void 0 === J[b] ? (x.Be = d - 1, J[b] = x) : (sc(J, b, K), J[b].Zd[d - 1] = x);
                        Xb([], q, function(Q) {
                            Q = [Q[0], null].concat(Q.slice(1));
                            Q = Vc(K, Q, null, l, n);
                            void 0 === J[b].Zd ? (Q.Be = d - 1, J[b] = Q) : J[b].Zd[d - 1] = Q;
                            return []
                        });
                        return []
                    })
                },
                x: function(a, b, d, f, h, l) {
                    0 < b || Ra(void 0);
                    var n = Wc(b, d);
                    h = Pc(f, h);
                    Xb([], [a], function(q) {
                        q = q[0];
                        var w = "constructor " + q.name;
                        void 0 === q.Td.oe && (q.Td.oe = []);
                        if (void 0 !== q.Td.oe[b - 1]) throw new hc("Cannot register multiple constructors with identical number of parameters (" + (b - 1) + ") for class '" + q.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
                        q.Td.oe[b - 1] = () => { Uc("Cannot construct " + q.name + " due to unbound types", n) };
                        Xb([], n, function(x) {
                            x.splice(1, 0, null);
                            q.Td.oe[b - 1] = Vc(w, x, null, h,
                                l);
                            return []
                        });
                        return []
                    })
                },
                d: function(a, b, d, f, h, l, n, q) {
                    var w = Wc(d, f);
                    b = gc(b);
                    l = Pc(h, l);
                    Xb([], [a], function(x) {
                        function K() { Uc("Cannot call " + J + " due to unbound types", w) }
                        x = x[0];
                        var J = x.name + "." + b;
                        b.startsWith("@@") && (b = Symbol[b.substring(2)]);
                        q && x.Td.fg.push(b);
                        var Q = x.Td.Ee,
                            A = Q[b];
                        void 0 === A || void 0 === A.Zd && A.className !== x.name && A.Be === d - 2 ? (K.Be = d - 2, K.className = x.name, Q[b] = K) : (sc(Q, b, J), Q[b].Zd[d - 2] = K);
                        Xb([], w, function(M) {
                            M = Vc(J, M, x, l, n);
                            void 0 === Q[b].Zd ? (M.Be = d - 2, Q[b] = M) : Q[b].Zd[d - 2] = M;
                            return []
                        });
                        return []
                    })
                },
                X: function(a, b, d) {
                    a = gc(a);
                    Xb([], [b], function(f) {
                        f = f[0];
                        u[a] = f.fromWireType(d);
                        return []
                    })
                },
                Fb: function(a, b) {
                    b = gc(b);
                    dc(a, {
                        name: b,
                        fromWireType: function(d) {
                            var f = $c(d);
                            Zc(d);
                            return f
                        },
                        toWireType: function(d, f) { return zc(f) },
                        argPackAdvance: 8,
                        readValueFromPointer: Ob,
                        fe: null
                    })
                },
                m: function(a, b, d, f) {
                    function h() {}
                    d = ec(d);
                    b = gc(b);
                    h.values = {};
                    dc(a, {
                        name: b,
                        constructor: h,
                        fromWireType: function(l) { return this.constructor.values[l] },
                        toWireType: function(l, n) { return n.value },
                        argPackAdvance: 8,
                        readValueFromPointer: ad(b,
                            d, f),
                        fe: null
                    });
                    tc(b, h)
                },
                l: function(a, b, d) {
                    var f = bd(a, "enum");
                    b = gc(b);
                    a = f.constructor;
                    f = Object.create(f.constructor.prototype, { value: { value: d }, constructor: { value: Tb(f.name + "_" + b, function() {}) } });
                    a.values[d] = f;
                    a[b] = f
                },
                S: function(a, b, d) {
                    d = ec(d);
                    b = gc(b);
                    dc(a, { name: b, fromWireType: function(f) { return f }, toWireType: function(f, h) { return h }, argPackAdvance: 8, readValueFromPointer: cd(b, d), fe: null })
                },
                s: function(a, b, d, f, h, l) {
                    var n = Wc(b, d);
                    a = gc(a);
                    h = Pc(f, h);
                    tc(a, function() {
                        Uc("Cannot call " + a + " due to unbound types",
                            n)
                    }, b - 1);
                    Xb([], n, function(q) {
                        q = [q[0], null].concat(q.slice(1));
                        Gc(a, Vc(a, q, null, h, l), b - 1);
                        return []
                    })
                },
                z: function(a, b, d, f, h) {
                    b = gc(b); - 1 === h && (h = 4294967295);
                    h = ec(d);
                    var l = q => q;
                    if (0 === f) {
                        var n = 32 - 8 * d;
                        l = q => q << n >>> n
                    }
                    d = b.includes("unsigned") ? function(q, w) { return w >>> 0 } : function(q, w) { return w };
                    dc(a, { name: b, fromWireType: l, toWireType: d, argPackAdvance: 8, readValueFromPointer: dd(b, h, 0 !== f), fe: null })
                },
                q: function(a, b, d) {
                    function f(l) { l >>= 2; var n = ob; return new h(mb, n[l + 1], n[l]) }
                    var h = [Int8Array, Uint8Array, Int16Array,
                        Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array
                    ][b];
                    d = gc(d);
                    dc(a, { name: d, fromWireType: f, argPackAdvance: 8, readValueFromPointer: f }, { Wf: !0 })
                },
                n: function(a, b, d, f, h, l, n, q, w, x, K, J) {
                    d = gc(d);
                    l = Pc(h, l);
                    q = Pc(n, q);
                    x = Pc(w, x);
                    J = Pc(K, J);
                    Xb([a], [b], function(Q) { Q = Q[0]; return [new Fc(d, Q.Td, !1, !1, !0, Q, f, l, q, x, J)] })
                },
                R: function(a, b) {
                    b = gc(b);
                    var d = "std::string" === b;
                    dc(a, {
                        name: b,
                        fromWireType: function(f) {
                            var h = ob[f >> 2];
                            if (d)
                                for (var l = f + 4, n = 0; n <= h; ++n) {
                                    var q = f + 4 + n;
                                    if (n == h || 0 == H[q]) {
                                        l = Xa(l, q - l);
                                        if (void 0 ===
                                            w) var w = l;
                                        else w += String.fromCharCode(0), w += l;
                                        l = q + 1
                                    }
                                } else {
                                    w = Array(h);
                                    for (n = 0; n < h; ++n) w[n] = String.fromCharCode(H[f + 4 + n]);
                                    w = w.join("")
                                }
                            Tc(f);
                            return w
                        },
                        toWireType: function(f, h) {
                            h instanceof ArrayBuffer && (h = new Uint8Array(h));
                            var l = "string" === typeof h;
                            l || h instanceof Uint8Array || h instanceof Uint8ClampedArray || h instanceof Int8Array || X("Cannot pass non-string to std::string");
                            var n = (d && l ? () => sa(h) : () => h.length)(),
                                q = Od(4 + n + 1);
                            ob[q >> 2] = n;
                            if (d && l) ta(h, H, q + 4, n + 1);
                            else if (l)
                                for (l = 0; l < n; ++l) {
                                    var w = h.charCodeAt(l);
                                    255 < w && (Tc(q), X("String has UTF-16 code units that do not fit in 8 bits"));
                                    H[q + 4 + l] = w
                                } else
                                    for (l = 0; l < n; ++l) H[q + 4 + l] = h[l];
                            null !== f && f.push(Tc, q);
                            return q
                        },
                        argPackAdvance: 8,
                        readValueFromPointer: Ob,
                        fe: function(f) { Tc(f) }
                    })
                },
                I: function(a, b, d) {
                    d = gc(d);
                    if (2 === b) { var f = ab; var h = db; var l = eb; var n = () => bb; var q = 1 } else 4 === b && (f = jb, h = kb, l = lb, n = () => ob, q = 2);
                    dc(a, {
                        name: d,
                        fromWireType: function(w) {
                            for (var x = ob[w >> 2], K = n(), J, Q = w + 4, A = 0; A <= x; ++A) {
                                var M = w + 4 + A * b;
                                if (A == x || 0 == K[M >> q]) Q = f(Q, M - Q), void 0 === J ? J = Q : (J += String.fromCharCode(0),
                                    J += Q), Q = M + b
                            }
                            Tc(w);
                            return J
                        },
                        toWireType: function(w, x) {
                            "string" !== typeof x && X("Cannot pass non-string to C++ string type " + d);
                            var K = l(x),
                                J = Od(4 + K + b);
                            ob[J >> 2] = K >> q;
                            h(x, J + 4, K + b);
                            null !== w && w.push(Tc, J);
                            return J
                        },
                        argPackAdvance: 8,
                        readValueFromPointer: Ob,
                        fe: function(w) { Tc(w) }
                    })
                },
                w: function(a, b, d, f, h, l) { Mb[a] = { name: gc(b), hf: Pc(d, f), le: Pc(h, l), rf: [] } },
                i: function(a, b, d, f, h, l, n, q, w, x) { Mb[a].rf.push({ Lf: gc(b), Uf: d, Sf: Pc(f, h), Tf: l, og: n, ng: Pc(q, w), pg: x }) },
                Hb: function(a, b) {
                    b = gc(b);
                    dc(a, {
                        Zf: !0,
                        name: b,
                        argPackAdvance: 0,
                        fromWireType: function() {},
                        toWireType: function() {}
                    })
                },
                rb: function() { throw "longjmp"; },
                A: function(a, b, d) {
                    a = $c(a);
                    b = bd(b, "emval::as");
                    var f = [],
                        h = zc(f);
                    P[d >> 2] = h;
                    return b.toWireType(f, a)
                },
                D: function(a, b, d, f, h) {
                    a = gd[a];
                    b = $c(b);
                    d = fd(d);
                    var l = [];
                    P[f >> 2] = zc(l);
                    return a(b, d, l, h)
                },
                B: function(a, b, d, f) {
                    a = gd[a];
                    b = $c(b);
                    d = fd(d);
                    a(b, d, null, f)
                },
                E: Zc,
                Db: function(a) {
                    if (0 === a) return zc(hd());
                    a = fd(a);
                    return zc(hd()[a])
                },
                y: function(a, b) {
                    var d = kd(a, b),
                        f = d[0];
                    b = f.name + "_$" + d.slice(1).map(function(n) { return n.name }).join("_") +
                        "$";
                    var h = ld[b];
                    if (void 0 !== h) return h;
                    var l = Array(a - 1);
                    h = jd((n, q, w, x) => {
                        for (var K = 0, J = 0; J < a - 1; ++J) l[J] = d[J + 1].readValueFromPointer(x + K), K += d[J + 1].argPackAdvance;
                        n = n[q].apply(n, l);
                        for (J = 0; J < a - 1; ++J) d[J + 1].Hf && d[J + 1].Hf(l[J]);
                        if (!f.Zf) return f.toWireType(w, n)
                    });
                    return ld[b] = h
                },
                L: function(a, b) {
                    a = $c(a);
                    b = $c(b);
                    return zc(a[b])
                },
                G: function(a) { 4 < a && (Yc[a].jf += 1) },
                tb: function(a, b, d, f) {
                    a = $c(a);
                    var h = nd[b];
                    h || (h = md(b), nd[b] = h);
                    return h(a, d, f)
                },
                ib: function() { return zc([]) },
                Ma: function(a) { return zc(fd(a)) },
                jb: function() { return zc({}) },
                hb: function(a) { a = $c(a); return !a },
                lb: function(a) {
                    var b = $c(a);
                    Nb(b);
                    Zc(a)
                },
                u: function(a, b, d) {
                    a = $c(a);
                    b = $c(b);
                    d = $c(d);
                    a[b] = d
                },
                t: function(a, b) {
                    a = bd(a, "_emval_take_value");
                    a = a.readValueFromPointer(b);
                    return zc(a)
                },
                a: function() { Ra("") },
                qb: function(a, b) {
                    if (0 === a) a = Date.now();
                    else if (1 === a || 4 === a) a = od();
                    else return P[je() >> 2] = 28, -1;
                    P[b >> 2] = a / 1E3 | 0;
                    P[b + 4 >> 2] = a % 1E3 * 1E6 | 0;
                    return 0
                },
                _c: function(a) { Y.activeTexture(a) },
                $c: function(a, b) { Y.attachShader(ud[a], xd[b]) },
                ad: function(a, b, d) {
                    Y.bindAttribLocation(ud[a],
                        b, Xa(d))
                },
                _: function(a, b) {
                    35051 == a ? Y.ff = b : 35052 == a && (Y.Ce = b);
                    Y.bindBuffer(a, td[b])
                },
                Z: function(a, b) { Y.bindFramebuffer(a, vd[b]) },
                cc: function(a, b) { Y.bindRenderbuffer(a, wd[b]) },
                Qb: function(a, b) { Y.bindSampler(a, zd[b]) },
                $: function(a, b) { Y.bindTexture(a, la[b]) },
                wc: function(a) { Y.bindVertexArray(yd[a]) },
                zc: function(a) { Y.bindVertexArray(yd[a]) },
                aa: function(a, b, d, f) { Y.blendColor(a, b, d, f) },
                ba: function(a) { Y.blendEquation(a) },
                ca: function(a, b) { Y.blendFunc(a, b) },
                Xb: function(a, b, d, f, h, l, n, q, w, x) {
                    Y.blitFramebuffer(a,
                        b, d, f, h, l, n, q, w, x)
                },
                da: function(a, b, d, f) { 2 <= v.version ? d ? Y.bufferData(a, H, f, d, b) : Y.bufferData(a, b, f) : Y.bufferData(a, d ? H.subarray(d, d + b) : b, f) },
                ea: function(a, b, d, f) { 2 <= v.version ? Y.bufferSubData(a, b, H, f, d) : Y.bufferSubData(a, b, H.subarray(f, f + d)) },
                dc: function(a) { return Y.checkFramebufferStatus(a) },
                M: function(a) { Y.clear(a) },
                Y: function(a, b, d, f) { Y.clearColor(a, b, d, f) },
                O: function(a) { Y.clearStencil(a) },
                fb: function(a, b, d, f) { return Y.clientWaitSync(Ad[a], b, (d >>> 0) + 4294967296 * f) },
                fa: function(a, b, d, f) {
                    Y.colorMask(!!a, !!b, !!d, !!f)
                },
                ga: function(a) { Y.compileShader(xd[a]) },
                ha: function(a, b, d, f, h, l, n, q) { 2 <= v.version ? Y.Ce ? Y.compressedTexImage2D(a, b, d, f, h, l, n, q) : Y.compressedTexImage2D(a, b, d, f, h, l, H, q, n) : Y.compressedTexImage2D(a, b, d, f, h, l, q ? H.subarray(q, q + n) : null) },
                ia: function(a, b, d, f, h, l, n, q, w) { 2 <= v.version ? Y.Ce ? Y.compressedTexSubImage2D(a, b, d, f, h, l, n, q, w) : Y.compressedTexSubImage2D(a, b, d, f, h, l, n, H, w, q) : Y.compressedTexSubImage2D(a, b, d, f, h, l, n, w ? H.subarray(w, w + q) : null) },
                ja: function(a, b, d, f, h, l, n, q) {
                    Y.copyTexSubImage2D(a,
                        b, d, f, h, l, n, q)
                },
                ka: function() {
                    var a = ka(ud),
                        b = Y.createProgram();
                    b.name = a;
                    b.Xe = b.Ve = b.We = 0;
                    b.kf = 1;
                    ud[a] = b;
                    return a
                },
                la: function(a) {
                    var b = ka(xd);
                    xd[b] = Y.createShader(a);
                    return b
                },
                ma: function(a) { Y.cullFace(a) },
                na: function(a, b) {
                    for (var d = 0; d < a; d++) {
                        var f = P[b + 4 * d >> 2],
                            h = td[f];
                        h && (Y.deleteBuffer(h), h.name = 0, td[f] = null, f == Y.ff && (Y.ff = 0), f == Y.Ce && (Y.Ce = 0))
                    }
                },
                ec: function(a, b) {
                    for (var d = 0; d < a; ++d) {
                        var f = P[b + 4 * d >> 2],
                            h = vd[f];
                        h && (Y.deleteFramebuffer(h), h.name = 0, vd[f] = null)
                    }
                },
                oa: function(a) {
                    if (a) {
                        var b = ud[a];
                        b ? (Y.deleteProgram(b),
                            b.name = 0, ud[a] = null) : Ed(1281)
                    }
                },
                fc: function(a, b) {
                    for (var d = 0; d < a; d++) {
                        var f = P[b + 4 * d >> 2],
                            h = wd[f];
                        h && (Y.deleteRenderbuffer(h), h.name = 0, wd[f] = null)
                    }
                },
                Rb: function(a, b) {
                    for (var d = 0; d < a; d++) {
                        var f = P[b + 4 * d >> 2],
                            h = zd[f];
                        h && (Y.deleteSampler(h), h.name = 0, zd[f] = null)
                    }
                },
                pa: function(a) {
                    if (a) {
                        var b = xd[a];
                        b ? (Y.deleteShader(b), xd[a] = null) : Ed(1281)
                    }
                },
                Zb: function(a) {
                    if (a) {
                        var b = Ad[a];
                        b ? (Y.deleteSync(b), b.name = 0, Ad[a] = null) : Ed(1281)
                    }
                },
                qa: function(a, b) {
                    for (var d = 0; d < a; d++) {
                        var f = P[b + 4 * d >> 2],
                            h = la[f];
                        h && (Y.deleteTexture(h),
                            h.name = 0, la[f] = null)
                    }
                },
                xc: function(a, b) {
                    for (var d = 0; d < a; d++) {
                        var f = P[b + 4 * d >> 2];
                        Y.deleteVertexArray(yd[f]);
                        yd[f] = null
                    }
                },
                Ac: function(a, b) {
                    for (var d = 0; d < a; d++) {
                        var f = P[b + 4 * d >> 2];
                        Y.deleteVertexArray(yd[f]);
                        yd[f] = null
                    }
                },
                ra: function(a) { Y.depthMask(!!a) },
                sa: function(a) { Y.disable(a) },
                ta: function(a) { Y.disableVertexAttribArray(a) },
                ua: function(a, b, d) { Y.drawArrays(a, b, d) },
                uc: function(a, b, d, f) { Y.drawArraysInstanced(a, b, d, f) },
                sc: function(a, b, d, f, h) { Y.pf.drawArraysInstancedBaseInstanceWEBGL(a, b, d, f, h) },
                qc: function(a,
                    b) {
                    for (var d = Kd[a], f = 0; f < a; f++) d[f] = P[b + 4 * f >> 2];
                    Y.drawBuffers(d)
                },
                va: function(a, b, d, f) { Y.drawElements(a, b, d, f) },
                vc: function(a, b, d, f, h) { Y.drawElementsInstanced(a, b, d, f, h) },
                tc: function(a, b, d, f, h, l, n) { Y.pf.drawElementsInstancedBaseVertexBaseInstanceWEBGL(a, b, d, f, h, l, n) },
                kc: function(a, b, d, f, h, l) { Y.drawElements(a, f, h, l) },
                wa: function(a) { Y.enable(a) },
                xa: function(a) { Y.enableVertexAttribArray(a) },
                Vb: function(a, b) { return (a = Y.fenceSync(a, b)) ? (b = ka(Ad), a.name = b, Ad[b] = a, b) : 0 },
                ya: function() { Y.finish() },
                za: function() { Y.flush() },
                gc: function(a, b, d, f) { Y.framebufferRenderbuffer(a, b, d, wd[f]) },
                hc: function(a, b, d, f, h) { Y.framebufferTexture2D(a, b, d, la[f], h) },
                Aa: function(a) { Y.frontFace(a) },
                Ba: function(a, b) { Ld(a, b, "createBuffer", td) },
                ic: function(a, b) { Ld(a, b, "createFramebuffer", vd) },
                jc: function(a, b) { Ld(a, b, "createRenderbuffer", wd) },
                Sb: function(a, b) { Ld(a, b, "createSampler", zd) },
                Ca: function(a, b) { Ld(a, b, "createTexture", la) },
                yc: function(a, b) { Ld(a, b, "createVertexArray", yd) },
                Bc: function(a, b) { Ld(a, b, "createVertexArray", yd) },
                _b: function(a) { Y.generateMipmap(a) },
                Da: function(a, b, d) { d ? P[d >> 2] = Y.getBufferParameter(a, b) : Ed(1281) },
                Ea: function() {
                    var a = Y.getError() || Hd;
                    Hd = 0;
                    return a
                },
                $b: function(a, b, d, f) {
                    a = Y.getFramebufferAttachmentParameter(a, b, d);
                    if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) a = a.name | 0;
                    P[f >> 2] = a
                },
                F: function(a, b) { Md(a, b) },
                Fa: function(a, b, d, f) {
                    a = Y.getProgramInfoLog(ud[a]);
                    null === a && (a = "(unknown error)");
                    b = 0 < b && f ? ta(a, H, f, b) : 0;
                    d && (P[d >> 2] = b)
                },
                Ga: function(a, b, d) {
                    if (d)
                        if (a >= sd) Ed(1281);
                        else if (a = ud[a], 35716 == b) a = Y.getProgramInfoLog(a),
                        null === a && (a = "(unknown error)"), P[d >> 2] = a.length + 1;
                    else if (35719 == b) {
                        if (!a.Xe)
                            for (b = 0; b < Y.getProgramParameter(a, 35718); ++b) a.Xe = Math.max(a.Xe, Y.getActiveUniform(a, b).name.length + 1);
                        P[d >> 2] = a.Xe
                    } else if (35722 == b) {
                        if (!a.Ve)
                            for (b = 0; b < Y.getProgramParameter(a, 35721); ++b) a.Ve = Math.max(a.Ve, Y.getActiveAttrib(a, b).name.length + 1);
                        P[d >> 2] = a.Ve
                    } else if (35381 == b) {
                        if (!a.We)
                            for (b = 0; b < Y.getProgramParameter(a, 35382); ++b) a.We = Math.max(a.We, Y.getActiveUniformBlockName(a, b).length + 1);
                        P[d >> 2] = a.We
                    } else P[d >> 2] = Y.getProgramParameter(a,
                        b);
                    else Ed(1281)
                },
                ac: function(a, b, d) { d ? P[d >> 2] = Y.getRenderbufferParameter(a, b) : Ed(1281) },
                Ha: function(a, b, d, f) {
                    a = Y.getShaderInfoLog(xd[a]);
                    null === a && (a = "(unknown error)");
                    b = 0 < b && f ? ta(a, H, f, b) : 0;
                    d && (P[d >> 2] = b)
                },
                Nb: function(a, b, d, f) {
                    a = Y.getShaderPrecisionFormat(a, b);
                    P[d >> 2] = a.rangeMin;
                    P[d + 4 >> 2] = a.rangeMax;
                    P[f >> 2] = a.precision
                },
                Ia: function(a, b, d) {
                    d ? 35716 == b ? (a = Y.getShaderInfoLog(xd[a]), null === a && (a = "(unknown error)"), P[d >> 2] = a ? a.length + 1 : 0) : 35720 == b ? (a = Y.getShaderSource(xd[a]), P[d >> 2] = a ? a.length + 1 : 0) :
                        P[d >> 2] = Y.getShaderParameter(xd[a], b) : Ed(1281)
                },
                K: function(a) {
                    var b = Bd[a];
                    if (!b) {
                        switch (a) {
                            case 7939:
                                b = Y.getSupportedExtensions() || [];
                                b = b.concat(b.map(function(f) { return "GL_" + f }));
                                b = Nd(b.join(" "));
                                break;
                            case 7936:
                            case 7937:
                            case 37445:
                            case 37446:
                                (b = Y.getParameter(a)) || Ed(1280);
                                b = b && Nd(b);
                                break;
                            case 7938:
                                b = Y.getParameter(7938);
                                b = 2 <= v.version ? "OpenGL ES 3.0 (" + b + ")" : "OpenGL ES 2.0 (" + b + ")";
                                b = Nd(b);
                                break;
                            case 35724:
                                b = Y.getParameter(35724);
                                var d = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
                                null !== d && (3 == d[1].length && (d[1] += "0"), b = "OpenGL ES GLSL ES " + d[1] + " (" + b + ")");
                                b = Nd(b);
                                break;
                            default:
                                Ed(1280)
                        }
                        Bd[a] = b
                    }
                    return b
                },
                eb: function(a, b) {
                    if (2 > v.version) return Ed(1282), 0;
                    var d = Cd[a];
                    if (d) return 0 > b || b >= d.length ? (Ed(1281), 0) : d[b];
                    switch (a) {
                        case 7939:
                            return d = Y.getSupportedExtensions() || [], d = d.concat(d.map(function(f) { return "GL_" + f })), d = d.map(function(f) { return Nd(f) }), d = Cd[a] = d, 0 > b || b >= d.length ? (Ed(1281), 0) : d[b];
                        default:
                            return Ed(1280), 0
                    }
                },
                Ja: function(a, b) {
                    b = Xa(b);
                    if (a = ud[a]) {
                        var d = a,
                            f = d.Oe,
                            h = d.xf,
                            l;
                        if (!f)
                            for (d.Oe = f = {}, d.wf = {}, l = 0; l < Y.getProgramParameter(d, 35718); ++l) {
                                var n = Y.getActiveUniform(d, l);
                                var q = n.name;
                                n = n.size;
                                var w = Pd(q);
                                w = 0 < w ? q.slice(0, w) : q;
                                var x = d.kf;
                                d.kf += n;
                                h[w] = [n, x];
                                for (q = 0; q < n; ++q) f[x] = q, d.wf[x++] = w
                            }
                        d = a.Oe;
                        f = 0;
                        h = b;
                        l = Pd(b);
                        0 < l && (f = parseInt(b.slice(l + 1)) >>> 0, h = b.slice(0, l));
                        if ((h = a.xf[h]) && f < h[0] && (f += h[1], d[f] = d[f] || Y.getUniformLocation(a, b))) return f
                    } else Ed(1281);
                    return -1
                },
                Ob: function(a, b, d) {
                    for (var f = Kd[b], h = 0; h < b; h++) f[h] = P[d + 4 * h >> 2];
                    Y.invalidateFramebuffer(a, f)
                },
                Pb: function(a, b, d, f, h, l, n) {
                    for (var q = Kd[b], w = 0; w < b; w++) q[w] = P[d + 4 * w >> 2];
                    Y.invalidateSubFramebuffer(a, q, f, h, l, n)
                },
                Wb: function(a) { return Y.isSync(Ad[a]) },
                Ka: function(a) { return (a = la[a]) ? Y.isTexture(a) : 0 },
                La: function(a) { Y.lineWidth(a) },
                Na: function(a) {
                    a = ud[a];
                    Y.linkProgram(a);
                    a.Oe = 0;
                    a.xf = {}
                },
                oc: function(a, b, d, f, h, l) { Y.uf.multiDrawArraysInstancedBaseInstanceWEBGL(a, P, b >> 2, P, d >> 2, P, f >> 2, ob, h >> 2, l) },
                pc: function(a, b, d, f, h, l, n, q) {
                    Y.uf.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(a, P, b >> 2, d, P, f >> 2,
                        P, h >> 2, P, l >> 2, ob, n >> 2, q)
                },
                Oa: function(a, b) {
                    3317 == a && (Dd = b);
                    Y.pixelStorei(a, b)
                },
                rc: function(a) { Y.readBuffer(a) },
                Pa: function(a, b, d, f, h, l, n) {
                    if (2 <= v.version)
                        if (Y.ff) Y.readPixels(a, b, d, f, h, l, n);
                        else {
                            var q = Qd(l);
                            Y.readPixels(a, b, d, f, h, l, q, n >> 31 - Math.clz32(q.BYTES_PER_ELEMENT))
                        }
                    else(n = Rd(l, h, d, f, n)) ? Y.readPixels(a, b, d, f, h, l, n) : Ed(1280)
                },
                bc: function(a, b, d, f) { Y.renderbufferStorage(a, b, d, f) },
                Yb: function(a, b, d, f, h) { Y.renderbufferStorageMultisample(a, b, d, f, h) },
                Tb: function(a, b, d) {
                    Y.samplerParameteri(zd[a], b,
                        d)
                },
                Ub: function(a, b, d) { Y.samplerParameteri(zd[a], b, P[d >> 2]) },
                Qa: function(a, b, d, f) { Y.scissor(a, b, d, f) },
                Ra: function(a, b, d, f) {
                    for (var h = "", l = 0; l < b; ++l) {
                        var n = f ? P[f + 4 * l >> 2] : -1;
                        h += Xa(P[d + 4 * l >> 2], 0 > n ? void 0 : n)
                    }
                    Y.shaderSource(xd[a], h)
                },
                Sa: function(a, b, d) { Y.stencilFunc(a, b, d) },
                Ta: function(a, b, d, f) { Y.stencilFuncSeparate(a, b, d, f) },
                Ua: function(a) { Y.stencilMask(a) },
                Va: function(a, b) { Y.stencilMaskSeparate(a, b) },
                Wa: function(a, b, d) { Y.stencilOp(a, b, d) },
                Xa: function(a, b, d, f) { Y.stencilOpSeparate(a, b, d, f) },
                Ya: function(a,
                    b, d, f, h, l, n, q, w) {
                    if (2 <= v.version)
                        if (Y.Ce) Y.texImage2D(a, b, d, f, h, l, n, q, w);
                        else if (w) {
                        var x = Qd(q);
                        Y.texImage2D(a, b, d, f, h, l, n, q, x, w >> 31 - Math.clz32(x.BYTES_PER_ELEMENT))
                    } else Y.texImage2D(a, b, d, f, h, l, n, q, null);
                    else Y.texImage2D(a, b, d, f, h, l, n, q, w ? Rd(q, n, f, h, w) : null)
                },
                Za: function(a, b, d) { Y.texParameterf(a, b, d) },
                _a: function(a, b, d) { Y.texParameterf(a, b, W[d >> 2]) },
                $a: function(a, b, d) { Y.texParameteri(a, b, d) },
                ab: function(a, b, d) { Y.texParameteri(a, b, P[d >> 2]) },
                lc: function(a, b, d, f, h) { Y.texStorage2D(a, b, d, f, h) },
                bb: function(a,
                    b, d, f, h, l, n, q, w) {
                    if (2 <= v.version)
                        if (Y.Ce) Y.texSubImage2D(a, b, d, f, h, l, n, q, w);
                        else if (w) {
                        var x = Qd(q);
                        Y.texSubImage2D(a, b, d, f, h, l, n, q, x, w >> 31 - Math.clz32(x.BYTES_PER_ELEMENT))
                    } else Y.texSubImage2D(a, b, d, f, h, l, n, q, null);
                    else x = null, w && (x = Rd(q, n, h, l, w)), Y.texSubImage2D(a, b, d, f, h, l, n, q, x)
                },
                cb: function(a, b) { Y.uniform1f(Z(a), b) },
                db: function(a, b, d) {
                    if (2 <= v.version) Y.uniform1fv(Z(a), W, d >> 2, b);
                    else {
                        if (288 >= b)
                            for (var f = Sd[b - 1], h = 0; h < b; ++h) f[h] = W[d + 4 * h >> 2];
                        else f = W.subarray(d >> 2, d + 4 * b >> 2);
                        Y.uniform1fv(Z(a), f)
                    }
                },
                Wc: function(a, b) { Y.uniform1i(Z(a), b) },
                Xc: function(a, b, d) {
                    if (2 <= v.version) Y.uniform1iv(Z(a), P, d >> 2, b);
                    else {
                        if (288 >= b)
                            for (var f = Td[b - 1], h = 0; h < b; ++h) f[h] = P[d + 4 * h >> 2];
                        else f = P.subarray(d >> 2, d + 4 * b >> 2);
                        Y.uniform1iv(Z(a), f)
                    }
                },
                Yc: function(a, b, d) { Y.uniform2f(Z(a), b, d) },
                Zc: function(a, b, d) {
                    if (2 <= v.version) Y.uniform2fv(Z(a), W, d >> 2, 2 * b);
                    else {
                        if (144 >= b)
                            for (var f = Sd[2 * b - 1], h = 0; h < 2 * b; h += 2) f[h] = W[d + 4 * h >> 2], f[h + 1] = W[d + (4 * h + 4) >> 2];
                        else f = W.subarray(d >> 2, d + 8 * b >> 2);
                        Y.uniform2fv(Z(a), f)
                    }
                },
                Vc: function(a, b, d) {
                    Y.uniform2i(Z(a),
                        b, d)
                },
                Uc: function(a, b, d) {
                    if (2 <= v.version) Y.uniform2iv(Z(a), P, d >> 2, 2 * b);
                    else {
                        if (144 >= b)
                            for (var f = Td[2 * b - 1], h = 0; h < 2 * b; h += 2) f[h] = P[d + 4 * h >> 2], f[h + 1] = P[d + (4 * h + 4) >> 2];
                        else f = P.subarray(d >> 2, d + 8 * b >> 2);
                        Y.uniform2iv(Z(a), f)
                    }
                },
                Tc: function(a, b, d, f) { Y.uniform3f(Z(a), b, d, f) },
                Sc: function(a, b, d) {
                    if (2 <= v.version) Y.uniform3fv(Z(a), W, d >> 2, 3 * b);
                    else {
                        if (96 >= b)
                            for (var f = Sd[3 * b - 1], h = 0; h < 3 * b; h += 3) f[h] = W[d + 4 * h >> 2], f[h + 1] = W[d + (4 * h + 4) >> 2], f[h + 2] = W[d + (4 * h + 8) >> 2];
                        else f = W.subarray(d >> 2, d + 12 * b >> 2);
                        Y.uniform3fv(Z(a), f)
                    }
                },
                Rc: function(a,
                    b, d, f) { Y.uniform3i(Z(a), b, d, f) },
                Qc: function(a, b, d) {
                    if (2 <= v.version) Y.uniform3iv(Z(a), P, d >> 2, 3 * b);
                    else {
                        if (96 >= b)
                            for (var f = Td[3 * b - 1], h = 0; h < 3 * b; h += 3) f[h] = P[d + 4 * h >> 2], f[h + 1] = P[d + (4 * h + 4) >> 2], f[h + 2] = P[d + (4 * h + 8) >> 2];
                        else f = P.subarray(d >> 2, d + 12 * b >> 2);
                        Y.uniform3iv(Z(a), f)
                    }
                },
                Pc: function(a, b, d, f, h) { Y.uniform4f(Z(a), b, d, f, h) },
                Oc: function(a, b, d) {
                    if (2 <= v.version) Y.uniform4fv(Z(a), W, d >> 2, 4 * b);
                    else {
                        if (72 >= b) {
                            var f = Sd[4 * b - 1],
                                h = W;
                            d >>= 2;
                            for (var l = 0; l < 4 * b; l += 4) {
                                var n = d + l;
                                f[l] = h[n];
                                f[l + 1] = h[n + 1];
                                f[l + 2] = h[n + 2];
                                f[l + 3] =
                                    h[n + 3]
                            }
                        } else f = W.subarray(d >> 2, d + 16 * b >> 2);
                        Y.uniform4fv(Z(a), f)
                    }
                },
                Cc: function(a, b, d, f, h) { Y.uniform4i(Z(a), b, d, f, h) },
                Dc: function(a, b, d) {
                    if (2 <= v.version) Y.uniform4iv(Z(a), P, d >> 2, 4 * b);
                    else {
                        if (72 >= b)
                            for (var f = Td[4 * b - 1], h = 0; h < 4 * b; h += 4) f[h] = P[d + 4 * h >> 2], f[h + 1] = P[d + (4 * h + 4) >> 2], f[h + 2] = P[d + (4 * h + 8) >> 2], f[h + 3] = P[d + (4 * h + 12) >> 2];
                        else f = P.subarray(d >> 2, d + 16 * b >> 2);
                        Y.uniform4iv(Z(a), f)
                    }
                },
                Ec: function(a, b, d, f) {
                    if (2 <= v.version) Y.uniformMatrix2fv(Z(a), !!d, W, f >> 2, 4 * b);
                    else {
                        if (72 >= b)
                            for (var h = Sd[4 * b - 1], l = 0; l < 4 * b; l += 4) h[l] =
                                W[f + 4 * l >> 2], h[l + 1] = W[f + (4 * l + 4) >> 2], h[l + 2] = W[f + (4 * l + 8) >> 2], h[l + 3] = W[f + (4 * l + 12) >> 2];
                        else h = W.subarray(f >> 2, f + 16 * b >> 2);
                        Y.uniformMatrix2fv(Z(a), !!d, h)
                    }
                },
                Fc: function(a, b, d, f) {
                    if (2 <= v.version) Y.uniformMatrix3fv(Z(a), !!d, W, f >> 2, 9 * b);
                    else {
                        if (32 >= b)
                            for (var h = Sd[9 * b - 1], l = 0; l < 9 * b; l += 9) h[l] = W[f + 4 * l >> 2], h[l + 1] = W[f + (4 * l + 4) >> 2], h[l + 2] = W[f + (4 * l + 8) >> 2], h[l + 3] = W[f + (4 * l + 12) >> 2], h[l + 4] = W[f + (4 * l + 16) >> 2], h[l + 5] = W[f + (4 * l + 20) >> 2], h[l + 6] = W[f + (4 * l + 24) >> 2], h[l + 7] = W[f + (4 * l + 28) >> 2], h[l + 8] = W[f + (4 * l + 32) >> 2];
                        else h = W.subarray(f >>
                            2, f + 36 * b >> 2);
                        Y.uniformMatrix3fv(Z(a), !!d, h)
                    }
                },
                Gc: function(a, b, d, f) {
                    if (2 <= v.version) Y.uniformMatrix4fv(Z(a), !!d, W, f >> 2, 16 * b);
                    else {
                        if (18 >= b) {
                            var h = Sd[16 * b - 1],
                                l = W;
                            f >>= 2;
                            for (var n = 0; n < 16 * b; n += 16) {
                                var q = f + n;
                                h[n] = l[q];
                                h[n + 1] = l[q + 1];
                                h[n + 2] = l[q + 2];
                                h[n + 3] = l[q + 3];
                                h[n + 4] = l[q + 4];
                                h[n + 5] = l[q + 5];
                                h[n + 6] = l[q + 6];
                                h[n + 7] = l[q + 7];
                                h[n + 8] = l[q + 8];
                                h[n + 9] = l[q + 9];
                                h[n + 10] = l[q + 10];
                                h[n + 11] = l[q + 11];
                                h[n + 12] = l[q + 12];
                                h[n + 13] = l[q + 13];
                                h[n + 14] = l[q + 14];
                                h[n + 15] = l[q + 15]
                            }
                        } else h = W.subarray(f >> 2, f + 64 * b >> 2);
                        Y.uniformMatrix4fv(Z(a), !!d, h)
                    }
                },
                Hc: function(a) {
                    a = ud[a];
                    Y.useProgram(a);
                    Y.Gf = a
                },
                Ic: function(a, b) { Y.vertexAttrib1f(a, b) },
                Jc: function(a, b) { Y.vertexAttrib2f(a, W[b >> 2], W[b + 4 >> 2]) },
                Kc: function(a, b) { Y.vertexAttrib3f(a, W[b >> 2], W[b + 4 >> 2], W[b + 8 >> 2]) },
                Lc: function(a, b) { Y.vertexAttrib4f(a, W[b >> 2], W[b + 4 >> 2], W[b + 8 >> 2], W[b + 12 >> 2]) },
                mc: function(a, b) { Y.vertexAttribDivisor(a, b) },
                nc: function(a, b, d, f, h) { Y.vertexAttribIPointer(a, b, d, f, h) },
                Mc: function(a, b, d, f, h, l) { Y.vertexAttribPointer(a, b, d, !!f, h, l) },
                Nc: function(a, b, d, f) { Y.viewport(a, b, d, f) },
                gb: function(a,
                    b, d, f) { Y.waitSync(Ad[a], b, (d >>> 0) + 4294967296 * f) },
                sb: function(a) {
                    var b = H.length;
                    a >>>= 0;
                    if (2147483648 < a) return !1;
                    for (var d = 1; 4 >= d; d *= 2) {
                        var f = b * (1 + .2 / d);
                        f = Math.min(f, a + 100663296);
                        f = Math.max(a, f);
                        0 < f % 65536 && (f += 65536 - f % 65536);
                        a: {
                            try {
                                Sa.grow(Math.min(2147483648, f) - mb.byteLength + 65535 >>> 16);
                                qb();
                                var h = 1;
                                break a
                            } catch (l) {}
                            h = void 0
                        }
                        if (h) return !0
                    }
                    return !1
                },
                kb: function() { return v ? v.Vf : 0 },
                wb: function(a, b) {
                    var d = 0;
                    Vd().forEach(function(f, h) {
                        var l = b + d;
                        h = P[a + 4 * h >> 2] = l;
                        for (l = 0; l < f.length; ++l) nb[h++ >> 0] = f.charCodeAt(l);
                        nb[h >> 0] = 0;
                        d += f.length + 1
                    });
                    return 0
                },
                xb: function(a, b) {
                    var d = Vd();
                    P[a >> 2] = d.length;
                    var f = 0;
                    d.forEach(function(h) { f += h.length + 1 });
                    P[b >> 2] = f;
                    return 0
                },
                Ib: function(a) {
                    if (!(noExitRuntime || 0 < La)) {
                        if (u.onExit) u.onExit(a);
                        Ua = !0
                    }
                    ya(a, new Ka(a))
                },
                H: function() { return 0 },
                mb: function(a, b, d, f, h, l) {
                    a = Lb.Rf(a);
                    b = Lb.If(a, b, d, f);
                    P[l >> 2] = b;
                    return 0
                },
                Cb: function(a, b, d, f) {
                    a = Lb.Rf(a);
                    b = Lb.If(a, b, d);
                    P[f >> 2] = b;
                    return 0
                },
                nb: function() {},
                N: function(a, b, d, f) {
                    for (var h = 0, l = 0; l < d; l++) {
                        var n = P[b >> 2],
                            q = P[b + 4 >> 2];
                        b += 8;
                        for (var w =
                                0; w < q; w++) {
                            var x = H[n + w],
                                K = Kb[a];
                            0 === x || 10 === x ? ((1 === a ? Na : Ma)(Wa(K, 0)), K.length = 0) : K.push(x)
                        }
                        h += q
                    }
                    P[f >> 2] = h;
                    return 0
                },
                b: function() { return Pa },
                h: ke,
                o: le,
                f: me,
                C: ne,
                Mb: oe,
                V: pe,
                U: qe,
                J: re,
                j: se,
                r: te,
                g: ue,
                p: ve,
                Lb: we,
                Jb: xe,
                Kb: ye,
                c: function(a) { Pa = a },
                pb: function(a, b, d, f) { return be(a, b, d, f) }
            };
            (function() {
                function a(h) {
                    u.asm = h.exports;
                    Sa = u.asm.bd;
                    qb();
                    rb = u.asm.ed;
                    tb.unshift(u.asm.cd);
                    wb--;
                    u.monitorRunDependencies && u.monitorRunDependencies(wb);
                    0 == wb && (null !== xb && (clearInterval(xb), xb = null), zb && (h = zb, zb = null, h()))
                }

                function b(h) { a(h.instance) }

                function d(h) {
                    return Eb().then(function(l) { return WebAssembly.instantiate(l, f) }).then(function(l) { return l }).then(h, function(l) {
                        Ma("failed to asynchronously prepare wasm: " + l);
                        Ra(l)
                    })
                }
                var f = { a: ze };
                wb++;
                u.monitorRunDependencies && u.monitorRunDependencies(wb);
                if (u.instantiateWasm) try { return u.instantiateWasm(f, a) } catch (h) { return Ma("Module.instantiateWasm callback failed with error: " + h), !1 }(function() {
                    return Qa || "function" !== typeof WebAssembly.instantiateStreaming || Ab() || Bb.startsWith("file://") || "function" !== typeof fetch ? d(b) : fetch(Bb, { credentials: "same-origin" }).then(function(h) {
                        return WebAssembly.instantiateStreaming(h, f).then(b, function(l) {
                            Ma("wasm streaming compile failed: " + l);
                            Ma("falling back to ArrayBuffer instantiation");
                            return d(b)
                        })
                    })
                })().catch(ia);
                return {}
            })();
            u.___wasm_call_ctors = function() { return (u.___wasm_call_ctors = u.asm.cd).apply(null, arguments) };
            var Od = u._malloc = function() { return (Od = u._malloc = u.asm.dd).apply(null, arguments) },
                Tc = u._free = function() { return (Tc = u._free = u.asm.fd).apply(null, arguments) },
                je = u.___errno_location = function() { return (je = u.___errno_location = u.asm.gd).apply(null, arguments) },
                Sc = u.___getTypeName = function() { return (Sc = u.___getTypeName = u.asm.hd).apply(null, arguments) };
            u.___embind_register_native_and_builtin_types = function() { return (u.___embind_register_native_and_builtin_types = u.asm.id).apply(null, arguments) };
            var ie = u._memalign = function() { return (ie = u._memalign = u.asm.jd).apply(null, arguments) },
                Ae = u._setThrew = function() { return (Ae = u._setThrew = u.asm.kd).apply(null, arguments) },
                Be = u.stackSave = function() { return (Be = u.stackSave = u.asm.ld).apply(null, arguments) },
                Ce = u.stackRestore = function() { return (Ce = u.stackRestore = u.asm.md).apply(null, arguments) };
            u.dynCall_iiiji = function() { return (u.dynCall_iiiji = u.asm.nd).apply(null, arguments) };
            u.dynCall_ji = function() { return (u.dynCall_ji = u.asm.od).apply(null, arguments) };
            u.dynCall_iiji = function() { return (u.dynCall_iiji = u.asm.pd).apply(null, arguments) };
            u.dynCall_iijjiii = function() { return (u.dynCall_iijjiii = u.asm.qd).apply(null, arguments) };
            u.dynCall_iij = function() { return (u.dynCall_iij = u.asm.rd).apply(null, arguments) };
            u.dynCall_vijjjii = function() { return (u.dynCall_vijjjii = u.asm.sd).apply(null, arguments) };
            u.dynCall_viji = function() { return (u.dynCall_viji = u.asm.td).apply(null, arguments) };
            u.dynCall_vijiii = function() { return (u.dynCall_vijiii = u.asm.ud).apply(null, arguments) };
            u.dynCall_viiiiij = function() { return (u.dynCall_viiiiij = u.asm.vd).apply(null, arguments) };
            u.dynCall_jii = function() { return (u.dynCall_jii = u.asm.wd).apply(null, arguments) };
            u.dynCall_iiij = function() { return (u.dynCall_iiij = u.asm.xd).apply(null, arguments) };
            u.dynCall_iiiij = function() { return (u.dynCall_iiiij = u.asm.yd).apply(null, arguments) };
            u.dynCall_viij = function() { return (u.dynCall_viij = u.asm.zd).apply(null, arguments) };
            u.dynCall_viiij = function() { return (u.dynCall_viiij = u.asm.Ad).apply(null, arguments) };
            u.dynCall_vij = function() { return (u.dynCall_vij = u.asm.Bd).apply(null, arguments) };
            u.dynCall_jiiii = function() { return (u.dynCall_jiiii = u.asm.Cd).apply(null, arguments) };
            u.dynCall_jiiiiii = function() { return (u.dynCall_jiiiiii = u.asm.Dd).apply(null, arguments) };
            u.dynCall_jiiiiji = function() { return (u.dynCall_jiiiiji = u.asm.Ed).apply(null, arguments) };
            u.dynCall_iijj = function() { return (u.dynCall_iijj = u.asm.Fd).apply(null, arguments) };
            u.dynCall_jiji = function() { return (u.dynCall_jiji = u.asm.Gd).apply(null, arguments) };
            u.dynCall_viijii = function() { return (u.dynCall_viijii = u.asm.Hd).apply(null, arguments) };
            u.dynCall_iiiiij = function() { return (u.dynCall_iiiiij = u.asm.Id).apply(null, arguments) };
            u.dynCall_iiiiijj = function() { return (u.dynCall_iiiiijj = u.asm.Jd).apply(null, arguments) };
            u.dynCall_iiiiiijj = function() { return (u.dynCall_iiiiiijj = u.asm.Kd).apply(null, arguments) };

            function ke(a, b) {
                var d = Be();
                try { return Gb(a)(b) } catch (f) {
                    Ce(d);
                    if (f !== f + 0 && "longjmp" !== f) throw f;
                    Ae(1, 0)
                }
            }

            function le(a, b, d) {
                var f = Be();
                try { return Gb(a)(b, d) } catch (h) {
                    Ce(f);
                    if (h !== h + 0 && "longjmp" !== h) throw h;
                    Ae(1, 0)
                }
            }

            function ue(a, b, d, f) {
                var h = Be();
                try { Gb(a)(b, d, f) } catch (l) {
                    Ce(h);
                    if (l !== l + 0 && "longjmp" !== l) throw l;
                    Ae(1, 0)
                }
            }

            function me(a, b, d, f) {
                var h = Be();
                try { return Gb(a)(b, d, f) } catch (l) {
                    Ce(h);
                    if (l !== l + 0 && "longjmp" !== l) throw l;
                    Ae(1, 0)
                }
            }

            function se(a, b) {
                var d = Be();
                try { Gb(a)(b) } catch (f) {
                    Ce(d);
                    if (f !== f + 0 && "longjmp" !== f) throw f;
                    Ae(1, 0)
                }
            }

            function te(a, b, d) {
                var f = Be();
                try { Gb(a)(b, d) } catch (h) {
                    Ce(f);
                    if (h !== h + 0 && "longjmp" !== h) throw h;
                    Ae(1, 0)
                }
            }

            function oe(a, b, d, f, h, l) {
                var n = Be();
                try { return Gb(a)(b, d, f, h, l) } catch (q) {
                    Ce(n);
                    if (q !== q + 0 && "longjmp" !== q) throw q;
                    Ae(1, 0)
                }
            }

            function ve(a, b, d, f, h) {
                var l = Be();
                try { Gb(a)(b, d, f, h) } catch (n) {
                    Ce(l);
                    if (n !== n + 0 && "longjmp" !== n) throw n;
                    Ae(1, 0)
                }
            }

            function pe(a, b, d, f, h, l, n) {
                var q = Be();
                try { return Gb(a)(b, d, f, h, l, n) } catch (w) {
                    Ce(q);
                    if (w !== w + 0 && "longjmp" !== w) throw w;
                    Ae(1, 0)
                }
            }

            function ne(a, b, d, f, h) {
                var l = Be();
                try { return Gb(a)(b, d, f, h) } catch (n) {
                    Ce(l);
                    if (n !== n + 0 && "longjmp" !== n) throw n;
                    Ae(1, 0)
                }
            }

            function we(a, b, d, f, h, l) {
                var n = Be();
                try { Gb(a)(b, d, f, h, l) } catch (q) {
                    Ce(n);
                    if (q !== q + 0 && "longjmp" !== q) throw q;
                    Ae(1, 0)
                }
            }

            function ye(a, b, d, f, h, l, n, q, w, x) {
                var K = Be();
                try { Gb(a)(b, d, f, h, l, n, q, w, x) } catch (J) {
                    Ce(K);
                    if (J !== J + 0 && "longjmp" !== J) throw J;
                    Ae(1, 0)
                }
            }

            function re(a) {
                var b = Be();
                try { Gb(a)() } catch (d) {
                    Ce(b);
                    if (d !== d + 0 && "longjmp" !== d) throw d;
                    Ae(1, 0)
                }
            }

            function xe(a, b, d, f, h, l, n) {
                var q = Be();
                try { Gb(a)(b, d, f, h, l, n) } catch (w) {
                    Ce(q);
                    if (w !== w + 0 && "longjmp" !== w) throw w;
                    Ae(1, 0)
                }
            }

            function qe(a, b, d, f, h, l, n, q, w, x) {
                var K = Be();
                try { return Gb(a)(b, d, f, h, l, n, q, w, x) } catch (J) {
                    Ce(K);
                    if (J !== J + 0 && "longjmp" !== J) throw J;
                    Ae(1, 0)
                }
            }
            var De;

            function Ka(a) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + a + ")";
                this.status = a
            }
            zb = function Ee() {
                De || Fe();
                De || (zb = Ee)
            };

            function Fe() {
                function a() {
                    if (!De && (De = !0, u.calledRun = !0, !Ua)) {
                        Fb(tb);
                        ha(u);
                        if (u.onRuntimeInitialized) u.onRuntimeInitialized();
                        if (u.postRun)
                            for ("function" == typeof u.postRun && (u.postRun = [u.postRun]); u.postRun.length;) {
                                var b = u.postRun.shift();
                                ub.unshift(b)
                            }
                        Fb(ub)
                    }
                }
                if (!(0 < wb)) {
                    if (u.preRun)
                        for ("function" == typeof u.preRun && (u.preRun = [u.preRun]); u.preRun.length;) vb();
                    Fb(sb);
                    0 < wb || (u.setStatus ? (u.setStatus("Running..."), setTimeout(function() {
                        setTimeout(function() { u.setStatus("") }, 1);
                        a()
                    }, 1)) : a())
                }
            }
            u.run = Fe;
            if (u.preInit)
                for ("function" == typeof u.preInit && (u.preInit = [u.preInit]); 0 < u.preInit.length;) u.preInit.pop()();
            Fe();


            return CanvasKitInit.ready
        }
    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = CanvasKitInit;
else if (typeof define === 'function' && define['amd'])
    define([], function() { return CanvasKitInit; });
else if (typeof exports === 'object')
    exports["CanvasKitInit"] = CanvasKitInit;