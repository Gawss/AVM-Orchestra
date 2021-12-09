soundtrackSelector = document.getElementById("soundtrackSelector");

SetupSelector();

function SetupSelector(){
    soundtracksName.forEach(element => {
        // console.log(element);
        var opt = document.createElement('option');
        opt.value = element;
        opt.innerHTML = element;
        soundtrackSelector.appendChild(opt);
    });
};

function SetupAccelerometer(){

    
    console.log("setup accelerometer");

    if(window.DeviceMotionEvent){
        console.log("DeviceMotionEvent is supported");
        accelerometerSettings.isActive = true;
        window.addEventListener("devicemotion", motion, false);
    }else{
        accelerometerSettings.isActive = false;
        console.log("DeviceMotionEvent is not supported");
    }

    // IF iPHONE:
    DeviceMotionEvent.requestPermission().then(response => {
            if (response == 'granted') {
                console.log("accelerometer permission granted");
                accelerometerSettings.isActive = true;
                window.addEventListener("devicemotion", motion, false);
            }
    });
}


function motion(event){
    // console.log("Accelerometer: "
    //   + event.accelerationIncludingGravity.x + ", "
    //   + event.accelerationIncludingGravity.y + ", "
    //   + event.accelerationIncludingGravity.z
    // );

    accelerometerSettings.axis.x = parseInt(event.accelerationIncludingGravity.x);
    accelerometerSettings.axis.y = parseInt(event.accelerationIncludingGravity.y);
    accelerometerSettings.axis.z = parseInt(event.accelerationIncludingGravity.z);
}