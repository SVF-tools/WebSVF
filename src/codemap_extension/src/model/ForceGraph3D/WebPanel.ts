"use strict";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {
    WebPanelManager,
    WebPanel,
    WebInfo,
    WebViewInfo,
} from "../../components/WebPanel";

import { AbsPath } from "../../components/AbsPath";

import { LineTagManager, LineTag } from "../../components/LineTag";
import { LineTagForceGraph3DManager } from "./LineTag";

import { StatusBarForceGraph3DManager } from "./StatusBar";
import { RegisterCommandForceGraph3DManager } from "./Command";
import * as CommonInterface from "./CommonInterface";

import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";

export class WebPanelForceGraph3DManager {
    private static _key: string | undefined = undefined;
    public static get key(): string | undefined {
        return WebPanelForceGraph3DManager._key;
    }

    public static createPanel(
        filePath: string,
        newWebPanel?: WebPanel
    ): boolean {
        if (
            this._key === undefined &&
            WebPanelManager.createWebPanelByJsonFile(filePath, newWebPanel)
        ) {
            this._key = WebPanelManager.recognizeKey(filePath);
            return true;
        }
        return false;
    }

    public static deletePanel(): boolean {
        if (
            this.key !== undefined &&
            WebPanelManager.deleteWebPanel(this.key)
        ) {
            this._key = undefined;
            return true;
        }
        return false;
    }

    public static getPanel(): WebPanel | undefined {
        if (this._key !== undefined) {
            return WebPanelManager.findWebPanel(this._key);
        }
        return undefined;
    }

    public static webReady(): boolean {
        const panel: WebPanel | undefined = this.getPanel();
        return panel !== undefined ? panel.webReady() : false;
    }

    public static hasKey(): boolean {
        if (this._key !== undefined) {
            return true;
        }
        return false;
    }
}

export class WebPanelForceGraph3D extends WebPanel {
    constructor(webInfo: WebInfo) {
        super(webInfo);
        this.webPanel.onDidDispose(
            () => {
                if (
                    StatusBarForceGraph3DManager.switchBar ===
                    CommonInterface.SwitchBar.on
                ) {
                    RegisterCommandForceGraph3DManager.rcf?.turnAndLoad();
                    return;
                } else {
                    this.dispose();
                }
            },
            null,
            this.disposables
        );
    }

    protected receiveMessage(message: any) {
        super.receiveMessage(message);
        console.log(message);
        switch (message.command) {
            case "3dCodeGraph":
                this.CodeGraphShow(message);
                break;
            case "toSomeWhereHighLight":
                this.CodeHightLight(message);
                break;
            case "toSomeWhere":
                this.CodeFindPosition(message);
                break;
            case "NodeHighLight":
                this.NodeHightLight(message);
                break;
        }
    }
    protected NodeHightLight(message: any) {
        RegisterCommandForceGraph3DManager.rct?.HandleHightLight(message);
    }
    protected CodeGraphShow(message: any) {
        let rootPath = vscode.workspace.rootPath;
        if (!rootPath) {
            vscode.window.showErrorMessage("Cannot find a workspace.");
            return;
        }
        let settings = vscode.workspace.getConfiguration("codeMap");
        settings.update("GraphMode", message.text).then();
        let graphFileName = message.text + ".json";
        let graphFilePath = path.join(rootPath, "3D_CODE_GRAPH", graphFileName);
        const data = fs.readFileSync(graphFilePath, "utf-8");
        this.webPanel.webview.postMessage({
            status: "3dCodeGraph",
            filePath: graphFilePath,
            data: data,
        });
        LineTagManager.clear();
    }
    protected FindPosition(
        message: any
    ): CommonInterface.PositionInfo | undefined {
        let rootPath = vscode.workspace.rootPath;
        if (!rootPath) {
            vscode.window.showErrorMessage("Cannot find a workspace.");
            return;
        }
        let linkFilePath = path.join(rootPath, message.path);
        let exitFile = true;
        fs.access(linkFilePath, function (err) {
            if (err) {
                exitFile = false;
            }
        });
        if (!exitFile) {
            vscode.window.showErrorMessage("Cannot find " + linkFilePath);
            return;
        }
        const info: CommonInterface.PositionInfo = {
            filePathUri: vscode.Uri.file(linkFilePath),
            lineNumber: message.line - 1,
            startPosition: message.start,
            endPosition: message.end,
            themeName: message.themeName,
            flag: message.flag,
        };
        return info;
    }
    protected CodeHightLight(
        message: any
    ): CommonInterface.PositionInfo | undefined {
        const info:
            | CommonInterface.PositionInfo
            | undefined = this.CodeFindPosition(message);
        if (!info) {
            return;
        }

        this.LoadTagInfo(info);
        return info;
    }
    protected CodeFindPosition(
        message: any
    ): CommonInterface.PositionInfo | undefined {
        const info:
            | CommonInterface.PositionInfo
            | undefined = this.FindPosition(message);
        if (!info) {
            return;
        }
        let range: vscode.Range = new vscode.Range(
            info.lineNumber,
            info.startPosition,
            info.lineNumber,
            info.endPosition
        );

        vscode.window.showTextDocument(info.filePathUri, {
            selection: range,
            viewColumn: 2,
        });
        return info;
    }
    protected LoadTagInfo(info: CommonInterface.PositionInfo) {
        this.LoadTag(
            info.filePathUri,
            info.lineNumber,
            info.startPosition,
            info.endPosition,
            info.themeName,
            info.flag
        );
    }
    protected LoadTag(
        uri: vscode.Uri,
        lineNumber: number,
        start: number,
        end: number,
        themeName: string,
        flag: string
    ) {
        const preKey: string = LineTagManager.assemblyKey(uri, lineNumber);

        if (LineTagManager.findLineTag(preKey) === undefined) {
            const key = LineTagForceGraph3DManager.createLineTag(
                uri,
                lineNumber,
                start,
                end,
                themeName,
                flag
            );
            console.log("key: ", key);
        } else {
            if (!LineTagManager.deleteLineTag(preKey)) {
                vscode.window.showErrorMessage("deleteLineTag false.");
            }
        }
    }
}
