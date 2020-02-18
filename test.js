//ExpressJS config
const express = require("express");
const app = express();
const open = require('open');//Open website in default browser;
const path = require('path');

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



fReport.generate();

landPage.generate();


//For Testing
/*app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public')+'/fileReport.html');
});
*/

//Serving Static Web Page using ExpressJS
app.use(express.static("public"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
open('http://localhost:3000');