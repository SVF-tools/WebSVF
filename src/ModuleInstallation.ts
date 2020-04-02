'use strict';

import { ModuleInfo } from './moduleInfo';

export class ModuleInstallation {

    private _funcpush: Array<any>;


    public get funcpush(): Array<any> {
        return this._funcpush;
    }

    constructor() {
        this._funcpush = new Array();
        ModuleInfo.Moudle.forEach(module => {
            this._funcpush.push(new (<any>module)(ModuleInfo.Info));
        });
    }

}