const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.stop', function () {
           utils.bug_report_stop();
    }));

    //vscode.commands.executeCommand('extension.stop');
};