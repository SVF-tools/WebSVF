"use strict";
import * as vscode from "vscode";
import * as path from "path";
import { ActivateVscodeContext } from "./ActivateVscodeContext";
import { ConventPage } from "./ConventPage";

export interface WebInfo {
    [key: string]: string | boolean | vscode.ViewColumn;

    viewType: string; // view type
    title: string; // show title
    column: vscode.ViewColumn; // where to show
    enableScripts: boolean; // use js script or not
    localResourceRoots: string; // where to find source, "web-part" is default.
    webLocation: string; //web location
}

export interface WebViewInfo {
    [key: string]: string | WebInfo;
    key: string;
    webInfo: WebInfo;
}

export enum WebStatus {
    complete,
    incomplete,
}

export class WebPanelManager {
    //All WebPanel store here
    private static _webPanelUnit: Map<string, WebPanel> = new Map();

    //Through Json File Info create Web Panel
    public static createWebPanelByJsonFile(
        filePath: string,
        newWebPanel?: WebPanel
    ): boolean {
        const webViewInfo: WebViewInfo = this.generateWebViewInfo(filePath);
        return this.createWebPanel(webViewInfo, newWebPanel);
    }

    //Create Web Panel
    public static createWebPanel(
        webViewInfo: WebViewInfo,
        newWebPanel?: WebPanel
    ): boolean {
        if (this.findWebPanel(webViewInfo.key) === undefined) {
            let newPanel: WebPanel;
            if (newWebPanel !== undefined) {
                newPanel = newWebPanel;
            } else {
                newPanel = new WebPanel(webViewInfo.webInfo);
            }
            WebPanelManager._webPanelUnit.set(webViewInfo.key, newPanel);
            return true;
        }
        return false;
    }

    //Find Web Panel
    public static findWebPanel(key: string): WebPanel | undefined {
        return WebPanelManager._webPanelUnit.get(key);
    }
    //Add Web Panel
    public static AddWebPanel(key: string, webPanel: WebPanel): boolean {
        if (!WebPanelManager._webPanelUnit.has(key)) {
            WebPanelManager._webPanelUnit.set(key, webPanel);
            return true;
        }
        return false;
    }
    //Delete Web Panel
    public static deleteWebPanel(key: string): boolean {
        if (WebPanelManager._webPanelUnit.has(key)) {
            const delPanel:
                | WebPanel
                | undefined = WebPanelManager._webPanelUnit.get(key);
            if (delPanel === undefined) {
                return false;
            }
            delPanel.dispose();
            WebPanelManager._webPanelUnit.delete(key);
            return true;
        }
        return false;
    }

    public static generateWebViewInfo(filePath: string): WebViewInfo {
        const webViewInfo: WebViewInfo = {
            key: this.recognizeKey(filePath),
            webInfo: this.assemblyWebInfoFromJsonFile(filePath),
        };
        return webViewInfo;
    }

    public static recognizeKey(filePath: string): string {
        const info = require(filePath);
        const key = info["name"];
        return key;
    }
    //Assembly Info from Json file to Web Info
    public static assemblyWebInfoFromJsonFile(filePath: string): WebInfo {
        // require json config file
        const webViewInfo = require(filePath);
        const info = webViewInfo["WebInfo"];
        // Only "active" can be recognize. if you want more function, upgrade here.
        let column: vscode.ViewColumn = vscode.ViewColumn.One;
        if (info["column"] === "active") {
            column =
                vscode.window.activeTextEditor &&
                vscode.window.activeTextEditor.viewColumn
                    ? vscode.window.activeTextEditor.viewColumn
                    : vscode.ViewColumn.One;
        }
        const webInfo: WebInfo = {
            viewType: info["viewType"],
            title: info["title"],
            column: column,
            enableScripts: info["enableScripts"],
            localResourceRoots: info["localResourceRoots"],
            webLocation: info["webLocation"],
        };
        return webInfo;
    }
}

export class WebPanel {
    private _webPanel: vscode.WebviewPanel;
    private _webStatus: WebStatus;
    protected get webStatus(): WebStatus {
        return this._webStatus;
    }
    protected set webStatus(value: WebStatus) {
        this._webStatus = value;
    }
    public webReady() {
        return this.webStatus === WebStatus.complete ? true : false;
    }
    public get webPanel(): vscode.WebviewPanel {
        return this._webPanel;
    }
    public set webPanel(value: vscode.WebviewPanel) {
        this._webPanel = value;
    }

    protected disposables: vscode.Disposable[] = [];
    protected readonly extensionPath: string =
        ActivateVscodeContext.context.extensionPath;

    constructor(webInfo: WebInfo) {
        this._webStatus = WebStatus.incomplete;
        // Through Web Info set and create a vscode web view.
        let rootPath = vscode.workspace.rootPath;
        if (!rootPath) {
            rootPath = path.join(
                this.extensionPath,
                webInfo["localResourceRoots"]
            );
        }
        this._webPanel = vscode.window.createWebviewPanel(
            webInfo["viewType"],
            webInfo["title"],
            webInfo["column"],
            {
                // Enable javascript in the webview
                enableScripts: webInfo["enableScripts"],
                // And restrict the webview to only loading content from our extension's `media` directory.
                localResourceRoots: [
                    vscode.Uri.file(
                        path.join(
                            this.extensionPath,
                            webInfo["localResourceRoots"]
                        )
                    ),
                    vscode.Uri.file(rootPath),
                    vscode.Uri.file(
                        path.join(this.extensionPath, "node_modules")
                    ),
                ],
                retainContextWhenHidden: true,
            }
        );
        // When panel close dispose all resources whatever user or program close it.
        this._webPanel.onDidDispose(
            () => this.dispose(),
            null,
            this.disposables
        );

        // Set the webview 's initial html content
        this._webPanel.webview.html = ConventPage.ConventHtml(
            webInfo["webLocation"]
        );

        // Handle messages from the webview
        this._webPanel.webview.onDidReceiveMessage(
            (message) => this.receiveMessage(message),
            null,
            this.disposables
        );
    }

    protected receiveMessage(message: any) {
        switch (message.command) {
            case "error":
                vscode.window.showErrorMessage(message.text);
                break;
            case "info":
                vscode.window.showInformationMessage(message.text);
                break;
            case "connect":
                this._webStatus = WebStatus.complete;
                this.webPanel.webview.postMessage({
                    status: "connected",
                });
                break;
        }
    }

    // Clean up resources
    public dispose() {
        this._webPanel.dispose();
        this.disposables.forEach((element) => {
            element.dispose();
        });
        this.disposables = [];
    }
}
