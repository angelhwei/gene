# import tsc file
import re

rows = []
separator = '_gasp'
oldBP = 0
oldP = 0
value=0

def custom_split(sepr_list, str_to_split):
    # create regular expression dynamically
    regular_exp = '|'.join(map(re.escape, sepr_list))
    return re.split(regular_exp, str_to_split)


with open('genomeData.tsv', 'r') as f:
    for line in f.readlines():
        # row = custom_split(separator,line)
        row = line.split('\t')

        for word in separator:
          if word in row[2]:
           row[2] = row[2].replace(word, '')

        Chr=row[2]
        BP=int(row[3])
        PopID=row[5]
        PNuc=row[6]
        P=float(row[9])

        # if BP are the same then calculate the P value of OL & WLT 
        if(BP==oldBP): value=abs(P-oldP) 

        # previous BP & P
        oldBP=int(row[3])
        oldP=float(row[9])


        row = {
             'chromosome': Chr,
             'BP': BP,
             'PopID': PopID,
             'PNuc': PNuc,
             'P': P,
             'MuValues':value
         }
        value=0
        rows.append(row)
        
import json
with open('mutation.json', 'w') as fout:
     json.dump(rows , fout)