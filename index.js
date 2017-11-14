var Gpio = require('onoff').Gpio,
    led = new Gpio(17, 'out'),
    button = new Gpio(4, 'in', 'both');

button.watch(function (err, value) {
    if (err) {
        throw err;
    }
console.log('button pushed');
    console.log(value);
    led.writeSync(value);
});

process.on('SIGINT', function () {
    led.unexport();
    button.unexport();
});