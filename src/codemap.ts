'use strict';

import { Disposable, commands, window, ViewColumn, WebviewPanel, ThemeColor } from 'vscode';
import { GenericDataStructure } from './GenericDataStructure';
import { Statusbar } from './statusbar';
import { ModuleInfo } from './ModuleInfo';
import { Push } from './Push';
import { WebShow } from './WebShow';

export class Codemap extends Push {

    private static _panel: WebviewPanel;
    private static _flag: number = 0;
    private static _codemap: Disposable;
    private static _webshow: WebShow = new WebShow();
    private static _hostname = process.env.USER_IP || "localhost";
    private static _port = 6886;

    static get panel(): WebviewPanel {
        return Codemap._panel;
    }

    public get codemap(): Disposable {
        return Codemap._codemap;
    }

    public push(): Disposable {
        return Codemap._codemap;
    }

    constructor(public info: GenericDataStructure) {
        super();
        Codemap._codemap = commands.registerCommand(this.info.codemap_extension_command, this.mainfunc);

    };

    mainfunc() {
        Codemap.showInnerWeb();
    }

    static createServer(): any {
        return this._webshow.creatNewWebshow(this._hostname, this._port);
    }

    static showInnerWeb() {
        let app = 0;
        if (this._flag === 0) {
            app = Codemap.createServer();
            this._panel = window.createWebviewPanel(
                'testWebview', // viewType
                'Code Map',
                ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );
            this.panel.webview.html = Codemap.getWebviewContent(this._hostname, this._port);
            Statusbar.statusbar.text = `${ModuleInfo.Info.codemap_extension_complete_tag} ${ModuleInfo.Info.codemap_extension_display}`;
            Statusbar.statusbar.color = new ThemeColor("activityBar.activeBorder");
            this._flag++;
        }
        else {
            this.panel.dispose();
        }
        this.panel.onDidDispose(() => {
            this._flag = 0;
            Statusbar.statusbar.text = `${ModuleInfo.Info.codemap_extension_start_tag} ${ModuleInfo.Info.codemap_extension_display}`;
            Statusbar.statusbar.color = new ThemeColor("errorForeground");
            if (app !== 0) {
                Codemap._webshow.closeWebshow(app);
            }
        }
        );
    }

    static getWebviewContent(hostname: string, port: number) {
        return `<!DOCTYPE html>
            <html lang="en">
            <link rel="icon" type="image/x-icon" href="icon.ico" />
            <head>
                <style type="text/css">
                html,
                body {
                    height: 100%; width: 100%; padding: 0; margin: 0; 
                }
                iframe {
                    height: 100%; width: 100%; padding: 0; margin: 0; border: 0; display: block; frameborder: 0;
                }
                </style>
            </head>
            <body>
                <iframe sandbox="allow-top-navigation allow-scripts allow-same-origin allow-popups allow-pointer-lock allow-forms" 
                src="http://${hostname}:${port}/index.html" ></iframe>
            </body>
        </html>`;
    }

}
