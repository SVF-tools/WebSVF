import * as vscode from "vscode";

class BasicBar {
    protected readonly bar: vscode.StatusBarItem;
    protected barShowStatus: boolean = false;
    constructor(
        context: vscode.ExtensionContext,
        alignment?: vscode.StatusBarAlignment,
        priority?: number
    ) {
        this.bar = vscode.window.createStatusBarItem(alignment, priority);
        context.subscriptions.push(this.bar);
    }

    static getAlignment(alignment?: string): vscode.StatusBarAlignment {
        if (alignment === "left") {
            return vscode.StatusBarAlignment.Left;
        } else {
            return vscode.StatusBarAlignment.Right;
        }
    }

    protected setBasicBar(
        command: string | vscode.Command | undefined,
        text: string,
        color?: string,
        show?: boolean
    ) {
        this.bar.command = command;
        this.bar.text = text;
        if (color) {
            this.bar.color = new vscode.ThemeColor(color);
        }
        this.bar.show();
        if (show === false) {
            this.bar.hide();
        }
    }

    public setText(text: string) {
        this.bar.text = text;
    }

    public setShow(flag?: boolean) {
        if (flag === undefined || flag) {
            this.bar.show();
            this.barShowStatus = true;
        } else {
            this.bar.hide();
            this.barShowStatus = false;
        }
    }
}

export { BasicBar };
