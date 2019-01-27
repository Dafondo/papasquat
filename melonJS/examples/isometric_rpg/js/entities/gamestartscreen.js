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
    me.audio.stop("BREAKING NEWS");
    me.audio.stop("Bitcrushed PSA");
    me.audio.unmute("Bitcrushed Footstep");
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

// Lorem ipsum dolor sit amet,
// consectetur adipiscing elit,
// sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
// Libero nunc consequat interdum varius sit amet mattis vulputate enim.
// Luctus accumsan tortor posuere ac. Faucibus nisl tincidunt eget nullam.
// Quam lacus suspendisse faucibus interdum posuere lorem.
// Natoque penatibus et magnis dis.
// Eget aliquet nibh praesent tristique magna.
// Nec nam aliquam sem et tortor consequat id.
// Amet cursus sit amet dictum sit.
// Ultrices tincidunt arcu non sodales.
// A iaculis at erat pellentesque adipiscing commodo elit at imperdiet.

// Ornare massa eget egestas purus viverra.
// Netus et malesuada fames ac turpis egestas integer eget aliquet.
// At volutpat diam ut venenatis.
// Ornare lectus sit amet est placerat in egestas erat.
// Sed lectus vestibulum mattis ullamcorper.
// Velit egestas dui id ornare arcu odio ut.
// Turpis egestas maecenas pharetra convallis posuere morbi.
// Vitae tempus quam pellentesque nec nam.
// Feugiat nisl pretium fusce id velit ut tortor.
// Ac turpis egestas sed tempus.

// Pharetra vel turpis nunc eget.
// Rhoncus dolor purus non enim praesent elementum facilisis.
// Nec ultrices dui sapien eget mi proin.
// Laoreet non curabitur gravida arcu ac tortor.
// Pellentesque pulvinar pellentesque habitant morbi. 
// aculis eu non diam phasellus vestibulum lorem.
// Viverra tellus in hac habitasse platea dictumst.
// Iaculis urna id volutpat lacus laoreet non curabitur gravida arcu.
// Ullamcorper velit sed ullamcorper morbi tincidunt ornare.
// Porttitor massa id neque aliquam vestibulum morbi blandit cursus.
// Fringilla est ullamcorper eget nulla facilisi.
// Ultricies mi eget mauris pharetra.
// Odio aenean sed adipiscing diam donec adipiscing tristique risus nec.
// Sed arcu non odio euismod lacinia.
// Odio pellentesque diam volutpat commodo sed egestas egestas.

// Dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu.
// Massa enim nec dui nunc mattis enim ut.
// Aliquam sem fringilla ut morbi tincidunt augue interdum velit.
// Eu feugiat pretium nibh ipsum consequat nisl vel.
// Justo laoreet sit amet cursus sit.
// In ornare quam viverra orci sagittis eu.
// Sit amet porttitor eget dolor morbi non.
// Adipiscing vitae proin sagittis nisl rhoncus.
// Nam libero justo laoreet sit amet cursus sit amet dictum.
// Justo eget magna fermentum iaculis eu non diam.

// Ipsum dolor sit amet consectetur adipiscing elit.
// Id consectetur purus ut faucibus pulvinar elementum.
// Cras fermentum odio eu feugiat.
// Nibh cras pulvinar mattis nunc sed blandit libero volutpat.
// Nec ultrices dui sapien eget mi proin.
// Odio euismod lacinia at quis risus sed vulputate odio ut.
// Urna cursus eget nunc scelerisque viverra mauris in.
// Pretium viverra suspendisse potenti nullam ac.
// Semper risus in hendrerit gravida.
// Ultrices mi tempus imperdiet nulla malesuada.
// Diam maecenas sed enim ut sem viverra.
// Massa tincidunt nunc pulvinar sapien.
// Id semper risus in hendrerit gravida rutrum.
// Ac turpis egestas maecenas pharetra.
// Ut ornare lectus sit amet est placerat.
// Vitae tortor condimentum lacinia quis vel eros.
// Varius duis at consectetur lorem.
// Orci nulla pellentesque dignissim enim sit amet venenatis urna.
// Leo vel fringilla est ullamcorper.
// Purus ut faucibus pulvinar elementum integer enim neque volutpat ac.