game.data = game.data || {};
game.utils = game.utils || {};

game.PlayScreen = me.Stage.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {

        // disable gravity
        me.sys.gravity = 0;

        // load a level
        me.levelDirector.loadLevel("isometric");

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        
        //don't ask
        assmuchie = 1 

        game.data.urine = 0;
        game.data.food = 100;
        game.data.suspicion = 0;
        game.data.panic = false;
        game.data.momsus = false;
        game.data.sonsus = false;
        game.data.sussus = false;
        game.data.messages = ["", "", ""];
        game.data.newsmain = "STRANGER FOUND\n LIVING IN HOUSE"
        game.data.newsreel = "     FAMILY TRAUMATIZED --";
        game.data.night = false;
        game.data.days = 0;
        game.data.fadeduration = 1.0;
        game.data.fadecurrent = 0.0;
        game.data.fadeoutpanic = false;
        game.data.fadeouttheme = false;
        game.data.fadeoutday = false;
        game.data.fadeoutnight = false;
        game.data.fadein = false;
        game.utils.lerp = function (p0, p1, t) {
            return p0 * (1 - t) + p1 * t;
        }
        var intro_message_i = 0;
        setTimeout(intro_message, 1500);
        function intro_message() {
            var intro_messages = ["survive in this family's home",
                                  "don't let them notice you",
                                  "use arrow keys to move",
                                  "click on items to interact"
                                  ];

            game.data.messages.push(intro_messages[intro_message_i++])
            if(intro_message_i < 4){
              setTimeout(intro_message, 2000)
            }
        }

        game.data.tid = me.timer.setInterval(() => {this.nighttime(this.HUD)} , 30000);

        me.audio.stop("Start Theme");
        me.audio.play("Gameplay Theme (Day)", true, null, 0.3);
        me.audio.play("Panic Theme", true, null, 0.3);
        me.audio.mute("Panic Theme");

        // display a basic tile selector
        me.game.world.addChild(new (me.Renderable.extend({
            /** Constructor */
            init: function() {
                // reference to the main layer
                this.refLayer = me.game.world.getChildByName("level 1")[0];

                // call the parent constructor using the tile size
                this._super(me.Renderable, 'init', [ 0, 0,
                    this.refLayer.tilewidth / 2,
                    this.refLayer.tileheight
                ]);

                this.anchorPoint.set(0, 0);

                // configure it as floating
                this.floating = true;

                // create a corresponding diamond polygon shape with an isometric projection
                this.diamondShape = this.clone().toPolygon().toIso();

                // currently selected tile
                this.currentTile = null;

                // simple font to display tile coordinates
                this.font = new me.Font("Arial", 10, "#FF00FF");
                this.font.textAlign = "center";

                // dirty flag to enable/disable redraw
                this.dirty = false;

                this.isKinematic = false;

                // subscribe to pointer and viewport move event
                this.pointerEvent = me.event.subscribe("pointermove", this.pointerMove.bind(this));
                this.viewportEvent = me.event.subscribe(me.event.VIEWPORT_ONCHANGE, this.viewportMove.bind(this));
            },
            /** pointer move event callback */
            pointerMove : function (event) {
                var tile = this.refLayer.getTile(event.gameWorldX, event.gameWorldY);
                if (tile && tile !== this.currentTile) {
                    // get the tile x/y world isometric coordinates
                    this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row, this.diamondShape.pos);
                    // convert thhe diamon shape pos to floating coordinates
                    me.game.viewport.worldToLocal(
                        this.diamondShape.pos.x,
                        this.diamondShape.pos.y,
                        this.diamondShape.pos
                    );
                    // store the current tile
                    this.currentTile = tile;
                };
            },
            /** viewport move event callback */
            viewportMove : function (pos) {
                // invalidate the current tile when the viewport is moved
                this.currentTile = null;
            },
            /** Update function */
            update : function (dt) {
                ;
                if (game.data.fadeouttheme) {
                    game.data.fadecurrent += dt/1000.0;
                    var gvolume = game.utils.lerp(0.0, 1.0, game.data.fadeduration - game.data.fadecurrent);
                    me.audio.setVolume(gvolume);
                    if (game.data.fadecurrent >= game.data.fadeduration) {
                        me.audio.mute("Gameplay Theme (Day)");
                        me.audio.mute("Gameplay Theme (Night)");
                        me.audio.unmute("Panic Theme");
                        game.data.fadecurrent = 0.0;
                        game.data.fadeouttheme = false;
                        game.data.fadein = true;
                    }
                } else if (game.data.fadeoutpanic) {
                    game.data.fadecurrent += dt/1000.0;
                    var gvolume = game.utils.lerp(0.0, 1.0, game.data.fadeduration - game.data.fadecurrent);
                    me.audio.setVolume(gvolume);
                    if (game.data.fadecurrent >= game.data.fadeduration) {
                        me.audio.unmute("Gameplay Theme (Day)");
                        me.audio.unmute("Gameplay Theme (Night)");
                        me.audio.mute("Panic Theme");
                        game.data.fadecurrent = 0.0;
                        game.data.fadeoutpanic = false;
                        game.data.fadein = true;
                    }
                } else if (game.data.fadeoutday) {
                    game.data.fadecurrent += dt/1000.0;
                    var gvolume = game.utils.lerp(0.0, 1.0, game.data.fadeduration - game.data.fadecurrent);
                    me.audio.setVolume(gvolume);
                    if (game.data.fadecurrent >= game.data.fadeduration) {
                        me.audio.stop("Gameplay Theme (Day)");
                        me.audio.play("Gameplay Theme (Night)", true, null, .5);
                        game.data.fadecurrent = 0.0;
                        game.data.fadeoutday = false;
                        game.data.fadein = true;
                    }
                } else if (game.data.fadeoutnight) {
                    game.data.fadecurrent += dt/1000.0;
                    var gvolume = game.utils.lerp(0.0, 1.0, game.data.fadeduration - game.data.fadecurrent);
                    me.audio.setVolume(gvolume);
                    if (game.data.fadecurrent >= game.data.fadeduration) {
                        me.audio.stop("Gameplay Theme (Night)");
                        me.audio.play("Gameplay Theme (Day)", true, null, .5);
                        game.data.fadecurrent = 0.0;
                        game.data.fadeoutnight = false;
                        game.data.fadein = true;
                    }
                } else if (game.data.fadein) {
                    game.data.fadecurrent += dt/1000.0;
                    var gvolume = game.utils.lerp(1.0, 0.0, game.data.fadeduration - game.data.fadecurrent);
                    me.audio.setVolume(gvolume);
                    if (game.data.fadecurrent >= game.data.fadeduration) {
                        game.data.fadecurrent = 0.0;
                        game.data.fadein = false;
                    }
                }
                return (typeof(this.currentTile) === "object")
            },
            /** draw function */
            draw: function(renderer) {
                if (this.currentTile) {
                    // draw our diamond shape
                    renderer.save();
                    renderer.setColor("#FF0000");
                    renderer.stroke(this.diamondShape);

                    renderer.setColor("#FFFFFF");
                    // draw the tile col/row in the middle
                    this.font.draw (
                        renderer,
                        "( " + this.currentTile.col + "/" + this.currentTile.row + " )",
                        this.diamondShape.pos.x,
                        (this.diamondShape.pos.y + (this.currentTile.height / 2) - 8)
                    );
                    renderer.restore();
                }
            }
        })));

        // register on mouse event
        me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
            me.event.publish("pointermove", [ event ]);
        }, false);
    },

    /**
     *  action to perform on state change
     */
    onDestroyEvent: function() {
        // unsubscribe to all events
        me.game.world.removeChild(this.HUD);
        me.timer.clearInterval(game.data.tid);
        //me.event.unsubscribe(this.pointerEvent);
        //me.event.unsubscribe(this.viewportEvent);
        me.input.releasePointerEvent("pointermove", me.game.viewport);
    },

    nighttime : function(HUD){
        game.data.night = !game.data.night;
        if(game.data.night){
            HUD.nightSprite.alpha = 1;
            game.data.fadeoutday = true;
            // me.audio.stop("Gameplay Theme (Day)");
            // me.audio.play("Gameplay Theme (Night)", true, null, 0.3);
        }else{
            game.data.days++;
            HUD.nightSprite.alpha = 0;
            game.data.fadeoutnight = true;
            // me.audio.stop("Gameplay Theme (Night)");
            // me.audio.play("Gameplay Theme (Day)", true, null, .5);
        }
    }
});
