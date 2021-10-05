let mic;
let hasStarted = false;
let h = 50;

let socket;

socket = io.connect(location.origin);
// socket = io.connect('ws://avm-orchestra.herokuapp.com/socket.io/?EIO=4&transport=websocket')
// socket = io.connect('http://localhost:1337')

socket.on("connect", () => {
    console.log(socket.id + " connected: " + socket.connected); // true
});


let numPlayers = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);

    background(255);

}

function draw() {
    background(255);
    fill(0);
    ellipse(windowWidth / 2, windowHeight/2, h, h);

    if(getAudioContext().state === 'running'){
        // Get the overall volume (between 0 and 1.0)
        let vol = mic.getLevel();
        // stroke(0);
    
        // Draw an ellipse with height based on volume
        h = map(vol*100, 0, 1, 200, 0);
        text(vol*100, 10, 10);
        text("Current Players: " + numPlayers, 10, 50);

        if(socket.connected){
            SendInput(vol);
        }
    }
}

function touchStarted() {

    if (getAudioContext().state !== 'running') {

        
        // Create an Audio input
        mic = new p5.AudioIn();
        
        // start the Audio Input.
        // By default, it does not .connect() (to the computer speakers)
        mic.start();

        // Enable direct feedback of the sound .connect() (to the computer speakers)
        mic.connect();

        // Enable the audio context in the browser
        getAudioContext().resume();
    }
}

function mousePressed(){
    console.log("mousePressed");
    sendmouse(mouseX, mouseY);
}

socket.on('mouse', data => {
    console.log(data);
})

socket.on('microphone', data => {
    console.log('ECHO microphone: ' + data);
})

socket.on('players', data => {
    numPlayers = data.numPlayers;
})

function SendInput(volume){
    const data = {
        volume: volume
    }
    socket.emit('microphone', data);
}

function sendmouse(x, y) {
    const data = {
     x: x,
     y: y
    }
    socket.emit('mouse', data)
}