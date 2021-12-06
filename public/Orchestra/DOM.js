soundtrackSelector = document.getElementById("soundtrackSelector");

SetupSelector();

function SetupSelector(){
    soundtracksName.forEach(element => {
        console.log(element);
        var opt = document.createElement('option');
        opt.value = element;
        opt.innerHTML = element;
        soundtrackSelector.appendChild(opt);
    });
};