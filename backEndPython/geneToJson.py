import json
import re

input_file_path = 'testjson.json'
output_file_path = 'compressGeneFormat.json'
start_attribute = 'start'
end_attribute = 'end'
separator = 'gasp1.m1b.','gasp1.m3.'


def custom_split(sepr_list, str_to_split):
        # create regular expression dynamically
        regular_exp = '|'.join(map(re.escape, sepr_list))
        return re.split(regular_exp, str_to_split)

def fetch_distance_and_not_between(input_file, output_file, start_attr, end_attr):
    with open(input_file, 'r') as f:
        data = json.load(f)
        # Sort the list of dictionaries by the 'start' attribute
        # sorted_data = sorted(data, key=lambda x: x['start'])

    output_data = []

    i=0
    for record in data:
        start = int(record[start_attr])
        end = int(record[end_attr])
        i+=1
        # nums_between = list(range(start+1, end))
        # not_between = list(filter(lambda x: x not in nums_between, range(start, end)))
        distance = abs(end - start)
        compressGene=int(distance)
        

        for word in separator:
          if word in record['name']:
           record['name'] = record['name'].replace(word, '')
        
        geneName="Gene" + str(record['name'])
        record['name']=int(record['name'])

        new_record = {
            "chromosome": record["chromosome"],
            "name": record["name"],
            "start": start, #
            "end": end, 
            "width": compressGene #
        }
        

        output_data.append(new_record)

    
    # Sort the list of dictionaries by the 'start' attribute
    output_data = sorted(output_data, key=lambda x: x['start'])
    with open(output_file, 'w') as f:
        json.dump(output_data, f)

fetch_distance_and_not_between(input_file_path, output_file_path, start_attribute, end_attribute)
