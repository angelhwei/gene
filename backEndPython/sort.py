import json

# Load the JSON data from file
with open('compressGeneFormat.json') as f:
    data = json.load(f)

# Sort the list of dictionaries by the 'name' attribute
sorted_data = sorted(data, key=lambda x: x['start'])

# Write the sorted data to a new JSON file
with open('sorted.json', 'w') as f:
    json.dump(sorted_data, f)
