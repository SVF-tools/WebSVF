#!/bin/bash

# 安装基本工具
bash ./sub/1.system_tools.sh
echo -e "\033[42;37m INSTALL ESSENTIAL TOOLS \033[0m"
if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m INSTALL ESSENTIAL TOOLS SUCCESS! \033[0m"
else
	echo -e "\033[41;33m INSTALL ESSENTIAL TOOLS FAILED! \033[0m"
	return;
fi

# 检查网络
source ./sub/2.check_network.sh
if [ "x$?" = x'0' ]; then
	echo -e "\033[43;37m NETWORK CONNECTED. \033[0m"
else 
	echo -e "\033[41;33m NETWORK UNCONNECTION. \033[0m"
	return
fi

# 下载必要文件并安装
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

# 改造SVF setup.sh文件让它适应当前系统并安装
echo -e "\033[42;37m CREATE NEW SVF \033[0m"
bash ./sub/5.process_svf.sh

if [ "x$?" = x'0' ]; then
	echo -e "\033[44;37m CREATE NEW SVF SUCCESS! \033[0m"
else
	echo -e "\033[41;33m CREATE NEW SVF FAILED! \033[0m"
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
