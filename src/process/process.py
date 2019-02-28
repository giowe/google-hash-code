import os
import sys
import json
import numpy as np
import networkx as nx
from networkx import DiGraph, read_gpickle, write_gpickle
from networkx.algorithms.shortest_paths import has_path, single_source_dijkstra


dir_path = os.path.dirname(os.path.realpath(__file__))
(process_path, input_path, output_path) = sys.argv

with open(input_path) as f:
    initialState = json.load(f)

out = []

photos = initialState["photos"]

# todo per Valce: dumpami questa struttura in un file
tags_structure = {}
for i in range(len(photos)):
    photo = photos[i]
    for tag in photo["tags"]:
        if tag in tags_structure:
            tags_structure[tag][i] = False
        else:
            tags_structure[tag] = {i: False}
# todo fine struttura da dumpare. se trova il  file usa quello se no ricalcola

def get_score(index1, index2):
    photo1_tags = photos[index1]["tags"][:]
    photo2_tags = photos[index2]["tags"][:]
    print(photo1_tags)
    print(photo2_tags)
    common = []
    first = []

    for t in photo1_tags:
        if t in photo2_tags:
            common.append(t)
            photo2_tags.pop()
        else:
            first.append(t)

    print(len(common), len(first), len(photo2_tags))

    return min([len(common), len(first), len(photo2_tags)])


def generate_matrix():
    pass
#print(tags_structure)


with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
