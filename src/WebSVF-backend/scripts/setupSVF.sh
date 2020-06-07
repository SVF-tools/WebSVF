#!/bin/bash
# System: Ubuntu 20.04
# type: 'source setup.sh' for setting paths for llvm svf

########
# 1. set path
#########
ETC_PROFILE=/etc/profile # path file
LLVM_ORIGINAL_NAME="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04" # after unzip llvm file name
LLVM_NAME="clang-llvm" # llvm file name which we want to use
# 2.1 delete related path
sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE # delete LLVM_DIR
sudo sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE # delete LLVM_DIR from PATH
sudo sed -i '/export SVF_HOME=/ d' $ETC_PROFILE # delete SVF_HOME
sudo sed -i '/export PATH=$SVF_HOME\/Debug-build\/bin:$PATH/ d' $ETC_PROFILE # delete SVF_HOME from PATH
sudo sed -i '/export LLVM_COMPILER=/ d' $ETC_PROFILE # delete LLVM_COMPILER
# 2.2 add current llvm svf path
echo "export LLVM_DIR=${INSTALL_DIR}/${LLVM_NAME}" | sudo tee -a $ETC_PROFILE # add LLVM_DIR for llvm
echo 'export PATH=$LLVM_DIR/bin:$PATH' | sudo tee -a $ETC_PROFILE # add LLVM_DIR to PATH for llvm
echo "export SVF_HOME=${INSTALL_DIR}/SVF" | sudo tee -a $ETC_PROFILE # add SVF_HOME for svf
echo 'export PATH=$SVF_HOME/Debug-build/bin:$PATH' | sudo tee -a $ETC_PROFILE # add SVF_HOME to PATH for svf
echo 'export LLVM_COMPILER=clang' | sudo tee -a $ETC_PROFILE # add LLVM_COMPILER for wllvm
# 2.3 refresh path
sh $ETC_PROFILE # refresh path