#!/bin/bash
# System: Ubuntu 18.04 / 20.04
# type: 'source setup.sh' for install llvm wllvm svf

########
# 1. setup llvm svf
########
# 1.1 download llvm svf release
LLVM_TARXZ="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz" # llvm 10.0.0 release name
SVF_TARXZ="SVF.tar.xz" # SVF release name
wget -c "https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz" # download llvm release
wget -c "https://github.com/codemapweb/SVF/releases/download/1.0/${SVF_TARXZ}" # download svf release 

# 1.2 generate llvm & SVF installation dir 
INSTALL_DIR="${HOME}/SVFTools" # llvm & svf installation dir 
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "${INSTALL_DIR}" # if already has llvm & svf installation dir, delete it.
fi
mkdir "${INSTALL_DIR}" # generate llvm & svf installation dir

# 1.3 unzip release to svf dir
tar -xvf "${LLVM_TARXZ}" -C "${INSTALL_DIR}" # unzip llvm to llvm & svf installation dir
tar -xvf "${SVF_TARXZ}" -C "${INSTALL_DIR}" # unzip svf to llvm & svf installation dir

# 1.4 rename llvm
LLVM_ORIGINAL_NAME="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04" # after unzip llvm file name
LLVM_NAME="clang-llvm" # llvm file name which we want to use
mv "${INSTALL_DIR}/${LLVM_ORIGINAL_NAME}" "${INSTALL_DIR}/${LLVM_NAME}" # rename llvm

########
# 2. set path
########
ETC_PROFILE=/etc/profile # path file
# 2.1 delete related path
sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE # delete LLVM_DIR
sudo sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE # delete LLVM_DIR from PATH
sudo sed -i '/export SVF_HOME=/ d' $ETC_PROFILE # delete SVF_HOME
sudo sed -i '/export PATH=$SVF_HOME\/Debug-build\/bin:$PATH/ d' $ETC_PROFILE # delete SVF_HOME from PATH
sudo sed -i '/export LLVM_COMPILER= d' $ETC_PROFILE # delete LLVM_COMPILER
# 2.2 add current llvm svf path
echo "export LLVM_DIR=${INSTALL_DIR}/${LLVM_NAME}" | sudo tee -a $ETC_PROFILE # add LLVM_DIR for llvm
echo 'export PATH=$LLVM_DIR/bin:$PATH' | sudo tee -a $ETC_PROFILE # add LLVM_DIR to PATH for llvm
echo "export SVF_HOME=${INSTALL_DIR}/SVF" | sudo tee -a $ETC_PROFILE # add SVF_HOME for svf
echo 'export PATH=$SVF_HOME/Debug-build/bin:$PATH' | sudo tee -a $ETC_PROFILE # add SVF_HOME to PATH for svf
echo 'export LLVM_COMPILER=clang' | sudo tee -a $ETC_PROFILE # add LLVM_COMPILER for wllvm
# 2.3 refresh path
sh $ETC_PROFILE # refresh path