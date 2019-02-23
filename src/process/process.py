import os
import sys
import json
import networkx as nx
from networkx.algorithms.shortest_paths import has_path, single_source_dijkstra_path, single_source_d


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
G = nx.path_graph(N - 1)

for f in range(F):
    print("{}/{}".format(f + 1, F))

    ridesLen = len(rides)
    for a in range(ridesLen):
        rideA = rides[a]

        for b in range(ridesLen):
            rideB = rides[b]
            travelAB = get_distance(rideA["finish"], rideB["start"])

            if rideA["latestStart"] + rideA["dist"] + travelAB <= rideB["latestStart"] and abs(rideA["latestStart"] + rideA["dist"] + travelAB - rideB["earliestStart"]) < magia:
                G.add_edge(a, b, weight=1/rideB.dist)

    for i in range(ridesLen):
        ride = rides[i]
        distOrigRide = get_distance({ "x": 0, "y": 0}, ride["start"])
        if distOrigRide <= ride["latestStart"] and abs(distOrigRide - ride["earliestStart"]) < magia:
            G.add_edge(N, i, weight=0 if ride["dist"] == 0 else 1 / ride["dist"])

    minScore = 9999999999999999999
    for v in range(1, N):
        if has_path(G, N, v):
            path = single_source_dijkstra_path(G, N, v)

            # distance_to = shortest_path_length(G, N, v)
            print(path)




with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
