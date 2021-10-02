const express = require('express');

const app = express();

let SERVER_PORT = 1337;

app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || SERVER_PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
    console.log('Server On', __dirname)
});


app.use(express.static(__dirname + '/public/resources'));
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {    
    console.log('GET /');

    // //Load different file in localMode
    // if(process.env.PORT != undefined){
    //     res.sendFile(__dirname + '/public/inprogress.html');
    // }else{
    //     //Load different file in Online Mode
    //     res.sendFile(__dirname + '/public/main.html');
    // }

    res.sendFile(__dirname + '/public/main.html');
});