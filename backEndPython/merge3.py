import pandas as pd

def merge_tsv_to_json(tsv_files, output_file):
    dfs = [pd.read_csv(file, sep='\t') for file in tsv_files]
    merged_df = pd.concat(dfs, ignore_index=True)
    merged_df.to_json(output_file, orient='records')

# Call the function with your file paths
merge_tsv_to_json(['gasp_scaffold_length.tsv', 'genomeData.tsv', 'Goniastrea_genes'], 'merged.json')