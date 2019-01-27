
/************************************************************************************/
/*                                                                                  */
/*        a plant entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.TableEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        game.data.player = this
        this._super(me.Entity, "init", [x, y , {width:48, height:32}]);
        this.body.collisionType = game.collisionTypes.PLANT;


        var texture =  new me.video.renderer.Texture(
            { framewidth: 64, frameheight: 128 },
            me.loader.getImage("table")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 1, 2, 3, 4]);
        // define an additional basic walking animation

        this.renderable.addAnimation ("a", [0]);
        this.renderable.addAnimation ("b", [1]);
        this.renderable.addAnimation ("empty", [2]);
        this.renderable.addAnimation ("c", [3]);
        this.renderable.addAnimation ("d", [4]);

        this.renderable.setCurrentAnimation(["a", "b", "c", "d"][Math.floor(Math.random() * 4)]);

        this.state = "full";

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
        console.log("ate");
        if (this.state === "full") {
            game.data.messages.push("you stole some food!");
            this.state = "empty";
            // set touch animation
            this.renderable.setCurrentAnimation("empty");
            // make it flicker
            //this.renderable.flicker(75);

            me.audio.play("Food Get", false, this.eatFood(), .5);


            game.data.food = 100;


            return false;

        }
        game.data.messages.push("the plate was empty :(");

    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (/*response, other*/) {
        // Make all other objects solid
        return false;
    },

    eatFood : function() {
        me.audio.play("Crunch 2", true, null, 0.7);
        setTimeout(function() {
            me.audio.stop("Crunch 2")
        }, 3500);
    }
});

