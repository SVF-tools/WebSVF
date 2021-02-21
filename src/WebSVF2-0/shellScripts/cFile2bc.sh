export LLVM_COMPILER=clang
export LLVM_COMPILER_PATH=$HOME/llvm-clang/10/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04/bin/
export LLVM_DIR=$HOME/llvm-clang/10/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04

wllvm "$1.c" -c -emit-llvm -g -o "$1.bc"
