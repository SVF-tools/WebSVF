#!/bin/bash

# 1. install system tools
sudo apt-get update
sudo apt-get install -y curl
sudo apt-get install -y gcc gdb build-essential
sudo apt-get install -y cmake
sudo apt-get install -y wget
sudo apt-get install -y git
sudo apt-get install -y libtinfo-dev
sudo apt-get install -y libtinfo5
sudo apt-get install -y libtinfo6

# 2. setup llvm svf

# 2.1 download llvm svf release
LLVM_TARXZ="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz"
SVF_TARXZ="SVF.tar.xz"
wget -c "https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/${llvmTarxz}"
wget -c "https://github.com/codemapweb/SVF/releases/download/1.0/${SVF_TARXZ}"

# 2.2 generate SVF dir 
SVFTools_Path="${HOME}/SVFTools"
if [ -d "$SVFTools_Path" ]; then
    rm -rf ${SVFTools_Path}
fi
mkdir ${SVFTools_Path}

# 2.3 unzip release to svf tools
tar -xvf "${LLVM_TARXZ}" "${SVFTools_Path}"
tar -xvf "${SVF_TARXZ}" "${SVFTools_Path}"

# 2.4 rename llvm
LLVM_NAME="clang-llvm"
mv "${SVFTools_Path}" "${SVFTools_Path}${LLVM_NAME}"

# 3. set path
ETC_PROFILE=/etc/profile
sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
sudo sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE
sudo sed -i '/export SVF_HOME=$HOME\/SVFTools\/SVF/ d' $ETC_PROFILE
sudo sed -i '/export PATH=$SVF_HOME\/Debug-build\/bin:$PATH/ d' $ETC_PROFILE
echo "export LLVM_DIR=${SVFTools_Path}${LLVM_NAME}" |sudo tee -a $ETC_PROFILE
echo 'export PATH=$LLVM_DIR/bin:$PATH' | sudo tee -a $ETC_PROFILE
echo "export SVF_HOME=${SVFTools_Path}/SVF" | sudo tee -a $ETC_PROFILE
echo 'export PATH=$SVF_HOME/Debug-build/bin:$PATH' | sudo tee -a $ETC_PROFILE
source $ETC_PROFILE

# 4. test
clang -c -emit-llvm -g ./example.c -o ./result.bc
wpa -ander ./result.bc