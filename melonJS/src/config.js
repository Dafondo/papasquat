/**
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2018 Olivier Biot
 * http://www.melonjs.org
 */

(function () {

    /**
     * me global references
     * @ignore
     */
    me.mod = "melonJS";
    me.version = "__VERSION__";
    /**
     * global system settings and browser capabilities
     * @namespace
     */
    me.sys = {

        /*
         * Global settings
         */

        /**
         * Set game FPS limiting
         * @see me.timer.tick
         * @type {Number}
         * @default 60
         * @memberOf me.sys
         */
        fps : 60,

        /**
         * Rate at which the game updates;<br>
         * may be greater than or lower than the fps
         * @see me.timer.tick
         * @type {Number}
         * @default 60
         * @memberOf me.sys
         */
        updatesPerSecond : 60,

        /**
         * Enable/disable frame interpolation
         * @see me.timer.tick
         * @type {Boolean}
         * @default false
         * @memberOf me.sys
         */
        interpolation : false,

        /**
         * Global scaling factor
         * @type {me.Vector2d}
         * @default <0,0>
         * @memberOf me.sys
         */
        scale : null, //initialized by me.video.init

        /**
         * Global y axis gravity settings.
         * (will override body gravity value if defined)
         * @type {Number}
         * @default undefined
         * @memberOf me.sys
         */
        gravity : undefined,

        /**
         * Specify either to stop on audio loading error or not<br>
         * if true, melonJS will throw an exception and stop loading<br>
         * if false, melonJS will disable sounds and output a warning message
         * in the console<br>
         * @type {Boolean}
         * @default true
         * @memberOf me.sys
         */
        stopOnAudioError : true,

        /**
         * Specify whether to pause the game when losing focus.<br>
         * @type {Boolean}
         * @default true
         * @memberOf me.sys
         */
        pauseOnBlur : true,

        /**
         * Specify whether to unpause the game when gaining focus.<br>
         * @type {Boolean}
         * @default true
         * @memberOf me.sys
         */
        resumeOnFocus : true,

        /**
         * Specify whether to automatically bring the window to the front.<br>
         * @type {Boolean}
         * @default true
         * @memberOf me.sys
         */
        autoFocus : true,

        /**
         * Specify whether to stop the game when losing focus or not<br>
         * The engine restarts on focus if this is enabled.
         * @type {boolean}
         * @default false
         * @memberOf me.sys
         */
        stopOnBlur : false,

        /**
         * Specify the rendering method for layers <br>
         * if false, visible part of the layers are rendered dynamically<br>
         * if true, the entire layers are first rendered into an offscreen
         * canvas<br>
         * the "best" rendering method depends of your game<br>
         * (amount of layer, layer size, amount of tiles per layer, etc.)<br>
         * note : rendering method is also configurable per layer by adding this
         * property to your layer (in Tiled)<br>
         * @type {Boolean}
         * @default false
         * @memberOf me.sys
         */
        preRender : false,

        /*
         * System methods
         */

        /**
         * Compare two version strings
         * @public
         * @function
         * @param {String} first First version string to compare
         * @param {String} [second="__VERSION__"] Second version string to compare
         * @return {Number} comparison result <br>&lt; 0 : first &lt; second<br>
         * 0 : first == second<br>
         * &gt; 0 : first &gt; second
         * @example
         * if (me.sys.checkVersion("__VERSION__") > 0) {
         *     console.error(
         *         "melonJS is too old. Expected: __VERSION__, Got: " + me.version
         *     );
         * }
         */
        checkVersion : function (first, second) {
            second = second || me.version;

            var a = first.split(".");
            var b = second.split(".");
            var len = Math.min(a.length, b.length);
            var result = 0;

            for (var i = 0; i < len; i++) {
                if ((result = +a[i] - +b[i])) {
                    break;
                }
            }

            return result ? result : a.length - b.length;
        }
    };

    function parseHash() {
        var hash = {};

        // No "document.location" exist for Wechat mini game platform.
        if (document.location && document.location.hash) {
            document.location.hash.substr(1).split("&").filter(function (value) {
                return (value !== "");
            }).forEach(function (value) {
                var kv = value.split("=");
                var k = kv.shift();
                var v = kv.join("=");
                hash[k] = v || true;
            });
        }

        return hash;
    }

    // a flag to know if melonJS
    // is initialized
    var me_initialized = false;

    Object.defineProperty(me, "initialized", {
        /**
         * @ignore
         */
        get : function get() {
            return me_initialized;
        }
    });

    /**
     * Disable melonJS auto-initialization
     * @type {Boolean}
     * @default false
     * @memberOf me
     */
    me.skipAutoInit = false;

    /**
     * initial boot function
     * @ignore
     */
    me.boot = function () {
        // don't do anything if already initialized (should not happen anyway)
        if (me_initialized) {
            return;
        }

        // check the device capabilites
        me.device._check();

        // init the object Pool
        me.pool.init();

        // initialize me.save
        me.save._init();

        // parse optional url parameters/tags
        me.game.HASH = parseHash();

        // enable/disable the cache
        me.loader.setNocache(
            me.game.HASH.nocache || false
        );

        // init the FPS counter if needed
        me.timer.init();

        // init the App Manager
        me.state.init();

        // automatically enable keyboard events if on desktop
        if (me.device.isMobile === false) {
            me.input._enableKeyboardEvent();
        }

        // init the level Director
        me.levelDirector.reset();

        me_initialized = true;
    };

    // call the library init function when ready
    if (me.skipAutoInit === false) {
        me.device.onReady(function () {
            me.boot();
        });
    } else {
        /**
         * @ignore
         */
        me.init = function () {
            me.boot();
            me.device._domReady();
        };
    }

})();
