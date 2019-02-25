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

# print(json.dumps(initialState, indent=4))

N = initialState["N"]
F = initialState["F"]
rides = initialState["rides"]
magia = 10000

try:
    G = read_gpickle(input_path + "graph.gpickle")
    print("graph loaded from cache")
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


def rnd_node(G, N):
    while True:
        r = randint(0, N)
        if G.has_node(r):
            return r


for f in range(F):
    rideOut = []
    out.append(rideOut)
    print("{}/{}".format(f + 1, F))

    minScore = 9999999999999999999
    source = N
    for xxx in range(10):
        v = rnd_node(G, N)
        if has_path(G, source, v):
            print("has path")
            distance, path = single_source_dijkstra(G, source, v)

            simulation_time = 0
            print(path)
            for i in range(len(path)-1):
                if path[i] != N:
                    rideOut.append({"rideId": path[i], "started": simulation_time})
                    simulation_time += get_distance(rides[path[i]]["finish"], rides[path[i+1]]["start"])
                else:
                    simulation_time += get_distance({"x": 0, "y": 0}, rides[path[i+1]]["start"])

                simulation_time += rides[path[i + 1]]["dist"]

                if path[i] != N:
                    G.remove_node(path[i])

            source = path[-1]

    G.remove_node(source)

print(out)
with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
