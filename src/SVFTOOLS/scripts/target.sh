function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}

function run() {
    echo -e "\033[1;43;37m$1\033[0m"
}

function don() {
    echo -e "\033[1;46;37m$1\033[0m"
}

function delete() {
    echo -e "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\c"
}

function errorshow() {
    echo -e "\033[1;41;37m$1\033[0m"
}

fileName=example.c
time=$(date "+%Y-%m-%d-%H-%M-%S")
timeshow=$(date "+%Y-%m-%d %H:%M:%S")
highlight "TASK: ${timeshow} COMPILING... "
cd ~/INPUT_PROJECT
source ~/SVF-example/env.sh >> /dev/null 2>&1

for i in `ls`
do
    if [ -f $i ] && [ "${i##*.}"x = "bc"x ]; then
        sudo rm ${i}
    elif [ -f $i ] && [ "${i##*.}"x = "log"x ]; then
        sudo rm ${i}
    fi
done
run "-- [1/3] Clang JOB RUNNING..."
clang -c -g -S -fno-discard-value-names -emit-llvm $fileName -o ${fileName%%.*}.${time}.bc 2>${fileName%%.*}.${time}.clangbug.log
# delete


folder="Graph_Files"

if [ -d ${folder} ]; then
    sudo rm -rf ${folder}
fi

Log="Build_Logs"


if [ -d ${Log} ]; then
    sudo rm -rf ${Log}
fi

if [ -f ${fileName%%.*}.${time}.bc ]; then
    don "-- [1/3] Clang JOB DONE.     "
    run "-- [2/3] SVF JOB RUNNING...  "
    ~/SVF-example/bin/svf-ex ${fileName%%.*}.${time}.bc 1>${fileName%%.*}.${time}.log 2>${fileName%%.*}.${time}.svfbug.log
    mkdir ${folder}
    mv *.dot ./${folder}/
    mkdir ${Log}
    mv *.log ./${Log}/
    # delete
    don "-- [2/3] SVF JOB DONE.       "

    run "-- [3/3] GRAPH JOB RUNNING..."
    svf="svf"
    # echo $timeshow
    cd ${folder}
    mkdir ${svf}
    for i in `ls`
    do
        if [ -f $i ] && [ "${i##*.}"x = "dot"x ]; then
            dot -q -Tsvg $i > ${svf}/${i%%.*}.${time}.svf
            mv $i ${i%%.*}.${time}.dot
        fi
    done
    # delete
    don "-- [3/3] GRAPH JOB DONE.     "

    highlight "TASK: ${timeshow} ALL JOB DONE."
else
    errorshow "TASK: ${timeshow} Clang JOB ERROR. Please Check ${fileName%%.*}.${time}.clangbug.log"
fi




cd ~
script="target.sh"
if [[ -f $script ]]; then
    rm $script
fi

cd ~