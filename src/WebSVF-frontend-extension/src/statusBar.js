const vscode = require('vscode');

const StatusBar = {
    flag: true,
    statusBar: null,

    getSttatusBar: function(){
        if(this.flag == true){
            let StatusBarAlignment = vscode.StatusBarAlignment;
            this.statusBar = vscode.window.createStatusBarItem(StatusBarAlignment.Left);
            this.statusBar.text = "Bug Analysis Tool"
            this.statusBar.command = 'extension.menu';
            this.statusBar.show();
            this.flag = false; //make this function can only be executed for once.
        }
    }

}

module.exports = StatusBar;