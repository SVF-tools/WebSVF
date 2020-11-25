import * as vscode from "vscode";
import * as configInfo from "./config.json";
import * as data from "../data";
import * as path from "path";
import * as fs from "fs";

export class Config {

    private _command = {
        INSTALL_ENV: configInfo.command.INSTALL_ENV,
        OPEN_TARGET: configInfo.command.OPEN_TARGET,
        OPEN_BACKEND: configInfo.command.OPEN_BACKEND,
        BUILD_BACKEND: configInfo.command.BUILD_BACKEND,
        BUILD_TARGET: configInfo.command.BUILD_TARGET,
        SHOW_REPORT: configInfo.command.SHOW_REPORT,
        SHOW_CODEMAP: configInfo.command.SHOW_CODEMAP,
        REBUILD_BACKEND: configInfo.command.REBUILD_BACKEND
    };

    private _pathType = {
        TARGET_PATH: "TARGET_PATH",
        EXAMPLE_PATH: "EXAMPLE_PATH",
        BACKEND_PATH: "BACKEND_PATH",
        ENVIRONMENT_SCRIPT_PATH: "ENVIRONMENT_SCRIPT_PATH",
        SVG_RESULT_PATH: "SVG_RESULT_PATH",
        LOG_PATH: "LOG_PATH"
    };

    private _statusbar = new Array();
    private _terminal = new Array();
    private _path = new Array();
    private _webview = new Array();

    public get command() {
        return this._command;
    }

    public get pathType() {
        return this._pathType;
    }


    public get statusbar() {
        return this._statusbar;
    }

    public get terminal() {
        return this._terminal;
    }

    public get path() {
        return this._path;
    }

    public get webview() {
        return this._webview;
    }

    constructor() {
        this.analysis(configInfo);
        // this.test();
    }

    private test() {
        let rootPath = data.rootPath();

        if (rootPath) {

            let filePath = path.join(rootPath, "config.json");

            const data1 = JSON.stringify(this.command, null, 4);
            const data2 = JSON.stringify(this.statusbar, null, 4);
            const data3 = JSON.stringify(this.terminal, null, 4);
            const data4 = JSON.stringify(this.webview, null, 4);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            fs.appendFileSync(filePath, data1);
            fs.appendFileSync(filePath, data2);
            fs.appendFileSync(filePath, data3);
            fs.appendFileSync(filePath, data4);
        }
    }
    private analysis(config: any) {

        for (let element in config) {
            switch (element) {
                case "statusbar":
                    this._statusbar = config[element];
                    this.analysisBarInfo(this._statusbar);
                    break;
                case "terminal":
                    this._terminal = config[element];
                    this.analysisTerminalInfo(this._terminal);
                    break;
                case "webview":
                    this._webview = config[element];
                    break;
                case "path":
                    this._path = config[element];
                    break;
                default:
                    break;
            }
        }

    }

    private analysisBarInfo(statusbar: any[]) {

        statusbar.forEach((element) => {
            element.alignment =
                element.alignment === "left"
                    ? vscode.StatusBarAlignment.Left
                    : vscode.StatusBarAlignment.Right;
        });

    }

    private analysisTerminalInfo(terminal: any[]) {

        terminal.forEach((element) => {
            element.script = `${element.exeHead} ${path.join(
                data.extensionPath(),
                element.scriptPath
            )}`;
        });

    }

    public analysisPathInfo(thepath: any[]): any[] {
        // path need analysis when just use, it cannot just analysis only inisial.
        let result = [...thepath]; // copy a new path info

        result.forEach((element) => {
            this.analysisPathInfoElement(element); // change on result itself
        });

        return result;
    }

    private analysisPathInfoElement(element: any) {
        // change on element itself
        switch (element.position) {
            case "home":
                element.position = data.userHome();
                break;
            case "extension":
                element.position = data.extensionPath();
                break;
            case "root":
                element.position = data.rootPath(); // it should analysised by using time.
                break;
            default:
                break;
        }

        element.folder = path.join(element.position, element.folder);
        element.mainFile = path.join(element.folder, element.mainFile);

        if (element.openFlag) {
            element.openFlag = path.join(
                data.extensionPath(),
                element.openFlag
            );
        }
    }

    public getPathInfo(key: string) {

        let result = this.getElementInfo(this.path, key); // copy a new element.
        let element = { ...result };// deep copy

        if (element) {
            this.analysisPathInfoElement(element); // change on new element
        } else {
            console.log(`[ERROR]: getPathInfo element is ${element}`);
        }

        return element;
    }

    public getTerminialInfo(key: string) {
        return this.getElementInfo(this.terminal, key);
    }

    public getStatusbarInfo(key: string) {
        return this.getElementInfo(this.statusbar, key);
    }

    public getWeibviewInfo(key: string) {
        return this.getElementInfo(this.webview, key);
    }

    private getElementInfo(type: any[], key: string) {
        let result = type.filter((element) => {
            return element.key === key;
        });
        switch (result.length) {
            case 0:
                return undefined;
            case 1:
                return result[0];
            default:
                console.log(
                    `[ERROR]: getElement key result: ${result} should only one element.`
                );
                return result[0];
        }
    }

    public getTerminialInfoFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.terminal, command);
    }

    public getStatusbarInfoFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.statusbar, command);
    }

    public getWebviewInfoFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.webview, command);
    }

    public getTerminialKeyFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.terminal, command)[0].key;
    }

    public getStatusbarKeyFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.statusbar, command)[0].key;
    }

    public getWebviewIKeyFromCommand(command: string) {
        return this.getElementInfoFromCommand(this.webview, command)[0].key;
    }

    private getElementInfoFromCommand(type: any[], command: string) {
        return type.filter((element) => {
            return element.command === command;
        });
    }
}