#!/bin/bash

ETC_PROFILE=/etc/profile


if [ "$USER" = 'root' ]; then
       	sed -i '/export LLVM_SRC=/ d' $ETC_PROFILE
	sed -i '/export LLVM_OBJ=/ d' $ETC_PROFILE
	sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
	sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE
	sed -i '/export SVF_HOME=$HOME\/project\/SVF/ d' $ETC_PROFILE
	sed -i '/export PATH=$SVF_HOME\/Release-build\/bin:$PATH/ d' $ETC_PROFILE
	echo 'export LLVM_SRC=$HOME/project/llvm-9.0.0.src' |tee -a $ETC_PROFILE
	echo 'export LLVM_OBJ=$HOME/project/llvm-9.0.0.obj' |tee -a $ETC_PROFILE
	echo 'export LLVM_DIR=$HOME/project/llvm-9.0.0.obj' |tee -a $ETC_PROFILE
	echo 'export PATH=$LLVM_DIR/bin:$PATH' | tee -a $ETC_PROFILE
	echo 'export SVF_HOME=$HOME/project/SVF' | tee -a $ETC_PROFILE
	echo 'export PATH=$SVF_HOME/Release-build/bin:$PATH' | tee -a $ETC_PROFILE
else
	sudo sed -i '/export LLVM_SRC=/ d' $ETC_PROFILE
	sudo sed -i '/export LLVM_OBJ=/ d' $ETC_PROFILE
	sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
	sudo sed -i '/export PATH=$LLVM_DIR\/bin:PATH/ d' $ETC_PROFILE
	sudo sed -i '/export SVF_HOME=$HOME\/project\/SVF/ d' $ETC_PROFILE
	sudo sed -i '/export PATH=$SVF_HOME\/Release-build\/bin:$PATH/ d' $ETC_PROFILE
	echo 'export LLVM_SRC=$HOME/project/llvm-9.0.0.src' |sudo tee -a $ETC_PROFILE
	echo 'export LLVM_OBJ=$HOME/project/llvm-9.0.0.obj' |sudo tee -a $ETC_PROFILE
	echo 'export LLVM_DIR=$HOME/project/llvm-9.0.0.obj' |sudo tee -a $ETC_PROFILE
	echo 'export PATH=$LLVM_DIR/bin:$PATH' | sudo tee -a $ETC_PROFILE
	echo 'export SVF_HOME=$HOME/project/SVF' | sudo tee -a $ETC_PROFILE
	echo 'export PATH=$SVF_HOME/Release-build/bin:$PATH' | sudo tee -a $ETC_PROFILE
fi

source $ETC_PROFILE

