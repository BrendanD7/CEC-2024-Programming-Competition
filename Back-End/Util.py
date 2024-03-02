import pandas as pd
import numpy as np

# Method to calculate a weighted score for each day
def calculate_score(data):
    if(data.empty):
        return -100
    value_world = data['value_world'].values[0]
    value_oil = data['value_oil'].values[0]
    value_species = data['value_species'].values[0]
    value_temperature = data['value_temperature'].values[0]
    if(any(pd.isna(val) for val in [value_world, value_oil, value_species, value_temperature])):
        return -100
    if(value_world == 1):
        return -100
    weight_preserve = 0.5
    weight_acquire = 0.45
    weight_info = 0.05

    # Calculate the weighted score
    score = (value_oil * weight_acquire) + (value_species * weight_preserve) + (value_temperature * weight_info) 
    return score

# Method to find the score of all positions, and return the best position
def find_best_position(data, start):
    valid_range_x = range(max(0, start[0] - 5), min(100, start[0] + 5 + 1))
    valid_range_y = range(max(0, start[1] - 5), min(100, start[1] + 5 + 1))
    scores = np.full((100, 100), -200.00, dtype=float)
    for i in valid_range_x:
        for j in valid_range_y:
            data_parse = data[(data['x'] == i) & (data['y'] == j)]
            score = calculate_score(data_parse)
            scores[i,j] = score
    max_indices = np.unravel_index(np.argmax(scores, axis=None), scores.shape)
    return scores, max_indices
    
# Method to read all data files 
def read_files():
    start = (0,0)
    days = []
    for i in range(1, 31):
        grid = pd.read_csv(f"../data/world_array_data_day_{i}.csv", index_col=0)   
        oil_data = pd.read_csv(f"../data/oil_data_day_{i}.csv", index_col=0)
        species_data = pd.read_csv(f"../data/species_data_day_{i}.csv", index_col=0)
        temperature_data = pd.read_csv(f"../data/temperature_data_day_{i}.csv", index_col=0)
        combined_data = pd.merge(grid, oil_data, how="inner", on=['x', 'y'], suffixes=('_world', '_oil'))
        combined_data = pd.merge(combined_data, species_data, how="inner", on=['x', 'y'])
        combined_data = pd.merge(combined_data, temperature_data, how="inner", on=['x', 'y'], suffixes=('_species', '_temperature'))
        scores, indices = find_best_position(combined_data, start)
        
        scores_list = scores.astype(float).tolist()
        start_tuple = tuple(map(int, start))
        indices_tuple = tuple(map(int, indices))
        
        data = {}
        data['initialPos'] = start_tuple
        data['finalPos'] = indices_tuple
        data['scores'] = scores_list
        days.append(data)
        start = indices
    return days
    