const http = require('http');
const express = require('express');

const app = express();

let SERVER_PORT = 1337;

let numPlayers = 0;

app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || SERVER_PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
    console.log('Server On', __dirname)
});


app.use(express.static(__dirname + '/public/resources'));
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {    
    console.log('GET /');
    
    // //Load different file in localMode
    // if(process.env.PORT != undefined){
        //     res.sendFile(__dirname + '/public/inprogress.html');
        // }else{
            //     //Load different file in Online Mode
            //     res.sendFile(__dirname + '/public/main.html');
            // }
            
            res.sendFile(__dirname + '/public/main.html');
        });
        
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {

    numPlayers++;

    var _data = {
        numPlayers: numPlayers
    }

    io.emit('players', _data);

    console.log('Client connected: ' + socket.id)
    socket.on('mouse', (data) => {
        socket.broadcast.emit('mouse', data);
        // io.emit('mouse', data);
        console.log(data);
    })

    socket.on('microphone', (data) => {
        socket.broadcast.emit('microphone', data);
    })

    socket.on('disconnect', () => {
        console.log('Client has disconnected');

        numPlayers--;

        var _data = {
            numPlayers: numPlayers
        }

        io.emit('players', _data);
    })
})