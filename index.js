var Gpio = require('onoff').Gpio,
    button = new Gpio(4, 'in', 'falling', {
        debounceTimeout : 50
    }),
    button2 = new Gpio(17, 'in', 'falling', {
        debounceTimeout : 50
    });


var count1 = 0;
button.watch(function (err, value) {
    if (err) {
        throw err;
    }

    if(value === 0){
        count1 += 1;
    }

    //led.writeSync(value);
});

var count2 = 0;
button2.watch(function (err2, value2) {
    if (err2) {
        throw err2;
    }
console.log(value2);
    if(value2 === 0){
        count2 += 1;
    }

    //led.writeSync(value);
});

process.on('SIGINT', function () {
    button.unexport();
    button2.unexport();
});
/*
setInterval(function(){
    console.log('Player 1 scores:' + count1);
    console.log('Player 2 scores:' + count2);
}, 2000);*/

setInterval(function(){
    if(count1>count2){
        console.log('Player 1 is winning by ' + (count1 - count2) + ' clicks!');
    }
    else if(count2>count1){
        console.log('Player 2 is winning by ' + (count2 - count1) + ' clicks!');
    }
    else{
        console.log('it\'s a tie?!');
    }
}, 10000);