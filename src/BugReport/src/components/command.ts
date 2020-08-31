import * as vscode from "vscode";

class BasicCommand {
    constructor(private context: vscode.ExtensionContext, private cmd: string) {
        this.registerCommand();
    }
    protected registerCommand() {
        let disposable: vscode.Disposable = vscode.commands.registerCommand(
            this.cmd,
            () => {
                this.exeCommand();
            }
        );
        this.context.subscriptions.push(disposable);
    }
    protected exeCommand() {}
}

export { BasicCommand };
