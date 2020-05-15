cd ~/

mkdir SVFTools
cd SVFTools
FILE=~/SetupSVF/clang-llvm-10.0.0.tar.xz

if [ -f "$FILE" ]; then
    echo "ALREADY FIND"
    cp ~/SetupSVF/clang-llvm-10.0.0.tar.xz ./
    tar -xvf clang-llvm-10.0.0.tar.xz
else
    # 下载 llvm release 10.0.0
    echo "CANNOT FIND"
    wget https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz
    tar -xvf clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz
    mv clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz ~/SetupSVF/clang-llvm-10.0.0.tar.xz
fi

mv clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04 clang-llvm-10.0.0