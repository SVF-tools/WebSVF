# Refresh and Update installed Ubuntu applications
sudo apt update && sudo apt -y upgrade 

# Install Dependecies
# {
sudo apt install -y git gcc make cmake vim build-essential libssl-dev curl wget 
#bash codemap-setup-subscripts/setupBasic.sh

# Install Python (Pip)
sudo apt install -y python-pip
sudo apt install -y python3-pip
#bash codemap-setup-subscripts/setupPip.sh
# }

# Setup Node and npm (instead of nvm)
# {
sudo apt install -y nodejs 
sudo apt install -y npm 
# }
#source codemap-setup-subscripts/setupNvm.sh

# Setup PyGraphViz
# {
pip install graphviz
sudo apt install -y graphviz
sudo apt install -y libgraphviz-dev
pip install pygraphviz
# }
#bash codemap-setup-subscripts/setupPygraphviz.sh

# Setup VSCode Essential
sudo apt install -y pkg-config libx11-dev libxkbfile-dev libsecret-1-dev fakeroot rpm
#bash codemap-setup-subscripts/setupVscodeEssential.sh

# Setup Yarn
# {
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update && sudo apt install -y yarn
# }
#bash codemap-setup-subscripts/setupYarn.sh

# Setup Nodemon
sudo npm install -g -y nodemon
#bash codemap-setup-subscripts/setupNodemon.sh

sudo apt-get install -y unzip

# Download and Install Required Project Tools from Github
# {
SHELL_NOW_FOLDER=$(cd "$(dirname "$0")";pwd)
mkdir ~/WORKSPACE
cd ~/WORKSPACE
sudo rm * -rf

cd $SHELL_NOW_FOLDER

sudo curl -O -k https://srv-file6.gofile.io/download/6mdL5k/files.zip

sudo unzip files.zip

#cd ./files

#git clone https://github.com/spcidealacm/whole-program-llvm.git

#cd ../

sudo mv files/* ~/WORKSPACE/

sudo rm -R files

cd ~/WORKSPACE

#git clone https://github.com/akshatsinghkaushik/AutoBuildSVFScript.git
#git clone https://github.com/spcidealacm/code-map-ide-core.git
#git clone https://github.com/spcidealacm/code-map-react-shell.git
#git clone https://github.com/spcidealacm/code-map-ide-extension.git
#git clone https://github.com/spcidealacm/code-map-ide-extension-3d-display.git
#git clone https://github.com/spcidealacm/d3-react.git
#git clone https://github.com/spcidealacm/d3-react-server.git
#git clone https://github.com/spcidealacm/whole-program-llvm.git
#git clone https://github.com/spcidealacm/bullet-2.81-rev2613-code-map-test.git

# {
#sudo apt-get install -y wget

#wget https://github.com/codemapweb/CodeMap/releases/download/v1.0/codemap-server.zip

#unzip codemap-server.zip -d ./code-server

#sudo rm codemap-server.zip
#}

{
cd ~/WORKSPACE/code-map-ide-core
bash init.sh
bash build.sh
bash run.sh & codeMapIdeCorePID=$!
codeMapIdeCorePID=$((codeMapIdeCorePID + 2))
sleep 8s
echo $$
echo $codeMapIdeCorePID
kill "$codeMapIdeCorePID"
}

##wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key|sudo apt-key add -
# Fingerprint: 6084 F3CF 814B 57C1 CF12 EFD5 15CF 4D18 AF4F 7421

#sudo apt-get install clang clang-9 lldb-9 lld-9 libllvm-9-ocaml-dev libllvm9 llvm-9 llvm-9-dev llvm-9-doc llvm-9-examples llvm-9-runtime -y

#deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic-9 main
#deb-src http://apt.llvm.org/bionic/ llvm-toolchain-bionic-9 main

#}

cd ~/WORKSPACE/whole-program-llvm
bash setup.sh

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




cd $SHELL_NOW_FOLDER
# }
#source codemap-setup-subscripts/githubdownload.sh

# Fix Watch-Max
# {
ETC_SYSCTL=/etc/sysctl.conf


if [ "$USER" = 'root' ]; then
    sed -i '/fs.inotify.max_user_watches=/ d' $ETC_SYSCTL

	echo 'fs.inotify.max_user_watches=524288' | tee -a $ETC_SYSCTL
else
	sudo sed -i '/fs.inotify.max_user_watches=/ d' $ETC_SYSCTL

	echo 'fs.inotify.max_user_watches=524288' | sudo tee -a $ETC_SYSCTL
fi

sudo sysctl -p
# }
#bash codemap-setup-subscripts/FixWatchMax.sh

# Setup CodeMap Extension
# {
mv ~/WORKSPACE/code-map-ide-extension-3d-display/ ~/.local/share/code-server/extensions/

cd ~/.local/share/code-server/extensions/code-map-ide-extension-3d-display/

yarn

yarn compile
# }
#bash codemap-setup-subscripts/setCodeMapExtension.sh

# Uninstall deprecated dependencies
sudo apt autoremove -y