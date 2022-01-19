let socket = 0;

function SocketSetup(){

    // socket = io.connect(location.origin);
    socket = io.connect('ws://avm-orchestra.herokuapp.com/socket.io/?EIO=4&transport=websocket', {secure: true,    rejectUnauthorized: false});
    // socket = io.connect('https://avm-orchestra.herokuapp.com/socket.io/?EIO=4&transport=websocket', { transports : ['websocket'] });
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

        GetPlayer(data.playerID).volume = data.volume;
        GetPlayer(data.playerID).soundtrackIndex = data.soundtrackIndex;

    });
    
    socket.on('playerDisconnected', data => {
        
        console.log('player has disconnected: ' + data.disconnected);
    
        players = data.players;
    
        if(activeLines[players.indexOf(GetPlayer(data.disconnected))] != null){
            activeLines.splice(players.indexOf(GetPlayer(data.disconnected)), 1);
        }
    
    });
}

function SendInput(){

    // console.log("Getting player...");
    if(GetPlayer(socket.id) != null){
        GetPlayer(socket.id).volume = localVolume;
        GetPlayer(socket.id).soundtrackIndex = soundtrackSelector.selectedIndex;
    }
    
    // console.log("Creating package");
    var data = {
        volume: localVolume,
        playerID: socket.id,
        soundtrackIndex: soundtrackSelector.selectedIndex
    }

    socket.emit('microphone', data);

    setTimeout(SendInput, socketSettings.timeInterval);
}

function GetPlayer(id){
    for(let i= 0;i < players.length; i++){
        if(players[i].id == id){
            return players[i]
        }
    }

    return null;
}