import os
import sys
import json
from random import randint
import networkx as nx
from networkx import DiGraph, read_gpickle, write_gpickle
from networkx.algorithms.shortest_paths import has_path, single_source_dijkstra


def get_distance(p1, p2):
    return abs(p1["x"] - p2["x"]) + abs(p1["y"] - p2["y"])


dir_path = os.path.dirname(os.path.realpath(__file__))
(process_path, input_path, output_path) = sys.argv

out = []

with open(input_path) as f:
    initialState = json.load(f)

#print(json.dumps(initialState, indent=4))

'''
try:
    G = read_gpickle(input_path + "graph.gpickle")
    print("graph loaded from cache")
except:
    G = DiGraph()
    G.add_nodes_from(range(N + 1))
'''

with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
