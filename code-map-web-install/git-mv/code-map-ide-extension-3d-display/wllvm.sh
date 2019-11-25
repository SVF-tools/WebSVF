filename=$1
if [ "$filename" = "" ]; then
    echo "please input bc file"
fi
# sudo pip install wllvm
# export LLVM_COMPILER=clang -c -emit-llvm -g
# export LLVM_COMPILER_PATH=/home/spc/project/llvm-7.0.0.obj/bin
export LLVM_COMPILER=clang
# export WLLVM_OUTPUT_LEVEL=DEBUG
cd wllvm
rm * -rf

# CC=wllvm CXX=wllvm++ cmake -D CMAKE_BUILD_TYPE:STRING=Debug $filename
CC=wllvm CXX=wllvm++ cmake $filename
echo `CC=wllvm CXX=wllvm++ cmake $filename`
make -j4


# extract-bc src/LinearMath/libLinearMath.a
# llvm-ar x src/LinearMath/libLinearMath.bca
# cd src/LinearMath/
# ls -la

extract-bc -b src/LinearMath/libLinearMath.a
rm src/LinearMath/libLinearMath.a
# produces src/LinearMath/libLinearMath.a.bc .

cd ..
rm ./result/* -rf
mv wllvm/src/LinearMath/libLinearMath.a.bc ./result/wllvm_result.bc
wpa -ander -svfg -dump-svfg ./result/wllvm_result.bc
mv ./*.dot ./result/

python Dot2Json.py ./result/FS_SVFG.dot ./result/FS_SVFG.json
python Dot2Json.py ./result/SVFG_before_opt.dot ./result/SVFG_before_opt.json
