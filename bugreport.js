const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.bugreport', function () {
        
        var series = function () {
            return new Promise(function (resolve, reject) {                
                utils.bug_report();//Send command via terminal to start the node app.
                resolve();
            }).then(function () {
                setTimeout(function () {
                    utils.open_internal_browser("http://localhost:3000/");//Open a internal webview in the right side.
                  }, 5000);
                
            })
        };
        series();
    }));

    //vscode.commands.executeCommand('extension.bugreport');
};