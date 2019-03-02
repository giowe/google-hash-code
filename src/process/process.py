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
import math
import random
import copy

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
			print("\tloading tag structure from file")
			tags_structure = pickle.load(f)
	else:
		print("\tcompunting tag structure")
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

	print("\ttag number: ", len(tags_structure) )
	return tags_structure


def get_score(index1, index2):
    if index1 != index2:
        photo1_tags = photos[index1]["tags"][:]
        photo2_tags = photos[index2]["tags"][:]

        count_first = 0 
        count_common = 0

        for t in photo1_tags:
            if t in photo2_tags:
                count_common += 1
            else:
                count_first +=1

        return min([count_first, count_common, len(photo2_tags) - count_common])
    else:
        return 0

def get_score3(i1, i2, i3):
	return get_score(i1, i2) + get_score(i2, i3)

# def generate_matrix():
#     size = len(photos)
#     I = np.zeros(shape=(size, size))
#     S = np.zeros(shape=(size, size))

#     for y in range(size):
#         if photos[y]["orientation"] != "V":
#             for x in range(y, size):
#                 if photos[x]["orientation"] != "V":
#                     score = get_score(x, y)
#                     I[x, y] = bool(score)
#                     S[x, y] = score
#                     I[y, x] = bool(score)
#                     S[y, x] = score
#     return I, S


def generate_vv():
	
	while len(vList) != 0:

		# select random photos from V set 
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
			"tagsCount" : len(merged_tags),
			"id1": id1,
			"id2": id2,
			"used": False
		})

		# index = len(photos) - 1
		# for t in merged_tags:
		# 	if t in tags_structure:
		# 		tags_structure[t][index] = False
		# 	else:
		# 		tags_structure[t] = { index : False}

		vList.remove(id1)
		vList.remove(id2)

# print("Generating tags")
# tags_db = generate_tags_structure()

print("Generating VV pairs")
generate_vv()

# ##########
# PARAMETERS
# ##########
P_NUMB = 6
MAX_ITERS = 10
MUTATION_RATE = 1.0
PERTURBATION_RATE = randint(0, 5) / 100.0

print("Using perturbation rate of ", PERTURBATION_RATE)

pop = [] # sorted population vector
best_score = 0

evaluated_complete= list(range(len(photos)))
evaluated = []

for e in evaluated_complete:
	if photos[e]["orientation"] != "V":
		evaluated.append( e )

print("Starting optimization: ")

# return a structure as out
# solution is in the form [ [12], [1], [4], ..., [5] ]
def random_solution():
	sol = []
	random.shuffle(evaluated)
	return copy.deepcopy(evaluated)

# return a solution searching in the tag space
def semirandom_solution( ):
	sol = []
	random.shuffle(evaluated)
	search_len = 100

	sol.append( evaluated[0] )

	for x in range( 1, len(evaluated) ):
		max_score = -1
		best_match = -1
		curr_score = 0

		for e in evaluated[x:(x+search_len) ]:

			if e in sol[-search_len:]:
				continue
			
			curr_score = get_score( sol[-1], e )

			if curr_score > max_score:
				best_match = e
				max_score = curr_score

		if best_match != -1:
			sol.append( best_match )

	return sol

# return a solution searching in the tag space
def random_rotated_solution( ):
	random.shuffle(evaluated)
	for i in range( 1, len(evaluated) - 1 ):
		if get_score3( evaluated[i-1], evaluated[i], evaluated[i+1] ) < get_score3( evaluated[i+1], evaluated[i], evaluated[i-1] ):
			evaluated[i-1], evaluated[i+1] = evaluated[i+1], evaluated[i-1]

	return   copy.deepcopy(evaluated)

# return a structure as out
def mutate( sol ):
	index_to_mutate = math.ceil( PERTURBATION_RATE * randint(0, len(sol)-1) )

	res = copy.deepcopy( sol )

	# rotate
	for x in range(index_to_mutate):
		i = randint( 0, len(res) - 2 )
		res[i], res[i+1] = res[i+1], res[i]

	for x in range(index_to_mutate):
		[i1, i2] = random.sample( range(0, len(res) - 1 ), 2 )
		res[i1], res[i2] = res[i2], res[i1]
	

	return res

def scorer( sol ):
	score = 0
	for i in range( len(sol) - 1 ):
		score += get_score( sol[i], sol[i+1] )

	return score

def generate_out( sol ):
	res = []
	for e in sol:
		if photos[e]["orientation"] == "H":
			res.append( [e] )
		elif photos[e]["orientation"] == "VV":
			res.append( [ photos[e]["id1"], photos[e]["id2"] ] )
		else:
			print("ERROR: found a V photo when generating final solution")

	return res

counter = 0
while counter < MAX_ITERS:

	print(".", end="", flush=True)
	# Generate new solutions
	new_sol = semirandom_solution( )

	# print("Generating new sol")
	pop.append( {"score" : scorer(new_sol), "solution" : new_sol } )

	# Mutate the best solutions 
	if len(pop) >= P_NUMB:
		for j in range( math.ceil(P_NUMB * MUTATION_RATE) ):
			mutation = mutate( pop[j]["solution"] )
			pop.append( {"score" : scorer(mutation), "solution" : mutation } )


	pop.sort( key=lambda x : x["score"], reverse=True)
	pop = pop[0:P_NUMB]
	
	# print(pop)

	if best_score < pop[0]["score"]:
		best_score = pop[0]["score"] 
		counter = 0
		print(" - new best solution found - score: ", best_score, " current population: ", len(pop) )

	counter += 1

print( pop[0]["solution"] )
out = generate_out( pop[0]["solution"] )

with open(output_path, "w") as f:
    json.dump( out, f, indent=4)
