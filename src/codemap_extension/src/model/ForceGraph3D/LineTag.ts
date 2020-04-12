"use strict";
import * as vscode from "vscode";
import * as commonInterface from "./CommonInterface";
import { LineTagManager, LineTag } from "../../components/LineTag";

export class LineTagForceGraph3DManager {
    private static filePath: string = "LineTag.json";
    public static createLineTag(
        activeEditor: vscode.TextEditor | undefined,
        line: number
    ): undefined | string {
        if (activeEditor === undefined) {
            return undefined;
        } else {
            const configFilePath = commonInterface.getConfigPath(this.filePath);
            return LineTagManager.createLineTag(
                activeEditor,
                line,
                configFilePath
            );
        }
    }
}
