
/************************************************************************************/
/*                                                                                  */
/*        a plant entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.PlantEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , {width:32, height:32}]);

        
        var texture =  new me.video.renderer.Texture(
            { framewidth: 200, frameheight: 300 },
            me.loader.getImage("plant")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 1, 2]);
        // define an additional basic walking animation
        this.renderable.addAnimation ("healthy", [0]);
        this.renderable.addAnimation ("sick", [1]);
        this.renderable.addAnimation ("dead", [2]);
        
        this.state = "healthy";

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);
        
        me.input.registerPointerEvent("pointerdown", this, this.onMouseDown.bind(this));
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        
        
    },
    
    onMouseDown : function() {
        console.log("peed");
        if (this.state === "healthy") {
            this.state = "sick";
            // set touch animation
            this.renderable.setCurrentAnimation("sick");
            // make it flicker
            //this.renderable.flicker(75);
            // play ow FX
            

            game.data.urine = 0;

           
            return false;

        }
        if (this.state === "sick" || this.state === "dead") {
            this.state = "dead";
            // set touch animation
            this.renderable.setCurrentAnimation("dead");
            // make it flicker
            //this.renderable.flicker(75);
            // play ow FX
            

            game.data.urine = 0;

           
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

