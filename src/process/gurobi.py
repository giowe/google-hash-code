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

# Create a new model
m = Model("mip1")

# Create variables
x = m.addVar(vtype=GRB.BINARY, name="x")
y = m.addVar(vtype=GRB.BINARY, name="y")
z = m.addVar(vtype=GRB.BINARY, name="z")

# Set objective
m.setObjective(x + y + 2 * z, GRB.MAXIMIZE)

# Add constraint: x + 2 y + 3 z <= 4
m.addConstr(x + 2 * y + 3 * z <= 4, "c0")

# Add constraint: x + y >= 1
m.addConstr(x + y >= 1, "c1")

m.optimize()

for v in m.getVars():
    print(v.varName, v.x)

print('Obj:', m.objVal)

with open(output_path, "w") as f:
    json.dump(out, f, indent=4)
