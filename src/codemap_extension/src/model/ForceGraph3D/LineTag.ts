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
        end: number,
        themeName: string
    ): undefined | string {
        const configFilePath = commonInterface.getConfigPath(this.filePath);
        console.log("activeEditorUri: ", activeEditorUri);
        console.log("line: ", line);
        console.log("start: ", start);
        console.log("end: ", end);
        console.log("themeName: ", themeName);
        return LineTagManager.createLineTag(
            activeEditorUri,
            line,
            start,
            end,
            themeName,
            configFilePath
        );
    }
}
