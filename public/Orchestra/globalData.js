var GlobalData = {
    serialActive: false,
    deactivateCommand: 'd',
    packageSize: 3
};

let socketSettings = {
    timeInterval: 50,
    isStreaming: false
};

let portSettings = {
    timeout: 200,
    isActive: false
};

let SensorsData = [0, 0, 0];

let Log = {
    inactiveMsg: "SerialPort Inactive.",
    startMsg: "Click or Tap to start!"
};

const soundtracksPath = './Resources/Soundtracks/';
const soundtracksName = [
    'A-Softer-war.mp3',
    'MusicBox.mp3'
];

const availableColors = [
    {r: 255, g:0, b:0},
    {r: 0, g:255, b:0},
    {r: 55, g:200, b:100}
];

const spectrumColor = [255, 255, 255];

let players = [];

let localVolume = 0;
let previousVolume = 0;

let soundtrackSelector;