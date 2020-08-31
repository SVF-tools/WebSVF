import * as vscode from "vscode";

class Terminal {
    protected terminal: vscode.Terminal;
    protected existFlag: boolean;
    constructor(name: string, shellpath?: string, args?: string[] | string) {
        this.terminal = vscode.window.createTerminal(name, shellpath, args);
        this.existFlag = true;
    }
    public CreateTerminal(
        name: string,
        shellpath?: string,
        args?: string[] | string
    ) {
        this.RemoveTerminal();
        this.terminal = vscode.window.createTerminal(name, shellpath, args);
        this.existFlag = true;
    }
    protected CheckStatus(): boolean {
        if (this.terminal && !this.terminal.exitStatus && this.existFlag) {
            return true;
        } else {
            this.existFlag = false;
        }
        return this.existFlag;
    }

    public RemoveTerminal() {
        this.terminal?.dispose();
        this.existFlag = false;
    }

    public cmd(cmd: string) {
        this.terminal.sendText(cmd);
    }

    public show() {
        this.terminal.show();
    }

    public hide() {
        this.terminal.hide();
    }
}

export { Terminal };
