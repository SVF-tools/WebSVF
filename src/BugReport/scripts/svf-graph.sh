# !/bin/bash

#######
#1. recognize c file if not exit
#######
if [ ${1##*.} = "c" ]; then
    if [ -f ${1%%.*}.bc ]; then
        rm ${1%%.*}.bc
    fi
else
    echo "Please input a c file."
    exit
fi

#######
#2. compile c file by clang & generate bc and dot file through svf-ex
#######
clang -c -g -fno-discard-value-names -emit-llvm $1 -o ${1%%.*}.bc

svf-ex ${1%%.*}.bc
# rm ${1%%.*}.bc
if [ -d 3D_CODE_GRAPH ]; then
    rm 3D_CODE_GRAPH -rf
fi
mkdir 3D_CODE_GRAPH
mv *.dot ./3D_CODE_GRAPH/

filepath=$(pwd)/3D_CODE_GRAPH

if [ -f ${filepath}/Dot2Json.py ]; then
    sudo rm ${filepath}/Dot2Json.py
fi

#######
#3. generate the Dot2Json.py executable file
#######
sudo echo '#!/usr/bin/env python

import sys
import pygraphviz
import json
import re
import codecs

G = pygraphviz.AGraph()
G.read(sys.argv[1])
file = {"nodes": [], "links": []}
listid = 0
for n in G.nodes():
    info = n.attr["label"]
    info = info[1:-1]

    node_id = re.search(r"NodeID: \d+", info)
    line_position = re.search(r"line: \d+", info)
    ln_position = re.search(r"ln: \d+", info)
    file_position = re.search(r"file: [a-zA-Z0-9/\-.]+", info)
    fl_position = re.search(r"fl: [a-zA-Z0-9/\-.]+", info)
    fsPath = "NULL"
    line = -1

    if node_id:
        node_id = int(node_id.group()[7:])
    if line_position and file_position:
        line = line_position.group()[6:]
        fsPath = file_position.group()[6:]
    if ln_position and fl_position:
        line = ln_position.group()[4:]
        fsPath = fl_position.group()[4:]
    info = info.replace("\\<", "<")
    info = info.replace("\\{", "{")
    info = info.replace("\\}", "}")
    node = {
        "id": n,
        "nodeid": node_id,
        "listid": listid,
        "wholelabel": info,
        "ncolor": n.attr["color"],
        "fsPath": fsPath,
        "line": int(line)
    }
    file["nodes"].append(node)
    listid += 1
    # sys.stdout.write("%s,\n" % (json.dumps(file)))
listid = 0
for e in G.edges():
    link = {
        "listid": listid,
        "ecolor": e.attr["color"],
        "source": e[0],
        "target": e[1],
    }
    file["links"].append(link)
    listid += 1
jsonData = json.dumps(file, indent=4)
finialData = codecs.decode(jsonData, "unicode_escape")
# print(finialData)
    # sys.stdout.write("%s,\n" % (json.dumps(file)))
with open(sys.argv[2], "w") as outfile:
    outfile.write(finialData)' >${filepath}/Dot2Json.py

#######
#4. generate graph files
#######
python3 ${filepath}/Dot2Json.py ${filepath}/icfg.dot ${filepath}/control_flow_graph.json
python3 ${filepath}/Dot2Json.py ${filepath}/svfg.dot ${filepath}/value_flow_graph.json

rm ${filepath}/*.dot
rm ${filepath}/Dot2Json.py
