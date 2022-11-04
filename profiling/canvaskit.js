var CanvasKitInit = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function(CanvasKitInit) {
            CanvasKitInit = CanvasKitInit || {};

            null;
            var Module = typeof CanvasKitInit !== "undefined" ? CanvasKitInit : {};
            var objAssign = Object.assign;
            var readyPromiseResolve, readyPromiseReject;
            Module["ready"] = new Promise(function(resolve, reject) {
                readyPromiseResolve = resolve;
                readyPromiseReject = reject
            });

            function Debug(msg) {}
            var IsDebug = false;
            (function(CanvasKit) {
                CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                CanvasKit._extraInitializations.push(function() {
                    CanvasKit.MakeSWCanvasSurface = function(idOrElement) { var canvas = idOrElement; if (canvas.tagName !== "CANVAS") { canvas = document.getElementById(idOrElement); if (!canvas) { throw "Canvas with id " + idOrElement + " was not found" } } var surface = CanvasKit.MakeSurface(canvas.width, canvas.height); if (surface) { surface._canvas = canvas } return surface };
                    if (!CanvasKit.MakeCanvasSurface) { CanvasKit.MakeCanvasSurface = CanvasKit.MakeSWCanvasSurface }
                    CanvasKit.MakeSurface = function(width, height) {
                        var imageInfo = { "width": width, "height": height, "colorType": CanvasKit.ColorType.RGBA_8888, "alphaType": CanvasKit.AlphaType.Unpremul, "colorSpace": CanvasKit.ColorSpace.SRGB };
                        var pixelLen = width * height * 4;
                        var pixelPtr = CanvasKit._malloc(pixelLen);
                        var surface = CanvasKit.Surface._makeRasterDirect(imageInfo, pixelPtr, width * 4);
                        if (surface) {
                            surface._canvas = null;
                            surface._width = width;
                            surface._height = height;
                            surface._pixelLen = pixelLen;
                            surface._pixelPtr = pixelPtr;
                            surface.getCanvas().clear(CanvasKit.TRANSPARENT)
                        }
                        return surface
                    };
                    CanvasKit.MakeRasterDirectSurface = function(imageInfo, mallocObj, bytesPerRow) { return CanvasKit.Surface._makeRasterDirect(imageInfo, mallocObj["byteOffset"], bytesPerRow) };
                    CanvasKit.Surface.prototype.flush = function(dirtyRect) {
                        CanvasKit.setCurrentContext(this._context);
                        this._flush();
                        if (this._canvas) { var pixels = new Uint8ClampedArray(CanvasKit.HEAPU8.buffer, this._pixelPtr, this._pixelLen); var imageData = new ImageData(pixels, this._width, this._height); if (!dirtyRect) { this._canvas.getContext("2d").putImageData(imageData, 0, 0) } else { this._canvas.getContext("2d").putImageData(imageData, 0, 0, dirtyRect[0], dirtyRect[1], dirtyRect[2] - dirtyRect[0], dirtyRect[3] - dirtyRect[1]) } }
                    };
                    CanvasKit.Surface.prototype.dispose = function() {
                        if (this._pixelPtr) { CanvasKit._free(this._pixelPtr) }
                        this.delete()
                    };
                    CanvasKit.setCurrentContext = CanvasKit.setCurrentContext || function() {}
                })
            })(Module);
            (function(CanvasKit) {
                CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                CanvasKit._extraInitializations.push(function() {
                    function get(obj, attr, defaultValue) { if (obj && obj.hasOwnProperty(attr)) { return obj[attr] } return defaultValue }
                    CanvasKit.GetWebGLContext = function(canvas, attrs) {
                        if (!canvas) { throw "null canvas passed into makeWebGLContext" }
                        var contextAttributes = { "alpha": get(attrs, "alpha", 1), "depth": get(attrs, "depth", 1), "stencil": get(attrs, "stencil", 8), "antialias": get(attrs, "antialias", 0), "premultipliedAlpha": get(attrs, "premultipliedAlpha", 1), "preserveDrawingBuffer": get(attrs, "preserveDrawingBuffer", 0), "preferLowPowerToHighPerformance": get(attrs, "preferLowPowerToHighPerformance", 0), "failIfMajorPerformanceCaveat": get(attrs, "failIfMajorPerformanceCaveat", 0), "enableExtensionsByDefault": get(attrs, "enableExtensionsByDefault", 1), "explicitSwapControl": get(attrs, "explicitSwapControl", 0), "renderViaOffscreenBackBuffer": get(attrs, "renderViaOffscreenBackBuffer", 0) };
                        if (attrs && attrs["majorVersion"]) { contextAttributes["majorVersion"] = attrs["majorVersion"] } else { contextAttributes["majorVersion"] = typeof WebGL2RenderingContext !== "undefined" ? 2 : 1 }
                        if (contextAttributes["explicitSwapControl"]) { throw "explicitSwapControl is not supported" }
                        var handle = GL.createContext(canvas, contextAttributes);
                        if (!handle) { return 0 }
                        GL.makeContextCurrent(handle);
                        return handle
                    };
                    CanvasKit.deleteContext = function(handle) { GL.deleteContext(handle) };
                    CanvasKit._setTextureCleanup({
                        "deleteTexture": function(webglHandle, texHandle) {
                            var tex = GL.textures[texHandle];
                            if (tex) { GL.getContext(webglHandle).GLctx.deleteTexture(tex) }
                            GL.textures[texHandle] = null
                        }
                    });
                    CanvasKit.MakeGrContext = function(ctx) {
                        if (!this.setCurrentContext(ctx)) { return null }
                        var grCtx = this._MakeGrContext();
                        if (!grCtx) { return null }
                        grCtx._context = ctx;
                        return grCtx
                    };
                    CanvasKit.MakeOnScreenGLSurface = function(grCtx, w, h, colorspace) {
                        if (!this.setCurrentContext(grCtx._context)) { return null }
                        var surface = this._MakeOnScreenGLSurface(grCtx, w, h, colorspace);
                        if (!surface) { return null }
                        surface._context = grCtx._context;
                        return surface
                    };
                    CanvasKit.MakeRenderTarget = function() {
                        var grCtx = arguments[0];
                        if (!this.setCurrentContext(grCtx._context)) { return null }
                        var surface;
                        if (arguments.length === 3) { surface = this._MakeRenderTargetWH(grCtx, arguments[1], arguments[2]); if (!surface) { return null } } else if (arguments.length === 2) { surface = this._MakeRenderTargetII(grCtx, arguments[1]); if (!surface) { return null } } else { Debug("Expected 2 or 3 params"); return null }
                        surface._context = grCtx._context;
                        return surface
                    };
                    CanvasKit.MakeWebGLCanvasSurface = function(idOrElement, colorSpace, attrs) {
                        colorSpace = colorSpace || null;
                        var canvas = idOrElement;
                        var isHTMLCanvas = typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement;
                        var isOffscreenCanvas = typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas;
                        if (!isHTMLCanvas && !isOffscreenCanvas) { canvas = document.getElementById(idOrElement); if (!canvas) { throw "Canvas with id " + idOrElement + " was not found" } }
                        var ctx = this.GetWebGLContext(canvas, attrs);
                        if (!ctx || ctx < 0) { throw "failed to create webgl context: err " + ctx }
                        var grcontext = this.MakeGrContext(ctx);
                        var surface = this.MakeOnScreenGLSurface(grcontext, canvas.width, canvas.height, colorSpace);
                        if (!surface) {
                            Debug("falling back from GPU implementation to a SW based one");
                            var newCanvas = canvas.cloneNode(true);
                            var parent = canvas.parentNode;
                            parent.replaceChild(newCanvas, canvas);
                            newCanvas.classList.add("ck-replaced");
                            return CanvasKit.MakeSWCanvasSurface(newCanvas)
                        }
                        return surface
                    };
                    CanvasKit.MakeCanvasSurface = CanvasKit.MakeWebGLCanvasSurface;

                    function pushTexture(tex) {
                        var texHandle = GL.getNewId(GL.textures);
                        GL.textures[texHandle] = tex;
                        return texHandle
                    }
                    CanvasKit.Surface.prototype.makeImageFromTexture = function(tex, info) { CanvasKit.setCurrentContext(this._context); var texHandle = pushTexture(tex); var img = this._makeImageFromTexture(this._context, texHandle, info); if (img) { img._tex = texHandle } return img };

                    function getHeight(src) { return src["naturalHeight"] || src["videoHeight"] || src["displayHeight"] || src["height"] }

                    function getWidth(src) { return src["naturalWidth"] || src["videoWidth"] || src["displayWidth"] || src["width"] }
                    CanvasKit.Surface.prototype.makeImageFromTextureSource = function(src, info) {
                        if (!info) { info = { "height": getHeight(src), "width": getWidth(src), "colorType": CanvasKit.ColorType.RGBA_8888, "alphaType": CanvasKit.AlphaType.Unpremul } }
                        if (!info["colorSpace"]) { info["colorSpace"] = CanvasKit.ColorSpace.SRGB }
                        if (info["colorType"] !== CanvasKit.ColorType.RGBA_8888) { Debug("colorType currently has no impact on makeImageFromTextureSource") }
                        CanvasKit.setCurrentContext(this._context);
                        var glCtx = GL.currentContext.GLctx;
                        var newTex = glCtx.createTexture();
                        glCtx.bindTexture(glCtx.TEXTURE_2D, newTex);
                        if (GL.currentContext.version === 2) { glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, info["width"], info["height"], 0, glCtx.RGBA, glCtx.UNSIGNED_BYTE, src) } else { glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, glCtx.RGBA, glCtx.UNSIGNED_BYTE, src) }
                        glCtx.bindTexture(glCtx.TEXTURE_2D, null);
                        return this.makeImageFromTexture(newTex, info)
                    };
                    CanvasKit.Surface.prototype.updateTextureFromSource = function(img, src) {
                        if (!img._tex) { Debug("Image is not backed by a user-provided texture"); return }
                        CanvasKit.setCurrentContext(this._context);
                        var glCtx = GL.currentContext.GLctx;
                        var tex = GL.textures[img._tex];
                        glCtx.bindTexture(glCtx.TEXTURE_2D, tex);
                        if (GL.currentContext.version === 2) { glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, getWidth(src), getHeight(src), 0, glCtx.RGBA, glCtx.UNSIGNED_BYTE, src) } else { glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, glCtx.RGBA, glCtx.UNSIGNED_BYTE, src) }
                        glCtx.bindTexture(glCtx.TEXTURE_2D, null);
                        this._resetContext();
                        GL.textures[img._tex] = null;
                        img._tex = pushTexture(tex);
                        var ii = img.getImageInfo();
                        ii["colorSpace"] = img.getColorSpace();
                        var newImg = this._makeImageFromTexture(this._context, img._tex, ii);
                        var oldPtr = img.$$.ptr;
                        var oldSmartPtr = img.$$.smartPtr;
                        img.$$.ptr = newImg.$$.ptr;
                        img.$$.smartPtr = newImg.$$.smartPtr;
                        newImg.$$.ptr = oldPtr;
                        newImg.$$.smartPtr = oldSmartPtr;
                        newImg.delete();
                        ii["colorSpace"].delete()
                    };
                    CanvasKit.MakeLazyImageFromTextureSource = function(src, info) {
                        if (!info) { info = { "height": getHeight(src), "width": getWidth(src), "colorType": CanvasKit.ColorType.RGBA_8888, "alphaType": CanvasKit.AlphaType.Unpremul } }
                        if (!info["colorSpace"]) { info["colorSpace"] = CanvasKit.ColorSpace.SRGB }
                        if (info["colorType"] !== CanvasKit.ColorType.RGBA_8888) { Debug("colorType currently has no impact on MakeLazyImageFromTextureSource") }
                        var callbackObj = {
                            "makeTexture": function() {
                                var ctx = GL.currentContext;
                                var glCtx = ctx.GLctx;
                                var newTex = glCtx.createTexture();
                                glCtx.bindTexture(glCtx.TEXTURE_2D, newTex);
                                if (ctx.version === 2) { glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, info["width"], info["height"], 0, glCtx.RGBA, glCtx.UNSIGNED_BYTE, src) } else { glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, glCtx.RGBA, glCtx.UNSIGNED_BYTE, src) }
                                glCtx.bindTexture(glCtx.TEXTURE_2D, null);
                                return pushTexture(newTex)
                            },
                            "freeSrc": function() {}
                        };
                        if (src.constructor.name === "VideoFrame") { callbackObj["freeSrc"] = function() { src.close() } }
                        return CanvasKit.Image._makeFromGenerator(info, callbackObj)
                    };
                    CanvasKit.setCurrentContext = function(ctx) { if (!ctx) { return false } return GL.makeContextCurrent(ctx) }
                })
            })(Module);
            (function(CanvasKit) {
                CanvasKit.Color = function(r, g, b, a) { if (a === undefined) { a = 1 } return CanvasKit.Color4f(clamp(r) / 255, clamp(g) / 255, clamp(b) / 255, a) };
                CanvasKit.ColorAsInt = function(r, g, b, a) { if (a === undefined) { a = 255 } return (clamp(a) << 24 | clamp(r) << 16 | clamp(g) << 8 | clamp(b) << 0 & 268435455) >>> 0 };
                CanvasKit.Color4f = function(r, g, b, a) { if (a === undefined) { a = 1 } return Float32Array.of(r, g, b, a) };
                Object.defineProperty(CanvasKit, "TRANSPARENT", { get: function() { return CanvasKit.Color4f(0, 0, 0, 0) } });
                Object.defineProperty(CanvasKit, "BLACK", { get: function() { return CanvasKit.Color4f(0, 0, 0, 1) } });
                Object.defineProperty(CanvasKit, "WHITE", { get: function() { return CanvasKit.Color4f(1, 1, 1, 1) } });
                Object.defineProperty(CanvasKit, "RED", { get: function() { return CanvasKit.Color4f(1, 0, 0, 1) } });
                Object.defineProperty(CanvasKit, "GREEN", { get: function() { return CanvasKit.Color4f(0, 1, 0, 1) } });
                Object.defineProperty(CanvasKit, "BLUE", { get: function() { return CanvasKit.Color4f(0, 0, 1, 1) } });
                Object.defineProperty(CanvasKit, "YELLOW", { get: function() { return CanvasKit.Color4f(1, 1, 0, 1) } });
                Object.defineProperty(CanvasKit, "CYAN", { get: function() { return CanvasKit.Color4f(0, 1, 1, 1) } });
                Object.defineProperty(CanvasKit, "MAGENTA", { get: function() { return CanvasKit.Color4f(1, 0, 1, 1) } });
                CanvasKit.getColorComponents = function(color) { return [Math.floor(color[0] * 255), Math.floor(color[1] * 255), Math.floor(color[2] * 255), color[3]] };
                CanvasKit.parseColorString = function(colorStr, colorMap) {
                    colorStr = colorStr.toLowerCase();
                    if (colorStr.startsWith("#")) {
                        var r, g, b, a = 255;
                        switch (colorStr.length) {
                            case 9:
                                a = parseInt(colorStr.slice(7, 9), 16);
                            case 7:
                                r = parseInt(colorStr.slice(1, 3), 16);
                                g = parseInt(colorStr.slice(3, 5), 16);
                                b = parseInt(colorStr.slice(5, 7), 16);
                                break;
                            case 5:
                                a = parseInt(colorStr.slice(4, 5), 16) * 17;
                            case 4:
                                r = parseInt(colorStr.slice(1, 2), 16) * 17;
                                g = parseInt(colorStr.slice(2, 3), 16) * 17;
                                b = parseInt(colorStr.slice(3, 4), 16) * 17;
                                break
                        }
                        return CanvasKit.Color(r, g, b, a / 255)
                    } else if (colorStr.startsWith("rgba")) { colorStr = colorStr.slice(5, -1); var nums = colorStr.split(","); return CanvasKit.Color(+nums[0], +nums[1], +nums[2], valueOrPercent(nums[3])) } else if (colorStr.startsWith("rgb")) { colorStr = colorStr.slice(4, -1); var nums = colorStr.split(","); return CanvasKit.Color(+nums[0], +nums[1], +nums[2], valueOrPercent(nums[3])) } else if (colorStr.startsWith("gray(")) {} else if (colorStr.startsWith("hsl")) {} else if (colorMap) { var nc = colorMap[colorStr]; if (nc !== undefined) { return nc } }
                    Debug("unrecognized color " + colorStr);
                    return CanvasKit.BLACK
                };

                function isCanvasKitColor(ob) { if (!ob) { return false } return ob.constructor === Float32Array && ob.length === 4 }

                function toUint32Color(c) { return (clamp(c[3] * 255) << 24 | clamp(c[0] * 255) << 16 | clamp(c[1] * 255) << 8 | clamp(c[2] * 255) << 0) >>> 0 }

                function assureIntColors(arr) { if (wasMalloced(arr)) { return arr } else if (arr instanceof Float32Array) { var count = Math.floor(arr.length / 4); var result = new Uint32Array(count); for (var i = 0; i < count; i++) { result[i] = toUint32Color(arr.slice(i * 4, (i + 1) * 4)) } return result } else if (arr instanceof Uint32Array) { return arr } else if (arr instanceof Array && arr[0] instanceof Float32Array) { return arr.map(toUint32Color) } }

                function valueOrPercent(aStr) { if (aStr === undefined) { return 1 } var a = parseFloat(aStr); if (aStr && aStr.indexOf("%") !== -1) { return a / 100 } return a }

                function clamp(c) { return Math.round(Math.max(0, Math.min(c || 0, 255))) }
                CanvasKit.multiplyByAlpha = function(color, alpha) {
                    var result = color.slice();
                    result[3] = Math.max(0, Math.min(result[3] * alpha, 1));
                    return result
                };
                CanvasKit.Malloc = function(typedArray, len) {
                    var byteLen = len * typedArray.BYTES_PER_ELEMENT;
                    var ptr = CanvasKit._malloc(byteLen);
                    return {
                        "_ck": true,
                        "length": len,
                        "byteOffset": ptr,
                        typedArray: null,
                        "subarray": function(start, end) {
                            var sa = this["toTypedArray"]().subarray(start, end);
                            sa["_ck"] = true;
                            return sa
                        },
                        "toTypedArray": function() {
                            if (this.typedArray && this.typedArray.length) { return this.typedArray }
                            this.typedArray = new typedArray(CanvasKit.HEAPU8.buffer, ptr, len);
                            this.typedArray["_ck"] = true;
                            return this.typedArray
                        }
                    }
                };
                CanvasKit.Free = function(mallocObj) {
                    CanvasKit._free(mallocObj["byteOffset"]);
                    mallocObj["byteOffset"] = nullptr;
                    mallocObj["toTypedArray"] = null;
                    mallocObj.typedArray = null
                };

                function freeArraysThatAreNotMallocedByUsers(ptr, arr) { if (!wasMalloced(arr)) { CanvasKit._free(ptr) } }

                function wasMalloced(obj) { return obj && obj["_ck"] }
                var _scratch3x3MatrixPtr = nullptr;
                var _scratch3x3Matrix;
                var _scratch4x4MatrixPtr = nullptr;
                var _scratch4x4Matrix;
                var _scratchColorPtr = nullptr;
                var _scratchColor;
                var _scratchFourFloatsA;
                var _scratchFourFloatsAPtr = nullptr;
                var _scratchFourFloatsB;
                var _scratchFourFloatsBPtr = nullptr;
                var _scratchThreeFloatsA;
                var _scratchThreeFloatsAPtr = nullptr;
                var _scratchThreeFloatsB;
                var _scratchThreeFloatsBPtr = nullptr;
                var _scratchIRect;
                var _scratchIRectPtr = nullptr;
                var _scratchRRect;
                var _scratchRRectPtr = nullptr;
                var _scratchRRect2;
                var _scratchRRect2Ptr = nullptr;

                function copy1dArray(arr, dest, ptr) {
                    if (!arr || !arr.length) { return nullptr }
                    if (wasMalloced(arr)) { return arr.byteOffset }
                    var bytesPerElement = CanvasKit[dest].BYTES_PER_ELEMENT;
                    if (!ptr) { ptr = CanvasKit._malloc(arr.length * bytesPerElement) }
                    CanvasKit[dest].set(arr, ptr / bytesPerElement);
                    return ptr
                }

                function copyFlexibleColorArray(colors) {
                    var result = { colorPtr: nullptr, count: colors.length, colorType: CanvasKit.ColorType.RGBA_F32 };
                    if (colors instanceof Float32Array) {
                        result.colorPtr = copy1dArray(colors, "HEAPF32");
                        result.count = colors.length / 4
                    } else if (colors instanceof Uint32Array) {
                        result.colorPtr = copy1dArray(colors, "HEAPU32");
                        result.colorType = CanvasKit.ColorType.RGBA_8888
                    } else if (colors instanceof Array) { result.colorPtr = copyColorArray(colors) } else { throw "Invalid argument to copyFlexibleColorArray, Not a color array " + typeof colors }
                    return result
                }

                function copyColorArray(arr) {
                    if (!arr || !arr.length) { return nullptr }
                    var ptr = CanvasKit._malloc(arr.length * 4 * 4);
                    var idx = 0;
                    var adjustedPtr = ptr / 4;
                    for (var r = 0; r < arr.length; r++) {
                        for (var c = 0; c < 4; c++) {
                            CanvasKit.HEAPF32[adjustedPtr + idx] = arr[r][c];
                            idx++
                        }
                    }
                    return ptr
                }
                var defaultPerspective = Float32Array.of(0, 0, 1);

                function copy3x3MatrixToWasm(matr) {
                    if (!matr) { return nullptr }
                    if (matr.length) {
                        if (matr.length === 6 || matr.length === 9) { copy1dArray(matr, "HEAPF32", _scratch3x3MatrixPtr); if (matr.length === 6) { CanvasKit.HEAPF32.set(defaultPerspective, 6 + _scratch3x3MatrixPtr / 4) } return _scratch3x3MatrixPtr } else if (matr.length === 16) {
                            var wasm3x3Matrix = _scratch3x3Matrix["toTypedArray"]();
                            wasm3x3Matrix[0] = matr[0];
                            wasm3x3Matrix[1] = matr[1];
                            wasm3x3Matrix[2] = matr[3];
                            wasm3x3Matrix[3] = matr[4];
                            wasm3x3Matrix[4] = matr[5];
                            wasm3x3Matrix[5] = matr[7];
                            wasm3x3Matrix[6] = matr[12];
                            wasm3x3Matrix[7] = matr[13];
                            wasm3x3Matrix[8] = matr[15];
                            return _scratch3x3MatrixPtr
                        }
                        throw "invalid matrix size"
                    }
                    var wasm3x3Matrix = _scratch3x3Matrix["toTypedArray"]();
                    wasm3x3Matrix[0] = matr.m11;
                    wasm3x3Matrix[1] = matr.m21;
                    wasm3x3Matrix[2] = matr.m41;
                    wasm3x3Matrix[3] = matr.m12;
                    wasm3x3Matrix[4] = matr.m22;
                    wasm3x3Matrix[5] = matr.m42;
                    wasm3x3Matrix[6] = matr.m14;
                    wasm3x3Matrix[7] = matr.m24;
                    wasm3x3Matrix[8] = matr.m44;
                    return _scratch3x3MatrixPtr
                }

                function copy4x4MatrixToWasm(matr) {
                    if (!matr) { return nullptr }
                    var wasm4x4Matrix = _scratch4x4Matrix["toTypedArray"]();
                    if (matr.length) {
                        if (matr.length !== 16 && matr.length !== 6 && matr.length !== 9) { throw "invalid matrix size" }
                        if (matr.length === 16) { return copy1dArray(matr, "HEAPF32", _scratch4x4MatrixPtr) }
                        wasm4x4Matrix.fill(0);
                        wasm4x4Matrix[0] = matr[0];
                        wasm4x4Matrix[1] = matr[1];
                        wasm4x4Matrix[3] = matr[2];
                        wasm4x4Matrix[4] = matr[3];
                        wasm4x4Matrix[5] = matr[4];
                        wasm4x4Matrix[7] = matr[5];
                        wasm4x4Matrix[12] = matr[6];
                        wasm4x4Matrix[13] = matr[7];
                        wasm4x4Matrix[15] = matr[8];
                        if (matr.length === 6) {
                            wasm4x4Matrix[12] = 0;
                            wasm4x4Matrix[13] = 0;
                            wasm4x4Matrix[15] = 1
                        }
                        return _scratch4x4MatrixPtr
                    }
                    wasm4x4Matrix[0] = matr.m11;
                    wasm4x4Matrix[1] = matr.m21;
                    wasm4x4Matrix[2] = matr.m31;
                    wasm4x4Matrix[3] = matr.m41;
                    wasm4x4Matrix[4] = matr.m12;
                    wasm4x4Matrix[5] = matr.m22;
                    wasm4x4Matrix[6] = matr.m32;
                    wasm4x4Matrix[7] = matr.m42;
                    wasm4x4Matrix[8] = matr.m13;
                    wasm4x4Matrix[9] = matr.m23;
                    wasm4x4Matrix[10] = matr.m33;
                    wasm4x4Matrix[11] = matr.m43;
                    wasm4x4Matrix[12] = matr.m14;
                    wasm4x4Matrix[13] = matr.m24;
                    wasm4x4Matrix[14] = matr.m34;
                    wasm4x4Matrix[15] = matr.m44;
                    return _scratch4x4MatrixPtr
                }

                function copy4x4MatrixFromWasm(matrPtr) { var rv = new Array(16); for (var i = 0; i < 16; i++) { rv[i] = CanvasKit.HEAPF32[matrPtr / 4 + i] } return rv }

                function copyColorToWasm(color4f, ptr) { return copy1dArray(color4f, "HEAPF32", ptr || _scratchColorPtr) }

                function copyColorComponentsToWasm(r, g, b, a) {
                    var colors = _scratchColor["toTypedArray"]();
                    colors[0] = r;
                    colors[1] = g;
                    colors[2] = b;
                    colors[3] = a;
                    return _scratchColorPtr
                }

                function copyColorToWasmNoScratch(color4f) { return copy1dArray(color4f, "HEAPF32") }

                function copyColorFromWasm(colorPtr) { var rv = new Float32Array(4); for (var i = 0; i < 4; i++) { rv[i] = CanvasKit.HEAPF32[colorPtr / 4 + i] } return rv }

                function copyRectToWasm(fourFloats, ptr) { return copy1dArray(fourFloats, "HEAPF32", ptr || _scratchFourFloatsAPtr) }

                function copyIRectToWasm(fourInts, ptr) { return copy1dArray(fourInts, "HEAP32", ptr || _scratchIRectPtr) }

                function copyRRectToWasm(twelveFloats, ptr) { return copy1dArray(twelveFloats, "HEAPF32", ptr || _scratchRRectPtr) }
                var nullptr = 0;

                function radiansToDegrees(rad) { return rad / Math.PI * 180 }

                function almostEqual(floata, floatb) { return Math.abs(floata - floatb) < 1e-5 }
                CanvasKit.onRuntimeInitialized = function() {
                    _scratchColor = CanvasKit.Malloc(Float32Array, 4);
                    _scratchColorPtr = _scratchColor["byteOffset"];
                    _scratch4x4Matrix = CanvasKit.Malloc(Float32Array, 16);
                    _scratch4x4MatrixPtr = _scratch4x4Matrix["byteOffset"];
                    _scratch3x3Matrix = CanvasKit.Malloc(Float32Array, 9);
                    _scratch3x3MatrixPtr = _scratch3x3Matrix["byteOffset"];
                    _scratchRRect = CanvasKit.Malloc(Float32Array, 12);
                    _scratchRRectPtr = _scratchRRect["byteOffset"];
                    _scratchRRect2 = CanvasKit.Malloc(Float32Array, 12);
                    _scratchRRect2Ptr = _scratchRRect2["byteOffset"];
                    _scratchFourFloatsA = CanvasKit.Malloc(Float32Array, 4);
                    _scratchFourFloatsAPtr = _scratchFourFloatsA["byteOffset"];
                    _scratchFourFloatsB = CanvasKit.Malloc(Float32Array, 4);
                    _scratchFourFloatsBPtr = _scratchFourFloatsB["byteOffset"];
                    _scratchThreeFloatsA = CanvasKit.Malloc(Float32Array, 3);
                    _scratchThreeFloatsAPtr = _scratchThreeFloatsA["byteOffset"];
                    _scratchThreeFloatsB = CanvasKit.Malloc(Float32Array, 3);
                    _scratchThreeFloatsBPtr = _scratchThreeFloatsB["byteOffset"];
                    _scratchIRect = CanvasKit.Malloc(Int32Array, 4);
                    _scratchIRectPtr = _scratchIRect["byteOffset"];
                    CanvasKit.ColorSpace.SRGB = CanvasKit.ColorSpace._MakeSRGB();
                    CanvasKit.ColorSpace.DISPLAY_P3 = CanvasKit.ColorSpace._MakeDisplayP3();
                    CanvasKit.ColorSpace.ADOBE_RGB = CanvasKit.ColorSpace._MakeAdobeRGB();
                    CanvasKit["GlyphRunFlags"] = { "IsWhiteSpace": CanvasKit["_GlyphRunFlags_isWhiteSpace"] };
                    CanvasKit.Path.MakeFromCmds = function(cmds) {
                        var cmdPtr = copy1dArray(cmds, "HEAPF32");
                        var path = CanvasKit.Path._MakeFromCmds(cmdPtr, cmds.length);
                        freeArraysThatAreNotMallocedByUsers(cmdPtr, cmds);
                        return path
                    };
                    CanvasKit.Path.MakeFromVerbsPointsWeights = function(verbs, pts, weights) {
                        var verbsPtr = copy1dArray(verbs, "HEAPU8");
                        var pointsPtr = copy1dArray(pts, "HEAPF32");
                        var weightsPtr = copy1dArray(weights, "HEAPF32");
                        var numWeights = weights && weights.length || 0;
                        var path = CanvasKit.Path._MakeFromVerbsPointsWeights(verbsPtr, verbs.length, pointsPtr, pts.length, weightsPtr, numWeights);
                        freeArraysThatAreNotMallocedByUsers(verbsPtr, verbs);
                        freeArraysThatAreNotMallocedByUsers(pointsPtr, pts);
                        freeArraysThatAreNotMallocedByUsers(weightsPtr, weights);
                        return path
                    };
                    CanvasKit.Path.prototype.addArc = function(oval, startAngle, sweepAngle) {
                        var oPtr = copyRectToWasm(oval);
                        this._addArc(oPtr, startAngle, sweepAngle);
                        return this
                    };
                    CanvasKit.Path.prototype.addOval = function(oval, isCCW, startIndex) {
                        if (startIndex === undefined) { startIndex = 1 }
                        var oPtr = copyRectToWasm(oval);
                        this._addOval(oPtr, !!isCCW, startIndex);
                        return this
                    };
                    CanvasKit.Path.prototype.addPath = function() {
                        var args = Array.prototype.slice.call(arguments);
                        var path = args[0];
                        var extend = false;
                        if (typeof args[args.length - 1] === "boolean") { extend = args.pop() }
                        if (args.length === 1) { this._addPath(path, 1, 0, 0, 0, 1, 0, 0, 0, 1, extend) } else if (args.length === 2) {
                            var a = args[1];
                            this._addPath(path, a[0], a[1], a[2], a[3], a[4], a[5], a[6] || 0, a[7] || 0, a[8] || 1, extend)
                        } else if (args.length === 7 || args.length === 10) {
                            var a = args;
                            this._addPath(path, a[1], a[2], a[3], a[4], a[5], a[6], a[7] || 0, a[8] || 0, a[9] || 1, extend)
                        } else { Debug("addPath expected to take 1, 2, 7, or 10 required args. Got " + args.length); return null }
                        return this
                    };
                    CanvasKit.Path.prototype.addPoly = function(points, close) {
                        var ptr = copy1dArray(points, "HEAPF32");
                        this._addPoly(ptr, points.length / 2, close);
                        freeArraysThatAreNotMallocedByUsers(ptr, points);
                        return this
                    };
                    CanvasKit.Path.prototype.addRect = function(rect, isCCW) {
                        var rPtr = copyRectToWasm(rect);
                        this._addRect(rPtr, !!isCCW);
                        return this
                    };
                    CanvasKit.Path.prototype.addRRect = function(rrect, isCCW) {
                        var rPtr = copyRRectToWasm(rrect);
                        this._addRRect(rPtr, !!isCCW);
                        return this
                    };
                    CanvasKit.Path.prototype.addVerbsPointsWeights = function(verbs, points, weights) {
                        var verbsPtr = copy1dArray(verbs, "HEAPU8");
                        var pointsPtr = copy1dArray(points, "HEAPF32");
                        var weightsPtr = copy1dArray(weights, "HEAPF32");
                        var numWeights = weights && weights.length || 0;
                        this._addVerbsPointsWeights(verbsPtr, verbs.length, pointsPtr, points.length, weightsPtr, numWeights);
                        freeArraysThatAreNotMallocedByUsers(verbsPtr, verbs);
                        freeArraysThatAreNotMallocedByUsers(pointsPtr, points);
                        freeArraysThatAreNotMallocedByUsers(weightsPtr, weights)
                    };
                    CanvasKit.Path.prototype.arc = function(x, y, radius, startAngle, endAngle, ccw) {
                        var bounds = CanvasKit.LTRBRect(x - radius, y - radius, x + radius, y + radius);
                        var sweep = radiansToDegrees(endAngle - startAngle) - 360 * !!ccw;
                        var temp = new CanvasKit.Path;
                        temp.addArc(bounds, radiansToDegrees(startAngle), sweep);
                        this.addPath(temp, true);
                        temp.delete();
                        return this
                    };
                    CanvasKit.Path.prototype.arcToOval = function(oval, startAngle, sweepAngle, forceMoveTo) {
                        var oPtr = copyRectToWasm(oval);
                        this._arcToOval(oPtr, startAngle, sweepAngle, forceMoveTo);
                        return this
                    };
                    CanvasKit.Path.prototype.arcToRotated = function(rx, ry, xAxisRotate, useSmallArc, isCCW, x, y) { this._arcToRotated(rx, ry, xAxisRotate, !!useSmallArc, !!isCCW, x, y); return this };
                    CanvasKit.Path.prototype.arcToTangent = function(x1, y1, x2, y2, radius) { this._arcToTangent(x1, y1, x2, y2, radius); return this };
                    CanvasKit.Path.prototype.close = function() { this._close(); return this };
                    CanvasKit.Path.prototype.conicTo = function(x1, y1, x2, y2, w) { this._conicTo(x1, y1, x2, y2, w); return this };
                    CanvasKit.Path.prototype.computeTightBounds = function(optionalOutputArray) { this._computeTightBounds(_scratchFourFloatsAPtr); var ta = _scratchFourFloatsA["toTypedArray"](); if (optionalOutputArray) { optionalOutputArray.set(ta); return optionalOutputArray } return ta.slice() };
                    CanvasKit.Path.prototype.cubicTo = function(cp1x, cp1y, cp2x, cp2y, x, y) { this._cubicTo(cp1x, cp1y, cp2x, cp2y, x, y); return this };
                    CanvasKit.Path.prototype.dash = function(on, off, phase) { if (this._dash(on, off, phase)) { return this } return null };
                    CanvasKit.Path.prototype.getBounds = function(optionalOutputArray) { this._getBounds(_scratchFourFloatsAPtr); var ta = _scratchFourFloatsA["toTypedArray"](); if (optionalOutputArray) { optionalOutputArray.set(ta); return optionalOutputArray } return ta.slice() };
                    CanvasKit.Path.prototype.lineTo = function(x, y) { this._lineTo(x, y); return this };
                    CanvasKit.Path.prototype.moveTo = function(x, y) { this._moveTo(x, y); return this };
                    CanvasKit.Path.prototype.offset = function(dx, dy) { this._transform(1, 0, dx, 0, 1, dy, 0, 0, 1); return this };
                    CanvasKit.Path.prototype.quadTo = function(cpx, cpy, x, y) { this._quadTo(cpx, cpy, x, y); return this };
                    CanvasKit.Path.prototype.rArcTo = function(rx, ry, xAxisRotate, useSmallArc, isCCW, dx, dy) { this._rArcTo(rx, ry, xAxisRotate, useSmallArc, isCCW, dx, dy); return this };
                    CanvasKit.Path.prototype.rConicTo = function(dx1, dy1, dx2, dy2, w) { this._rConicTo(dx1, dy1, dx2, dy2, w); return this };
                    CanvasKit.Path.prototype.rCubicTo = function(cp1x, cp1y, cp2x, cp2y, x, y) { this._rCubicTo(cp1x, cp1y, cp2x, cp2y, x, y); return this };
                    CanvasKit.Path.prototype.rLineTo = function(dx, dy) { this._rLineTo(dx, dy); return this };
                    CanvasKit.Path.prototype.rMoveTo = function(dx, dy) { this._rMoveTo(dx, dy); return this };
                    CanvasKit.Path.prototype.rQuadTo = function(cpx, cpy, x, y) { this._rQuadTo(cpx, cpy, x, y); return this };
                    CanvasKit.Path.prototype.stroke = function(opts) {
                        opts = opts || {};
                        opts["width"] = opts["width"] || 1;
                        opts["miter_limit"] = opts["miter_limit"] || 4;
                        opts["cap"] = opts["cap"] || CanvasKit.StrokeCap.Butt;
                        opts["join"] = opts["join"] || CanvasKit.StrokeJoin.Miter;
                        opts["precision"] = opts["precision"] || 1;
                        if (this._stroke(opts)) { return this }
                        return null
                    };
                    CanvasKit.Path.prototype.transform = function() {
                        if (arguments.length === 1) {
                            var a = arguments[0];
                            this._transform(a[0], a[1], a[2], a[3], a[4], a[5], a[6] || 0, a[7] || 0, a[8] || 1)
                        } else if (arguments.length === 6 || arguments.length === 9) {
                            var a = arguments;
                            this._transform(a[0], a[1], a[2], a[3], a[4], a[5], a[6] || 0, a[7] || 0, a[8] || 1)
                        } else { throw "transform expected to take 1 or 9 arguments. Got " + arguments.length }
                        return this
                    };
                    CanvasKit.Path.prototype.trim = function(startT, stopT, isComplement) { if (this._trim(startT, stopT, !!isComplement)) { return this } return null };
                    CanvasKit.Image.prototype.makeShaderCubic = function(xTileMode, yTileMode, cubicResamplerB, cubicResamplerC, localMatrix) { var localMatrixPtr = copy3x3MatrixToWasm(localMatrix); return this._makeShaderCubic(xTileMode, yTileMode, cubicResamplerB, cubicResamplerC, localMatrixPtr) };
                    CanvasKit.Image.prototype.makeShaderOptions = function(xTileMode, yTileMode, filterMode, mipmapMode, localMatrix) { var localMatrixPtr = copy3x3MatrixToWasm(localMatrix); return this._makeShaderOptions(xTileMode, yTileMode, filterMode, mipmapMode, localMatrixPtr) };

                    function readPixels(source, srcX, srcY, imageInfo, destMallocObj, bytesPerRow) {
                        if (!bytesPerRow) { bytesPerRow = 4 * imageInfo["width"]; if (imageInfo["colorType"] === CanvasKit.ColorType.RGBA_F16) { bytesPerRow *= 2 } else if (imageInfo["colorType"] === CanvasKit.ColorType.RGBA_F32) { bytesPerRow *= 4 } }
                        var pBytes = bytesPerRow * imageInfo.height;
                        var pPtr;
                        if (destMallocObj) { pPtr = destMallocObj["byteOffset"] } else { pPtr = CanvasKit._malloc(pBytes) }
                        if (!source._readPixels(imageInfo, pPtr, bytesPerRow, srcX, srcY)) { Debug("Could not read pixels with the given inputs"); if (!destMallocObj) { CanvasKit._free(pPtr) } return null }
                        if (destMallocObj) { return destMallocObj["toTypedArray"]() }
                        var retVal = null;
                        switch (imageInfo["colorType"]) {
                            case CanvasKit.ColorType.RGBA_8888:
                            case CanvasKit.ColorType.RGBA_F16:
                                retVal = new Uint8Array(CanvasKit.HEAPU8.buffer, pPtr, pBytes).slice();
                                break;
                            case CanvasKit.ColorType.RGBA_F32:
                                retVal = new Float32Array(CanvasKit.HEAPU8.buffer, pPtr, pBytes).slice();
                                break;
                            default:
                                Debug("ColorType not yet supported");
                                return null
                        }
                        CanvasKit._free(pPtr);
                        return retVal
                    }
                    CanvasKit.Image.prototype.readPixels = function(srcX, srcY, imageInfo, destMallocObj, bytesPerRow) { return readPixels(this, srcX, srcY, imageInfo, destMallocObj, bytesPerRow) };
                    CanvasKit.Canvas.prototype.clear = function(color4f) {
                        CanvasKit.setCurrentContext(this._context);
                        var cPtr = copyColorToWasm(color4f);
                        this._clear(cPtr)
                    };
                    CanvasKit.Canvas.prototype.clipRRect = function(rrect, op, antialias) {
                        CanvasKit.setCurrentContext(this._context);
                        var rPtr = copyRRectToWasm(rrect);
                        this._clipRRect(rPtr, op, antialias)
                    };
                    CanvasKit.Canvas.prototype.clipRect = function(rect, op, antialias) {
                        CanvasKit.setCurrentContext(this._context);
                        var rPtr = copyRectToWasm(rect);
                        this._clipRect(rPtr, op, antialias)
                    };
                    CanvasKit.Canvas.prototype.concat = function(matr) {
                        CanvasKit.setCurrentContext(this._context);
                        var matrPtr = copy4x4MatrixToWasm(matr);
                        this._concat(matrPtr)
                    };
                    CanvasKit.Canvas.prototype.drawArc = function(oval, startAngle, sweepAngle, useCenter, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        var oPtr = copyRectToWasm(oval);
                        this._drawArc(oPtr, startAngle, sweepAngle, useCenter, paint)
                    };
                    CanvasKit.Canvas.prototype.drawAtlas = function(atlas, srcRects, dstXforms, paint, blendMode, colors, sampling) {
                        if (!atlas || !paint || !srcRects || !dstXforms) { Debug("Doing nothing since missing a required input"); return }
                        if (srcRects.length !== dstXforms.length) { Debug("Doing nothing since input arrays length mismatches"); return }
                        CanvasKit.setCurrentContext(this._context);
                        if (!blendMode) { blendMode = CanvasKit.BlendMode.SrcOver }
                        var srcRectPtr = copy1dArray(srcRects, "HEAPF32");
                        var dstXformPtr = copy1dArray(dstXforms, "HEAPF32");
                        var count = dstXforms.length / 4;
                        var colorPtr = copy1dArray(assureIntColors(colors), "HEAPU32");
                        if (sampling && "B" in sampling && "C" in sampling) { this._drawAtlasCubic(atlas, dstXformPtr, srcRectPtr, colorPtr, count, blendMode, sampling["B"], sampling["C"], paint) } else {
                            let filter = CanvasKit.FilterMode.Linear;
                            let mipmap = CanvasKit.MipmapMode.None;
                            if (sampling) { filter = sampling["filter"]; if ("mipmap" in sampling) { mipmap = sampling["mipmap"] } }
                            this._drawAtlasOptions(atlas, dstXformPtr, srcRectPtr, colorPtr, count, blendMode, filter, mipmap, paint)
                        }
                        freeArraysThatAreNotMallocedByUsers(srcRectPtr, srcRects);
                        freeArraysThatAreNotMallocedByUsers(dstXformPtr, dstXforms);
                        freeArraysThatAreNotMallocedByUsers(colorPtr, colors)
                    };
                    CanvasKit.Canvas.prototype.drawCircle = function(cx, cy, r, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawCircle(cx, cy, r, paint)
                    };
                    CanvasKit.Canvas.prototype.drawColor = function(color4f, mode) { CanvasKit.setCurrentContext(this._context); var cPtr = copyColorToWasm(color4f); if (mode !== undefined) { this._drawColor(cPtr, mode) } else { this._drawColor(cPtr) } };
                    CanvasKit.Canvas.prototype.drawColorInt = function(color, mode) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawColorInt(color, mode || CanvasKit.BlendMode.SrcOver)
                    };
                    CanvasKit.Canvas.prototype.drawColorComponents = function(r, g, b, a, mode) { CanvasKit.setCurrentContext(this._context); var cPtr = copyColorComponentsToWasm(r, g, b, a); if (mode !== undefined) { this._drawColor(cPtr, mode) } else { this._drawColor(cPtr) } };
                    CanvasKit.Canvas.prototype.drawDRRect = function(outer, inner, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        var oPtr = copyRRectToWasm(outer, _scratchRRectPtr);
                        var iPtr = copyRRectToWasm(inner, _scratchRRect2Ptr);
                        this._drawDRRect(oPtr, iPtr, paint)
                    };
                    CanvasKit.Canvas.prototype.drawGlyphs = function(glyphs, positions, x, y, font, paint) {
                        if (!(glyphs.length * 2 <= positions.length)) { throw "Not enough positions for the array of gyphs" }
                        CanvasKit.setCurrentContext(this._context);
                        const glyphs_ptr = copy1dArray(glyphs, "HEAPU16");
                        const positions_ptr = copy1dArray(positions, "HEAPF32");
                        this._drawGlyphs(glyphs.length, glyphs_ptr, positions_ptr, x, y, font, paint);
                        freeArraysThatAreNotMallocedByUsers(positions_ptr, positions);
                        freeArraysThatAreNotMallocedByUsers(glyphs_ptr, glyphs)
                    };
                    CanvasKit.Canvas.prototype.drawImage = function(img, x, y, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawImage(img, x, y, paint || null)
                    };
                    CanvasKit.Canvas.prototype.drawImageCubic = function(img, x, y, b, c, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawImageCubic(img, x, y, b, c, paint || null)
                    };
                    CanvasKit.Canvas.prototype.drawImageOptions = function(img, x, y, filter, mipmap, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawImageOptions(img, x, y, filter, mipmap, paint || null)
                    };
                    CanvasKit.Canvas.prototype.drawImageNine = function(img, center, dest, filter, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        var cPtr = copyIRectToWasm(center);
                        var dPtr = copyRectToWasm(dest);
                        this._drawImageNine(img, cPtr, dPtr, filter, paint || null)
                    };
                    CanvasKit.Canvas.prototype.drawImageRect = function(img, src, dest, paint, fastSample) {
                        CanvasKit.setCurrentContext(this._context);
                        copyRectToWasm(src, _scratchFourFloatsAPtr);
                        copyRectToWasm(dest, _scratchFourFloatsBPtr);
                        this._drawImageRect(img, _scratchFourFloatsAPtr, _scratchFourFloatsBPtr, paint, !!fastSample)
                    };
                    CanvasKit.Canvas.prototype.drawImageRectCubic = function(img, src, dest, B, C, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        copyRectToWasm(src, _scratchFourFloatsAPtr);
                        copyRectToWasm(dest, _scratchFourFloatsBPtr);
                        this._drawImageRectCubic(img, _scratchFourFloatsAPtr, _scratchFourFloatsBPtr, B, C, paint || null)
                    };
                    CanvasKit.Canvas.prototype.drawImageRectOptions = function(img, src, dest, filter, mipmap, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        copyRectToWasm(src, _scratchFourFloatsAPtr);
                        copyRectToWasm(dest, _scratchFourFloatsBPtr);
                        this._drawImageRectOptions(img, _scratchFourFloatsAPtr, _scratchFourFloatsBPtr, filter, mipmap, paint || null)
                    };
                    CanvasKit.Canvas.prototype.drawLine = function(x1, y1, x2, y2, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawLine(x1, y1, x2, y2, paint)
                    };
                    CanvasKit.Canvas.prototype.drawOval = function(oval, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        var oPtr = copyRectToWasm(oval);
                        this._drawOval(oPtr, paint)
                    };
                    CanvasKit.Canvas.prototype.drawPaint = function(paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawPaint(paint)
                    };
                    CanvasKit.Canvas.prototype.drawParagraph = function(p, x, y) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawParagraph(p, x, y)
                    };
                    CanvasKit.Canvas.prototype.drawPatch = function(cubics, colors, texs, mode, paint) {
                        if (cubics.length < 24) { throw "Need 12 cubic points" }
                        if (colors && colors.length < 4) { throw "Need 4 colors" }
                        if (texs && texs.length < 8) { throw "Need 4 shader coordinates" }
                        CanvasKit.setCurrentContext(this._context);
                        const cubics_ptr = copy1dArray(cubics, "HEAPF32");
                        const colors_ptr = colors ? copy1dArray(assureIntColors(colors), "HEAPU32") : nullptr;
                        const texs_ptr = texs ? copy1dArray(texs, "HEAPF32") : nullptr;
                        if (!mode) { mode = CanvasKit.BlendMode.Modulate }
                        this._drawPatch(cubics_ptr, colors_ptr, texs_ptr, mode, paint);
                        freeArraysThatAreNotMallocedByUsers(texs_ptr, texs);
                        freeArraysThatAreNotMallocedByUsers(colors_ptr, colors);
                        freeArraysThatAreNotMallocedByUsers(cubics_ptr, cubics)
                    };
                    CanvasKit.Canvas.prototype.drawPath = function(path, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawPath(path, paint)
                    };
                    CanvasKit.Canvas.prototype.drawPicture = function(pic) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawPicture(pic)
                    };
                    CanvasKit.Canvas.prototype.drawPoints = function(mode, points, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        var ptr = copy1dArray(points, "HEAPF32");
                        this._drawPoints(mode, ptr, points.length / 2, paint);
                        freeArraysThatAreNotMallocedByUsers(ptr, points)
                    };
                    CanvasKit.Canvas.prototype.drawRRect = function(rrect, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        var rPtr = copyRRectToWasm(rrect);
                        this._drawRRect(rPtr, paint)
                    };
                    CanvasKit.Canvas.prototype.drawRect = function(rect, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        var rPtr = copyRectToWasm(rect);
                        this._drawRect(rPtr, paint)
                    };
                    CanvasKit.Canvas.prototype.drawRect4f = function(l, t, r, b, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawRect4f(l, t, r, b, paint)
                    };
                    CanvasKit.Canvas.prototype.drawShadow = function(path, zPlaneParams, lightPos, lightRadius, ambientColor, spotColor, flags) {
                        CanvasKit.setCurrentContext(this._context);
                        var ambiPtr = copyColorToWasmNoScratch(ambientColor);
                        var spotPtr = copyColorToWasmNoScratch(spotColor);
                        var zPlanePtr = copy1dArray(zPlaneParams, "HEAPF32", _scratchThreeFloatsAPtr);
                        var lightPosPtr = copy1dArray(lightPos, "HEAPF32", _scratchThreeFloatsBPtr);
                        this._drawShadow(path, zPlanePtr, lightPosPtr, lightRadius, ambiPtr, spotPtr, flags);
                        freeArraysThatAreNotMallocedByUsers(ambiPtr, ambientColor);
                        freeArraysThatAreNotMallocedByUsers(spotPtr, spotColor)
                    };
                    CanvasKit.getShadowLocalBounds = function(ctm, path, zPlaneParams, lightPos, lightRadius, flags, optOutputRect) { var ctmPtr = copy3x3MatrixToWasm(ctm); var zPlanePtr = copy1dArray(zPlaneParams, "HEAPF32", _scratchThreeFloatsAPtr); var lightPosPtr = copy1dArray(lightPos, "HEAPF32", _scratchThreeFloatsBPtr); var ok = this._getShadowLocalBounds(ctmPtr, path, zPlanePtr, lightPosPtr, lightRadius, flags, _scratchFourFloatsAPtr); if (!ok) { return null } var ta = _scratchFourFloatsA["toTypedArray"](); if (optOutputRect) { optOutputRect.set(ta); return optOutputRect } return ta.slice() };
                    CanvasKit.Canvas.prototype.drawTextBlob = function(blob, x, y, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawTextBlob(blob, x, y, paint)
                    };
                    CanvasKit.Canvas.prototype.drawVertices = function(verts, mode, paint) {
                        CanvasKit.setCurrentContext(this._context);
                        this._drawVertices(verts, mode, paint)
                    };
                    CanvasKit.Canvas.prototype.getLocalToDevice = function() { this._getLocalToDevice(_scratch4x4MatrixPtr); return copy4x4MatrixFromWasm(_scratch4x4MatrixPtr) };
                    CanvasKit.Canvas.prototype.getTotalMatrix = function() { this._getTotalMatrix(_scratch3x3MatrixPtr); var rv = new Array(9); for (var i = 0; i < 9; i++) { rv[i] = CanvasKit.HEAPF32[_scratch3x3MatrixPtr / 4 + i] } return rv };
                    CanvasKit.Canvas.prototype.makeSurface = function(imageInfo) {
                        var s = this._makeSurface(imageInfo);
                        s._context = this._context;
                        return s
                    };
                    CanvasKit.Canvas.prototype.readPixels = function(srcX, srcY, imageInfo, destMallocObj, bytesPerRow) { CanvasKit.setCurrentContext(this._context); return readPixels(this, srcX, srcY, imageInfo, destMallocObj, bytesPerRow) };
                    CanvasKit.Canvas.prototype.saveLayer = function(paint, boundsRect, backdrop, flags) { var bPtr = copyRectToWasm(boundsRect); return this._saveLayer(paint || null, bPtr, backdrop || null, flags || 0) };
                    CanvasKit.Canvas.prototype.writePixels = function(pixels, srcWidth, srcHeight, destX, destY, alphaType, colorType, colorSpace) {
                        if (pixels.byteLength % (srcWidth * srcHeight)) { throw "pixels length must be a multiple of the srcWidth * srcHeight" }
                        CanvasKit.setCurrentContext(this._context);
                        var bytesPerPixel = pixels.byteLength / (srcWidth * srcHeight);
                        alphaType = alphaType || CanvasKit.AlphaType.Unpremul;
                        colorType = colorType || CanvasKit.ColorType.RGBA_8888;
                        colorSpace = colorSpace || CanvasKit.ColorSpace.SRGB;
                        var srcRowBytes = bytesPerPixel * srcWidth;
                        var pptr = copy1dArray(pixels, "HEAPU8");
                        var ok = this._writePixels({ "width": srcWidth, "height": srcHeight, "colorType": colorType, "alphaType": alphaType, "colorSpace": colorSpace }, pptr, srcRowBytes, destX, destY);
                        freeArraysThatAreNotMallocedByUsers(pptr, pixels);
                        return ok
                    };
                    CanvasKit.ColorFilter.MakeBlend = function(color4f, mode) { var cPtr = copyColorToWasm(color4f); return CanvasKit.ColorFilter._MakeBlend(cPtr, mode) };
                    CanvasKit.ColorFilter.MakeMatrix = function(colorMatrix) {
                        if (!colorMatrix || colorMatrix.length !== 20) { throw "invalid color matrix" }
                        var fptr = copy1dArray(colorMatrix, "HEAPF32");
                        var m = CanvasKit.ColorFilter._makeMatrix(fptr);
                        freeArraysThatAreNotMallocedByUsers(fptr, colorMatrix);
                        return m
                    };
                    CanvasKit.ContourMeasure.prototype.getPosTan = function(distance, optionalOutput) { this._getPosTan(distance, _scratchFourFloatsAPtr); var ta = _scratchFourFloatsA["toTypedArray"](); if (optionalOutput) { optionalOutput.set(ta); return optionalOutput } return ta.slice() };
                    CanvasKit.ImageFilter.MakeMatrixTransform = function(matrix, sampling, input) { var matrPtr = copy3x3MatrixToWasm(matrix); if ("B" in sampling && "C" in sampling) { return CanvasKit.ImageFilter._MakeMatrixTransformCubic(matrPtr, sampling.B, sampling.C, input) } else { const filter = sampling["filter"]; let mipmap = CanvasKit.MipmapMode.None; if ("mipmap" in sampling) { mipmap = sampling["mipmap"] } return CanvasKit.ImageFilter._MakeMatrixTransformOptions(matrPtr, filter, mipmap, input) } };
                    CanvasKit.Paint.prototype.getColor = function() { this._getColor(_scratchColorPtr); return copyColorFromWasm(_scratchColorPtr) };
                    CanvasKit.Paint.prototype.setColor = function(color4f, colorSpace) {
                        colorSpace = colorSpace || null;
                        var cPtr = copyColorToWasm(color4f);
                        this._setColor(cPtr, colorSpace)
                    };
                    CanvasKit.Paint.prototype.setColorComponents = function(r, g, b, a, colorSpace) {
                        colorSpace = colorSpace || null;
                        var cPtr = copyColorComponentsToWasm(r, g, b, a);
                        this._setColor(cPtr, colorSpace)
                    };
                    CanvasKit.Path.prototype.getPoint = function(idx, optionalOutput) {
                        this._getPoint(idx, _scratchFourFloatsAPtr);
                        var ta = _scratchFourFloatsA["toTypedArray"]();
                        if (optionalOutput) {
                            optionalOutput[0] = ta[0];
                            optionalOutput[1] = ta[1];
                            return optionalOutput
                        }
                        return ta.slice(0, 2)
                    };
                    CanvasKit.PictureRecorder.prototype.beginRecording = function(bounds) { var bPtr = copyRectToWasm(bounds); return this._beginRecording(bPtr) };
                    CanvasKit.Surface.prototype.getCanvas = function() {
                        var c = this._getCanvas();
                        c._context = this._context;
                        return c
                    };
                    CanvasKit.Surface.prototype.makeImageSnapshot = function(optionalBoundsRect) { CanvasKit.setCurrentContext(this._context); var bPtr = copyIRectToWasm(optionalBoundsRect); return this._makeImageSnapshot(bPtr) };
                    CanvasKit.Surface.prototype.makeSurface = function(imageInfo) {
                        CanvasKit.setCurrentContext(this._context);
                        var s = this._makeSurface(imageInfo);
                        s._context = this._context;
                        return s
                    };
                    CanvasKit.Surface.prototype.requestAnimationFrame = function(callback, dirtyRect) {
                        if (!this._cached_canvas) { this._cached_canvas = this.getCanvas() }
                        requestAnimationFrame(function() {
                            CanvasKit.setCurrentContext(this._context);
                            callback(this._cached_canvas);
                            this.flush(dirtyRect)
                        }.bind(this))
                    };
                    CanvasKit.Surface.prototype.drawOnce = function(callback, dirtyRect) {
                        if (!this._cached_canvas) { this._cached_canvas = this.getCanvas() }
                        requestAnimationFrame(function() {
                            CanvasKit.setCurrentContext(this._context);
                            callback(this._cached_canvas);
                            this.flush(dirtyRect);
                            this.dispose()
                        }.bind(this))
                    };
                    CanvasKit.PathEffect.MakeDash = function(intervals, phase) {
                        if (!phase) { phase = 0 }
                        if (!intervals.length || intervals.length % 2 === 1) { throw "Intervals array must have even length" }
                        var ptr = copy1dArray(intervals, "HEAPF32");
                        var dpe = CanvasKit.PathEffect._MakeDash(ptr, intervals.length, phase);
                        freeArraysThatAreNotMallocedByUsers(ptr, intervals);
                        return dpe
                    };
                    CanvasKit.PathEffect.MakeLine2D = function(width, matrix) { var matrixPtr = copy3x3MatrixToWasm(matrix); return CanvasKit.PathEffect._MakeLine2D(width, matrixPtr) };
                    CanvasKit.PathEffect.MakePath2D = function(matrix, path) { var matrixPtr = copy3x3MatrixToWasm(matrix); return CanvasKit.PathEffect._MakePath2D(matrixPtr, path) };
                    CanvasKit.Shader.MakeColor = function(color4f, colorSpace) { colorSpace = colorSpace || null; var cPtr = copyColorToWasm(color4f); return CanvasKit.Shader._MakeColor(cPtr, colorSpace) };
                    CanvasKit.Shader.Blend = CanvasKit.Shader.MakeBlend;
                    CanvasKit.Shader.Color = CanvasKit.Shader.MakeColor;
                    CanvasKit.Shader.MakeLinearGradient = function(start, end, colors, pos, mode, localMatrix, flags, colorSpace) {
                        colorSpace = colorSpace || null;
                        var cPtrInfo = copyFlexibleColorArray(colors);
                        var posPtr = copy1dArray(pos, "HEAPF32");
                        flags = flags || 0;
                        var localMatrixPtr = copy3x3MatrixToWasm(localMatrix);
                        var startEndPts = _scratchFourFloatsA["toTypedArray"]();
                        startEndPts.set(start);
                        startEndPts.set(end, 2);
                        var lgs = CanvasKit.Shader._MakeLinearGradient(_scratchFourFloatsAPtr, cPtrInfo.colorPtr, cPtrInfo.colorType, posPtr, cPtrInfo.count, mode, flags, localMatrixPtr, colorSpace);
                        freeArraysThatAreNotMallocedByUsers(cPtrInfo.colorPtr, colors);
                        pos && freeArraysThatAreNotMallocedByUsers(posPtr, pos);
                        return lgs
                    };
                    CanvasKit.Shader.MakeRadialGradient = function(center, radius, colors, pos, mode, localMatrix, flags, colorSpace) {
                        colorSpace = colorSpace || null;
                        var cPtrInfo = copyFlexibleColorArray(colors);
                        var posPtr = copy1dArray(pos, "HEAPF32");
                        flags = flags || 0;
                        var localMatrixPtr = copy3x3MatrixToWasm(localMatrix);
                        var rgs = CanvasKit.Shader._MakeRadialGradient(center[0], center[1], radius, cPtrInfo.colorPtr, cPtrInfo.colorType, posPtr, cPtrInfo.count, mode, flags, localMatrixPtr, colorSpace);
                        freeArraysThatAreNotMallocedByUsers(cPtrInfo.colorPtr, colors);
                        pos && freeArraysThatAreNotMallocedByUsers(posPtr, pos);
                        return rgs
                    };
                    CanvasKit.Shader.MakeSweepGradient = function(cx, cy, colors, pos, mode, localMatrix, flags, startAngle, endAngle, colorSpace) {
                        colorSpace = colorSpace || null;
                        var cPtrInfo = copyFlexibleColorArray(colors);
                        var posPtr = copy1dArray(pos, "HEAPF32");
                        flags = flags || 0;
                        startAngle = startAngle || 0;
                        endAngle = endAngle || 360;
                        var localMatrixPtr = copy3x3MatrixToWasm(localMatrix);
                        var sgs = CanvasKit.Shader._MakeSweepGradient(cx, cy, cPtrInfo.colorPtr, cPtrInfo.colorType, posPtr, cPtrInfo.count, mode, startAngle, endAngle, flags, localMatrixPtr, colorSpace);
                        freeArraysThatAreNotMallocedByUsers(cPtrInfo.colorPtr, colors);
                        pos && freeArraysThatAreNotMallocedByUsers(posPtr, pos);
                        return sgs
                    };
                    CanvasKit.Shader.MakeTwoPointConicalGradient = function(start, startRadius, end, endRadius, colors, pos, mode, localMatrix, flags, colorSpace) {
                        colorSpace = colorSpace || null;
                        var cPtrInfo = copyFlexibleColorArray(colors);
                        var posPtr = copy1dArray(pos, "HEAPF32");
                        flags = flags || 0;
                        var localMatrixPtr = copy3x3MatrixToWasm(localMatrix);
                        var startEndPts = _scratchFourFloatsA["toTypedArray"]();
                        startEndPts.set(start);
                        startEndPts.set(end, 2);
                        var rgs = CanvasKit.Shader._MakeTwoPointConicalGradient(_scratchFourFloatsAPtr, startRadius, endRadius, cPtrInfo.colorPtr, cPtrInfo.colorType, posPtr, cPtrInfo.count, mode, flags, localMatrixPtr, colorSpace);
                        freeArraysThatAreNotMallocedByUsers(cPtrInfo.colorPtr, colors);
                        pos && freeArraysThatAreNotMallocedByUsers(posPtr, pos);
                        return rgs
                    };
                    CanvasKit.Vertices.prototype.bounds = function(optionalOutputArray) { this._bounds(_scratchFourFloatsAPtr); var ta = _scratchFourFloatsA["toTypedArray"](); if (optionalOutputArray) { optionalOutputArray.set(ta); return optionalOutputArray } return ta.slice() };
                    if (CanvasKit._extraInitializations) { CanvasKit._extraInitializations.forEach(function(init) { init() }) }
                };
                CanvasKit.computeTonalColors = function(tonalColors) {
                    var cPtrAmbi = copyColorToWasmNoScratch(tonalColors["ambient"]);
                    var cPtrSpot = copyColorToWasmNoScratch(tonalColors["spot"]);
                    this._computeTonalColors(cPtrAmbi, cPtrSpot);
                    var result = { "ambient": copyColorFromWasm(cPtrAmbi), "spot": copyColorFromWasm(cPtrSpot) };
                    freeArraysThatAreNotMallocedByUsers(cPtrAmbi, tonalColors["ambient"]);
                    freeArraysThatAreNotMallocedByUsers(cPtrSpot, tonalColors["spot"]);
                    return result
                };
                CanvasKit.LTRBRect = function(l, t, r, b) { return Float32Array.of(l, t, r, b) };
                CanvasKit.XYWHRect = function(x, y, w, h) { return Float32Array.of(x, y, x + w, y + h) };
                CanvasKit.LTRBiRect = function(l, t, r, b) { return Int32Array.of(l, t, r, b) };
                CanvasKit.XYWHiRect = function(x, y, w, h) { return Int32Array.of(x, y, x + w, y + h) };
                CanvasKit.RRectXY = function(rect, rx, ry) { return Float32Array.of(rect[0], rect[1], rect[2], rect[3], rx, ry, rx, ry, rx, ry, rx, ry) };
                CanvasKit.MakeAnimatedImageFromEncoded = function(data) {
                    data = new Uint8Array(data);
                    var iptr = CanvasKit._malloc(data.byteLength);
                    CanvasKit.HEAPU8.set(data, iptr);
                    var img = CanvasKit._decodeAnimatedImage(iptr, data.byteLength);
                    if (!img) { Debug("Could not decode animated image"); return null }
                    return img
                };
                CanvasKit.MakeImageFromEncoded = function(data) {
                    data = new Uint8Array(data);
                    var iptr = CanvasKit._malloc(data.byteLength);
                    CanvasKit.HEAPU8.set(data, iptr);
                    var img = CanvasKit._decodeImage(iptr, data.byteLength);
                    if (!img) { Debug("Could not decode image"); return null }
                    return img
                };
                var memoizedCanvas2dElement = null;
                CanvasKit.MakeImageFromCanvasImageSource = function(canvasImageSource) {
                    var width = canvasImageSource.width;
                    var height = canvasImageSource.height;
                    if (!memoizedCanvas2dElement) { memoizedCanvas2dElement = document.createElement("canvas") }
                    memoizedCanvas2dElement.width = width;
                    memoizedCanvas2dElement.height = height;
                    var ctx2d = memoizedCanvas2dElement.getContext("2d", { willReadFrequently: true });
                    ctx2d.drawImage(canvasImageSource, 0, 0);
                    var imageData = ctx2d.getImageData(0, 0, width, height);
                    return CanvasKit.MakeImage({ "width": width, "height": height, "alphaType": CanvasKit.AlphaType.Unpremul, "colorType": CanvasKit.ColorType.RGBA_8888, "colorSpace": CanvasKit.ColorSpace.SRGB }, imageData.data, 4 * width)
                };
                CanvasKit.MakeImage = function(info, pixels, bytesPerRow) {
                    var pptr = CanvasKit._malloc(pixels.length);
                    CanvasKit.HEAPU8.set(pixels, pptr);
                    return CanvasKit._MakeImage(info, pptr, pixels.length, bytesPerRow)
                };
                CanvasKit.MakeVertices = function(mode, positions, textureCoordinates, colors, indices, isVolatile) {
                    isVolatile = isVolatile === undefined ? true : isVolatile;
                    var idxCount = indices && indices.length || 0;
                    var flags = 0;
                    if (textureCoordinates && textureCoordinates.length) { flags |= 1 << 0 }
                    if (colors && colors.length) { flags |= 1 << 1 }
                    if (!isVolatile) { flags |= 1 << 2 }
                    var builder = new CanvasKit._VerticesBuilder(mode, positions.length / 2, idxCount, flags);
                    copy1dArray(positions, "HEAPF32", builder.positions());
                    if (builder.texCoords()) { copy1dArray(textureCoordinates, "HEAPF32", builder.texCoords()) }
                    if (builder.colors()) { copy1dArray(assureIntColors(colors), "HEAPU32", builder.colors()) }
                    if (builder.indices()) { copy1dArray(indices, "HEAPU16", builder.indices()) }
                    return builder.detach()
                };
                CanvasKit.Matrix = {};

                function sdot() { var acc = 0; for (var i = 0; i < arguments.length - 1; i += 2) { acc += arguments[i] * arguments[i + 1] } return acc }
                var identityN = function(n) { var size = n * n; var m = new Array(size); while (size--) { m[size] = size % (n + 1) === 0 ? 1 : 0 } return m };
                var stride = function(v, m, width, offset, colStride) { for (var i = 0; i < v.length; i++) { m[i * width + (i * colStride + offset + width) % width] = v[i] } return m };
                CanvasKit.Matrix.identity = function() { return identityN(3) };
                CanvasKit.Matrix.invert = function(m) { var det = m[0] * m[4] * m[8] + m[1] * m[5] * m[6] + m[2] * m[3] * m[7] - m[2] * m[4] * m[6] - m[1] * m[3] * m[8] - m[0] * m[5] * m[7]; if (!det) { Debug("Warning, uninvertible matrix"); return null } return [(m[4] * m[8] - m[5] * m[7]) / det, (m[2] * m[7] - m[1] * m[8]) / det, (m[1] * m[5] - m[2] * m[4]) / det, (m[5] * m[6] - m[3] * m[8]) / det, (m[0] * m[8] - m[2] * m[6]) / det, (m[2] * m[3] - m[0] * m[5]) / det, (m[3] * m[7] - m[4] * m[6]) / det, (m[1] * m[6] - m[0] * m[7]) / det, (m[0] * m[4] - m[1] * m[3]) / det] };
                CanvasKit.Matrix.mapPoints = function(matrix, ptArr) {
                    if (IsDebug && ptArr.length % 2) { throw "mapPoints requires an even length arr" }
                    for (var i = 0; i < ptArr.length; i += 2) {
                        var x = ptArr[i],
                            y = ptArr[i + 1];
                        var denom = matrix[6] * x + matrix[7] * y + matrix[8];
                        var xTrans = matrix[0] * x + matrix[1] * y + matrix[2];
                        var yTrans = matrix[3] * x + matrix[4] * y + matrix[5];
                        ptArr[i] = xTrans / denom;
                        ptArr[i + 1] = yTrans / denom
                    }
                    return ptArr
                };

                function isnumber(val) { return !isNaN(val) }

                function multiply(m1, m2, size) {
                    if (IsDebug && (!m1.every(isnumber) || !m2.every(isnumber))) { throw "Some members of matrices are NaN m1=" + m1 + ", m2=" + m2 + "" }
                    if (IsDebug && m1.length !== m2.length) { throw "Undefined for matrices of different sizes. m1.length=" + m1.length + ", m2.length=" + m2.length }
                    if (IsDebug && size * size !== m1.length) { throw "Undefined for non-square matrices. array size was " + size }
                    var result = Array(m1.length);
                    for (var r = 0; r < size; r++) {
                        for (var c = 0; c < size; c++) {
                            var acc = 0;
                            for (var k = 0; k < size; k++) { acc += m1[size * r + k] * m2[size * k + c] }
                            result[r * size + c] = acc
                        }
                    }
                    return result
                }

                function multiplyMany(size, listOfMatrices) {
                    if (IsDebug && listOfMatrices.length < 2) { throw "multiplication expected two or more matrices" }
                    var result = multiply(listOfMatrices[0], listOfMatrices[1], size);
                    var next = 2;
                    while (next < listOfMatrices.length) {
                        result = multiply(result, listOfMatrices[next], size);
                        next++
                    }
                    return result
                }
                CanvasKit.Matrix.multiply = function() { return multiplyMany(3, arguments) };
                CanvasKit.Matrix.rotated = function(radians, px, py) {
                    px = px || 0;
                    py = py || 0;
                    var sinV = Math.sin(radians);
                    var cosV = Math.cos(radians);
                    return [cosV, -sinV, sdot(sinV, py, 1 - cosV, px), sinV, cosV, sdot(-sinV, px, 1 - cosV, py), 0, 0, 1]
                };
                CanvasKit.Matrix.scaled = function(sx, sy, px, py) {
                    px = px || 0;
                    py = py || 0;
                    var m = stride([sx, sy], identityN(3), 3, 0, 1);
                    return stride([px - sx * px, py - sy * py], m, 3, 2, 0)
                };
                CanvasKit.Matrix.skewed = function(kx, ky, px, py) {
                    px = px || 0;
                    py = py || 0;
                    var m = stride([kx, ky], identityN(3), 3, 1, -1);
                    return stride([-kx * px, -ky * py], m, 3, 2, 0)
                };
                CanvasKit.Matrix.translated = function(dx, dy) { return stride(arguments, identityN(3), 3, 2, 0) };
                CanvasKit.Vector = {};
                CanvasKit.Vector.dot = function(a, b) { if (IsDebug && a.length !== b.length) { throw "Cannot perform dot product on arrays of different length (" + a.length + " vs " + b.length + ")" } return a.map(function(v, i) { return v * b[i] }).reduce(function(acc, cur) { return acc + cur }) };
                CanvasKit.Vector.lengthSquared = function(v) { return CanvasKit.Vector.dot(v, v) };
                CanvasKit.Vector.length = function(v) { return Math.sqrt(CanvasKit.Vector.lengthSquared(v)) };
                CanvasKit.Vector.mulScalar = function(v, s) { return v.map(function(i) { return i * s }) };
                CanvasKit.Vector.add = function(a, b) { return a.map(function(v, i) { return v + b[i] }) };
                CanvasKit.Vector.sub = function(a, b) { return a.map(function(v, i) { return v - b[i] }) };
                CanvasKit.Vector.dist = function(a, b) { return CanvasKit.Vector.length(CanvasKit.Vector.sub(a, b)) };
                CanvasKit.Vector.normalize = function(v) { return CanvasKit.Vector.mulScalar(v, 1 / CanvasKit.Vector.length(v)) };
                CanvasKit.Vector.cross = function(a, b) { if (IsDebug && (a.length !== 3 || a.length !== 3)) { throw "Cross product is only defined for 3-dimensional vectors (a.length=" + a.length + ", b.length=" + b.length + ")" } return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] };
                CanvasKit.M44 = {};
                CanvasKit.M44.identity = function() { return identityN(4) };
                CanvasKit.M44.translated = function(vec) { return stride(vec, identityN(4), 4, 3, 0) };
                CanvasKit.M44.scaled = function(vec) { return stride(vec, identityN(4), 4, 0, 1) };
                CanvasKit.M44.rotated = function(axisVec, radians) { return CanvasKit.M44.rotatedUnitSinCos(CanvasKit.Vector.normalize(axisVec), Math.sin(radians), Math.cos(radians)) };
                CanvasKit.M44.rotatedUnitSinCos = function(axisVec, sinAngle, cosAngle) { var x = axisVec[0]; var y = axisVec[1]; var z = axisVec[2]; var c = cosAngle; var s = sinAngle; var t = 1 - c; return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, 0, t * x * y + s * z, t * y * y + c, t * y * z - s * x, 0, t * x * z - s * y, t * y * z + s * x, t * z * z + c, 0, 0, 0, 0, 1] };
                CanvasKit.M44.lookat = function(eyeVec, centerVec, upVec) {
                    var f = CanvasKit.Vector.normalize(CanvasKit.Vector.sub(centerVec, eyeVec));
                    var u = CanvasKit.Vector.normalize(upVec);
                    var s = CanvasKit.Vector.normalize(CanvasKit.Vector.cross(f, u));
                    var m = CanvasKit.M44.identity();
                    stride(s, m, 4, 0, 0);
                    stride(CanvasKit.Vector.cross(s, f), m, 4, 1, 0);
                    stride(CanvasKit.Vector.mulScalar(f, -1), m, 4, 2, 0);
                    stride(eyeVec, m, 4, 3, 0);
                    var m2 = CanvasKit.M44.invert(m);
                    if (m2 === null) { return CanvasKit.M44.identity() }
                    return m2
                };
                CanvasKit.M44.perspective = function(near, far, angle) { if (IsDebug && far <= near) { throw "far must be greater than near when constructing M44 using perspective." } var dInv = 1 / (far - near); var halfAngle = angle / 2; var cot = Math.cos(halfAngle) / Math.sin(halfAngle); return [cot, 0, 0, 0, 0, cot, 0, 0, 0, 0, (far + near) * dInv, 2 * far * near * dInv, 0, 0, -1, 1] };
                CanvasKit.M44.rc = function(m, r, c) { return m[r * 4 + c] };
                CanvasKit.M44.multiply = function() { return multiplyMany(4, arguments) };
                CanvasKit.M44.invert = function(m) {
                    if (IsDebug && !m.every(isnumber)) { throw "some members of matrix are NaN m=" + m }
                    var a00 = m[0];
                    var a01 = m[4];
                    var a02 = m[8];
                    var a03 = m[12];
                    var a10 = m[1];
                    var a11 = m[5];
                    var a12 = m[9];
                    var a13 = m[13];
                    var a20 = m[2];
                    var a21 = m[6];
                    var a22 = m[10];
                    var a23 = m[14];
                    var a30 = m[3];
                    var a31 = m[7];
                    var a32 = m[11];
                    var a33 = m[15];
                    var b00 = a00 * a11 - a01 * a10;
                    var b01 = a00 * a12 - a02 * a10;
                    var b02 = a00 * a13 - a03 * a10;
                    var b03 = a01 * a12 - a02 * a11;
                    var b04 = a01 * a13 - a03 * a11;
                    var b05 = a02 * a13 - a03 * a12;
                    var b06 = a20 * a31 - a21 * a30;
                    var b07 = a20 * a32 - a22 * a30;
                    var b08 = a20 * a33 - a23 * a30;
                    var b09 = a21 * a32 - a22 * a31;
                    var b10 = a21 * a33 - a23 * a31;
                    var b11 = a22 * a33 - a23 * a32;
                    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                    var invdet = 1 / det;
                    if (det === 0 || invdet === Infinity) { Debug("Warning, uninvertible matrix"); return null }
                    b00 *= invdet;
                    b01 *= invdet;
                    b02 *= invdet;
                    b03 *= invdet;
                    b04 *= invdet;
                    b05 *= invdet;
                    b06 *= invdet;
                    b07 *= invdet;
                    b08 *= invdet;
                    b09 *= invdet;
                    b10 *= invdet;
                    b11 *= invdet;
                    var tmp = [a11 * b11 - a12 * b10 + a13 * b09, a12 * b08 - a10 * b11 - a13 * b07, a10 * b10 - a11 * b08 + a13 * b06, a11 * b07 - a10 * b09 - a12 * b06, a02 * b10 - a01 * b11 - a03 * b09, a00 * b11 - a02 * b08 + a03 * b07, a01 * b08 - a00 * b10 - a03 * b06, a00 * b09 - a01 * b07 + a02 * b06, a31 * b05 - a32 * b04 + a33 * b03, a32 * b02 - a30 * b05 - a33 * b01, a30 * b04 - a31 * b02 + a33 * b00, a31 * b01 - a30 * b03 - a32 * b00, a22 * b04 - a21 * b05 - a23 * b03, a20 * b05 - a22 * b02 + a23 * b01, a21 * b02 - a20 * b04 - a23 * b00, a20 * b03 - a21 * b01 + a22 * b00];
                    if (!tmp.every(function(val) { return !isNaN(val) && val !== Infinity && val !== -Infinity })) { Debug("inverted matrix contains infinities or NaN " + tmp); return null }
                    return tmp
                };
                CanvasKit.M44.transpose = function(m) { return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]] };
                CanvasKit.M44.mustInvert = function(m) { var m2 = CanvasKit.M44.invert(m); if (m2 === null) { throw "Matrix not invertible" } return m2 };
                CanvasKit.M44.setupCamera = function(area, zscale, cam) { var camera = CanvasKit.M44.lookat(cam["eye"], cam["coa"], cam["up"]); var perspective = CanvasKit.M44.perspective(cam["near"], cam["far"], cam["angle"]); var center = [(area[0] + area[2]) / 2, (area[1] + area[3]) / 2, 0]; var viewScale = [(area[2] - area[0]) / 2, (area[3] - area[1]) / 2, zscale]; var viewport = CanvasKit.M44.multiply(CanvasKit.M44.translated(center), CanvasKit.M44.scaled(viewScale)); return CanvasKit.M44.multiply(viewport, perspective, camera, CanvasKit.M44.mustInvert(viewport)) };
                var rScale = 0;
                var gScale = 6;
                var bScale = 12;
                var aScale = 18;
                var rPostTrans = 4;
                var gPostTrans = 9;
                var bPostTrans = 14;
                var aPostTrans = 19;
                CanvasKit.ColorMatrix = {};
                CanvasKit.ColorMatrix.identity = function() {
                    var m = new Float32Array(20);
                    m[rScale] = 1;
                    m[gScale] = 1;
                    m[bScale] = 1;
                    m[aScale] = 1;
                    return m
                };
                CanvasKit.ColorMatrix.scaled = function(rs, gs, bs, as) {
                    var m = new Float32Array(20);
                    m[rScale] = rs;
                    m[gScale] = gs;
                    m[bScale] = bs;
                    m[aScale] = as;
                    return m
                };
                var rotateIndices = [
                    [6, 7, 11, 12],
                    [0, 10, 2, 12],
                    [0, 1, 5, 6]
                ];
                CanvasKit.ColorMatrix.rotated = function(axis, sine, cosine) {
                    var m = CanvasKit.ColorMatrix.identity();
                    var indices = rotateIndices[axis];
                    m[indices[0]] = cosine;
                    m[indices[1]] = sine;
                    m[indices[2]] = -sine;
                    m[indices[3]] = cosine;
                    return m
                };
                CanvasKit.ColorMatrix.postTranslate = function(m, dr, dg, db, da) {
                    m[rPostTrans] += dr;
                    m[gPostTrans] += dg;
                    m[bPostTrans] += db;
                    m[aPostTrans] += da;
                    return m
                };
                CanvasKit.ColorMatrix.concat = function(outer, inner) {
                    var m = new Float32Array(20);
                    var index = 0;
                    for (var j = 0; j < 20; j += 5) {
                        for (var i = 0; i < 4; i++) { m[index++] = outer[j + 0] * inner[i + 0] + outer[j + 1] * inner[i + 5] + outer[j + 2] * inner[i + 10] + outer[j + 3] * inner[i + 15] }
                        m[index++] = outer[j + 0] * inner[4] + outer[j + 1] * inner[9] + outer[j + 2] * inner[14] + outer[j + 3] * inner[19] + outer[j + 4]
                    }
                    return m
                };
                (function(CanvasKit) {
                    CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                    CanvasKit._extraInitializations.push(function() {
                        CanvasKit.Paragraph.prototype.getRectsForRange = function(start, end, hStyle, wStyle) { var floatArray = this._getRectsForRange(start, end, hStyle, wStyle); return floatArrayToRects(floatArray) };
                        CanvasKit.Paragraph.prototype.getRectsForPlaceholders = function() { var floatArray = this._getRectsForPlaceholders(); return floatArrayToRects(floatArray) };

                        function floatArrayToRects(floatArray) {
                            if (!floatArray || !floatArray.length) { return [] }
                            var ret = [];
                            for (var i = 0; i < floatArray.length; i += 5) {
                                var r = CanvasKit.LTRBRect(floatArray[i], floatArray[i + 1], floatArray[i + 2], floatArray[i + 3]);
                                if (floatArray[i + 4] === 0) { r["direction"] = CanvasKit.TextDirection.RTL } else { r["direction"] = CanvasKit.TextDirection.LTR }
                                ret.push(r)
                            }
                            CanvasKit._free(floatArray.byteOffset);
                            return ret
                        }
                        CanvasKit.TypefaceFontProvider.prototype.registerFont = function(font, family) {
                            var typeface = CanvasKit.Typeface.MakeFreeTypeFaceFromData(font);
                            if (!typeface) { Debug("Could not decode font data"); return null }
                            var familyPtr = cacheOrCopyString(family);
                            this._registerFont(typeface, familyPtr)
                        };
                        CanvasKit.ParagraphStyle = function(s) {
                            s["disableHinting"] = s["disableHinting"] || false;
                            if (s["ellipsis"]) {
                                var str = s["ellipsis"];
                                s["_ellipsisPtr"] = cacheOrCopyString(str);
                                s["_ellipsisLen"] = lengthBytesUTF8(str) + 1
                            } else {
                                s["_ellipsisPtr"] = nullptr;
                                s["_ellipsisLen"] = 0
                            }
                            s["heightMultiplier"] = s["heightMultiplier"] || 0;
                            s["maxLines"] = s["maxLines"] || 0;
                            s["strutStyle"] = strutStyle(s["strutStyle"]);
                            s["textAlign"] = s["textAlign"] || CanvasKit.TextAlign.Start;
                            s["textDirection"] = s["textDirection"] || CanvasKit.TextDirection.LTR;
                            s["textHeightBehavior"] = s["textHeightBehavior"] || CanvasKit.TextHeightBehavior.All;
                            s["textStyle"] = CanvasKit.TextStyle(s["textStyle"]);
                            return s
                        };

                        function fontStyle(s) {
                            s = s || {};
                            if (s["weight"] === undefined) { s["weight"] = CanvasKit.FontWeight.Normal }
                            s["width"] = s["width"] || CanvasKit.FontWidth.Normal;
                            s["slant"] = s["slant"] || CanvasKit.FontSlant.Upright;
                            return s
                        }

                        function strutStyle(s) {
                            s = s || {};
                            s["strutEnabled"] = s["strutEnabled"] || false;
                            if (s["strutEnabled"] && Array.isArray(s["fontFamilies"]) && s["fontFamilies"].length) {
                                s["_fontFamiliesPtr"] = naiveCopyStrArray(s["fontFamilies"]);
                                s["_fontFamiliesLen"] = s["fontFamilies"].length
                            } else {
                                s["_fontFamiliesPtr"] = nullptr;
                                s["_fontFamiliesLen"] = 0
                            }
                            s["fontStyle"] = fontStyle(s["fontStyle"]);
                            s["fontSize"] = s["fontSize"] || 0;
                            s["heightMultiplier"] = s["heightMultiplier"] || 0;
                            s["halfLeading"] = s["halfLeading"] || false;
                            s["leading"] = s["leading"] || 0;
                            s["forceStrutHeight"] = s["forceStrutHeight"] || false;
                            return s
                        }
                        CanvasKit.TextStyle = function(s) {
                            if (!s["color"]) { s["color"] = CanvasKit.BLACK }
                            s["decoration"] = s["decoration"] || 0;
                            s["decorationThickness"] = s["decorationThickness"] || 0;
                            s["decorationStyle"] = s["decorationStyle"] || CanvasKit.DecorationStyle.Solid;
                            s["textBaseline"] = s["textBaseline"] || CanvasKit.TextBaseline.Alphabetic;
                            s["fontSize"] = s["fontSize"] || 0;
                            s["letterSpacing"] = s["letterSpacing"] || 0;
                            s["wordSpacing"] = s["wordSpacing"] || 0;
                            s["heightMultiplier"] = s["heightMultiplier"] || 0;
                            s["halfLeading"] = s["halfLeading"] || false;
                            s["fontStyle"] = fontStyle(s["fontStyle"]);
                            return s
                        };

                        function naiveCopyStrArray(strings) {
                            if (!strings || !strings.length) { return nullptr }
                            var sPtrs = [];
                            for (var i = 0; i < strings.length; i++) {
                                var strPtr = cacheOrCopyString(strings[i]);
                                sPtrs.push(strPtr)
                            }
                            return copy1dArray(sPtrs, "HEAPU32")
                        }
                        var stringCache = {};

                        function cacheOrCopyString(str) {
                            if (stringCache[str]) { return stringCache[str] }
                            var strLen = lengthBytesUTF8(str) + 1;
                            var strPtr = CanvasKit._malloc(strLen);
                            stringToUTF8(str, strPtr, strLen);
                            stringCache[str] = strPtr;
                            return strPtr
                        }
                        var scratchForegroundColorPtr = CanvasKit._malloc(4 * 4);
                        var scratchBackgroundColorPtr = CanvasKit._malloc(4 * 4);
                        var scratchDecorationColorPtr = CanvasKit._malloc(4 * 4);

                        function copyArrays(textStyle) {
                            textStyle["_colorPtr"] = copyColorToWasm(textStyle["color"]);
                            textStyle["_foregroundColorPtr"] = nullptr;
                            textStyle["_backgroundColorPtr"] = nullptr;
                            textStyle["_decorationColorPtr"] = nullptr;
                            if (textStyle["foregroundColor"]) { textStyle["_foregroundColorPtr"] = copyColorToWasm(textStyle["foregroundColor"], scratchForegroundColorPtr) }
                            if (textStyle["backgroundColor"]) { textStyle["_backgroundColorPtr"] = copyColorToWasm(textStyle["backgroundColor"], scratchBackgroundColorPtr) }
                            if (textStyle["decorationColor"]) { textStyle["_decorationColorPtr"] = copyColorToWasm(textStyle["decorationColor"], scratchDecorationColorPtr) }
                            if (Array.isArray(textStyle["fontFamilies"]) && textStyle["fontFamilies"].length) {
                                textStyle["_fontFamiliesPtr"] = naiveCopyStrArray(textStyle["fontFamilies"]);
                                textStyle["_fontFamiliesLen"] = textStyle["fontFamilies"].length
                            } else {
                                textStyle["_fontFamiliesPtr"] = nullptr;
                                textStyle["_fontFamiliesLen"] = 0;
                                Debug("no font families provided, text may draw wrong or not at all")
                            }
                            if (textStyle["locale"]) {
                                var str = textStyle["locale"];
                                textStyle["_localePtr"] = cacheOrCopyString(str);
                                textStyle["_localeLen"] = lengthBytesUTF8(str) + 1
                            } else {
                                textStyle["_localePtr"] = nullptr;
                                textStyle["_localeLen"] = 0
                            }
                            if (Array.isArray(textStyle["shadows"]) && textStyle["shadows"].length) {
                                var shadows = textStyle["shadows"];
                                var shadowColors = shadows.map(function(s) { return s["color"] || CanvasKit.BLACK });
                                var shadowBlurRadii = shadows.map(function(s) { return s["blurRadius"] || 0 });
                                textStyle["_shadowLen"] = shadows.length;
                                var ptr = CanvasKit._malloc(shadows.length * 2 * 4);
                                var adjustedPtr = ptr / 4;
                                for (var i = 0; i < shadows.length; i++) {
                                    var offset = shadows[i]["offset"] || [0, 0];
                                    CanvasKit.HEAPF32[adjustedPtr] = offset[0];
                                    CanvasKit.HEAPF32[adjustedPtr + 1] = offset[1];
                                    adjustedPtr += 2
                                }
                                textStyle["_shadowColorsPtr"] = copyFlexibleColorArray(shadowColors).colorPtr;
                                textStyle["_shadowOffsetsPtr"] = ptr;
                                textStyle["_shadowBlurRadiiPtr"] = copy1dArray(shadowBlurRadii, "HEAPF32")
                            } else {
                                textStyle["_shadowLen"] = 0;
                                textStyle["_shadowColorsPtr"] = nullptr;
                                textStyle["_shadowOffsetsPtr"] = nullptr;
                                textStyle["_shadowBlurRadiiPtr"] = nullptr
                            }
                            if (Array.isArray(textStyle["fontFeatures"]) && textStyle["fontFeatures"].length) {
                                var fontFeatures = textStyle["fontFeatures"];
                                var fontFeatureNames = fontFeatures.map(function(s) { return s["name"] });
                                var fontFeatureValues = fontFeatures.map(function(s) { return s["value"] });
                                textStyle["_fontFeatureLen"] = fontFeatures.length;
                                textStyle["_fontFeatureNamesPtr"] = naiveCopyStrArray(fontFeatureNames);
                                textStyle["_fontFeatureValuesPtr"] = copy1dArray(fontFeatureValues, "HEAPU32")
                            } else {
                                textStyle["_fontFeatureLen"] = 0;
                                textStyle["_fontFeatureNamesPtr"] = nullptr;
                                textStyle["_fontFeatureValuesPtr"] = nullptr
                            }
                        }

                        function freeArrays(textStyle) {
                            CanvasKit._free(textStyle["_fontFamiliesPtr"]);
                            CanvasKit._free(textStyle["_shadowColorsPtr"]);
                            CanvasKit._free(textStyle["_shadowOffsetsPtr"]);
                            CanvasKit._free(textStyle["_shadowBlurRadiiPtr"]);
                            CanvasKit._free(textStyle["_fontFeatureNamesPtr"]);
                            CanvasKit._free(textStyle["_fontFeatureValuesPtr"])
                        }
                        CanvasKit.ParagraphBuilder.Make = function(paragraphStyle, fontManager) {
                            copyArrays(paragraphStyle["textStyle"]);
                            var result = CanvasKit.ParagraphBuilder._Make(paragraphStyle, fontManager);
                            freeArrays(paragraphStyle["textStyle"]);
                            return result
                        };
                        CanvasKit.ParagraphBuilder.MakeFromFontProvider = function(paragraphStyle, fontProvider) {
                            copyArrays(paragraphStyle["textStyle"]);
                            var result = CanvasKit.ParagraphBuilder._MakeFromFontProvider(paragraphStyle, fontProvider);
                            freeArrays(paragraphStyle["textStyle"]);
                            return result
                        };
                        CanvasKit.ParagraphBuilder.ShapeText = function(text, blocks, width) { let length = 0; for (const b of blocks) { length += b.length } if (length !== text.length) { throw "Accumulated block lengths must equal text.length" } return CanvasKit.ParagraphBuilder._ShapeText(text, blocks, width) };
                        CanvasKit.ParagraphBuilder.prototype.pushStyle = function(textStyle) {
                            copyArrays(textStyle);
                            this._pushStyle(textStyle);
                            freeArrays(textStyle)
                        };
                        CanvasKit.ParagraphBuilder.prototype.pushPaintStyle = function(textStyle, fg, bg) {
                            copyArrays(textStyle);
                            this._pushPaintStyle(textStyle, fg, bg);
                            freeArrays(textStyle)
                        };
                        CanvasKit.ParagraphBuilder.prototype.addPlaceholder = function(width, height, alignment, baseline, offset) {
                            width = width || 0;
                            height = height || 0;
                            alignment = alignment || CanvasKit.PlaceholderAlignment.Baseline;
                            baseline = baseline || CanvasKit.TextBaseline.Alphabetic;
                            offset = offset || 0;
                            this._addPlaceholder(width, height, alignment, baseline, offset)
                        }
                    })
                })(Module);
                CanvasKit.MakeManagedAnimation = function(json, assets, prop_filter_prefix, soundMap, logger) {
                    if (!CanvasKit._MakeManagedAnimation) { throw "Not compiled with MakeManagedAnimation" }
                    if (!prop_filter_prefix) { prop_filter_prefix = "" }
                    if (!assets) { return CanvasKit._MakeManagedAnimation(json, 0, nullptr, nullptr, nullptr, prop_filter_prefix, soundMap, logger) }
                    var assetNamePtrs = [];
                    var assetDataPtrs = [];
                    var assetSizes = [];
                    var assetKeys = Object.keys(assets || {});
                    for (var i = 0; i < assetKeys.length; i++) {
                        var key = assetKeys[i];
                        var buffer = assets[key];
                        var data = new Uint8Array(buffer);
                        var iptr = CanvasKit._malloc(data.byteLength);
                        CanvasKit.HEAPU8.set(data, iptr);
                        assetDataPtrs.push(iptr);
                        assetSizes.push(data.byteLength);
                        var strLen = lengthBytesUTF8(key) + 1;
                        var strPtr = CanvasKit._malloc(strLen);
                        stringToUTF8(key, strPtr, strLen);
                        assetNamePtrs.push(strPtr)
                    }
                    var namesPtr = copy1dArray(assetNamePtrs, "HEAPU32");
                    var assetsPtr = copy1dArray(assetDataPtrs, "HEAPU32");
                    var assetSizesPtr = copy1dArray(assetSizes, "HEAPU32");
                    var anim = CanvasKit._MakeManagedAnimation(json, assetKeys.length, namesPtr, assetsPtr, assetSizesPtr, prop_filter_prefix, soundMap, logger);
                    CanvasKit._free(namesPtr);
                    CanvasKit._free(assetsPtr);
                    CanvasKit._free(assetSizesPtr);
                    return anim
                };
                (function(CanvasKit) {
                    CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                    CanvasKit._extraInitializations.push(function() {
                        CanvasKit.Animation.prototype.render = function(canvas, dstRect) {
                            copyRectToWasm(dstRect, _scratchFourFloatsAPtr);
                            this._render(canvas, _scratchFourFloatsAPtr)
                        };
                        CanvasKit.Animation.prototype.size = function(optSize) {
                            this._size(_scratchFourFloatsAPtr);
                            var ta = _scratchFourFloatsA["toTypedArray"]();
                            if (optSize) {
                                optSize[0] = ta[0];
                                optSize[1] = ta[1];
                                return optSize
                            }
                            return ta.slice(0, 2)
                        };
                        if (CanvasKit.ManagedAnimation) {
                            CanvasKit.ManagedAnimation.prototype.render = function(canvas, dstRect) {
                                copyRectToWasm(dstRect, _scratchFourFloatsAPtr);
                                this._render(canvas, _scratchFourFloatsAPtr)
                            };
                            CanvasKit.ManagedAnimation.prototype.seek = function(t, optDamageRect) { this._seek(t, _scratchFourFloatsAPtr); var ta = _scratchFourFloatsA["toTypedArray"](); if (optDamageRect) { optDamageRect.set(ta); return optDamageRect } return ta.slice() };
                            CanvasKit.ManagedAnimation.prototype.seekFrame = function(frame, optDamageRect) { this._seekFrame(frame, _scratchFourFloatsAPtr); var ta = _scratchFourFloatsA["toTypedArray"](); if (optDamageRect) { optDamageRect.set(ta); return optDamageRect } return ta.slice() };
                            CanvasKit.ManagedAnimation.prototype.setColor = function(key, color) { var cPtr = copyColorToWasm(color); return this._setColor(key, cPtr) };
                            CanvasKit.ManagedAnimation.prototype.size = function(optSize) {
                                this._size(_scratchFourFloatsAPtr);
                                var ta = _scratchFourFloatsA["toTypedArray"]();
                                if (optSize) {
                                    optSize[0] = ta[0];
                                    optSize[1] = ta[1];
                                    return optSize
                                }
                                return ta.slice(0, 2)
                            }
                        }
                    })
                })(Module);
                CanvasKit.MakeParticles = function(json, assets) {
                    if (!CanvasKit._MakeParticles) { throw "Not compiled with MakeParticles" }
                    if (!assets) { return CanvasKit._MakeParticles(json, 0, nullptr, nullptr, nullptr) }
                    var assetNamePtrs = [];
                    var assetDataPtrs = [];
                    var assetSizes = [];
                    var assetKeys = Object.keys(assets || {});
                    for (var i = 0; i < assetKeys.length; i++) {
                        var key = assetKeys[i];
                        var buffer = assets[key];
                        var data = new Uint8Array(buffer);
                        var iptr = CanvasKit._malloc(data.byteLength);
                        CanvasKit.HEAPU8.set(data, iptr);
                        assetDataPtrs.push(iptr);
                        assetSizes.push(data.byteLength);
                        var strLen = lengthBytesUTF8(key) + 1;
                        var strPtr = CanvasKit._malloc(strLen);
                        stringToUTF8(key, strPtr, strLen);
                        assetNamePtrs.push(strPtr)
                    }
                    var namesPtr = copy1dArray(assetNamePtrs, "HEAPU32");
                    var assetsPtr = copy1dArray(assetDataPtrs, "HEAPU32");
                    var assetSizesPtr = copy1dArray(assetSizes, "HEAPU32");
                    var particles = CanvasKit._MakeParticles(json, assetKeys.length, namesPtr, assetsPtr, assetSizesPtr);
                    CanvasKit._free(namesPtr);
                    CanvasKit._free(assetsPtr);
                    CanvasKit._free(assetSizesPtr);
                    return particles
                };
                CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                CanvasKit._extraInitializations.push(function() {
                    CanvasKit.ParticleEffect.prototype.uniforms = function() { var fptr = this._uniformPtr(); var numFloats = this.getUniformFloatCount(); if (!fptr || numFloats <= 0) { return new Float32Array } return new Float32Array(CanvasKit.HEAPU8.buffer, fptr, numFloats) };
                    CanvasKit.ParticleEffect.prototype.setPosition = function(pos) { this._setPosition(pos[0], pos[1]) }
                });
                CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                CanvasKit._extraInitializations.push(function() {
                    CanvasKit.Path.prototype.op = function(otherPath, op) { if (this._op(otherPath, op)) { return this } return null };
                    CanvasKit.Path.prototype.simplify = function() { if (this._simplify()) { return this } return null }
                });
                CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                CanvasKit._extraInitializations.push(function() {
                    CanvasKit.Canvas.prototype.drawText = function(str, x, y, paint, font) {
                        var strLen = lengthBytesUTF8(str);
                        var strPtr = CanvasKit._malloc(strLen + 1);
                        stringToUTF8(str, strPtr, strLen + 1);
                        this._drawSimpleText(strPtr, strLen, x, y, font, paint);
                        CanvasKit._free(strPtr)
                    };
                    CanvasKit.Font.prototype.getGlyphBounds = function(glyphs, paint, optionalOutputArray) {
                        var glyphPtr = copy1dArray(glyphs, "HEAPU16");
                        var bytesPerRect = 4 * 4;
                        var rectPtr = CanvasKit._malloc(glyphs.length * bytesPerRect);
                        this._getGlyphWidthBounds(glyphPtr, glyphs.length, nullptr, rectPtr, paint || null);
                        var rects = new Float32Array(CanvasKit.HEAPU8.buffer, rectPtr, glyphs.length * 4);
                        freeArraysThatAreNotMallocedByUsers(glyphPtr, glyphs);
                        if (optionalOutputArray) {
                            optionalOutputArray.set(rects);
                            CanvasKit._free(rectPtr);
                            return optionalOutputArray
                        }
                        var rv = Float32Array.from(rects);
                        CanvasKit._free(rectPtr);
                        return rv
                    };
                    CanvasKit.Font.prototype.getGlyphIDs = function(str, numGlyphIDs, optionalOutputArray) {
                        if (!numGlyphIDs) { numGlyphIDs = str.length }
                        var strBytes = lengthBytesUTF8(str) + 1;
                        var strPtr = CanvasKit._malloc(strBytes);
                        stringToUTF8(str, strPtr, strBytes);
                        var bytesPerGlyph = 2;
                        var glyphPtr = CanvasKit._malloc(numGlyphIDs * bytesPerGlyph);
                        var actualIDs = this._getGlyphIDs(strPtr, strBytes - 1, numGlyphIDs, glyphPtr);
                        CanvasKit._free(strPtr);
                        if (actualIDs < 0) {
                            Debug("Could not get glyphIDs");
                            CanvasKit._free(glyphPtr);
                            return null
                        }
                        var glyphs = new Uint16Array(CanvasKit.HEAPU8.buffer, glyphPtr, actualIDs);
                        if (optionalOutputArray) {
                            optionalOutputArray.set(glyphs);
                            CanvasKit._free(glyphPtr);
                            return optionalOutputArray
                        }
                        var rv = Uint16Array.from(glyphs);
                        CanvasKit._free(glyphPtr);
                        return rv
                    };
                    CanvasKit.Font.prototype.getGlyphIntercepts = function(glyphs, positions, top, bottom) { var gPtr = copy1dArray(glyphs, "HEAPU16"); var pPtr = copy1dArray(positions, "HEAPF32"); return this._getGlyphIntercepts(gPtr, glyphs.length, !wasMalloced(glyphs), pPtr, positions.length, !wasMalloced(positions), top, bottom) };
                    CanvasKit.Font.prototype.getGlyphWidths = function(glyphs, paint, optionalOutputArray) {
                        var glyphPtr = copy1dArray(glyphs, "HEAPU16");
                        var bytesPerWidth = 4;
                        var widthPtr = CanvasKit._malloc(glyphs.length * bytesPerWidth);
                        this._getGlyphWidthBounds(glyphPtr, glyphs.length, widthPtr, nullptr, paint || null);
                        var widths = new Float32Array(CanvasKit.HEAPU8.buffer, widthPtr, glyphs.length);
                        freeArraysThatAreNotMallocedByUsers(glyphPtr, glyphs);
                        if (optionalOutputArray) {
                            optionalOutputArray.set(widths);
                            CanvasKit._free(widthPtr);
                            return optionalOutputArray
                        }
                        var rv = Float32Array.from(widths);
                        CanvasKit._free(widthPtr);
                        return rv
                    };
                    CanvasKit.FontMgr.FromData = function() {
                        if (!arguments.length) { Debug("Could not make FontMgr from no font sources"); return null }
                        var fonts = arguments;
                        if (fonts.length === 1 && Array.isArray(fonts[0])) { fonts = arguments[0] }
                        if (!fonts.length) { Debug("Could not make FontMgr from no font sources"); return null }
                        var dPtrs = [];
                        var sizes = [];
                        for (var i = 0; i < fonts.length; i++) {
                            var data = new Uint8Array(fonts[i]);
                            var dptr = copy1dArray(data, "HEAPU8");
                            dPtrs.push(dptr);
                            sizes.push(data.byteLength)
                        }
                        var datasPtr = copy1dArray(dPtrs, "HEAPU32");
                        var sizesPtr = copy1dArray(sizes, "HEAPU32");
                        var fm = CanvasKit.FontMgr._fromData(datasPtr, sizesPtr, fonts.length);
                        CanvasKit._free(datasPtr);
                        CanvasKit._free(sizesPtr);
                        return fm
                    };
                    CanvasKit.Typeface.MakeFreeTypeFaceFromData = function(fontData) { var data = new Uint8Array(fontData); var fptr = copy1dArray(data, "HEAPU8"); var font = CanvasKit.Typeface._MakeFreeTypeFaceFromData(fptr, data.byteLength); if (!font) { Debug("Could not decode font data"); return null } return font };
                    CanvasKit.Typeface.prototype.getGlyphIDs = function(str, numGlyphIDs, optionalOutputArray) {
                        if (!numGlyphIDs) { numGlyphIDs = str.length }
                        var strBytes = lengthBytesUTF8(str) + 1;
                        var strPtr = CanvasKit._malloc(strBytes);
                        stringToUTF8(str, strPtr, strBytes);
                        var bytesPerGlyph = 2;
                        var glyphPtr = CanvasKit._malloc(numGlyphIDs * bytesPerGlyph);
                        var actualIDs = this._getGlyphIDs(strPtr, strBytes - 1, numGlyphIDs, glyphPtr);
                        CanvasKit._free(strPtr);
                        if (actualIDs < 0) {
                            Debug("Could not get glyphIDs");
                            CanvasKit._free(glyphPtr);
                            return null
                        }
                        var glyphs = new Uint16Array(CanvasKit.HEAPU8.buffer, glyphPtr, actualIDs);
                        if (optionalOutputArray) {
                            optionalOutputArray.set(glyphs);
                            CanvasKit._free(glyphPtr);
                            return optionalOutputArray
                        }
                        var rv = Uint16Array.from(glyphs);
                        CanvasKit._free(glyphPtr);
                        return rv
                    };
                    CanvasKit.TextBlob.MakeOnPath = function(str, path, font, initialOffset) {
                        if (!str || !str.length) { Debug("ignoring 0 length string"); return }
                        if (!path || !path.countPoints()) { Debug("ignoring empty path"); return }
                        if (path.countPoints() === 1) { Debug("path has 1 point, returning normal textblob"); return this.MakeFromText(str, font) }
                        if (!initialOffset) { initialOffset = 0 }
                        var ids = font.getGlyphIDs(str);
                        var widths = font.getGlyphWidths(ids);
                        var rsx = [];
                        var meas = new CanvasKit.ContourMeasureIter(path, false, 1);
                        var cont = meas.next();
                        var dist = initialOffset;
                        var xycs = new Float32Array(4);
                        for (var i = 0; i < str.length && cont; i++) {
                            var width = widths[i];
                            dist += width / 2;
                            if (dist > cont.length()) {
                                cont.delete();
                                cont = meas.next();
                                if (!cont) { str = str.substring(0, i); break }
                                dist = width / 2
                            }
                            cont.getPosTan(dist, xycs);
                            var cx = xycs[0];
                            var cy = xycs[1];
                            var cosT = xycs[2];
                            var sinT = xycs[3];
                            var adjustedX = cx - width / 2 * cosT;
                            var adjustedY = cy - width / 2 * sinT;
                            rsx.push(cosT, sinT, adjustedX, adjustedY);
                            dist += width / 2
                        }
                        var retVal = this.MakeFromRSXform(str, rsx, font);
                        cont && cont.delete();
                        meas.delete();
                        return retVal
                    };
                    CanvasKit.TextBlob.MakeFromRSXform = function(str, rsxForms, font) {
                        var strLen = lengthBytesUTF8(str) + 1;
                        var strPtr = CanvasKit._malloc(strLen);
                        stringToUTF8(str, strPtr, strLen);
                        var rPtr = copy1dArray(rsxForms, "HEAPF32");
                        var blob = CanvasKit.TextBlob._MakeFromRSXform(strPtr, strLen - 1, rPtr, font);
                        CanvasKit._free(strPtr);
                        if (!blob) { Debug('Could not make textblob from string "' + str + '"'); return null }
                        return blob
                    };
                    CanvasKit.TextBlob.MakeFromRSXformGlyphs = function(glyphs, rsxForms, font) {
                        var glyphPtr = copy1dArray(glyphs, "HEAPU16");
                        var bytesPerGlyph = 2;
                        var rPtr = copy1dArray(rsxForms, "HEAPF32");
                        var blob = CanvasKit.TextBlob._MakeFromRSXformGlyphs(glyphPtr, glyphs.length * bytesPerGlyph, rPtr, font);
                        freeArraysThatAreNotMallocedByUsers(glyphPtr, glyphs);
                        if (!blob) { Debug('Could not make textblob from glyphs "' + glyphs + '"'); return null }
                        return blob
                    };
                    CanvasKit.TextBlob.MakeFromGlyphs = function(glyphs, font) {
                        var glyphPtr = copy1dArray(glyphs, "HEAPU16");
                        var bytesPerGlyph = 2;
                        var blob = CanvasKit.TextBlob._MakeFromGlyphs(glyphPtr, glyphs.length * bytesPerGlyph, font);
                        freeArraysThatAreNotMallocedByUsers(glyphPtr, glyphs);
                        if (!blob) { Debug('Could not make textblob from glyphs "' + glyphs + '"'); return null }
                        return blob
                    };
                    CanvasKit.TextBlob.MakeFromText = function(str, font) {
                        var strLen = lengthBytesUTF8(str) + 1;
                        var strPtr = CanvasKit._malloc(strLen);
                        stringToUTF8(str, strPtr, strLen);
                        var blob = CanvasKit.TextBlob._MakeFromText(strPtr, strLen - 1, font);
                        CanvasKit._free(strPtr);
                        if (!blob) { Debug('Could not make textblob from string "' + str + '"'); return null }
                        return blob
                    };
                    CanvasKit.MallocGlyphIDs = function(numGlyphIDs) { return CanvasKit.Malloc(Uint16Array, numGlyphIDs) }
                });
                CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                CanvasKit._extraInitializations.push(function() {
                    CanvasKit.MakePicture = function(data) {
                        data = new Uint8Array(data);
                        var iptr = CanvasKit._malloc(data.byteLength);
                        CanvasKit.HEAPU8.set(data, iptr);
                        var pic = CanvasKit._MakePicture(iptr, data.byteLength);
                        if (!pic) { Debug("Could not decode picture"); return null }
                        return pic
                    }
                });
                CanvasKit._extraInitializations = CanvasKit._extraInitializations || [];
                CanvasKit._extraInitializations.push(function() {
                    CanvasKit.RuntimeEffect.Make = function(sksl, errorCallback) { var callbackObj = { "onError": errorCallback || function(err) { console.log("RuntimeEffect error", err) } }; return CanvasKit.RuntimeEffect._Make(sksl, callbackObj) };
                    CanvasKit.RuntimeEffect.prototype.makeShader = function(floats, isOpaque, localMatrix) { var fptr = copy1dArray(floats, "HEAPF32"); var localMatrixPtr = copy3x3MatrixToWasm(localMatrix); return this._makeShader(fptr, floats.length * 4, !!isOpaque, localMatrixPtr) };
                    CanvasKit.RuntimeEffect.prototype.makeShaderWithChildren = function(floats, isOpaque, childrenShaders, localMatrix) { var fptr = copy1dArray(floats, "HEAPF32"); var localMatrixPtr = copy3x3MatrixToWasm(localMatrix); var barePointers = []; for (var i = 0; i < childrenShaders.length; i++) { barePointers.push(childrenShaders[i].$$.ptr) } var childrenPointers = copy1dArray(barePointers, "HEAPU32"); return this._makeShaderWithChildren(fptr, floats.length * 4, !!isOpaque, childrenPointers, barePointers.length, localMatrixPtr) }
                });
                (function() {
                    CanvasKit._testing = {};

                    function allAreFinite(args) { for (var i = 0; i < args.length; i++) { if (args[i] !== undefined && !Number.isFinite(args[i])) { return false } } return true }

                    function toBase64String(bytes) {
                        if (typeof Buffer !== "undefined") { return Buffer.from(bytes).toString("base64") } else {
                            var CHUNK_SIZE = 32768;
                            var index = 0;
                            var length = bytes.length;
                            var result = "";
                            var slice;
                            while (index < length) {
                                slice = bytes.slice(index, Math.min(index + CHUNK_SIZE, length));
                                result += String.fromCharCode.apply(null, slice);
                                index += CHUNK_SIZE
                            }
                            return btoa(result)
                        }
                    }
                    var colorMap = { "aliceblue": Float32Array.of(.941, .973, 1, 1), "antiquewhite": Float32Array.of(.98, .922, .843, 1), "aqua": Float32Array.of(0, 1, 1, 1), "aquamarine": Float32Array.of(.498, 1, .831, 1), "azure": Float32Array.of(.941, 1, 1, 1), "beige": Float32Array.of(.961, .961, .863, 1), "bisque": Float32Array.of(1, .894, .769, 1), "black": Float32Array.of(0, 0, 0, 1), "blanchedalmond": Float32Array.of(1, .922, .804, 1), "blue": Float32Array.of(0, 0, 1, 1), "blueviolet": Float32Array.of(.541, .169, .886, 1), "brown": Float32Array.of(.647, .165, .165, 1), "burlywood": Float32Array.of(.871, .722, .529, 1), "cadetblue": Float32Array.of(.373, .62, .627, 1), "chartreuse": Float32Array.of(.498, 1, 0, 1), "chocolate": Float32Array.of(.824, .412, .118, 1), "coral": Float32Array.of(1, .498, .314, 1), "cornflowerblue": Float32Array.of(.392, .584, .929, 1), "cornsilk": Float32Array.of(1, .973, .863, 1), "crimson": Float32Array.of(.863, .078, .235, 1), "cyan": Float32Array.of(0, 1, 1, 1), "darkblue": Float32Array.of(0, 0, .545, 1), "darkcyan": Float32Array.of(0, .545, .545, 1), "darkgoldenrod": Float32Array.of(.722, .525, .043, 1), "darkgray": Float32Array.of(.663, .663, .663, 1), "darkgreen": Float32Array.of(0, .392, 0, 1), "darkgrey": Float32Array.of(.663, .663, .663, 1), "darkkhaki": Float32Array.of(.741, .718, .42, 1), "darkmagenta": Float32Array.of(.545, 0, .545, 1), "darkolivegreen": Float32Array.of(.333, .42, .184, 1), "darkorange": Float32Array.of(1, .549, 0, 1), "darkorchid": Float32Array.of(.6, .196, .8, 1), "darkred": Float32Array.of(.545, 0, 0, 1), "darksalmon": Float32Array.of(.914, .588, .478, 1), "darkseagreen": Float32Array.of(.561, .737, .561, 1), "darkslateblue": Float32Array.of(.282, .239, .545, 1), "darkslategray": Float32Array.of(.184, .31, .31, 1), "darkslategrey": Float32Array.of(.184, .31, .31, 1), "darkturquoise": Float32Array.of(0, .808, .82, 1), "darkviolet": Float32Array.of(.58, 0, .827, 1), "deeppink": Float32Array.of(1, .078, .576, 1), "deepskyblue": Float32Array.of(0, .749, 1, 1), "dimgray": Float32Array.of(.412, .412, .412, 1), "dimgrey": Float32Array.of(.412, .412, .412, 1), "dodgerblue": Float32Array.of(.118, .565, 1, 1), "firebrick": Float32Array.of(.698, .133, .133, 1), "floralwhite": Float32Array.of(1, .98, .941, 1), "forestgreen": Float32Array.of(.133, .545, .133, 1), "fuchsia": Float32Array.of(1, 0, 1, 1), "gainsboro": Float32Array.of(.863, .863, .863, 1), "ghostwhite": Float32Array.of(.973, .973, 1, 1), "gold": Float32Array.of(1, .843, 0, 1), "goldenrod": Float32Array.of(.855, .647, .125, 1), "gray": Float32Array.of(.502, .502, .502, 1), "green": Float32Array.of(0, .502, 0, 1), "greenyellow": Float32Array.of(.678, 1, .184, 1), "grey": Float32Array.of(.502, .502, .502, 1), "honeydew": Float32Array.of(.941, 1, .941, 1), "hotpink": Float32Array.of(1, .412, .706, 1), "indianred": Float32Array.of(.804, .361, .361, 1), "indigo": Float32Array.of(.294, 0, .51, 1), "ivory": Float32Array.of(1, 1, .941, 1), "khaki": Float32Array.of(.941, .902, .549, 1), "lavender": Float32Array.of(.902, .902, .98, 1), "lavenderblush": Float32Array.of(1, .941, .961, 1), "lawngreen": Float32Array.of(.486, .988, 0, 1), "lemonchiffon": Float32Array.of(1, .98, .804, 1), "lightblue": Float32Array.of(.678, .847, .902, 1), "lightcoral": Float32Array.of(.941, .502, .502, 1), "lightcyan": Float32Array.of(.878, 1, 1, 1), "lightgoldenrodyellow": Float32Array.of(.98, .98, .824, 1), "lightgray": Float32Array.of(.827, .827, .827, 1), "lightgreen": Float32Array.of(.565, .933, .565, 1), "lightgrey": Float32Array.of(.827, .827, .827, 1), "lightpink": Float32Array.of(1, .714, .757, 1), "lightsalmon": Float32Array.of(1, .627, .478, 1), "lightseagreen": Float32Array.of(.125, .698, .667, 1), "lightskyblue": Float32Array.of(.529, .808, .98, 1), "lightslategray": Float32Array.of(.467, .533, .6, 1), "lightslategrey": Float32Array.of(.467, .533, .6, 1), "lightsteelblue": Float32Array.of(.69, .769, .871, 1), "lightyellow": Float32Array.of(1, 1, .878, 1), "lime": Float32Array.of(0, 1, 0, 1), "limegreen": Float32Array.of(.196, .804, .196, 1), "linen": Float32Array.of(.98, .941, .902, 1), "magenta": Float32Array.of(1, 0, 1, 1), "maroon": Float32Array.of(.502, 0, 0, 1), "mediumaquamarine": Float32Array.of(.4, .804, .667, 1), "mediumblue": Float32Array.of(0, 0, .804, 1), "mediumorchid": Float32Array.of(.729, .333, .827, 1), "mediumpurple": Float32Array.of(.576, .439, .859, 1), "mediumseagreen": Float32Array.of(.235, .702, .443, 1), "mediumslateblue": Float32Array.of(.482, .408, .933, 1), "mediumspringgreen": Float32Array.of(0, .98, .604, 1), "mediumturquoise": Float32Array.of(.282, .82, .8, 1), "mediumvioletred": Float32Array.of(.78, .082, .522, 1), "midnightblue": Float32Array.of(.098, .098, .439, 1), "mintcream": Float32Array.of(.961, 1, .98, 1), "mistyrose": Float32Array.of(1, .894, .882, 1), "moccasin": Float32Array.of(1, .894, .71, 1), "navajowhite": Float32Array.of(1, .871, .678, 1), "navy": Float32Array.of(0, 0, .502, 1), "oldlace": Float32Array.of(.992, .961, .902, 1), "olive": Float32Array.of(.502, .502, 0, 1), "olivedrab": Float32Array.of(.42, .557, .137, 1), "orange": Float32Array.of(1, .647, 0, 1), "orangered": Float32Array.of(1, .271, 0, 1), "orchid": Float32Array.of(.855, .439, .839, 1), "palegoldenrod": Float32Array.of(.933, .91, .667, 1), "palegreen": Float32Array.of(.596, .984, .596, 1), "paleturquoise": Float32Array.of(.686, .933, .933, 1), "palevioletred": Float32Array.of(.859, .439, .576, 1), "papayawhip": Float32Array.of(1, .937, .835, 1), "peachpuff": Float32Array.of(1, .855, .725, 1), "peru": Float32Array.of(.804, .522, .247, 1), "pink": Float32Array.of(1, .753, .796, 1), "plum": Float32Array.of(.867, .627, .867, 1), "powderblue": Float32Array.of(.69, .878, .902, 1), "purple": Float32Array.of(.502, 0, .502, 1), "rebeccapurple": Float32Array.of(.4, .2, .6, 1), "red": Float32Array.of(1, 0, 0, 1), "rosybrown": Float32Array.of(.737, .561, .561, 1), "royalblue": Float32Array.of(.255, .412, .882, 1), "saddlebrown": Float32Array.of(.545, .271, .075, 1), "salmon": Float32Array.of(.98, .502, .447, 1), "sandybrown": Float32Array.of(.957, .643, .376, 1), "seagreen": Float32Array.of(.18, .545, .341, 1), "seashell": Float32Array.of(1, .961, .933, 1), "sienna": Float32Array.of(.627, .322, .176, 1), "silver": Float32Array.of(.753, .753, .753, 1), "skyblue": Float32Array.of(.529, .808, .922, 1), "slateblue": Float32Array.of(.416, .353, .804, 1), "slategray": Float32Array.of(.439, .502, .565, 1), "slategrey": Float32Array.of(.439, .502, .565, 1), "snow": Float32Array.of(1, .98, .98, 1), "springgreen": Float32Array.of(0, 1, .498, 1), "steelblue": Float32Array.of(.275, .51, .706, 1), "tan": Float32Array.of(.824, .706, .549, 1), "teal": Float32Array.of(0, .502, .502, 1), "thistle": Float32Array.of(.847, .749, .847, 1), "tomato": Float32Array.of(1, .388, .278, 1), "transparent": Float32Array.of(0, 0, 0, 0), "turquoise": Float32Array.of(.251, .878, .816, 1), "violet": Float32Array.of(.933, .51, .933, 1), "wheat": Float32Array.of(.961, .871, .702, 1), "white": Float32Array.of(1, 1, 1, 1), "whitesmoke": Float32Array.of(.961, .961, .961, 1), "yellow": Float32Array.of(1, 1, 0, 1), "yellowgreen": Float32Array.of(.604, .804, .196, 1) };

                    function colorToString(skcolor) {
                        var components = CanvasKit.getColorComponents(skcolor);
                        var r = components[0];
                        var g = components[1];
                        var b = components[2];
                        var a = components[3];
                        if (a === 1) {
                            r = r.toString(16).toLowerCase();
                            g = g.toString(16).toLowerCase();
                            b = b.toString(16).toLowerCase();
                            r = r.length === 1 ? "0" + r : r;
                            g = g.length === 1 ? "0" + g : g;
                            b = b.length === 1 ? "0" + b : b;
                            return "#" + r + g + b
                        } else { a = a === 0 || a === 1 ? a : a.toFixed(8); return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")" }
                    }

                    function parseColor(colorStr) { return CanvasKit.parseColorString(colorStr, colorMap) }
                    CanvasKit._testing["parseColor"] = parseColor;
                    CanvasKit._testing["colorToString"] = colorToString;
                    var fontStringRegex = new RegExp("(italic|oblique|normal|)\\s*" + "(small-caps|normal|)\\s*" + "(bold|bolder|lighter|[1-9]00|normal|)\\s*" + "([\\d\\.]+)" + "(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)" + "(.+)");
                    var defaultHeight = 16;

                    function parseFontString(fontStr) {
                        var font = fontStringRegex.exec(fontStr);
                        if (!font) { Debug("Invalid font string " + fontStr); return null }
                        var size = parseFloat(font[4]);
                        var sizePx = defaultHeight;
                        var unit = font[5];
                        switch (unit) {
                            case "em":
                            case "rem":
                                sizePx = size * defaultHeight;
                                break;
                            case "pt":
                                sizePx = size * 4 / 3;
                                break;
                            case "px":
                                sizePx = size;
                                break;
                            case "pc":
                                sizePx = size * defaultHeight;
                                break;
                            case "in":
                                sizePx = size * 96;
                                break;
                            case "cm":
                                sizePx = size * 96 / 2.54;
                                break;
                            case "mm":
                                sizePx = size * (96 / 25.4);
                                break;
                            case "q":
                                sizePx = size * (96 / 25.4 / 4);
                                break;
                            case "%":
                                sizePx = size * (defaultHeight / 75);
                                break
                        }
                        return { "style": font[1], "variant": font[2], "weight": font[3], "sizePx": sizePx, "family": font[6].trim() }
                    }

                    function getTypeface(fontstr) {
                        var descriptors = parseFontString(fontstr);
                        var typeface = getFromFontCache(descriptors);
                        descriptors["typeface"] = typeface;
                        return descriptors
                    }
                    var fontCache = { "Noto Mono": { "*": null }, "monospace": { "*": null } };

                    function addToFontCache(typeface, descriptors) {
                        var key = (descriptors["style"] || "normal") + "|" + (descriptors["variant"] || "normal") + "|" + (descriptors["weight"] || "normal");
                        var fam = descriptors["family"];
                        if (!fontCache[fam]) { fontCache[fam] = { "*": typeface } }
                        fontCache[fam][key] = typeface
                    }

                    function getFromFontCache(descriptors) { var key = (descriptors["style"] || "normal") + "|" + (descriptors["variant"] || "normal") + "|" + (descriptors["weight"] || "normal"); var fam = descriptors["family"]; if (!fontCache[fam]) { return null } return fontCache[fam][key] || fontCache[fam]["*"] }
                    CanvasKit._testing["parseFontString"] = parseFontString;

                    function CanvasRenderingContext2D(skcanvas) {
                        this._canvas = skcanvas;
                        this._paint = new CanvasKit.Paint;
                        this._paint.setAntiAlias(true);
                        this._paint.setStrokeMiter(10);
                        this._paint.setStrokeCap(CanvasKit.StrokeCap.Butt);
                        this._paint.setStrokeJoin(CanvasKit.StrokeJoin.Miter);
                        this._fontString = "10px monospace";
                        this._font = new CanvasKit.Font(null, 10);
                        this._font.setSubpixel(true);
                        this._strokeStyle = CanvasKit.BLACK;
                        this._fillStyle = CanvasKit.BLACK;
                        this._shadowBlur = 0;
                        this._shadowColor = CanvasKit.TRANSPARENT;
                        this._shadowOffsetX = 0;
                        this._shadowOffsetY = 0;
                        this._globalAlpha = 1;
                        this._strokeWidth = 1;
                        this._lineDashOffset = 0;
                        this._lineDashList = [];
                        this._globalCompositeOperation = CanvasKit.BlendMode.SrcOver;
                        this._paint.setStrokeWidth(this._strokeWidth);
                        this._paint.setBlendMode(this._globalCompositeOperation);
                        this._currentPath = new CanvasKit.Path;
                        this._currentTransform = CanvasKit.Matrix.identity();
                        this._canvasStateStack = [];
                        this._toCleanUp = [];
                        this._dispose = function() {
                            this._currentPath.delete();
                            this._paint.delete();
                            this._font.delete();
                            this._toCleanUp.forEach(function(c) { c._dispose() })
                        };
                        Object.defineProperty(this, "currentTransform", { enumerable: true, get: function() { return { "a": this._currentTransform[0], "c": this._currentTransform[1], "e": this._currentTransform[2], "b": this._currentTransform[3], "d": this._currentTransform[4], "f": this._currentTransform[5] } }, set: function(matrix) { if (matrix.a) { this.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f) } } });
                        Object.defineProperty(this, "fillStyle", { enumerable: true, get: function() { if (isCanvasKitColor(this._fillStyle)) { return colorToString(this._fillStyle) } return this._fillStyle }, set: function(newStyle) { if (typeof newStyle === "string") { this._fillStyle = parseColor(newStyle) } else if (newStyle._getShader) { this._fillStyle = newStyle } } });
                        Object.defineProperty(this, "font", {
                            enumerable: true,
                            get: function() { return this._fontString },
                            set: function(newFont) {
                                var tf = getTypeface(newFont);
                                if (tf) {
                                    this._font.setSize(tf["sizePx"]);
                                    this._font.setTypeface(tf["typeface"]);
                                    this._fontString = newFont
                                }
                            }
                        });
                        Object.defineProperty(this, "globalAlpha", {
                            enumerable: true,
                            get: function() { return this._globalAlpha },
                            set: function(newAlpha) {
                                if (!isFinite(newAlpha) || newAlpha < 0 || newAlpha > 1) { return }
                                this._globalAlpha = newAlpha
                            }
                        });
                        Object.defineProperty(this, "globalCompositeOperation", {
                            enumerable: true,
                            get: function() {
                                switch (this._globalCompositeOperation) {
                                    case CanvasKit.BlendMode.SrcOver:
                                        return "source-over";
                                    case CanvasKit.BlendMode.DstOver:
                                        return "destination-over";
                                    case CanvasKit.BlendMode.Src:
                                        return "copy";
                                    case CanvasKit.BlendMode.Dst:
                                        return "destination";
                                    case CanvasKit.BlendMode.Clear:
                                        return "clear";
                                    case CanvasKit.BlendMode.SrcIn:
                                        return "source-in";
                                    case CanvasKit.BlendMode.DstIn:
                                        return "destination-in";
                                    case CanvasKit.BlendMode.SrcOut:
                                        return "source-out";
                                    case CanvasKit.BlendMode.DstOut:
                                        return "destination-out";
                                    case CanvasKit.BlendMode.SrcATop:
                                        return "source-atop";
                                    case CanvasKit.BlendMode.DstATop:
                                        return "destination-atop";
                                    case CanvasKit.BlendMode.Xor:
                                        return "xor";
                                    case CanvasKit.BlendMode.Plus:
                                        return "lighter";
                                    case CanvasKit.BlendMode.Multiply:
                                        return "multiply";
                                    case CanvasKit.BlendMode.Screen:
                                        return "screen";
                                    case CanvasKit.BlendMode.Overlay:
                                        return "overlay";
                                    case CanvasKit.BlendMode.Darken:
                                        return "darken";
                                    case CanvasKit.BlendMode.Lighten:
                                        return "lighten";
                                    case CanvasKit.BlendMode.ColorDodge:
                                        return "color-dodge";
                                    case CanvasKit.BlendMode.ColorBurn:
                                        return "color-burn";
                                    case CanvasKit.BlendMode.HardLight:
                                        return "hard-light";
                                    case CanvasKit.BlendMode.SoftLight:
                                        return "soft-light";
                                    case CanvasKit.BlendMode.Difference:
                                        return "difference";
                                    case CanvasKit.BlendMode.Exclusion:
                                        return "exclusion";
                                    case CanvasKit.BlendMode.Hue:
                                        return "hue";
                                    case CanvasKit.BlendMode.Saturation:
                                        return "saturation";
                                    case CanvasKit.BlendMode.Color:
                                        return "color";
                                    case CanvasKit.BlendMode.Luminosity:
                                        return "luminosity"
                                }
                            },
                            set: function(newMode) {
                                switch (newMode) {
                                    case "source-over":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.SrcOver;
                                        break;
                                    case "destination-over":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.DstOver;
                                        break;
                                    case "copy":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Src;
                                        break;
                                    case "destination":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Dst;
                                        break;
                                    case "clear":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Clear;
                                        break;
                                    case "source-in":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.SrcIn;
                                        break;
                                    case "destination-in":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.DstIn;
                                        break;
                                    case "source-out":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.SrcOut;
                                        break;
                                    case "destination-out":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.DstOut;
                                        break;
                                    case "source-atop":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.SrcATop;
                                        break;
                                    case "destination-atop":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.DstATop;
                                        break;
                                    case "xor":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Xor;
                                        break;
                                    case "lighter":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Plus;
                                        break;
                                    case "plus-lighter":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Plus;
                                        break;
                                    case "plus-darker":
                                        throw "plus-darker is not supported";
                                    case "multiply":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Multiply;
                                        break;
                                    case "screen":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Screen;
                                        break;
                                    case "overlay":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Overlay;
                                        break;
                                    case "darken":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Darken;
                                        break;
                                    case "lighten":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Lighten;
                                        break;
                                    case "color-dodge":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.ColorDodge;
                                        break;
                                    case "color-burn":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.ColorBurn;
                                        break;
                                    case "hard-light":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.HardLight;
                                        break;
                                    case "soft-light":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.SoftLight;
                                        break;
                                    case "difference":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Difference;
                                        break;
                                    case "exclusion":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Exclusion;
                                        break;
                                    case "hue":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Hue;
                                        break;
                                    case "saturation":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Saturation;
                                        break;
                                    case "color":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Color;
                                        break;
                                    case "luminosity":
                                        this._globalCompositeOperation = CanvasKit.BlendMode.Luminosity;
                                        break;
                                    default:
                                        return
                                }
                                this._paint.setBlendMode(this._globalCompositeOperation)
                            }
                        });
                        Object.defineProperty(this, "imageSmoothingEnabled", { enumerable: true, get: function() { return true }, set: function(a) {} });
                        Object.defineProperty(this, "imageSmoothingQuality", { enumerable: true, get: function() { return "high" }, set: function(a) {} });
                        Object.defineProperty(this, "lineCap", {
                            enumerable: true,
                            get: function() {
                                switch (this._paint.getStrokeCap()) {
                                    case CanvasKit.StrokeCap.Butt:
                                        return "butt";
                                    case CanvasKit.StrokeCap.Round:
                                        return "round";
                                    case CanvasKit.StrokeCap.Square:
                                        return "square"
                                }
                            },
                            set: function(newCap) {
                                switch (newCap) {
                                    case "butt":
                                        this._paint.setStrokeCap(CanvasKit.StrokeCap.Butt);
                                        return;
                                    case "round":
                                        this._paint.setStrokeCap(CanvasKit.StrokeCap.Round);
                                        return;
                                    case "square":
                                        this._paint.setStrokeCap(CanvasKit.StrokeCap.Square);
                                        return
                                }
                            }
                        });
                        Object.defineProperty(this, "lineDashOffset", {
                            enumerable: true,
                            get: function() { return this._lineDashOffset },
                            set: function(newOffset) {
                                if (!isFinite(newOffset)) { return }
                                this._lineDashOffset = newOffset
                            }
                        });
                        Object.defineProperty(this, "lineJoin", {
                            enumerable: true,
                            get: function() {
                                switch (this._paint.getStrokeJoin()) {
                                    case CanvasKit.StrokeJoin.Miter:
                                        return "miter";
                                    case CanvasKit.StrokeJoin.Round:
                                        return "round";
                                    case CanvasKit.StrokeJoin.Bevel:
                                        return "bevel"
                                }
                            },
                            set: function(newJoin) {
                                switch (newJoin) {
                                    case "miter":
                                        this._paint.setStrokeJoin(CanvasKit.StrokeJoin.Miter);
                                        return;
                                    case "round":
                                        this._paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
                                        return;
                                    case "bevel":
                                        this._paint.setStrokeJoin(CanvasKit.StrokeJoin.Bevel);
                                        return
                                }
                            }
                        });
                        Object.defineProperty(this, "lineWidth", {
                            enumerable: true,
                            get: function() { return this._paint.getStrokeWidth() },
                            set: function(newWidth) {
                                if (newWidth <= 0 || !newWidth) { return }
                                this._strokeWidth = newWidth;
                                this._paint.setStrokeWidth(newWidth)
                            }
                        });
                        Object.defineProperty(this, "miterLimit", {
                            enumerable: true,
                            get: function() { return this._paint.getStrokeMiter() },
                            set: function(newLimit) {
                                if (newLimit <= 0 || !newLimit) { return }
                                this._paint.setStrokeMiter(newLimit)
                            }
                        });
                        Object.defineProperty(this, "shadowBlur", {
                            enumerable: true,
                            get: function() { return this._shadowBlur },
                            set: function(newBlur) {
                                if (newBlur < 0 || !isFinite(newBlur)) { return }
                                this._shadowBlur = newBlur
                            }
                        });
                        Object.defineProperty(this, "shadowColor", { enumerable: true, get: function() { return colorToString(this._shadowColor) }, set: function(newColor) { this._shadowColor = parseColor(newColor) } });
                        Object.defineProperty(this, "shadowOffsetX", {
                            enumerable: true,
                            get: function() { return this._shadowOffsetX },
                            set: function(newOffset) {
                                if (!isFinite(newOffset)) { return }
                                this._shadowOffsetX = newOffset
                            }
                        });
                        Object.defineProperty(this, "shadowOffsetY", {
                            enumerable: true,
                            get: function() { return this._shadowOffsetY },
                            set: function(newOffset) {
                                if (!isFinite(newOffset)) { return }
                                this._shadowOffsetY = newOffset
                            }
                        });
                        Object.defineProperty(this, "strokeStyle", { enumerable: true, get: function() { return colorToString(this._strokeStyle) }, set: function(newStyle) { if (typeof newStyle === "string") { this._strokeStyle = parseColor(newStyle) } else if (newStyle._getShader) { this._strokeStyle = newStyle } } });
                        this.arc = function(x, y, radius, startAngle, endAngle, ccw) { arc(this._currentPath, x, y, radius, startAngle, endAngle, ccw) };
                        this.arcTo = function(x1, y1, x2, y2, radius) { arcTo(this._currentPath, x1, y1, x2, y2, radius) };
                        this.beginPath = function() {
                            this._currentPath.delete();
                            this._currentPath = new CanvasKit.Path
                        };
                        this.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) { bezierCurveTo(this._currentPath, cp1x, cp1y, cp2x, cp2y, x, y) };
                        this.clearRect = function(x, y, width, height) {
                            this._paint.setStyle(CanvasKit.PaintStyle.Fill);
                            this._paint.setBlendMode(CanvasKit.BlendMode.Clear);
                            this._canvas.drawRect(CanvasKit.XYWHRect(x, y, width, height), this._paint);
                            this._paint.setBlendMode(this._globalCompositeOperation)
                        };
                        this.clip = function(path, fillRule) {
                            if (typeof path === "string") {
                                fillRule = path;
                                path = this._currentPath
                            } else if (path && path._getPath) { path = path._getPath() }
                            if (!path) { path = this._currentPath }
                            var clip = path.copy();
                            if (fillRule && fillRule.toLowerCase() === "evenodd") { clip.setFillType(CanvasKit.FillType.EvenOdd) } else { clip.setFillType(CanvasKit.FillType.Winding) }
                            this._canvas.clipPath(clip, CanvasKit.ClipOp.Intersect, true);
                            clip.delete()
                        };
                        this.closePath = function() { closePath(this._currentPath) };
                        this.createImageData = function() { if (arguments.length === 1) { var oldData = arguments[0]; var byteLength = 4 * oldData.width * oldData.height; return new ImageData(new Uint8ClampedArray(byteLength), oldData.width, oldData.height) } else if (arguments.length === 2) { var width = arguments[0]; var height = arguments[1]; var byteLength = 4 * width * height; return new ImageData(new Uint8ClampedArray(byteLength), width, height) } else { throw "createImageData expects 1 or 2 arguments, got " + arguments.length } };
                        this.createLinearGradient = function(x1, y1, x2, y2) {
                            if (!allAreFinite(arguments)) { return }
                            var lcg = new LinearCanvasGradient(x1, y1, x2, y2);
                            this._toCleanUp.push(lcg);
                            return lcg
                        };
                        this.createPattern = function(image, repetition) {
                            var cp = new CanvasPattern(image, repetition);
                            this._toCleanUp.push(cp);
                            return cp
                        };
                        this.createRadialGradient = function(x1, y1, r1, x2, y2, r2) {
                            if (!allAreFinite(arguments)) { return }
                            var rcg = new RadialCanvasGradient(x1, y1, r1, x2, y2, r2);
                            this._toCleanUp.push(rcg);
                            return rcg
                        };
                        this.drawImage = function(img) {
                            if (img instanceof HTMLImage) { img = img.getSkImage() }
                            var iPaint = this._fillPaint();
                            if (arguments.length === 3 || arguments.length === 5) { var destRect = CanvasKit.XYWHRect(arguments[1], arguments[2], arguments[3] || img.width(), arguments[4] || img.height()); var srcRect = CanvasKit.XYWHRect(0, 0, img.width(), img.height()) } else if (arguments.length === 9) { var destRect = CanvasKit.XYWHRect(arguments[5], arguments[6], arguments[7], arguments[8]); var srcRect = CanvasKit.XYWHRect(arguments[1], arguments[2], arguments[3], arguments[4]) } else { throw "invalid number of args for drawImage, need 3, 5, or 9; got " + arguments.length }
                            this._canvas.drawImageRect(img, srcRect, destRect, iPaint, false);
                            iPaint.dispose()
                        };
                        this.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, ccw) { ellipse(this._currentPath, x, y, radiusX, radiusY, rotation, startAngle, endAngle, ccw) };
                        this._fillPaint = function() {
                            var paint = this._paint.copy();
                            paint.setStyle(CanvasKit.PaintStyle.Fill);
                            if (isCanvasKitColor(this._fillStyle)) {
                                var alphaColor = CanvasKit.multiplyByAlpha(this._fillStyle, this._globalAlpha);
                                paint.setColor(alphaColor)
                            } else {
                                var shader = this._fillStyle._getShader(this._currentTransform);
                                paint.setColor(CanvasKit.Color(0, 0, 0, this._globalAlpha));
                                paint.setShader(shader)
                            }
                            paint.dispose = function() { this.delete() };
                            return paint
                        };
                        this.fill = function(path, fillRule) {
                            if (typeof path === "string") {
                                fillRule = path;
                                path = this._currentPath
                            } else if (path && path._getPath) { path = path._getPath() }
                            if (fillRule === "evenodd") { this._currentPath.setFillType(CanvasKit.FillType.EvenOdd) } else if (fillRule === "nonzero" || !fillRule) { this._currentPath.setFillType(CanvasKit.FillType.Winding) } else { throw "invalid fill rule" }
                            if (!path) { path = this._currentPath }
                            var fillPaint = this._fillPaint();
                            var shadowPaint = this._shadowPaint(fillPaint);
                            if (shadowPaint) {
                                this._canvas.save();
                                this._applyShadowOffsetMatrix();
                                this._canvas.drawPath(path, shadowPaint);
                                this._canvas.restore();
                                shadowPaint.dispose()
                            }
                            this._canvas.drawPath(path, fillPaint);
                            fillPaint.dispose()
                        };
                        this.fillRect = function(x, y, width, height) {
                            var fillPaint = this._fillPaint();
                            var shadowPaint = this._shadowPaint(fillPaint);
                            if (shadowPaint) {
                                this._canvas.save();
                                this._applyShadowOffsetMatrix();
                                this._canvas.drawRect(CanvasKit.XYWHRect(x, y, width, height), shadowPaint);
                                this._canvas.restore();
                                shadowPaint.dispose()
                            }
                            this._canvas.drawRect(CanvasKit.XYWHRect(x, y, width, height), fillPaint);
                            fillPaint.dispose()
                        };
                        this.fillText = function(text, x, y, maxWidth) {
                            var fillPaint = this._fillPaint();
                            var blob = CanvasKit.TextBlob.MakeFromText(text, this._font);
                            var shadowPaint = this._shadowPaint(fillPaint);
                            if (shadowPaint) {
                                this._canvas.save();
                                this._applyShadowOffsetMatrix();
                                this._canvas.drawTextBlob(blob, x, y, shadowPaint);
                                this._canvas.restore();
                                shadowPaint.dispose()
                            }
                            this._canvas.drawTextBlob(blob, x, y, fillPaint);
                            blob.delete();
                            fillPaint.dispose()
                        };
                        this.getImageData = function(x, y, w, h) { var pixels = this._canvas.readPixels(x, y, { "width": w, "height": h, "colorType": CanvasKit.ColorType.RGBA_8888, "alphaType": CanvasKit.AlphaType.Unpremul, "colorSpace": CanvasKit.ColorSpace.SRGB }); if (!pixels) { return null } return new ImageData(new Uint8ClampedArray(pixels.buffer), w, h) };
                        this.getLineDash = function() { return this._lineDashList.slice() };
                        this._mapToLocalCoordinates = function(pts) {
                            var inverted = CanvasKit.Matrix.invert(this._currentTransform);
                            CanvasKit.Matrix.mapPoints(inverted, pts);
                            return pts
                        };
                        this.isPointInPath = function(x, y, fillmode) {
                            var args = arguments;
                            if (args.length === 3) { var path = this._currentPath } else if (args.length === 4) {
                                var path = args[0];
                                x = args[1];
                                y = args[2];
                                fillmode = args[3]
                            } else { throw "invalid arg count, need 3 or 4, got " + args.length }
                            if (!isFinite(x) || !isFinite(y)) { return false }
                            fillmode = fillmode || "nonzero";
                            if (!(fillmode === "nonzero" || fillmode === "evenodd")) { return false }
                            var pts = this._mapToLocalCoordinates([x, y]);
                            x = pts[0];
                            y = pts[1];
                            path.setFillType(fillmode === "nonzero" ? CanvasKit.FillType.Winding : CanvasKit.FillType.EvenOdd);
                            return path.contains(x, y)
                        };
                        this.isPointInStroke = function(x, y) {
                            var args = arguments;
                            if (args.length === 2) { var path = this._currentPath } else if (args.length === 3) {
                                var path = args[0];
                                x = args[1];
                                y = args[2]
                            } else { throw "invalid arg count, need 2 or 3, got " + args.length }
                            if (!isFinite(x) || !isFinite(y)) { return false }
                            var pts = this._mapToLocalCoordinates([x, y]);
                            x = pts[0];
                            y = pts[1];
                            var temp = path.copy();
                            temp.setFillType(CanvasKit.FillType.Winding);
                            temp.stroke({ "width": this.lineWidth, "miter_limit": this.miterLimit, "cap": this._paint.getStrokeCap(), "join": this._paint.getStrokeJoin(), "precision": .3 });
                            var retVal = temp.contains(x, y);
                            temp.delete();
                            return retVal
                        };
                        this.lineTo = function(x, y) { lineTo(this._currentPath, x, y) };
                        this.measureText = function(text) { const ids = this._font.getGlyphIDs(text); const widths = this._font.getGlyphWidths(ids); let totalWidth = 0; for (const w of widths) { totalWidth += w } return { "width": totalWidth } };
                        this.moveTo = function(x, y) { moveTo(this._currentPath, x, y) };
                        this.putImageData = function(imageData, x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
                            if (!allAreFinite([x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight])) { return }
                            if (dirtyX === undefined) { this._canvas.writePixels(imageData.data, imageData.width, imageData.height, x, y); return }
                            dirtyX = dirtyX || 0;
                            dirtyY = dirtyY || 0;
                            dirtyWidth = dirtyWidth || imageData.width;
                            dirtyHeight = dirtyHeight || imageData.height;
                            if (dirtyWidth < 0) {
                                dirtyX = dirtyX + dirtyWidth;
                                dirtyWidth = Math.abs(dirtyWidth)
                            }
                            if (dirtyHeight < 0) {
                                dirtyY = dirtyY + dirtyHeight;
                                dirtyHeight = Math.abs(dirtyHeight)
                            }
                            if (dirtyX < 0) {
                                dirtyWidth = dirtyWidth + dirtyX;
                                dirtyX = 0
                            }
                            if (dirtyY < 0) {
                                dirtyHeight = dirtyHeight + dirtyY;
                                dirtyY = 0
                            }
                            if (dirtyWidth <= 0 || dirtyHeight <= 0) { return }
                            var img = CanvasKit.MakeImage({ "width": imageData.width, "height": imageData.height, "alphaType": CanvasKit.AlphaType.Unpremul, "colorType": CanvasKit.ColorType.RGBA_8888, "colorSpace": CanvasKit.ColorSpace.SRGB }, imageData.data, 4 * imageData.width);
                            var src = CanvasKit.XYWHRect(dirtyX, dirtyY, dirtyWidth, dirtyHeight);
                            var dst = CanvasKit.XYWHRect(x + dirtyX, y + dirtyY, dirtyWidth, dirtyHeight);
                            var inverted = CanvasKit.Matrix.invert(this._currentTransform);
                            this._canvas.save();
                            this._canvas.concat(inverted);
                            this._canvas.drawImageRect(img, src, dst, null, false);
                            this._canvas.restore();
                            img.delete()
                        };
                        this.quadraticCurveTo = function(cpx, cpy, x, y) { quadraticCurveTo(this._currentPath, cpx, cpy, x, y) };
                        this.rect = function(x, y, width, height) { rect(this._currentPath, x, y, width, height) };
                        this.resetTransform = function() {
                            this._currentPath.transform(this._currentTransform);
                            var inverted = CanvasKit.Matrix.invert(this._currentTransform);
                            this._canvas.concat(inverted);
                            this._currentTransform = this._canvas.getTotalMatrix()
                        };
                        this.restore = function() {
                            var newState = this._canvasStateStack.pop();
                            if (!newState) { return }
                            var combined = CanvasKit.Matrix.multiply(this._currentTransform, CanvasKit.Matrix.invert(newState.ctm));
                            this._currentPath.transform(combined);
                            this._paint.delete();
                            this._paint = newState.paint;
                            this._lineDashList = newState.ldl;
                            this._strokeWidth = newState.sw;
                            this._strokeStyle = newState.ss;
                            this._fillStyle = newState.fs;
                            this._shadowOffsetX = newState.sox;
                            this._shadowOffsetY = newState.soy;
                            this._shadowBlur = newState.sb;
                            this._shadowColor = newState.shc;
                            this._globalAlpha = newState.ga;
                            this._globalCompositeOperation = newState.gco;
                            this._lineDashOffset = newState.ldo;
                            this._fontString = newState.fontstr;
                            this._canvas.restore();
                            this._currentTransform = this._canvas.getTotalMatrix()
                        };
                        this.rotate = function(radians) {
                            if (!isFinite(radians)) { return }
                            var inverted = CanvasKit.Matrix.rotated(-radians);
                            this._currentPath.transform(inverted);
                            this._canvas.rotate(radiansToDegrees(radians), 0, 0);
                            this._currentTransform = this._canvas.getTotalMatrix()
                        };
                        this.save = function() {
                            if (this._fillStyle._copy) {
                                var fs = this._fillStyle._copy();
                                this._toCleanUp.push(fs)
                            } else { var fs = this._fillStyle }
                            if (this._strokeStyle._copy) {
                                var ss = this._strokeStyle._copy();
                                this._toCleanUp.push(ss)
                            } else { var ss = this._strokeStyle }
                            this._canvasStateStack.push({ ctm: this._currentTransform.slice(), ldl: this._lineDashList.slice(), sw: this._strokeWidth, ss: ss, fs: fs, sox: this._shadowOffsetX, soy: this._shadowOffsetY, sb: this._shadowBlur, shc: this._shadowColor, ga: this._globalAlpha, ldo: this._lineDashOffset, gco: this._globalCompositeOperation, paint: this._paint.copy(), fontstr: this._fontString });
                            this._canvas.save()
                        };
                        this.scale = function(sx, sy) {
                            if (!allAreFinite(arguments)) { return }
                            var inverted = CanvasKit.Matrix.scaled(1 / sx, 1 / sy);
                            this._currentPath.transform(inverted);
                            this._canvas.scale(sx, sy);
                            this._currentTransform = this._canvas.getTotalMatrix()
                        };
                        this.setLineDash = function(dashes) {
                            for (var i = 0; i < dashes.length; i++) { if (!isFinite(dashes[i]) || dashes[i] < 0) { Debug("dash list must have positive, finite values"); return } }
                            if (dashes.length % 2 === 1) { Array.prototype.push.apply(dashes, dashes) }
                            this._lineDashList = dashes
                        };
                        this.setTransform = function(a, b, c, d, e, f) {
                            if (!allAreFinite(arguments)) { return }
                            this.resetTransform();
                            this.transform(a, b, c, d, e, f)
                        };
                        this._applyShadowOffsetMatrix = function() {
                            var inverted = CanvasKit.Matrix.invert(this._currentTransform);
                            this._canvas.concat(inverted);
                            this._canvas.concat(CanvasKit.Matrix.translated(this._shadowOffsetX, this._shadowOffsetY));
                            this._canvas.concat(this._currentTransform)
                        };
                        this._shadowPaint = function(basePaint) {
                            var alphaColor = CanvasKit.multiplyByAlpha(this._shadowColor, this._globalAlpha);
                            if (!CanvasKit.getColorComponents(alphaColor)[3]) { return null }
                            if (!(this._shadowBlur || this._shadowOffsetY || this._shadowOffsetX)) { return null }
                            var shadowPaint = basePaint.copy();
                            shadowPaint.setColor(alphaColor);
                            var blurEffect = CanvasKit.MaskFilter.MakeBlur(CanvasKit.BlurStyle.Normal, BlurRadiusToSigma(this._shadowBlur), false);
                            shadowPaint.setMaskFilter(blurEffect);
                            shadowPaint.dispose = function() {
                                blurEffect.delete();
                                this.delete()
                            };
                            return shadowPaint
                        };
                        this._strokePaint = function() {
                            var paint = this._paint.copy();
                            paint.setStyle(CanvasKit.PaintStyle.Stroke);
                            if (isCanvasKitColor(this._strokeStyle)) {
                                var alphaColor = CanvasKit.multiplyByAlpha(this._strokeStyle, this._globalAlpha);
                                paint.setColor(alphaColor)
                            } else {
                                var shader = this._strokeStyle._getShader(this._currentTransform);
                                paint.setColor(CanvasKit.Color(0, 0, 0, this._globalAlpha));
                                paint.setShader(shader)
                            }
                            paint.setStrokeWidth(this._strokeWidth);
                            if (this._lineDashList.length) {
                                var dashedEffect = CanvasKit.PathEffect.MakeDash(this._lineDashList, this._lineDashOffset);
                                paint.setPathEffect(dashedEffect)
                            }
                            paint.dispose = function() {
                                dashedEffect && dashedEffect.delete();
                                this.delete()
                            };
                            return paint
                        };
                        this.stroke = function(path) {
                            path = path ? path._getPath() : this._currentPath;
                            var strokePaint = this._strokePaint();
                            var shadowPaint = this._shadowPaint(strokePaint);
                            if (shadowPaint) {
                                this._canvas.save();
                                this._applyShadowOffsetMatrix();
                                this._canvas.drawPath(path, shadowPaint);
                                this._canvas.restore();
                                shadowPaint.dispose()
                            }
                            this._canvas.drawPath(path, strokePaint);
                            strokePaint.dispose()
                        };
                        this.strokeRect = function(x, y, width, height) {
                            var strokePaint = this._strokePaint();
                            var shadowPaint = this._shadowPaint(strokePaint);
                            if (shadowPaint) {
                                this._canvas.save();
                                this._applyShadowOffsetMatrix();
                                this._canvas.drawRect(CanvasKit.XYWHRect(x, y, width, height), shadowPaint);
                                this._canvas.restore();
                                shadowPaint.dispose()
                            }
                            this._canvas.drawRect(CanvasKit.XYWHRect(x, y, width, height), strokePaint);
                            strokePaint.dispose()
                        };
                        this.strokeText = function(text, x, y, maxWidth) {
                            var strokePaint = this._strokePaint();
                            var blob = CanvasKit.TextBlob.MakeFromText(text, this._font);
                            var shadowPaint = this._shadowPaint(strokePaint);
                            if (shadowPaint) {
                                this._canvas.save();
                                this._applyShadowOffsetMatrix();
                                this._canvas.drawTextBlob(blob, x, y, shadowPaint);
                                this._canvas.restore();
                                shadowPaint.dispose()
                            }
                            this._canvas.drawTextBlob(blob, x, y, strokePaint);
                            blob.delete();
                            strokePaint.dispose()
                        };
                        this.translate = function(dx, dy) {
                            if (!allAreFinite(arguments)) { return }
                            var inverted = CanvasKit.Matrix.translated(-dx, -dy);
                            this._currentPath.transform(inverted);
                            this._canvas.translate(dx, dy);
                            this._currentTransform = this._canvas.getTotalMatrix()
                        };
                        this.transform = function(a, b, c, d, e, f) {
                            var newTransform = [a, c, e, b, d, f, 0, 0, 1];
                            var inverted = CanvasKit.Matrix.invert(newTransform);
                            this._currentPath.transform(inverted);
                            this._canvas.concat(newTransform);
                            this._currentTransform = this._canvas.getTotalMatrix()
                        };
                        this.addHitRegion = function() {};
                        this.clearHitRegions = function() {};
                        this.drawFocusIfNeeded = function() {};
                        this.removeHitRegion = function() {};
                        this.scrollPathIntoView = function() {};
                        Object.defineProperty(this, "canvas", { value: null, writable: false })
                    }

                    function BlurRadiusToSigma(radius) { return radius / 2 }
                    CanvasKit.MakeCanvas = function(width, height) { var surf = CanvasKit.MakeSurface(width, height); if (surf) { return new HTMLCanvas(surf) } return null };

                    function HTMLCanvas(skSurface) {
                        this._surface = skSurface;
                        this._context = new CanvasRenderingContext2D(skSurface.getCanvas());
                        this._toCleanup = [];
                        this.decodeImage = function(data) {
                            var img = CanvasKit.MakeImageFromEncoded(data);
                            if (!img) { throw "Invalid input" }
                            this._toCleanup.push(img);
                            return new HTMLImage(img)
                        };
                        this.loadFont = function(buffer, descriptors) {
                            var newFont = CanvasKit.Typeface.MakeFreeTypeFaceFromData(buffer);
                            if (!newFont) { Debug("font could not be processed", descriptors); return null }
                            this._toCleanup.push(newFont);
                            addToFontCache(newFont, descriptors)
                        };
                        this.makePath2D = function(path) {
                            var p2d = new Path2D(path);
                            this._toCleanup.push(p2d._getPath());
                            return p2d
                        };
                        this.getContext = function(type) { if (type === "2d") { return this._context } return null };
                        this.toDataURL = function(codec, quality) {
                            this._surface.flush();
                            var img = this._surface.makeImageSnapshot();
                            if (!img) { Debug("no snapshot"); return }
                            codec = codec || "image/png";
                            var format = CanvasKit.ImageFormat.PNG;
                            if (codec === "image/jpeg") { format = CanvasKit.ImageFormat.JPEG }
                            quality = quality || .92;
                            var imgBytes = img.encodeToBytes(format, quality);
                            if (!imgBytes) { Debug("encoding failure"); return }
                            img.delete();
                            return "data:" + codec + ";base64," + toBase64String(imgBytes)
                        };
                        this.dispose = function() {
                            this._context._dispose();
                            this._toCleanup.forEach(function(i) { i.delete() });
                            this._surface.dispose()
                        }
                    }

                    function HTMLImage(skImage) {
                        this._skImage = skImage;
                        this.width = skImage.width();
                        this.height = skImage.height();
                        this.naturalWidth = this.width;
                        this.naturalHeight = this.height;
                        this.getSkImage = function() { return skImage }
                    }

                    function ImageData(arr, width, height) {
                        if (!width || height === 0) { throw "invalid dimensions, width and height must be non-zero" }
                        if (arr.length % 4) { throw "arr must be a multiple of 4" }
                        height = height || arr.length / (4 * width);
                        Object.defineProperty(this, "data", { value: arr, writable: false });
                        Object.defineProperty(this, "height", { value: height, writable: false });
                        Object.defineProperty(this, "width", { value: width, writable: false })
                    }
                    CanvasKit.ImageData = function() {
                        if (arguments.length === 2) { var width = arguments[0]; var height = arguments[1]; var byteLength = 4 * width * height; return new ImageData(new Uint8ClampedArray(byteLength), width, height) } else if (arguments.length === 3) {
                            var arr = arguments[0];
                            if (arr.prototype.constructor !== Uint8ClampedArray) { throw "bytes must be given as a Uint8ClampedArray" }
                            var width = arguments[1];
                            var height = arguments[2];
                            if (arr % 4) { throw "bytes must be given in a multiple of 4" }
                            if (arr % width) { throw "bytes must divide evenly by width" }
                            if (height && height !== arr / (width * 4)) { throw "invalid height given" }
                            height = arr / (width * 4);
                            return new ImageData(arr, width, height)
                        } else { throw "invalid number of arguments - takes 2 or 3, saw " + arguments.length }
                    };

                    function LinearCanvasGradient(x1, y1, x2, y2) {
                        this._shader = null;
                        this._colors = [];
                        this._pos = [];
                        this.addColorStop = function(offset, color) {
                            if (offset < 0 || offset > 1 || !isFinite(offset)) { throw "offset must be between 0 and 1 inclusively" }
                            color = parseColor(color);
                            var idx = this._pos.indexOf(offset);
                            if (idx !== -1) { this._colors[idx] = color } else {
                                for (idx = 0; idx < this._pos.length; idx++) { if (this._pos[idx] > offset) { break } }
                                this._pos.splice(idx, 0, offset);
                                this._colors.splice(idx, 0, color)
                            }
                        };
                        this._copy = function() {
                            var lcg = new LinearCanvasGradient(x1, y1, x2, y2);
                            lcg._colors = this._colors.slice();
                            lcg._pos = this._pos.slice();
                            return lcg
                        };
                        this._dispose = function() {
                            if (this._shader) {
                                this._shader.delete();
                                this._shader = null
                            }
                        };
                        this._getShader = function(currentTransform) {
                            var pts = [x1, y1, x2, y2];
                            CanvasKit.Matrix.mapPoints(currentTransform, pts);
                            var sx1 = pts[0];
                            var sy1 = pts[1];
                            var sx2 = pts[2];
                            var sy2 = pts[3];
                            this._dispose();
                            this._shader = CanvasKit.Shader.MakeLinearGradient([sx1, sy1], [sx2, sy2], this._colors, this._pos, CanvasKit.TileMode.Clamp);
                            return this._shader
                        }
                    }

                    function arc(skpath, x, y, radius, startAngle, endAngle, ccw) { ellipse(skpath, x, y, radius, radius, 0, startAngle, endAngle, ccw) }

                    function arcTo(skpath, x1, y1, x2, y2, radius) {
                        if (!allAreFinite([x1, y1, x2, y2, radius])) { return }
                        if (radius < 0) { throw "radii cannot be negative" }
                        if (skpath.isEmpty()) { skpath.moveTo(x1, y1) }
                        skpath.arcToTangent(x1, y1, x2, y2, radius)
                    }

                    function bezierCurveTo(skpath, cp1x, cp1y, cp2x, cp2y, x, y) {
                        if (!allAreFinite([cp1x, cp1y, cp2x, cp2y, x, y])) { return }
                        if (skpath.isEmpty()) { skpath.moveTo(cp1x, cp1y) }
                        skpath.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y)
                    }

                    function closePath(skpath) { if (skpath.isEmpty()) { return } var bounds = skpath.getBounds(); if (bounds[3] - bounds[1] || bounds[2] - bounds[0]) { skpath.close() } }

                    function _ellipseHelper(skpath, x, y, radiusX, radiusY, startAngle, endAngle) {
                        var sweepDegrees = radiansToDegrees(endAngle - startAngle);
                        var startDegrees = radiansToDegrees(startAngle);
                        var oval = CanvasKit.LTRBRect(x - radiusX, y - radiusY, x + radiusX, y + radiusY);
                        if (almostEqual(Math.abs(sweepDegrees), 360)) {
                            var halfSweep = sweepDegrees / 2;
                            skpath.arcToOval(oval, startDegrees, halfSweep, false);
                            skpath.arcToOval(oval, startDegrees + halfSweep, halfSweep, false);
                            return
                        }
                        skpath.arcToOval(oval, startDegrees, sweepDegrees, false)
                    }

                    function ellipse(skpath, x, y, radiusX, radiusY, rotation, startAngle, endAngle, ccw) {
                        if (!allAreFinite([x, y, radiusX, radiusY, rotation, startAngle, endAngle])) { return }
                        if (radiusX < 0 || radiusY < 0) { throw "radii cannot be negative" }
                        var tao = 2 * Math.PI;
                        var newStartAngle = startAngle % tao;
                        if (newStartAngle < 0) { newStartAngle += tao }
                        var delta = newStartAngle - startAngle;
                        startAngle = newStartAngle;
                        endAngle += delta;
                        if (!ccw && endAngle - startAngle >= tao) { endAngle = startAngle + tao } else if (ccw && startAngle - endAngle >= tao) { endAngle = startAngle - tao } else if (!ccw && startAngle > endAngle) { endAngle = startAngle + (tao - (startAngle - endAngle) % tao) } else if (ccw && startAngle < endAngle) { endAngle = startAngle - (tao - (endAngle - startAngle) % tao) }
                        if (!rotation) { _ellipseHelper(skpath, x, y, radiusX, radiusY, startAngle, endAngle); return }
                        var rotated = CanvasKit.Matrix.rotated(rotation, x, y);
                        var rotatedInvert = CanvasKit.Matrix.rotated(-rotation, x, y);
                        skpath.transform(rotatedInvert);
                        _ellipseHelper(skpath, x, y, radiusX, radiusY, startAngle, endAngle);
                        skpath.transform(rotated)
                    }

                    function lineTo(skpath, x, y) {
                        if (!allAreFinite([x, y])) { return }
                        if (skpath.isEmpty()) { skpath.moveTo(x, y) }
                        skpath.lineTo(x, y)
                    }

                    function moveTo(skpath, x, y) {
                        if (!allAreFinite([x, y])) { return }
                        skpath.moveTo(x, y)
                    }

                    function quadraticCurveTo(skpath, cpx, cpy, x, y) {
                        if (!allAreFinite([cpx, cpy, x, y])) { return }
                        if (skpath.isEmpty()) { skpath.moveTo(cpx, cpy) }
                        skpath.quadTo(cpx, cpy, x, y)
                    }

                    function rect(skpath, x, y, width, height) {
                        var rect = CanvasKit.XYWHRect(x, y, width, height);
                        if (!allAreFinite(rect)) { return }
                        skpath.addRect(rect)
                    }

                    function Path2D(path) {
                        this._path = null;
                        if (typeof path === "string") { this._path = CanvasKit.Path.MakeFromSVGString(path) } else if (path && path._getPath) { this._path = path._getPath().copy() } else { this._path = new CanvasKit.Path }
                        this._getPath = function() { return this._path };
                        this.addPath = function(path2d, transform) {
                            if (!transform) { transform = { "a": 1, "c": 0, "e": 0, "b": 0, "d": 1, "f": 0 } }
                            this._path.addPath(path2d._getPath(), [transform.a, transform.c, transform.e, transform.b, transform.d, transform.f])
                        };
                        this.arc = function(x, y, radius, startAngle, endAngle, ccw) { arc(this._path, x, y, radius, startAngle, endAngle, ccw) };
                        this.arcTo = function(x1, y1, x2, y2, radius) { arcTo(this._path, x1, y1, x2, y2, radius) };
                        this.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) { bezierCurveTo(this._path, cp1x, cp1y, cp2x, cp2y, x, y) };
                        this.closePath = function() { closePath(this._path) };
                        this.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, ccw) { ellipse(this._path, x, y, radiusX, radiusY, rotation, startAngle, endAngle, ccw) };
                        this.lineTo = function(x, y) { lineTo(this._path, x, y) };
                        this.moveTo = function(x, y) { moveTo(this._path, x, y) };
                        this.quadraticCurveTo = function(cpx, cpy, x, y) { quadraticCurveTo(this._path, cpx, cpy, x, y) };
                        this.rect = function(x, y, width, height) { rect(this._path, x, y, width, height) }
                    }

                    function CanvasPattern(image, repetition) {
                        this._shader = null;
                        if (image instanceof HTMLImage) { image = image.getSkImage() }
                        this._image = image;
                        this._transform = CanvasKit.Matrix.identity();
                        if (repetition === "") { repetition = "repeat" }
                        switch (repetition) {
                            case "repeat-x":
                                this._tileX = CanvasKit.TileMode.Repeat;
                                this._tileY = CanvasKit.TileMode.Decal;
                                break;
                            case "repeat-y":
                                this._tileX = CanvasKit.TileMode.Decal;
                                this._tileY = CanvasKit.TileMode.Repeat;
                                break;
                            case "repeat":
                                this._tileX = CanvasKit.TileMode.Repeat;
                                this._tileY = CanvasKit.TileMode.Repeat;
                                break;
                            case "no-repeat":
                                this._tileX = CanvasKit.TileMode.Decal;
                                this._tileY = CanvasKit.TileMode.Decal;
                                break;
                            default:
                                throw "invalid repetition mode " + repetition
                        }
                        this.setTransform = function(m) { var t = [m.a, m.c, m.e, m.b, m.d, m.f, 0, 0, 1]; if (allAreFinite(t)) { this._transform = t } };
                        this._copy = function() {
                            var cp = new CanvasPattern;
                            cp._tileX = this._tileX;
                            cp._tileY = this._tileY;
                            return cp
                        };
                        this._dispose = function() {
                            if (this._shader) {
                                this._shader.delete();
                                this._shader = null
                            }
                        };
                        this._getShader = function(currentTransform) {
                            this._dispose();
                            this._shader = this._image.makeShaderCubic(this._tileX, this._tileY, 1 / 3, 1 / 3, this._transform);
                            return this._shader
                        }
                    }

                    function RadialCanvasGradient(x1, y1, r1, x2, y2, r2) {
                        this._shader = null;
                        this._colors = [];
                        this._pos = [];
                        this.addColorStop = function(offset, color) {
                            if (offset < 0 || offset > 1 || !isFinite(offset)) { throw "offset must be between 0 and 1 inclusively" }
                            color = parseColor(color);
                            var idx = this._pos.indexOf(offset);
                            if (idx !== -1) { this._colors[idx] = color } else {
                                for (idx = 0; idx < this._pos.length; idx++) { if (this._pos[idx] > offset) { break } }
                                this._pos.splice(idx, 0, offset);
                                this._colors.splice(idx, 0, color)
                            }
                        };
                        this._copy = function() {
                            var rcg = new RadialCanvasGradient(x1, y1, r1, x2, y2, r2);
                            rcg._colors = this._colors.slice();
                            rcg._pos = this._pos.slice();
                            return rcg
                        };
                        this._dispose = function() {
                            if (this._shader) {
                                this._shader.delete();
                                this._shader = null
                            }
                        };
                        this._getShader = function(currentTransform) {
                            var pts = [x1, y1, x2, y2];
                            CanvasKit.Matrix.mapPoints(currentTransform, pts);
                            var sx1 = pts[0];
                            var sy1 = pts[1];
                            var sx2 = pts[2];
                            var sy2 = pts[3];
                            var sx = currentTransform[0];
                            var sy = currentTransform[4];
                            var scaleFactor = (Math.abs(sx) + Math.abs(sy)) / 2;
                            var sr1 = r1 * scaleFactor;
                            var sr2 = r2 * scaleFactor;
                            this._dispose();
                            this._shader = CanvasKit.Shader.MakeTwoPointConicalGradient([sx1, sy1], sr1, [sx2, sy2], sr2, this._colors, this._pos, CanvasKit.TileMode.Clamp);
                            return this._shader
                        }
                    }
                })()
            })(Module);
            var moduleOverrides = objAssign({}, Module);
            var arguments_ = [];
            var thisProgram = "./this.program";
            var quit_ = (status, toThrow) => { throw toThrow };
            var ENVIRONMENT_IS_WEB = typeof window === "object";
            var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
            var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
            var scriptDirectory = "";

            function locateFile(path) { if (Module["locateFile"]) { return Module["locateFile"](path, scriptDirectory) } return scriptDirectory + path }
            var read_, readAsync, readBinary, setWindowTitle;

            function logExceptionOnExit(e) {
                if (e instanceof ExitStatus) return;
                let toLog = e;
                err("exiting due to exception: " + toLog)
            }
            var fs;
            var nodePath;
            var requireNodeFS;
            if (ENVIRONMENT_IS_NODE) {
                if (ENVIRONMENT_IS_WORKER) { scriptDirectory = require("path").dirname(scriptDirectory) + "/" } else { scriptDirectory = __dirname + "/" }
                requireNodeFS = (() => {
                    if (!nodePath) {
                        fs = require("fs");
                        nodePath = require("path")
                    }
                });
                read_ = function shell_read(filename, binary) {
                    requireNodeFS();
                    filename = nodePath["normalize"](filename);
                    return fs.readFileSync(filename, binary ? null : "utf8")
                };
                readBinary = (filename => { var ret = read_(filename, true); if (!ret.buffer) { ret = new Uint8Array(ret) } return ret });
                readAsync = ((filename, onload, onerror) => {
                    requireNodeFS();
                    filename = nodePath["normalize"](filename);
                    fs.readFile(filename, function(err, data) {
                        if (err) onerror(err);
                        else onload(data.buffer)
                    })
                });
                if (process["argv"].length > 1) { thisProgram = process["argv"][1].replace(/\\/g, "/") }
                arguments_ = process["argv"].slice(2);
                process["on"]("uncaughtException", function(ex) { if (!(ex instanceof ExitStatus)) { throw ex } });
                process["on"]("unhandledRejection", function(reason) { throw reason });
                quit_ = ((status, toThrow) => {
                    if (keepRuntimeAlive()) { process["exitCode"] = status; throw toThrow }
                    logExceptionOnExit(toThrow);
                    process["exit"](status)
                });
                Module["inspect"] = function() { return "[Emscripten Module object]" }
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) { scriptDirectory = self.location.href } else if (typeof document !== "undefined" && document.currentScript) { scriptDirectory = document.currentScript.src }
                if (_scriptDir) { scriptDirectory = _scriptDir }
                if (scriptDirectory.indexOf("blob:") !== 0) { scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1) } else { scriptDirectory = "" } {
                    read_ = (url => {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, false);
                        xhr.send(null);
                        return xhr.responseText
                    });
                    if (ENVIRONMENT_IS_WORKER) {
                        readBinary = (url => {
                            var xhr = new XMLHttpRequest;
                            xhr.open("GET", url, false);
                            xhr.responseType = "arraybuffer";
                            xhr.send(null);
                            return new Uint8Array(xhr.response)
                        })
                    }
                    readAsync = ((url, onload, onerror) => {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = (() => {
                            if (xhr.status == 200 || xhr.status == 0 && xhr.response) { onload(xhr.response); return }
                            onerror()
                        });
                        xhr.onerror = onerror;
                        xhr.send(null)
                    })
                }
                setWindowTitle = (title => document.title = title)
            } else {}
            var out = Module["print"] || console.log.bind(console);
            var err = Module["printErr"] || console.warn.bind(console);
            objAssign(Module, moduleOverrides);
            moduleOverrides = null;
            if (Module["arguments"]) arguments_ = Module["arguments"];
            if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
            if (Module["quit"]) quit_ = Module["quit"];
            var tempRet0 = 0;
            var setTempRet0 = value => { tempRet0 = value };
            var getTempRet0 = () => tempRet0;
            var wasmBinary;
            if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
            var noExitRuntime = Module["noExitRuntime"] || true;
            if (typeof WebAssembly !== "object") { abort("no native wasm support detected") }
            var wasmMemory;
            var ABORT = false;
            var EXITSTATUS;

            function assert(condition, text) { if (!condition) { abort(text) } }
            var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

            function UTF8ArrayToString(heap, idx, maxBytesToRead) {
                var endIdx = idx + maxBytesToRead;
                var endPtr = idx;
                while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
                if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) { return UTF8Decoder.decode(heap.subarray(idx, endPtr)) } else {
                    var str = "";
                    while (idx < endPtr) {
                        var u0 = heap[idx++];
                        if (!(u0 & 128)) { str += String.fromCharCode(u0); continue }
                        var u1 = heap[idx++] & 63;
                        if ((u0 & 224) == 192) { str += String.fromCharCode((u0 & 31) << 6 | u1); continue }
                        var u2 = heap[idx++] & 63;
                        if ((u0 & 240) == 224) { u0 = (u0 & 15) << 12 | u1 << 6 | u2 } else { u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63 }
                        if (u0 < 65536) { str += String.fromCharCode(u0) } else {
                            var ch = u0 - 65536;
                            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                        }
                    }
                }
                return str
            }

            function UTF8ToString(ptr, maxBytesToRead) { return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "" }

            function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
                if (!(maxBytesToWrite > 0)) return 0;
                var startIdx = outIdx;
                var endIdx = outIdx + maxBytesToWrite - 1;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) {
                        var u1 = str.charCodeAt(++i);
                        u = 65536 + ((u & 1023) << 10) | u1 & 1023
                    }
                    if (u <= 127) {
                        if (outIdx >= endIdx) break;
                        heap[outIdx++] = u
                    } else if (u <= 2047) {
                        if (outIdx + 1 >= endIdx) break;
                        heap[outIdx++] = 192 | u >> 6;
                        heap[outIdx++] = 128 | u & 63
                    } else if (u <= 65535) {
                        if (outIdx + 2 >= endIdx) break;
                        heap[outIdx++] = 224 | u >> 12;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    } else {
                        if (outIdx + 3 >= endIdx) break;
                        heap[outIdx++] = 240 | u >> 18;
                        heap[outIdx++] = 128 | u >> 12 & 63;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    }
                }
                heap[outIdx] = 0;
                return outIdx - startIdx
            }

            function stringToUTF8(str, outPtr, maxBytesToWrite) { return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite) }

            function lengthBytesUTF8(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
                    if (u <= 127) ++len;
                    else if (u <= 2047) len += 2;
                    else if (u <= 65535) len += 3;
                    else len += 4
                }
                return len
            }
            var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

            function UTF16ToString(ptr, maxBytesToRead) {
                var endPtr = ptr;
                var idx = endPtr >> 1;
                var maxIdx = idx + maxBytesToRead / 2;
                while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
                endPtr = idx << 1;
                if (endPtr - ptr > 32 && UTF16Decoder) { return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr)) } else {
                    var str = "";
                    for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
                        var codeUnit = HEAP16[ptr + i * 2 >> 1];
                        if (codeUnit == 0) break;
                        str += String.fromCharCode(codeUnit)
                    }
                    return str
                }
            }

            function stringToUTF16(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) { maxBytesToWrite = 2147483647 }
                if (maxBytesToWrite < 2) return 0;
                maxBytesToWrite -= 2;
                var startPtr = outPtr;
                var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
                for (var i = 0; i < numCharsToWrite; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    HEAP16[outPtr >> 1] = codeUnit;
                    outPtr += 2
                }
                HEAP16[outPtr >> 1] = 0;
                return outPtr - startPtr
            }

            function lengthBytesUTF16(str) { return str.length * 2 }

            function UTF32ToString(ptr, maxBytesToRead) {
                var i = 0;
                var str = "";
                while (!(i >= maxBytesToRead / 4)) {
                    var utf32 = HEAP32[ptr + i * 4 >> 2];
                    if (utf32 == 0) break;
                    ++i;
                    if (utf32 >= 65536) {
                        var ch = utf32 - 65536;
                        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                    } else { str += String.fromCharCode(utf32) }
                }
                return str
            }

            function stringToUTF32(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) { maxBytesToWrite = 2147483647 }
                if (maxBytesToWrite < 4) return 0;
                var startPtr = outPtr;
                var endPtr = startPtr + maxBytesToWrite - 4;
                for (var i = 0; i < str.length; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    if (codeUnit >= 55296 && codeUnit <= 57343) {
                        var trailSurrogate = str.charCodeAt(++i);
                        codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
                    }
                    HEAP32[outPtr >> 2] = codeUnit;
                    outPtr += 4;
                    if (outPtr + 4 > endPtr) break
                }
                HEAP32[outPtr >> 2] = 0;
                return outPtr - startPtr
            }

            function lengthBytesUTF32(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
                    len += 4
                }
                return len
            }

            function writeArrayToMemory(array, buffer) { HEAP8.set(array, buffer) }

            function writeAsciiToMemory(str, buffer, dontAddNull) { for (var i = 0; i < str.length; ++i) { HEAP8[buffer++ >> 0] = str.charCodeAt(i) } if (!dontAddNull) HEAP8[buffer >> 0] = 0 }

            function alignUp(x, multiple) { if (x % multiple > 0) { x += multiple - x % multiple } return x }
            var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

            function updateGlobalBufferAndViews(buf) {
                buffer = buf;
                Module["HEAP8"] = HEAP8 = new Int8Array(buf);
                Module["HEAP16"] = HEAP16 = new Int16Array(buf);
                Module["HEAP32"] = HEAP32 = new Int32Array(buf);
                Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
                Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
                Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
                Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
                Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
            }
            var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 134217728;
            var wasmTable;
            var __ATPRERUN__ = [];
            var __ATINIT__ = [];
            var __ATPOSTRUN__ = [];
            var runtimeInitialized = false;
            var runtimeExited = false;
            var runtimeKeepaliveCounter = 0;

            function keepRuntimeAlive() { return noExitRuntime || runtimeKeepaliveCounter > 0 }

            function preRun() {
                if (Module["preRun"]) { if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]]; while (Module["preRun"].length) { addOnPreRun(Module["preRun"].shift()) } }
                callRuntimeCallbacks(__ATPRERUN__)
            }

            function initRuntime() {
                runtimeInitialized = true;
                callRuntimeCallbacks(__ATINIT__)
            }

            function exitRuntime() { runtimeExited = true }

            function postRun() {
                if (Module["postRun"]) { if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]]; while (Module["postRun"].length) { addOnPostRun(Module["postRun"].shift()) } }
                callRuntimeCallbacks(__ATPOSTRUN__)
            }

            function addOnPreRun(cb) { __ATPRERUN__.unshift(cb) }

            function addOnInit(cb) { __ATINIT__.unshift(cb) }

            function addOnPostRun(cb) { __ATPOSTRUN__.unshift(cb) }
            var runDependencies = 0;
            var runDependencyWatcher = null;
            var dependenciesFulfilled = null;

            function addRunDependency(id) { runDependencies++; if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) } }

            function removeRunDependency(id) {
                runDependencies--;
                if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) }
                if (runDependencies == 0) {
                    if (runDependencyWatcher !== null) {
                        clearInterval(runDependencyWatcher);
                        runDependencyWatcher = null
                    }
                    if (dependenciesFulfilled) {
                        var callback = dependenciesFulfilled;
                        dependenciesFulfilled = null;
                        callback()
                    }
                }
            }
            Module["preloadedImages"] = {};
            Module["preloadedAudios"] = {};

            function abort(what) {
                { if (Module["onAbort"]) { Module["onAbort"](what) } }
                what = "Aborted(" + what + ")";
                err(what);
                ABORT = true;
                EXITSTATUS = 1;
                what += ". Build with -s ASSERTIONS=1 for more info.";
                var e = new WebAssembly.RuntimeError(what);
                readyPromiseReject(e);
                throw e
            }
            var dataURIPrefix = "data:application/octet-stream;base64,";

            function isDataURI(filename) { return filename.startsWith(dataURIPrefix) }

            function isFileURI(filename) { return filename.startsWith("file://") }
            var wasmBinaryFile;
            wasmBinaryFile = "canvaskit.wasm";
            if (!isDataURI(wasmBinaryFile)) { wasmBinaryFile = locateFile(wasmBinaryFile) }

            function getBinary(file) { try { if (file == wasmBinaryFile && wasmBinary) { return new Uint8Array(wasmBinary) } if (readBinary) { return readBinary(file) } else { throw "both async and sync fetching of the wasm failed" } } catch (err) { abort(err) } }

            function getBinaryPromise() { if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) { if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) { return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) { if (!response["ok"]) { throw "failed to load wasm binary file at '" + wasmBinaryFile + "'" } return response["arrayBuffer"]() }).catch(function() { return getBinary(wasmBinaryFile) }) } else { if (readAsync) { return new Promise(function(resolve, reject) { readAsync(wasmBinaryFile, function(response) { resolve(new Uint8Array(response)) }, reject) }) } } } return Promise.resolve().then(function() { return getBinary(wasmBinaryFile) }) }

            function createWasm() {
                var info = { "a": asmLibraryArg };

                function receiveInstance(instance, module) {
                    var exports = instance.exports;
                    Module["asm"] = exports;
                    wasmMemory = Module["asm"]["bd"];
                    updateGlobalBufferAndViews(wasmMemory.buffer);
                    wasmTable = Module["asm"]["ed"];
                    addOnInit(Module["asm"]["cd"]);
                    removeRunDependency("wasm-instantiate")
                }
                addRunDependency("wasm-instantiate");

                function receiveInstantiationResult(result) { receiveInstance(result["instance"]) }

                function instantiateArrayBuffer(receiver) {
                    return getBinaryPromise().then(function(binary) { return WebAssembly.instantiate(binary, info) }).then(function(instance) { return instance }).then(receiver, function(reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason)
                    })
                }

                function instantiateAsync() {
                    if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
                        return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                            var result = WebAssembly.instantiateStreaming(response, info);
                            return result.then(receiveInstantiationResult, function(reason) {
                                err("wasm streaming compile failed: " + reason);
                                err("falling back to ArrayBuffer instantiation");
                                return instantiateArrayBuffer(receiveInstantiationResult)
                            })
                        })
                    } else { return instantiateArrayBuffer(receiveInstantiationResult) }
                }
                if (Module["instantiateWasm"]) { try { var exports = Module["instantiateWasm"](info, receiveInstance); return exports } catch (e) { err("Module.instantiateWasm callback failed with error: " + e); return false } }
                instantiateAsync().catch(readyPromiseReject);
                return {}
            }

            function callRuntimeCallbacks(callbacks) { while (callbacks.length > 0) { var callback = callbacks.shift(); if (typeof callback == "function") { callback(Module); continue } var func = callback.func; if (typeof func === "number") { if (callback.arg === undefined) { getWasmTableEntry(func)() } else { getWasmTableEntry(func)(callback.arg) } } else { func(callback.arg === undefined ? null : callback.arg) } } }

            function getWasmTableEntry(funcPtr) { return wasmTable.get(funcPtr) }

            function ___cxa_allocate_exception(size) { return _malloc(size + 16) + 16 }

            function ExceptionInfo(excPtr) {
                this.excPtr = excPtr;
                this.ptr = excPtr - 16;
                this.set_type = function(type) { HEAP32[this.ptr + 4 >> 2] = type };
                this.get_type = function() { return HEAP32[this.ptr + 4 >> 2] };
                this.set_destructor = function(destructor) { HEAP32[this.ptr + 8 >> 2] = destructor };
                this.get_destructor = function() { return HEAP32[this.ptr + 8 >> 2] };
                this.set_refcount = function(refcount) { HEAP32[this.ptr >> 2] = refcount };
                this.set_caught = function(caught) {
                    caught = caught ? 1 : 0;
                    HEAP8[this.ptr + 12 >> 0] = caught
                };
                this.get_caught = function() { return HEAP8[this.ptr + 12 >> 0] != 0 };
                this.set_rethrown = function(rethrown) {
                    rethrown = rethrown ? 1 : 0;
                    HEAP8[this.ptr + 13 >> 0] = rethrown
                };
                this.get_rethrown = function() { return HEAP8[this.ptr + 13 >> 0] != 0 };
                this.init = function(type, destructor) {
                    this.set_type(type);
                    this.set_destructor(destructor);
                    this.set_refcount(0);
                    this.set_caught(false);
                    this.set_rethrown(false)
                };
                this.add_ref = function() {
                    var value = HEAP32[this.ptr >> 2];
                    HEAP32[this.ptr >> 2] = value + 1
                };
                this.release_ref = function() {
                    var prev = HEAP32[this.ptr >> 2];
                    HEAP32[this.ptr >> 2] = prev - 1;
                    return prev === 1
                }
            }
            var exceptionLast = 0;
            var uncaughtExceptionCount = 0;

            function ___cxa_throw(ptr, type, destructor) {
                var info = new ExceptionInfo(ptr);
                info.init(type, destructor);
                exceptionLast = ptr;
                uncaughtExceptionCount++;
                throw ptr
            }

            function setErrNo(value) { HEAP32[___errno_location() >> 2] = value; return value }
            var SYSCALLS = {
                mappings: {},
                buffers: [null, [],
                    []
                ],
                printChar: function(stream, curr) {
                    var buffer = SYSCALLS.buffers[stream];
                    if (curr === 0 || curr === 10) {
                        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
                        buffer.length = 0
                    } else { buffer.push(curr) }
                },
                varargs: undefined,
                get: function() { SYSCALLS.varargs += 4; var ret = HEAP32[SYSCALLS.varargs - 4 >> 2]; return ret },
                getStr: function(ptr) { var ret = UTF8ToString(ptr); return ret },
                get64: function(low, high) { return low }
            };

            function ___syscall_fcntl64(fd, cmd, varargs) { SYSCALLS.varargs = varargs; return 0 }

            function ___syscall_fstat64(fd, buf) {}

            function ___syscall_fstatat64(dirfd, path, buf, flags) {}

            function ___syscall_ioctl(fd, op, varargs) { SYSCALLS.varargs = varargs; return 0 }

            function ___syscall_lstat64(path, buf) {}

            function zeroMemory(address, size) { HEAPU8.fill(0, address, address + size) }

            function alignMemory(size, alignment) { return Math.ceil(size / alignment) * alignment }

            function mmapAlloc(size) {
                size = alignMemory(size, 65536);
                var ptr = _memalign(65536, size);
                if (!ptr) return 0;
                zeroMemory(ptr, size);
                return ptr
            }

            function syscallMmap2(addr, len, prot, flags, fd, off) {
                off <<= 12;
                var ptr;
                var allocated = false;
                if ((flags & 16) !== 0 && addr % 65536 !== 0) { return -28 }
                if ((flags & 32) !== 0) {
                    ptr = mmapAlloc(len);
                    if (!ptr) return -48;
                    allocated = true
                } else { return -52 }
                SYSCALLS.mappings[ptr] = { malloc: ptr, len: len, allocated: allocated, fd: fd, prot: prot, flags: flags, offset: off };
                return ptr
            }

            function ___syscall_mmap2(addr, len, prot, flags, fd, off) { return syscallMmap2(addr, len, prot, flags, fd, off) }

            function syscallMunmap(addr, len) { var info = SYSCALLS.mappings[addr]; if (len === 0 || !info) { return -28 } if (len === info.len) { SYSCALLS.mappings[addr] = null; if (info.allocated) { _free(info.malloc) } } return 0 }

            function ___syscall_munmap(addr, len) { return syscallMunmap(addr, len) }

            function ___syscall_open(path, flags, varargs) { SYSCALLS.varargs = varargs }

            function ___syscall_stat64(path, buf) {}
            var structRegistrations = {};

            function runDestructors(destructors) {
                while (destructors.length) {
                    var ptr = destructors.pop();
                    var del = destructors.pop();
                    del(ptr)
                }
            }

            function simpleReadValueFromPointer(pointer) { return this["fromWireType"](HEAPU32[pointer >> 2]) }
            var awaitingDependencies = {};
            var registeredTypes = {};
            var typeDependencies = {};
            var char_0 = 48;
            var char_9 = 57;

            function makeLegalFunctionName(name) {
                if (undefined === name) { return "_unknown" }
                name = name.replace(/[^a-zA-Z0-9_]/g, "$");
                var f = name.charCodeAt(0);
                if (f >= char_0 && f <= char_9) { return "_" + name } else { return name }
            }

            function createNamedFunction(name, body) { name = makeLegalFunctionName(name); return function() { null; return body.apply(this, arguments) } }

            function extendError(baseErrorType, errorName) {
                var errorClass = createNamedFunction(errorName, function(message) {
                    this.name = errorName;
                    this.message = message;
                    var stack = new Error(message).stack;
                    if (stack !== undefined) { this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "") }
                });
                errorClass.prototype = Object.create(baseErrorType.prototype);
                errorClass.prototype.constructor = errorClass;
                errorClass.prototype.toString = function() { if (this.message === undefined) { return this.name } else { return this.name + ": " + this.message } };
                return errorClass
            }
            var InternalError = undefined;

            function throwInternalError(message) { throw new InternalError(message) }

            function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
                myTypes.forEach(function(type) { typeDependencies[type] = dependentTypes });

                function onComplete(typeConverters) { var myTypeConverters = getTypeConverters(typeConverters); if (myTypeConverters.length !== myTypes.length) { throwInternalError("Mismatched type converter count") } for (var i = 0; i < myTypes.length; ++i) { registerType(myTypes[i], myTypeConverters[i]) } }
                var typeConverters = new Array(dependentTypes.length);
                var unregisteredTypes = [];
                var registered = 0;
                dependentTypes.forEach(function(dt, i) {
                    if (registeredTypes.hasOwnProperty(dt)) { typeConverters[i] = registeredTypes[dt] } else {
                        unregisteredTypes.push(dt);
                        if (!awaitingDependencies.hasOwnProperty(dt)) { awaitingDependencies[dt] = [] }
                        awaitingDependencies[dt].push(function() { typeConverters[i] = registeredTypes[dt];++registered; if (registered === unregisteredTypes.length) { onComplete(typeConverters) } })
                    }
                });
                if (0 === unregisteredTypes.length) { onComplete(typeConverters) }
            }

            function __embind_finalize_value_object(structType) {
                var reg = structRegistrations[structType];
                delete structRegistrations[structType];
                var rawConstructor = reg.rawConstructor;
                var rawDestructor = reg.rawDestructor;
                var fieldRecords = reg.fields;
                var fieldTypes = fieldRecords.map(function(field) { return field.getterReturnType }).concat(fieldRecords.map(function(field) { return field.setterArgumentType }));
                whenDependentTypesAreResolved([structType], fieldTypes, function(fieldTypes) {
                    var fields = {};
                    fieldRecords.forEach(function(field, i) {
                        var fieldName = field.fieldName;
                        var getterReturnType = fieldTypes[i];
                        var getter = field.getter;
                        var getterContext = field.getterContext;
                        var setterArgumentType = fieldTypes[i + fieldRecords.length];
                        var setter = field.setter;
                        var setterContext = field.setterContext;
                        fields[fieldName] = {
                            read: function(ptr) { return getterReturnType["fromWireType"](getter(getterContext, ptr)) },
                            write: function(ptr, o) {
                                var destructors = [];
                                setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
                                runDestructors(destructors)
                            }
                        }
                    });
                    return [{
                        name: reg.name,
                        "fromWireType": function(ptr) {
                            var rv = {};
                            for (var i in fields) { rv[i] = fields[i].read(ptr) }
                            rawDestructor(ptr);
                            return rv
                        },
                        "toWireType": function(destructors, o) { for (var fieldName in fields) { if (!(fieldName in o)) { throw new TypeError('Missing field:  "' + fieldName + '"') } } var ptr = rawConstructor(); for (fieldName in fields) { fields[fieldName].write(ptr, o[fieldName]) } if (destructors !== null) { destructors.push(rawDestructor, ptr) } return ptr },
                        "argPackAdvance": 8,
                        "readValueFromPointer": simpleReadValueFromPointer,
                        destructorFunction: rawDestructor
                    }]
                })
            }

            function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {}

            function getShiftFromSize(size) {
                switch (size) {
                    case 1:
                        return 0;
                    case 2:
                        return 1;
                    case 4:
                        return 2;
                    case 8:
                        return 3;
                    default:
                        throw new TypeError("Unknown type size: " + size)
                }
            }

            function embind_init_charCodes() {
                var codes = new Array(256);
                for (var i = 0; i < 256; ++i) { codes[i] = String.fromCharCode(i) }
                embind_charCodes = codes
            }
            var embind_charCodes = undefined;

            function readLatin1String(ptr) { var ret = ""; var c = ptr; while (HEAPU8[c]) { ret += embind_charCodes[HEAPU8[c++]] } return ret }
            var BindingError = undefined;

            function throwBindingError(message) { throw new BindingError(message) }

            function registerType(rawType, registeredInstance, options = {}) {
                if (!("argPackAdvance" in registeredInstance)) { throw new TypeError("registerType registeredInstance requires argPackAdvance") }
                var name = registeredInstance.name;
                if (!rawType) { throwBindingError('type "' + name + '" must have a positive integer typeid pointer') }
                if (registeredTypes.hasOwnProperty(rawType)) { if (options.ignoreDuplicateRegistrations) { return } else { throwBindingError("Cannot register type '" + name + "' twice") } }
                registeredTypes[rawType] = registeredInstance;
                delete typeDependencies[rawType];
                if (awaitingDependencies.hasOwnProperty(rawType)) {
                    var callbacks = awaitingDependencies[rawType];
                    delete awaitingDependencies[rawType];
                    callbacks.forEach(function(cb) { cb() })
                }
            }

            function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, { name: name, "fromWireType": function(wt) { return !!wt }, "toWireType": function(destructors, o) { return o ? trueValue : falseValue }, "argPackAdvance": 8, "readValueFromPointer": function(pointer) { var heap; if (size === 1) { heap = HEAP8 } else if (size === 2) { heap = HEAP16 } else if (size === 4) { heap = HEAP32 } else { throw new TypeError("Unknown boolean type size: " + name) } return this["fromWireType"](heap[pointer >> shift]) }, destructorFunction: null })
            }

            function ClassHandle_isAliasOf(other) {
                if (!(this instanceof ClassHandle)) { return false }
                if (!(other instanceof ClassHandle)) { return false }
                var leftClass = this.$$.ptrType.registeredClass;
                var left = this.$$.ptr;
                var rightClass = other.$$.ptrType.registeredClass;
                var right = other.$$.ptr;
                while (leftClass.baseClass) {
                    left = leftClass.upcast(left);
                    leftClass = leftClass.baseClass
                }
                while (rightClass.baseClass) {
                    right = rightClass.upcast(right);
                    rightClass = rightClass.baseClass
                }
                return leftClass === rightClass && left === right
            }

            function shallowCopyInternalPointer(o) { return { count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType } }

            function throwInstanceAlreadyDeleted(obj) {
                function getInstanceTypeName(handle) { return handle.$$.ptrType.registeredClass.name }
                throwBindingError(getInstanceTypeName(obj) + " instance already deleted")
            }
            var finalizationGroup = false;

            function detachFinalizer(handle) {}

            function runDestructor($$) { if ($$.smartPtr) { $$.smartPtrType.rawDestructor($$.smartPtr) } else { $$.ptrType.registeredClass.rawDestructor($$.ptr) } }

            function releaseClassHandle($$) { $$.count.value -= 1; var toDelete = 0 === $$.count.value; if (toDelete) { runDestructor($$) } }

            function attachFinalizer(handle) {
                if ("undefined" === typeof FinalizationGroup) { attachFinalizer = (handle => handle); return handle }
                finalizationGroup = new FinalizationGroup(function(iter) { for (var result = iter.next(); !result.done; result = iter.next()) { var $$ = result.value; if (!$$.ptr) { console.warn("object already deleted: " + $$.ptr) } else { releaseClassHandle($$) } } });
                attachFinalizer = (handle => { finalizationGroup.register(handle, handle.$$, handle.$$); return handle });
                detachFinalizer = (handle => { finalizationGroup.unregister(handle.$$) });
                return attachFinalizer(handle)
            }

            function ClassHandle_clone() {
                if (!this.$$.ptr) { throwInstanceAlreadyDeleted(this) }
                if (this.$$.preservePointerOnDelete) { this.$$.count.value += 1; return this } else {
                    var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
                    clone.$$.count.value += 1;
                    clone.$$.deleteScheduled = false;
                    return clone
                }
            }

            function ClassHandle_delete() {
                if (!this.$$.ptr) { throwInstanceAlreadyDeleted(this) }
                if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) { throwBindingError("Object already scheduled for deletion") }
                detachFinalizer(this);
                releaseClassHandle(this.$$);
                if (!this.$$.preservePointerOnDelete) {
                    this.$$.smartPtr = undefined;
                    this.$$.ptr = undefined
                }
            }

            function ClassHandle_isDeleted() { return !this.$$.ptr }
            var delayFunction = undefined;
            var deletionQueue = [];

            function flushPendingDeletes() {
                while (deletionQueue.length) {
                    var obj = deletionQueue.pop();
                    obj.$$.deleteScheduled = false;
                    obj["delete"]()
                }
            }

            function ClassHandle_deleteLater() {
                if (!this.$$.ptr) { throwInstanceAlreadyDeleted(this) }
                if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) { throwBindingError("Object already scheduled for deletion") }
                deletionQueue.push(this);
                if (deletionQueue.length === 1 && delayFunction) { delayFunction(flushPendingDeletes) }
                this.$$.deleteScheduled = true;
                return this
            }

            function init_ClassHandle() {
                ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
                ClassHandle.prototype["clone"] = ClassHandle_clone;
                ClassHandle.prototype["delete"] = ClassHandle_delete;
                ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
                ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater
            }

            function ClassHandle() {}
            var registeredPointers = {};

            function ensureOverloadTable(proto, methodName, humanName) {
                if (undefined === proto[methodName].overloadTable) {
                    var prevFunc = proto[methodName];
                    proto[methodName] = function() { if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) { throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!") } return proto[methodName].overloadTable[arguments.length].apply(this, arguments) };
                    proto[methodName].overloadTable = [];
                    proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
                }
            }

            function exposePublicSymbol(name, value, numArguments) {
                if (Module.hasOwnProperty(name)) {
                    if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) { throwBindingError("Cannot register public name '" + name + "' twice") }
                    ensureOverloadTable(Module, name, name);
                    if (Module.hasOwnProperty(numArguments)) { throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!") }
                    Module[name].overloadTable[numArguments] = value
                } else { Module[name] = value; if (undefined !== numArguments) { Module[name].numArguments = numArguments } }
            }

            function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
                this.name = name;
                this.constructor = constructor;
                this.instancePrototype = instancePrototype;
                this.rawDestructor = rawDestructor;
                this.baseClass = baseClass;
                this.getActualType = getActualType;
                this.upcast = upcast;
                this.downcast = downcast;
                this.pureVirtualFunctions = []
            }

            function upcastPointer(ptr, ptrClass, desiredClass) {
                while (ptrClass !== desiredClass) {
                    if (!ptrClass.upcast) { throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name) }
                    ptr = ptrClass.upcast(ptr);
                    ptrClass = ptrClass.baseClass
                }
                return ptr
            }

            function constNoSmartPtrRawPointerToWireType(destructors, handle) { if (handle === null) { if (this.isReference) { throwBindingError("null is not a valid " + this.name) } return 0 } if (!handle.$$) { throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name) } if (!handle.$$.ptr) { throwBindingError("Cannot pass deleted object as a pointer of type " + this.name) } var handleClass = handle.$$.ptrType.registeredClass; var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass); return ptr }

            function genericPointerToWireType(destructors, handle) {
                var ptr;
                if (handle === null) { if (this.isReference) { throwBindingError("null is not a valid " + this.name) } if (this.isSmartPointer) { ptr = this.rawConstructor(); if (destructors !== null) { destructors.push(this.rawDestructor, ptr) } return ptr } else { return 0 } }
                if (!handle.$$) { throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name) }
                if (!handle.$$.ptr) { throwBindingError("Cannot pass deleted object as a pointer of type " + this.name) }
                if (!this.isConst && handle.$$.ptrType.isConst) { throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name) }
                var handleClass = handle.$$.ptrType.registeredClass;
                ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
                if (this.isSmartPointer) {
                    if (undefined === handle.$$.smartPtr) { throwBindingError("Passing raw pointer to smart pointer is illegal") }
                    switch (this.sharingPolicy) {
                        case 0:
                            if (handle.$$.smartPtrType === this) { ptr = handle.$$.smartPtr } else { throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name) }
                            break;
                        case 1:
                            ptr = handle.$$.smartPtr;
                            break;
                        case 2:
                            if (handle.$$.smartPtrType === this) { ptr = handle.$$.smartPtr } else {
                                var clonedHandle = handle["clone"]();
                                ptr = this.rawShare(ptr, Emval.toHandle(function() { clonedHandle["delete"]() }));
                                if (destructors !== null) { destructors.push(this.rawDestructor, ptr) }
                            }
                            break;
                        default:
                            throwBindingError("Unsupporting sharing policy")
                    }
                }
                return ptr
            }

            function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) { if (handle === null) { if (this.isReference) { throwBindingError("null is not a valid " + this.name) } return 0 } if (!handle.$$) { throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name) } if (!handle.$$.ptr) { throwBindingError("Cannot pass deleted object as a pointer of type " + this.name) } if (handle.$$.ptrType.isConst) { throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name) } var handleClass = handle.$$.ptrType.registeredClass; var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass); return ptr }

            function RegisteredPointer_getPointee(ptr) { if (this.rawGetPointee) { ptr = this.rawGetPointee(ptr) } return ptr }

            function RegisteredPointer_destructor(ptr) { if (this.rawDestructor) { this.rawDestructor(ptr) } }

            function RegisteredPointer_deleteObject(handle) { if (handle !== null) { handle["delete"]() } }

            function downcastPointer(ptr, ptrClass, desiredClass) { if (ptrClass === desiredClass) { return ptr } if (undefined === desiredClass.baseClass) { return null } var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass); if (rv === null) { return null } return desiredClass.downcast(rv) }

            function getInheritedInstanceCount() { return Object.keys(registeredInstances).length }

            function getLiveInheritedInstances() { var rv = []; for (var k in registeredInstances) { if (registeredInstances.hasOwnProperty(k)) { rv.push(registeredInstances[k]) } } return rv }

            function setDelayFunction(fn) { delayFunction = fn; if (deletionQueue.length && delayFunction) { delayFunction(flushPendingDeletes) } }

            function init_embind() {
                Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
                Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
                Module["flushPendingDeletes"] = flushPendingDeletes;
                Module["setDelayFunction"] = setDelayFunction
            }
            var registeredInstances = {};

            function getBasestPointer(class_, ptr) {
                if (ptr === undefined) { throwBindingError("ptr should not be undefined") }
                while (class_.baseClass) {
                    ptr = class_.upcast(ptr);
                    class_ = class_.baseClass
                }
                return ptr
            }

            function getInheritedInstance(class_, ptr) { ptr = getBasestPointer(class_, ptr); return registeredInstances[ptr] }

            function makeClassHandle(prototype, record) {
                if (!record.ptrType || !record.ptr) { throwInternalError("makeClassHandle requires ptr and ptrType") }
                var hasSmartPtrType = !!record.smartPtrType;
                var hasSmartPtr = !!record.smartPtr;
                if (hasSmartPtrType !== hasSmartPtr) { throwInternalError("Both smartPtrType and smartPtr must be specified") }
                record.count = { value: 1 };
                return attachFinalizer(Object.create(prototype, { $$: { value: record } }))
            }

            function RegisteredPointer_fromWireType(ptr) {
                var rawPointer = this.getPointee(ptr);
                if (!rawPointer) { this.destructor(ptr); return null }
                var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
                if (undefined !== registeredInstance) {
                    if (0 === registeredInstance.$$.count.value) {
                        registeredInstance.$$.ptr = rawPointer;
                        registeredInstance.$$.smartPtr = ptr;
                        return registeredInstance["clone"]()
                    } else {
                        var rv = registeredInstance["clone"]();
                        this.destructor(ptr);
                        return rv
                    }
                }

                function makeDefaultHandle() { if (this.isSmartPointer) { return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr }) } else { return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr: ptr }) } }
                var actualType = this.registeredClass.getActualType(rawPointer);
                var registeredPointerRecord = registeredPointers[actualType];
                if (!registeredPointerRecord) { return makeDefaultHandle.call(this) }
                var toType;
                if (this.isConst) { toType = registeredPointerRecord.constPointerType } else { toType = registeredPointerRecord.pointerType }
                var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
                if (dp === null) { return makeDefaultHandle.call(this) }
                if (this.isSmartPointer) { return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr }) } else { return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp }) }
            }

            function init_RegisteredPointer() {
                RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
                RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
                RegisteredPointer.prototype["argPackAdvance"] = 8;
                RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
                RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
                RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType
            }

            function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
                this.name = name;
                this.registeredClass = registeredClass;
                this.isReference = isReference;
                this.isConst = isConst;
                this.isSmartPointer = isSmartPointer;
                this.pointeeType = pointeeType;
                this.sharingPolicy = sharingPolicy;
                this.rawGetPointee = rawGetPointee;
                this.rawConstructor = rawConstructor;
                this.rawShare = rawShare;
                this.rawDestructor = rawDestructor;
                if (!isSmartPointer && registeredClass.baseClass === undefined) {
                    if (isConst) {
                        this["toWireType"] = constNoSmartPtrRawPointerToWireType;
                        this.destructorFunction = null
                    } else {
                        this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
                        this.destructorFunction = null
                    }
                } else { this["toWireType"] = genericPointerToWireType }
            }

            function replacePublicSymbol(name, value, numArguments) {
                if (!Module.hasOwnProperty(name)) { throwInternalError("Replacing nonexistant public symbol") }
                if (undefined !== Module[name].overloadTable && undefined !== numArguments) { Module[name].overloadTable[numArguments] = value } else {
                    Module[name] = value;
                    Module[name].argCount = numArguments
                }
            }

            function dynCallLegacy(sig, ptr, args) { var f = Module["dynCall_" + sig]; return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr) }

            function dynCall(sig, ptr, args) { if (sig.includes("j")) { return dynCallLegacy(sig, ptr, args) } return getWasmTableEntry(ptr).apply(null, args) }

            function getDynCaller(sig, ptr) { var argCache = []; return function() { argCache.length = arguments.length; for (var i = 0; i < arguments.length; i++) { argCache[i] = arguments[i] } return dynCall(sig, ptr, argCache) } }

            function embind__requireFunction(signature, rawFunction) {
                signature = readLatin1String(signature);

                function makeDynCaller() { if (signature.includes("j")) { return getDynCaller(signature, rawFunction) } return getWasmTableEntry(rawFunction) }
                var fp = makeDynCaller();
                if (typeof fp !== "function") { throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction) }
                return fp
            }
            var UnboundTypeError = undefined;

            function getTypeName(type) {
                var ptr = ___getTypeName(type);
                var rv = readLatin1String(ptr);
                _free(ptr);
                return rv
            }

            function throwUnboundTypeError(message, types) {
                var unboundTypes = [];
                var seen = {};

                function visit(type) {
                    if (seen[type]) { return }
                    if (registeredTypes[type]) { return }
                    if (typeDependencies[type]) { typeDependencies[type].forEach(visit); return }
                    unboundTypes.push(type);
                    seen[type] = true
                }
                types.forEach(visit);
                throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]))
            }

            function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
                name = readLatin1String(name);
                getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
                if (upcast) { upcast = embind__requireFunction(upcastSignature, upcast) }
                if (downcast) { downcast = embind__requireFunction(downcastSignature, downcast) }
                rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
                var legalFunctionName = makeLegalFunctionName(name);
                exposePublicSymbol(legalFunctionName, function() { throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]) });
                whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
                    base = base[0];
                    var baseClass;
                    var basePrototype;
                    if (baseClassRawType) {
                        baseClass = base.registeredClass;
                        basePrototype = baseClass.instancePrototype
                    } else { basePrototype = ClassHandle.prototype }
                    var constructor = createNamedFunction(legalFunctionName, function() { if (Object.getPrototypeOf(this) !== instancePrototype) { throw new BindingError("Use 'new' to construct " + name) } if (undefined === registeredClass.constructor_body) { throw new BindingError(name + " has no accessible constructor") } var body = registeredClass.constructor_body[arguments.length]; if (undefined === body) { throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!") } return body.apply(this, arguments) });
                    var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
                    constructor.prototype = instancePrototype;
                    var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
                    var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
                    var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
                    var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
                    registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
                    replacePublicSymbol(legalFunctionName, constructor);
                    return [referenceConverter, pointerConverter, constPointerConverter]
                })
            }

            function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
                var argCount = argTypes.length;
                if (argCount < 2) { throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!") }
                var isClassMethodFunc = argTypes[1] !== null && classType !== null;
                var needsDestructorStack = false;
                for (var i = 1; i < argTypes.length; ++i) { if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) { needsDestructorStack = true; break } }
                var returns = argTypes[0].name !== "void";
                var expectedArgCount = argCount - 2;
                var argsWired = new Array(expectedArgCount);
                var invokerFuncArgs = [];
                var destructors = [];
                return function() {
                    if (arguments.length !== expectedArgCount) { throwBindingError("function " + humanName + " called with " + arguments.length + " arguments, expected " + expectedArgCount + " args!") }
                    destructors.length = 0;
                    var thisWired;
                    invokerFuncArgs.length = isClassMethodFunc ? 2 : 1;
                    invokerFuncArgs[0] = cppTargetFunc;
                    if (isClassMethodFunc) {
                        thisWired = argTypes[1]["toWireType"](destructors, this);
                        invokerFuncArgs[1] = thisWired
                    }
                    for (var i = 0; i < expectedArgCount; ++i) {
                        argsWired[i] = argTypes[i + 2]["toWireType"](destructors, arguments[i]);
                        invokerFuncArgs.push(argsWired[i])
                    }
                    var rv = cppInvokerFunc.apply(null, invokerFuncArgs);

                    function onDone(rv) { if (needsDestructorStack) { runDestructors(destructors) } else { for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; i++) { var param = i === 1 ? thisWired : argsWired[i - 2]; if (argTypes[i].destructorFunction !== null) { argTypes[i].destructorFunction(param) } } } if (returns) { return argTypes[0]["fromWireType"](rv) } }
                    return onDone(rv)
                }
            }

            function heap32VectorToArray(count, firstElement) { var array = []; for (var i = 0; i < count; i++) { array.push(HEAP32[(firstElement >> 2) + i]) } return array }

            function __embind_register_class_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, fn) {
                var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                methodName = readLatin1String(methodName);
                rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
                whenDependentTypesAreResolved([], [rawClassType], function(classType) {
                    classType = classType[0];
                    var humanName = classType.name + "." + methodName;

                    function unboundTypesHandler() { throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes) }
                    if (methodName.startsWith("@@")) { methodName = Symbol[methodName.substring(2)] }
                    var proto = classType.registeredClass.constructor;
                    if (undefined === proto[methodName]) {
                        unboundTypesHandler.argCount = argCount - 1;
                        proto[methodName] = unboundTypesHandler
                    } else {
                        ensureOverloadTable(proto, methodName, humanName);
                        proto[methodName].overloadTable[argCount - 1] = unboundTypesHandler
                    }
                    whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
                        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
                        var func = craftInvokerFunction(humanName, invokerArgsArray, null, rawInvoker, fn);
                        if (undefined === proto[methodName].overloadTable) {
                            func.argCount = argCount - 1;
                            proto[methodName] = func
                        } else { proto[methodName].overloadTable[argCount - 1] = func }
                        return []
                    });
                    return []
                })
            }

            function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
                assert(argCount > 0);
                var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                invoker = embind__requireFunction(invokerSignature, invoker);
                whenDependentTypesAreResolved([], [rawClassType], function(classType) {
                    classType = classType[0];
                    var humanName = "constructor " + classType.name;
                    if (undefined === classType.registeredClass.constructor_body) { classType.registeredClass.constructor_body = [] }
                    if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) { throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!") }
                    classType.registeredClass.constructor_body[argCount - 1] = (() => { throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes) });
                    whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
                        argTypes.splice(1, 0, null);
                        classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
                        return []
                    });
                    return []
                })
            }

            function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
                var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                methodName = readLatin1String(methodName);
                rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
                whenDependentTypesAreResolved([], [rawClassType], function(classType) {
                    classType = classType[0];
                    var humanName = classType.name + "." + methodName;
                    if (methodName.startsWith("@@")) { methodName = Symbol[methodName.substring(2)] }
                    if (isPureVirtual) { classType.registeredClass.pureVirtualFunctions.push(methodName) }

                    function unboundTypesHandler() { throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes) }
                    var proto = classType.registeredClass.instancePrototype;
                    var method = proto[methodName];
                    if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
                        unboundTypesHandler.argCount = argCount - 2;
                        unboundTypesHandler.className = classType.name;
                        proto[methodName] = unboundTypesHandler
                    } else {
                        ensureOverloadTable(proto, methodName, humanName);
                        proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler
                    }
                    whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
                        var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
                        if (undefined === proto[methodName].overloadTable) {
                            memberFunction.argCount = argCount - 2;
                            proto[methodName] = memberFunction
                        } else { proto[methodName].overloadTable[argCount - 2] = memberFunction }
                        return []
                    });
                    return []
                })
            }

            function __embind_register_constant(name, type, value) {
                name = readLatin1String(name);
                whenDependentTypesAreResolved([], [type], function(type) {
                    type = type[0];
                    Module[name] = type["fromWireType"](value);
                    return []
                })
            }
            var emval_free_list = [];
            var emval_handle_array = [{}, { value: undefined }, { value: null }, { value: true }, { value: false }];

            function __emval_decref(handle) {
                if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
                    emval_handle_array[handle] = undefined;
                    emval_free_list.push(handle)
                }
            }

            function count_emval_handles() { var count = 0; for (var i = 5; i < emval_handle_array.length; ++i) { if (emval_handle_array[i] !== undefined) {++count } } return count }

            function get_first_emval() { for (var i = 5; i < emval_handle_array.length; ++i) { if (emval_handle_array[i] !== undefined) { return emval_handle_array[i] } } return null }

            function init_emval() {
                Module["count_emval_handles"] = count_emval_handles;
                Module["get_first_emval"] = get_first_emval
            }
            var Emval = {
                toValue: function(handle) { if (!handle) { throwBindingError("Cannot use deleted val. handle = " + handle) } return emval_handle_array[handle].value },
                toHandle: function(value) {
                    switch (value) {
                        case undefined:
                            { return 1 }
                        case null:
                            { return 2 }
                        case true:
                            { return 3 }
                        case false:
                            { return 4 }
                        default:
                            { var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;emval_handle_array[handle] = { refcount: 1, value: value }; return handle }
                    }
                }
            };

            function __embind_register_emval(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(handle) {
                        var rv = Emval.toValue(handle);
                        __emval_decref(handle);
                        return rv
                    },
                    "toWireType": function(destructors, value) { return Emval.toHandle(value) },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: null
                })
            }

            function enumReadValueFromPointer(name, shift, signed) {
                switch (shift) {
                    case 0:
                        return function(pointer) { var heap = signed ? HEAP8 : HEAPU8; return this["fromWireType"](heap[pointer]) };
                    case 1:
                        return function(pointer) { var heap = signed ? HEAP16 : HEAPU16; return this["fromWireType"](heap[pointer >> 1]) };
                    case 2:
                        return function(pointer) { var heap = signed ? HEAP32 : HEAPU32; return this["fromWireType"](heap[pointer >> 2]) };
                    default:
                        throw new TypeError("Unknown integer type: " + name)
                }
            }

            function __embind_register_enum(rawType, name, size, isSigned) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);

                function ctor() {}
                ctor.values = {};
                registerType(rawType, { name: name, constructor: ctor, "fromWireType": function(c) { return this.constructor.values[c] }, "toWireType": function(destructors, c) { return c.value }, "argPackAdvance": 8, "readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned), destructorFunction: null });
                exposePublicSymbol(name, ctor)
            }

            function requireRegisteredType(rawType, humanName) { var impl = registeredTypes[rawType]; if (undefined === impl) { throwBindingError(humanName + " has unknown type " + getTypeName(rawType)) } return impl }

            function __embind_register_enum_value(rawEnumType, name, enumValue) {
                var enumType = requireRegisteredType(rawEnumType, "enum");
                name = readLatin1String(name);
                var Enum = enumType.constructor;
                var Value = Object.create(enumType.constructor.prototype, { value: { value: enumValue }, constructor: { value: createNamedFunction(enumType.name + "_" + name, function() {}) } });
                Enum.values[enumValue] = Value;
                Enum[name] = Value
            }

            function _embind_repr(v) { if (v === null) { return "null" } var t = typeof v; if (t === "object" || t === "array" || t === "function") { return v.toString() } else { return "" + v } }

            function floatReadValueFromPointer(name, shift) {
                switch (shift) {
                    case 2:
                        return function(pointer) { return this["fromWireType"](HEAPF32[pointer >> 2]) };
                    case 3:
                        return function(pointer) { return this["fromWireType"](HEAPF64[pointer >> 3]) };
                    default:
                        throw new TypeError("Unknown float type: " + name)
                }
            }

            function __embind_register_float(rawType, name, size) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, { name: name, "fromWireType": function(value) { return value }, "toWireType": function(destructors, value) { return value }, "argPackAdvance": 8, "readValueFromPointer": floatReadValueFromPointer(name, shift), destructorFunction: null })
            }

            function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
                var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                name = readLatin1String(name);
                rawInvoker = embind__requireFunction(signature, rawInvoker);
                exposePublicSymbol(name, function() { throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes) }, argCount - 1);
                whenDependentTypesAreResolved([], argTypes, function(argTypes) {
                    var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
                    replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
                    return []
                })
            }

            function integerReadValueFromPointer(name, shift, signed) {
                switch (shift) {
                    case 0:
                        return signed ? function readS8FromPointer(pointer) { return HEAP8[pointer] } : function readU8FromPointer(pointer) { return HEAPU8[pointer] };
                    case 1:
                        return signed ? function readS16FromPointer(pointer) { return HEAP16[pointer >> 1] } : function readU16FromPointer(pointer) { return HEAPU16[pointer >> 1] };
                    case 2:
                        return signed ? function readS32FromPointer(pointer) { return HEAP32[pointer >> 2] } : function readU32FromPointer(pointer) { return HEAPU32[pointer >> 2] };
                    default:
                        throw new TypeError("Unknown integer type: " + name)
                }
            }

            function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
                name = readLatin1String(name);
                if (maxRange === -1) { maxRange = 4294967295 }
                var shift = getShiftFromSize(size);
                var fromWireType = value => value;
                if (minRange === 0) {
                    var bitshift = 32 - 8 * size;
                    fromWireType = (value => value << bitshift >>> bitshift)
                }
                var isUnsignedType = name.includes("unsigned");
                var checkAssertions = (value, toTypeName) => {};
                var toWireType;
                if (isUnsignedType) { toWireType = function(destructors, value) { checkAssertions(value, this.name); return value >>> 0 } } else { toWireType = function(destructors, value) { checkAssertions(value, this.name); return value } }
                registerType(primitiveType, { name: name, "fromWireType": fromWireType, "toWireType": toWireType, "argPackAdvance": 8, "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0), destructorFunction: null })
            }

            function __embind_register_memory_view(rawType, dataTypeIndex, name) {
                var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
                var TA = typeMapping[dataTypeIndex];

                function decodeMemoryView(handle) { handle = handle >> 2; var heap = HEAPU32; var size = heap[handle]; var data = heap[handle + 1]; return new TA(buffer, data, size) }
                name = readLatin1String(name);
                registerType(rawType, { name: name, "fromWireType": decodeMemoryView, "argPackAdvance": 8, "readValueFromPointer": decodeMemoryView }, { ignoreDuplicateRegistrations: true })
            }

            function __embind_register_smart_ptr(rawType, rawPointeeType, name, sharingPolicy, getPointeeSignature, rawGetPointee, constructorSignature, rawConstructor, shareSignature, rawShare, destructorSignature, rawDestructor) {
                name = readLatin1String(name);
                rawGetPointee = embind__requireFunction(getPointeeSignature, rawGetPointee);
                rawConstructor = embind__requireFunction(constructorSignature, rawConstructor);
                rawShare = embind__requireFunction(shareSignature, rawShare);
                rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
                whenDependentTypesAreResolved([rawType], [rawPointeeType], function(pointeeType) { pointeeType = pointeeType[0]; var registeredPointer = new RegisteredPointer(name, pointeeType.registeredClass, false, false, true, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor); return [registeredPointer] })
            }

            function __embind_register_std_string(rawType, name) {
                name = readLatin1String(name);
                var stdStringIsUTF8 = name === "std::string";
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(value) {
                        var length = HEAPU32[value >> 2];
                        var str;
                        if (stdStringIsUTF8) {
                            var decodeStartPtr = value + 4;
                            for (var i = 0; i <= length; ++i) {
                                var currentBytePtr = value + 4 + i;
                                if (i == length || HEAPU8[currentBytePtr] == 0) {
                                    var maxRead = currentBytePtr - decodeStartPtr;
                                    var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                                    if (str === undefined) { str = stringSegment } else {
                                        str += String.fromCharCode(0);
                                        str += stringSegment
                                    }
                                    decodeStartPtr = currentBytePtr + 1
                                }
                            }
                        } else {
                            var a = new Array(length);
                            for (var i = 0; i < length; ++i) { a[i] = String.fromCharCode(HEAPU8[value + 4 + i]) }
                            str = a.join("")
                        }
                        _free(value);
                        return str
                    },
                    "toWireType": function(destructors, value) {
                        if (value instanceof ArrayBuffer) { value = new Uint8Array(value) }
                        var getLength;
                        var valueIsOfTypeString = typeof value === "string";
                        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) { throwBindingError("Cannot pass non-string to std::string") }
                        if (stdStringIsUTF8 && valueIsOfTypeString) { getLength = (() => lengthBytesUTF8(value)) } else { getLength = (() => value.length) }
                        var length = getLength();
                        var ptr = _malloc(4 + length + 1);
                        HEAPU32[ptr >> 2] = length;
                        if (stdStringIsUTF8 && valueIsOfTypeString) { stringToUTF8(value, ptr + 4, length + 1) } else {
                            if (valueIsOfTypeString) {
                                for (var i = 0; i < length; ++i) {
                                    var charCode = value.charCodeAt(i);
                                    if (charCode > 255) {
                                        _free(ptr);
                                        throwBindingError("String has UTF-16 code units that do not fit in 8 bits")
                                    }
                                    HEAPU8[ptr + 4 + i] = charCode
                                }
                            } else { for (var i = 0; i < length; ++i) { HEAPU8[ptr + 4 + i] = value[i] } }
                        }
                        if (destructors !== null) { destructors.push(_free, ptr) }
                        return ptr
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: function(ptr) { _free(ptr) }
                })
            }

            function __embind_register_std_wstring(rawType, charSize, name) {
                name = readLatin1String(name);
                var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
                if (charSize === 2) {
                    decodeString = UTF16ToString;
                    encodeString = stringToUTF16;
                    lengthBytesUTF = lengthBytesUTF16;
                    getHeap = (() => HEAPU16);
                    shift = 1
                } else if (charSize === 4) {
                    decodeString = UTF32ToString;
                    encodeString = stringToUTF32;
                    lengthBytesUTF = lengthBytesUTF32;
                    getHeap = (() => HEAPU32);
                    shift = 2
                }
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(value) {
                        var length = HEAPU32[value >> 2];
                        var HEAP = getHeap();
                        var str;
                        var decodeStartPtr = value + 4;
                        for (var i = 0; i <= length; ++i) {
                            var currentBytePtr = value + 4 + i * charSize;
                            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                                var maxReadBytes = currentBytePtr - decodeStartPtr;
                                var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                                if (str === undefined) { str = stringSegment } else {
                                    str += String.fromCharCode(0);
                                    str += stringSegment
                                }
                                decodeStartPtr = currentBytePtr + charSize
                            }
                        }
                        _free(value);
                        return str
                    },
                    "toWireType": function(destructors, value) {
                        if (!(typeof value === "string")) { throwBindingError("Cannot pass non-string to C++ string type " + name) }
                        var length = lengthBytesUTF(value);
                        var ptr = _malloc(4 + length + charSize);
                        HEAPU32[ptr >> 2] = length >> shift;
                        encodeString(value, ptr + 4, length + charSize);
                        if (destructors !== null) { destructors.push(_free, ptr) }
                        return ptr
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: function(ptr) { _free(ptr) }
                })
            }

            function __embind_register_value_object(rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) { structRegistrations[rawType] = { name: readLatin1String(name), rawConstructor: embind__requireFunction(constructorSignature, rawConstructor), rawDestructor: embind__requireFunction(destructorSignature, rawDestructor), fields: [] } }

            function __embind_register_value_object_field(structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) { structRegistrations[structType].fields.push({ fieldName: readLatin1String(fieldName), getterReturnType: getterReturnType, getter: embind__requireFunction(getterSignature, getter), getterContext: getterContext, setterArgumentType: setterArgumentType, setter: embind__requireFunction(setterSignature, setter), setterContext: setterContext }) }

            function __embind_register_void(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, { isVoid: true, name: name, "argPackAdvance": 0, "fromWireType": function() { return undefined }, "toWireType": function(destructors, o) { return undefined } })
            }

            function __emscripten_throw_longjmp() { throw "longjmp" }

            function __emval_as(handle, returnType, destructorsRef) {
                handle = Emval.toValue(handle);
                returnType = requireRegisteredType(returnType, "emval::as");
                var destructors = [];
                var rd = Emval.toHandle(destructors);
                HEAP32[destructorsRef >> 2] = rd;
                return returnType["toWireType"](destructors, handle)
            }

            function __emval_allocateDestructors(destructorsRef) {
                var destructors = [];
                HEAP32[destructorsRef >> 2] = Emval.toHandle(destructors);
                return destructors
            }
            var emval_symbols = {};

            function getStringOrSymbol(address) { var symbol = emval_symbols[address]; if (symbol === undefined) { return readLatin1String(address) } else { return symbol } }
            var emval_methodCallers = [];

            function __emval_call_method(caller, handle, methodName, destructorsRef, args) {
                caller = emval_methodCallers[caller];
                handle = Emval.toValue(handle);
                methodName = getStringOrSymbol(methodName);
                return caller(handle, methodName, __emval_allocateDestructors(destructorsRef), args)
            }

            function __emval_call_void_method(caller, handle, methodName, args) {
                caller = emval_methodCallers[caller];
                handle = Emval.toValue(handle);
                methodName = getStringOrSymbol(methodName);
                caller(handle, methodName, null, args)
            }

            function emval_get_global() {
                if (typeof globalThis === "object") { return globalThis }

                function testGlobal(obj) { obj["$$$embind_global$$$"] = obj; var success = typeof $$$embind_global$$$ === "object" && obj["$$$embind_global$$$"] === obj; if (!success) { delete obj["$$$embind_global$$$"] } return success }
                if (typeof $$$embind_global$$$ === "object") { return $$$embind_global$$$ }
                if (typeof global === "object" && testGlobal(global)) { $$$embind_global$$$ = global } else if (typeof self === "object" && testGlobal(self)) { $$$embind_global$$$ = self }
                if (typeof $$$embind_global$$$ === "object") { return $$$embind_global$$$ }
                throw Error("unable to get global object.")
            }

            function __emval_get_global(name) { if (name === 0) { return Emval.toHandle(emval_get_global()) } else { name = getStringOrSymbol(name); return Emval.toHandle(emval_get_global()[name]) } }

            function __emval_addMethodCaller(caller) {
                var id = emval_methodCallers.length;
                emval_methodCallers.push(caller);
                return id
            }

            function __emval_lookupTypes(argCount, argTypes) { var a = new Array(argCount); for (var i = 0; i < argCount; ++i) { a[i] = requireRegisteredType(HEAP32[(argTypes >> 2) + i], "parameter " + i) } return a }
            var emval_registeredMethods = [];

            function __emval_get_method_caller(argCount, argTypes) {
                var types = __emval_lookupTypes(argCount, argTypes);
                var retType = types[0];
                var signatureName = retType.name + "_$" + types.slice(1).map(function(t) { return t.name }).join("_") + "$";
                var returnId = emval_registeredMethods[signatureName];
                if (returnId !== undefined) { return returnId }
                var argN = new Array(argCount - 1);
                var invokerFunction = (handle, name, destructors, args) => {
                    var offset = 0;
                    for (var i = 0; i < argCount - 1; ++i) {
                        argN[i] = types[i + 1]["readValueFromPointer"](args + offset);
                        offset += types[i + 1]["argPackAdvance"]
                    }
                    var rv = handle[name].apply(handle, argN);
                    for (var i = 0; i < argCount - 1; ++i) { if (types[i + 1].deleteObject) { types[i + 1].deleteObject(argN[i]) } }
                    if (!retType.isVoid) { return retType["toWireType"](destructors, rv) }
                };
                returnId = __emval_addMethodCaller(invokerFunction);
                emval_registeredMethods[signatureName] = returnId;
                return returnId
            }

            function __emval_get_property(handle, key) {
                handle = Emval.toValue(handle);
                key = Emval.toValue(key);
                return Emval.toHandle(handle[key])
            }

            function __emval_incref(handle) { if (handle > 4) { emval_handle_array[handle].refcount += 1 } }

            function craftEmvalAllocator(argCount) {
                var argsList = new Array(argCount + 1);
                return function(constructor, argTypes, args) {
                    argsList[0] = constructor;
                    for (var i = 0; i < argCount; ++i) {
                        var argType = requireRegisteredType(HEAP32[(argTypes >> 2) + i], "parameter " + i);
                        argsList[i + 1] = argType["readValueFromPointer"](args);
                        args += argType["argPackAdvance"]
                    }
                    var obj = new(constructor.bind.apply(constructor, argsList));
                    return Emval.toHandle(obj)
                }
            }
            var emval_newers = {};

            function __emval_new(handle, argCount, argTypes, args) {
                handle = Emval.toValue(handle);
                var newer = emval_newers[argCount];
                if (!newer) {
                    newer = craftEmvalAllocator(argCount);
                    emval_newers[argCount] = newer
                }
                return newer(handle, argTypes, args)
            }

            function __emval_new_array() { return Emval.toHandle([]) }

            function __emval_new_cstring(v) { return Emval.toHandle(getStringOrSymbol(v)) }

            function __emval_new_object() { return Emval.toHandle({}) }

            function __emval_not(object) { object = Emval.toValue(object); return !object }

            function __emval_run_destructors(handle) {
                var destructors = Emval.toValue(handle);
                runDestructors(destructors);
                __emval_decref(handle)
            }

            function __emval_set_property(handle, key, value) {
                handle = Emval.toValue(handle);
                key = Emval.toValue(key);
                value = Emval.toValue(value);
                handle[key] = value
            }

            function __emval_take_value(type, argv) { type = requireRegisteredType(type, "_emval_take_value"); var v = type["readValueFromPointer"](argv); return Emval.toHandle(v) }

            function _abort() { abort("") }
            var _emscripten_get_now;
            if (ENVIRONMENT_IS_NODE) { _emscripten_get_now = (() => { var t = process["hrtime"](); return t[0] * 1e3 + t[1] / 1e6 }) } else _emscripten_get_now = (() => performance.now());
            var _emscripten_get_now_is_monotonic = true;

            function _clock_gettime(clk_id, tp) {
                var now;
                if (clk_id === 0) { now = Date.now() } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) { now = _emscripten_get_now() } else { setErrNo(28); return -1 }
                HEAP32[tp >> 2] = now / 1e3 | 0;
                HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
                return 0
            }

            function __webgl_enable_ANGLE_instanced_arrays(ctx) {
                var ext = ctx.getExtension("ANGLE_instanced_arrays");
                if (ext) {
                    ctx["vertexAttribDivisor"] = function(index, divisor) { ext["vertexAttribDivisorANGLE"](index, divisor) };
                    ctx["drawArraysInstanced"] = function(mode, first, count, primcount) { ext["drawArraysInstancedANGLE"](mode, first, count, primcount) };
                    ctx["drawElementsInstanced"] = function(mode, count, type, indices, primcount) { ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount) };
                    return 1
                }
            }

            function __webgl_enable_OES_vertex_array_object(ctx) {
                var ext = ctx.getExtension("OES_vertex_array_object");
                if (ext) {
                    ctx["createVertexArray"] = function() { return ext["createVertexArrayOES"]() };
                    ctx["deleteVertexArray"] = function(vao) { ext["deleteVertexArrayOES"](vao) };
                    ctx["bindVertexArray"] = function(vao) { ext["bindVertexArrayOES"](vao) };
                    ctx["isVertexArray"] = function(vao) { return ext["isVertexArrayOES"](vao) };
                    return 1
                }
            }

            function __webgl_enable_WEBGL_draw_buffers(ctx) { var ext = ctx.getExtension("WEBGL_draw_buffers"); if (ext) { ctx["drawBuffers"] = function(n, bufs) { ext["drawBuffersWEBGL"](n, bufs) }; return 1 } }

            function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx) { return !!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance")) }

            function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(ctx) { return !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance")) }

            function __webgl_enable_WEBGL_multi_draw(ctx) { return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw")) }
            var GL = {
                counter: 1,
                buffers: [],
                programs: [],
                framebuffers: [],
                renderbuffers: [],
                textures: [],
                shaders: [],
                vaos: [],
                contexts: [],
                offscreenCanvases: {},
                queries: [],
                samplers: [],
                transformFeedbacks: [],
                syncs: [],
                stringCache: {},
                stringiCache: {},
                unpackAlignment: 4,
                recordError: function recordError(errorCode) { if (!GL.lastError) { GL.lastError = errorCode } },
                getNewId: function(table) { var ret = GL.counter++; for (var i = table.length; i < ret; i++) { table[i] = null } return ret },
                getSource: function(shader, count, string, length) {
                    var source = "";
                    for (var i = 0; i < count; ++i) {
                        var len = length ? HEAP32[length + i * 4 >> 2] : -1;
                        source += UTF8ToString(HEAP32[string + i * 4 >> 2], len < 0 ? undefined : len)
                    }
                    return source
                },
                createContext: function(canvas, webGLContextAttributes) {
                    if (!canvas.getContextSafariWebGL2Fixed) {
                        canvas.getContextSafariWebGL2Fixed = canvas.getContext;
                        canvas.getContext = function(ver, attrs) { var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs); return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null }
                    }
                    var ctx = webGLContextAttributes.majorVersion > 1 ? canvas.getContext("webgl2", webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
                    if (!ctx) return 0;
                    var handle = GL.registerContext(ctx, webGLContextAttributes);
                    return handle
                },
                registerContext: function(ctx, webGLContextAttributes) {
                    var handle = GL.getNewId(GL.contexts);
                    var context = { handle: handle, attributes: webGLContextAttributes, version: webGLContextAttributes.majorVersion, GLctx: ctx };
                    if (ctx.canvas) ctx.canvas.GLctxObject = context;
                    GL.contexts[handle] = context;
                    if (typeof webGLContextAttributes.enableExtensionsByDefault === "undefined" || webGLContextAttributes.enableExtensionsByDefault) { GL.initExtensions(context) }
                    return handle
                },
                makeContextCurrent: function(contextHandle) {
                    GL.currentContext = GL.contexts[contextHandle];
                    Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
                    return !(contextHandle && !GLctx)
                },
                getContext: function(contextHandle) { return GL.contexts[contextHandle] },
                deleteContext: function(contextHandle) {
                    if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
                    if (typeof JSEvents === "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
                    if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
                    GL.contexts[contextHandle] = null
                },
                initExtensions: function(context) {
                    if (!context) context = GL.currentContext;
                    if (context.initExtensionsDone) return;
                    context.initExtensionsDone = true;
                    var GLctx = context.GLctx;
                    __webgl_enable_ANGLE_instanced_arrays(GLctx);
                    __webgl_enable_OES_vertex_array_object(GLctx);
                    __webgl_enable_WEBGL_draw_buffers(GLctx);
                    __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
                    __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
                    if (context.version >= 2) { GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2") }
                    if (context.version < 2 || !GLctx.disjointTimerQueryExt) { GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query") }
                    __webgl_enable_WEBGL_multi_draw(GLctx);
                    var exts = GLctx.getSupportedExtensions() || [];
                    exts.forEach(function(ext) { if (!ext.includes("lose_context") && !ext.includes("debug")) { GLctx.getExtension(ext) } })
                }
            };

            function _emscripten_glActiveTexture(x0) { GLctx["activeTexture"](x0) }

            function _emscripten_glAttachShader(program, shader) { GLctx.attachShader(GL.programs[program], GL.shaders[shader]) }

            function _emscripten_glBindAttribLocation(program, index, name) { GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name)) }

            function _emscripten_glBindBuffer(target, buffer) {
                if (target == 35051) { GLctx.currentPixelPackBufferBinding = buffer } else if (target == 35052) { GLctx.currentPixelUnpackBufferBinding = buffer }
                GLctx.bindBuffer(target, GL.buffers[buffer])
            }

            function _emscripten_glBindFramebuffer(target, framebuffer) { GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]) }

            function _emscripten_glBindRenderbuffer(target, renderbuffer) { GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]) }

            function _emscripten_glBindSampler(unit, sampler) { GLctx["bindSampler"](unit, GL.samplers[sampler]) }

            function _emscripten_glBindTexture(target, texture) { GLctx.bindTexture(target, GL.textures[texture]) }

            function _emscripten_glBindVertexArray(vao) { GLctx["bindVertexArray"](GL.vaos[vao]) }

            function _emscripten_glBindVertexArrayOES(vao) { GLctx["bindVertexArray"](GL.vaos[vao]) }

            function _emscripten_glBlendColor(x0, x1, x2, x3) { GLctx["blendColor"](x0, x1, x2, x3) }

            function _emscripten_glBlendEquation(x0) { GLctx["blendEquation"](x0) }

            function _emscripten_glBlendFunc(x0, x1) { GLctx["blendFunc"](x0, x1) }

            function _emscripten_glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) { GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) }

            function _emscripten_glBufferData(target, size, data, usage) { if (GL.currentContext.version >= 2) { if (data) { GLctx.bufferData(target, HEAPU8, usage, data, size) } else { GLctx.bufferData(target, size, usage) } } else { GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage) } }

            function _emscripten_glBufferSubData(target, offset, size, data) {
                if (GL.currentContext.version >= 2) { GLctx.bufferSubData(target, offset, HEAPU8, data, size); return }
                GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
            }

            function _emscripten_glCheckFramebufferStatus(x0) { return GLctx["checkFramebufferStatus"](x0) }

            function _emscripten_glClear(x0) { GLctx["clear"](x0) }

            function _emscripten_glClearColor(x0, x1, x2, x3) { GLctx["clearColor"](x0, x1, x2, x3) }

            function _emscripten_glClearStencil(x0) { GLctx["clearStencil"](x0) }

            function convertI32PairToI53(lo, hi) { return (lo >>> 0) + hi * 4294967296 }

            function _emscripten_glClientWaitSync(sync, flags, timeoutLo, timeoutHi) { return GLctx.clientWaitSync(GL.syncs[sync], flags, convertI32PairToI53(timeoutLo, timeoutHi)) }

            function _emscripten_glColorMask(red, green, blue, alpha) { GLctx.colorMask(!!red, !!green, !!blue, !!alpha) }

            function _emscripten_glCompileShader(shader) { GLctx.compileShader(GL.shaders[shader]) }

            function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
                if (GL.currentContext.version >= 2) { if (GLctx.currentPixelUnpackBufferBinding) { GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, imageSize, data) } else { GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, HEAPU8, data, imageSize) } return }
                GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null)
            }

            function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
                if (GL.currentContext.version >= 2) { if (GLctx.currentPixelUnpackBufferBinding) { GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, imageSize, data) } else { GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize) } return }
                GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null)
            }

            function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7) }

            function _emscripten_glCreateProgram() {
                var id = GL.getNewId(GL.programs);
                var program = GLctx.createProgram();
                program.name = id;
                program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
                program.uniformIdCounter = 1;
                GL.programs[id] = program;
                return id
            }

            function _emscripten_glCreateShader(shaderType) {
                var id = GL.getNewId(GL.shaders);
                GL.shaders[id] = GLctx.createShader(shaderType);
                return id
            }

            function _emscripten_glCullFace(x0) { GLctx["cullFace"](x0) }

            function _emscripten_glDeleteBuffers(n, buffers) {
                for (var i = 0; i < n; i++) {
                    var id = HEAP32[buffers + i * 4 >> 2];
                    var buffer = GL.buffers[id];
                    if (!buffer) continue;
                    GLctx.deleteBuffer(buffer);
                    buffer.name = 0;
                    GL.buffers[id] = null;
                    if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
                    if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0
                }
            }

            function _emscripten_glDeleteFramebuffers(n, framebuffers) {
                for (var i = 0; i < n; ++i) {
                    var id = HEAP32[framebuffers + i * 4 >> 2];
                    var framebuffer = GL.framebuffers[id];
                    if (!framebuffer) continue;
                    GLctx.deleteFramebuffer(framebuffer);
                    framebuffer.name = 0;
                    GL.framebuffers[id] = null
                }
            }

            function _emscripten_glDeleteProgram(id) {
                if (!id) return;
                var program = GL.programs[id];
                if (!program) { GL.recordError(1281); return }
                GLctx.deleteProgram(program);
                program.name = 0;
                GL.programs[id] = null
            }

            function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
                for (var i = 0; i < n; i++) {
                    var id = HEAP32[renderbuffers + i * 4 >> 2];
                    var renderbuffer = GL.renderbuffers[id];
                    if (!renderbuffer) continue;
                    GLctx.deleteRenderbuffer(renderbuffer);
                    renderbuffer.name = 0;
                    GL.renderbuffers[id] = null
                }
            }

            function _emscripten_glDeleteSamplers(n, samplers) {
                for (var i = 0; i < n; i++) {
                    var id = HEAP32[samplers + i * 4 >> 2];
                    var sampler = GL.samplers[id];
                    if (!sampler) continue;
                    GLctx["deleteSampler"](sampler);
                    sampler.name = 0;
                    GL.samplers[id] = null
                }
            }

            function _emscripten_glDeleteShader(id) {
                if (!id) return;
                var shader = GL.shaders[id];
                if (!shader) { GL.recordError(1281); return }
                GLctx.deleteShader(shader);
                GL.shaders[id] = null
            }

            function _emscripten_glDeleteSync(id) {
                if (!id) return;
                var sync = GL.syncs[id];
                if (!sync) { GL.recordError(1281); return }
                GLctx.deleteSync(sync);
                sync.name = 0;
                GL.syncs[id] = null
            }

            function _emscripten_glDeleteTextures(n, textures) {
                for (var i = 0; i < n; i++) {
                    var id = HEAP32[textures + i * 4 >> 2];
                    var texture = GL.textures[id];
                    if (!texture) continue;
                    GLctx.deleteTexture(texture);
                    texture.name = 0;
                    GL.textures[id] = null
                }
            }

            function _emscripten_glDeleteVertexArrays(n, vaos) {
                for (var i = 0; i < n; i++) {
                    var id = HEAP32[vaos + i * 4 >> 2];
                    GLctx["deleteVertexArray"](GL.vaos[id]);
                    GL.vaos[id] = null
                }
            }

            function _emscripten_glDeleteVertexArraysOES(n, vaos) {
                for (var i = 0; i < n; i++) {
                    var id = HEAP32[vaos + i * 4 >> 2];
                    GLctx["deleteVertexArray"](GL.vaos[id]);
                    GL.vaos[id] = null
                }
            }

            function _emscripten_glDepthMask(flag) { GLctx.depthMask(!!flag) }

            function _emscripten_glDisable(x0) { GLctx["disable"](x0) }

            function _emscripten_glDisableVertexAttribArray(index) { GLctx.disableVertexAttribArray(index) }

            function _emscripten_glDrawArrays(mode, first, count) { GLctx.drawArrays(mode, first, count) }

            function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) { GLctx["drawArraysInstanced"](mode, first, count, primcount) }

            function _emscripten_glDrawArraysInstancedBaseInstanceWEBGL(mode, first, count, instanceCount, baseInstance) { GLctx.dibvbi["drawArraysInstancedBaseInstanceWEBGL"](mode, first, count, instanceCount, baseInstance) }
            var tempFixedLengthArray = [];

            function _emscripten_glDrawBuffers(n, bufs) {
                var bufArray = tempFixedLengthArray[n];
                for (var i = 0; i < n; i++) { bufArray[i] = HEAP32[bufs + i * 4 >> 2] }
                GLctx["drawBuffers"](bufArray)
            }

            function _emscripten_glDrawElements(mode, count, type, indices) { GLctx.drawElements(mode, count, type, indices) }

            function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) { GLctx["drawElementsInstanced"](mode, count, type, indices, primcount) }

            function _emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL(mode, count, type, offset, instanceCount, baseVertex, baseinstance) { GLctx.dibvbi["drawElementsInstancedBaseVertexBaseInstanceWEBGL"](mode, count, type, offset, instanceCount, baseVertex, baseinstance) }

            function _glDrawElements(mode, count, type, indices) { GLctx.drawElements(mode, count, type, indices) }

            function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) { _glDrawElements(mode, count, type, indices) }

            function _emscripten_glEnable(x0) { GLctx["enable"](x0) }

            function _emscripten_glEnableVertexAttribArray(index) { GLctx.enableVertexAttribArray(index) }

            function _emscripten_glFenceSync(condition, flags) {
                var sync = GLctx.fenceSync(condition, flags);
                if (sync) {
                    var id = GL.getNewId(GL.syncs);
                    sync.name = id;
                    GL.syncs[id] = sync;
                    return id
                } else { return 0 }
            }

            function _emscripten_glFinish() { GLctx["finish"]() }

            function _emscripten_glFlush() { GLctx["flush"]() }

            function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) { GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]) }

            function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) { GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level) }

            function _emscripten_glFrontFace(x0) { GLctx["frontFace"](x0) }

            function __glGenObject(n, buffers, createFunction, objectTable) {
                for (var i = 0; i < n; i++) {
                    var buffer = GLctx[createFunction]();
                    var id = buffer && GL.getNewId(objectTable);
                    if (buffer) {
                        buffer.name = id;
                        objectTable[id] = buffer
                    } else { GL.recordError(1282) }
                    HEAP32[buffers + i * 4 >> 2] = id
                }
            }

            function _emscripten_glGenBuffers(n, buffers) { __glGenObject(n, buffers, "createBuffer", GL.buffers) }

            function _emscripten_glGenFramebuffers(n, ids) { __glGenObject(n, ids, "createFramebuffer", GL.framebuffers) }

            function _emscripten_glGenRenderbuffers(n, renderbuffers) { __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers) }

            function _emscripten_glGenSamplers(n, samplers) { __glGenObject(n, samplers, "createSampler", GL.samplers) }

            function _emscripten_glGenTextures(n, textures) { __glGenObject(n, textures, "createTexture", GL.textures) }

            function _emscripten_glGenVertexArrays(n, arrays) { __glGenObject(n, arrays, "createVertexArray", GL.vaos) }

            function _emscripten_glGenVertexArraysOES(n, arrays) { __glGenObject(n, arrays, "createVertexArray", GL.vaos) }

            function _emscripten_glGenerateMipmap(x0) { GLctx["generateMipmap"](x0) }

            function _emscripten_glGetBufferParameteriv(target, value, data) {
                if (!data) { GL.recordError(1281); return }
                HEAP32[data >> 2] = GLctx.getBufferParameter(target, value)
            }

            function _emscripten_glGetError() {
                var error = GLctx.getError() || GL.lastError;
                GL.lastError = 0;
                return error
            }

            function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
                var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
                if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) { result = result.name | 0 }
                HEAP32[params >> 2] = result
            }

            function writeI53ToI64(ptr, num) {
                HEAPU32[ptr >> 2] = num;
                HEAPU32[ptr + 4 >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296
            }

            function emscriptenWebGLGet(name_, p, type) {
                if (!p) { GL.recordError(1281); return }
                var ret = undefined;
                switch (name_) {
                    case 36346:
                        ret = 1;
                        break;
                    case 36344:
                        if (type != 0 && type != 1) { GL.recordError(1280) }
                        return;
                    case 34814:
                    case 36345:
                        ret = 0;
                        break;
                    case 34466:
                        var formats = GLctx.getParameter(34467);
                        ret = formats ? formats.length : 0;
                        break;
                    case 33309:
                        if (GL.currentContext.version < 2) { GL.recordError(1282); return }
                        var exts = GLctx.getSupportedExtensions() || [];
                        ret = 2 * exts.length;
                        break;
                    case 33307:
                    case 33308:
                        if (GL.currentContext.version < 2) { GL.recordError(1280); return }
                        ret = name_ == 33307 ? 3 : 0;
                        break
                }
                if (ret === undefined) {
                    var result = GLctx.getParameter(name_);
                    switch (typeof result) {
                        case "number":
                            ret = result;
                            break;
                        case "boolean":
                            ret = result ? 1 : 0;
                            break;
                        case "string":
                            GL.recordError(1280);
                            return;
                        case "object":
                            if (result === null) {
                                switch (name_) {
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
                                        { ret = 0; break }
                                    default:
                                        { GL.recordError(1280); return }
                                }
                            } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                                for (var i = 0; i < result.length; ++i) {
                                    switch (type) {
                                        case 0:
                                            HEAP32[p + i * 4 >> 2] = result[i];
                                            break;
                                        case 2:
                                            HEAPF32[p + i * 4 >> 2] = result[i];
                                            break;
                                        case 4:
                                            HEAP8[p + i >> 0] = result[i] ? 1 : 0;
                                            break
                                    }
                                }
                                return
                            } else {
                                try { ret = result.name | 0 } catch (e) {
                                    GL.recordError(1280);
                                    err("GL_INVALID_ENUM in glGet" + type + "v: Unknown object returned from WebGL getParameter(" + name_ + ")! (error: " + e + ")");
                                    return
                                }
                            }
                            break;
                        default:
                            GL.recordError(1280);
                            err("GL_INVALID_ENUM in glGet" + type + "v: Native code calling glGet" + type + "v(" + name_ + ") and it returns " + result + " of type " + typeof result + "!");
                            return
                    }
                }
                switch (type) {
                    case 1:
                        writeI53ToI64(p, ret);
                        break;
                    case 0:
                        HEAP32[p >> 2] = ret;
                        break;
                    case 2:
                        HEAPF32[p >> 2] = ret;
                        break;
                    case 4:
                        HEAP8[p >> 0] = ret ? 1 : 0;
                        break
                }
            }

            function _emscripten_glGetIntegerv(name_, p) { emscriptenWebGLGet(name_, p, 0) }

            function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) { var log = GLctx.getProgramInfoLog(GL.programs[program]); if (log === null) log = "(unknown error)"; var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0; if (length) HEAP32[length >> 2] = numBytesWrittenExclNull }

            function _emscripten_glGetProgramiv(program, pname, p) {
                if (!p) { GL.recordError(1281); return }
                if (program >= GL.counter) { GL.recordError(1281); return }
                program = GL.programs[program];
                if (pname == 35716) {
                    var log = GLctx.getProgramInfoLog(program);
                    if (log === null) log = "(unknown error)";
                    HEAP32[p >> 2] = log.length + 1
                } else if (pname == 35719) {
                    if (!program.maxUniformLength) { for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) { program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1) } }
                    HEAP32[p >> 2] = program.maxUniformLength
                } else if (pname == 35722) {
                    if (!program.maxAttributeLength) { for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) { program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1) } }
                    HEAP32[p >> 2] = program.maxAttributeLength
                } else if (pname == 35381) {
                    if (!program.maxUniformBlockNameLength) { for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) { program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1) } }
                    HEAP32[p >> 2] = program.maxUniformBlockNameLength
                } else { HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname) }
            }

            function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
                if (!params) { GL.recordError(1281); return }
                HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname)
            }

            function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) { var log = GLctx.getShaderInfoLog(GL.shaders[shader]); if (log === null) log = "(unknown error)"; var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0; if (length) HEAP32[length >> 2] = numBytesWrittenExclNull }

            function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
                var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
                HEAP32[range >> 2] = result.rangeMin;
                HEAP32[range + 4 >> 2] = result.rangeMax;
                HEAP32[precision >> 2] = result.precision
            }

            function _emscripten_glGetShaderiv(shader, pname, p) {
                if (!p) { GL.recordError(1281); return }
                if (pname == 35716) {
                    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
                    if (log === null) log = "(unknown error)";
                    var logLength = log ? log.length + 1 : 0;
                    HEAP32[p >> 2] = logLength
                } else if (pname == 35720) {
                    var source = GLctx.getShaderSource(GL.shaders[shader]);
                    var sourceLength = source ? source.length + 1 : 0;
                    HEAP32[p >> 2] = sourceLength
                } else { HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname) }
            }

            function stringToNewUTF8(jsString) {
                var length = lengthBytesUTF8(jsString) + 1;
                var cString = _malloc(length);
                stringToUTF8(jsString, cString, length);
                return cString
            }

            function _emscripten_glGetString(name_) {
                var ret = GL.stringCache[name_];
                if (!ret) {
                    switch (name_) {
                        case 7939:
                            var exts = GLctx.getSupportedExtensions() || [];
                            exts = exts.concat(exts.map(function(e) { return "GL_" + e }));
                            ret = stringToNewUTF8(exts.join(" "));
                            break;
                        case 7936:
                        case 7937:
                        case 37445:
                        case 37446:
                            var s = GLctx.getParameter(name_);
                            if (!s) { GL.recordError(1280) }
                            ret = s && stringToNewUTF8(s);
                            break;
                        case 7938:
                            var glVersion = GLctx.getParameter(7938);
                            if (GL.currentContext.version >= 2) glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
                            else { glVersion = "OpenGL ES 2.0 (" + glVersion + ")" }
                            ret = stringToNewUTF8(glVersion);
                            break;
                        case 35724:
                            var glslVersion = GLctx.getParameter(35724);
                            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                            var ver_num = glslVersion.match(ver_re);
                            if (ver_num !== null) {
                                if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                                glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
                            }
                            ret = stringToNewUTF8(glslVersion);
                            break;
                        default:
                            GL.recordError(1280)
                    }
                    GL.stringCache[name_] = ret
                }
                return ret
            }

            function _emscripten_glGetStringi(name, index) {
                if (GL.currentContext.version < 2) { GL.recordError(1282); return 0 }
                var stringiCache = GL.stringiCache[name];
                if (stringiCache) { if (index < 0 || index >= stringiCache.length) { GL.recordError(1281); return 0 } return stringiCache[index] }
                switch (name) {
                    case 7939:
                        var exts = GLctx.getSupportedExtensions() || [];
                        exts = exts.concat(exts.map(function(e) { return "GL_" + e }));
                        exts = exts.map(function(e) { return stringToNewUTF8(e) });
                        stringiCache = GL.stringiCache[name] = exts;
                        if (index < 0 || index >= stringiCache.length) { GL.recordError(1281); return 0 }
                        return stringiCache[index];
                    default:
                        GL.recordError(1280);
                        return 0
                }
            }

            function jstoi_q(str) { return parseInt(str) }

            function webglGetLeftBracePos(name) { return name.slice(-1) == "]" && name.lastIndexOf("[") }

            function webglPrepareUniformLocationsBeforeFirstUse(program) {
                var uniformLocsById = program.uniformLocsById,
                    uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
                    i, j;
                if (!uniformLocsById) {
                    program.uniformLocsById = uniformLocsById = {};
                    program.uniformArrayNamesById = {};
                    for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
                        var u = GLctx.getActiveUniform(program, i);
                        var nm = u.name;
                        var sz = u.size;
                        var lb = webglGetLeftBracePos(nm);
                        var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
                        var id = program.uniformIdCounter;
                        program.uniformIdCounter += sz;
                        uniformSizeAndIdsByName[arrayName] = [sz, id];
                        for (j = 0; j < sz; ++j) {
                            uniformLocsById[id] = j;
                            program.uniformArrayNamesById[id++] = arrayName
                        }
                    }
                }
            }

            function _emscripten_glGetUniformLocation(program, name) {
                name = UTF8ToString(name);
                if (program = GL.programs[program]) {
                    webglPrepareUniformLocationsBeforeFirstUse(program);
                    var uniformLocsById = program.uniformLocsById;
                    var arrayIndex = 0;
                    var uniformBaseName = name;
                    var leftBrace = webglGetLeftBracePos(name);
                    if (leftBrace > 0) {
                        arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
                        uniformBaseName = name.slice(0, leftBrace)
                    }
                    var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
                    if (sizeAndId && arrayIndex < sizeAndId[0]) { arrayIndex += sizeAndId[1]; if (uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name)) { return arrayIndex } }
                } else { GL.recordError(1281) }
                return -1
            }

            function _emscripten_glInvalidateFramebuffer(target, numAttachments, attachments) {
                var list = tempFixedLengthArray[numAttachments];
                for (var i = 0; i < numAttachments; i++) { list[i] = HEAP32[attachments + i * 4 >> 2] }
                GLctx["invalidateFramebuffer"](target, list)
            }

            function _emscripten_glInvalidateSubFramebuffer(target, numAttachments, attachments, x, y, width, height) {
                var list = tempFixedLengthArray[numAttachments];
                for (var i = 0; i < numAttachments; i++) { list[i] = HEAP32[attachments + i * 4 >> 2] }
                GLctx["invalidateSubFramebuffer"](target, list, x, y, width, height)
            }

            function _emscripten_glIsSync(sync) { return GLctx.isSync(GL.syncs[sync]) }

            function _emscripten_glIsTexture(id) { var texture = GL.textures[id]; if (!texture) return 0; return GLctx.isTexture(texture) }

            function _emscripten_glLineWidth(x0) { GLctx["lineWidth"](x0) }

            function _emscripten_glLinkProgram(program) {
                program = GL.programs[program];
                GLctx.linkProgram(program);
                program.uniformLocsById = 0;
                program.uniformSizeAndIdsByName = {}
            }

            function _emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL(mode, firsts, counts, instanceCounts, baseInstances, drawCount) { GLctx.mdibvbi["multiDrawArraysInstancedBaseInstanceWEBGL"](mode, HEAP32, firsts >> 2, HEAP32, counts >> 2, HEAP32, instanceCounts >> 2, HEAPU32, baseInstances >> 2, drawCount) }

            function _emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(mode, counts, type, offsets, instanceCounts, baseVertices, baseInstances, drawCount) { GLctx.mdibvbi["multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL"](mode, HEAP32, counts >> 2, type, HEAP32, offsets >> 2, HEAP32, instanceCounts >> 2, HEAP32, baseVertices >> 2, HEAPU32, baseInstances >> 2, drawCount) }

            function _emscripten_glPixelStorei(pname, param) {
                if (pname == 3317) { GL.unpackAlignment = param }
                GLctx.pixelStorei(pname, param)
            }

            function _emscripten_glReadBuffer(x0) { GLctx["readBuffer"](x0) }

            function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
                function roundedToNextMultipleOf(x, y) { return x + y - 1 & -y }
                var plainRowSize = width * sizePerPixel;
                var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
                return height * alignedRowSize
            }

            function __colorChannelsInGlTextureFormat(format) { var colorChannels = { 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4, 26917: 2, 26918: 2, 29846: 3, 29847: 4 }; return colorChannels[format - 6402] || 1 }

            function heapObjectForWebGLType(type) { type -= 5120; if (type == 0) return HEAP8; if (type == 1) return HEAPU8; if (type == 2) return HEAP16; if (type == 4) return HEAP32; if (type == 6) return HEAPF32; if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return HEAPU32; return HEAPU16 }

            function heapAccessShiftForWebGLHeap(heap) { return 31 - Math.clz32(heap.BYTES_PER_ELEMENT) }

            function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) { var heap = heapObjectForWebGLType(type); var shift = heapAccessShiftForWebGLHeap(heap); var byteSize = 1 << shift; var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize; var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment); return heap.subarray(pixels >> shift, pixels + bytes >> shift) }

            function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
                if (GL.currentContext.version >= 2) {
                    if (GLctx.currentPixelPackBufferBinding) { GLctx.readPixels(x, y, width, height, format, type, pixels) } else {
                        var heap = heapObjectForWebGLType(type);
                        GLctx.readPixels(x, y, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
                    }
                    return
                }
                var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
                if (!pixelData) { GL.recordError(1280); return }
                GLctx.readPixels(x, y, width, height, format, type, pixelData)
            }

            function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) { GLctx["renderbufferStorage"](x0, x1, x2, x3) }

            function _emscripten_glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) { GLctx["renderbufferStorageMultisample"](x0, x1, x2, x3, x4) }

            function _emscripten_glSamplerParameteri(sampler, pname, param) { GLctx["samplerParameteri"](GL.samplers[sampler], pname, param) }

            function _emscripten_glSamplerParameteriv(sampler, pname, params) {
                var param = HEAP32[params >> 2];
                GLctx["samplerParameteri"](GL.samplers[sampler], pname, param)
            }

            function _emscripten_glScissor(x0, x1, x2, x3) { GLctx["scissor"](x0, x1, x2, x3) }

            function _emscripten_glShaderSource(shader, count, string, length) {
                var source = GL.getSource(shader, count, string, length);
                GLctx.shaderSource(GL.shaders[shader], source)
            }

            function _emscripten_glStencilFunc(x0, x1, x2) { GLctx["stencilFunc"](x0, x1, x2) }

            function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) { GLctx["stencilFuncSeparate"](x0, x1, x2, x3) }

            function _emscripten_glStencilMask(x0) { GLctx["stencilMask"](x0) }

            function _emscripten_glStencilMaskSeparate(x0, x1) { GLctx["stencilMaskSeparate"](x0, x1) }

            function _emscripten_glStencilOp(x0, x1, x2) { GLctx["stencilOp"](x0, x1, x2) }

            function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) { GLctx["stencilOpSeparate"](x0, x1, x2, x3) }

            function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
                if (GL.currentContext.version >= 2) {
                    if (GLctx.currentPixelUnpackBufferBinding) { GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels) } else if (pixels) {
                        var heap = heapObjectForWebGLType(type);
                        GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
                    } else { GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null) }
                    return
                }
                GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null)
            }

            function _emscripten_glTexParameterf(x0, x1, x2) { GLctx["texParameterf"](x0, x1, x2) }

            function _emscripten_glTexParameterfv(target, pname, params) {
                var param = HEAPF32[params >> 2];
                GLctx.texParameterf(target, pname, param)
            }

            function _emscripten_glTexParameteri(x0, x1, x2) { GLctx["texParameteri"](x0, x1, x2) }

            function _emscripten_glTexParameteriv(target, pname, params) {
                var param = HEAP32[params >> 2];
                GLctx.texParameteri(target, pname, param)
            }

            function _emscripten_glTexStorage2D(x0, x1, x2, x3, x4) { GLctx["texStorage2D"](x0, x1, x2, x3, x4) }

            function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
                if (GL.currentContext.version >= 2) {
                    if (GLctx.currentPixelUnpackBufferBinding) { GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) } else if (pixels) {
                        var heap = heapObjectForWebGLType(type);
                        GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
                    } else { GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null) }
                    return
                }
                var pixelData = null;
                if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
                GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
            }

            function webglGetUniformLocation(location) { var p = GLctx.currentProgram; if (p) { var webglLoc = p.uniformLocsById[location]; if (typeof webglLoc === "number") { p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? "[" + webglLoc + "]" : "")) } return webglLoc } else { GL.recordError(1282) } }

            function _emscripten_glUniform1f(location, v0) { GLctx.uniform1f(webglGetUniformLocation(location), v0) }
            var miniTempWebGLFloatBuffers = [];

            function _emscripten_glUniform1fv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform1fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count); return }
                if (count <= 288) { var view = miniTempWebGLFloatBuffers[count - 1]; for (var i = 0; i < count; ++i) { view[i] = HEAPF32[value + 4 * i >> 2] } } else { var view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2) }
                GLctx.uniform1fv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniform1i(location, v0) { GLctx.uniform1i(webglGetUniformLocation(location), v0) }
            var __miniTempWebGLIntBuffers = [];

            function _emscripten_glUniform1iv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform1iv(webglGetUniformLocation(location), HEAP32, value >> 2, count); return }
                if (count <= 288) { var view = __miniTempWebGLIntBuffers[count - 1]; for (var i = 0; i < count; ++i) { view[i] = HEAP32[value + 4 * i >> 2] } } else { var view = HEAP32.subarray(value >> 2, value + count * 4 >> 2) }
                GLctx.uniform1iv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniform2f(location, v0, v1) { GLctx.uniform2f(webglGetUniformLocation(location), v0, v1) }

            function _emscripten_glUniform2fv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform2fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 2); return }
                if (count <= 144) {
                    var view = miniTempWebGLFloatBuffers[2 * count - 1];
                    for (var i = 0; i < 2 * count; i += 2) {
                        view[i] = HEAPF32[value + 4 * i >> 2];
                        view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2]
                    }
                } else { var view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2) }
                GLctx.uniform2fv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniform2i(location, v0, v1) { GLctx.uniform2i(webglGetUniformLocation(location), v0, v1) }

            function _emscripten_glUniform2iv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform2iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 2); return }
                if (count <= 144) {
                    var view = __miniTempWebGLIntBuffers[2 * count - 1];
                    for (var i = 0; i < 2 * count; i += 2) {
                        view[i] = HEAP32[value + 4 * i >> 2];
                        view[i + 1] = HEAP32[value + (4 * i + 4) >> 2]
                    }
                } else { var view = HEAP32.subarray(value >> 2, value + count * 8 >> 2) }
                GLctx.uniform2iv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniform3f(location, v0, v1, v2) { GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2) }

            function _emscripten_glUniform3fv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform3fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 3); return }
                if (count <= 96) {
                    var view = miniTempWebGLFloatBuffers[3 * count - 1];
                    for (var i = 0; i < 3 * count; i += 3) {
                        view[i] = HEAPF32[value + 4 * i >> 2];
                        view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
                        view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2]
                    }
                } else { var view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2) }
                GLctx.uniform3fv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniform3i(location, v0, v1, v2) { GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2) }

            function _emscripten_glUniform3iv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform3iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 3); return }
                if (count <= 96) {
                    var view = __miniTempWebGLIntBuffers[3 * count - 1];
                    for (var i = 0; i < 3 * count; i += 3) {
                        view[i] = HEAP32[value + 4 * i >> 2];
                        view[i + 1] = HEAP32[value + (4 * i + 4) >> 2];
                        view[i + 2] = HEAP32[value + (4 * i + 8) >> 2]
                    }
                } else { var view = HEAP32.subarray(value >> 2, value + count * 12 >> 2) }
                GLctx.uniform3iv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniform4f(location, v0, v1, v2, v3) { GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3) }

            function _emscripten_glUniform4fv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform4fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 4); return }
                if (count <= 72) {
                    var view = miniTempWebGLFloatBuffers[4 * count - 1];
                    var heap = HEAPF32;
                    value >>= 2;
                    for (var i = 0; i < 4 * count; i += 4) {
                        var dst = value + i;
                        view[i] = heap[dst];
                        view[i + 1] = heap[dst + 1];
                        view[i + 2] = heap[dst + 2];
                        view[i + 3] = heap[dst + 3]
                    }
                } else { var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2) }
                GLctx.uniform4fv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniform4i(location, v0, v1, v2, v3) { GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3) }

            function _emscripten_glUniform4iv(location, count, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniform4iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 4); return }
                if (count <= 72) {
                    var view = __miniTempWebGLIntBuffers[4 * count - 1];
                    for (var i = 0; i < 4 * count; i += 4) {
                        view[i] = HEAP32[value + 4 * i >> 2];
                        view[i + 1] = HEAP32[value + (4 * i + 4) >> 2];
                        view[i + 2] = HEAP32[value + (4 * i + 8) >> 2];
                        view[i + 3] = HEAP32[value + (4 * i + 12) >> 2]
                    }
                } else { var view = HEAP32.subarray(value >> 2, value + count * 16 >> 2) }
                GLctx.uniform4iv(webglGetUniformLocation(location), view)
            }

            function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 4); return }
                if (count <= 72) {
                    var view = miniTempWebGLFloatBuffers[4 * count - 1];
                    for (var i = 0; i < 4 * count; i += 4) {
                        view[i] = HEAPF32[value + 4 * i >> 2];
                        view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
                        view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
                        view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
                    }
                } else { var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2) }
                GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view)
            }

            function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 9); return }
                if (count <= 32) {
                    var view = miniTempWebGLFloatBuffers[9 * count - 1];
                    for (var i = 0; i < 9 * count; i += 9) {
                        view[i] = HEAPF32[value + 4 * i >> 2];
                        view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
                        view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
                        view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
                        view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
                        view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
                        view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
                        view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
                        view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2]
                    }
                } else { var view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2) }
                GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view)
            }

            function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
                if (GL.currentContext.version >= 2) { GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 16); return }
                if (count <= 18) {
                    var view = miniTempWebGLFloatBuffers[16 * count - 1];
                    var heap = HEAPF32;
                    value >>= 2;
                    for (var i = 0; i < 16 * count; i += 16) {
                        var dst = value + i;
                        view[i] = heap[dst];
                        view[i + 1] = heap[dst + 1];
                        view[i + 2] = heap[dst + 2];
                        view[i + 3] = heap[dst + 3];
                        view[i + 4] = heap[dst + 4];
                        view[i + 5] = heap[dst + 5];
                        view[i + 6] = heap[dst + 6];
                        view[i + 7] = heap[dst + 7];
                        view[i + 8] = heap[dst + 8];
                        view[i + 9] = heap[dst + 9];
                        view[i + 10] = heap[dst + 10];
                        view[i + 11] = heap[dst + 11];
                        view[i + 12] = heap[dst + 12];
                        view[i + 13] = heap[dst + 13];
                        view[i + 14] = heap[dst + 14];
                        view[i + 15] = heap[dst + 15]
                    }
                } else { var view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2) }
                GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view)
            }

            function _emscripten_glUseProgram(program) {
                program = GL.programs[program];
                GLctx.useProgram(program);
                GLctx.currentProgram = program
            }

            function _emscripten_glVertexAttrib1f(x0, x1) { GLctx["vertexAttrib1f"](x0, x1) }

            function _emscripten_glVertexAttrib2fv(index, v) { GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2]) }

            function _emscripten_glVertexAttrib3fv(index, v) { GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2]) }

            function _emscripten_glVertexAttrib4fv(index, v) { GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2]) }

            function _emscripten_glVertexAttribDivisor(index, divisor) { GLctx["vertexAttribDivisor"](index, divisor) }

            function _emscripten_glVertexAttribIPointer(index, size, type, stride, ptr) { GLctx["vertexAttribIPointer"](index, size, type, stride, ptr) }

            function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) { GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr) }

            function _emscripten_glViewport(x0, x1, x2, x3) { GLctx["viewport"](x0, x1, x2, x3) }

            function _emscripten_glWaitSync(sync, flags, timeoutLo, timeoutHi) { GLctx.waitSync(GL.syncs[sync], flags, convertI32PairToI53(timeoutLo, timeoutHi)) }

            function emscripten_realloc_buffer(size) {
                try {
                    wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
                    updateGlobalBufferAndViews(wasmMemory.buffer);
                    return 1
                } catch (e) {}
            }

            function _emscripten_resize_heap(requestedSize) {
                var oldSize = HEAPU8.length;
                requestedSize = requestedSize >>> 0;
                var maxHeapSize = 2147483648;
                if (requestedSize > maxHeapSize) { return false }
                for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
                    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                    var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
                    var replacement = emscripten_realloc_buffer(newSize);
                    if (replacement) { return true }
                }
                return false
            }

            function _emscripten_webgl_do_get_current_context() { return GL.currentContext ? GL.currentContext.handle : 0 }

            function _emscripten_webgl_get_current_context() { return _emscripten_webgl_do_get_current_context() }
            var ENV = {};

            function getExecutableName() { return thisProgram || "./this.program" }

            function getEnvStrings() {
                if (!getEnvStrings.strings) {
                    var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
                    var env = { "USER": "web_user", "LOGNAME": "web_user", "PATH": "/", "PWD": "/", "HOME": "/home/web_user", "LANG": lang, "_": getExecutableName() };
                    for (var x in ENV) {
                        if (ENV[x] === undefined) delete env[x];
                        else env[x] = ENV[x]
                    }
                    var strings = [];
                    for (var x in env) { strings.push(x + "=" + env[x]) }
                    getEnvStrings.strings = strings
                }
                return getEnvStrings.strings
            }

            function _environ_get(__environ, environ_buf) {
                var bufSize = 0;
                getEnvStrings().forEach(function(string, i) {
                    var ptr = environ_buf + bufSize;
                    HEAP32[__environ + i * 4 >> 2] = ptr;
                    writeAsciiToMemory(string, ptr);
                    bufSize += string.length + 1
                });
                return 0
            }

            function _environ_sizes_get(penviron_count, penviron_buf_size) {
                var strings = getEnvStrings();
                HEAP32[penviron_count >> 2] = strings.length;
                var bufSize = 0;
                strings.forEach(function(string) { bufSize += string.length + 1 });
                HEAP32[penviron_buf_size >> 2] = bufSize;
                return 0
            }

            function _exit(status) { exit(status) }

            function _fd_close(fd) { return 0 }

            function _fd_pread(fd, iov, iovcnt, offset_low, offset_high, pnum) {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = SYSCALLS.doReadv(stream, iov, iovcnt, offset_low);
                HEAP32[pnum >> 2] = num;
                return 0
            }

            function _fd_read(fd, iov, iovcnt, pnum) {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = SYSCALLS.doReadv(stream, iov, iovcnt);
                HEAP32[pnum >> 2] = num;
                return 0
            }

            function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}

            function _fd_write(fd, iov, iovcnt, pnum) {
                var num = 0;
                for (var i = 0; i < iovcnt; i++) {
                    var ptr = HEAP32[iov >> 2];
                    var len = HEAP32[iov + 4 >> 2];
                    iov += 8;
                    for (var j = 0; j < len; j++) { SYSCALLS.printChar(fd, HEAPU8[ptr + j]) }
                    num += len
                }
                HEAP32[pnum >> 2] = num;
                return 0
            }

            function _getTempRet0() { return getTempRet0() }

            function _setTempRet0(val) { setTempRet0(val) }

            function __isLeapYear(year) { return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) }

            function __arraySum(array, index) { var sum = 0; for (var i = 0; i <= index; sum += array[i++]) {} return sum }
            var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            function __addDays(date, days) {
                var newDate = new Date(date.getTime());
                while (days > 0) {
                    var leap = __isLeapYear(newDate.getFullYear());
                    var currentMonth = newDate.getMonth();
                    var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
                    if (days > daysInCurrentMonth - newDate.getDate()) {
                        days -= daysInCurrentMonth - newDate.getDate() + 1;
                        newDate.setDate(1);
                        if (currentMonth < 11) { newDate.setMonth(currentMonth + 1) } else {
                            newDate.setMonth(0);
                            newDate.setFullYear(newDate.getFullYear() + 1)
                        }
                    } else { newDate.setDate(newDate.getDate() + days); return newDate }
                }
                return newDate
            }

            function _strftime(s, maxsize, format, tm) {
                var tm_zone = HEAP32[tm + 40 >> 2];
                var date = { tm_sec: HEAP32[tm >> 2], tm_min: HEAP32[tm + 4 >> 2], tm_hour: HEAP32[tm + 8 >> 2], tm_mday: HEAP32[tm + 12 >> 2], tm_mon: HEAP32[tm + 16 >> 2], tm_year: HEAP32[tm + 20 >> 2], tm_wday: HEAP32[tm + 24 >> 2], tm_yday: HEAP32[tm + 28 >> 2], tm_isdst: HEAP32[tm + 32 >> 2], tm_gmtoff: HEAP32[tm + 36 >> 2], tm_zone: tm_zone ? UTF8ToString(tm_zone) : "" };
                var pattern = UTF8ToString(format);
                var EXPANSION_RULES_1 = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
                for (var rule in EXPANSION_RULES_1) { pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]) }
                var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                function leadingSomething(value, digits, character) { var str = typeof value === "number" ? value.toString() : value || ""; while (str.length < digits) { str = character[0] + str } return str }

                function leadingNulls(value, digits) { return leadingSomething(value, digits, "0") }

                function compareByDay(date1, date2) {
                    function sgn(value) { return value < 0 ? -1 : value > 0 ? 1 : 0 }
                    var compare;
                    if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) { if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) { compare = sgn(date1.getDate() - date2.getDate()) } }
                    return compare
                }

                function getFirstWeekStartDate(janFourth) {
                    switch (janFourth.getDay()) {
                        case 0:
                            return new Date(janFourth.getFullYear() - 1, 11, 29);
                        case 1:
                            return janFourth;
                        case 2:
                            return new Date(janFourth.getFullYear(), 0, 3);
                        case 3:
                            return new Date(janFourth.getFullYear(), 0, 2);
                        case 4:
                            return new Date(janFourth.getFullYear(), 0, 1);
                        case 5:
                            return new Date(janFourth.getFullYear() - 1, 11, 31);
                        case 6:
                            return new Date(janFourth.getFullYear() - 1, 11, 30)
                    }
                }

                function getWeekBasedYear(date) { var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday); var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4); var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4); var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear); var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear); if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) { if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) { return thisDate.getFullYear() + 1 } else { return thisDate.getFullYear() } } else { return thisDate.getFullYear() - 1 } }
                var EXPANSION_RULES_2 = {
                    "%a": function(date) { return WEEKDAYS[date.tm_wday].substring(0, 3) },
                    "%A": function(date) { return WEEKDAYS[date.tm_wday] },
                    "%b": function(date) { return MONTHS[date.tm_mon].substring(0, 3) },
                    "%B": function(date) { return MONTHS[date.tm_mon] },
                    "%C": function(date) { var year = date.tm_year + 1900; return leadingNulls(year / 100 | 0, 2) },
                    "%d": function(date) { return leadingNulls(date.tm_mday, 2) },
                    "%e": function(date) { return leadingSomething(date.tm_mday, 2, " ") },
                    "%g": function(date) { return getWeekBasedYear(date).toString().substring(2) },
                    "%G": function(date) { return getWeekBasedYear(date) },
                    "%H": function(date) { return leadingNulls(date.tm_hour, 2) },
                    "%I": function(date) {
                        var twelveHour = date.tm_hour;
                        if (twelveHour == 0) twelveHour = 12;
                        else if (twelveHour > 12) twelveHour -= 12;
                        return leadingNulls(twelveHour, 2)
                    },
                    "%j": function(date) { return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3) },
                    "%m": function(date) { return leadingNulls(date.tm_mon + 1, 2) },
                    "%M": function(date) { return leadingNulls(date.tm_min, 2) },
                    "%n": function() { return "\n" },
                    "%p": function(date) { if (date.tm_hour >= 0 && date.tm_hour < 12) { return "AM" } else { return "PM" } },
                    "%S": function(date) { return leadingNulls(date.tm_sec, 2) },
                    "%t": function() { return "\t" },
                    "%u": function(date) { return date.tm_wday || 7 },
                    "%U": function(date) { var janFirst = new Date(date.tm_year + 1900, 0, 1); var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay()); var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday); if (compareByDay(firstSunday, endDate) < 0) { var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31; var firstSundayUntilEndJanuary = 31 - firstSunday.getDate(); var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate(); return leadingNulls(Math.ceil(days / 7), 2) } return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00" },
                    "%V": function(date) { var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4); var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4); var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear); var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear); var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday); if (compareByDay(endDate, firstWeekStartThisYear) < 0) { return "53" } if (compareByDay(firstWeekStartNextYear, endDate) <= 0) { return "01" } var daysDifference; if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) { daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate() } else { daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate() } return leadingNulls(Math.ceil(daysDifference / 7), 2) },
                    "%w": function(date) { return date.tm_wday },
                    "%W": function(date) { var janFirst = new Date(date.tm_year, 0, 1); var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1); var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday); if (compareByDay(firstMonday, endDate) < 0) { var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31; var firstMondayUntilEndJanuary = 31 - firstMonday.getDate(); var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate(); return leadingNulls(Math.ceil(days / 7), 2) } return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00" },
                    "%y": function(date) { return (date.tm_year + 1900).toString().substring(2) },
                    "%Y": function(date) { return date.tm_year + 1900 },
                    "%z": function(date) {
                        var off = date.tm_gmtoff;
                        var ahead = off >= 0;
                        off = Math.abs(off) / 60;
                        off = off / 60 * 100 + off % 60;
                        return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
                    },
                    "%Z": function(date) { return date.tm_zone },
                    "%%": function() { return "%" }
                };
                for (var rule in EXPANSION_RULES_2) { if (pattern.includes(rule)) { pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date)) } }
                var bytes = intArrayFromString(pattern, false);
                if (bytes.length > maxsize) { return 0 }
                writeArrayToMemory(bytes, s);
                return bytes.length - 1
            }

            function _strftime_l(s, maxsize, format, tm) { return _strftime(s, maxsize, format, tm) }
            InternalError = Module["InternalError"] = extendError(Error, "InternalError");
            embind_init_charCodes();
            BindingError = Module["BindingError"] = extendError(Error, "BindingError");
            init_ClassHandle();
            init_RegisteredPointer();
            init_embind();
            UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
            init_emval();
            var GLctx;
            for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
            var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
            for (var i = 0; i < 288; ++i) { miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1) }
            var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
            for (var i = 0; i < 288; ++i) { __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(0, i + 1) }

            function intArrayFromString(stringy, dontAddNull, length) { var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1; var u8array = new Array(len); var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length); if (dontAddNull) u8array.length = numBytesWritten; return u8array }
            var asmLibraryArg = { "Z": ___cxa_allocate_exception, "Y": ___cxa_throw, "X": ___syscall_fcntl64, "ad": ___syscall_fstat64, "$c": ___syscall_fstatat64, "_c": ___syscall_ioctl, "Zc": ___syscall_lstat64, "Yc": ___syscall_mmap2, "Xc": ___syscall_munmap, "W": ___syscall_open, "Wc": ___syscall_stat64, "w": __embind_finalize_value_object, "$": __embind_register_bigint, "Sc": __embind_register_bool, "m": __embind_register_class, "e": __embind_register_class_class_function, "x": __embind_register_class_constructor, "d": __embind_register_class_function, "U": __embind_register_constant, "Rc": __embind_register_emval, "l": __embind_register_enum, "k": __embind_register_enum_value, "T": __embind_register_float, "s": __embind_register_function, "z": __embind_register_integer, "q": __embind_register_memory_view, "o": __embind_register_smart_ptr, "S": __embind_register_std_string, "I": __embind_register_std_wstring, "v": __embind_register_value_object, "i": __embind_register_value_object_field, "Qc": __embind_register_void, "Pc": __emscripten_throw_longjmp, "C": __emval_as, "D": __emval_call_method, "B": __emval_call_void_method, "H": __emval_decref, "Oc": __emval_get_global, "y": __emval_get_method_caller, "R": __emval_get_property, "G": __emval_incref, "Nc": __emval_new, "Mc": __emval_new_array, "Lc": __emval_new_cstring, "Kc": __emval_new_object, "Jc": __emval_not, "Ic": __emval_run_destructors, "u": __emval_set_property, "t": __emval_take_value, "a": _abort, "Hc": _clock_gettime, "Gc": _emscripten_glActiveTexture, "Fc": _emscripten_glAttachShader, "Ec": _emscripten_glBindAttribLocation, "Dc": _emscripten_glBindBuffer, "Q": _emscripten_glBindFramebuffer, "Cc": _emscripten_glBindRenderbuffer, "Bc": _emscripten_glBindSampler, "Ac": _emscripten_glBindTexture, "zc": _emscripten_glBindVertexArray, "yc": _emscripten_glBindVertexArrayOES, "xc": _emscripten_glBlendColor, "wc": _emscripten_glBlendEquation, "vc": _emscripten_glBlendFunc, "uc": _emscripten_glBlitFramebuffer, "tc": _emscripten_glBufferData, "sc": _emscripten_glBufferSubData, "rc": _emscripten_glCheckFramebufferStatus, "P": _emscripten_glClear, "O": _emscripten_glClearColor, "N": _emscripten_glClearStencil, "qc": _emscripten_glClientWaitSync, "pc": _emscripten_glColorMask, "oc": _emscripten_glCompileShader, "nc": _emscripten_glCompressedTexImage2D, "mc": _emscripten_glCompressedTexSubImage2D, "lc": _emscripten_glCopyTexSubImage2D, "kc": _emscripten_glCreateProgram, "jc": _emscripten_glCreateShader, "ic": _emscripten_glCullFace, "hc": _emscripten_glDeleteBuffers, "gc": _emscripten_glDeleteFramebuffers, "fc": _emscripten_glDeleteProgram, "ec": _emscripten_glDeleteRenderbuffers, "dc": _emscripten_glDeleteSamplers, "cc": _emscripten_glDeleteShader, "bc": _emscripten_glDeleteSync, "ac": _emscripten_glDeleteTextures, "$b": _emscripten_glDeleteVertexArrays, "_b": _emscripten_glDeleteVertexArraysOES, "Zb": _emscripten_glDepthMask, "Yb": _emscripten_glDisable, "Xb": _emscripten_glDisableVertexAttribArray, "Wb": _emscripten_glDrawArrays, "Vb": _emscripten_glDrawArraysInstanced, "Ub": _emscripten_glDrawArraysInstancedBaseInstanceWEBGL, "Tb": _emscripten_glDrawBuffers, "Sb": _emscripten_glDrawElements, "Rb": _emscripten_glDrawElementsInstanced, "Qb": _emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL, "Pb": _emscripten_glDrawRangeElements, "Ob": _emscripten_glEnable, "Nb": _emscripten_glEnableVertexAttribArray, "Mb": _emscripten_glFenceSync, "Lb": _emscripten_glFinish, "Kb": _emscripten_glFlush, "Jb": _emscripten_glFramebufferRenderbuffer, "Ib": _emscripten_glFramebufferTexture2D, "Hb": _emscripten_glFrontFace, "Gb": _emscripten_glGenBuffers, "Fb": _emscripten_glGenFramebuffers, "Eb": _emscripten_glGenRenderbuffers, "Db": _emscripten_glGenSamplers, "Cb": _emscripten_glGenTextures, "Bb": _emscripten_glGenVertexArrays, "Ab": _emscripten_glGenVertexArraysOES, "zb": _emscripten_glGenerateMipmap, "yb": _emscripten_glGetBufferParameteriv, "xb": _emscripten_glGetError, "wb": _emscripten_glGetFramebufferAttachmentParameteriv, "F": _emscripten_glGetIntegerv, "vb": _emscripten_glGetProgramInfoLog, "ub": _emscripten_glGetProgramiv, "tb": _emscripten_glGetRenderbufferParameteriv, "sb": _emscripten_glGetShaderInfoLog, "rb": _emscripten_glGetShaderPrecisionFormat, "qb": _emscripten_glGetShaderiv, "M": _emscripten_glGetString, "pb": _emscripten_glGetStringi, "ob": _emscripten_glGetUniformLocation, "nb": _emscripten_glInvalidateFramebuffer, "mb": _emscripten_glInvalidateSubFramebuffer, "lb": _emscripten_glIsSync, "kb": _emscripten_glIsTexture, "jb": _emscripten_glLineWidth, "ib": _emscripten_glLinkProgram, "hb": _emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL, "gb": _emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL, "fb": _emscripten_glPixelStorei, "eb": _emscripten_glReadBuffer, "db": _emscripten_glReadPixels, "cb": _emscripten_glRenderbufferStorage, "bb": _emscripten_glRenderbufferStorageMultisample, "ab": _emscripten_glSamplerParameteri, "$a": _emscripten_glSamplerParameteriv, "_a": _emscripten_glScissor, "Za": _emscripten_glShaderSource, "Ya": _emscripten_glStencilFunc, "Xa": _emscripten_glStencilFuncSeparate, "Wa": _emscripten_glStencilMask, "Va": _emscripten_glStencilMaskSeparate, "Ua": _emscripten_glStencilOp, "Ta": _emscripten_glStencilOpSeparate, "Sa": _emscripten_glTexImage2D, "Ra": _emscripten_glTexParameterf, "Qa": _emscripten_glTexParameterfv, "Pa": _emscripten_glTexParameteri, "Oa": _emscripten_glTexParameteriv, "Na": _emscripten_glTexStorage2D, "Ma": _emscripten_glTexSubImage2D, "La": _emscripten_glUniform1f, "Ka": _emscripten_glUniform1fv, "Ja": _emscripten_glUniform1i, "Ia": _emscripten_glUniform1iv, "Ha": _emscripten_glUniform2f, "Ga": _emscripten_glUniform2fv, "Fa": _emscripten_glUniform2i, "Ea": _emscripten_glUniform2iv, "Da": _emscripten_glUniform3f, "Ca": _emscripten_glUniform3fv, "Ba": _emscripten_glUniform3i, "Aa": _emscripten_glUniform3iv, "za": _emscripten_glUniform4f, "ya": _emscripten_glUniform4fv, "xa": _emscripten_glUniform4i, "wa": _emscripten_glUniform4iv, "va": _emscripten_glUniformMatrix2fv, "ua": _emscripten_glUniformMatrix3fv, "ta": _emscripten_glUniformMatrix4fv, "sa": _emscripten_glUseProgram, "ra": _emscripten_glVertexAttrib1f, "qa": _emscripten_glVertexAttrib2fv, "pa": _emscripten_glVertexAttrib3fv, "oa": _emscripten_glVertexAttrib4fv, "na": _emscripten_glVertexAttribDivisor, "ma": _emscripten_glVertexAttribIPointer, "la": _emscripten_glVertexAttribPointer, "ka": _emscripten_glViewport, "ja": _emscripten_glWaitSync, "ia": _emscripten_resize_heap, "ha": _emscripten_webgl_get_current_context, "Vc": _environ_get, "Uc": _environ_sizes_get, "ga": _exit, "J": _fd_close, "ba": _fd_pread, "Tc": _fd_read, "aa": _fd_seek, "V": _fd_write, "b": _getTempRet0, "h": invoke_ii, "n": invoke_iii, "g": invoke_iiii, "A": invoke_iiiii, "fa": invoke_iiiiii, "L": invoke_iiiiiii, "K": invoke_iiiiiiiiii, "E": invoke_v, "j": invoke_vi, "r": invoke_vii, "f": invoke_viii, "p": invoke_viiii, "ea": invoke_viiiii, "da": invoke_viiiiii, "ca": invoke_viiiiiiiii, "c": _setTempRet0, "_": _strftime_l };
            var asm = createWasm();
            var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() { return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["cd"]).apply(null, arguments) };
            var _malloc = Module["_malloc"] = function() { return (_malloc = Module["_malloc"] = Module["asm"]["dd"]).apply(null, arguments) };
            var _free = Module["_free"] = function() { return (_free = Module["_free"] = Module["asm"]["fd"]).apply(null, arguments) };
            var ___errno_location = Module["___errno_location"] = function() { return (___errno_location = Module["___errno_location"] = Module["asm"]["gd"]).apply(null, arguments) };
            var ___getTypeName = Module["___getTypeName"] = function() { return (___getTypeName = Module["___getTypeName"] = Module["asm"]["hd"]).apply(null, arguments) };
            var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() { return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["id"]).apply(null, arguments) };
            var _memalign = Module["_memalign"] = function() { return (_memalign = Module["_memalign"] = Module["asm"]["jd"]).apply(null, arguments) };
            var _setThrew = Module["_setThrew"] = function() { return (_setThrew = Module["_setThrew"] = Module["asm"]["kd"]).apply(null, arguments) };
            var stackSave = Module["stackSave"] = function() { return (stackSave = Module["stackSave"] = Module["asm"]["ld"]).apply(null, arguments) };
            var stackRestore = Module["stackRestore"] = function() { return (stackRestore = Module["stackRestore"] = Module["asm"]["md"]).apply(null, arguments) };
            var dynCall_iiiji = Module["dynCall_iiiji"] = function() { return (dynCall_iiiji = Module["dynCall_iiiji"] = Module["asm"]["nd"]).apply(null, arguments) };
            var dynCall_ji = Module["dynCall_ji"] = function() { return (dynCall_ji = Module["dynCall_ji"] = Module["asm"]["od"]).apply(null, arguments) };
            var dynCall_iiji = Module["dynCall_iiji"] = function() { return (dynCall_iiji = Module["dynCall_iiji"] = Module["asm"]["pd"]).apply(null, arguments) };
            var dynCall_iijjiii = Module["dynCall_iijjiii"] = function() { return (dynCall_iijjiii = Module["dynCall_iijjiii"] = Module["asm"]["qd"]).apply(null, arguments) };
            var dynCall_iij = Module["dynCall_iij"] = function() { return (dynCall_iij = Module["dynCall_iij"] = Module["asm"]["rd"]).apply(null, arguments) };
            var dynCall_vijjjii = Module["dynCall_vijjjii"] = function() { return (dynCall_vijjjii = Module["dynCall_vijjjii"] = Module["asm"]["sd"]).apply(null, arguments) };
            var dynCall_viji = Module["dynCall_viji"] = function() { return (dynCall_viji = Module["dynCall_viji"] = Module["asm"]["td"]).apply(null, arguments) };
            var dynCall_vijiii = Module["dynCall_vijiii"] = function() { return (dynCall_vijiii = Module["dynCall_vijiii"] = Module["asm"]["ud"]).apply(null, arguments) };
            var dynCall_viiiiij = Module["dynCall_viiiiij"] = function() { return (dynCall_viiiiij = Module["dynCall_viiiiij"] = Module["asm"]["vd"]).apply(null, arguments) };
            var dynCall_jii = Module["dynCall_jii"] = function() { return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["wd"]).apply(null, arguments) };
            var dynCall_iiij = Module["dynCall_iiij"] = function() { return (dynCall_iiij = Module["dynCall_iiij"] = Module["asm"]["xd"]).apply(null, arguments) };
            var dynCall_iiiij = Module["dynCall_iiiij"] = function() { return (dynCall_iiiij = Module["dynCall_iiiij"] = Module["asm"]["yd"]).apply(null, arguments) };
            var dynCall_viij = Module["dynCall_viij"] = function() { return (dynCall_viij = Module["dynCall_viij"] = Module["asm"]["zd"]).apply(null, arguments) };
            var dynCall_viiij = Module["dynCall_viiij"] = function() { return (dynCall_viiij = Module["dynCall_viiij"] = Module["asm"]["Ad"]).apply(null, arguments) };
            var dynCall_vij = Module["dynCall_vij"] = function() { return (dynCall_vij = Module["dynCall_vij"] = Module["asm"]["Bd"]).apply(null, arguments) };
            var dynCall_jiiii = Module["dynCall_jiiii"] = function() { return (dynCall_jiiii = Module["dynCall_jiiii"] = Module["asm"]["Cd"]).apply(null, arguments) };
            var dynCall_jiiiiii = Module["dynCall_jiiiiii"] = function() { return (dynCall_jiiiiii = Module["dynCall_jiiiiii"] = Module["asm"]["Dd"]).apply(null, arguments) };
            var dynCall_jiiiiji = Module["dynCall_jiiiiji"] = function() { return (dynCall_jiiiiji = Module["dynCall_jiiiiji"] = Module["asm"]["Ed"]).apply(null, arguments) };
            var dynCall_iijj = Module["dynCall_iijj"] = function() { return (dynCall_iijj = Module["dynCall_iijj"] = Module["asm"]["Fd"]).apply(null, arguments) };
            var dynCall_jiji = Module["dynCall_jiji"] = function() { return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["Gd"]).apply(null, arguments) };
            var dynCall_viijii = Module["dynCall_viijii"] = function() { return (dynCall_viijii = Module["dynCall_viijii"] = Module["asm"]["Hd"]).apply(null, arguments) };
            var dynCall_iiiiij = Module["dynCall_iiiiij"] = function() { return (dynCall_iiiiij = Module["dynCall_iiiiij"] = Module["asm"]["Id"]).apply(null, arguments) };
            var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = function() { return (dynCall_iiiiijj = Module["dynCall_iiiiijj"] = Module["asm"]["Jd"]).apply(null, arguments) };
            var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = function() { return (dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = Module["asm"]["Kd"]).apply(null, arguments) };

            function invoke_ii(index, a1) {
                var sp = stackSave();
                try { return getWasmTableEntry(index)(a1) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_iii(index, a1, a2) {
                var sp = stackSave();
                try { return getWasmTableEntry(index)(a1, a2) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_viii(index, a1, a2, a3) {
                var sp = stackSave();
                try { getWasmTableEntry(index)(a1, a2, a3) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_iiii(index, a1, a2, a3) {
                var sp = stackSave();
                try { return getWasmTableEntry(index)(a1, a2, a3) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_vi(index, a1) {
                var sp = stackSave();
                try { getWasmTableEntry(index)(a1) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_vii(index, a1, a2) {
                var sp = stackSave();
                try { getWasmTableEntry(index)(a1, a2) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
                var sp = stackSave();
                try { return getWasmTableEntry(index)(a1, a2, a3, a4, a5) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_viiii(index, a1, a2, a3, a4) {
                var sp = stackSave();
                try { getWasmTableEntry(index)(a1, a2, a3, a4) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
                var sp = stackSave();
                try { return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_iiiii(index, a1, a2, a3, a4) {
                var sp = stackSave();
                try { return getWasmTableEntry(index)(a1, a2, a3, a4) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_viiiii(index, a1, a2, a3, a4, a5) {
                var sp = stackSave();
                try { getWasmTableEntry(index)(a1, a2, a3, a4, a5) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                var sp = stackSave();
                try { getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_v(index) {
                var sp = stackSave();
                try { getWasmTableEntry(index)() } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
                var sp = stackSave();
                try { getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }

            function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                var sp = stackSave();
                try { return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9) } catch (e) {
                    stackRestore(sp);
                    if (e !== e + 0 && e !== "longjmp") throw e;
                    _setThrew(1, 0)
                }
            }
            var calledRun;

            function ExitStatus(status) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + status + ")";
                this.status = status
            }
            dependenciesFulfilled = function runCaller() { if (!calledRun) run(); if (!calledRun) dependenciesFulfilled = runCaller };

            function run(args) {
                args = args || arguments_;
                if (runDependencies > 0) { return }
                preRun();
                if (runDependencies > 0) { return }

                function doRun() {
                    if (calledRun) return;
                    calledRun = true;
                    Module["calledRun"] = true;
                    if (ABORT) return;
                    initRuntime();
                    readyPromiseResolve(Module);
                    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                    postRun()
                }
                if (Module["setStatus"]) {
                    Module["setStatus"]("Running...");
                    setTimeout(function() {
                        setTimeout(function() { Module["setStatus"]("") }, 1);
                        doRun()
                    }, 1)
                } else { doRun() }
            }
            Module["run"] = run;

            function exit(status, implicit) {
                EXITSTATUS = status;
                if (keepRuntimeAlive()) {} else { exitRuntime() }
                procExit(status)
            }

            function procExit(code) {
                EXITSTATUS = code;
                if (!keepRuntimeAlive()) {
                    if (Module["onExit"]) Module["onExit"](code);
                    ABORT = true
                }
                quit_(code, new ExitStatus(code))
            }
            if (Module["preInit"]) { if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]]; while (Module["preInit"].length > 0) { Module["preInit"].pop()() } }
            run();


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