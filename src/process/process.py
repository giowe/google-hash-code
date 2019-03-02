from pathlib import Path, PurePath
import os
import sys
import pickle
import json

(process_path, input_path, output_path) = sys.argv

with open(input_path) as f:
    initialState = json.load(f)

out = []

limit = None

if limit:
    photos = initialState["photos"][:limit]
else:
    photos = initialState["photos"]
H = initialState["H"]
V = initialState["V"]


# Utility
def get_match_score(A, B):
    common = 0
    not_in_a = 0
    not_in_b = 0
    for idx, bit_b in enumerate(A["tags_index"]):
        bit_a = B["tags_index"][idx]
        if bit_a or bit_b:
            if bit_a and bit_b:
                common = common + 1
            elif not bit_a and bit_b:
                not_in_a = not_in_a + 1
            else:
                not_in_b = not_in_b + 1
    return min(common, not_in_a, not_in_b)

def get_common_tags(A, B):
    common_count = 0
    merged_list = []
    for idx, bit_b in enumerate(A["tags_index"]):
        bit_a = B["tags_index"][idx]
        if bit_a and bit_b:
            common_count = common_count + 1
            merged_list.append(1)
        elif bit_a or bit_b:
            merged_list.append(1)
        else:
            merged_list.append(0)
    return [common_count, merged_list]


# Create tags list and tags bitmask for each photo,
# add horizontal photos to unsorted list of slides
# create unsorted list of vertical photos
tags = []
unsorted_slides = []
vertical_photos = []


# Load photos pickle with tags bitmask if exists, otherwise create and save
pickle_path = str(PurePath(input_path).parent.joinpath("photos_{}.pickle".format(PurePath(input_path).stem)))

if os.path.isfile(pickle_path):
    print("Loading photos from file")
    with open(pickle_path, "rb") as f:
        (photos, unsorted_slides, vertical_photos) = pickle.load(f)

else:
    print("Creating tags bitmask")
    for idx, photo in enumerate(photos):
        print("{}/{}".format(idx, len(photos)))
        photo["idx"] = idx
        photo["tags_index"] = []
        photo["tags_index"].extend([0] * len(tags))
        for tag in photo["tags"]:
            try:
                index = tags.index(tag)
                photo["tags_index"][index] = 1
            except:
                tags.append(tag)
                photo["tags_index"].append(1)

    print("Filling partial bitmasks")
    for photo in photos:
        if len(photo["tags_index"]) < len(tags):
            photo["tags_index"].extend([0] * (len(tags) - len(photo["tags_index"])))
        if photo["orientation"] is "H":
            unsorted_slides.append({"photos": [photo["idx"]], "tags_index": photo["tags_index"]})
        else:
            vertical_photos.append(photo)

    print("Saving photos with tags bitmask to file")
    with open(pickle_path, "wb") as f:
        pickle.dump([photos, unsorted_slides, vertical_photos], f)


# Add similarily matched vertical photos to list of unsorted slides
print("Matching vertical photos:")
for idx_a, photo_a in enumerate(vertical_photos):
    print("{}/{}".format(idx_a, len(vertical_photos)))
    if photo_a is not None:
        slide = {}
        slide["photos"] = [photo_a["idx"]]
        best_score = 0
        best_match = None
        best_match_idx = None
        best_merged_list = None
        for idx_b, photo_b in enumerate(vertical_photos):
            if photo_b is not None and idx_a != idx_b:
                (cur_score, merged_list) = get_common_tags(photo_a, photo_b)
                if cur_score > best_score or best_match == None:
                    best_score = cur_score
                    best_match = photo_b
                    best_match_idx = idx_b
                    best_merged_list = merged_list
        if best_match is not None:
            slide["photos"].append(best_match["idx"])
            slide["tags_index"] = merged_list
            vertical_photos[idx_a] = None
            vertical_photos[best_match_idx] = None
        if len(slide["photos"]) == 2:
            unsorted_slides.append(slide)


# Sort slides
print("Sorting slides")
for idx_a, slide_a in enumerate(unsorted_slides):
    print("{}/{}".format(idx_a, len(unsorted_slides)))
    if slide_a is not None:
        out.append(slide_a["photos"])
        best_score = 0
        best_match = None
        best_match_idx = None
        for idx_b, slide_b in enumerate(unsorted_slides):
            if slide_b is not None and idx_a != idx_b:
                cur_score = get_match_score(slide_a, slide_b)
                if cur_score > best_score or best_match == None:
                    best_score = cur_score
                    best_match = slide_b
                    best_match_idx = idx_b
        if best_match is not None:
            out.append(best_match["photos"])
            unsorted_slides[idx_a] = None
            unsorted_slides[best_match_idx] = None


with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
