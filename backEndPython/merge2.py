import json
import re

input_file_path1 = 'scaffoldLength.json'
input_file_path2 = 'merge.json'
output_file_path = 'new.json'

def merge(input_file1, input_file2, output_file):
   with open(input_file1) as f1, open(input_file2) as f2:
    data1 = json.load(f1)
    data2 = json.load(f2)
        # Sort the list of dictionaries by the 'start' attribute
        # sorted_data = sorted(data, key=lambda x: x['start'])

    output_data = [{
       'chromosomes':[],
       'mutations':[],
       'genes':[]
    }]


    for record in data2:  
        new_record = {
            'chromosome': record['Chr'],
            'BP': record['BP'],
            'pop ID': record['Pop ID'],
            'p_nuc': record['P Nuc'],
            'p': record['P'],
            'muValues':record['MuValues']
        } 
        output_data[0]['mutations'].append(new_record)


    for record in data2:  
        new_record = {
            "chromosomeName": record["chromosome"],
            "name": record["name"],
            "start": record["start"], 
            "end": record["end"], 
            "width": record["width"] 
        } 
        output_data[0]['genes'].append(new_record)
        
    

    for record in data1:
        length = int(record['Length'])
        new_record = {
            'name': record['chromosome'],
            'length': length
        }
        output_data[0]['chromosomes'].append(new_record)

    

    with open(output_file, 'w') as f:
        json.dump(output_data, f)

merge(input_file_path1, input_file_path2, output_file_path)
