import * as vscode from "vscode";
import * as bugInfo from "../config/BugReportBar.json";
import { BasicCommand } from "../components/command";
import { StoreInfo, ClearStore } from "../storeInfo";
import { BarStatus } from "../models/BugReportBar";
import { BugReportWebPanel } from "../models/BugReportWebPanel";

function sleep(seconds: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

class MyEvent {
    static GenWebTime = 3;
    static WaitTime = 5;
    static events = require("events");
    static eventEmitter = new MyEvent.events.EventEmitter();
}

class BugReportCommand extends BasicCommand {
    constructor() {
        super(StoreInfo.extensionContext, bugInfo.command);
    }
    protected exeCommand() {
        switch (StoreInfo.bugReportBar.barStatus) {
            case BarStatus.wait: // Run Bug Report command from wait status.
                this.runWhenWait(MyEvent.WaitTime);
                break;
            case BarStatus.load: // Run Bug Report command from load status.
                this.runWhenLoad();
                break;
            case BarStatus.ready: // Run Bug Report command from ready status.
                this.runWhenReady();
                break;
            default:
                this.default();
                break;
        }
    }

    protected prepareJob(): boolean {
        if (!vscode.workspace.rootPath) {
            return false;
        }
        return true;
    }

    protected runWhenWait(seconds: number) {
        if (!this.prepareJob()) {
            vscode.window.showErrorMessage("Please open a folder.");
            return;
        }
        StoreInfo.bugReportBar.setLoad(); //Run from wait mode will put status into load mode first. then wait for work finish.
        new BugReportWebPanel();
        return new Promise((resolve, reject) => {
            let num = 0;
            let handle: NodeJS.Timeout = setInterval(() => {
                if (StoreInfo.bugReportWebPanel.isReady()) {
                    clearInterval(handle);
                    StoreInfo.bugReportBar.setReady();
                } else if (num === seconds * 10) {
                    vscode.window.showInformationMessage("Time Out");
                    StoreInfo.bugReportWebPanel.deletePanel();
                    clearInterval(handle);
                    StoreInfo.bugReportBar.setWait();
                }
                num++;
            }, 100);

            MyEvent.eventEmitter.addListener("exit", () => {
                vscode.window.showInformationMessage("Work Cancel.");
                StoreInfo.bugReportWebPanel.deletePanel();
                clearInterval(handle);
                reject();
            });
        });
    }

    protected runWhenLoad() {
        let promise = vscode.window.showInformationMessage(
            "Waiting for loading...",
            "WAIT LOAD",
            "CANCEL"
        );
        promise.then(function (result) {
            if (StoreInfo.bugReportBar.isLoad() && result === "CANCEL") {
                MyEvent.eventEmitter.emit("exit");
                StoreInfo.bugReportBar.setWait();
            }
        });
    }

    protected runWhenReady() {
        StoreInfo.bugReportBar.setWait();
        // StoreInfo.bugReportWebPanel.deletePanel();
        ClearStore();
    }

    protected default() {
        vscode.window.showErrorMessage("Error Bar status.");
        StoreInfo.bugReportBar.setWait();
    }
}

export { BugReportCommand };
