//ExpressJS and SocketIO config
const express = require("express");
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

const fReport = require('./file-report');
const landPage = require('./landingPage');

landPage.generate();

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
