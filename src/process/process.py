import os
import sys
import json
import

dir_path = os.path.dirname(os.path.realpath(__file__))
(process_path, input_path, output_path) = sys.argv

with open(input_path) as f:
    initialState = json.load(f)

out = []

N = initialState["N"]
M = initialState["M"]
C = initialState["C"]
R = initialState["R"]
CO = initialState["CO"]
W_MAP = initialState["W_MAP"]

print(W_MAP)

with open(output_path, "w") as f:
    json.dump(out, f, indent=4)