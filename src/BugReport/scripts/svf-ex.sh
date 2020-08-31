currentPath=$(pwd)
cd $1

cmake .
make

if [ -f /usr/bin/svf-ex ]; then
    sudo rm /usr/bin/svf-ex
fi
sudo mv ./bin/svf-ex /usr/bin/

cd ${currentPath}
## warning
function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}
highlight "[COMPILE JOB DONE.]"
