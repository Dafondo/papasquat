
/************************************************************************************/
/*                                                                                  */
/*        a wardrobe entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.WardrobeEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        game.data.player = this
        this._super(me.Entity, "init", [x, y , {width:48, height:32}]);
        this.body.collisionType = game.collisionTypes.PLANT;

        
        var texture =  new me.video.renderer.Texture(
            { framewidth: 128, frameheight: 128 },
            me.loader.getImage("wardrobe")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        // define an additional basic walking animation
        
        this.renderable.addAnimation ("static", [10]);
        this.renderable.addAnimation ("get in", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.renderable.addAnimation ("get out", [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);

        this.renderable.setCurrentAnimation([static]);
        
        this.state = "empty";

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, -.7);
        
        me.input.registerPointerEvent("pointerdown", this, this.onMouseDown.bind(this));
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        
        
    },
    
    onMouseDown : function() {
        console.log("clicked");
        if (this.state === "empty") {
            this.state = "transition";
            // set touch animation
            this.renderable.setCurrentAnimation("get in");
           
            me.audio.play("Cabinet Open", false, null, .5);
            

            game.data.food = 100;

           
            return false;

        }
        if (this.state === "full") {
            this.state = "empty";
            // set touch animation
            this.renderable.setCurrentAnimation("empty");
            // make it flicker
            //this.renderable.flicker(75);
            
            me.audio.play("Food Get", false, null, .5);
            

            game.data.food = 100;

           
            return false;

        }
        
},

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (/*response, other*/) {
        // Make all other objects solid
        return false;
    }
});

