let mic;
let hasStarted = false;

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

    setupBrownianMotion();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight-(windowHeight*0.038));
}

function draw() {
    background(0);

    drawPlayers(players.length);

    if(getAudioContext().state === 'running'){

        if(portSettings.isActive){
            if(isFinite(SensorsData[0])) localVolume = map(SensorsData[0], 0, 1, 0, 1);
        }else{
            localVolume = abs(map(mic.getLevel(), 0, 1, 0, 2));
        }
        
        if(!socketSettings.isStreaming){
            // Start streaming inputdata
            if(socket.connected){
                console.log("Start streaming inputdata");
                SendInput();
                socketSettings.isStreaming = true;
            }
        }
    }

    // drawSpectrum();
    drawLocalInfo();
}

function drawPlayers(num){

    for(let i=0; i<num; i++){
        
        noFill();
        stroke(availableColors[i].r, availableColors[i].g, availableColors[i].b);

        ellipse(windowWidth/2, (windowHeight/2)-(50*2), players[i].volume*100*(1+i), players[i].volume*100*(1+i));
        noStroke();
        fill(255);
        text(players[i].id + " - p.volume: " + players[i].volume.toString(), 10, (1+i)*15);

        if(mainSoundtracks[players[i].soundtrackIndex]){
            mainSoundtracks[players[i].soundtrackIndex].setVolume(players[i].volume);
        }
        activeLines[i].update(map(-players[i].volume, -1, 1, -1, 1));
        activeLines[i].draw();
    }
    
    if(GetPlayer(socket.id)) drawBrownianMotion(GetPlayer(socket.id).volume*10);
}

function drawSpectrum(){
    spectrum = fft.analyze();
    noStroke();
    fill(spectrumColor);
    for (let i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, windowHeight, width / spectrum.length, h )
    }
}

function drawLocalInfo(){
    fill(255);
    noStroke();

    if(portSettings.isActive){
        text(SensorsData[0], windowWidth-100, height-40);
        text(SensorsData[1], windowWidth-100, height-60);
        text(SensorsData[2], windowWidth-100, height-80);
    }else{
        text(Log.inactiveMsg, windowWidth-150, height-40);
    }
    text("FPS: " + parseInt(frameRate()), windowWidth-100, height-20);
    // if(soundtrackSelector){
    //     text(soundtrackSelector.options[soundtrackSelector.selectedIndex].text, windowWidth-150, 80);
    // }

    if(getAudioContext().state !== 'running'){
        text(Log.startMsg, windowWidth/2, height/2);
    }
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