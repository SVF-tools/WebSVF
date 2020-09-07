function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}

function errorshow() {
    echo -e "\033[1;41;37m$1\033[0m"
}

fileName=example.c

cd ~/INPUT_PROJECT
source ~/SVF-example/env.sh

clang -c -g -S -fno-discard-value-names -emit-llvm $fileName -o ${fileName%%.*}.bc


folder="Graph_Files"

if [ -d ${folder} ]; then
    sudo rm -rf ${folder}
fi

Log="Build_Logs"

if [ -d ${Log} ]; then
    sudo rm -rf ${Log}
fi

if [ -f ${fileName%%.*}.bc ]; then

    ~/SVF-example/bin/svf-ex ${fileName%%.*}.bc 1>${fileName%%.*}.log 2>${fileName%%.*}.bug.log
    mkdir ${folder}
    mv *.dot ./${folder}/
    mkdir ${Log}
    mv *.log ./${Log}/

    highlight "[COMPILE JOB DONE.]"
else
    errorshow "[COMPILE JOB ERROR.]"
fi

cd ~
script="target.sh"
if [[ -f $script ]]; then
    rm $script
fi

cd ~