cd ~/
mkdir project
cd project
wget http://llvm.org/releases/7.0.0/llvm-7.0.0.src.tar.xz
wget http://llvm.org/releases/7.0.0/cfe-7.0.0.src.tar.xz
tar -xvf llvm-7.0.0.src.tar.xz
tar -xvf cfe-7.0.0.src.tar.xz
rm llvm-7.0.0.src.tar.xz
rm cfe-7.0.0.src.tar.xz

mv cfe-7.0.0.src llvm-7.0.0.src/tools/clang
mkdir llvm-7.0.0.obj
cd llvm-7.0.0.obj
cmake -DCMAKE_BUILD_TYPE=MinSizeRel ../llvm-7.0.0.src
make -j8

