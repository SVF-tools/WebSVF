'use strict';
import { ExtensionContext, Uri } from 'vscode';
import * as path from "path";
import * as fs from "fs";
import { AbsPath } from "./absolutePath"

export class WebLocal {
    public static getWebView(context: ExtensionContext, templatePath: string) {
        const resourcePath = AbsPath.abspath(context, templatePath);
        const dirPath = path.dirname(resourcePath);
        let html = fs.readFileSync(resourcePath, 'utf-8');
        html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src="|.jsonUrl\(")(.+?)"/g, (m, $1, $2) => {
            return $1 + Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
        });
        return html;
    }
}