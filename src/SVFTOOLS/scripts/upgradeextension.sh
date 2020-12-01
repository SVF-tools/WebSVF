svfPATH="~/WebSVF/src/SVFTOOLS/"
websvfPath="~/WebSVF/"
if [ ! -d ${svfPATH} ]; then
    if [ -d ${websvfPath} ]; then
        sudo rm -rf ${websvfPath}
    fi

    cd ~
    git clone https://github.com/SVF-tools/WebSVF.git --depth 1
    cd ~/WebSVF/src/SVFTOOLS/
    
fi
cd ~/WebSVF/src/SVFTOOLS/
sudo npm install
sudo npm install -y -g vsce
exfile="svftools-0.0.3.vsix"
sudo rm ${exfile}
git pull
vsce package
flag="0";
exFolder="~/.local/share/code-server/extensions/tianyangguan.svftools-0.0.3"
if [ -f ${exfile} ]; then
    cd ~/.local/share/code-server/extensions/tianyangguan.svftools-0.0.3
    if [ -f "Reload.flag" ]; then
        flag="1";
        # echo "11111111111111111111111111111"
    fi
    cd ~/WebSVF/src/SVFTOOLS/
    sudo rm -rf ${exFolder}
    code-server --install-extension svftools-0.0.3.vsix

    if [ flag="1" ]; then
        sudo touch ~/.local/share/code-server/extensions/tianyangguan.svftools-0.0.3/Reload.flag
        # echo "222222222222222222222222222222"
    fi
    
fi
cd ~/INPUT_PROJECT
script="upgradeextension.sh"
if [[ -f $script ]]; then
    sudo rm $script
fi
cd ~
code-server --reuse-window ~/
code-server --reuse-window ~/INPUT_PROJECT