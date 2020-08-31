import * as vscode from "vscode";
import * as bugInfo from "../config/BugReportBar.json";
import * as statusbar from "../components/statusBar";
import { StoreInfo } from "../storeInfo";

enum BarStatus {
    wait,
    load,
    ready,
}

function getAlignment(alignment?: string): vscode.StatusBarAlignment {
    if (alignment === "left") {
        return vscode.StatusBarAlignment.Left;
    } else {
        return vscode.StatusBarAlignment.Right;
    }
}

class BugReportBar extends statusbar.BasicBar {
    protected _barStatus: BarStatus;
    public get barStatus(): BarStatus {
        return this._barStatus;
    }
    constructor() {
        // super(StoreInfo.context, getAlignment(bugInfo.alignment), bugInfo.priority);
        super(StoreInfo.extensionContext);
        this._barStatus = BarStatus.wait;
        this.setWait();
    }
    protected setStatus(status: BarStatus) {
        this._barStatus = status;
        let obj;
        switch (status) {
            case BarStatus.wait:
                obj = bugInfo.wait;
                break;
            case BarStatus.load:
                obj = bugInfo.load;
                break;
            case BarStatus.ready:
                obj = bugInfo.ready;
                break;
            default:
                obj = bugInfo.wait;
                break;
        }
        super.setBasicBar(bugInfo.command, obj.text, obj.color, true);
    }

    public setWait() {
        this.setStatus(BarStatus.wait);
    }

    public setLoad() {
        this.setStatus(BarStatus.load);
    }

    public setReady() {
        this.setStatus(BarStatus.ready);
    }

    public isWait(): boolean {
        if (BarStatus.wait === this.barStatus) {
            return true;
        }
        return false;
    }

    public isLoad(): boolean {
        if (BarStatus.load === this.barStatus) {
            return true;
        }
        return false;
    }

    public isReady(): boolean {
        if (BarStatus.ready === this.barStatus) {
            return true;
        }
        return false;
    }
}

export { BarStatus, BugReportBar };
