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
    inactiveMsg: "SerialPort Inactive.",
    startMsg: "Click or Tap to start!"
};

const soundtracksPath = './Resources/Soundtracks/';
const soundtracksName = [
    'A-Softer-war.mp3',
    'MusicBox.mp3',
    'Beep_001.wav',
    'Beep_002.wav',
    'Beep_003.wav',
    'Bomb_001.wav',
    'Bomb_002.wav',
    'Bomb_003.wav',
    'Bomb_004.wav',
    'FX_001.wav',
    'FX_002.wav',
    'FX_003.wav',
    'FX_004.wav',
    'FX_005.wav',
    'FX_006.wav',
    'FX_007.wav',
    'FX_008.wav',
    'FX_009.wav',
    'FX_010.wav',
    'FX_011.wav',
    'FX_012.wav',
    'FX_013.wav',
    'FX_014.wav',
    'FX_015.wav',
    'FX_016.wav',
    'FX_017.wav',
    'FX_018.wav',
    'FX_019.wav',
    'FX_020.wav',
    'FX_021.wav',
    'FX_022.wav',
    'FX_023.wav',
    'FX_024.wav',
    'FX_025.wav',
    'FX_026.wav',
    'FX_027.wav',
    'FX_028.wav',
    'FX_029.wav',
    'FX_030.wav',
    'FX_031.wav',
    'FX_032.wav',
    'FX_033.wav',
    'FX_034.wav',
    'FX_035.wav',
    'FX_036.wav',
    'FX_037.wav',
    'FX_038.wav',
    'FX_039.wav',
    'FX_040.wav',
    'FX_041.wav',
    'FX_042.wav',
    'FX_043.wav',
    'FX_044.wav',
    'FX_045.wav',
    'FX_046.wav'
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