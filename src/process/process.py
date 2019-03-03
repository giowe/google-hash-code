import os
import sys
import json
import pickle
from pathlib import Path, PurePath
import numpy as np
from random import randint
import networkx as nx
import math
import random
import copy
from tqdm import tqdm

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
    t1 = photos[index1]["tags"][:]
    t2 = photos[index2]["tags"][:]

    common_tags = len(list(set(t1).intersection(t2)))

    return min([ len(t1) - common_tags, common_tags, len(t2) - common_tags])

def max_score( photo ):
	return math.floor( photo["tagsCount"] / 2 )

# if the ratio is 1.0 the tags are the same, if the ratio is 0 there are no tag in common
def tag_ratio( id1, id2 ):
	t1 = photos[id1]["tags"][:]
	t2 = photos[id2]["tags"][:]

	total_tags = len(list(set(t1 + t2)))
	common_tags = len(list(set(t1).intersection(t2)))

	return   common_tags - total_tags 

def generate_vv():
	
	random.shuffle(vList)

	for i in tqdm( range(0, len(vList), 2), file=sys.stdout, ncols=100, desc="pairing v"):
	
		id1 = vList[i]
		id2 = vList[i + 1]

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

def generate_vv_smart():
	
	random.shuffle(vList)

	to_be_eval = vList 
	
	pbar = tqdm(total=len(vList), ncols=100, file=sys.stdout, desc="pairing v smart")

	while to_be_eval:
	
		pbar.update(2)

		cid = to_be_eval.pop()

		best_id = 0
		best_ratio = -math.inf

		for nid in random.sample( to_be_eval, min(200, len(to_be_eval)) ):
			ratio = tag_ratio( cid, nid )
			if ratio >= best_ratio:
				best_ratio = ratio
				best_id = nid

		to_be_eval.remove( best_id )

		id1 = cid
		id2 = best_id

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

# print("Generating tags")
# tags_db = generate_tags_structure()
print("problem data --- ")
print("H: ", H)
print("V: ", V)
generate_vv_smart()

# remove vertical photos indices
evaluated_complete= list(range(len(photos)))
evaluated = []

for e in evaluated_complete:
	if photos[e]["orientation"] != "V":
		evaluated.append( e )

sol = []
SN = 1000
sol.append( evaluated[0] )
evaluated.pop(0)

L = len(evaluated) # solution lenght

for i in tqdm( range(L), ncols = 100, desc="processing", file=sys.stdout ):
		
	max_score_l = max_score( photos[ sol[-1] ] )
	max_profit = -math.inf
	max_profit_index = 0
	found = False

	for e2 in range( 0, min(SN, len(evaluated)) ):

		max_score_r = max_score( photos[evaluated[e2]] ) 
		score = get_score( sol[-1], evaluated[e2] )
		profit = score - 0.0 * abs(max_score_r - max_score_l)

		if score == max_score_r == max_score_l: # find a very good match
			sol.append( evaluated[e2] )
			evaluated.pop( e2 )
			found = True
			break
		else: # otherwise choose the match with best profit
			if max_profit < profit :
				max_profit = profit
				max_profit_index = e2

	if not found:
		sol.append( evaluated[max_profit_index] )
		evaluated.pop( max_profit_index )

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



print("score: ", scorer(sol) )
out = generate_out( sol )

with open(output_path, "w") as f:
    json.dump( out, f, indent=4)
