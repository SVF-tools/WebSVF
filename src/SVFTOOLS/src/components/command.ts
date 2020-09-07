import * as vscode from "vscode";

interface CommandElement {
    key: string;
    commandElement: CommandBasic;
}

class CommandBasic {

    constructor(private context: vscode.ExtensionContext, protected cmd: string, protected exeFunc?: Function) {
        this.registerCommand();
    }

    protected registerCommand() {
        let disposable: vscode.Disposable = vscode.commands.registerCommand(this.cmd,
            () => {
                this.exeFunc ? this.exeFunc() : this.Func();
            }
        );
        this.context.subscriptions.push(disposable);
    }

    protected Func() { }
}

class CommandArray {

    private list = new Array<CommandElement>();

    public create(context: vscode.ExtensionContext, key: string, cmd: string, exeFunc: Function) {

        if (this.find(key)) {
            return undefined;
        }

        let commandElement = new CommandBasic(context, cmd, exeFunc);
        let item = { key: key, commandElement: commandElement };

        this.list.push(item);

        return commandElement;
    }

    public generate(key: string, instance: CommandBasic) {

        if (this.find(key)) { return -1; }

        let item = { key: key, commandElement: instance };
        this.list.push(item);

        return this.list.length;
    }

    public find(key: string) {

        let flag = undefined;

        this.list.some((element) => {
            if (element.key === key) {
                flag = element.commandElement;
                return true;
            }
        });
        return flag;
    }

    public exist(key: string): boolean {

        let flag = false;

        this.list.some((element) => {
            if (element.key === key) {
                flag = true;
                return true;
            }
        });
        return flag;
    }
}


const mcommand = new CommandArray();

export { CommandBasic, mcommand };