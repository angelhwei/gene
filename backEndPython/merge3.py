import json

input_file_path1 = 'length.json'
input_file_path2 = 'gene.json'
input_file_path3 = 'mutations.json'
output_file_path = 'newData.json'

def merge(input_file1, input_file2, input_file3, output_file):
    with open(input_file1) as f1, open(input_file2) as f2, open(input_file3) as f3:
        data1 = json.load(f1)
        data2 = json.load(f2)
        data3 = json.load(f3)

        output_data = []

        for record1 in data1:
            new_record = {
                'chromosome': record1['chromosome'],
                'length': record1['Length'],
                'gene': [],
                'mutation': []
            }

            # Add genes to the new record
            for record2 in data2:
                if record2['chromosome'] == record1['chromosome']:
                    new_record['gene'].append({
                        'name': record2['name'],
                        'start': record2['start'],
                        'end': record2['end']
                    })

            # Add mutations to the new record
            for record3 in data3:
                if record3['chromosome'] == record1['chromosome']:
                    new_record['mutation'].append({
                        'BP': record3['BP'],
                        'popId': record3['PopID'],
                        'pNuc': record3['PNuc'],
                        'p': record3['P'],
                        'muValues': record3['MuValues']
                    })

            output_data.append(new_record)

    with open(output_file, 'w') as f:
        json.dump(output_data, f)

merge(input_file_path1, input_file_path2, input_file_path3, output_file_path)
