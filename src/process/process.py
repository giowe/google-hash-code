import os
import sys
import json
from random import randint
import networkx as nx
from networkx import DiGraph, read_gpickle, write_gpickle
from networkx.algorithms.shortest_paths import has_path, single_source_dijkstra


dir_path = os.path.dirname(os.path.realpath(__file__))
(process_path, input_path, output_path) = sys.argv

with open(input_path) as f:
    initialState = json.load(f)

out = []

photos = initialState["photos"]
tags_structure = {}

for i in range(len(photos)):
    photo = photos[i]
    for tag in photo["tags"]:
        if tag in tags_structure:
            tags_structure[tag][i] = True
        else:
            tags_structure[tag] = {i: True}

print(tags_structure)


with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
