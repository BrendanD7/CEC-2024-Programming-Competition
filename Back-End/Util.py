import pandas as pd
import numpy as np

# Method to calculate a weighted score for each day
def calculate_score(data, x, y):
    # Data is empty, return invalid
    if(data.empty):
        return -100
    
    # Retrieve values from Data
    value_world = data['value_world'].values[0]
    value_oil = data['value_oil'].values[0] * resources[x, y]
    value_metal = data['value_metal'].values[0] * resources[x, y]
    value_species = data['value_species'].values[0]
    value_coral = data['value_coral'].values[0]
    value_temperature = data['value_temperature'].values[0]
    
    # If any values arent provided, return invalid 
    if(any(pd.isna(val) for val in [value_world, value_oil, value_species, value_temperature, value_metal, value_coral])):
        return -100
    
    # If the position is land, return invalid
    if(value_world == 1):
        return -100
    
    # Assign Weights to values
    weight_species = 0.30
    weight_coral = 0.15
    weight_oil = 0.30
    weight_metal = 0.15
    weight_temp = 0.1

    # Calculate the weighted score
    score = (value_oil * weight_oil) + (value_species * weight_species) + (value_temperature * weight_temp) + (value_metal * weight_metal) + (value_coral * weight_coral)
    return score

# Method to find the score of all positions, and return the best position
def find_best_position(data, start, scores, other_rig):
    max_movement = 5
    max_score = -1000
    max_indices = start
    # Loop over the world data
    for i in range(100):
        for j in range(100):
            # Check if more than five away from start pos
            distance = abs(start[0] - i) + abs(start[1] - j)
            rig_distance = abs(other_rig[0] - i) + abs(other_rig[1] - j)
            if distance <= max_movement and rig_distance > 2:
                # Calculate the score for this position
                data_parse = data[(data['x'] == i) & (data['y'] == j)]
                score = calculate_score(data_parse, i, j)
                scores[i, j] = score
                # Check if new best position
                if score > max_score:
                    max_score = score
                    max_indices = (i,j)
    return max_indices

resources = np.ones((100, 100))

# Method to read all data files 
def read_files():
    # Resources Reduction
    global resources
    
    # Rig starting positions
    start_rig_1 = (0,0)
    start_rig_2 = (99,99)
    
    # List of data
    days = []
    
    # Loop over all input data
    for i in range(1, 31):
        # Read in all files
        grid = pd.read_csv(f"../data/world_array_data_day_{i}.csv", index_col=0)   
        oil_data = pd.read_csv(f"../data/oil_data_day_{i}.csv", index_col=0)
        metal_data =  pd.read_csv(f"../data/metal_data_day_{i}.csv", index_col=0)
        species_data = pd.read_csv(f"../data/species_data_day_{i}.csv", index_col=0)
        temperature_data = pd.read_csv(f"../data/temperature_data_day_{i}.csv", index_col=0)
        coral_data =  pd.read_csv(f"../data/coral_data_day_{i}.csv", index_col=0)
        
        # Merge all data together
        combined_data = pd.merge(grid, oil_data, how="inner", on=['x', 'y'], suffixes=('_world', '_oil'))
        combined_data = pd.merge(combined_data, species_data, how="inner", on=['x', 'y'])
        combined_data = pd.merge(combined_data, temperature_data, how="inner", on=['x', 'y'], suffixes=('_species', '_temperature'))
        combined_data = pd.merge(combined_data, metal_data, how="inner", on=['x', 'y'])
        combined_data = pd.merge(combined_data, coral_data, how="inner", on=['x', 'y'], suffixes=('_metal', '_coral'))

        # Calculate the best position for the current map
        scores = np.full((100, 100), -200.00, dtype=float)
        indices_rig_1 = find_best_position(combined_data, start_rig_1, scores, start_rig_2)
        indices_rig_2 = find_best_position(combined_data, start_rig_2, scores, indices_rig_1)
        
        # Create data for API
        scores_list = scores.astype(float).tolist()
        start_rig_1_tuple = tuple(map(int, start_rig_1))
        start_rig_2_tuple = tuple(map(int, start_rig_2))
        indices_rig_1_tuple = tuple(map(int, indices_rig_1))
        indices_rig_2_tuple = tuple(map(int, indices_rig_2))
        
        data = {}
        data['initialPosRig1'] = start_rig_1_tuple
        data['finalPosRig1'] = indices_rig_1_tuple
        data['initialPosRig2'] = start_rig_2_tuple
        data['finalPosRig2'] = indices_rig_2_tuple
        data['scores'] = scores_list
        days.append(data)
        
        # Assign data for next loop
        start_rig_1 = indices_rig_1
        start_rig_2 = indices_rig_2
        resources[start_rig_1[0], start_rig_1[1]] -= 0.05
        resources[start_rig_2[0], start_rig_2[1]] -= 0.05
    
    return days