
/************************************************************************************/
/*                                                                                  */
/*        a mom entity                                                           */
/*                                                                                  */
/************************************************************************************/

MAMA_VEL = 2.5;
isSus = false;

game.MomEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructornpx
        this._super(me.Entity, "init", [x, y , settings]);
        this.body.collisionType = game.collisionTypes.MOM;

        // walking & jumping speed
        this.alwaysUpdate = true;
        roombaLogic(this, MAMA_VEL);

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
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // Check if papasquat is in viewable range
        papapos = new me.Vector2d(game.data.player.pos.x, game.data.player.pos.y);
        mamapos = new me.Vector2d(this.centerX, this.centerY);
        this.sightline = new me.Line(0, 0, [
            mamapos,
            papapos
        ]);
        var result = [];
        me.collision.rayCast(this.sightline, result);

        // TODO:  add a detection range
        if (result.length < 3 && game.data.player.renderable.getOpacity() > 0.5) {
            // Get angle between mama and papa
            dir = this.angleTo(game.data.player);
            this.body.vel.x = MAMA_VEL * Math.cos(dir);
            this.body.vel.y = MAMA_VEL * Math.sin(dir);

            if (game.data.momsus === false) {
                game.data.messages.push("mom has spotted you");
                game.data.momsus = true;
            }
        } else if (game.data.momsus === true) {
            game.data.messages.push("mom no longer sees you");
            game.data.momsus = false;
        } else {
            // look and see if there any puddles if she can't see a vagrant in her house
            for (i = 0; i < game.data.puddles.length; i++) {
            // for (puddle of game.data.puddles) {
                puddle = game.data.puddles[i];

                puddlepos = new me.Vector2d(puddle.centerX, puddle.centerY)
                puddleView = new me.Line(0, 0, [
                    mamapos,
                    puddlepos
                ]);
                obs = me.collision.rayCast(puddleView);
                if (obs.length < 3 && mamapos.distance(puddlepos) < 30) {
                    // Remove the puddle
                    me.game.world.removeChildNow(puddle);
                    game.data.puddles.splice(i, 1);
                    isSus = true;
                    // Momma is suspicious
                    game.data.suspicion += 30
                    game.data.messages.push("mom saw piss and is sus");
                    game.data.newsreel = game.data.newsreel + "MAMA GOT SUSPICIOUS AFTER FINDING PUDDLE OF PISS -- "
                    break;
                } else if (obs.length < 3) {
                    dir = this.angleTo(puddle);
                    this.body.vel.x = MAMA_VEL * Math.cos(dir);
                    this.body.vel.y = MAMA_VEL * Math.sin(dir);
                    break;
                }
            } 
        }

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
                 
             }
             return false;
         } else {
            roombaLogic(this, 2.5);
         }
         // Make all other objects solid
         return true;
    }
});

game.SusieEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);
        this.body.collisionType = game.collisionTypes.MOM;

        this.alwaysUpdate = true;
        roombaLogic(this, 5);


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

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // Check if papasquat is in viewable range
        papapos = new me.Vector2d(game.data.player.pos.x, game.data.player.pos.y);
        susiepos = new me.Vector2d(this.centerX, this.centerY);
        this.sightline = new me.Line(0, 0, [
            susiepos,
            papapos
        ]);
        var result = [];
        me.collision.rayCast(this.sightline, result);

        // TODO:  add a detection range
        if (result.length < 3 && game.data.player.renderable.getOpacity() > 0.5 && game.data.sussus === false) {
            // game.data.messages.push("susie has spotted you");
            game.data.sussus = true;
        } else {
            game.data.sussus = false;
        }

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
                 
             }

             return false;
         } else {
             roombaLogic(this, 5);
         }
         // Make all other objects solid
         return true;
    }
});

game.SonEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);
        this.body.collisionType = game.collisionTypes.MOM;
        this.alwaysUpdate = true;

        this.alwaysUpdate = true;
        roombaLogic(this, 5);

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
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // Check if papasquat is in viewable range
        papapos = new me.Vector2d(game.data.player.pos.x, game.data.player.pos.y);
        sonpos = new me.Vector2d(this.centerX, this.centerY);
        this.sightline = new me.Line(0, 0, [
            sonpos,
            papapos
        ]);
        var result = [];
        me.collision.rayCast(this.sightline, result);

        // TODO:  add a detection range
        if (result.length < 3 && game.data.player.renderable.getOpacity() > 0.5 && game.data.sonsus === false) {
            // game.data.messages.push("son has spotted you");
            game.data.sonsus = true;
        } else {
            game.data.sonsus = false;
        }

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
                
             }
             return false;
         } else {
             roombaLogic(this, 5);
         }
         // Make all other objects solid
         return true;
    }
});


function roombaLogic(entityName, baseVel) {
    initDir = Math.random() * Math.PI * 2;
    entityName.body.vel.x = baseVel * Math.cos(initDir);
    entityName.body.vel.y = baseVel * Math.sin(initDir);
}
