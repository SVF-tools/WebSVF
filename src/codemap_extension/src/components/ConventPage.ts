"use strict";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { AbsPath } from "./AbsPath";

export class ConventPage {
    public static ConventHtml(pagePath: string) {
        const resourcePath = AbsPath.absPath(pagePath);
        const dirPath = path.dirname(resourcePath);
        let html = fs.readFileSync(resourcePath, "utf-8");
        html = html.replace(
            /(<link.+?href="|<script.+?src="|<img.+?src="|.jsonUrl\(")(.+?)"/g,
            (m, $1, $2) => {
                return (
                    $1 +
                    vscode.Uri.file(path.join(dirPath, $2))
                        .with({ scheme: "vscode-resource" })
                        .toString() +
                    '"'
                );
            }
        );

        // You can see the result in Convent.html
        const newFilePath = path.join(dirPath, "Convent.html");
        fs.writeFileSync(newFilePath, html);
        return html;
    }
}
