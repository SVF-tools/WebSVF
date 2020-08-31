function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}
function errorshow() {
    echo -e "\033[1;41;37m$1\033[0m"
}
folder="Graph_Files"
if [ -d ${folder} ]; then
    sudo rm -rf ${folder}
fi
Log="Build_Logs"
if [ -d ${Log} ]; then
    sudo rm -rf ${Log}
fi
if [ -f ${1%%.*}.bc ]; then
    svf-ex ${1%%.*}.bc 1>${1%%.*}.log 2>${1%%.*}.error.log
    mkdir ${folder}
    mv *.dot ./${folder}/
    mkdir ${Log}
    mv *.log ./${Log}/
    svf-graph ${1%%.*}.c
    mv ./3D_CODE_GRAPH/* ./${folder}/
    rm -rf 3D_CODE_GRAPH
    highlight "[COMPILE JOB DONE.]"
else
    errorshow "[COMPILE JOB ERROR.]"
fi