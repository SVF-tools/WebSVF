#!/bin/bash
sysOS=$(uname -s)
if [[ $sysOS == "Linux" ]]; then
        sudo apt-get update
        sudo apt-get upgrade -y
        sudo apt-get install build-essential libtinfo-dev wget curl git cmake python3-pip libgraphviz-dev graphviz -y
        sudo pip3 install pygraphviz
fi
