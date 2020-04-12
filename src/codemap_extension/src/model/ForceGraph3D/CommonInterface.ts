"use strict";

export interface ConfigPath {
    [key: string]: string;
    barConfigPath: string;
    PanelConfigPath: string;
    CommandConfigPath: string;
}

export enum SwitchBar {
    on,
    off,
}

export enum BarSituation {
    waiting,
    running,
}


