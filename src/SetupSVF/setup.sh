#!/bin/bash
# System: Ubuntu 18.04 / 20.04
# type: 'source setup.sh' for install llvm wllvm svf

########
# 1. install system tools
########
sudo apt-get update # ubuntu update
sudo apt-get install -y curl gcc gdb build-essential cmake wget git libtinfo-dev libtinfo5 libtinfo6 libglib2.0-dev libncurses5 libtool libgraphviz-dev graphviz python3.8 # essential tools
sudo pip3 install wllvm pygraphviz # install wllvm and pygraphviz


########
# 2. setup llvm svf
########
# 2.1 download llvm svf release
LLVM_TARXZ="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz" # llvm 10.0.0 release name
SVF_TARXZ="SVF.tar.xz" # SVF release name
wget -c "https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/${llvmTarxz}" # download llvm release
wget -c "https://github.com/codemapweb/SVF/releases/download/1.0/${SVF_TARXZ}" # download svf release 

# 2.2 generate llvm & SVF installation dir 
INSTALL_DIR="${HOME}/SVFTools" # llvm & svf installation dir 
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "${INSTALL_DIR}" # if already has llvm & svf installation dir, delete it.
fi
mkdir "${INSTALL_DIR}" # generate llvm & svf installation dir

# 2.3 unzip release to svf dir
tar -xvf "${LLVM_TARXZ}" -C "${INSTALL_DIR}" # unzip llvm to llvm & svf installation dir
tar -xvf "${SVF_TARXZ}" -C "${INSTALL_DIR}" # unzip svf to llvm & svf installation dir

# 2.4 rename llvm
LLVM_ORIGINAL_NAME="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04" # after unzip llvm file name
LLVM_NAME="clang-llvm" # llvm file name which we want to use
mv "${INSTALL_DIR}/${LLVM_ORIGINAL_NAME}" "${INSTALL_DIR}/${LLVM_NAME}" # rename llvm

########
# 3. set path
########
ETC_PROFILE=/etc/profile # path file
# 3.1 delete related path
sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE # delete LLVM_DIR
sudo sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE # delete LLVM_DIR from PATH
sudo sed -i '/export SVF_HOME=/ d' $ETC_PROFILE # delete SVF_HOME
sudo sed -i '/export PATH=$SVF_HOME\/Debug-build\/bin:$PATH/ d' $ETC_PROFILE # delete SVF_HOME from PATH
sudo sed -i '/export LLVM_COMPILER= d' $ETC_PROFILE # delete LLVM_COMPILER
# 3.2 add current llvm svf path
echo "export LLVM_DIR=${INSTALL_DIR}/${LLVM_NAME}" |sudo tee -a $ETC_PROFILE # add LLVM_DIR for llvm
echo 'export PATH=$LLVM_DIR/bin:$PATH' | sudo tee -a $ETC_PROFILE # add LLVM_DIR to PATH for llvm
echo "export SVF_HOME=${INSTALL_DIR}/SVF" | sudo tee -a $ETC_PROFILE # add SVF_HOME for svf
echo 'export PATH=$SVF_HOME/Debug-build/bin:$PATH' | sudo tee -a $ETC_PROFILE # add SVF_HOME to PATH for svf
echo 'export LLVM_COMPILER=clang' | sudo tee -a $ETC_PROFILE # add LLVM_COMPILER for wllvm
# 3.3 refresh path
source $ETC_PROFILE # refresh path

########
# 4. test
########
# 4.1 delete residual files
rm example.c result.bc
# 4.2 create test example.c
echo "#include<stdio.h>
int main()
{
	int a=3;
	int b=4;
	int c=0;
    c = a*b;
    return c;
}" >> example.c # write c program into example.c
# 4.3 test llvm through clang
clang -c -emit-llvm -g ./example.c -o ./result.bc # generate result.bc
# 4.4 test svf through wpa
wpa -ander ./result.bc # analysis result.bc
# 4.5 delete residual files
rm example.c result.bc

########
# 5. reboot for set path
########
readTime(){
    second=$1
    while(( $second>0 ))
    do
        echo "${second}"
        sleep 1
        let "second--"
    done
}
read -n1 -p "SVF configure need reboot now [Y/n]:" answer 
case $answer in 
Y | y) 
    echo -e "\nReboot after 3s"
    readTime 3
    shutdown -r now;;
"") 
    echo "Reboot after 3s"
    readTime 3
    shutdown -r now;;
*) 
    echo ""
    echo "Please reboot by youself to make sure SVF work.";;
esac