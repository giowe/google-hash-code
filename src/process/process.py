import os
import sys
import json

from tqdm import tqdm
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

# print(json.dumps(initialState, indent=4))

N = initialState["N"]
F = initialState["F"]
rides = initialState["rides"]
magia = 10000

try:
    G = read_gpickle(input_path + "graph.gpickle")
except:
    G = DiGraph()
    G.add_nodes_from(range(N + 1))

    print(G.number_of_nodes())

    for a in range(N):
        rideA = rides[a]
        print("{}/{}".format(a, N))
        for b in range(N):
            rideB = rides[b]
            travelAB = get_distance(rideA["finish"], rideB["start"])

            if rideA["latestStart"] + rideA["dist"] + travelAB <= rideB["latestStart"] and abs(rideA["latestStart"] + rideA["dist"] + travelAB - rideB["earliestStart"]) < magia:
                G.add_edge(a, b, weight=1/rideB["dist"])

        distOrigRide = get_distance({"x": 0, "y": 0}, rideA["start"])
        if distOrigRide <= rideA["latestStart"] and abs(distOrigRide - rideA["earliestStart"]) < magia:
            G.add_edge(N, a, weight=1 / rideA["dist"])

    write_gpickle(G, input_path + "graph.gpickle")

for f in range(F):
    print("{}/{}".format(f + 1, F))

    tree = nx.edge_dfs(G, N, "original")
    print(tree)

    # minScore = 9999999999999999999
    # for v in range(N):
    #     if has_path(G, N, v):
    #         print("has path")
    #         distance, path = single_source_dijkstra(G, N, v)
    #         if distance < minScore:
    #             minScore = distance
    #             minSol = path

    # for nodeIndex in minSol:
    #     if nodeIndex != N:
    #         G.remove_node(nodeIndex)

with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
