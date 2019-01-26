
/* Game namespace */
var game = {
    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(1024, 768, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // switch to the Play Screen.
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.change(me.state.PLAY);
    }
};
