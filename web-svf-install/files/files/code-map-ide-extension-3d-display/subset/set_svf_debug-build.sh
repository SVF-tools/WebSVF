cd $SVF_HOME
mkdir Debug-build
cd Debug-build
cmake -D CMAKE_BUILD_TYPE:STRING=Debug ../
make -j4


