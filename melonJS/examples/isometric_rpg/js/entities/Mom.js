
/************************************************************************************/
/*                                                                                  */
/*        a mom entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.MomEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);
        this.body.collisionType = game.collisionTypes.MOM;

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);

        

        // the main player spritesheet
        var texture =  new me.video.renderer.Texture(
            { framewidth: 64, frameheight: 128 },
            me.loader.getImage("Mama_Squat-01")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 2, 4, 6, 8, 9]);
        // define an additional basic walking animation
        this.renderable.addAnimation ("simple_walk", [0]);

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, -0.6);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        this.body.vel.x += 12 * ( Math.random() - .5);
        this.body.vel.y += 12 * ( Math.random() - .5);
        

        

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
        //console.log(response, other)
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
    }
});

game.SusieEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);

        this.body.collisionType = game.collisionTypes.MOM;

        // the main player spritesheet
        var texture =  new me.video.renderer.Texture(
            { framewidth: 64, frameheight: 128 },
            me.loader.getImage("Susie_Squat-01")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 2, 4, 6, 8, 9]);
        // define an additional basic walking animation
        this.renderable.addAnimation ("simple_walk", [0]);

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, -0.6);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        this.body.vel.x += 12 * ( Math.random() - .5);
        this.body.vel.y += 12 * ( Math.random() - .5);
        

        

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
        //console.log(response, other)
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
    }
});

game.SonEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);

        this.body.collisionType = game.collisionTypes.MOM;

        // the main player spritesheet
        var texture =  new me.video.renderer.Texture(
            { framewidth: 64, frameheight: 128 },
            me.loader.getImage("Son_Squat-01")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 2, 4, 6, 8, 9]);
        // define an additional basic walking animation
        this.renderable.addAnimation ("simple_walk", [0]);

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, -0.6);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        this.body.vel.x += 12 * ( Math.random() - .5);
        this.body.vel.y += 12 * ( Math.random() - .5);
        

        

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
        //console.log(response, other)
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
    }
});

