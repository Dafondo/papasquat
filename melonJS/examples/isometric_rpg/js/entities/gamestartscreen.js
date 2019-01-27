/**
 * a HUD container and child items
 */
game.StartScreen = game.StartScreen || {};

var enterino = true;
game.StartScreen.Container = me.Container.extend({
  init: function () {
    // call the constructor
    this._super(me.Container, 'init');

    // persistent across level change
    this.isPersistent = false;

    // make sure we use screen coordinates
    this.floating = true;

    // give a name
    this.name = "StartScreen";

    // add our child score object

    var texture =  new me.video.renderer.Texture(
            { framewidth: 800, frameheight: 600 },
            me.loader.getImage("START-SCREEN")
        );
    this.panelSprite = texture.createSpriteFromName(0);
    this.panelSprite.anchorPoint.set(0, 0);
    this.addChild(this.panelSprite)
    this.addChild(new game.StartScreen.PressEnter(-90, -10));
    // scale to match the container size

    me.audio.play("Game Start", false, null, 0.3);
    me.audio.play("Start Theme", true, null, 0.3);
}})


game.StartScreen.PressEnter = me.Renderable.extend( {
  /**
   * constructor
   */
  init : function (x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 90, 10]);

    // create the font object
    this.font = new me.Font("Arial", 30, "#000000");

    // font alignment to right, bottom
    this.font.textAlign = "right";
    this.font.textBaseline = "bottom";



    // local copy of the global score

  },

  /**
   * update function
   */
  update : function (dt) {
    return true;
  },

  /**
   * draw the score
   */
  draw : function (renderer) {
        if(enterino){
		this.font.draw (renderer, "PRESS ENTER", me.game.viewport.width + this.pos.x - Math.random() * 3, me.game.viewport.height + this.pos.y - Math.random() * 3);
		}
  }
});
