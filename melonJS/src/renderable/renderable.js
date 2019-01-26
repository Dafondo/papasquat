/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2018 Olivier Biot
 * http://www.melonjs.org
 *
 */
(function () {

    /**
     * A base class for renderable objects.
     * @class
     * @extends me.Rect
     * @memberOf me
     * @constructor
     * @param {Number} x position of the renderable object
     * @param {Number} y position of the renderable object
     * @param {Number} width object width
     * @param {Number} height object height
     */
    me.Renderable = me.Rect.extend(
    /** @scope me.Renderable.prototype */
    {
        /**
         * @ignore
         */
        init : function (x, y, width, height) {
            /**
             * to identify the object as a renderable object
             * @ignore
             */
            this.isRenderable = true;

            /**
             * If true then physic collision and input events will not impact this renderable
             * @public
             * @type Boolean
             * @default true
             * @name isKinematic
             * @memberOf me.Renderable
             */
            this.isKinematic = true;

            /**
             * the renderable physic body
             * @public
             * @type {me.Body}
             * @see me.Body
             * @see me.collision.check
             * @name body
             * @memberOf me.Renderable
             * @example
             *  // define a new Player Class
             *  game.PlayerEntity = me.Sprite.extend({
             *      // constructor
             *      init:function (x, y, settings) {
             *          // call the parent constructor
             *          this._super(me.Sprite, 'init', [x, y , settings]);
             *
             *          // define a basic walking animation
             *          this.addAnimation("walk",  [...]);
             *          // define a standing animation (using the first frame)
             *          this.addAnimation("stand",  [...]);
             *          // set the standing animation as default
             *          this.setCurrentAnimation("stand");
             *
             *          // add a physic body
             *          this.body = new me.Body(this);
             *          // add a default collision shape
             *          this.body.addShape(new me.Rect(0, 0, this.width, this.height));
             *          // configure max speed and friction
             *          this.body.setMaxVelocity(3, 15);
             *          this.body.setFriction(0.4, 0);
             *
             *          // enable physic collision (off by default for basic me.Renderable)
             *          this.isKinematic = false;
             *
             *          // set the display to follow our position on both axis
             *          me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
             *      },
             *
             *      ...
             *
             * }
             */
            this.body = undefined;

            /**
             * the renderable default transformation matrix
             * @public
             * @type me.Matrix2d
             * @name currentTransform
             * @memberOf me.Renderable
             */
            if (typeof this.currentTransform === "undefined") {
                this.currentTransform = me.pool.pull("me.Matrix2d");
            }
            this.currentTransform.identity();

           /**
            * (G)ame (U)nique (Id)entifier" <br>
            * a GUID will be allocated for any renderable object added <br>
            * to an object container (including the `me.game.world` container)
            * @public
            * @type String
            * @name GUID
            * @memberOf me.Renderable
            */
            this.GUID = undefined;

            /**
             * an event handler that is called when the renderable leave or enter a camera viewport
             * @public
             * @type function
             * @default undefined
             * @name onVisibilityChange
             * @memberOf me.Renderable
             * @example
             * this.onVisibilityChange = function(inViewport) {
             *     if (inViewport === true) {
             *         console.log("object has entered the in a camera viewport!");
             *     }
             * };
             */
            this.onVisibilityChange = undefined;

            /**
             * Whether the renderable object will always update, even when outside of the viewport<br>
             * @public
             * @type Boolean
             * @default false
             * @name alwaysUpdate
             * @memberOf me.Renderable
             */
            this.alwaysUpdate = false;

            /**
             * Whether to update this object when the game is paused.
             * @public
             * @type Boolean
             * @default false
             * @name updateWhenPaused
             * @memberOf me.Renderable
             */
            this.updateWhenPaused = false;

            /**
             * make the renderable object persistent over level changes<br>
             * @public
             * @type Boolean
             * @default false
             * @name isPersistent
             * @memberOf me.Renderable
             */
            this.isPersistent = false;

            /**
             * If true, this renderable will be rendered using screen coordinates,
             * as opposed to world coordinates. Use this, for example, to define UI elements.
             * @public
             * @type Boolean
             * @default false
             * @name floating
             * @memberOf me.Renderable
             */
            this.floating = false;

            /**
             * The anchor point is used for attachment behavior, and/or when applying transformations.<br>
             * The coordinate system places the origin at the top left corner of the frame (0, 0) and (1, 1) means the bottom-right corner<br>
             * <img src="images/anchor_point.png"/> :<br>
             * a Renderable's anchor point defaults to (0.5,0.5), which corresponds to the center position.<br>
             * @public
             * @type me.ObservableVector2d
             * @default <0.5,0.5>
             * @name anchorPoint
             * @memberOf me.Renderable
             */
            if (this.anchorPoint instanceof me.ObservableVector2d) {
                this.anchorPoint.setMuted(0.5, 0.5).setCallback(this.onAnchorUpdate.bind(this));
            } else {
                this.anchorPoint = me.pool.pull("me.ObservableVector2d", 0.5, 0.5, { onUpdate: this.onAnchorUpdate.bind(this) });
            }

            /**
             * When enabled, an object container will automatically apply
             * any defined transformation before calling the child draw method.
             * @public
             * @type Boolean
             * @default true
             * @name autoTransform
             * @memberOf me.Renderable
             * @example
             * // enable "automatic" transformation when the object is activated
             * onActivateEvent: function () {
             *     // reset the transformation matrix
             *     this.renderable.currentTransform.identity();
             *     // ensure the anchor point is the renderable center
             *     this.renderable.anchorPoint.set(0.5, 0.5);
             *     // enable auto transform
             *     this.renderable.autoTransform = true;
             *     ....
             * },
             * // add a rotation effect when updating the entity
             * update : function (dt) {
             *     ....
             *     this.renderable.currentTransform.rotate(0.025);
             *     ....
             *     return this._super(me.Entity, 'update', [dt]);
             * },
             */
            this.autoTransform = true;

            /**
             * Define the renderable opacity<br>
             * Set to zero if you do not wish an object to be drawn
             * @see me.Renderable#setOpacity
             * @see me.Renderable#getOpacity
             * @public
             * @type Number
             * @default 1.0
             * @name me.Renderable#alpha
             */
            this.alpha = 1.0;

            /**
             * a reference to the parent object that contains this renderable
             * @public
             * @type me.Container|me.Entity
             * @default undefined
             * @name me.Renderable#ancestor
             */
            this.ancestor = undefined;

            /**
             * The bounding rectangle for this renderable
             * @ignore
             * @type {me.Rect}
             * @name _bounds
             * @memberOf me.Renderable
             */
            if (this._bounds instanceof me.Rect) {
                this._bounds.setShape(x, y, width, height);
            } else {
                this._bounds = me.pool.pull("me.Rect", x, y, width, height);
            }

            /**
             * A mask limits rendering elements to the shape and position of the given mask object.
             * So, if the renderable is larger than the mask, only the intersecting part of the renderable will be visible.
             * @public
             * @type {me.Rect|me.Polygon|me.Line|me.Ellipse}
             * @name mask
             * @default undefined
             * @memberOf me.Renderable
             * @example
             * // apply a mask in the shape of a Star
             * myNPCSprite.mask = new me.Polygon(myNPCSprite.width / 2, 0, [
             *    // draw a star
             *    {x: 0, y: 0},
             *    {x: 14, y: 30},
             *    {x: 47, y: 35},
             *    {x: 23, y: 57},
             *    {x: 44, y: 90},
             *    {x: 0, y: 62},
             *    {x: -44, y: 90},
             *    {x: -23, y: 57},
             *    {x: -47, y: 35},
             *    {x: -14, y: 30}
             * ]);
             */
            this.mask = undefined;

            /**
             * apply a tint to this renderable (WebGL Only)
             * @public
             * @type {me.Color}
             * @name tint
             * @default undefined
             * @memberOf me.Renderable
             * @example
             * // add a red tint to this renderable
             * this.renderable.tint = new me.Color(255, 128, 128);
             * // disable the tint
             * this.renderable.tint.setColor(255, 255, 255);
             */
            this.tint = undefined;

            /**
             * The name of the renderable
             * @public
             * @type {String}
             * @name name
             * @default ""
             * @memberOf me.Renderable
             */
            this.name = "";

            /**
             * Absolute position in the game world
             * @ignore
             * @type {me.Vector2d}
             * @name _absPos
             * @memberOf me.Renderable
             */
            if (this._absPos instanceof me.Vector2d) {
                this._absPos.set(x, y);
            }
            else {
                this._absPos = me.pool.pull("me.Vector2d", x, y);
            }

            /**
             * Position of the Renderable relative to its parent container
             * @public
             * @type {me.ObservableVector3d}
             * @name pos
             * @memberOf me.Renderable
             */
            if (this.pos instanceof me.ObservableVector3d) {
                this.pos.setMuted(x, y, 0).setCallback(this.updateBoundsPos.bind(this));
            } else {
                this.pos = me.pool.pull("me.ObservableVector3d", x, y, 0, { onUpdate: this.updateBoundsPos.bind(this) });
            }

            this._width = width;
            this._height = height;

            // keep track of when we flip
            this._flip = {
                x : false,
                y : false
            };

            // viewport flag
            this._inViewport = false;

            this.shapeType = "Rectangle";

            // ensure it's fully opaque by default
            this.setOpacity(1.0);
        },

        /** @ignore */
        onResetEvent : function () {
            this.init.apply(this, arguments);
        },

        /**
         * returns the bounding box for this renderable
         * @name getBounds
         * @memberOf me.Renderable
         * @function
         * @return {me.Rect} bounding box Rectangle object
         */
        getBounds : function () {
            return this._bounds;
        },

        /**
         * get the renderable alpha channel value<br>
         * @name getOpacity
         * @memberOf me.Renderable
         * @function
         * @return {Number} current opacity value between 0 and 1
         */
        getOpacity : function () {
            return this.alpha;
        },

        /**
         * set the renderable alpha channel value<br>
         * @name setOpacity
         * @memberOf me.Renderable
         * @function
         * @param {Number} alpha opacity value between 0.0 and 1.0
         */
        setOpacity : function (alpha) {
            if (typeof (alpha) === "number") {
                this.alpha = me.Math.clamp(alpha, 0.0, 1.0);
                // Set to 1 if alpha is NaN
                if (isNaN(this.alpha)) {
                    this.alpha = 1.0;
                }
            }
        },

        /**
         * flip the renderable on the horizontal axis (around the center of the renderable)
         * @see me.Matrix2d.scaleX
         * @name flipX
         * @memberOf me.Renderable
         * @function
         * @param {Boolean} [flip=false] `true` to flip this renderable.
         * @return {me.Renderable} Reference to this object for method chaining
         */
        flipX : function (flip) {
            this._flip.x = !!flip;
            return this;
        },

        /**
         * flip the renderable on the vertical axis (around the center of the renderable)
         * @see me.Matrix2d.scaleY
         * @name flipY
         * @memberOf me.Renderable
         * @function
         * @param {Boolean} [flip=false] `true` to flip this renderable.
         * @return {me.Renderable} Reference to this object for method chaining
         */
        flipY : function (flip) {
            this._flip.y = !!flip;
            return this;
        },

        /**
         * multiply the renderable currentTransform with the given matrix
         * @name transform
         * @memberOf me.Renderable
         * @see me.Renderable#currentTransform
         * @function
         * @param {me.Matrix2d} matrix the transformation matrix
         * @return {me.Renderable} Reference to this object for method chaining
         */
        transform : function (m) {
            var bounds = this.getBounds();
            this.currentTransform.multiply(m);
            bounds.setPoints(bounds.transform(m).points);
            bounds.pos.setV(this.pos);
            return this;
        },

        /**
         * scale the renderable around his anchor point
         * @name scale
         * @memberOf me.Renderable
         * @function
         * @param {Number} x a number representing the abscissa of the scaling vector.
         * @param {Number} [y=x] a number representing the ordinate of the scaling vector.
         * @return {me.Renderable} Reference to this object for method chaining
         */
        scale : function (x, y) {
            var _x = x,
                _y = typeof(y) === "undefined" ? _x : y;

            // set the scaleFlag
            this.currentTransform.scale(_x, _y);
            // resize the bounding box
            this.getBounds().resize(this.width * _x, this.height * _y);
            return this;
        },

        /**
         * scale the renderable around his anchor point
         * @name scaleV
         * @memberOf me.Renderable
         * @function
         * @param {me.Vector2d} vector scaling vector
         * @return {me.Renderable} Reference to this object for method chaining
         */
        scaleV : function (v) {
            this.scale(v.x, v.y);
            return this;
        },

        /**
         * update function. <br>
         * automatically called by the game manager {@link me.game}
         * @name update
         * @memberOf me.Renderable
         * @function
         * @protected
         * @param {Number} dt time since the last update in milliseconds.
         * @return false
         **/
        update : function (/* dt */) {
            return false;
        },

        /**
         * update the renderable's bounding rect (private)
         * @ignore
         * @name updateBoundsPos
         * @memberOf me.Renderable
         * @function
         */
        updateBoundsPos : function (newX, newY) {
            var bounds = this.getBounds();
            bounds.pos.set(newX, newY, bounds.pos.z);
            // XXX: This is called from the constructor, before it gets an ancestor
            if (this.ancestor instanceof me.Container && !this.floating) {
                bounds.pos.add(this.ancestor._absPos);
            }
            return bounds;
        },

        /**
         * called when the anchor point value is changed
         * @private
         * @name onAnchorUpdate
         * @memberOf me.Renderable
         * @function
         */
        onAnchorUpdate : function () {
            ; // to be extended
        },

        /**
         * update the bounds
         * @private
         * @deprecated
         * @name updateBounds
         * @memberOf me.Renderable
         * @function
         */
        updateBounds : function () {
            console.warn("Deprecated: me.Renderable.updateBounds");
            return this._super(me.Rect, "updateBounds");
        },

        /**
         * prepare the rendering context before drawing
         * (apply defined transforms, anchor point). <br>
         * automatically called by the game manager {@link me.game}
         * @name preDraw
         * @memberOf me.Renderable
         * @function
         * @protected
         * @param {me.CanvasRenderer|me.WebGLRenderer} renderer a renderer object
         **/
        preDraw : function (renderer) {
            var bounds = this.getBounds();
            var ax = bounds.width * this.anchorPoint.x,
                ay = bounds.height * this.anchorPoint.y;

            // save context
            renderer.save();
            // apply the defined alpha value
            renderer.setGlobalAlpha(renderer.globalAlpha() * this.getOpacity());

            // apply flip
            if (this._flip.x || this._flip.y) {
                var dx = this._flip.x ? this.centerX - ax : 0,
                    dy = this._flip.y ? this.centerY - ay : 0;

                renderer.translate(dx, dy);
                renderer.scale(this._flip.x  ? -1 : 1, this._flip.y  ? -1 : 1)
                renderer.translate(-dx, -dy);
            }

            if ((this.autoTransform === true) && (!this.currentTransform.isIdentity())) {
                this.currentTransform.translate(-ax, -ay);
                // apply the renderable transformation matrix
                renderer.transform(this.currentTransform);
                this.currentTransform.translate(ax, ay);
            } else {
                // translate to the defined anchor point
                renderer.translate(-ax, -ay);
            }

            if (typeof this.mask !== "undefined") {
                renderer.setMask(this.mask);
            }

            if (typeof this.tint !== "undefined") {
                renderer.setTint(this.tint);
            }

        },

        /**
         * object draw. <br>
         * automatically called by the game manager {@link me.game}
         * @name draw
         * @memberOf me.Renderable
         * @function
         * @protected
         * @param {me.CanvasRenderer|me.WebGLRenderer} renderer a renderer object
         **/
        draw : function (/*renderer*/) {
            // empty one !
        },

        /**
         * restore the rendering context after drawing. <br>
         * automatically called by the game manager {@link me.game}
         * @name postDraw
         * @memberOf me.Renderable
         * @function
         * @protected
         * @param {me.CanvasRenderer|me.WebGLRenderer} renderer a renderer object
         **/
        postDraw : function (renderer) {
            if (typeof this.mask !== "undefined") {
                renderer.clearMask();
            }
            if (typeof this.tint !== "undefined") {
                renderer.clearTint();
            }
            // restore the context
            renderer.restore();
        },

        /**
         * Destroy function<br>
         * @ignore
         */
        destroy : function () {
            // allow recycling object properties
            me.pool.push(this.currentTransform);
            this.currentTransform = undefined;

            me.pool.push(this.anchorPoint);
            this.anchorPoint = undefined;

            me.pool.push(this.pos);
            this.pos = undefined;

            me.pool.push(this._absPos);
            this._absPos = undefined;

            me.pool.push(this._bounds);
            this._bounds = undefined;

            this.onVisibilityChange = undefined;

            if (typeof this.mask !== "undefined") {
                me.pool.push(this.mask);
                this.mask = undefined;
            }

            if (typeof this.tint !== "undefined") {
                me.pool.push(this.tint);
                this.tint = undefined;
            }

            this.ancestor = undefined;

            // destroy the physic body if defined
            if (typeof this.body !== "undefined") {
                this.body.destroy.apply(this.body, arguments);
                this.body = undefined;
            }

            this.onDestroyEvent.apply(this, arguments);
        },

        /**
         * OnDestroy Notification function<br>
         * Called by engine before deleting the object
         * @name onDestroyEvent
         * @memberOf me.Renderable
         * @function
         */
        onDestroyEvent : function () {
            // to be extended !
        }
    });

    /**
     * Whether the renderable object is visible and within the viewport
     * @public
     * @readonly
     * @type Boolean
     * @default false
     * @name inViewport
     * @memberOf me.Renderable
     */
    Object.defineProperty(me.Renderable.prototype, "inViewport", {
        /**
         * @ignore
         */
        get : function () {
            return this._inViewport;
        },
        /**
         * @ignore
         */
        set : function (value) {
            if (this._inViewport !== value) {
                this._inViewport = value;
                if (typeof this.onVisibilityChange === "function") {
                    this.onVisibilityChange.call(this, value);
                }
            }
        },
        configurable : true
    });

    /**
     * width of the Renderable bounding box
     * @public
     * @type {Number}
     * @name width
     * @memberOf me.Renderable
     */
    Object.defineProperty(me.Renderable.prototype, "width", {
        /**
         * @ignore
         */
        get : function () {
            return this._width;
        },
        /**
         * @ignore
         */
        set : function (value) {
            if (this._width !== value) {
                this.getBounds().width = value;
                this._width = value;
            }
        },
        configurable : true
    });

    /**
     * height of the Renderable bounding box
     * @public
     * @type {Number}
     * @name height
     * @memberOf me.Renderable
     */
    Object.defineProperty(me.Renderable.prototype, "height", {
        /**
         * @ignore
         */
        get : function () {
            return this._height;
        },
        /**
         * @ignore
         */
        set : function (value) {
            if (this._height !== value) {
                this.getBounds().height = value;
                this._height = value;
            }
        },
        configurable : true
    });

    /**
     * Base class for Renderable exception handling.
     * @name Error
     * @class
     * @memberOf me.Renderable
     * @constructor
     * @param {String} msg Error message.
     */
    me.Renderable.Error = me.Error.extend({
        /**
         * @ignore
         */
        init : function (msg) {
            this._super(me.Error, "init", [ msg ]);
            this.name = "me.Renderable.Error";
        }
    });
})();
