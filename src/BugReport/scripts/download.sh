if [ -d $1 ]; then
    sudo rm -rf $1
fi

git clone https://github.com/SVF-tools/SVF-example.git $1

function highlight(){
    echo -e "\033[1;45;37m$1\033[0m"
}
highlight "[DOWNLOAD JOB DONE.]"