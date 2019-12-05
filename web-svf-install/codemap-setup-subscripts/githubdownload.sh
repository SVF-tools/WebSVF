#!bash
SHELL_NOW_FOLDER=$(cd "$(dirname "$0")";pwd)
mkdir ~/WORKSPACE
cd ~/WORKSPACE
sudo rm * -rf

git clone https://github.com/spcidealacm/AutoBuildSVFScript.git
git clone https://github.com/spcidealacm/code-map-ide-core.git
git clone https://github.com/spcidealacm/code-map-react-shell.git
git clone https://github.com/spcidealacm/code-map-ide-extension.git
git clone https://github.com/spcidealacm/code-map-ide-extension-3d-display.git
git clone https://github.com/spcidealacm/d3-react.git
git clone https://github.com/spcidealacm/d3-react-server.git
git clone https://github.com/spcidealacm/whole-program-llvm.git
git clone https://github.com/spcidealacm/bullet-2.81-rev2613-code-map-test.git


cd ~/WORKSPACE/code-map-ide-core
bash init.sh
bash build.sh
bash run.sh & codeMapIdeCorePID=$!
codeMapIdeCorePID=$((codeMapIdeCorePID + 2))
sleep 8s
echo $$
echo $codeMapIdeCorePID
kill "$codeMapIdeCorePID"

cd ~/WORKSPACE/code-map-react-shell
yarn

cd ~/WORKSPACE/d3-react
yarn

cd ~/WORKSPACE/d3-react-server
yarn

cd ~/WORKSPACE/code-map-ide-extension-3d-display
yarn

cd ~/WORKSPACE/AutoBuildSVFScript
source AutoInstallSvf_9.0.0_Online

cd ~/WORKSPACE/whole-program-llvm
bash setup.sh

cd $SHELL_NOW_FOLDER
