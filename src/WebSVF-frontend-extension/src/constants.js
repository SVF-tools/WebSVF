const vscode = require('vscode');
var path = require("path");

/**
 * Some paths used with high frequencies.
 */
const constants = {
    workspace: vscode.workspace.rootPath, //Root path of the workspace.
    node_app: '.bug-report', //WebSVF frontend server folder, which is a hidden folder.
    node_branch: path.sep + 'WebSVF-bug-report-fe', //Node app branch name, used for Windows, should be modified when the WebSVF frontend server can be installed on Windows via script.
    workspace_json: path.sep + 'Bug-Analysis-Report.json', //To test if the Bug-Analysis-Report.json exists in the workspace.
    config_abspath: path.sep + 'config' + path.sep +'bug-analysis-JSON_absolute-dir.config', //The absolute path of config file in the WebSVF frontend server folder.
    //node_json: path.sep + this.node_app + this.node_branch + this.workspace_json, //Has been discarded currently.
    download_uri: 'https://github.com/SVF-tools/WebSVF/releases/download/0.1.0/WebSVF-bug-report-fe.zip' //Download the bug_report analysis tool (WebSVF frontend server) as a zip from remote github
}

module.exports = constants;