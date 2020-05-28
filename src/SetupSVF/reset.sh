下载必要文件并安装
echo -e "\033[42;37m DOWNLOAD LLVM SVF \033[0m"
bash ./sub/3.download_llvm_svf.sh

if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m DOWNLOAD LLVM SVF SUCCESS. \033[0m"
else
	echo -e "\033[41;33m DOWNLOAD LLVM SVF FAILED. \033[0m"
	return;
fi 

# 设置环境变量
echo -e "\033[42;37m SET ENVIRONMENT PATH \033[0m"
source ./sub/4.set_path_env.sh

if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m SET ENVIRONMENT PATH SUCCESS! \033[0m"
else
	echo -e "\033[41;33m SET ENVIRONMENT PATH FAILED! \033[0m"
	return;
fi 

# 测试
echo -e "\033[42;37m TEST \033[0m"
bash test.sh

if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m TEST SUCCESS! \033[0m"
else
	echo -e "\033[41;33m TEST FAILED! \033[0m"
	return;
fi
