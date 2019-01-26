/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2018 Olivier Biot
 * http://www.melonjs.org
 *
 */
(function () {

    /**
     * a WebGL renderer object
     * @extends me.Renderer
     * @namespace me.WebGLRenderer
     * @memberOf me
     * @constructor
     * @param {HTMLCanvasElement} canvas The html canvas tag to draw to on screen.
     * @param {Number} width The width of the canvas without scaling
     * @param {Number} height The height of the canvas without scaling
     * @param {Object} [options] The renderer parameters
     * @param {Boolean} [options.doubleBuffering=false] Whether to enable double buffering
     * @param {Boolean} [options.antiAlias=false] Whether to enable anti-aliasing
     * @param {Boolean} [options.failIfMajorPerformanceCaveat=true] If true, the renderer will switch to CANVAS mode if the performances of a WebGL context would be dramatically lower than that of a native application making equivalent OpenGL calls.
     * @param {Boolean} [options.transparent=false] Whether to enable transparency on the canvas (performance hit when enabled)
     * @param {Boolean} [options.subPixel=false] Whether to enable subpixel renderering (performance hit when enabled)
     * @param {Number} [options.zoomX=width] The actual width of the canvas with scaling applied
     * @param {Number} [options.zoomY=height] The actual height of the canvas with scaling applied
     * @param {me.WebGLRenderer.Compositor} [options.compositor] A class that implements the compositor API
     */
    me.WebGLRenderer = me.Renderer.extend(
    /** @scope me.WebGLRenderer.prototype */
    {
        /**
         * @ignore
         */
        init : function (c, width, height, options) {
            this._super(me.Renderer, "init", [c, width, height, options]);

            /**
             * The WebGL context
             * @name gl
             * @memberOf me.WebGLRenderer
             */
            this.context = this.gl = this.getContextGL(c, this.settings.transparent);

            /**
             * @ignore
             */
            this._colorStack = [];

            /**
             * @ignore
             */
            this._matrixStack = [];

            /**
             * @ignore
             */
            this._scissorStack = [];

            /**
             * @ignore
             */
            this._glPoints = [
                new me.Vector2d(),
                new me.Vector2d(),
                new me.Vector2d(),
                new me.Vector2d()
            ];

            /**
             * The current transformation matrix used for transformations on the overall scene
             * @name currentTransform
             * @type me.Matrix2d
             * @memberOf me.WebGLRenderer
             */
            this.currentTransform = new me.Matrix2d();

            // Create a compositor
            var Compositor = this.settings.compositor || me.WebGLRenderer.Compositor;
            this.compositor = new Compositor(this);


            // default WebGL state(s)
            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.disable(this.gl.SCISSOR_TEST);
            this.gl.enable(this.gl.BLEND);

            // set default mode
            this.setBlendMode(this.settings.blendMode);

            // Create a texture cache
            this.cache = new me.Renderer.TextureCache(
                this.compositor.maxTextures
            );

            // Configure the WebGL viewport
            this.scaleCanvas(1, 1);

            return this;
        },

        /**
         * Reset context state
         * @name reset
         * @memberOf me.WebGLRenderer
         * @function
         */
        reset : function () {
            this._super(me.Renderer, "reset");
            this.compositor.reset();
            this.gl.disable(this.gl.SCISSOR_TEST);
            if (typeof this.fontContext2D !== "undefined" ) {
                this.createFontTexture(this.cache);
            }

        },

        /**
         * Reset the gl transform to identity
         * @name resetTransform
         * @memberOf me.WebGLRenderer
         * @function
         */
        resetTransform : function () {
            this.currentTransform.identity();
        },

        /**
         * @ignore
         */
        createFontTexture : function (cache) {
            if (typeof this.fontTexture === "undefined") {
                var image = me.video.createCanvas(
                    me.Math.nextPowerOfTwo(this.backBufferCanvas.width),
                    me.Math.nextPowerOfTwo(this.backBufferCanvas.height)
                );

                /**
                 * @ignore
                 */
                this.fontContext2D = this.getContext2d(image);

                /**
                 * @ignore
                 */
                this.fontTexture = new this.Texture(
                    this.Texture.prototype.createAtlas.apply(
                        this.Texture.prototype,
                        [ this.backBufferCanvas.width, this.backBufferCanvas.height, "fontTexture"]
                    ),
                    image,
                    cache
                );
            }
            else {
               // fontTexture was already created, just add it back into the cache
               cache.put(this.fontContext2D.canvas, this.fontTexture);
           }
           this.compositor.uploadTexture(this.fontTexture, 0, 0, 0);



        },

        /**
         * Create a pattern with the specified repetition
         * @name createPattern
         * @memberOf me.WebGLRenderer
         * @function
         * @param {image} image Source image
         * @param {String} repeat Define how the pattern should be repeated
         * @return {me.video.renderer.Texture}
         * @see me.ImageLayer#repeat
         * @example
         * var tileable   = renderer.createPattern(image, "repeat");
         * var horizontal = renderer.createPattern(image, "repeat-x");
         * var vertical   = renderer.createPattern(image, "repeat-y");
         * var basic      = renderer.createPattern(image, "no-repeat");
         */
        createPattern : function (image, repeat) {

            if (!me.Math.isPowerOfTwo(image.width) || !me.Math.isPowerOfTwo(image.height)) {
                var src = typeof image.src !== "undefined" ? image.src : image;
                throw new me.video.Error(
                    "[WebGL Renderer] " + src + " is not a POT texture " +
                    "(" + image.width + "x" + image.height + ")"
                );
            }

            var texture = new this.Texture(
                this.Texture.prototype.createAtlas.apply(
                    this.Texture.prototype,
                    [ image.width, image.height, "pattern", repeat]
                ),
                image
            );

            // FIXME: Remove old cache entry and texture when changing the repeat mode
            this.compositor.uploadTexture(texture);

            return texture;
        },

        /**
         * Flush the compositor to the frame buffer
         * @name flush
         * @memberOf me.WebGLRenderer
         * @function
         */
        flush : function () {
            this.compositor.flush();
        },

        /**
         * Clears the gl context with the given color.
         * @name clearColor
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.Color|String} color CSS color.
         * @param {Boolean} [opaque=false] Allow transparency [default] or clear the surface completely [true]
         */
        clearColor : function (col, opaque) {
            this.save();
            this.resetTransform();
            this.currentColor.copy(col);
            if (opaque) {
                this.compositor.clear();
            }
            else {
                this.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
            this.restore();
        },

        /**
         * Erase the pixels in the given rectangular area by setting them to transparent black (rgba(0,0,0,0)).
         * @name clearRect
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x x axis of the coordinate for the rectangle starting point.
         * @param {Number} y y axis of the coordinate for the rectangle starting point.
         * @param {Number} width The rectangle's width.
         * @param {Number} height The rectangle's height.
         */
        clearRect : function (x, y, width, height) {
            var color = this.currentColor.clone();
            this.currentColor.copy("#000000");
            this.fillRect(x, y, width, height);
            this.currentColor.copy(color);
            me.pool.push(color);
        },

        /**
         * @ignore
         */
        drawFont : function (bounds) {
            var fontContext = this.getFontContext();

            // Flush the compositor so we can upload a new texture
            this.flush();

            // Force-upload the new texture
            this.compositor.uploadTexture(this.fontTexture, 0, 0, 0, true);

            // Add the new quad
            var key = bounds.pos.x + "," + bounds.pos.y + "," + bounds.width + "," + bounds.height;
            this.compositor.addQuad(
                this.fontTexture,
                key,
                bounds.pos.x,
                bounds.pos.y,
                bounds.width,
                bounds.height
            );

            // Clear font context2D
            fontContext.clearRect(
                bounds.pos.x,
                bounds.pos.y,
                bounds.width,
                bounds.height
            );
        },

        /**
         * Draw an image to the gl context
         * @name drawImage
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Image} image An element to draw into the context. The specification permits any canvas image source (CanvasImageSource), specifically, a CSSImageValue, an HTMLImageElement, an SVGImageElement, an HTMLVideoElement, an HTMLCanvasElement, an ImageBitmap, or an OffscreenCanvas.
         * @param {Number} sx The X coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
         * @param {Number} sy The Y coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
         * @param {Number} sw The width of the sub-rectangle of the source image to draw into the destination context. If not specified, the entire rectangle from the coordinates specified by sx and sy to the bottom-right corner of the image is used.
         * @param {Number} sh The height of the sub-rectangle of the source image to draw into the destination context.
         * @param {Number} dx The X coordinate in the destination canvas at which to place the top-left corner of the source image.
         * @param {Number} dy The Y coordinate in the destination canvas at which to place the top-left corner of the source image.
         * @param {Number} dWidth The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn.
         * @param {Number} dHeight The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn.
         * @example
         * // Position the image on the canvas:
         * renderer.drawImage(image, dx, dy);
         * // Position the image on the canvas, and specify width and height of the image:
         * renderer.drawImage(image, dx, dy, dWidth, dHeight);
         * // Clip the image and position the clipped part on the canvas:
         * renderer.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
         */
        drawImage : function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
            if (typeof sw === "undefined") {
                sw = dw = image.width;
                sh = dh = image.height;
                dx = sx;
                dy = sy;
                sx = 0;
                sy = 0;
            }
            else if (typeof dx === "undefined") {
                dx = sx;
                dy = sy;
                dw = sw;
                dh = sh;
                sw = image.width;
                sh = image.height;
                sx = 0;
                sy = 0;
            }

            if (this.settings.subPixel === false) {
                // clamp to pixel grid
                dx = ~~dx;
                dy = ~~dy;
            }

            var key = sx + "," + sy + "," + sw + "," + sh;
            this.compositor.addQuad(this.cache.get(image), key, dx, dy, dw, dh);
        },

        /**
         * Draw a pattern within the given rectangle.
         * @name drawPattern
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.video.renderer.Texture} pattern Pattern object
         * @param {Number} x
         * @param {Number} y
         * @param {Number} width
         * @param {Number} height
         * @see me.WebGLRenderer#createPattern
         */
        drawPattern : function (pattern, x, y, width, height) {
            var key = "0,0," + width + "," + height;
            this.compositor.addQuad(pattern, key, x, y, width, height);
        },


        /**
         * return a reference to the screen canvas corresponding WebGL Context
         * @name getScreenContext
         * @memberOf me.WebGLRenderer
         * @function
         * @return {WebGLRenderingContext}
         */
        getScreenContext : function () {
            return this.gl;
        },

        /**
         * Returns the WebGL Context object of the given Canvas
         * @name getContextGL
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Canvas} canvas
         * @param {Boolean} [transparent=true] use false to disable transparency
         * @return {WebGLRenderingContext}
         */
        getContextGL : function (canvas, transparent) {
            if (typeof canvas === "undefined" || canvas === null) {
                throw new me.video.Error(
                    "You must pass a canvas element in order to create " +
                    "a GL context"
                );
            }

            if (typeof transparent !== "boolean") {
                transparent = true;
            }

            var attr = {
                alpha : transparent,
                antialias : this.settings.antiAlias,
                depth : false,
                stencil: true,
                premultipliedAlpha: transparent,
                failIfMajorPerformanceCaveat : this.settings.failIfMajorPerformanceCaveat
            };

            var gl = canvas.getContext("webgl", attr) || canvas.getContext("experimental-webgl", attr);

            if (!gl) {
                throw new me.video.Error(
                    "A WebGL context could not be created."
                );
            }

            return gl;
        },

        /**
         * Returns the WebGLContext instance for the renderer
         * return a reference to the system 2d Context
         * @name getContext
         * @memberOf me.WebGLRenderer
         * @function
         * @return {WebGLRenderingContext}
         */
        getContext : function () {
            return this.gl;
        },

        /**
         * set a blend mode for the given context
         * @name setBlendMode
         * @memberOf me.WebGLRenderer
         * @function
         * @param {String} [mode="normal"] blend mode : "normal", "multiply"
         * @param {WebGLRenderingContext} [gl]
         */
        setBlendMode : function (mode, gl) {
            gl = gl || this.gl;


            gl.enable(gl.BLEND);
            switch (mode) {
                case "multiply" :
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    this.currentBlendMode = mode;
                    break;

                default :
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    this.currentBlendMode = "normal";
                    break;
            }
        },

        /**
         * return a reference to the font 2d Context
         * @ignore
         */
        getFontContext : function () {
            if (typeof this.fontContext2D === "undefined" ) {
                // warn the end user about performance impact
                console.warn("[WebGL Renderer] WARNING : Using Standard me.Text with WebGL will severly impact performances !");
                // create the font texture if not done yet
                this.createFontTexture(this.cache);
            }
            return this.fontContext2D;
        },

        /**
         * scales the canvas & GL Context
         * @name scaleCanvas
         * @memberOf me.WebGLRenderer
         * @function
         */
        scaleCanvas : function (scaleX, scaleY) {
            var w = this.canvas.width * scaleX;
            var h = this.canvas.height * scaleY;

            // adjust CSS style for High-DPI devices
            if (me.device.devicePixelRatio > 1) {
                this.canvas.style.width = (w / me.device.devicePixelRatio) + "px";
                this.canvas.style.height = (h / me.device.devicePixelRatio) + "px";
            }
            else {
                this.canvas.style.width = w + "px";
                this.canvas.style.height = h + "px";
            }

            this.compositor.setProjection(this.canvas.width, this.canvas.height);
        },

        /**
         * restores the canvas context
         * @name restore
         * @memberOf me.WebGLRenderer
         * @function
         */
        restore : function () {
            // do nothing if there is no saved states
            if (this._matrixStack.length !== 0) {
                var color = this._colorStack.pop();
                var matrix = this._matrixStack.pop();

                // restore the previous context
                this.currentColor.copy(color);
                this.currentTransform.copy(matrix);

                // recycle objects
                me.pool.push(color);
                me.pool.push(matrix);
            }

            if (this._scissorStack.length !== 0) {
                // FIXME : prevent `scissor` object realloc and GC
                this.currentScissor.set(this._scissorStack.pop());
            } else {
                // turn off scissor test
                this.gl.disable(this.gl.SCISSOR_TEST);
                this.currentScissor[0] = 0;
                this.currentScissor[1] = 0;
                this.currentScissor[2] = this.backBufferCanvas.width;
                this.currentScissor[3] = this.backBufferCanvas.height;
            }
        },

        /**
         * saves the canvas context
         * @name save
         * @memberOf me.WebGLRenderer
         * @function
         */
        save : function () {
            this._colorStack.push(this.currentColor.clone());
            this._matrixStack.push(this.currentTransform.clone());

            if (this.gl.isEnabled(this.gl.SCISSOR_TEST)) {
                // FIXME avoid slice and object realloc
                this._scissorStack.push(this.currentScissor.slice());
            }
        },

        /**
         * rotates the uniform matrix
         * @name rotate
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} angle in radians
         */
        rotate : function (angle) {
            this.currentTransform.rotate(angle);
        },

        /**
         * scales the uniform matrix
         * @name scale
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x
         * @param {Number} y
         */
        scale : function (x, y) {
            this.currentTransform.scale(x, y);
        },

        /**
         * not used by this renderer?
         * @ignore
         */
        setAntiAlias : function (context, enable) {
            this._super(me.Renderer, "setAntiAlias", [context, enable]);
            // TODO: perhaps handle GLNEAREST or other options with texture binding
        },

        /**
         * Set the global alpha
         * @name setGlobalAlpha
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} alpha 0.0 to 1.0 values accepted.
         */
        setGlobalAlpha : function (a) {
            this.currentColor.glArray[3] = a;
        },

        /**
         * Set the current fill & stroke style color.
         * By default, or upon reset, the value is set to #000000.
         * @name setColor
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.Color|String} color css color string.
         */
        setColor : function (color) {
            var alpha = this.currentColor.glArray[3];
            this.currentColor.copy(color);
            this.currentColor.glArray[3] *= alpha;
        },

        /**
         * Set the line width
         * @name setLineWidth
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} width Line width
         */
        setLineWidth : function (width) {
            this.getScreenContext().lineWidth(width);
        },

        /**
         * Stroke an arc at the specified coordinates with given radius, start and end points
         * @name strokeArc
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x arc center point x-axis
         * @param {Number} y arc center point y-axis
         * @param {Number} radius
         * @param {Number} start start angle in radians
         * @param {Number} end end angle in radians
         * @param {Boolean} [antiClockwise=false] draw arc anti-clockwise
         */
        strokeArc : function (x, y, radius, start, end, antiClockwise, fill) {
            if (fill === true ) {
                this.fillArc(x, y, radius, start, end, antiClockwise);
            } else {
                console.warn("strokeArc() is not implemented");
            }
        },

        /**
         * Fill an arc at the specified coordinates with given radius, start and end points
         * @name fillArc
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x arc center point x-axis
         * @param {Number} y arc center point y-axis
         * @param {Number} radius
         * @param {Number} start start angle in radians
         * @param {Number} end end angle in radians
         * @param {Boolean} [antiClockwise=false] draw arc anti-clockwise
         */
        fillArc : function (x, y, radius, start, end, antiClockwise) {
            console.warn("fillArc() is not implemented");
        },

        /**
         * Stroke an ellipse at the specified coordinates with given radius
         * @name strokeEllipse
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x ellipse center point x-axis
         * @param {Number} y ellipse center point y-axis
         * @param {Number} w horizontal radius of the ellipse
         * @param {Number} h vertical radius of the ellipse
         */
        strokeEllipse : function (x, y, w, h, fill) {
            if (fill === true ) {
                this.fillEllipse(x, y, w, h);
            } else {
                // XXX to be optimzed using a specific shader
                var len = Math.floor(24 * Math.sqrt(w)) ||
                          Math.floor(12 * Math.sqrt(w + h));
                var segment = (me.Math.TAU) / len;
                var points = this._glPoints,
                    i;

                // Grow internal points buffer if necessary
                for (i = points.length; i < len; i++) {
                    points.push(new me.Vector2d());
                }

                // calculate and draw all segments
                for (i = 0; i < len; i++) {
                    points[i].x = x + (Math.sin(segment * -i) * w);
                    points[i].y = y + (Math.cos(segment * -i) * h);
                }
                // batch draw all lines
                this.compositor.drawLine(points, len);
            }

        },

        /**
         * Fill an ellipse at the specified coordinates with given radius
         * @name fillEllipse
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x ellipse center point x-axis
         * @param {Number} y ellipse center point y-axis
         * @param {Number} w horizontal radius of the ellipse
         * @param {Number} h vertical radius of the ellipse
         */
        fillEllipse : function (x, y, w, h) {
            // XXX to be optimzed using a specific shader
            var len = Math.floor(24 * Math.sqrt(w)) ||
                      Math.floor(12 * Math.sqrt(w + h));
            var segment = (me.Math.TAU) / len;
            var points = this._glPoints;
            var index = 0;

            // Grow internal points buffer if necessary
            for (i = points.length; i < (len + 1) * 2; i++) {
                points.push(new me.Vector2d());
            }

            // draw all vertices vertex coordinates
            for (var i = 0; i < len + 1; i++) {
                points[index++].set(x, y);
                points[index++].set(
                    x + (Math.sin(segment * i) * w),
                    y + (Math.cos(segment * i) * h)
                );
            }

            // batch draw all triangles
            this.compositor.drawTriangle(points, index, true);
        },

        /**
         * Stroke a line of the given two points
         * @name strokeLine
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} startX the start x coordinate
         * @param {Number} startY the start y coordinate
         * @param {Number} endX the end x coordinate
         * @param {Number} endY the end y coordinate
         */
        strokeLine : function (startX, startY, endX, endY) {
            var points = this._glPoints;
            points[0].x = startX;
            points[0].y = startY;
            points[1].x = endX;
            points[1].y = endY;
            this.compositor.drawLine(points, 2, true);
        },


        /**
         * Fill a line of the given two points
         * @name fillLine
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} startX the start x coordinate
         * @param {Number} startY the start y coordinate
         * @param {Number} endX the end x coordinate
         * @param {Number} endY the end y coordinate
         */
        fillLine : function (startX, startY, endX, endY) {
            this.strokeLine(startX, startY, endX, endY);
        },

        /**
         * Stroke a me.Polygon on the screen with a specified color
         * @name strokePolygon
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.Polygon} poly the shape to draw
         */
        strokePolygon : function (poly, fill) {
            if (fill === true ) {
                this.fillPolygon(poly);
            } else {
                var len = poly.points.length,
                    points = this._glPoints,
                    i;

                // Grow internal points buffer if necessary
                for (i = points.length; i < len; i++) {
                    points.push(new me.Vector2d());
                }

                // calculate and draw all segments
                for (i = 0; i < len; i++) {
                    points[i].x = poly.pos.x + poly.points[i].x;
                    points[i].y = poly.pos.y + poly.points[i].y;
                }
                this.compositor.drawLine(points, len);
            }
        },

        /**
         * Fill a me.Polygon on the screen
         * @name fillPolygon
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.Polygon} poly the shape to draw
        */
        fillPolygon : function (poly) {
            var points = poly.points;
            var glPoints = this._glPoints;
            var indices = poly.getIndices();
            var x = poly.pos.x, y = poly.pos.y;

            // Grow internal points buffer if necessary
            for (i = glPoints.length; i < indices.length; i++) {
                glPoints.push(new me.Vector2d());
            }

            // calculate all vertices
            for ( var i = 0; i < indices.length; i ++ ) {
                glPoints[i].set(x + points[indices[i]].x, y + points[indices[i]].y);
            }

            // draw all triangle
            this.compositor.drawTriangle(glPoints, indices.length);
        },

        /**
         * Draw a stroke rectangle at the specified coordinates
         * @name strokeRect
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x
         * @param {Number} y
         * @param {Number} width
         * @param {Number} height
         */
        strokeRect : function (x, y, width, height) {
            var points = this._glPoints;
            points[0].x = x;
            points[0].y = y;
            points[1].x = x + width;
            points[1].y = y;
            points[2].x = x + width;
            points[2].y = y + height;
            points[3].x = x;
            points[3].y = y + height;
            this.compositor.drawLine(points, 4);
        },

        /**
         * Draw a filled rectangle at the specified coordinates
         * @name fillRect
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x
         * @param {Number} y
         * @param {Number} width
         * @param {Number} height
         */
        fillRect : function (x, y, width, height) {
            var glPoints = this._glPoints;
            glPoints[0].x = x + width;
            glPoints[0].y = y;
            glPoints[1].x = x;
            glPoints[1].y = y;
            glPoints[2].x = x + width;
            glPoints[2].y = y + height;
            glPoints[3].x = x;
            glPoints[3].y = y + height;
            this.compositor.drawTriangle(glPoints, 4, true)
        },

        /**
         * Reset (overrides) the renderer transformation matrix to the
         * identity one, and then apply the given transformation matrix.
         * @name setTransform
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.Matrix2d} mat2d Matrix to transform by
         */
        setTransform : function (mat2d) {
            this.resetTransform();
            this.transform(mat2d);
        },

        /**
         * Multiply given matrix into the renderer tranformation matrix
         * @name transform
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.Matrix2d} mat2d Matrix to transform by
         */
        transform : function (mat2d) {
            this.currentTransform.multiply(mat2d);
            if (this.settings.subPixel === false) {
                // snap position values to pixel grid
                var a = this.currentTransform.val;
                a[6] = ~~a[6];
                a[7] = ~~a[7];
            }
        },

        /**
         * Translates the uniform matrix by the given coordinates
         * @name translate
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x
         * @param {Number} y
         */
        translate : function (x, y) {
            if (this.settings.subPixel === false) {
                this.currentTransform.translate(~~x, ~~y);
            } else {
                this.currentTransform.translate(x, y);
            }
        },

        /**
         * clip the given region from the original canvas. Once a region is clipped,
         * all future drawing will be limited to the clipped region.
         * You can however save the current region using the save(),
         * and restore it (with the restore() method) any time in the future.
         * (<u>this is an experimental feature !</u>)
         * @name clipRect
         * @memberOf me.WebGLRenderer
         * @function
         * @param {Number} x
         * @param {Number} y
         * @param {Number} width
         * @param {Number} height
         */
        clipRect : function (x, y, width, height) {
            var canvas = this.backBufferCanvas;
            var gl = this.gl;
            // if requested box is different from the current canvas size
            if (x !== 0 || y !== 0 || width !== canvas.width || height !== canvas.height) {
                var currentScissor = this.currentScissor;
                if (gl.isEnabled(gl.SCISSOR_TEST)) {
                    // if same as the current scissor box do nothing
                    if (currentScissor[0] === x && currentScissor[1] === y &&
                        currentScissor[2] === width && currentScissor[3] === height) {
                            return;
                    }
                }
                // flush the compositor
                this.flush();
                // turn on scissor test
                gl.enable(this.gl.SCISSOR_TEST);
                // set the scissor rectangle (note : coordinates are left/bottom)
                gl.scissor(
                    // scissor does not account for currentTransform, so manually adjust
                    x + this.currentTransform.tx,
                    canvas.height -height -y -this.currentTransform.ty,
                    width,
                    height
                );
                // save the new currentScissor box
                currentScissor[0] = x;
                currentScissor[1] = y;
                currentScissor[2] = width;
                currentScissor[3] = height;
            } else {
                // turn off scissor test
                gl.disable(gl.SCISSOR_TEST);
            }
        },

        /**
         * A mask limits rendering elements to the shape and position of the given mask object.
         * So, if the renderable is larger than the mask, only the intersecting part of the renderable will be visible.
         * Mask are not preserved through renderer context save and restore.
         * @name setMask
         * @memberOf me.WebGLRenderer
         * @function
         * @param {me.Rect|me.Polygon|me.Line|me.Ellipse} [mask] the shape defining the mask to be applied
         */
        setMask : function (mask) {
            var gl = this.gl;

            // flush the compositor
            this.flush();

            // Enable and setup GL state to write to stencil buffer
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.NOTEQUAL, 1, 1);
            gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

            this.fill(mask);

            // flush the compositor
            this.flush();

            // Use stencil buffer to affect next rendering object
            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.EQUAL, 1, 1);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        },

        /**
         * disable (remove) the rendering mask set through setMask.
         * @name clearMask
         * @see setMask
         * @memberOf me.WebGLRenderer
         * @function
         */
        clearMask : function() {
            // flush the compositor
            this.flush();
            this.gl.disable(this.gl.STENCIL_TEST);
        }
    });

})();
