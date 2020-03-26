'use strict';
import { window } from 'vscode';
import * as express from "express";
import * as path from "path";
import * as http from 'http';

export class WebShow {

    private static _app = new Map<any, any>();

    constructor() {
    }

    public creatNewWebshow(hostname: string, port: number): any {
        const app = express();
        app.use(express.static(path.join(__dirname, '../web')));
        let httpServer = http.createServer(app);
        httpServer.listen(port, hostname, function () {
            // window.showInformationMessage(`Running on http://${hostname}:${port}`);
        });
        WebShow._app.set(app, httpServer);
        // this.show();
        return app;
    }

    public closeWebshow(app: any) {
        // window.showInformationMessage(`start closeWebshow`);
        let server = WebShow._app.get(app);
        // window.showInformationMessage(`Get server`);
        server.close();
        // window.showInformationMessage(`WebShow._app.get(app).close()`);
        WebShow._app.delete(app);
        // window.showInformationMessage(`WebShow._app.delete(app);`);
    }

    public show() {
        WebShow._app.forEach(app => {
            let server = WebShow._app.get(app);
            window.showInformationMessage(`SHOW: ${app}, ${server}`);
        });
    }

    declare() {
        WebShow._app.forEach(app => {
            this.closeWebshow(app);
        });
        WebShow._app.clear();
    }
}