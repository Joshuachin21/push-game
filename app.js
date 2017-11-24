var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var Team1Player1 = new Gpio(4, 'in', 'falling'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var Team1Player2 = new Gpio(17, 'in', 'falling'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

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

var gameSettings = {
    state:'menu',
    timer:30
};

//game start with full gameState Object to run it.

function handler (req, res) { //create server
    fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
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


    var lightvalue = 0; //static variable for current status
    pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        if (err) { //if an error
            console.error('There was an error', err); //output error message to console
            return;
        }
        lightvalue = value;
        socket.emit('light', lightvalue); //send button status to client
    });
    socket.on('light', function(data) { //get light switch status from client
        lightvalue = data;
        if (lightvalue != LED.readSync()) { //only change LED if status has changed
            console.log('changed light switch pi');

            rand = 11919191498+Date.now();
           setTimeout(function () {
               socket.emit('score', rand);
           },1000);
            LED.writeSync(lightvalue); //turn LED on or off
        }
    });




});

process.on('SIGINT', function () { //on ctrl+c
    LED.writeSync(0); // Turn LED off
    LED.unexport(); // Unexport LED GPIO to free resources
    pushButton.unexport(); // Unexport Button GPIO to free resources
    process.exit(); //exit completely
});