sudo apt update && sudo apt upgrade
bash codemap-setup-subscripts/setupBasic.sh
bash codemap-setup-subscripts/setupPip.sh
source codemap-setup-subscripts/setupNvm.sh
bash codemap-setup-subscripts/setupPygraphviz.sh
bash codemap-setup-subscripts/setupVscodeEssential.sh
bash codemap-setup-subscripts/setupYarn.sh
bash codemap-setup-subscripts/setupNodemon.sh

source codemap-setup-subscripts/githubdownload.sh
bash codemap-setup-subscripts/FixWatchMax.sh
bash codemap-setup-subscripts/setCodeMapExtension.sh

sudo apt autoremove -y
