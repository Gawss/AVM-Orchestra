let socket = 0;

function SocketSetup(){

    socket = io.connect(location.origin);
    // socket = io.connect('ws://avm-orchestra.herokuapp.com:80')
    // socket = io.connect('http://avm-orchestra.herokuapp.com:80')
    // socket = io.connect('ws://avm-orchestra.herokuapp.com/socket.io/?EIO=4&transport=websocket')
    // socket = io.connect('https://avm-orchestra.herokuapp.com:11173');
    // socket = io.connect('http://localhost:1337')
    
    socket.on("connect", () => {
        console.log(socket.id + " connected: " + socket.connected); // true
    
    });
    
    
    socket.on('players', data => {
    
        console.log('player has connected: ' + data.players[data.players.length-1].id);
        players = data.players;
    
        while(players.length > activeLines.length){
            InsertLine(activeLines.length);
        }
    });
    
    socket.on('mouse', data => {
        console.log(data);
    });
    
    socket.on('microphone', data => {

        if(GetPlayer(data.id) !== null){
            GetPlayer(data.id).volume = data.volume;
            GetPlayer(data.id).soundtrackIndex = data.soundtrackIndex;
        }


    });
    
    socket.on('playerDisconnected', data => {
        
        console.log('player has disconnected: ' + data.disconnected);
    
        players = data.players;
        tempPlayers = players;

        if(activeLines[players.indexOf(GetPlayer(data.disconnected))] != null){
            activeLines.splice(players.indexOf(GetPlayer(data.disconnected)), 1);
        }
    
    });
}

function SendInput(){

    console.log("Getting player: " + socket.id);
    if(GetPlayer(socket.id) != null){
        console.log("Player is here...");
        GetPlayer(socket.id).volume = localVolume;
        GetPlayer(socket.id).soundtrackIndex = soundtrackSelector.selectedIndex;
    }
    
    // console.log("Creating package");
    var data = {
        volume: localVolume,
        id: socket.id,
        soundtrackIndex: soundtrackSelector.selectedIndex
    }

    socket.emit('microphone', data);

    setTimeout(SendInput, socketSettings.timeInterval);
}

function GetPlayer(id){
    for(let i= 0;i < tempPlayers.length; i++){
        if(tempPlayers[i].id == id){
            return tempPlayers[i]
        }
    }

    return null;
}