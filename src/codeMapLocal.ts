'use strict';

import { Disposable, commands, window, ViewColumn, WebviewPanel, ThemeColor } from 'vscode';
import { GenericDataStructure } from './genericDataStructure';
import { Statusbar } from './statusbar';
import { ModuleInfo } from './moduleInfo';
import { Push } from './push';
import { WebLocal } from './webLocal';
import { ImportInfo } from "./importInfo";


export class Codemap extends Push {

    private static _panel: WebviewPanel;
    private static _flag: number = 0;
    private static _codemap: Disposable;
    private static _htmlpath: string = "./web/index.html";
    public static get htmlpath(): string {
        return Codemap._htmlpath;
    }

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

    static showInnerWeb() {
        let app = 0;
        if (this._flag === 0) {
            this._panel = window.createWebviewPanel(
                'testWebview', // viewType
                'Code Map',
                ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );
            this.panel.webview.html = WebLocal.getWebView(ImportInfo.vscontext, Codemap.htmlpath)
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
        });
    }
}
