!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install build-essential libtinfo-dev wget curl git cmake python3-pip libgraphviz-dev graphviz -y
sudo pip3 install pygraphviz

location=$(pwd)

#######
#1. llvm
#######
wget -c https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz -O llvm.tar.xz
tar -xvf llvm.tar.xz
rm llvm.tar.xz
sudo rm /usr/bin/llvm -rf
sudo mv clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04 /usr/bin/llvm

export LLVM_DIR=/usr/bin/llvm
export PATH=$LLVM_DIR/bin:$PATH

echo '''
#!/bin/bash
# System: Ubuntu 18.04
# 1. set path
ETC_PROFILE=/etc/profile # path file
INSTALL_DIR=/usr/bin/llvm
# 1.1 delete related path
sudo sed -i "/export LLVM_DIR=/ d" $ETC_PROFILE # delete LLVM_DIR
sudo sed -i "/export PATH=\$LLVM_DIR/ d" $ETC_PROFILE # delete LLVM_DIR from PATH
sudo sed -i "/export LLVM_COMPILER=/ d" $ETC_PROFILE # delete LLVM_COMPILER
# 1.2 add current llvm svf path
echo "export LLVM_DIR=${INSTALL_DIR}" | sudo tee -a $ETC_PROFILE # add LLVM_DIR for llvm
echo "export PATH=\$LLVM_DIR/bin:\$PATH" | sudo tee -a $ETC_PROFILE # add LLVM_DIR to PATH for llvm
echo "export LLVM_COMPILER=clang" | sudo tee -a $ETC_PROFILE # add LLVM_COMPILER for wllvm
# 1.3 refresh path
source $ETC_PROFILE # refresh path
''' > /usr/bin/llvm/llvm_env.sh

source /usr/bin/llvm/llvm_env.sh

function highlight(){
    echo -e "\033[1;45;37m$1\033[0m"
}
highlight "[CONFIG LLVM DONE.]"