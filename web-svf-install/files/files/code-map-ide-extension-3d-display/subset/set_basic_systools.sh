#!/bin/bash

if [ "$USER" = 'root' ]; then

	apt-get update
	apt-get install -y sudo
	apt-get install -y curl
	apt-get install -y gcc gdb build-essential
	apt-get install -y cmake
	apt-get install -y wget
	apt-get install -y git
else
	sudo apt-get update
	sudo apt-get install -y curl
	sudo apt-get install -y gcc gdb build-essential
	sudo apt-get install -y cmake
	sudo apt-get install -y wget
	sudo apt-get install -y git
fi

