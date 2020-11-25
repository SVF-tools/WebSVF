cd ~/WebSVF/src/SVFTOOLS/
exfile="svftools-0.0.3.vsix"
rm ${exfile}
vsce package
if [ -f ${exfile} ]; then
    rm -rf ~/.local/share/code-server/extensions/tianyangguan.svftools-0.0.3
    code-server --install-extension svftools-0.0.3.vsix
fi
cd ~/INPUT_PROJECT
script="upgradeextension.sh"
if [[ -f $script ]]; then
    rm $script
fi
cd ~
code-server --reuse-window ~/
code-server --reuse-window ~/INPUT_PROJECT