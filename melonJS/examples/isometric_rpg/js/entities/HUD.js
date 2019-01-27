/**
 * a HUD container and child items
 */
game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
  init: function () {
    // call the constructor
    this._super(me.Container, 'init');

    // persistent across level change
    this.isPersistent = true;

    // make sure we use screen coordinates
    this.floating = true;

    // give a name
    this.name = "HUD";

    // add our child score object
    var texture =  new me.video.renderer.Texture(
            { framewidth: 800, frameheight: 130 },
            me.loader.getImage("NEWS-BOX")
        );
    this.panelSprite = texture.createSpriteFromName(0);
    this.panelSprite.anchorPoint.set(0, -3.6);
    // scale to match the container size

    var nightTexture =  new me.video.renderer.Texture(
      { framewidth: 800, frameheight: 600 },
        me.loader.getImage("NIGHT")
    );

    this.nightSprite = nightTexture.createSpriteFromName(0);
    this.nightSprite.anchorPoint.set(0, 0);
    // scale to match the container size
    
    this.addChild(this.nightSprite);
    this.nightSprite.alpha = 0;
    this.addChild(this.panelSprite);
    this.addChild(new game.HUD.ScoreItem(-90, 10));
  }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend( {
  /**
   * constructor
   */
  init : function (x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 90, 10]);

    // create the font object
    this.font = new me.Font("Arial", 26, "#330033");
    this.peeFont = new me.Font("Arial", 26, "#826800");
    this.susFont = new me.Font("Arial", 26, "#820000");

    // font alignment to right, bottom
    this.font.textAlign = "right";
    this.font.textBaseline = "bottom";
    this.peeFont.textAlign = "right";
    this.peeFont.textBaseline = "bottom";
    this.susFont.textAlign = "right";
    this.susFont.textBaseline = "bottom";

    // local copy of the global score
    this.urine = -1;
    this.food = -1;
    this.suspicion = -1;
  },

  /**
   * update function
   */
  update : function (dt) {
    // we don't draw anything fancy here, so just
    // return true if the score has been updated
    var changed = false;
    if (this.urine !== game.data.urine) {
      this.urine = game.data.urine;
      changed = true;
    }

    if (this.food !== game.data.food) {
      this.food = game.data.food;
      changed = true;
    }

    if (this.suspicion !== game.data.suspicion) {
        this.suspicion = game.data.suspicion;
        changed = true;
    }
    return changed;
  },

  /**
   * draw the score
   */
  draw : function (renderer) {
        //renderer.fill(me.Rect(me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y,  -this.pos.x, -this.pos.y));
        // this.pos.x, this.pos.y are the relative position from the screen right bottom
        this.font.draw (renderer, "FOOD: " + Math.round(game.data.food), me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y - 90);
        this.peeFont.draw (renderer, "URINE: " + Math.round(game.data.urine), me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y - 60);
        this.susFont.draw (renderer, "SUSPICION: " + Math.round(game.data.suspicion), me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y - 30);


        //Notifications counter for immediate suspicion and urine counts
		this.font.draw (renderer, game.data.messages[game.data.messages.length - 3], me.game.viewport.width + this.pos.x - 300, me.game.viewport.height + this.pos.y - 90)
        this.font.draw (renderer, game.data.messages[game.data.messages.length - 2], me.game.viewport.width + this.pos.x - 300, me.game.viewport.height + this.pos.y - 60)
        this.font.draw (renderer, game.data.messages[game.data.messages.length - 1], me.game.viewport.width + this.pos.x - 300, me.game.viewport.height + this.pos.y - 30)
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
