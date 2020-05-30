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
        switch (message.command) {
            case "3dCodeGraph":
                const rootPath = vscode.workspace.rootPath;
                if (rootPath) {
                    const fileName = message.text+".json";
                    const filePath = path.join(
                        rootPath,
                        "3D_CODE_GRAPH",
                        fileName
                    );
                    const data = fs.readFileSync(filePath, "utf-8");
                    this.webPanel.webview.postMessage({
                        status: "3dCodeGraph",
                        filePath: filePath,
                        data: data,
                    });
                } else {
                    vscode.window.showErrorMessage("Cannot find a workspace.");
                }
                break;
            case "toSomeWhere":
                // const filePathUri = vscode.Uri.file(message.path);
                if (ActivateVscodeContext.activeEditor) {
                    const filePathUri =
                        ActivateVscodeContext.activeEditor.document.uri;
                    const lineNumber = message.line;
                    const startPosition = message.start;
                    const endPosition = message.end;

                    // vscode.window.showInformationMessage(
                    //     `filePathUri: ${filePathUri}`
                    // );

                    this.LoadTag(
                        filePathUri,
                        lineNumber,
                        startPosition,
                        endPosition
                    );

                    let range: vscode.Range = new vscode.Range(
                        lineNumber,
                        startPosition,
                        lineNumber,
                        endPosition
                    );

                    vscode.window.showTextDocument(filePathUri, {
                        selection: range,
                        viewColumn: 2,
                    });
                } else {
                    vscode.window.showErrorMessage(
                        "Open a long lines file for test."
                    );
                }

                break;
        }
    }

    protected LoadTag(
        uri: vscode.Uri,
        lineNumber: number,
        start: number,
        end: number
    ) {
        const preKey: string = LineTagManager.assemblyKey(uri, lineNumber);

        if (LineTagManager.findLineTag(preKey) === undefined) {
            const key = LineTagForceGraph3DManager.createLineTag(
                uri,
                lineNumber,
                start,
                end
            );
        } else {
            if (!LineTagManager.deleteLineTag(preKey)) {
                vscode.window.showErrorMessage("deleteLineTag false.");
            }
        }
    }
}
