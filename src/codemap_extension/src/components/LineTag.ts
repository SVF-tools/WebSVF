"use strict";
import * as vscode from "vscode";
import { ActivateVscodeContext, AbsolutePath } from "./ActivateVscodeContext";
import { activate } from "../extension";

export interface TagInfo {
    [key: string]: string;
    svgPath: string;
}

export interface LineTagInfo {
    [key: string]: string | TagInfo;
    name: string;
    light: TagInfo;
    dark: TagInfo;
}

export enum LightOrDark {
    light,
    dark,
}

export interface CreateLineTagInfo {
    [key: string]:
        | vscode.Uri
        | Array<vscode.Range>
        | vscode.TextEditorDecorationType;
    activeEditorUri: vscode.Uri;
    markSpace: Array<vscode.Range>;
    textLoadEditorDecoration: vscode.TextEditorDecorationType;
}

export class LineTagManager {
    private static _LineTagList: Map<string, LineTag> = new Map();
    private static get LineTagList(): Map<string, LineTag> {
        return LineTagManager._LineTagList;
    }
    public static createLineTag(
        activeEditorUri: vscode.Uri, // which file
        markLine: number, // which line
        start: number,
        end: number,
        filePathOrType: string | vscode.TextEditorDecorationType // Decoration file or Type
    ): string {
        const key: string = this.assemblyKey(activeEditorUri, markLine);
        const range: vscode.Range = this.assemblyVscodeRange(
            markLine,
            start,
            end
        );
        const createLineTagInfo: CreateLineTagInfo = this.assemblyCreateLineTagInfo(
            activeEditorUri,
            range,
            filePathOrType
        );

        const lineTag: LineTag = new LineTag(createLineTagInfo);
        this.LineTagList.set(key, lineTag);
        return key;
    }

    public static deleteLineTag(key: string): boolean {
        const lintTag: LineTag | undefined = this.findLineTag(key);
        if (lintTag === undefined) {
            return false;
        } else {
            lintTag.UnLoadDecoration();
            this.LineTagList.delete(key);
            return true;
        }
    }

    public static findLineTag(key: string): LineTag | undefined {
        return this.LineTagList.get(key);
    }

    public static assemblyVscodeRange(
        line1: number,
        start: number,
        end: number
    ): vscode.Range {
        const position_1: vscode.Position = new vscode.Position(line1, start);
        const position_2: vscode.Position = new vscode.Position(line1, end);
        return new vscode.Range(position_1, position_2);
    }

    public static assemblyCreateLineTagInfo(
        activeEditorUri: vscode.Uri,
        markLine: vscode.Range,
        filePathOrType: string | vscode.TextEditorDecorationType
    ): CreateLineTagInfo {
        const markSpace: Array<vscode.Range> = new Array();
        markSpace.push(markLine);

        const textLoadEditorDecoration: vscode.TextEditorDecorationType =
            typeof filePathOrType === "string"
                ? this.generateTextEditorDecorationByJsonFile(filePathOrType)
                : filePathOrType;
        const createLineTagInfo: CreateLineTagInfo = {
            activeEditorUri: activeEditorUri,
            markSpace: markSpace,
            textLoadEditorDecoration: textLoadEditorDecoration,
        };

        return createLineTagInfo;
    }

    public static assemblyKey(
        activeEditorUri: vscode.Uri,
        line: number
    ): string {
        return activeEditorUri.fsPath + " " + line.toString();
    }

    private static assemblyLineTagFromJsonFile(
        filePath: string,
        choice: LightOrDark
    ): TagInfo {
        const info = require(filePath);
        const model = this.getModel(choice);
        const tagInfo: TagInfo = {
            svgPath: AbsolutePath(info[model]["svgPath"]),
        };
        return tagInfo;
    }
    private static getModel(choice: LightOrDark): string {
        return choice === LightOrDark.light ? "light" : "dark";
    }
    private static assemblyLineTagInfoFromJsonFile(
        filePath: string
    ): LineTagInfo {
        const info = require(filePath);
        const lineTagInfo: LineTagInfo = {
            name: info["name"],
            light: this.assemblyLineTagFromJsonFile(
                filePath,
                LightOrDark.light
            ),
            dark: this.assemblyLineTagFromJsonFile(filePath, LightOrDark.dark),
        };
        return lineTagInfo;
    }
    private static generateDecorationOptionsByJsonFile(
        filePath: string
    ): vscode.DecorationRenderOptions {
        const lineTagInfo: LineTagInfo = this.assemblyLineTagInfoFromJsonFile(
            filePath
        );
        return this.generateDecorationOptions(lineTagInfo);
    }
    private static generateDecorationOptions(
        info: LineTagInfo
    ): vscode.DecorationRenderOptions {
        const lightOptions: vscode.ThemableDecorationRenderOptions = {
            gutterIconPath: vscode.Uri.file(info["light"]["svgPath"]),
            gutterIconSize: "contain",
            color: "#fff",
            backgroundColor: "#ffbd2a",
            overviewRulerColor: "rgba(255,189,42,0.8)",
        };
        const darkOptions: vscode.ThemableDecorationRenderOptions = {
            gutterIconPath: vscode.Uri.file(info["dark"]["svgPath"]),
            gutterIconSize: "contain",
            color: "#fff",
            backgroundColor: "#ffbd2a",
            overviewRulerColor: "rgba(255,189,42,0.8)",
        };
        const options: vscode.DecorationRenderOptions = {
            light: lightOptions,
            dark: darkOptions,
            isWholeLine: true,
            overviewRulerLane: vscode.OverviewRulerLane.Full,
            backgroundColor: "green",
            border: "2px solid white",
        };
        return options;
    }
    private static generateTextEditorDecoration(
        options: vscode.DecorationRenderOptions
    ): vscode.TextEditorDecorationType {
        return vscode.window.createTextEditorDecorationType(options);
    }

    private static generateTextEditorDecorationByJsonFile(
        filePath: string
    ): vscode.TextEditorDecorationType {
        const options = this.generateDecorationOptionsByJsonFile(filePath);
        return this.generateTextEditorDecoration(options);
    }

    public static LoadDecoration() {
        this.LineTagList.forEach((value, key) => {
            value.LoadDecoration();
        });
    }

    public static UnLoadDecoration() {
        this.LineTagList.forEach((value, key) => {
            value.UnLoadDecoration();
        });
    }
}

export class LineTag {
    constructor(private createLineTagInfo: CreateLineTagInfo) {}

    public LoadDecoration(newDec?: vscode.TextEditorDecorationType) {
        newDec =
            newDec !== undefined
                ? newDec
                : this.createLineTagInfo.textLoadEditorDecoration;

        if (vscode.window.activeTextEditor) {
            let activeEditor = vscode.window.activeTextEditor;
            let uri = activeEditor.document.uri;
            if (this.createLineTagInfo.activeEditorUri.fsPath === uri.fsPath) {
                activeEditor.setDecorations(
                    newDec,
                    this.createLineTagInfo.markSpace
                );
            }
        }
    }
    public UnLoadDecoration() {
        // vscode.window.showInformationMessage("UnLoadDecoration");
        this.createLineTagInfo.textLoadEditorDecoration.dispose();
    }
}
