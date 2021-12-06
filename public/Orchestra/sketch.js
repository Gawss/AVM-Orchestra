let mic;
let hasStarted = false;
let h = 50;

let activeLines = [];
let mainSoundtracks = [];

let fft;
let spectrum;


function preload(){

    for(let i =0; i < soundtracksName.length; i++){
        mainSoundtracks[i] = loadSound(soundtracksPath + soundtracksName[i]);
        mainSoundtracks[i].setVolume(0);
    }

}

function setup() {
    createCanvas(windowWidth, windowHeight-(windowHeight*0.038));
    
    // Create an Audio input
    getAudioContext().suspend();
    mic = new p5.AudioIn();
    
    fft = new p5.FFT();
    
    background(255);
    // if ("serial" in navigator) {

    // }
    if(socket === 0){
        SocketSetup();
    }
}

function draw() {
    background(0);
    fill(0);

    drawPlayers(players.length);

    if(getAudioContext().state === 'running'){
        // Get the overall volume (between 0 and 1.0)

        if(portSettings.isActive){
            if(isFinite(SensorsData[0])) localVolume = map(SensorsData[0], 0, 1, 0, 1);
        }else{
            localVolume = abs(map(mic.getLevel(), 0, 1, 0, 2));
        }
        // stroke(0);
    
        // Draw an ellipse with height based on volume
        // h = map(vol*100, 0, 1, 200, 0);
        // text(vol*100, 10, 10);
        // text("Current Players: " + players.length, 10, 50);
        
        if(!socketSettings.isStreaming){
            // Start streaming inputdata
            if(socket.connected){
                console.log("Start streaming inputdata");
                SendInput();
                socketSettings.isStreaming = true;
            }
        }
    }

    drawSpectrum();

    fill(255);
    if(portSettings.isActive){
        text(SensorsData[0], windowWidth-100, 20);
        text(SensorsData[1], windowWidth-100, 40);
        text(SensorsData[2], windowWidth-100, 60);
    }else{
        text(Log.inactiveMsg, windowWidth-150, 20);
    }

    if(soundtrackSelector){
        text(soundtrackSelector.options[soundtrackSelector.selectedIndex].text, windowWidth-150, 80);
    }
}

function drawSpectrum(){
    spectrum = fft.analyze();
    noStroke();
    fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, windowHeight, width / spectrum.length, h )
    }
}

function drawPlayers(num){

    for(let i=0; i<num; i++){
        h = players[i].volume;
        ellipse((1+i)*(windowWidth /(num + 1)), windowHeight/2, h, h);
        // activeLines[i].update(map(-players[i].volume, -1, 1, -1, 1));
        // activeLines[i].draw();
        noStroke();
        fill(255);
        text(players[i].id + " volume: " + players[i].volume.toString() + " - h: " + h.toString(), 10, (1+i)*15);

        console.log(players);
        if(mainSoundtracks[players[i].soundtrackIndex]){
            console.log("PLAYING AT VOLUME", players[i].soundtrackIndex, soundtrackSelector.selectedIndex);
            mainSoundtracks[players[i].soundtrackIndex].setVolume(players[i].volume);
        }else{
            console.log(players);
            // console.log("NOT PLAYING AT VOLUME", players[i].soundtrackIndex, soundtrackSelector.selectedIndex);
        }
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
        
        userStartAudio();
        // start the Audio Input.
        // By default, it does not .connect() (to the computer speakers)
        mic.start();

        // Enable the audio context in the browser
        getAudioContext().resume();
    }

    mainSoundtracks.forEach(soundtrack => {
        if(!soundtrack.isPlaying()){
            soundtrack.loop();
        }        
    });
}

function mousePressed(){

    if (getAudioContext().state !== 'running') {

        userStartAudio();
        
        // start the Audio Input.
        // By default, it does not .connect() (to the computer speakers)
        mic.start();

        // Enable the audio context in the browser
        getAudioContext().resume();
    }

    mainSoundtracks.forEach(soundtrack => {
        if(!soundtrack.isPlaying()){
            soundtrack.loop();
        }        
    });
}

function InsertLine(index){
    
    activeLines.push(new sinWave(windowWidth/2, 1, (windowHeight/(index+2))+(25*(index+2)), 
        [availableColors[index].r,
        availableColors[index].g,
        availableColors[index].b]
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