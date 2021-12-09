let mic;
let hasStarted = false;

let activeLines = [];
let mainSoundtracks = [];

let fft;
let spectrum;
let soundtrackReview = false;

let qrcodeIMG;
let fpsFlag = false;

function preload(){

    for(let i =0; i < soundtracksName.length; i++){
        mainSoundtracks[i] = loadSound(soundtracksPath + soundtracksName[i]);
        mainSoundtracks[i].setVolume(0);
    }

    qrcodeIMG = loadImage('./Resources/Images/qr-avm-orchestra.png')

}

function setup() {
    createCanvas(windowWidth, windowHeight-(windowHeight*0.038));
    Log.Settings.position.x = windowWidth-(windowWidth*0.01);
    
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

    // setupBrownianMotion();
    SetupEllipseConvergence();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight-(windowHeight*0.038));
}

function draw() {
    background(0);

    if(hasStarted){
        drawPlayers(players.length);
    
        if(getAudioContext().state === 'running'){
    
            if(portSettings.isActive){
                if(isFinite(SensorsData[0])) nextLocalVolume = map(SensorsData[0], 0, 1, 0, 1);
            }else if(accelerometerSettings.isActive){
                if(isFinite(accelerometerSettings.axis.y)) nextLocalVolume = map(abs(accelerometerSettings.axis.y), 0, 10, 0, 1);
            }else{
                nextLocalVolume = map(mic.getLevel(0.5)< 0.01? 0: abs(mic.getLevel(0.5)), 0, 0.5, 0, 1);
            }
    
            if(localVolume < nextLocalVolume){
                localVolume += abs(localVolume-nextLocalVolume)*0.025; //Exponential
                // localVolume += map(abs(localVolume-nextLocalVolume), 0, 1, 1, 0)*0.025; //Not working with serial
                // localVolume += 0.01; //Linear
            }else if(localVolume > nextLocalVolume){
                localVolume -= abs(localVolume-nextLocalVolume)*0.1;
            }
    
            localVolume = min(max(localVolume, 0), 1);
            
            if(!socketSettings.isStreaming){
                // Start streaming inputdata
                if(socket.connected && !socketSettings.isStreaming){
                    console.log("Start streaming inputdata");
                    SendInput();
                    socketSettings.isStreaming = true;
                }
            }
        }
    
        if(!fpsFlag){
            if(frameRate() < 15 && frameRate() > 0){
                fpsFlag = true;
            }
            drawSpectrum();
        }else{
            textAlign(CENTER);
            text("Don't worry, you are still playing. This is just the simplified view.", windowWidth/2, (windowHeight-(windowHeight*0.038))/2);
            text("volume: " + GetPlayer(socket.id).volume.toString(), windowWidth/2, ((windowHeight-(windowHeight*0.038))/2) + 80);
            stroke(255);
            line((windowWidth/2)-map(GetPlayer(socket.id).volume, 0, 1, 0, 100), ((windowHeight-(windowHeight*0.038))/2) + 40,  (windowWidth/2)+map(GetPlayer(socket.id).volume, 0, 1, 0, 100), ((windowHeight-(windowHeight*0.038))/2) + 40);
        }
    }

    drawLocalInfo();
}

function drawPlayers(num){

    for(let i=0; i<num; i++){

        if(mainSoundtracks[players[i].soundtrackIndex]){
            mainSoundtracks[players[i].soundtrackIndex].setVolume(players[i].volume);
            if(!mainSoundtracks[players[i].soundtrackIndex].isPlaying()){
                mainSoundtracks[players[i].soundtrackIndex].loop();
            }
        }
        
        if(!fpsFlag){
            noStroke();
            fill(255);
            textAlign(LEFT);
            text(players[i].id + " - p.volume: " + players[i].volume.toString(), 10, (1+i)*15);
            activeLines[i].update(map(-players[i].volume, -1, 1, -1, 1));
            activeLines[i].draw();
            noFill();
            ellipse(windowWidth/2, (windowHeight-(windowHeight*0.038))/2, players[i].volume*100*(1+i), players[i].volume*100*(1+i));
        }
    }

    mainSoundtracks.forEach(soundtrack => {
        soundtrackReview = false;
        players.forEach(player => {
            if(mainSoundtracks.indexOf(soundtrack) == player.soundtrackIndex){
                soundtrackReview = true;
            }
        });

        if(!soundtrackReview) soundtrack.pause();
    });    
}

function drawSpectrum(){
    spectrum = fft.analyze();
    stroke(255);
    noFill();
    for (let i = 0; i< spectrum.length; i+=10){
      let x = map(i, 0, spectrum.length, 0, width/2);
      let h = -(height*0.8) + map(spectrum[i], 0, 255, height*0.8, 0);
      ellipse(x, (windowHeight-(windowHeight*0.038))/2, h, h);
      ellipse(map(x, 0, width/2, width, width/2), (windowHeight-(windowHeight*0.038))/2, h, h);
    //   rect(x, windowHeight, width / spectrum.length, h );
    //   drawEllipseConvergence(h);
    }
}

function drawLocalInfo(){
    fill(255);
    noStroke();
    textAlign(RIGHT);
    if(portSettings.isActive){
        text(SensorsData[0], Log.Settings.position.x, height-60);
        text(SensorsData[1], Log.Settings.position.x, height-80);
        text(SensorsData[2], Log.Settings.position.x, height-100);
    }else{
        text(Log.inactiveMsg, Log.Settings.position.x, height-60);
    }

    if(accelerometerSettings.isActive){
        text(Log.accelerometerMsg + ": " + accelerometerSettings.axis.y.toString(), Log.Settings.position.x, height-80);
    }

    text("FPS: " + parseInt(frameRate()), Log.Settings.position.x, height-40);
    if(fpsFlag) text(Log.fpsWarning, Log.Settings.position.x, height-20);

    textAlign(CENTER);
    if(!hasStarted){
        text(Log.startMsg, windowWidth/2, height/3);
    }

    text(Log.joinMsg, windowWidth/2, ((height/3)*2)+140);
    image(qrcodeIMG, (windowWidth/2)-100, ((height/3)*2)-100);
}

function touchStarted() {

    if (getAudioContext().state !== 'running') {
        
        userStartAudio();
        // start the Audio Input.
        // By default, it does not .connect() (to the computer speakers)
        mic.start();

        // Enable the audio context in the browser
        getAudioContext().resume();

        hasStarted = true;
    }

    if(!accelerometerSettings.isActive){
        SetupAccelerometer();
    }
}

function mousePressed(){

    if (getAudioContext().state !== 'running') {

        userStartAudio();
        
        // start the Audio Input.
        // By default, it does not .connect() (to the computer speakers)
        mic.start();

        // Enable the audio context in the browser
        getAudioContext().resume();

        hasStarted = true;
    }

    if(fpsFlag) fpsFlag = false;
}

function InsertLine(index){
    
    activeLines.push(new sinWave(windowWidth/2, 1, (windowHeight-(windowHeight*0.038))/(index+2), 
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
        
        this.lines.forEach((item)=>{
            line(this.initialX + item.value[0], item.value[1], this.initialX + item.value[2], item.value[3]);
            line(map(this.initialX, 0, -width, width, width*2) - item.value[0], item.value[1], map(this.initialX, 0, -width, width, width*2) - item.value[2], item.value[3]);

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