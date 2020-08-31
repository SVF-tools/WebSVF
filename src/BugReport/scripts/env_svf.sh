PROJECTHOME=$(pwd)
sysOS=`uname -s`
install_path=$1
function highlight(){
    echo -e "\033[1;45;37m$1\033[0m"
}

if [ ! -d /usr/bin/llvm ]; then
    location=$(pwd)
    #######
    #1. llvm
    #######
    llvm_path="/usr/bin/llvm"
    llvm_zip="llvm.tar.xz"
    if [[ $sysOS == "Darwin" ]]; then
        wget -c https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/clang+llvm-10.0.0-x86_64-apple-darwin.tar.xz -O $llvm_zip
    elif [[ $sysOS == "Linux" ]]; then
        sudo apt-get update
        sudo apt-get upgrade -y
        sudo apt-get install build-essential libtinfo-dev wget curl git cmake python3-pip libgraphviz-dev graphviz -y
        sudo pip3 install pygraphviz
        wget -c https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz -O $llvm_zip
    fi
    
    sudo mkdir $llvm_path
    echo "[LOADING...]PLEASE WAIT FOR A MOMENT..."
    sudo tar -xf $llvm_zip -C $llvm_path --strip-components 1
    rm $llvm_zip
    highlight "[CONFIG LLVM DONE.]"
fi

export LLVM_DIR=/usr/bin/llvm
export PATH=$LLVM_DIR/bin:$PATH

flag=0
if [ -L $install_path/SVF ]; then
    let flag++
    echo "["$flag"]REMOVE OLD SVF LINK.."
    sudo rm -rf $install_path/SVF
fi

echo "["$flag"]BUILD NEW LINK.."
if [[ $sysOS == "Darwin" ]]
then 
    ln -s $install_path/lib/SVF-osx $install_path/SVF
    export SVF_DIR=$install_path/SVF/
elif [[ $sysOS == "Linux" ]]
then 
    ln -s $install_path/lib/SVF-linux $install_path/SVF
    export SVF_DIR=$install_path/SVF/
fi 
let flag++
echo "["$flag"]LLVM_DIR="$sysOS
let flag++
echo "["$flag"]SVF_DIR="$SVF_DIR
highlight "[CONFIG SVF DONE.]"

