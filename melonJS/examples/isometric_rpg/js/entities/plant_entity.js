
/************************************************************************************/
/*                                                                                  */
/*        a plant entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.PlantEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        game.data.player = this
        this._super(me.Entity, "init", [x, y , {width:48, height:32}]);
        this.body.collisionType = game.collisionTypes.PLANT;

        
        var texture =  new me.video.renderer.Texture(
            { framewidth: 64, frameheight: 128 },
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
        this.anchorPoint.set(0.5, -.7);
        
        me.input.registerPointerEvent("pointerdown", this, this.onMouseDown.bind(this));
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        
        
    },
    
    onMouseDown : function() {
        if(Math.pow(Math.pow(this.pos.x - game.data.player.pos.x, 2) + 
           Math.pow(this.pos.y - game.data.player.pos.y, 2), .5) > 120){
           game.data.messages.push("too far to interact");
           return false;
        }
        console.log("peed");
        if (this.state === "healthy") {
            me.audio.play("Piss");
            this.state = "sick";
            // set touch animation
            this.renderable.setCurrentAnimation("sick");
            // make it flicker
            //this.renderable.flicker(75);
            // play ow FX
            
            game.data.messages.push("you peed in the plant");
            game.data.urine = 0;

           
            return false;

        }
        if (this.state === "sick" || this.state === "dead") {
            me.audio.play("Piss");
            this.state = "dead";
            // set touch animation
            this.renderable.setCurrentAnimation("dead");
            // make it flicker
            //this.renderable.flicker(75);
            // play ow FX
            game.data.messages.push("you peed in the plant");

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

