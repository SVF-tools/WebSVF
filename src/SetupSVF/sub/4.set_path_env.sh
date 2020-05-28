#!/bin/bash
cd ~/SetupSVF/

ETC_PROFILE=/etc/profile

if [ "$USER" = 'root' ]; then
	sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
	sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE
	sed -i '/export SVF_HOME=$HOME\/SVFTools\/SVF/ d' $ETC_PROFILE
	sed -i '/export PATH=$SVF_HOME\/Release-build\/bin:$PATH/ d' $ETC_PROFILE
	echo 'export LLVM_DIR=$HOME/SVFTools/clang-llvm' |tee -a $ETC_PROFILE
	echo 'export PATH=$LLVM_DIR/bin:$PATH' | tee -a $ETC_PROFILE
	echo 'export SVF_HOME=$HOME/SVFTools/SVF' | tee -a $ETC_PROFILE
	echo 'export PATH=$SVF_HOME/Release-build/bin:$PATH' | tee -a $ETC_PROFILE
else
	sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
	sudo sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE
	sudo sed -i '/export SVF_HOME=$HOME\/SVFTools\/SVF/ d' $ETC_PROFILE
	sudo sed -i '/export PATH=$SVF_HOME\/Release-build\/bin:$PATH/ d' $ETC_PROFILE
	echo 'export LLVM_DIR=$HOME/SVFTools/clang-llvm' |sudo tee -a $ETC_PROFILE
	echo 'export PATH=$LLVM_DIR/bin:$PATH' | sudo tee -a $ETC_PROFILE
	echo 'export SVF_HOME=$HOME/SVFTools/SVF' | sudo tee -a $ETC_PROFILE
	echo 'export PATH=$SVF_HOME/Release-build/bin:$PATH' | sudo tee -a $ETC_PROFILE
fi

source $ETC_PROFILE

cd ~/SetupSVF/
