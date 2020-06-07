"use strict";
import * as vscode from "vscode";
import { ActivateVscodeContext, AbsolutePath } from "./ActivateVscodeContext";
import { activate } from "../extension";

export interface TagInfo {
    [key: string]: string;
    svgPath: string;
    gutterIconSize: string;
    color: string;
    backgroundColor: string;
    overviewRulerColor: string;
}

export interface RenderOption {
    [key: string]: string | boolean;
    isWholeLine: boolean;
    backgroundColor: string;
    border: string;
}

export interface LineTagInfo {
    [key: string]: string | TagInfo | RenderOption;
    name: string;
    light: TagInfo;
    dark: TagInfo;
    renderOption: RenderOption;
}

export enum TagInfoEnum {
    light,
    dark,
    renderOption,
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
        themeName: string,
        filePathOrType: string | vscode.TextEditorDecorationType, // Decoration file or Type
        flag: string
    ): string | undefined {
        const key: string = this.assemblyKey(activeEditorUri, markLine);
        const range: vscode.Range = this.assemblyVscodeRange(
            markLine,
            start,
            end
        );
        const createLineTagInfo:
            | CreateLineTagInfo
            | undefined = this.assemblyCreateLineTagInfo(
            themeName,
            activeEditorUri,
            range,
            filePathOrType
        );

        if (createLineTagInfo) {
            const lineTag: LineTag = new LineTag(createLineTagInfo, flag);
            this.LineTagList.set(key, lineTag);
            return key;
        }
    }

    public static isKeyThere(key: string): boolean {
        if (this.findLineTag(key)) {
            return true;
        }
        return false;
    }

    public static turnOff(key: string, flag?: string, mode?: string): boolean {
        if (!this.isKeyThere(key)) {
            return false;
        }
        if (flag && mode) {
            switch (mode) {
                case "deleteByFlag":
                    return this.deleteLineTag(key, flag);
                case "saveByFlag":
                    const lineTag = this.findLineTag(key);
                    if (lineTag) {
                        const innerFlag = lineTag.lineTagFlag;
                        if (flag === innerFlag) {
                            return false; // flag same will save
                        }
                    }
                    return this.deleteLineTagBase(key);
                default:
                    console.log("MODE ERROR: ", mode);
                    return false;
            }
        } else {
            if (!flag && !mode) {
                return this.deleteLineTagBase(key);
            }
        }
        return false;
    }

    public static deleteLineTag(key: string, flag?: string): boolean {
        // flag same will delete
        if (flag) {
            const lineTag = this.findLineTag(key);
            if (lineTag) {
                const innerFlag = lineTag.lineTagFlag;
                if (flag !== innerFlag) {
                    return false; // flag different will save
                }
            }
        }
        return this.deleteLineTagBase(key);
    }

    public static deleteLineTagBase(key: string): boolean {
        const lintTag: LineTag | undefined = this.findLineTag(key);
        if (lintTag) {
            lintTag.UnLoadDecoration();
            this.LineTagList.delete(key);
            return true;
        }
        return false;
    }
    public static clear() {
        this.LineTagList.forEach((element) => {
            element.UnLoadDecoration();
        });
        this.LineTagList.clear();
    }

    public static findLineTag(key: string, flag?: string): LineTag | undefined {
        const lineTag = this.LineTagList.get(key);
        if(!flag){
            return lineTag;
        }else{
            if(lineTag && lineTag.lineTagFlag === flag){
                return lineTag;
            }
            return undefined;
        }
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
        themeName: string,
        activeEditorUri: vscode.Uri,
        markLine: vscode.Range,
        filePathOrType: string | vscode.TextEditorDecorationType
    ): CreateLineTagInfo | undefined {
        const markSpace: Array<vscode.Range> = new Array();
        markSpace.push(markLine);

        const textLoadEditorDecoration:
            | vscode.TextEditorDecorationType
            | undefined =
            typeof filePathOrType === "string"
                ? this.generateTextEditorDecorationByJsonFile(
                      themeName,
                      filePathOrType
                  )
                : filePathOrType;
        if (textLoadEditorDecoration) {
            const createLineTagInfo: CreateLineTagInfo = {
                activeEditorUri: activeEditorUri,
                markSpace: markSpace,
                textLoadEditorDecoration: textLoadEditorDecoration,
            };

            return createLineTagInfo;
        }
    }

    public static assemblyKey(
        activeEditorUri: vscode.Uri,
        line: number
    ): string {
        return activeEditorUri.fsPath + " " + line.toString();
    }

    private static assemblyLineTagFromJsonFile(
        themeName: string,
        filePath: string,
        choice: TagInfoEnum
    ): TagInfo | undefined {
        const model = this.getModel(choice);
        const info = require(filePath)[themeName][model];
        if (model === "light" || model === "dark") {
            const tagInfo: TagInfo = {
                svgPath: AbsolutePath(info["svgPath"]),
                gutterIconSize: info["gutterIconSize"],
                color: info["color"],
                backgroundColor: info["backgroundColor"],
                overviewRulerColor: info["overviewRulerColor"],
            };
            return tagInfo;
        }
    }
    private static assemblyRenderOptionFromJsonFile(
        themeName: string,
        filePath: string,
        choice: TagInfoEnum
    ): RenderOption | undefined {
        const model = this.getModel(choice);
        const info = require(filePath)[themeName][model];
        if (model === "renderOption") {
            const renderOption: RenderOption = {
                isWholeLine: info["isWholeLine"],
                backgroundColor: info["backgroundColor"],
                border: info["border"],
            };
            return renderOption;
        }
    }
    private static getModel(choice: TagInfoEnum): string {
        let result = "";
        switch (choice) {
            case TagInfoEnum.light:
                result = "light";
                break;
            case TagInfoEnum.dark:
                result = "dark";
                break;
            case TagInfoEnum.renderOption:
                result = "renderOption";
                break;
            default:
                break;
        }
        return result;
    }
    private static assemblyLineTagInfoFromJsonFile(
        themeName: string,
        filePath: string
    ): LineTagInfo | undefined {
        const info = require(filePath)[themeName];
        const light = this.assemblyLineTagFromJsonFile(
            themeName,
            filePath,
            TagInfoEnum.light
        );
        const dark = this.assemblyLineTagFromJsonFile(
            themeName,
            filePath,
            TagInfoEnum.dark
        );
        const render = this.assemblyRenderOptionFromJsonFile(
            themeName,
            filePath,
            TagInfoEnum.renderOption
        );
        try {
            if (light && dark && render) {
                const lineTagInfo: LineTagInfo = {
                    name: info["name"],
                    light: light,
                    dark: dark,
                    renderOption: render,
                };
                return lineTagInfo;
            } else {
                throw TypeError;
            }
        } catch (e) {
            console.log("light:", light);
            console.log("dark:", dark);
            console.log("render:", render);
        }
    }
    private static generateDecorationOptionsByJsonFile(
        themeName: string,
        filePath: string
    ): vscode.DecorationRenderOptions | undefined {
        const lineTagInfo:
            | LineTagInfo
            | undefined = this.assemblyLineTagInfoFromJsonFile(
            themeName,
            filePath
        );
        return this.generateDecorationOptions(lineTagInfo);
    }
    private static generateDecorationOptions(
        info: LineTagInfo | undefined
    ): vscode.DecorationRenderOptions | undefined {
        if (info) {
            const lightOptions: vscode.ThemableDecorationRenderOptions = {
                gutterIconPath: vscode.Uri.file(info["light"]["svgPath"]),
                gutterIconSize: info["light"]["gutterIconSize"],
                color: info["light"]["color"],
                backgroundColor: info["light"]["backgroundColor"],
                overviewRulerColor: info["light"]["overviewRulerColor"],
            };
            const darkOptions: vscode.ThemableDecorationRenderOptions = {
                gutterIconPath: vscode.Uri.file(info["dark"]["svgPath"]),
                gutterIconSize: info["dark"]["gutterIconSize"],
                color: info["dark"]["color"],
                backgroundColor: info["dark"]["backgroundColor"],
                overviewRulerColor: info["dark"]["overviewRulerColor"],
            };
            const options: vscode.DecorationRenderOptions = {
                light: lightOptions,
                dark: darkOptions,
                isWholeLine: info["renderOption"]["isWholeLine"],
                overviewRulerLane: vscode.OverviewRulerLane.Full,
                backgroundColor: info["renderOption"]["backgroundColor"],
                border: info["renderOption"]["border"],
            };
            console.log("OPTION: ", options);
            return options;
        }
    }
    private static generateTextEditorDecoration(
        options: vscode.DecorationRenderOptions | undefined
    ): vscode.TextEditorDecorationType | undefined {
        if (options) {
            return vscode.window.createTextEditorDecorationType(options);
        }
    }

    private static generateTextEditorDecorationByJsonFile(
        themeName: string,
        filePath: string
    ): vscode.TextEditorDecorationType | undefined {
        const options = this.generateDecorationOptionsByJsonFile(
            themeName,
            filePath
        );
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
    private _lineTagFlag: string; //store who set the LinTag. like "onNodeClick", "TextControl"
    public get lineTagFlag(): string {
        return this._lineTagFlag;
    }
    constructor(private createLineTagInfo: CreateLineTagInfo, flag: string) {
        this._lineTagFlag = flag;
    }

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
            } else {
                console.log("ERROR: ");
                console.log(this.createLineTagInfo.activeEditorUri.fsPath);
                console.log(uri.fsPath);
            }
        }
    }
    public UnLoadDecoration() {
        // vscode.window.showInformationMessage("UnLoadDecoration");
        this.createLineTagInfo.textLoadEditorDecoration.dispose();
    }
}
