'use strict';

import { ExtensionContext } from 'vscode';
import { Codemap } from './codemap';
// import { Codemap } from './codeMapLocal';
import { Statusbar } from './statusbar';
import { GenericDataStructure } from './genericDataStructure';

export class ModuleInfo {

    //Module list
    private static _moudle_list: Array<Function> = [
        Codemap,
        Statusbar
    ];
    public static get Moudle(): Array<Function> {
        return ModuleInfo._moudle_list;
    }

    //Config Info
    private static _config_info: GenericDataStructure = {
        codemap_extension_command: 'extension.codemap',
        codemap_extension_display: '3D CODE MAP',
        codemap_extension_symbol: '${activate-breakpoints}',
        codemap_extension_start_tag: '$(beaker)',
        codemap_extension_complete_tag: '$(verified)'
    };
    public static get Info(): GenericDataStructure {
        return ModuleInfo._config_info;
    }

}