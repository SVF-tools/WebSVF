import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

interface WebInfo {
    viewType: string;
    title: string;
    column: vscode.ViewColumn;
    enableScripts: boolean;
    localResourceRoots: string[];
    retainContextWhenHidden: boolean;
    homeRelativePath: string;
}

class WebBasicPanel {
    protected webPanel: vscode.WebviewPanel;
    protected disposables: vscode.Disposable[] = [];
    protected webIsReady: boolean = false;
    public isReady(): boolean {
        return this.webIsReady;
    }

    constructor(webInfo: WebInfo, context: vscode.ExtensionContext) {
        this.webPanel = this.createWebviewPanel(webInfo, context);
    }

    /**
     * Create Webview Panel.
     * @param webInfo WebPanel configure information.
     * @param context Vscode extension context.
     */
    protected createWebviewPanel(
        webInfo: WebInfo,
        context: vscode.ExtensionContext
    ): vscode.WebviewPanel {
        let localResourceRoots: vscode.Uri[] = this.createResourceRoots(
            webInfo.localResourceRoots,
            context.extensionPath
        );

        let webPanel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
            webInfo["viewType"],
            webInfo["title"],
            webInfo["column"],
            {
                enableScripts: webInfo["enableScripts"],
                localResourceRoots: localResourceRoots,
                retainContextWhenHidden: webInfo["retainContextWhenHidden"],
            }
        );

        this.setCleanupMethod(webPanel);
        this.setListener(webPanel);
        this.setWebpage(webPanel, webInfo["homeRelativePath"], context);

        return webPanel;
    }

    /**
     * Conversion resource format from string[] to vscode.Uri[].
     * @param resource Get from webInfo.localResourceRoots.
     * @param resourcePath Combined into an absolute path.
     */
    protected createResourceRoots(
        resource: string[],
        resourcePath: string
    ): vscode.Uri[] {
        let localResourceRoots: vscode.Uri[] = [];
        resource.forEach((element) => {
            localResourceRoots.push(
                vscode.Uri.file(path.join(resourcePath, element))
            );
        });
        return localResourceRoots;
    }

    /**
     * After create a webPanel, It is need to set clean up webpanel resource method.
     * @param webPanel Webpanel.
     */
    protected setCleanupMethod(webPanel: vscode.WebviewPanel) {
        webPanel.onDidDispose(
            () => this.disposeJob(webPanel, this.disposables, this.webIsReady),
            null,
            this.disposables
        );
    }
    /**
     * It is clean up listener.
     * @param webPanel Webpanel.
     * @param disposables clean up space.
     * @param webIsReady web is ready or not.
     */
    protected disposeJob(
        webPanel: vscode.WebviewPanel,
        disposables: vscode.Disposable[],
        webIsReady: boolean
    ) {
        webPanel.dispose();
        disposables.forEach((element) => {
            element.dispose();
        });
        disposables = [];
        webIsReady = false;
    }
    /**
     * For public delete panel.
     */
    public deletePanel() {
        this.webPanel.dispose();
    }
    /**
     * Vscode could listen webpage message.
     * @param webPanel Webpanel.
     */
    protected setListener(webPanel: vscode.WebviewPanel) {
        webPanel.webview.onDidReceiveMessage(
            (message) => this.receiveMessage(message),
            null,
            this.disposables
        );
    }
    /**
     * Listener basis structure.
     * @param message Receive massage info.
     */
    protected receiveMessage(message: { command: string; text: string }) {
        switch (message.command) {
            case "error":
                vscode.window.showErrorMessage(message.text);
                break;
            case "info":
                vscode.window.showInformationMessage(message.text);
                break;
            case "connect":
                this.webIsReady = true;
                this.webPanel.webview.postMessage({
                    command: "connect",
                    text: "",
                });
                break;
        }
    }
    /**
     * WebPanel need set web page after initial.
     * @param webPanel Webpanel.
     * @param relativePath Html file relative path (root path should be the extension path).
     * @param context Vscode context.
     */
    protected setWebpage(
        webPanel: vscode.WebviewPanel,
        relativePath: string,
        context: vscode.ExtensionContext
    ) {
        webPanel.webview.html = this.conventHtml(relativePath, context);
    }

    /**
     * Convent Html resource, All the resource should be in local.
     * @param relativePath Html file relative path (root path should be the extension path).
     * @param context Vscode context.
     */
    protected conventHtml(
        relativePath: string,
        context: vscode.ExtensionContext
    ) {
        const resourcePath = path.join(context.extensionPath, relativePath);
        const dirPath = path.dirname(resourcePath);
        const dirName = dirPath.replace(context.extensionPath, "");
        let html = fs.readFileSync(resourcePath, "utf-8");
        html = html.replace(
            /(<link.+?href="|<script.+?src="|<img.+?src="|import.+?from ")(.+?)"/g,
            (m, $1, $2) => {
                if (context.asAbsolutePath($2) !== $2) {
                    $2 = path.join(dirName, $2);
                }
                return (
                    $1 +
                    vscode.Uri.file(context.asAbsolutePath($2))
                        .with({ scheme: "vscode-resource" })
                        .toString() +
                    '"'
                );
            }
        );
        /* The result in Convent.html */
        const newFilePath = path.join(dirPath, "Convent.html");
        fs.writeFileSync(newFilePath, html);
        return html;
    }
}

export { WebInfo, WebBasicPanel };
