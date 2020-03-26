'use strict';

import { ExtensionContext } from 'vscode';
import { ModuleInfo } from './ModuleInfo';

export class ModuleInstallation {

    private _funcpush: Array<any>;
    public get funcpush(): Array<any> {
        return this._funcpush;
    }

    constructor(context: ExtensionContext) {
        this._funcpush = new Array();
        ModuleInfo.Moudle.forEach(module => {
            this._funcpush.push(new (<any>module)(ModuleInfo.Info));
        });
    }

}