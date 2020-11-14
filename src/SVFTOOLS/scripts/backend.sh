function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}

function errorshow() {
    echo -e "\033[1;41;37m$1\033[0m"
}

cd ~/SVF-example
source ./env.sh >> /dev/null 2>&1
cmake .
make

highlight "[BUILD BACKEND DONE.]"

cd ~
script="backend.sh"
if [[ -f $script ]]; then
    rm $script
fi

cd ~