game.ShapeObject = me.Entity.extend({
     /**
     * constructor
     */
    init: function (x, y, settings) {
        // ensure we do not create a default shape
        settings.shapes = [];
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);

        // status flags
        this.selected = false;
        this.hover = false;

        // to memorize where we grab the shape
        this.grabOffset = new me.Vector2d(0,0);
    },

    onActivateEvent: function () {
        //register on mouse/touch event
        me.input.registerPointerEvent("pointerdown", this, this.onSelect.bind(this));
        me.input.registerPointerEvent("pointerup", this, this.onRelease.bind(this));
        me.input.registerPointerEvent("pointercancel", this, this.onRelease.bind(this));
        me.input.registerPointerEvent("pointermove", this, this.pointerMove.bind(this));
    },

    /**
     * pointermove function
     */
    pointerMove: function (event) {
        if (this.selected) {
            // follow the pointer
            me.game.world.moveUp(this);
            this.pos.set(event.gameX, event.gameY, this.pos.z);
            this.pos.sub(this.grabOffset);
        }
    },


    // mouse down function
    onSelect : function (event) {
        if (this.selected === false) {
            // manually calculate the relative coordinates for the body shapes
            // since only the bounding box is used by the input event manager
            var parentPos = this.ancestor.getBounds().pos;
            var x = event.gameX - this.pos.x - parentPos.x;
            var y = event.gameY - this.pos.y - parentPos.y;

            // the pointer event system will use the object bounding rect, check then with with all defined shapes
            for (var i = this.body.shapes.length, shape; i--, (shape = this.body.shapes[i]);) {
                if (shape.containsPoint(x, y)) {
                    this.selected = true;
                    break;
                }
            }
            if (this.selected) {
                this.grabOffset.set(event.gameX, event.gameY);
                this.grabOffset.sub(this.pos);
                this.selected = true;
            }
        }
        return this.seleted;
    },

    // mouse up function
    onRelease : function (/*event*/) {
        this.selected = false;
        // don"t propagate the event furthermore
        return false;
    },

    /**
     * update function
     */
    update: function () {
        return this.selected;
    },

    /**
     * draw the square
     */
    draw: function (renderer) {
        renderer.setGlobalAlpha(this.selected ? 1.0 : 0.5);
        this._super(me.Entity, "draw", [renderer]);
    }
});



game.Circle = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, "init", [x, y, settings]);

        // add an ellipse shape
        this.body.addShape(new me.Ellipse(this.width/2, this.height/2, this.width, this.height));

        // tomato
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage("orange")});
    }
});

game.Poly = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, "init", [x, y, settings]);

        // add all PE shapes to the body
        this.body.addShapesFromJSON(me.loader.getJSON("shapesdef1"), settings.sprite);

        // add the star sprite
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage(settings.sprite)});
    },
});


 game.Poly2 = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, "init", [x, y, settings]);

        // add all PE shapes to the body
        this.body.addShapesFromJSON(me.loader.getJSON("shapesdef2"), settings.sprite, settings.width);

        // add the star sprite
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage(settings.sprite)});
    }
});
