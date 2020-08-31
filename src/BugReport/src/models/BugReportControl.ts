import * as vscode from "vscode";
import * as webControl from "../config/BugReportControl.json";
import * as fs from "fs";
import * as path from "path";
import { StoreInfo } from "../storeInfo";

enum BugReportMode {
    WORK,
    TEST,
}

class BugReportControl {
    private _bugReportData: string = "";
    protected get bugReportData(): string {
        return this._bugReportData;
    }
    constructor(protected mode: BugReportMode) {
        this.setReportData();
    }

    protected isTest(): boolean {
        return this.mode === BugReportMode.TEST ? true : false;
    }

    protected setReportData(): boolean {
        switch (this.mode) {
            case BugReportMode.WORK:
                let rootPath = vscode.workspace.rootPath;
                if (!rootPath) {
                    this._bugReportData = "";
                    return false;
                }
                let filepath: string = path.join(
                    rootPath,
                    webControl["folder"],
                    webControl["fileName"]
                );
                if (!fs.existsSync(filepath)) {
                    this._bugReportData = "";
                    return false;
                } else {
                    this._bugReportData = fs.readFileSync(filepath, "utf-8");
                }
                break;
            case BugReportMode.TEST:
                let testpath: string = path.join(
                    StoreInfo.extensionContext.extensionPath,
                    webControl["testFolder"],
                    webControl["fileName"]
                );
                this._bugReportData = fs.readFileSync(testpath, "utf-8");
                break;
        }
        return true;
    }

    public reportGenerate(filename: string): boolean {
        let rootPath = vscode.workspace.rootPath;
        if (!rootPath) {
            return false;
        }
        let filepath = this.isTest()
            ? path.join(
                  StoreInfo.extensionContext.extensionPath,
                  webControl["testFolder"],
                  filename
              )
            : path.join(rootPath, webControl["folder"], filename);
        return true;
    }
}

export { BugReportMode, BugReportControl };
