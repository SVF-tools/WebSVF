const vscode = require('vscode');
const utils = require('./utils'); //utils
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {

    vscode.window.onDidOpenTerminal(e => {
		//console.log(`Open terminal changed, name=${e ? e.name : 'undefined'}`);
    });
    
	vscode.window.onDidCloseTerminal(e => {
        //console.log(`Close terminal changed, name=${e ? e.name : 'undefined'}`);
        if(e.name == "bug_report"){
            //console.log("Bug report terminal has been closed.");
            stop();
        }
    });
    
    function stop(){
        utils.setStatusBar("Bug Analysis Tool", "White");
        utils.terminal_stop();
    }

};