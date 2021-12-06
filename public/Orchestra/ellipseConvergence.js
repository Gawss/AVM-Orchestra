var tileCount = 5;

var moduleColor;
var moduleAlpha = 180;
var maxDistance = 10;


function SetupEllipseConvergence() {
    moduleColor = color(255, 255, 255, moduleAlpha);
}
  
function drawEllipseConvergence(value) {    
    // clear();
    stroke(moduleColor);
    // strokeWeight(3);
    noFill();
    for (var gridY = 0; gridY < 600; gridY += 600/tileCount) {
        for (var gridX = 0; gridX < 600; gridX += 600/tileCount) {
        // var diameter = dist(mouseX, mouseY, gridX, gridY);
        var diameter = (100 / maxDistance * 40)*value;
        push();
        translate((windowWidth/2)+gridX-240, ((windowHeight-(windowHeight*0.038))/2)+(gridY)-315, diameter * 5);
        ellipse(0, 0, diameter, diameter); // also nice: ellipse(...)
        pop();
        }
    }
}