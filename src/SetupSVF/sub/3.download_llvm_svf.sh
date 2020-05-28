SVFToolsDIR="SVFTools"
SetupSVFDIR="SetupSVF"
SetupPath="${HOME}"
ToolsPath="${HOME}"
LLVM_DOWNLOAD_MAIN_PATH="https://github.com/llvm/llvm-project/releases/download"
SVF_DOWNLOAD_MAIN_PATH="https://github.com/codemapweb/SVF/releases/download/"
LLVM_EDITION="llvmorg-10.0.0"
SVF_EDITION="1.0"
TARXZ=".tar.xz"
LOG="LOG"
STORE="STORE"

OID_LLVM_FILE_NAME="clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04"
LLVM_FILE_NAME="clang-llvm"
SVF_FILE_NAME="SVF"

# tar
OLD_LLVM_TARXZ="${OID_LLVM_FILE_NAME}${TARXZ}"
LLVM_TARXZ="${LLVM_FILE_NAME}${TARXZ}"
SVF_TARXZ="${SVF_FILE_NAME}${TARXZ}"

# path
SETUP_PATH="${SetupPath}/${SetupSVFDIR}"
TOOLS_PATH="${ToolsPath}/${SVFToolsDIR}"
LOG_PATH="${SETUP_PATH}/${LOG}"

#path file
OLD_LLVM_TOOLS_FILE="${TOOLS_PATH}/${OID_LLVM_FILE_NAME}"
LLVM_TOOLS_FILE="${TOOLS_PATH}/${LLVM_FILE_NAME}"
SVF_TOOLS_FILE="${TOOLS_PATH}/${SVF_NAME}"

# tar path
STORE_PATH=${SETUP_PATH}/${STORE}
LLVM_TARXZ_STORE="${STORE_PATH}/${OLD_LLVM_TARXZ}" #llvm store
SVF_TARXZ_STORE="${STORE_PATH}/${SVF_TARXZ}" #svf store

OLD_LLVM_TOOLS_PATH_TARXZ="${TOOLS_PATH}/${OLD_LLVM_TARXZ}" # old llvm using
LLVM_TOOLS_PATH_TARXZ="${TOOLS_PATH}/${LLVM_TARXZ}" # llvm using
SVF_TOOLS_PATH_TARXZ="${TOOLS_PATH}/${SVF_TARXZ}" #svf using

if [ ! -d "$LOG_PATH" ]; then
    echo "mkdir ${LOG_PATH}"
    mkdir ${LOG_PATH}
else
    echo "ALREADY HAS ${LOG_PATH}"
fi

if [ ! -d "$STORE_PATH" ]; then
    echo "mkdir ${STORE_PATH}"
    mkdir ${STORE_PATH}
else
    echo "ALREADY HAS ${STORE_PATH}"
fi

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

echo "DOWNLOAD LLVM" | tee -a ${LOG_FILE}
cd ${STORE_PATH}
wget -c ${LLVM_DOWNLOAD_MAIN_PATH}/${LLVM_EDITION}/${OLD_LLVM_TARXZ} -a ${LOG_FILE} # download release
tar -xvf ${LLVM_TARXZ_STORE} -C ${TOOLS_PATH} | tee -a ${LOG_FILE} 2>&1 # tar -x
mv ${OLD_LLVM_TOOLS_FILE} ${LLVM_TOOLS_FILE} | tee -a ${LOG_FILE} 2>&1 # change llvm name

echo "DOWNLOAD SVF" | tee -a ${LOG_FILE}
cd ${STORE_PATH}
wget -c ${SVF_DOWNLOAD_MAIN_PATH}/${SVF_EDITION}/${SVF_TARXZ} -a ${LOG_FILE} # download release
tar -xvf ${SVF_TARXZ_STORE} -C ${TOOLS_PATH} | tee -a ${LOG_FILE} 2>&1 # tar -x
