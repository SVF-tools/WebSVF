const vscode = require('vscode');

const StatusBar = {
    flag: true,
    statusBar: null,

    getSttatusBar: function(){
        if(this.flag == true){
            let StatusBarAlignment = vscode.StatusBarAlignment;
            this.statusBar = vscode.window.createStatusBarItem(StatusBarAlignment.Left);
            this.statusBar.text = "Go to sleep!"
            this.statusBar.command = 'extension.bugreport';
            this.statusBar.show();
            this.flag = false;
        }
    }

}

module.exports = StatusBar;