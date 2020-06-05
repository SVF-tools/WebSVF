"use strict";
import * as vscode from "vscode";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";
import { StatusBarForceGraph3DManager } from "./StatusBar";
import { WebPanelForceGraph3DManager, WebPanelForceGraph3D } from "./WebPanel";
import { WebPanelManager, WebViewInfo } from "../../components/WebPanel";
import * as CommonInterface from "./CommonInterface";

import { LineTagManager, LineTag } from "../../components/LineTag";
import { LineTagForceGraph3DManager } from "./LineTag";

import * as path from "path";

export class RegisterCommandForceGraph3DManager {
    private static _rcf: RegisterCommandForceGraph3D | undefined = undefined;
    private static _rct: RegisterCommandTextControl | undefined = undefined;
    private static _rcn: RegisterCommandForceNodeNext | undefined = undefined;
    private static _rcb: RegisterCommandForceNodeBefore | undefined = undefined;
    private static _rcu: RegisterCommandSelectRangeUp | undefined = undefined;
    private static _rcd: RegisterCommandSelectRangeDown | undefined = undefined;
    public static get rcd(): RegisterCommandSelectRangeDown | undefined {
        return RegisterCommandForceGraph3DManager._rcd;
    }
    public static get rct(): RegisterCommandTextControl | undefined {
        return RegisterCommandForceGraph3DManager._rct;
    }
    public static get rcf(): RegisterCommandForceGraph3D | undefined {
        return RegisterCommandForceGraph3DManager._rcf;
    }
    public static get rcn(): RegisterCommandForceNodeNext | undefined {
        return RegisterCommandForceGraph3DManager._rcn;
    }
    public static get rcu(): RegisterCommandSelectRangeUp | undefined {
        return RegisterCommandForceGraph3DManager._rcu;
    }
    public static get rcb(): RegisterCommandForceNodeBefore | undefined {
        return RegisterCommandForceGraph3DManager._rcb;
    }
    public static initial(coreData: CommonInterface.ConfigPath): boolean {
        if (this._rcf === undefined) {
            this._rcf = new RegisterCommandForceGraph3D(coreData);
            this._rct = new RegisterCommandTextControl(coreData);
            this._rcn = new RegisterCommandForceNodeNext(coreData);
            this._rcb = new RegisterCommandForceNodeBefore(coreData);
            this._rcu = new RegisterCommandSelectRangeUp(coreData);
            this._rcd = new RegisterCommandSelectRangeDown(coreData);
            return true;
        }
        return false;
    }
}

export class RegisterCommandSelectRangeUp extends CommonInterface.RegisterCommand {
    constructor(protected coreData: CommonInterface.ConfigPath) {
        super(coreData, "SelectRangeUp");
    }
    protected mainFunc() {
        // vscode.window.showInformationMessage("UP");
        let activeEditor = vscode.window.activeTextEditor;
    }

    protected SendInfo(message: any) {
        WebPanelForceGraph3DManager.getPanel()?.webPanel.webview.postMessage(
            message
        );
    }
}

export class RegisterCommandSelectRangeDown extends CommonInterface.RegisterCommand {
    constructor(protected coreData: CommonInterface.ConfigPath) {
        super(coreData, "SelectRangeDown");
    }
    protected mainFunc() {
        vscode.window.showInformationMessage("DOWN");
    }

    protected SendInfo(message: any) {
        WebPanelForceGraph3DManager.getPanel()?.webPanel.webview.postMessage(
            message
        );
    }
}

export class RegisterCommandForceNodeNext extends CommonInterface.RegisterCommand {
    constructor(protected coreData: CommonInterface.ConfigPath) {
        super(coreData, "ForceNodeNext");
    }
    protected mainFunc() {
        // vscode.window.showInformationMessage("NEXT");
        this.SendInfo({ status: "ForceNodeNext" });
    }

    protected SendInfo(message: any) {
        WebPanelForceGraph3DManager.getPanel()?.webPanel.webview.postMessage(
            message
        );
    }
}

export class RegisterCommandForceNodeBefore extends CommonInterface.RegisterCommand {
    constructor(protected coreData: CommonInterface.ConfigPath) {
        super(coreData, "ForceNodeBefore");
    }
    protected mainFunc() {
        // vscode.window.showInformationMessage("BEFORE");
        this.SendInfo({ status: "ForceNodeBefore" });
    }

    protected SendInfo(message: any) {
        WebPanelForceGraph3DManager.getPanel()?.webPanel.webview.postMessage(
            message
        );
    }
}

