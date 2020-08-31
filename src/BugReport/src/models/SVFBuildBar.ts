import { StoreInfo } from "../storeInfo";
import { BasicBar } from "../components/statusBar";
import * as svfInfo from "../config/SVFBuildBar.json";

enum SVFBarType {
    OpenConifg,
    BuildSvfEx,
    BuildTarget,
    InstallEnv,
}
class SVFBuildBar extends BasicBar {
    protected command: string = "";
    protected text: string = "";
    constructor(svfBarType: SVFBarType, priprity?: number) {
        super(
            StoreInfo.extensionContext,
            BasicBar.getAlignment(svfInfo.alignment),
            priprity
        );
        this.command = "";
        this.text = "";
        this.setSVFBuildBar(svfBarType);
    }
    setSVFBuildBar(svfBarType: SVFBarType) {
        switch (svfBarType) {
            case SVFBarType.OpenConifg:
                this.command = svfInfo.OpenConifg.command;
                this.text = svfInfo.OpenConifg.text;
                break;
            case SVFBarType.BuildSvfEx:
                this.command = svfInfo.BuildSvfEx.command;
                this.text = svfInfo.BuildSvfEx.text;
                break;
            case SVFBarType.BuildTarget:
                this.command = svfInfo.BuildTarget.command;
                this.text = svfInfo.BuildTarget.text;
                break;
            case SVFBarType.InstallEnv:
                this.command = svfInfo.InstallEnv.command;
                this.text = svfInfo.InstallEnv.text;
                break;
            default:
                this.command = svfInfo.OpenConifg.command;
                this.text = svfInfo.OpenConifg.text;
                break;
        }
        this.setBasicBar(this.command, this.text);
    }
}

export { SVFBarType, SVFBuildBar };
