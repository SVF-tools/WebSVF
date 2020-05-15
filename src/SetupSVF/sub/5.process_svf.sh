#!/bin/bash

# 下载 SVF
cd ~/SVFTools/
git clone https://github.com/SVF-tools/SVF.git SVF

# 改造svf setup.sh
cd $SVF_HOME
SVF_SETUP=$SVF_HOME/setup.sh

STRING_LLVM_DIR_RELEASE='export LLVM_DIR_RELEASE=\/home\/'
STRING_NEW_LLVM_DIR_RELEASE='export LLVM_DIR_RELEASE=$HOME\/SVFTools\/clang-llvm-10.0.0'

sudo sed -i "/^${STRING_LLVM_DIR_RELEASE}/ a\\${STRING_NEW_LLVM_DIR_RELEASE}" $SVF_SETUP 
sudo sed -i "/^${STRING_LLVM_DIR_RELEASE}/ d" $SVF_SETUP

STRING_ASTYLEDIR='AstyleDir=\/home\/'
STRING_NEW_ASTYLEDIR='AstyleDir=$HOME\/astyle\/build\/clang'

sudo sed -i "/^${STRING_ASTYLEDIR}/ a\\${STRING_NEW_ASTYLEDIR}" $SVF_SETUP
sudo sed -i "/^${STRING_ASTYLEDIR}/ d" $SVF_SETUP

# 改造svf build.sh
cd $SVF_HOME
SVF_BUILD=$SVF_HOME/build.sh

LLVM_DIR_RELEASE='LLVM_DIR_RELEASE=\/Users\/yulei\/Documents\/'
NEW_LLVM_DIR_RELEASE='LLVM_DIR_RELEASE=$HOME\/SVFTools\/clang-llvm-10.0.0'

sudo sed -i "/^${LLVM_DIR_RELEASE}/ a\\${NEW_LLVM_DIR_RELEASE}" $SVF_BUILD 
sudo sed -i "/^${LLVM_DIR_RELEASE}/ d" $SVF_BUILD

LLVM_DIR_DEBUG='LLVM_DIR_DEBUG=\/Users\/yulei\/Documents\/'
NEW_LLVM_DIR_DEBUG='LLVM_DIR_DEBUG=$HOME\/SVFTools\/clang-llvm-10.0.0'

sudo sed -i "/^${LLVM_DIR_DEBUG}/ a\\${NEW_LLVM_DIR_DEBUG}" $SVF_BUILD
sudo sed -i "/^${LLVM_DIR_DEBUG}/ d" $SVF_BUILD

#通过setup.sh安装
bash $SVF_BUILD
bash $SVF_BUILD debug

cd ~/SVFTools/
