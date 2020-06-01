#!/usr/bin/env python

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
    info = n.attr['label']
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
        "ncolor": n.attr['color'],
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
        "ecolor": e.attr['color'],
        "source": e[0],
        "target": e[1],
    }
    file["links"].append(link)
    listid += 1
jsonData = json.dumps(file, indent=4)
finialData = codecs.decode(jsonData, 'unicode_escape')
print(finialData)
    # sys.stdout.write("%s,\n" % (json.dumps(file)))
with open(sys.argv[2], 'w') as outfile:
    outfile.write(finialData)
    print("DONE!\n")