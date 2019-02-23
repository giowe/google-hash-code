import os
import sys
import json

dir_path = os.path.dirname(os.path.realpath(__file__))
(process_path, input_path, output_path) = sys.argv

with open(input_path) as f:
  data = json.load(f)

print("input:")
print(json.dumps(data, indent=4))

with open(output_path, "w") as f:
  json.dump({"a": "b"}, f, indent=4)
