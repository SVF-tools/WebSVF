SetupPath="${HOME}"
SetupSVFDIR="SetupSVF"
SETUP_PATH="${SetupPath}/${SetupSVFDIR}"
STORE="STORE"
STORE_PATH=${SETUP_PATH}/${STORE}

if [ -d "$STORE_PATH" ]; then
    
    rm -rf ${STORE_PATH}
    mkdir ${STORE_PATH}
    echo "DONE"
else
    echo "Cannot find ${STORE_PATH}"
fi