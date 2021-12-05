let currentPort;

let reader;
let writer;
let textEncoder;
let writableStreamClosed;

let serialBtn = document.getElementById("serialBtn");
let msgLabel = document.getElementById("msgLabel");
let sendBtn = document.getElementById("sendBtn");
let serialToggle = document.getElementById("serialToggle");

serialToggle.addEventListener('click', () => {
    console.log("toggle new value: " + serialToggle.checked);
    portSettings.isActive = serialToggle.checked;
    if(!portSettings.isActive){
        DeactivateCOM();
    }
});

serialBtn.addEventListener('click', () =>{
    navigator.serial.requestPort().then((port) => {
        console.log(port + " was selected.");
        port.open({baudRate: 9600}).then(() => {
            console.log("Serial Port has been opened.");
            sendBtn.disabled = false;
            currentPort = port;
            GlobalData.serialActive = true;
            SetUpWriter();
            ReadPort();

        }).catch((e) => {
            console.log("Serial Port was not open.");
        });
    }).catch((e) => {
        console.log("User didn't select a serial port.");
    });
});

sendBtn.addEventListener('click', () =>{
    console.log("About to send: " + msgLabel.value);
    RecursiveCOM();
});

navigator.serial.addEventListener('connect', (e) => {
    console.log("Serialport connected");
});

navigator.serial.addEventListener('disconnect', (e) => {
    console.log("Serialport disconnected");
});

navigator.serial.getPorts().then((ports) => {
    console.log("Available ports: ");
    ports.forEach(element => {
        console.log(element);
    });
});

async function ReadPort(){
    
    while(currentPort.readable){
        reader = currentPort.readable.getReader();
        try{
            while(true){
                const {value, done} = await reader.read();
                console.log('value: ', value,', Done, ', done);
                LineBreakTransformer(value);

                if(done){
                    console.log('Done, ', done);
                    break;
                }
            }
        }catch(error){
            console.log(error);
        }finally{
            reader.releaseLock();
            GlobalData.serialActive = false;
        }
    }
}

function SetUpWriter(){
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(currentPort.writable);
    writer = textEncoder.writable.getWriter();
    portSettings.isActive = true;
}

function RecursiveCOM(){ 
    if(currentPort.writable && portSettings.isActive){
        (async() => {
            await writer.write(msgLabel.value);
        })();
    }
}

function DeactivateCOM(){
    if(currentPort.writable){
        (async() => {
            await writer.write(GlobalData.deactivateCommand);
        })();
    }
}

function LineBreakTransformer(fullPackage){
    var fullLine = "";
    for(let i = 0; i < fullPackage.length; i++){
        if(fullPackage[i] == 13){
            console.log("carriage return");
            continue;
        }else if(fullPackage[i] == 10){
            console.log("new line");
            if(portSettings.isActive){
                setTimeout(()=>{RecursiveCOM();}, portSettings.timeout);
            }
            break;
        }
        fullLine += String.fromCharCode(fullPackage[i]);
    }

    var splittedLine = fullLine.split(',');
    if(splittedLine.length == GlobalData.packageSize){
        SensorsData[0] = splittedLine[0];
        SensorsData[1] = splittedLine[1];
        SensorsData[2] = splittedLine[2];
    }
    // console.log(fullLine, fullLine.length, splittedLine.length);
}