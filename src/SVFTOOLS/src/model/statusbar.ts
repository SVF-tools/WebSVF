import * as vscode from "vscode";
import * as data from "../data";

interface BarConfig {
    alignment?: vscode.StatusBarAlignment;
    priority?: number;
    title: string;
    command: string;
    show: boolean;
}
function getInfo(command: string) {
    let info = data.config.getStatusbarInfoFromCommand(command)[0];
    let barInfo: BarConfig = {
        alignment: info.alignment,
        priority: info.priority,
        title: info.status[0].title,
        command: info.command,
        show: true,
    };
    return barInfo;
}

export class GenerateBar extends data.BarBasic {
    constructor(command: string) {
        let barInfo = getInfo(command);
        super(data.context, barInfo.alignment, barInfo.priority);
        this.setBar(barInfo.command, barInfo.title, barInfo.show);
    }
}