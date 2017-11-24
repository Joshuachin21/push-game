var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var Team1Player1 = new Gpio(4, 'in', 'falling', {
    debounceTimeout: 50
});
var Team2Player1 = new Gpio(17, 'in', 'falling', {
    debounceTimeout: 50
});

var rand = 0;
http.listen(8080); //listen to port 8080

var gameStates = [
    'menu',
    'starting',
    'play',
    'finished',
    'results',
    'playAgain',
    'hallOfFame'
];

var currentGameSettings = {
    state: 'menu',
    timer: 30
};

//game start with full gameState Object to run it.

function handler(req, res) { //create server
    fs.readFile(__dirname + '/public/index.html', function (err, data) { //read file index.html in public folder
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
        res.write(data); //write data from index.html
        return res.end();
    });
}

//All Socket Commands

io.sockets.on('connection', function (socket) {// WebSocket Connection

    var startGame = function (gameSettings) {
        currentGameSettings = gameSettings;
        //game loop
        //endgame scenario
        //start finished

    };

    var lightvalue = 0; //static variable for current status

    //PUSH TO CLIENT || HARDWARE READ
    Team1Player1.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }


        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('P1 clicked!');
                count1 += 1;
            }
        }


    });


    Team2Player1.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }
        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('P2 clicked!');
                count2 += 1;
            }
        }
    });


    //READ FROM CLIENT
    socket.on('light', function (data) { //get light switch status from client
        lightvalue = data;
        if (lightvalue != LED.readSync()) { //only change LED if status has changed
            console.log('changed light switch pi');

            rand = 11919191498 + Date.now();
            setTimeout(function () {
                socket.emit('score', rand);
            }, 1000);
            LED.writeSync(lightvalue); //turn LED on or off
        }
    });

    socket.on('start', function (data) { //get light switch status from client

        if (data.gameState === 'menu') { //only change LED if status has changed
            //init countdown for gameStart
            console.log('start button pressed');
            rand = 11919191498 + Date.now();

            data.state = 'starting';
            data.score = rand;
            data.countDown = 3;
            socket.emit('starting', data);
            var countdown = setInterval(function () {
                data.countDown -= 1;
                if (data.countDown === 0) {
                    socket.emit('start', data);
                    clearInterval(this);
                    data.state = 'play';
                    startGame(data);
                }
                else {
                    socket.emit('starting', data);
                }
            }, 1000);


        }
    });


});

process.on('SIGINT', function () { //on ctrl+c
    LED.writeSync(0); // Turn LED off
    LED.unexport(); // Unexport LED GPIO to free resources
    pushButton.unexport(); // Unexport Button GPIO to free resources
    process.exit(); //exit completely
});