
/************************************************************************************/
/*                                                                                  */
/*        a puddle entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.PuddleEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , {width:32, height:32}]);
        this.body.collisionType = game.collisionTypes.PUDDLE;
        
        var texture =  new me.video.renderer.Texture(
            { framewidth: 64, frameheight: 128 },
            me.loader.getImage("solid-PEE-PUDDLE1-01")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0]);
        // define an additional basic walking animation
        this.renderable.addAnimation ("simple_walk", [0]);

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);

        // Add this puddle to the puddles array
        game.data.puddles.push(this);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        
        
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

