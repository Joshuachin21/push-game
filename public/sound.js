var soundplayer = require("sound-player");
var options = {
    filename: "/home/pi/Music/sf3sound/20H.wav",
    gain: 100,
    debug: true,
    player: "aplay", // "afplay" "aplay" "mpg123" "mpg321"
    device: "plughw:0,0"   //
}

var player = new soundplayer(options)
player.play();

player.on('complete', function() {
    console.log('Done with playback!');
});

player.on('error', function(err) {
    console.log('Error occurred:', err);
});