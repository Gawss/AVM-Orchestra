
let img;
let calimeros = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    img = loadImage('./Resources/Images/calimero.png');
    angleMode(DEGREES);
    textAlign(CENTER, CENTER);
}


function draw() {
    background(100);
    
    drawGuideImg();

    calimeros.forEach(calimero => {
        calimero.draw(mouseX, mouseY);
    });
    
}

function drawGuideImg(){
    push();
    tint(100, 127);
    image(img, 0, 0);

    fill(255);
    textSize(windowWidth*0.05);
    noStroke();
    text("Click somewhere!", windowWidth/2, windowHeight - windowHeight*0.1);

    textSize(windowWidth*0.02)
    text("x" + calimeros.length, img.width/2, img.height - img.height * 0.1);
    pop();
}

function touchStarted() {
    calimeros.push(new Calimero(mouseX, mouseY));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Calimero {
    constructor(posX, posY) {
      this.positionX = posX;
      this.positionY = posY;

      this.eyesOffset = {left:{x:0, y:0}, right:{x:0, y:0}};
    }

    draw(eyesTargetX, eyesTargetY, headColor){

        // head
        fill(0);
        noStroke();
        circle(this.positionX, this.positionY-(img.height*0.106), 68);

        // main body
        noStroke();
        fill(0);
        circle(this.positionX, this.positionY, 45, 90);

        // eyes

        this.eyesOffset.left.x = max(-4, min(eyesTargetX-this.positionX-(img.height*0.02), 4));
        this.eyesOffset.left.y = max(-4, min(eyesTargetY-this.positionY-(img.height*0.095), 4));

        this.eyesOffset.right.x = max(-4, min(eyesTargetX-this.positionX+(img.height*0.0185), 4));
        this.eyesOffset.right.y = max(-4, min(eyesTargetY-this.positionY-(img.height*0.098), 4));

        fill(255);
        noStroke();
        circle(this.positionX-(img.height*0.02), this.positionY-(img.height*0.095), 22); // Left eye
        circle(this.positionX+(img.height*0.025), this.positionY-(img.height*0.095), 22); // Right eye

        fill(120, 30, 250);
        circle(this.positionX-(img.height*0.02) + this.eyesOffset.left.x, this.positionY-(img.height*0.095) + this.eyesOffset.left.y, 10); // left pupil
        circle(this.positionX+(img.height*0.025) + this.eyesOffset.right.x, this.positionY-(img.height*0.095) + this.eyesOffset.right.y, 10); // right pupil

        fill(255);
        circle(this.positionX-(img.height*0.027) + this.eyesOffset.left.x, this.positionY-(img.height*0.098) + this.eyesOffset.left.y, 5); // leftBright
        circle(this.positionX+(img.height*0.0185) + this.eyesOffset.right.x, this.positionY-(img.height*0.098) + this.eyesOffset.right.y, 5); // leftBright

        // nose
        stroke(180, 90, 22);
        strokeWeight(3);
        noFill();
        arc(this.positionX, this.positionY-(img.height*0.052), 20, 5, 180, 360);

        // hands
        var handLongitude = 3;
        stroke(0);
        strokeWeight(15);
        strokeCap(ROUND);

        line(this.positionX-(img.width*0.03), this.positionY - (img.height*0.016), this.positionX-(img.width*0.1)-handLongitude, this.positionY+(img.height*0.01)); // left hand
        line(this.positionX+(img.width*0.03), this.positionY - (img.height*0.016), this.positionX+(img.width*0.1)+handLongitude, this.positionY+(img.height*0.01)); // right hand

        // legs
        var legLongitude = 35;

        strokeCap(ROUND);
        line(this.positionX-(img.width*0.02), this.positionY + (img.height*0.01), this.positionX-(img.width*0.02), this.positionY+(img.height*0.01)+ legLongitude); // left leg
        line(this.positionX+(img.width*0.02), this.positionY + (img.height*0.01), this.positionX+(img.width*0.02), this.positionY+(img.height*0.01) + legLongitude); // right leg

        // egg-cap
        stroke(0);
        strokeWeight(2);
        fill(255);
        arc(this.positionX, this.positionY-(img.height*0.114), 80, 128, 180, 360, PIE);
    }
}