var fs = require('fs');
var request = require('request');
var ProgressBar = require('progress');
//var constants = require('./constants');

var file_url = 'https://github.com/SVF-tools/WebSVF/releases/download/0.1.0/WebSVF-bug-report-fe.zip';
var out = fs.createWriteStream('WebSVF-bug-report-fe.zip');
var total;
var progress = 0;

var bar = new ProgressBar('progress: [:bar] :percent :elapsed'+'s', { total: 100, width: 0, complete: '█', incomplete: '░' });

var req = request({
    method: 'GET',
    uri: file_url
});

req.pipe(out);

req.on('data', function (chunk) {
    // console.log('data')
    //console.log('data: '+ chunk.length);
    progress += chunk.length;
    if(total != 0){
        //console.log("Progress: " + progress/total);
        bar.update(progress/total);
    }
    
});

req.on( 'response', function ( data ) {
    console.log('response: ' + data.headers[ 'content-length' ] );
    total = data.headers[ 'content-length' ];
} );

req.on('end', function() {
    //Do something
    console.log('end')
});