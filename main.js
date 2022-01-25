const http = require('http');
const express = require('express');
const Player = require('./player.js').Player;
const { type } = require('os');

const app = express();

let SERVER_PORT = 1337;


let players = []

app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || SERVER_PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
    console.log('Server On', __dirname)
});

// Enable resources and specify the file to return whenever /Orchestra receives a GET request
app.use(express.static(__dirname + '/public/resources'));
app.use(express.static(__dirname + '/public/Orchestra'));
app.use('/Soundtracks', express.static(__dirname + '/public/Orchestra/Resources/Soundtracks'));
app.use('/Images', express.static(__dirname + '/public/Orchestra/Resources/Images'));
app.get('/Orchestra', (req, res) => {    
    console.log('GET /');
            
    res.sendFile(__dirname + '/public/Orchestra/main.html');
});

app.use('/images', express.static(__dirname + '/public/Calimero/Resources/Images'));
app.use(express.static(__dirname + '/public/Calimero'));
app.get('/Calimero', (req, res) => {
    res.sendFile(__dirname + '/public/Calimero/calimero.html');
});
        
const io = require('socket.io')(server, {
    cors: {
        origin: `http://avm-orchestra.herokuapp.com`, // I copied the origin in the error message and pasted here
        // origin: "http://localhost:1337",
        methods: ["GET", "POST"],
        credentials: true
      }
});

io.sockets.on('connection', (socket) => {

    console.log('Client connected: ' + socket.id)
    players.push(new Player(socket.id))

    var _data = {
        players: players
    }

    io.emit('players', _data);

    socket.on('microphone', (data) => {
        // console.log(data);
        // console.log(typeof(data));
        if(typeof(data) != 'object'){
            data = JSON.parse(data);
            // console.log(data);
        }
        socket.broadcast.emit('microphone', data);
    })

    socket.on('disconnect', () => {
        var disconnectedSocket = socket.id;
        console.log('Client has disconnected: ' + disconnectedSocket);

        players.splice(players.indexOf(GetPlayer(disconnectedSocket)), 1);

        var _data = {
            players: players,
            disconnected: disconnectedSocket
        }

        io.emit('playerDisconnected', _data);
    })
})

function GetPlayer(id){
    for(let i= 0;i < players.length; i++){
        if(players[i].id == id){
            return players[i]
        }
    }

    return null;
}