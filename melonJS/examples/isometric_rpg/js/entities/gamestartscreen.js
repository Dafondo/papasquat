/**
 * a HUD container and child items
 */
game.StartScreen = game.StartScreen || {};

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
    // scale to match the container size
}})