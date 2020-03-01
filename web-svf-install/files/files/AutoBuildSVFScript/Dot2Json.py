#!/usr/bin/env python

import sys
import pygraphviz
import json

def main():
    G = pygraphviz.AGraph()
    G.read(sys.argv[1])
    file = {"nodes": [], "links": []}
    for n in G.nodes():
        node = {
            "id": n,
            "wholelabel": n.attr['label'],
            "ncolor": n.attr['color']
        }
        file["nodes"].append(node)
        # sys.stdout.write("%s,\n" % (json.dumps(file)))
    for e in G.edges():
        link = {
            "ecolor": e.attr['color'],
            "source": e[0],
            "target": e[1],
        }
        file["links"].append(link)
        # sys.stdout.write("%s,\n" % (json.dumps(file)))
    with open(sys.argv[2], 'w') as outfile:
        json.dump(file, outfile, indent=4)
        sys.stdout.write("DONE!\n")


if __name__ == "__main__":
    main()
