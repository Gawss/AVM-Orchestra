let mic;
let hasStarted = false;
let h = 50;

let socket;

let players = [];
let activeLines = [];
let mainSoundtracks = [];
const soundtracksPath = './Resources/Soundtracks/';
const soundtracksName = [
    'A-Softer-war.mp3',
    'MusicBox.mp3'
];

let fft;
let spectrum;

let port;

socket = io.connect(location.origin);
// socket = io.connect('ws://avm-orchestra.herokuapp.com/socket.io/?EIO=4&transport=websocket')
// socket = io.connect('http://localhost:1337')

socket.on("connect", () => {
    console.log(socket.id + " connected: " + socket.connected); // true
});

function preload(){

    for(let i =0; i < soundtracksName.length; i++){
        mainSoundtracks[i] = loadSound(soundtracksPath + soundtracksName[i]);
        mainSoundtracks[i].setVolume(0);
    }

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Create an Audio input
    getAudioContext().suspend();
    mic = new p5.AudioIn();
    
    fft = new p5.FFT();
    
    background(255);
    // if ("serial" in navigator) {
    //     // The Web Serial API is supported.
    //     console.log("serial is supported.");
    //     // Prompt user to select any serial port.
    //     port = await navigator.serial.requestPort();

    //     // Wait for the serial port to open.
    //     await port.open({ baudRate: 9600 });

    //     const textEncoder = new TextEncoderStream();
    //     const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        
    //     const writer = textEncoder.writable.getWriter();
        
    //     await writer.write('q');
    // }

}

function draw() {
    background(255);
    fill(0);

    drawPlayers(players.length);

    if(getAudioContext().state === 'running'){
        // Get the overall volume (between 0 and 1.0)
        let vol = mic.getLevel();
        // stroke(0);
    
        // Draw an ellipse with height based on volume
        // h = map(vol*100, 0, 1, 200, 0);
        // text(vol*100, 10, 10);
        // text("Current Players: " + players.length, 10, 50);

        if(socket.connected){
            SendInput(vol);
        }
    }

    drawSpectrum();
}

function drawSpectrum(){
    spectrum = fft.analyze();
    noStroke();
    fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, height, width / spectrum.length, h )
    }
}

function drawPlayers(num){

    for(let i=0; i<num; i++){
        h = abs(map(players[i].volume*10, 0, 2, 1, 200));
        ellipse((1+i)*(windowWidth /(num + 1)), windowHeight/2, h, h);
        // activeLines[i].update(map(-players[i].volume, -1, 1, -1, 1));
        // activeLines[i].draw();
        noStroke();
        text(players[i].id + " volume: " + players[i].volume.toString() + " - h: " + h.toString(), 10, (1+i)*15);

        mainSoundtracks[i].setVolume(players[i].volume);
    }

    for(let i=0; i<num; i++){
        activeLines[i].update(map(-players[i].volume, -1, 1, -1, 1));
        activeLines[i].draw();        
    }

    // if(players.length > 0){
    //     players.forEach((item) => {
    //         h = map(item.volume*100, 0, 1, 200, 0);
    //         ellipse((1+players.indexOf(item))*(windowWidth /(num + 1)), windowHeight/2, h, h);
    //     });
    // }

    // if(activeLines.length > 0){
    //     activeLines.forEach((item) => {item.update(map(mouseY, 0, windowHeight, -1, 1))}); //sin(frameCount / 10)
    //     activeLines.forEach((item) => {item.draw()});
    // }
}

function touchStarted() {

    if (getAudioContext().state !== 'running') {
        
        // start the Audio Input.
        // By default, it does not .connect() (to the computer speakers)
        mic.start();

        // Enable direct feedback of the sound .connect() (to the computer speakers)
        //mic.connect();

        // Enable the audio context in the browser
        getAudioContext().resume();
    }
}

function mousePressed(){
    console.log("mousePressed");
    // sendmouse(mouseX, mouseY);

    if (getAudioContext().state !== 'running') {

        userStartAudio();
        
        // start the Audio Input.
        // By default, it does not .connect() (to the computer speakers)
        mic.start();

        // Enable direct feedback of the sound .connect() (to the computer speakers)
        //mic.connect();

        // Enable the audio context in the browser
        getAudioContext().resume();
    }

    mainSoundtracks.forEach(soundtrack => {
        if(!soundtrack.isPlaying()){
            soundtrack.loop();
        }        
    });

    // let ports = await navigator.serial.getPorts();
    // if(port == null){
    //     AskPorts();
    // }
}

