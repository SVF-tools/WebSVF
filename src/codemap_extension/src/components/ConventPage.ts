"use strict";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { AbsPath } from "./AbsPath";
import { ActivateVscodeContext } from "./ActivateVscodeContext";

export class ConventPage {
    public static ConventHtml(pagePath: string) {
        const resourcePath = AbsPath.absPath(pagePath);
        const dirPath = path.dirname(resourcePath);
        const dirName = dirPath.replace(
            ActivateVscodeContext.context.extensionPath,
            ""
        );
        let html = fs.readFileSync(resourcePath, "utf-8");
        html = html.replace(
            /(<link.+?href="|<script.+?src="|<img.+?src="|import.+?from ")(.+?)"/g,
            (m, $1, $2) => {
                if (ActivateVscodeContext.context.asAbsolutePath($2) !== $2) {
                    $2 = path.join(dirName, $2);
                }
                return (
                    $1 +
                    vscode.Uri.file(
                        ActivateVscodeContext.context.asAbsolutePath($2)
                    )
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
