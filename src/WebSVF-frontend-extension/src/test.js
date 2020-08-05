//Put generateJsonForOneFile.js and test.js at the root folder of svf, then run `node test.js` to test it
var script = require('./generateJsonForOneFIle.js');

//'dir' is the location of single C file.
//'svfPath' is the path of svf bin folder and the analyze options(svf-ex -stat=false)
var dir = '/home/jiachen/SVF-example/test/test.c';
var svfPath = './bin/svf-ex -stat=false';

script.generateJSONForOneFile(dir, svfPath, function() {
    //if you want to do something when the process finished, add the code in this callback function.
    console.log("success!");
});
