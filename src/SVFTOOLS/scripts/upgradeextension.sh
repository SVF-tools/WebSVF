cd ~/WebSVF/src/SVFTOOLS/
exfile="svftools-0.0.3.vsix"
rm ${exfile}
vsce package
flag="0";
exFolder="~/.local/share/code-server/extensions/tianyangguan.svftools-0.0.3"
if [ -f ${exfile} ]; then
    cd ~/.local/share/code-server/extensions/tianyangguan.svftools-0.0.3
    if [ -f "Reload.flag" ]; then
        flag="1";
    fi
    cd ~/WebSVF/src/SVFTOOLS/
    rm -rf ${exFolder}
    code-server --install-extension svftools-0.0.3.vsix

    if [ flag = "1" ]; then
        touch ${exFolder}/Reload.flag
    fi
    
fi
cd ~/INPUT_PROJECT
script="upgradeextension.sh"
if [[ -f $script ]]; then
    rm $script
fi
cd ~
code-server --reuse-window ~/
code-server --reuse-window ~/INPUT_PROJECT