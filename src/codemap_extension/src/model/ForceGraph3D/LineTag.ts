"use strict";
import * as vscode from "vscode";
import * as commonInterface from "./CommonInterface";
import { LineTagManager, LineTag } from "../../components/LineTag";

export class LineTagForceGraph3DManager {
    private static filePath: string = "LineTag.json";
    public static createLineTag(
        activeEditorUri: vscode.Uri, // which file
        line: number, // which line
        start: number, // start position
        end: number, // end position
        themeName: string, // which theme want use (in configuration/LineTag.json)
        flag: string // who set the linTag
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
            configFilePath,
            flag
        );
    }
}
