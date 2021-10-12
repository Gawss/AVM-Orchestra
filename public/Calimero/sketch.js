var diam = 50;
var colorFondo = 128;
var colorHuevo = 255;

var anchoHuevo = 75;
var altoCorteHuevo = 40;
var diametroCabeza = 60;
var radioCabeza = diametroCabeza/2;

let img;
let drawGuide = false;

//    create_canvas
// -------- funcion SETUP ----------
function setup() {
    createCanvas(windowWidth, windowHeight);
    
    img = loadImage('./Resources/Images/calimero.png');
    angleMode(DEGREES);
}
// -------- funcion DRAW ----------
function draw() {
    // background(100);

    drawCalimero(width/2, height/2);
    if(drawGuide) drawGuideImg();
}

function drawGuideImg(){
    push();
    tint(100, 127);
    image(img, (width/2) - (img.width/2), (height/2) - (img.height/2));
    pop();
}

// -------- funcion MIDIBUJO ----------
function drawCalimero(posX,  posY) {

    // head
    fill(0);
    noStroke();
    circle(posX, posY-(img.height*0.106), 68);

    // main body
    noStroke();
    fill(0);
    circle(posX, posY, 45, 90);

    // eyes

    fill(255);
    noStroke();
    circle(posX-(img.height*0.02), posY-(img.height*0.095), 22); // Left eye
    circle(posX+(img.height*0.025), posY-(img.height*0.095), 22); // Right eye

    fill(120, 30, 250);
    circle(posX-(img.height*0.02), posY-(img.height*0.095), 10); // left pupil
    circle(posX+(img.height*0.025), posY-(img.height*0.095), 10); // right pupil

    fill(255);
    circle(posX-(img.height*0.027), posY-(img.height*0.098), 5); // leftBright
    circle(posX+(img.height*0.0185), posY-(img.height*0.098), 5); // leftBright

    // nose
    stroke(180, 90, 22);
    strokeWeight(3);
    noFill();
    arc(posX, posY-(img.height*0.052), 20, 5, 180, 360);

    // hands
    var handLongitude = 3;
    stroke(0);
    strokeWeight(15);
    strokeCap(ROUND);

    line(posX-(img.width*0.03), posY - (img.height*0.016), posX-(img.width*0.1)-handLongitude, posY+(img.height*0.01)); // left hand
    line(posX+(img.width*0.03), posY - (img.height*0.016), posX+(img.width*0.1)+handLongitude, posY+(img.height*0.01)); // right hand

    // legs
    var legLongitude = 35;

    strokeCap(ROUND);
    line(posX-(img.width*0.02), posY + (img.height*0.01), posX-(img.width*0.02), posY+(img.height*0.01)+ legLongitude); // left leg
    line(posX+(img.width*0.02), posY + (img.height*0.01), posX+(img.width*0.02), posY+(img.height*0.01) + legLongitude); // right leg

    // egg-cap
    stroke(0);
    strokeWeight(2);
    fill(255);
    arc(posX, posY-(img.height*0.114), 80, 128, 180, 360, PIE);

}

function touchStarted() {
    drawGuide = !drawGuide;
    drawCalimero(mouseX, mouseY);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}