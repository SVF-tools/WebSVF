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
        | vscode.TextEditor
        | Array<vscode.Range>
        | vscode.TextEditorDecorationType;
    activeEditor: vscode.TextEditor;
    markSpace: Array<vscode.Range>;
    textLoadEditorDecoration: vscode.TextEditorDecorationType;
}

export class LineTagManager {
    private static _LineTagList: Map<string, LineTag> = new Map();
    private static get LineTagList(): Map<string, LineTag> {
        return LineTagManager._LineTagList;
    }
    public static createLineTag(
        activeEditor: vscode.TextEditor, // which file
        markLine: number, // which line
        filePathOrType: string | vscode.TextEditorDecorationType // Decoration file or Type
    ): string {
        const key: string = this.assemblyKey(activeEditor, markLine);
        const range: vscode.Range = this.assemblyVscodeRange(markLine);
        const createLineTagInfo: CreateLineTagInfo = this.assemblyCreateLineTagInfo(
            activeEditor,
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
        line2?: number
    ): vscode.Range {
        line2 = line2 === undefined ? line1 : line2;
        const position_1: vscode.Position = new vscode.Position(line1, 2);
        const position_2: vscode.Position = new vscode.Position(line2 + 1, 20);
        return new vscode.Range(position_1, position_2);
    }

    public static assemblyCreateLineTagInfo(
        activeEditor: vscode.TextEditor,
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
            activeEditor: activeEditor,
            markSpace: markSpace,
            textLoadEditorDecoration: textLoadEditorDecoration,
        };

        return createLineTagInfo;
    }

    public static assemblyKey(
        activeEditor: vscode.TextEditor,
        line: number
    ): string {
        return activeEditor.document.uri.fsPath + " " + line.toString();
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
            backgroundColor: "green",
            borderColor: "blue",
        };
        const darkOptions: vscode.ThemableDecorationRenderOptions = {
            gutterIconPath: vscode.Uri.file(info["dark"]["svgPath"]),
            gutterIconSize: "contain",
            backgroundColor: "green",
            borderColor: "blue",
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
}

export class LineTag {
    constructor(private createLineTagInfo: CreateLineTagInfo) {}

    public LoadDecoration(newDec?: vscode.TextEditorDecorationType) {
        newDec =
            newDec !== undefined
                ? newDec
                : this.createLineTagInfo.textLoadEditorDecoration;

        this.createLineTagInfo.activeEditor.setDecorations(
            newDec,
            this.createLineTagInfo.markSpace
        );
    }
    public UnLoadDecoration() {
        vscode.window.showInformationMessage("UnLoadDecoration");
        this.createLineTagInfo.textLoadEditorDecoration.dispose();
    }
}
