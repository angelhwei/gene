def compare_genomes(genome1, genome2):
    if len(genome1) != len(genome2):
        raise ValueError("Genome sequences are of different lengths")
    
    differences = []
    in_diff = False
    diff_start = None
    for i in range(len(genome1)):
        if genome1[i] != genome2[i]:
            if not in_diff:
                diff_start = i
                in_diff = True
        else:
            if in_diff:
                differences.append((diff_start, i-1))
                in_diff = False
                diff_start = None
    
    if in_diff:
        differences.append((diff_start, len(genome1)-1))
    
    return differences
