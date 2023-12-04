import random
import compare

nucleotides = ['A', 'T', 'C', 'G']
dataset_size = 2809004
dataset = ''.join(random.choice(nucleotides) for _ in range(dataset_size))

print(dataset)

with open('dataset.txt', 'w') as f:
    f.write(dataset)


# add a mutation at a random position
mutation_position = random.randint(0, dataset_size - 1)
mutation_nucleotide = random.choice([n for n in nucleotides if n != dataset[mutation_position]])
dataset = dataset[:mutation_position] + mutation_nucleotide + dataset[mutation_position+1:]

# add a variation by replacing a sequence of nucleotides with a different sequence
variation_position = random.randint(0, dataset_size - 3)
variation_length = random.randint(1, 3)
variation_sequence = ''.join(random.choice(nucleotides) for _ in range(variation_length))
dataset = dataset[:variation_position] + variation_sequence + dataset[variation_position+variation_length:]

# write the dataset to a file
with open('variant.txt', 'w') as f:
    f.write(dataset)

with open('dataset.txt', 'r') as f1, open('variant.txt', 'r') as f2:
    genome1 = f1.read()
    genome2 = f2.read()

differences = compare.compare_genomes(genome1, genome2)
if differences:
    print("Differences found at the following positions:")
    for start, end in differences:
        print(f"Start: {start}, End: {end}")
else:
    print("No differences found")