/**
 * a HUD container and child items
 */
game.EndScreen = game.EndScreen || {};

var hapeprere = "false";

game.EndScreen.Container = me.Container.extend({
  init: function () {
    console.log("only once")
    // call the constructor
    this._super(me.Container, 'init');

    // persistent across level change
    this.isPersistent = false;

    // make sure we use screen coordinates
    this.floating = true;

    // give a name
    this.name = "EndScreen";

    // add our child score object


    var texture =  new me.video.renderer.Texture(
            { framewidth: 800, frameheight: 600 },
            me.loader.getImage("END-SCREEN")
        );
    this.panelSprite = texture.createSpriteFromName(0);
    this.panelSprite.anchorPoint.set(0, 0);
    // scale to match the container size

    this.addChild(this.panelSprite);
    this.addChild(new game.EndScreen.NewsItem(-90, -10));
    me.audio.stop("Gameplay Theme (Day)");
    me.audio.stop("Gameplay Theme (Night)")

    if (hapeprere == "false"){
        hapeprere = "horse";
        game.data.newsreel = game.data.newsreel + " SQUATTER LIVED IN HOME FOR " + game.data.days + " DAYS --"
        
        me.audio.stop("Panic Theme");
        me.audio.play("BREAKING NEWS", false, null, .5);
        
        setTimeout(function() {me.audio.play("Bitcrushed PSA", false, null, .8)}, 1500);
        setTimeout(function() {hapeprere = "false"}, 3000);
    }   
  } 


});


/**
 * a basic HUD item to display score
 */
game.EndScreen.NewsItem = me.Renderable.extend( {
  /**
   * constructor
   */
  init : function (x, y) {
    this.offset = 0;
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 90, 10]);

    // create the font object
    this.font = new me.Font("Arial", 30, "#000000");

    // font alignment to right, bottom
    this.font.textAlign = "left";
    this.font.textBaseline = "bottom";


  },

  /**
   * update function
   */
  update : function (dt) {
    // we don't draw anything fancy here, so just
    // return true if the score has been updated
    this.offset -= 2.5
    return true;
  },

  /**
   * draw the score
   */
  draw : function (renderer) {
        //renderer.fill(me.Rect(me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y,  -this.pos.x, -this.pos.y));
        // this.pos.x, this.pos.y are the relative position from the screen right bottom
		this.font.draw (renderer, game.data.newsmain, me.game.viewport.width + this.pos.x - 300, me.game.viewport.height + this.pos.y - 150)
		this.font.draw (renderer, game.data.newsreel, me.game.viewport.width + this.pos.x + this.offset, me.game.viewport.height + this.pos.y - 60)
  }
});

