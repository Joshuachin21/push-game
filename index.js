var Gpio = require('onoff').Gpio;

var button = new Gpio(4, 'in', 'falling', {
    debounceTimeout : 50
});



var button2 = new Gpio(26, 'in', 'falling', {
    debounceTimeout : 50
});


var count1 = 0;
button.watch(function(err, value) {
    if (err) {
        throw err;
    }

    if(value === 0){
        console.log('P1 clicked!');
        count1 += 1;
    }

    //led.writeSync(value);
});


var count2 = 0;
button2.watch(function(err, value) {
    if (err) {
        throw err;
    }

    if(value === 0){
        console.log('P2 clicked!');
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

    console.log('====================================================');

    console.log('Player 1 -------------------------- ' + count1 + ' clicks!');
    console.log('Player 2 -------------------------- ' + count2 + ' clicks!');
}, 10000);