"use strict";
import * as vscode from "vscode";
import * as commonInterface from "./CommonInterface";
import { LineTagManager, LineTag } from "../../components/LineTag";

export class LineTagForceGraph3DManager {
    private static filePath: string = "LineTag.json";
    public static createLineTag(
        activeEditorUri: vscode.Uri,
        line: number,
        start: number,
        end: number
    ): undefined | string {
        const configFilePath = commonInterface.getConfigPath(this.filePath);
        return LineTagManager.createLineTag(
            activeEditorUri,
            line,
            start,
            end,
            configFilePath
        );
    }
}
