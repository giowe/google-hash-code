import os
import sys
import json
from gurobipy import *

th = os.path.dirname(os.path.realpath(__file__))
(process_path, input_path, output_path) = sys.argv

out = []

with open(input_path) as f:
    initialState = json.load(f)

# print(json.dumps(initialState, indent=4))

N = initialState["N"]
F = initialState["F"]
rides = initialState["rides"]



with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
