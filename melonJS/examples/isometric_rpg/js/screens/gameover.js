game.GameOverScreen = me.ScreenObject.extend({
    /**
     * action to perform on state change
     */
    onResetEvent : function () {
      this.EndScreen = new game.EndScreen.Container();
      me.game.world.addChild(this.EndScreen);

      // change to play state on press Enter or click/tap
      me.input.bindKey(me.input.KEY.ENTER, "enter", true);
      me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
      this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
        if (action === "enter") {
          // play something on tap / enter
          // this will unlock audio on mobile devices
          me.state.change(me.state.START);
        }
      });
    },
  
    /**
     * action to perform when leaving this screen (state change)
     */
    onDestroyEvent : function () {
      me.input.unbindKey(me.input.KEY.ENTER);
      me.input.unbindPointer(me.input.pointer.LEFT);
      me.event.unsubscribe(this.handler);
    }
  });
