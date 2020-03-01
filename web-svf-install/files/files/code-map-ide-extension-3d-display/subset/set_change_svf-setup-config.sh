#!/bin/bash
cd $SVF_HOME
SVF_SETUP=$SVF_HOME/setup.sh

STRING_LLVM_OBJ_ROOT='export LLVM_OBJ_ROOT=\/home\/'
STRING_NEW_LLVM_OBJ_ROOT='export LLVM_OBJ_ROOT=$HOME\/project\/llvm-7.0.0.obj'


sudo sed -i "/^${STRING_LLVM_OBJ_ROOT}/ a\${STRING_NEW_LLVM_OBJ_ROOT}" $SVF_SETUP 
sudo sed -i "/^${STRING_LLVM_OBJ_ROOT}/ d" $SVF_SETUP

STRING_ASTYLEDIR='AstyleDir=\/home\/'
STRING_NEW_ASTYLEDIR='$HOME\/astyle\/build\/clang'

sudo sed -i "/^${STRING_ASTYLEDIR}/ a\${STRING_NEW_ASTYLEDIR}" $SVF_SETUP
sudo sed -i "/^${STRING_ASTYLEDIR}/ d" $SVF_SETUP

