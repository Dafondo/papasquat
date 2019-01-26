
/************************************************************************************/
/*                                                                                  */
/*        a mom entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.MomEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);

        

        // the main player spritesheet
        var texture =  new me.video.renderer.Texture(
            { framewidth: 200, frameheight: 300 },
            me.loader.getImage("Mama_Squat-01")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0]);
        // define an additional basic walking animation
        this.renderable.addAnimation ("simple_walk", [0]);

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        

        

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        }
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        console.log(response, other)
        // Make all other objects solid
        return true;
    }
});

