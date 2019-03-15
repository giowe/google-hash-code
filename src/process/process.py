import os
import sys
import json
import pickle
from pathlib import Path, PurePath
import numpy as np
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
H = initialState["H"]
V = initialState["V"]
vList = initialState["vList"]
hList = initialState["hList"]


def generate_tags_structure():
    pickle_path = PurePath(dir_path).parent.parent.joinpath("parsedInFiles").joinpath("tags_structure_{}.pickle".format(str(PurePath(input_path).stem)))

    if os.path.isfile(str(pickle_path)):
        with open(str(pickle_path), 'rb') as f:
            tags_structure = pickle.load(f)
    else:
        tags_structure = {}
        for i in range(len(photos)):
            photo = photos[i]
            for tag in photo["tags"]:
                if tag in tags_structure:
                    tags_structure[tag][i] = False
                else:
                    tags_structure[tag] = {i: False}
        with open(str(pickle_path), 'wb') as f:
            pickle.dump(tags_structure, f, protocol=pickle.HIGHEST_PROTOCOL)

    return tags_structure


def get_score(index1, index2):
    if index1 != index2:
        photo1_tags = photos[index1]["tags"][:]
        photo2_tags = photos[index2]["tags"][:]
        common = []
        first = []

        for t in photo1_tags:
            if t in photo2_tags:
                common.append(t)
                photo2_tags.pop()
            else:
                first.append(t)

        return min([len(common), len(first), len(photo2_tags)])
    else:
        return 0


def generate_matrix():
    size = len(photos)
    I = np.zeros(shape=(size, size))
    S = np.zeros(shape=(size, size))

    for y in range(size):
        if photos[y]["orientation"] != "V":
            for x in range(y, size):
                if photos[x]["orientation"] != "V":
                    score = get_score(x, y)
                    I[x, y] = bool(score)
                    S[x, y] = score
                    I[y, x] = bool(score)
                    S[y, x] = score
    return I, S


def generate_vv(tags_structure):
    while len(vList) != 0:
        l = len(vList)
        r1, r2 = randint(0, l - 1), randint(0, l - 1)
        if r1 == r2:
            continue

        id1, id2 = vList[r1], vList[r2]
        photo1, photo2 = photos[id1], photos[id2]
        tags1, tags2 = photo1["tags"], photo2["tags"]
        merged_tags = list(set(tags1 + tags2))

        photos.append({
            "orientation": "VV",
            "tags": merged_tags,
            "id1": id1,
            "id2": id2,
            "used": False
        })

        for t in merged_tags:
            tags_structure[t][len(photos) - 1] = False

        vList.remove(id1)
        vList.remove(id2)


tags_structure = generate_tags_structure()
if V != 0:
    generate_vv(tags_structure)
I, S = generate_matrix()
deg = np.sum(I, axis=1)
sort_deg = np.argsort(deg)

i = -1
s = sort_deg[i]


for x in range(int(H + V/2)):
    s_max = np.argmax(S[:,s])

    if photos[s]["used"] or photos[s_max]["used"] or s_max == s or photos[s_max]["orientation"] == "V" or photos[s]["orientation"] == "V":
        i -= 1
        s = sort_deg[i]

        continue

    photos[s]["used"] = True
    S[s_max, s] = 0
    S[s, s_max] = 0

    if photos[s]["orientation"] == "VV":
        out.append([photos[s]["id1"], photos[s]["id2"]])
        photos[photos[s]["id1"]]["used"] = True
        photos[photos[s]["id2"]]["used"] = True
    else:
        out.append([int(s)])

    s = s_max

if photos[s_max]["orientation"] == "VV":
    out.append([photos[s_max]["id1"], photos[s_max]["id2"]])
    photos[photos[s_max]["id1"]]["used"] = True
    photos[photos[s_max]["id2"]]["used"] = True
else:
    out.append([int(s_max)])

with open(output_path, "w") as f:
    json.dump(out, f, indent=4)