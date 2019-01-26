/*
* MelonJS Game Engine
* Copyright (C) 2011 - 2018 Olivier Biot
* http://www.melonjs.org
*
*/
(function () {

    /**
     * a basic texture cache object
     * @ignore
     */
    me.Renderer.TextureCache = me.Object.extend({
        /**
         * @ignore
         */
        init : function (max_size) {
            this.cache = new Map();
            this.units = new Map();
            this.max_size = max_size || Infinity;
            this.reset();
        },

        /**
         * @ignore
         */
        reset : function () {
            this.cache.clear();
            this.units.clear();
            this.length = 0;
        },

        /**
         * @ignore
         */
        validate : function () {
            if (this.length >= this.max_size) {
                // TODO: Merge textures instead of throwing an exception
                throw new me.video.Error(
                    "Texture cache overflow: " + this.max_size +
                    " texture units available."
                );
            }
        },

        /**
         * @ignore
         */
        get : function (image, atlas) {
            if (!this.cache.has(image)) {
                if (!atlas) {
                    atlas = me.video.renderer.Texture.prototype.createAtlas.apply(
                        me.video.renderer.Texture.prototype,
                        [image.width, image.height, image.src ? me.utils.file.getBasename(image.src) : undefined]
                    );
                }
                this.put(image, new me.video.renderer.Texture(atlas, image, false));
            }
            return this.cache.get(image);
        },

        /**
         * @ignore
         */
        put : function (image, texture) {
            var width = image.width;
            var height = image.height;

            // warn if a non POT texture is added to the cache
            if (!me.Math.isPowerOfTwo(width) || !me.Math.isPowerOfTwo(height)) {
                var src = typeof image.src !== "undefined" ? image.src : image;
                console.warn(
                    "[Texture] " + src + " is not a POT texture " +
                    "(" + width + "x" + height + ")"
                );
            }

            this.validate();
            this.cache.set(image, texture);
            this.units.set(texture, this.length++);
        },

        /**
         * @ignore
         */
        getUnit : function (texture) {
            return this.units.get(texture);
        }
    });

})();