async function AskPorts(){
    console.log("Asking ports...");
    port = await navigator.serial.requestPort();
    console.log(port);
    // if(port){
    //     OpenPort(port);
    // }

    // port = await navigator.serial.requestPort();
    // - Wait for the port to open.
    await port.open({ baudRate: 9600 });
}

async function OpenPort(serialport){
    await serialport.open({baudRate: 9600});
}

navigator.serial.addEventListener('connect', e => {
    // Add |e.port| to the UI or automatically connect.
    console.log("Port: " + e.port + " has been connected.");
});
  
navigator.serial.addEventListener('disconnect', e => {
    // Remove |e.port| from the UI. If the device was open the
    // disconnection can also be observed as a stream error.
    console.log("Port: " + e.port + " has been disconnected.");
});

socket.on('mouse', data => {
    console.log(data);
})

socket.on('microphone', data => {

    GetPlayer(data.playerID).volume = data.volume;
})

socket.on('players', data => {

    console.log('player has connected: ' + data.players[data.players.length-1].id);
    players = data.players;

    while(players.length > activeLines.length){
        InsertLine(activeLines.length +1);
    }
})

socket.on('playerDisconnected', data => {
    
    console.log('player has disconnected: ' + data.disconnected);

    players = data.players;

    if(activeLines[players.indexOf(GetPlayer(data.disconnected))] != null){
        activeLines.splice(players.indexOf(GetPlayer(data.disconnected)), 1);
    }

})

function SendInput(volume){

    if(GetPlayer(socket.id) != null){
        GetPlayer(socket.id).volume = volume;
    }
    
    var data = {
        volume: volume,
        playerID: socket.id
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

function GetPlayer(id){
    for(let i= 0;i < players.length; i++){
        if(players[i].id == id){
            return players[i]
        }
    }

    return null;
}

function InsertLine(index){
    activeLines.push(new sinWave(windowWidth/2, 1, (windowHeight/(index+1))+(25*(index)), 
        [random(255),
        random(255),
        random(255)]
    ));
    activeLines[activeLines.length - 1].setup();
}

class sinWave{
    constructor(focusPointX, lineLength, initialHeight, initialColor){
      
      this.lines = [];
      this.positions = {y0: initialHeight, x1:0, y1:0, x2:0, y2:0};
      this.focusPointX = focusPointX;
      this.lineLength = lineLength;
      this.currentMaxPointX = 0;
      this.amplitude = 0;
      this.initialX = 0;
      this.color = {r: initialColor[0], g: initialColor[1], b: initialColor[2]};
    }
    
    setup(){
      
      this.amplitude = this.positions.y0 / 2;
      this.positions.y1 = this.positions.y0;
      this.positions.x1 = 0;
    }
    
    update(_value){
      
      // on each frame, let's add 1 to the last x1 value
      this.positions.x2 = this.positions.x1 + this.lineLength;
      // multiple amplitude by the sin calc output and offset it to the midway point
      this.positions.y2 = this.amplitude * _value + this.positions.y0;
      
      if(Object.keys(this.lines).length < this.focusPointX/this.lineLength){
        this.lines.push({
          key:   "line",
          value: [min(this.positions.x1, (this.focusPointX-this.initialX)-this.lineLength), this.positions.y1, min(this.positions.x2, this.focusPointX-this.initialX), this.positions.y2]
        });
      }
      
    }
    
    draw(){

        stroke(this.color.r, this.color.g, this.color.b);
        // stroke(100, 200, 50);
        this.lines.forEach((item)=>{
            line(this.initialX + item.value[0], item.value[1], this.initialX + item.value[2], item.value[3]);
            this.currentMaxPointX = max(item.value[2], this.currentMaxPointX);
        });
  
        if(this.currentMaxPointX >= this.focusPointX){
            this.initialX = this.initialX-1;
            this.lines.shift();
        }

        this.positions.x1 = this.positions.x2;
        this.positions.y1 = this.positions.y2;
    }
  }