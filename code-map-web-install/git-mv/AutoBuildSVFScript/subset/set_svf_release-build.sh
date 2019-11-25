mv ~/WORKSPACE/SVF ~/project/

cd ~/project/

#git clone https://github.com/SVF-tools/SVF.git SVF

cd SVF
mkdir Release-build
cd Release-build
cmake ../
make -j4


