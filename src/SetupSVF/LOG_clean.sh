SetupPath="${HOME}"
SetupSVFDIR="SetupSVF"
SETUP_PATH="${SetupPath}/${SetupSVFDIR}"
LOG="LOG"
LOG_PATH="${SETUP_PATH}/${LOG}"

if [ -d "$LOG_PATH" ]; then
    
    rm -rf ${LOG_PATH}
    mkdir ${LOG_PATH}
    echo "DONE"
else
    echo "Cannot find ${LOG_PATH}"
fi