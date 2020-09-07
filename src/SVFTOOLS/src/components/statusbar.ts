import * as vscode from "vscode";

interface BarElement {
    key: string;
    barElement: BarBasic;
}

class BarBasic {

    protected readonly bar: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext, alignment?: vscode.StatusBarAlignment, priority?: number) {

        this.bar = vscode.window.createStatusBarItem(alignment, priority);
        context.subscriptions.push(this.bar);
    }

    public setCommand(command: string | vscode.Command | undefined) {
        this.bar.command = command;
    }

    public setTitle(text: string) {
        this.bar.text = text;
    }

    public setColor(color: string | vscode.ThemeColor | undefined) {
        this.bar.color = color;
    }

    public setShow(show: boolean) {
        show ? this.bar.show() : this.bar.hide();
    }

    public setBar(command?: string | vscode.Command, title?: string, show?: boolean, color?: string | vscode.ThemeColor) {

        if (command) { this.setCommand(command); }
        if (title) { this.setTitle(title); }
        if (color) { this.setColor(color); }
        if (show !== undefined) { this.setShow(show); }

    }
}

class BarArray {

    private list = new Array<BarElement>();
    constructor() { }

    public create(context: vscode.ExtensionContext, key: string, alignment?: vscode.StatusBarAlignment, priority?: number) {

        if (this.find(key)) { return undefined; }

        let bar = new BarBasic(context, alignment, priority);
        let item = { key: key, barElement: bar };
        this.list.push(item);

        return bar;
    }

    public generate(key: string, instance: BarBasic) {

        if (this.find(key)) { return -1; }

        let item = { key: key, barElement: instance };
        this.list.push(item);

        return this.list.length;
    }

    public find(key: string) {

        let flag = undefined;

        this.list.some((element) => {

            if (element.key === key) {
                flag = element.barElement;
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

    public hide(key: string) {

        let flag = false;

        this.list.some((element) => {

            if (element.key === key) {
                element.barElement.setShow(false);
                flag = true;
                return true;
            }

        });
        return flag;
    }

    public show(key: string) {

        let flag = false;

        this.list.some((element) => {

            if (element.key === key) {
                element.barElement.setShow(true);
                flag = true;
                return true;
            }

        });

        return flag;
    }
}

const mbar = new BarArray();

export { BarBasic, mbar };