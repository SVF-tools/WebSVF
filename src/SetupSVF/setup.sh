#!/bin/bash

# 1. system tools
sudo apt-get update
sudo apt-get install -y curl
sudo apt-get install -y gcc gdb build-essential
sudo apt-get install -y cmake
sudo apt-get install -y wget
sudo apt-get install -y git
sudo apt-get install -y libtinfo-dev
sudo apt-get install -y libtinfo5
sudo apt-get install -y libtinfo6
echo -e "\033[42;37m INSTALL ESSENTIAL TOOLS \033[0m"
if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m INSTALL ESSENTIAL TOOLS SUCCESS! \033[0m"
else
	echo -e "\033[41;33m INSTALL ESSENTIAL TOOLS FAILED! \033[0m"
	return;
fi

# 2. check network
timeout=5
target=www.github.com
ret_code=`curl -I -s --connect-timeout $timeout $target -w %{http_code} | tail -n1`
if [ "x$ret_code" = "x301" ]; then
	echo -e "\033[43;37m NETWORK CONNECTED. \033[0m"
else
	echo -e "\033[41;33m NETWORK UNCONNECTION. \033[0m"
	return
fi

# 3. download llvm svf and set
echo -e "\033[42;37m DOWNLOAD LLVM SVF \033[0m"

LLVM_DOWNLOAD_MAIN_PATH="https://github.com/llvm/llvm-project/releases/download" # llvm download page
SVF_DOWNLOAD_MAIN_PATH="https://github.com/codemapweb/SVF/releases/download/" # svf download page
LLVM_EDITION="llvmorg-10.0.0" # llvm release edition
SVF_EDITION="1.0" # svf release edition
TARXZ=".tar.xz" # tar.xz tail
LOG="LOG" # log dir name
STORE="STORE" # store dir name

OID_LLVM_FILE_NAME="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04" # original llvm file name
LLVM_FILE_NAME="clang-llvm" # llvm file name
SVF_FILE_NAME="SVF" # svf file name

SVFToolsDIR="SVFTools" # svf tools dir name
TOOLS_PATH="${HOME}/${SVFToolsDIR}" # svf tools dir path
SETUP_PATH="$(pwd)" # script pwd

OLD_LLVM_TARXZ="${OID_LLVM_FILE_NAME}${TARXZ}" # original llvm tar.xz
LLVM_TARXZ="${LLVM_FILE_NAME}${TARXZ}" # llvm tar.xz
SVF_TARXZ="${SVF_FILE_NAME}${TARXZ}"# svf tar.xz

OLD_LLVM_TOOLS_FILE="${TOOLS_PATH}/${OID_LLVM_FILE_NAME}" # original llvm file name
LLVM_TOOLS_FILE="${TOOLS_PATH}/${LLVM_FILE_NAME}" # llvm file name
SVF_TOOLS_FILE="${TOOLS_PATH}/${SVF_NAME}" # svf file name

LOG_PATH="${SETUP_PATH}/${LOG}" # log path
STORE_PATH=${SETUP_PATH}/${STORE} # store path
LLVM_TARXZ_STORE="${STORE_PATH}/${OLD_LLVM_TARXZ}" # llvm store path
SVF_TARXZ_STORE="${STORE_PATH}/${SVF_TARXZ}" # svf store path

OLD_LLVM_TOOLS_PATH_TARXZ="${TOOLS_PATH}/${OLD_LLVM_TARXZ}" # old llvm using
LLVM_TOOLS_PATH_TARXZ="${TOOLS_PATH}/${LLVM_TARXZ}" # llvm using
SVF_TOOLS_PATH_TARXZ="${TOOLS_PATH}/${SVF_TARXZ}" #svf using

# generate log path
if [ ! -d "$LOG_PATH" ]; then
    echo "mkdir ${LOG_PATH}"
    mkdir ${LOG_PATH}
else
    echo "ALREADY HAS ${LOG_PATH}"
fi

# generate store path
if [ ! -d "$STORE_PATH" ]; then
    echo "mkdir ${STORE_PATH}"
    mkdir ${STORE_PATH}
else
    echo "ALREADY HAS ${STORE_PATH}"
fi

# create log file 
TIME=$(date "+%Y%m%d-%H%M%S")
LOG_FILE=${LOG_PATH}/${TIME}.txt
touch ${LOG_FILE}

# create svf tool dir
if [ -d "$TOOLS_PATH" ]; then
    echo "rm -rf ${TOOLS_PATH}" | tee -a ${LOG_FILE}
    rm -rf ${TOOLS_PATH}
fi
mkdir ${TOOLS_PATH}
echo "mkdir ${TOOLS_PATH}" | tee -a ${LOG_FILE}

# download llvm and set
echo "DOWNLOAD LLVM" | tee -a ${LOG_FILE}
cd ${STORE_PATH}
wget -c ${LLVM_DOWNLOAD_MAIN_PATH}/${LLVM_EDITION}/${OLD_LLVM_TARXZ} -a ${LOG_FILE} # download release
tar -xvf ${LLVM_TARXZ_STORE} -C ${TOOLS_PATH} | tee -a ${LOG_FILE} 2>&1 # tar -x
mv ${OLD_LLVM_TOOLS_FILE} ${LLVM_TOOLS_FILE} | tee -a ${LOG_FILE} 2>&1 # change llvm name

# download svf ans set
echo "DOWNLOAD SVF" | tee -a ${LOG_FILE}
cd ${STORE_PATH}
wget -c ${SVF_DOWNLOAD_MAIN_PATH}/${SVF_EDITION}/${SVF_TARXZ} -a ${LOG_FILE} # download release
tar -xvf ${SVF_TARXZ_STORE} -C ${TOOLS_PATH} | tee -a ${LOG_FILE} 2>&1 # tar -x
cd ${SHELL_FOLDER}

if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m DOWNLOAD LLVM SVF SUCCESS. \033[0m"
else
	echo -e "\033[41;33m DOWNLOAD LLVM SVF FAILED. \033[0m"
	return;
fi 

# set path environment
echo -e "\033[42;37m SET ENVIRONMENT PATH \033[0m"
ETC_PROFILE=/etc/profile
sudo sed -i '/export LLVM_DIR=/ d' $ETC_PROFILE
sudo sed -i '/export PATH=$LLVM_DIR\/bin:$PATH/ d' $ETC_PROFILE
sudo sed -i '/export SVF_HOME=$HOME\/SVFTools\/SVF/ d' $ETC_PROFILE
sudo sed -i '/export PATH=$SVF_HOME\/Release-build\/bin:$PATH/ d' $ETC_PROFILE
echo 'export LLVM_DIR=$HOME/SVFTools/clang-llvm' |sudo tee -a $ETC_PROFILE
echo 'export PATH=$LLVM_DIR/bin:$PATH' | sudo tee -a $ETC_PROFILE
echo 'export SVF_HOME=$HOME/SVFTools/SVF' | sudo tee -a $ETC_PROFILE
echo 'export PATH=$SVF_HOME/Release-build/bin:$PATH' | sudo tee -a $ETC_PROFILE
source $ETC_PROFILE
if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m SET ENVIRONMENT PATH SUCCESS! \033[0m"
else
	echo -e "\033[41;33m SET ENVIRONMENT PATH FAILED! \033[0m"
	return;
fi 

# test
echo -e "\033[42;37m TEST \033[0m"
filename=$1
if [ "$filename" = "" ]; then
	filename=example.c
fi
echo "clang -c -emit-llvm -g ./${filename} -o ./result.bc" | tee -a
clang -c -emit-llvm -g ./$filename -o ./result.bc
wpa -ander ./result.bc
if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m TEST SUCCESS! \033[0m"
else
	echo -e "\033[41;33m TEST FAILED! \033[0m"
	return;
fi
