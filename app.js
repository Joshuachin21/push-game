var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http); //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var Team1Player1 = new Gpio(4, 'in', 'falling', {
    debounceTimeout: 100
});
var Team1Player2 = new Gpio(17, 'in', 'falling', {
    debounceTimeout: 100
});
var Team1Player3 = new Gpio(22, 'in', 'falling', {
    debounceTimeout: 100
});

var Team2Player1 = new Gpio(18, 'in', 'falling', {
    debounceTimeout: 100
});
var Team2Player1 = new Gpio(23, 'in', 'falling', {
    debounceTimeout: 100
});
var Team2Player1 = new Gpio(6, 'in', 'falling', {
    debounceTimeout: 100
});

const MODE = 'live';
var rand = 0;
http.listen(8080); //listen to port 8080
console.log('listening on 8080');

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
        console.log('GAME STARTED!!!!');


        currentGameSettings.p1score = 0;
        currentGameSettings.p2score = 0;
        if (MODE && MODE === 'demo') {
            var p1loop = setInterval(function () {

                currentGameSettings.p1score += Math.floor(Math.random() * 8) + 1;
            }, 100);

            var p2loop = setInterval(function () {

                currentGameSettings.p2score += Math.floor(Math.random() * 6) + 1;
            }, 100);
        }
        var gameLoop = setInterval(function () {

            var winningDiff = 100;
            var diff = Math.abs(currentGameSettings.p1score - currentGameSettings.p2score);
            var players = 2;
            var totalScores = currentGameSettings.p1score + currentGameSettings.p2score;
            currentGameSettings.team1Progress = 100 - ((currentGameSettings.p1score / totalScores) * 100);
            currentGameSettings.team2Progress = 100 - ((currentGameSettings.p2score / totalScores) * 100);
            currentGameSettings.team2Progress = (currentGameSettings.p2score - currentGameSettings.p1score) < 0 ? (100 - ((diff / winningDiff) * 100)) / players : (100 + ((diff / winningDiff) * 100)) / players;
            currentGameSettings.team1Progress = (currentGameSettings.p1score - currentGameSettings.p2score) < 0 ? (100 - ((diff / winningDiff) * 100)) / players : (100 + ((diff / winningDiff) * 100)) / players;

            socket.emit('start', currentGameSettings);
            if (Math.abs(currentGameSettings.p1score - currentGameSettings.p2score) >= winningDiff) {
                clearInterval(this);
                if (MODE && MODE === 'demo') {
                    clearInterval(p1loop);
                    clearInterval(p2loop);
                }
                currentGameSettings.state = 'finished';
                currentGameSettings.winner = {
                    name: currentGameSettings.p1score > currentGameSettings.p2score ? 'Player 1' : 'Player 2'
                };

                socket.emit('finished', currentGameSettings);

            }
        }, 100);

        //socket.emit('start', currentGameSettings);

        //game loop
        //endgame scenario
        //start finished

    };

    var continueGame = function (gameSettings) {

        currentGameSettings = gameSettings;
        console.log('GAME STARTED!!!!');


        currentGameSettings.p1score = 0;
        currentGameSettings.p2score = 0;
        if (MODE && MODE === 'demo') {
            var p1loop = setInterval(function () {

                currentGameSettings.p1score += Math.floor(Math.random() * 8) + 1;
            }, 100);

            var p2loop = setInterval(function () {

                currentGameSettings.p2score += Math.floor(Math.random() * 6) + 1;
            }, 100);
        }
        var gameLoop = setInterval(function () {

            var winningDiff = 100;
            var diff = Math.abs(currentGameSettings.p1score - currentGameSettings.p2score);
            var players = 2;
            var totalScores = currentGameSettings.p1score + currentGameSettings.p2score;
            currentGameSettings.team1Progress = 100 - ((currentGameSettings.p1score / totalScores) * 100);
            currentGameSettings.team2Progress = 100 - ((currentGameSettings.p2score / totalScores) * 100);
            currentGameSettings.team2Progress = (currentGameSettings.p2score - currentGameSettings.p1score) < 0 ? (100 - ((diff / winningDiff) * 100)) / players : (100 + ((diff / winningDiff) * 100)) / players;
            currentGameSettings.team1Progress = (currentGameSettings.p1score - currentGameSettings.p2score) < 0 ? (100 - ((diff / winningDiff) * 100)) / players : (100 + ((diff / winningDiff) * 100)) / players;

            socket.emit('start', currentGameSettings);
            if (Math.abs(currentGameSettings.p1score - currentGameSettings.p2score) >= winningDiff) {
                clearInterval(this);
                if (MODE && MODE === 'demo') {
                    clearInterval(p1loop);
                    clearInterval(p2loop);
                }
                currentGameSettings.state = 'finished';
                currentGameSettings.winner = {
                    name: currentGameSettings.p1score > currentGameSettings.p2score ? 'Player 1' : 'Player 2'
                };

                socket.emit('finished', currentGameSettings);

            }
        }, 100);

        //socket.emit('start', currentGameSettings);

        //game loop
        //endgame scenario
        //start finished

    };

    var lightvalue = 0; //static variable for current status

    //PUSH TO CLIENT || HARDWARE READ


    Team1Player1.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        console.log('clicked 1 - 1');
        console.log(value);
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }

        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('1 - P1 clicked!');
                currentGameSettings.p1score += 1;
            }
        }

    });

    Team1Player2.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        console.log('clicked 1 - 2');
        console.log(value);
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }

        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('1 - P2 clicked!');
                currentGameSettings.p1score += 1;
            }
        }

    });

    Team1Player3.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        console.log('clicked 1 - 3');
        console.log(value);
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }

        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('1 - P3 clicked!');
                currentGameSettings.p1score += 1;
            }
        }

    });


    Team2Player1.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        console.log('clicked 2 - 1');
        console.log(value);
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }
        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('2 - P1 clicked!');
                currentGameSettings.p2score += 1;
            }
        }
    });

    Team2Player2.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        console.log('clicked 2 - 2');
        console.log(value);
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }
        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('2 - P2 clicked!');
                currentGameSettings.p2score += 1;
            }
        }
    });

    Team2Player3.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        console.log('clicked 2 - 3');
        console.log(value);
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }
        if (currentGameSettings.state === 'play') {
            if (value === 0) {
                console.log('2 - P3 clicked!');
                currentGameSettings.p2score += 1;
            }
        }
    });


    //READ FROM CLIENT
    socket.on('light', function (data) { //get light switch status from client
        lightvalue = data;
        console.log('changed light switch pi');

        rand = 11919191498 + Date.now();
        setTimeout(function () {
            socket.emit('score', rand);
        }, 1000);
    });

    socket.on('p1button', function (data) { //get light switch status from client

        if (currentGameSettings.state === 'play') {

            console.log('P1 clicked! REMOTE');
            currentGameSettings.p1score += 1;

        }
    });

    socket.on('p2button', function (data) { //get light switch status from client

        if (currentGameSettings.state === 'play') {

            console.log('P2 clicked! REMOTE');
            currentGameSettings.p2score += 1;

        }
    });

    socket.on('checkGame', function (data) { //get light switch status from client

        socket.emit('checkGame', currentGameSettings);

    });

    socket.on('continueGame', function (data) { //get light switch status from client
        continueGame(currentGameSettings);


    });


    socket.on('start', function (data) { //get light switch status from client
        console.log('read "start"');

        if (data.state === 'menu') { //only change LED if status has changed
            //init countdown for gameStart
            console.log('start button pressed');
            rand = 11919191498 + Date.now();

            data.state = 'starting';
            data.score = rand;
            data.countDown = 'Get Ready!';
            socket.emit('starting', data);
            data.countDown = 3;
            var countdown = setInterval(function () {

                if (data.countDown === 0) {

                    data.countDown = 'Go!';
                    data.state = 'play';
                    socket.emit('start', data);
                    clearInterval(this);
                    console.log(data);
                    startGame(data);
                }
                else {
                    console.log(data.countDown);
                    socket.emit('starting', data);
                }
                data.countDown -= 1;
            }, 1000);


        }
    });


});

process.on('SIGINT', function () { //on ctrl+c
    Team1Player1.unexport(); // Unexport LED GPIO to free resources
    Team2Player1.unexport(); // Unexport Button GPIO to free resources
    process.exit(); //exit completely
});