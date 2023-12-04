# import tsc file
import re

rows = []

with open('gasp_scaffold_length.tsv', 'r') as f:
    for line in f.readlines():
        row = line.split() # split by whitespace

        Chr=row[0]
        Length=row[1]

        row = {
             'chromosome': Chr,
             'Length': Length
         }
        rows.append(row)
        
import json
with open('scaffoldLength.json', 'w') as fout:
     json.dump(rows , fout)