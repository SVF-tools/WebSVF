#!/bin/bash
if [ -f /usr/bin/svf-graph ]; then
    sudo rm /usr/bin/svf-graph
fi
currentFolder=$pwd
cd $1
cp svf-graph.sh svf-graph
chmod u+x svf-graph
sudo mv svf-graph /usr/bin/svf-graph
cd $pwd
