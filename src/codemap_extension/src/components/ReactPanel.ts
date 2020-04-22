"use strict";
import * as vscode from "vscode";
import * as path from "path";
import { ActivateVscodeContext } from "./ActivateVscodeContext";
import { ConventPage } from "./ConventPage";

// A standard of React Info
export interface ReactInfo {
    [key: string]: string | boolean | vscode.ViewColumn;

    viewType: string; // view type
    title: string; // show title
    column: vscode.ViewColumn; // where to show
    enableScripts: boolean; // use js script or not
    localResourceRoots: string; // where to find source, "build" is default.
}

// A standard of Web View Info
export interface WebViewInfo {
    [key: string]: string;
    sourcePath: string; // source path
    configJson: string; // config file under source path
    content: string; // config file core context name
    js: string; // the main js file key words in config file
    css: string; // the main css file key words in config file
}

// A standard of Vscode Uri Info
export interface VscodeUriInfo {
    [key: string]: vscode.Uri;
    sourceUri: vscode.Uri; // vscode source uri path
    scriptUri: vscode.Uri; // vscode script uri path
    styleUri: vscode.Uri; // vscode style uri path
}

export interface ForceGraphInfo {
    [key: string]: string | ReactInfo | WebViewInfo;
    key: string;
    reactInfo: ReactInfo;
    webViewInfo: WebViewInfo;
}

// A Management class for React Panel
export class ReactPanelManager {
    //All ReactPanel store here
    private static _reactPanelUnit: Map<string, ReactPanel> = new Map();
    //Create React Panel
    public static createReactPanel(
        forceGraphInfo: ForceGraphInfo,
        newReactPanel?: ReactPanel
    ): boolean {
        if (this.findReactPanel(forceGraphInfo.key) === undefined) {
            let newPanel: ReactPanel;
            if (newReactPanel !== undefined) {
                newPanel = newReactPanel;
            } else {
                newPanel = new ReactPanel(
                    forceGraphInfo.reactInfo,
                    forceGraphInfo.webViewInfo
                );
            }
            ReactPanelManager._reactPanelUnit.set(forceGraphInfo.key, newPanel);
            return true;
        }
        return false;
    }
    //Find React Panel
    public static findReactPanel(key: string): ReactPanel | undefined {
        return ReactPanelManager._reactPanelUnit.get(key);
    }
    //Add React Panel
    public static AddReactPanel(key: string, reactPanel: ReactPanel): boolean {
        if (!ReactPanelManager._reactPanelUnit.has(key)) {
            ReactPanelManager._reactPanelUnit.set(key, reactPanel);
            return true;
        }
        return false;
    }
    //Delete React Panel
    public static deleteReactPanel(key: string): boolean {
        if (ReactPanelManager._reactPanelUnit.has(key)) {
            const delPanel:
                | ReactPanel
                | undefined = ReactPanelManager._reactPanelUnit.get(key);
            if (delPanel === undefined) {
                return false;
            }
            delPanel.dispose();
            ReactPanelManager._reactPanelUnit.delete(key);
            return true;
        }
        return false;
    }
    //Through Json File Info create React Panel
    public static createReactPanelByJsonFile(
        filePath: string,
        newReactPanel?: ReactPanel
    ): boolean {
        const forceGraphInfo: ForceGraphInfo = this.createForceGraphInfo(
            filePath
        );
        return this.createReactPanel(forceGraphInfo, newReactPanel);
    }
    public static createForceGraphInfo(filePath: string): ForceGraphInfo {
        const forceGraphInfo: ForceGraphInfo = {
            key: this.recognizeKey(filePath),
            reactInfo: this.assemblyReactInfoFromJsonFile(filePath),
            webViewInfo: this.assemblyWebViewInfoFromJsonFile(filePath),
        };
        return forceGraphInfo;
    }
    public static recognizeKey(filePath: string): string {
        const allInfo = require(filePath);
        const key = allInfo["name"];
        return key;
    }
    //Assembly Info from Json file to React Info
    public static assemblyReactInfoFromJsonFile(filePath: string): ReactInfo {
        // require json config file
        const allInfo = require(filePath);
        const info = allInfo["ReactInfo"];
        // Only "active" can be recognize. if you want more function, upgrade here.
        let column: vscode.ViewColumn = vscode.ViewColumn.One;
        if (info["column"] === "active") {
            column =
                vscode.window.activeTextEditor &&
                vscode.window.activeTextEditor.viewColumn
                    ? vscode.window.activeTextEditor.viewColumn
                    : vscode.ViewColumn.One;
        }
        const reactInfo: ReactInfo = {
            viewType: info["viewType"],
            title: info["title"],
            column: column,
            enableScripts: info["enableScripts"],
            localResourceRoots: info["localResourceRoots"],
        };
        return reactInfo;
    }

    //Assembly Info from Json file to Web View Info
    public static assemblyWebViewInfoFromJsonFile(
        filePath: string
    ): WebViewInfo {
        // require json config file
        const allInfo = require(filePath);
        const info = allInfo["WebViewInfo"];

        const webViewInfo: WebViewInfo = {
            sourcePath: info["sourcePath"],
            configJson: info["configJson"],
            content: info["content"],
            js: info["js"],
            css: info["css"],
        };
        return webViewInfo;
    }
}

export class ReactPanel {
    protected _reactPanel: vscode.WebviewPanel;
    public get reactPanel(): vscode.WebviewPanel {
        return this._reactPanel;
    }
    protected disposables: vscode.Disposable[] = [];
    protected readonly extensionPath: string =
        ActivateVscodeContext.context.extensionPath;

    constructor(reactInfo: ReactInfo, webViewInfo: WebViewInfo) {
        // Through React Info set and create a vscode web view.
        this._reactPanel = vscode.window.createWebviewPanel(
            reactInfo["viewType"],
            reactInfo["title"],
            reactInfo["column"],
            {
                // Enable javascript in the webview
                enableScripts: reactInfo["enableScripts"],
                // And restrict the webview to only loading content from our extension's `media` directory.
                localResourceRoots: [
                    vscode.Uri.file(
                        path.join(
                            this.extensionPath,
                            reactInfo["localResourceRoots"]
                        )
                    ),
                ],
            }
        );
        // When panel close dispose all resources whatever user or program close it.
        this.reactPanel.onDidDispose(
            () => this.dispose(),
            null,
            this.disposables
        );

        // Set the webview 's initial html content
        this.reactPanel.webview.html = ConventPage.ConventHtml(
            "./build/react-part/index.html"
        );

        //TODO:
        //Transfer information between frames

        // Handle messages from the webview
        this.reactPanel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case "alert":
                        vscode.window.showErrorMessage(message.text);
                        break;
                }
            },
            null,
            this.disposables
        );
    }

    // Clean up resources
    public dispose() {
        this.reactPanel.dispose();
        this.disposables.forEach((element) => {
            element.dispose();
        });
        this.disposables = [];
    }
}