export class RegisterCommandTextControl extends CommonInterface.RegisterCommand {
    constructor(protected coreData: CommonInterface.ConfigPath) {
        super(coreData, "TextControl");
    }
    protected mainFunc() {
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && WebPanelForceGraph3DManager.key) {
            this.SendToWebPage(activeEditor);
        }
    }

    protected SendToWebPage(activeEditor: vscode.TextEditor) {
        const rootPath = vscode.workspace.rootPath;
        if (!rootPath) {
            console.log("ERROR rootPath: ", rootPath);
        } else {
            let KeyList = this.generateFileInfo(activeEditor);
            let uri = activeEditor.document.uri;
            let flag = "TextControl";
            console.log("KeyList.size: ", KeyList.size);
            let message = {
                status: "NodeHighLight",
                selections: new Array(),
            };

            KeyList.forEach((lineNumber, preKey) => {
                let highLightSwitch = true; // default is node turn on.
                if (LineTagManager.findLineTag(preKey, flag)) {
                    highLightSwitch = false; // There is key means the node has been turn on, so turn off it.
                }
                let selection = this.generateSelectInfo(
                    activeEditor.document.fileName.replace(rootPath + "/", ""),
                    highLightSwitch,
                    lineNumber + 1
                ); // lineNumber +1 is current line number
                message.selections.push(selection);
            });
            this.SendInfo(message);
        }
    }

    public HandleHightLight(message: any) {
        console.log("message:", message);
        this.hightLight(message);
        this.Load();
    }

    protected hightLight(message: any) {
        const rootPath = vscode.workspace.rootPath;
        if (rootPath) {
            let selections = message.selections;
            let info = this.generateHighLightInfo(selections, true);
            console.log("selections: ", info);
            let flag = "TextControl";
            info.forEach((data) => {
                console.log("uri: ", data.uri);
                LineTagManager.turnOff(data.preKey, flag, "saveByFlag"); // delete all not TextControl select
                if (LineTagManager.findLineTag(data.preKey, flag)) {
                    if (!LineTagManager.deleteLineTagBase(data.preKey)) {
                        vscode.window.showErrorMessage("deleteLineTag false.");
                    }
                } else {
                    const key = LineTagForceGraph3DManager.createLineTag(
                        data.uri,
                        data.line,
                        0,
                        0,
                        "Theme_2",
                        "TextControl"
                    );
                    console.log("key: ", key);
                }
            });
        }
    }

    protected generateHighLightInfo(
        selections: any,
        mode: boolean
    ): Array<{ preKey: string; uri: vscode.Uri; line: number }> {
        let info = new Array();
        const rootPath = vscode.workspace.rootPath;
        if (rootPath) {
            selections.forEach(
                (selection: {
                    fileName: string;
                    line: number;
                    switch: boolean;
                }) => {
                    if (selection.switch === mode) {
                        const uri = vscode.Uri.file(
                            path.join(rootPath, selection.fileName)
                        );
                        const line = selection.line - 1;
                        const preKey = LineTagManager.assemblyKey(uri, line);
                        info.push({ preKey, uri, line });
                    }
                }
            );
        }
        return info;
    }

    protected generateKeyList(info: Map<string, number>) {
        let KeyList = new Map<string, number>();

        info.forEach((line, filename) => {
            let uri = vscode.Uri.file(filename);
            const preKey = LineTagManager.assemblyKey(uri, line);
            KeyList.set(preKey, line);
        });
        return KeyList;
    }
    protected SendInfo(message: any) {
        WebPanelForceGraph3DManager.getPanel()?.webPanel.webview.postMessage(
            message
        );
    }

    protected Load() {
        let settings = vscode.workspace.getConfiguration("codeMap");
        let graphMode = settings.get("GraphMode");
        switch (graphMode) {
            case "NotSelect":
                LineTagManager.UnLoadDecoration();
                break;
            default:
                LineTagManager.LoadDecoration();
                break;
        }
    }

    protected generateSelectInfo(
        fileName: string,
        lineSwitch: boolean,
        lineNumber: number
    ) {
        let message = {
            fileName: fileName,
            switch: lineSwitch,
            line: lineNumber,
        };
        return message;
    }

    protected generateFileInfo(
        activeEditor: vscode.TextEditor
    ): Map<string, number> {
        let KeyList = new Map<string, number>();
        let selections = activeEditor.selections;
        let uri = vscode.Uri.file(activeEditor.document.fileName);
        selections.forEach((element) => {
            for (
                let lineNumber = element.start.line;
                lineNumber <= element.end.line;
                lineNumber++
            ) {
                const preKey = LineTagManager.assemblyKey(uri, lineNumber);
                KeyList.set(preKey, lineNumber);
            }
        });
        return KeyList;
    }
}

export class RegisterCommandForceGraph3D extends CommonInterface.RegisterCommand {
    constructor(protected coreData: CommonInterface.ConfigPath) {
        super(coreData, "ForceGraph3D");
    }

    protected mainFunc() {
        // vscode.window.showInformationMessage("3D FORCE GRAPH");
        if (StatusBarForceGraph3DManager.switchTurn()) {
            ActivateVscodeContext.activeEditor = vscode.window.activeTextEditor;
            this.loadWebPanel();
        }
    }
    public turnAndLoad() {
        StatusBarForceGraph3DManager.barSituation =
            CommonInterface.BarSituation.going;
        this.mainFunc();
    }
    protected loadWebPanel() {
        if (
            StatusBarForceGraph3DManager.switchBar ===
            CommonInterface.SwitchBar.on
        ) {
            const webViewInfo: WebViewInfo = WebPanelManager.generateWebViewInfo(
                this.coreData.PanelConfigPath
            );
            const newWebPanel: WebPanelForceGraph3D = new WebPanelForceGraph3D(
                webViewInfo.webInfo
            );
            WebPanelForceGraph3DManager.createPanel(
                this.coreData.PanelConfigPath,
                newWebPanel
            );
            this.changeConfigForHightLine(CommonInterface.statusHighLight.show);
        } else {
            WebPanelForceGraph3DManager.deletePanel();
            this.changeConfigForHightLine(CommonInterface.statusHighLight.hide);
        }
    }

    protected changeConfigForHightLine(
        status: CommonInterface.statusHighLight
    ) {
        let settings = vscode.workspace.getConfiguration("codeMap");
        let Flag = 0;
        switch (status) {
            case CommonInterface.statusHighLight.show:
                Flag = 1;
                settings.update("ShowOrHide", "show").then(showInfo);
                break;
            case CommonInterface.statusHighLight.hide:
                Flag = 2;
                settings.update("ShowOrHide", "hide").then(showInfo);
                break;
            default:
                Flag = 3;
                settings.update("ShowOrHide", "hide").then(showInfo);
                break;
        }

        function showInfo() {
            // vscode.window.showInformationMessage(`Flag: ${Flag}`);
        }
    }
}
