rm result.bc
rm -rf ~/SVFTools

ETC_PROFILE=/etc/profile

if [ "$USER" = 'root' ]; then
	sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
	sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE
	sed -i '/export SVF_HOME=$HOME\/SVFTools\/SVF/ d' $ETC_PROFILE
	sed -i '/export PATH=$SVF_HOME\/Release-build\/bin:$PATH/ d' $ETC_PROFILE
else
	sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
	sudo sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE
	sudo sed -i '/export SVF_HOME=$HOME\/SVFTools\/SVF/ d' $ETC_PROFILE
	sudo sed -i '/export PATH=$SVF_HOME\/Release-build\/bin:$PATH/ d' $ETC_PROFILE
fi

source $ETC_PROFILE