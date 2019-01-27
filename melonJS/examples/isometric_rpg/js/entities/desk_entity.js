
/************************************************************************************/
/*                                                                                  */
/*        a desk entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.DeskEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        
        this._super(me.Entity, "init", [x, y , {width:90, height:60}]);
        this.body.collisionType = game.collisionTypes.PLANT;

        
        var texture =  new me.video.renderer.Texture(
            { framewidth: 128, frameheight: 128 },
            me.loader.getImage("desk")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName(Array(50).fill(1).map(function(a, b, c) { return b}));
        // define an additional basic walking animation
        
        this.renderable.addAnimation ("empty", [49]);
        this.renderable.addAnimation ("full", [48]);
        this.renderable.addAnimation ("get in", Array(50).fill(1).map(function(a, b, c) { return b}));
        this.renderable.addAnimation ("get out", Array(50).fill(1).map(function(a, b, c) { return 49 - b}));

        this.renderable.setCurrentAnimation(["empty"]);
        
        this.state = "empty";

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, .7);
        
        me.input.registerPointerEvent("pointerdown", this, this.onMouseDown.bind(this));
        me.input.registerPointerEvent("pointerenter", this, this.onMouseEnter.bind(this));
        me.input.registerPointerEvent("pointerleave", this, this.onMouseLeave.bind(this));
        
    },
    onMouseEnter : function() {
    
        console.log("enter")
        document.body.style.cursor = 'pointer';
        return false;
    },
    onMouseLeave : function() {
    
        console.log("leave")
        document.body.style.cursor = 'default';
        return true;
    },
    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        this._super(me.Entity, "update", [dt]);
        
    },
    
    onMouseDown : function() {
    
        if(Math.pow(Math.pow(this.pos.x - game.data.player.pos.x, 2) + 
           Math.pow(this.pos.y - game.data.player.pos.y, 2), .5) > 120){
           game.data.messages.push("too far to interact");
           return false;
        }
        
        console.log("clicked");
        if (this.state === "empty") {
            game.data.messages.push("you hid under the desk");
            this.state = "transition";
            // set touch animation
            this.renderable.setCurrentAnimation("get in");
            game.data.player.renderable.setOpacity(0)
            game.data.player.pos.x = this.pos.x
            game.data.player.pos.y = this.pos.y
           
            //me.audio.play("Cabinet Open", false, null, .5);
            var that = this
            setTimeout(function() {
                that.renderable.setCurrentAnimation("full");
                that.state = "full"
            }, 4700);

           
            return false;

        }
        if (this.state === "full") {
            this.state = "empty";
            // set touch animation
            this.renderable.setCurrentAnimation("get out");
            // make it flicker
            //this.renderable.flicker(75);
            
            //me.audio.play("Cabinet Close", false, null, .5);
            var that = this
            setTimeout(function() {
                game.data.messages.push("you left the desk");
                that.renderable.setCurrentAnimation("empty");
                that.state = "empty"
                game.data.player.pos.x = that.pos.x + 124;
                game.data.player.pos.y = that.pos.y + 24;
                game.data.player.renderable.setOpacity(1)
            }, 4700);
            


           
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

