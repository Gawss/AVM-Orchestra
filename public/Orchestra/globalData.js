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
    timeout: 50,
    isActive: false
};

let accelerometerSettings = {
    isActive: false,
    axis: {x:0, y:0, z:0}
};

let SensorsData = [0, 0, 0];

let Log = {
    Settings: {position: {x:0, y:0}},
    inactiveMsg: "SerialPort Inactive",
    accelerometerMsg: "Accelerometer is Active",
    startMsg: "CLICK OR TAP TO START!",
    joinMsg: "SCAN THE QR CODE TO JOIN",
    fpsWarning: "LOW FRAME RATE. Some visuals have been disabled - Tap to reset"
};

const soundtracksPath = './Resources/Soundtracks/';
const soundtracksName = [
    'Dragon Ball Z.mp3',
    'Never Gonna Give You Up.mp3',
    'Pokemon Theme.mp3',
    'Saint Seiya.mp3',
    'Somewhere Over The Rainbow.mp3',
    'Top Gear Theme.mp3',
    '-001.mp3',
    '-002.mp3',
    '-003.mp3',
    '-004.mp3',
    '-005.mp3',
    '-006.mp3',
    '-007.mp3',
    '-008.mp3',
    '-009.mp3',
    '-010.mp3',
    '-011.mp3',
    '-012.mp3',
    '-013.mp3',
    '-014.mp3',
    '-015.mp3',
    '-016.mp3'
];

const availableColors = [
    {r: 255, g:0, b:0},
    {r: 0, g:255, b:0},
    {r: 55, g:200, b:100},
    {r: 0, g:255, b:0},
    {r: 100, g:255, b:0},
    {r: 0, g:200, b:100},
    {r: 0, g:55, b:255},
    {r: 110, g:25, b:0},
    {r: 50, g:255, b:100},
    {r: 0, g:67, b:123},
    {r: 99, g:255, b:13},
    {r: 0, g:200, b:78},
    {r: 30, g:255, b:0},
    {r: 0, g:64, b:99}
];

const spectrumColor = [255, 255, 255];

let players = [];

let localVolume = 0;
let nextLocalVolume = 0;
let previousVolume = 0;

let soundtrackSelector;