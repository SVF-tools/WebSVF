"use strict";
import * as vscode from "vscode";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";
import { StatusBarForceGraph3DManager } from "./StatusBar";
import { WebPanelForceGraph3DManager, WebPanelForceGraph3D } from "./WebPanel";
import { WebPanelManager, WebViewInfo } from "../../components/WebPanel";
import * as CommonInterface from "./CommonInterface";

import { LineTagManager, LineTag } from "../../components/LineTag";
import { LineTagForceGraph3DManager } from "./LineTag";

export class RegisterCommandForceGraph3DManager {
    private static _rcf: RegisterCommandForceGraph3D | undefined = undefined;
    private static _rct: RegisterCommandTextControl | undefined = undefined;
    public static get rct(): RegisterCommandTextControl | undefined {
        return RegisterCommandForceGraph3DManager._rct;
    }
    public static get rcf(): RegisterCommandForceGraph3D | undefined {
        return RegisterCommandForceGraph3DManager._rcf;
    }
    public static initial(coreData: CommonInterface.ConfigPath): boolean {
        if (this._rcf === undefined) {
            this._rcf = new RegisterCommandForceGraph3D(coreData);
            this._rct = new RegisterCommandTextControl(coreData);
            return true;
        }
        return false;
    }
}

export class RegisterCommandTextControl extends CommonInterface.RegisterCommand {
    constructor(protected coreData: CommonInterface.ConfigPath) {
        super(coreData, "TextControl");
    }
    protected mainFunc() {
        vscode.window.showInformationMessage("Text Control");
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && WebPanelForceGraph3DManager.key) {
            this.create(activeEditor);
            this.Load(activeEditor);
        }
    }

    protected create(activeEditor: vscode.TextEditor) {
        let KeyList = this.generateFileInfo(activeEditor);
        let uri = activeEditor.document.uri;
        let flag = "TextControl";
        console.log("KeyList.size: ", KeyList.size);
        KeyList.forEach((lineNumber, preKey) => {
            LineTagManager.turnOff(preKey, flag, "saveByFlag"); // delete all not TextControl select
            if (LineTagManager.findLineTag(preKey, flag)) {
                if (!LineTagManager.deleteLineTagBase(preKey)) {
                    vscode.window.showErrorMessage("deleteLineTag false.");
                }
            } else {
                const key = LineTagForceGraph3DManager.createLineTag(
                    uri,
                    lineNumber,
                    0,
                    0,
                    "Theme_2",
                    "TextControl"
                );
                console.log("key: ", key);
            }
        });
    }

    protected SendInfo() {
        const settings = vscode.workspace.getConfiguration("codeMap");
        const graphMode = settings.get("GraphMode");
        if (graphMode === "NotSelect") {
            vscode.window.showErrorMessage(
                "Please select a Graph Type. VFG or CFG etc."
            );
            return;
        }
    }

    protected Load(editor: vscode.TextEditor) {
        let settings = vscode.workspace.getConfiguration("codeMap");
        let graphMode = settings.get("GraphMode");
        let fsPath = editor.document.uri.fsPath;
        // vscode.window.showInformationMessage(`fsPath: ${fsPath}`);
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
        activeEditor: vscode.TextEditor,
        lineSwitch: boolean
    ) {
        let selections = activeEditor.selections;
        let message = {
            fileName: "",
            switch: true,
            selections: new Array<number>(),
        };
        message.fileName = activeEditor.document.fileName;
        message.switch = lineSwitch;
        selections.forEach((element) => {
            for (
                let lineNumber = element.start.line - 1;
                lineNumber <= element.end.line - 1;
                lineNumber++
            ) {
                message.selections.push(lineNumber);
            }
        });
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
