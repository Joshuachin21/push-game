var Gpio = require('onoff').Gpio;

    button2 = new Gpio(26, 'in', 'falling', {
        debounceTimeout : 50
    });



var count2 = 0;
button2.watch(function (err2, value2) {
    if (err2) {
        throw err2;
    }
    if(value2 === 0){
        console.log('P2 clicked!');
        count2 += 1;
    }

    //led.writeSync(value);
});

process.on('SIGINT', function () {
    button2.unexport();
});
/*
setInterval(function(){
    console.log('Player 1 scores:' + count1);
    console.log('Player 2 scores:' + count2);
}, 2000);*/
