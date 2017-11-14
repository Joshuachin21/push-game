var Gpio = require('onoff').Gpio,
    led = new Gpio(17, 'out'),
    button = new Gpio(4, 'in', 'falling', {
        debounceTimeout : 50
    });
var count = 0;
button.watch(function (err, value) {
    if (err) {
        throw err;
    }

    if(value === 0){
        count += 1;
        console.log(count);
    }

    //led.writeSync(value);
});

process.on('SIGINT', function () {
    led.unexport();
    button.unexport();
});