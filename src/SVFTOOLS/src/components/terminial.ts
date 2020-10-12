import * as vscode from "vscode";

interface TerminalElement {
    key: string;
    terminal: vscode.Terminal;
}

class TerminalArray {

    private list = new Array<TerminalElement>();

    constructor() {

        vscode.window.onDidCloseTerminal((terminal) => {
            this.delete(terminal.name);
        });

    }

    public create(title: string, shellPath?: string, shellArg?: string | string[]) {

        if (this.exist(title)) {
            return this.find(title);
        }

        let terminal = vscode.window.createTerminal(title, shellPath, shellArg);
        let item = { key: title, terminal: terminal };
        this.list.push(item);

        return terminal;
    }

    public generate(title: string, instance: vscode.Terminal) {

        if (this.exist(title)) {
            return this.find(title);
        }

        let item = { key: title, terminal: instance };
        this.list.push(item);

        return this.list.length;
    }

    public find(key: string) {

        let flag = undefined;

        this.list.some((element) => {
            if (element.key === key) {
                flag = element.terminal;
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

        console.log(`exist ${flag}: ${key}`);
        return flag;
    }

    public delete(key: string) {

        let flag = false;

        this.list.some((element) => {

            if (element.key === key) {

                element.terminal.dispose();

                let newList = this.list.filter((element) => {
                    return element.key !== key;
                });

                // delete this.list;
                this.list = newList;
                flag = true;
                return true;
            }
        });

        return flag;
    }

    public hide() {

        vscode.window.terminals.forEach((element) => {
            element.hide();
        });

    }
}

const mterminal = new TerminalArray();

export { mterminal };