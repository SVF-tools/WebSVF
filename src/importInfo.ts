'use strict';

import { ExtensionContext } from 'vscode';

export class ImportInfo {
    private static _vscontext: ExtensionContext;
    public static get vscontext(): ExtensionContext {
        return ImportInfo._vscontext;
    }
    public static set vscontext(value: ExtensionContext) {
        ImportInfo._vscontext = value;
    }
}