import json
import re

input_file_path1 = 'compressGeneFormat.json'
input_file_path2 = 'mutation.json'
output_file_path = 'merge.json'

def fetch_distance_and_not_between(input_file1, input_file2, output_file):
   with open(input_file1) as f1, open(input_file2) as f2:
    data1 = json.load(f1)
    data2 = json.load(f2)
        # Sort the list of dictionaries by the 'start' attribute
        # sorted_data = sorted(data, key=lambda x: x['start'])

    output_data = []

    i=0
    j=0

    for record in data2:  
        new_record = {
            'Chr': record['Chr'],
             'BP': record['BP'],
             'Pop ID': record['Pop ID'],
             'P Nuc': record['P Nuc'],
             'P': record['P'],
             'MuValues':record['MuValues']
        } 
        output_data.append(new_record)
        
    for record in data1:

        start = int(record['start'])
        end = int(record['end'])
        i+=1
        distance = abs(end - start)
        compressGene=int(distance/1000)
        if((distance%1000)!=0):compressGene+=1

        new_record = {
            "chromosome": record["chromosome"],
            "name": record["name"],
            "start": record["start"], #
            "end": record["end"], #
            "gene":[
            {
                "start": record["start"], #
                "width": compressGene #
            }
            ]
        }

        output_data.append(new_record)
    
    

    with open(output_file, 'w') as f:
        json.dump(output_data, f)

fetch_distance_and_not_between(input_file_path1, input_file_path2, output_file_path)
