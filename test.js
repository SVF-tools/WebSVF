//ExpressJS config
const express = require("express");
const app = express();
var http = require('http').Server(app);
const open = require('open');//Open website in default browser;
const path = require('path');

var io = require('socket.io')(http);

/* 

npm i express
npm i jsdom
npm i jquery

*/

const port = 3000;

//Initialize Express App
app.use(express.static(__dirname));

const fReport = require('./file-report');

const landPage = require('./landingPage');





landPage.generate();


//For Testing
/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public')+'/fileReport.html');
});
*/

//Serving Static Web Page using ExpressJS
app.use(express.static("public"));
http.listen(port, () => console.log(`Example app listening on port ${port}!`));

io.on('connection', (socket)  => {
    console.log( "a user has connected!" );

    socket.on( 'disconnect', () => {
        console.log( 'user disconnected' );
    });

    socket.on( 'file-clicked', (fileDetails) => {
        //console.log( 'Link  ID: ' + fileDetails );
        const fileID = fileDetails.slice(0, fileDetails.indexOf('*!*'));

        fReport.generate(fileID);
    });
});

open('http://localhost:3000');