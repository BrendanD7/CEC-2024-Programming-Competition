import pandas as pd
import numpy as np

class DayData:
  def __init__(self, initialPos, finalPos, scores):
    self.initialPos = initialPos
    self.finalPos = finalPos
    self.scores = scores

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
# Method to determine eligibility of positions
def find_best_position(data, x, y):
    valid_range_x = range(max(0, x - 5), min(100, y + 5 + 1))
    valid_range_y = range(max(0, x - 5), min(100, y + 5 + 1))
    scores = np.full((100, 100), -200.00, dtype=float)
    for i in valid_range_x:
        for j in valid_range_y:
            data_parse = data[(data['x'] == i) & (data['y'] == j)]
            score = calculate_score(data_parse)
            scores[i,j] = score
    best_location = np.max(scores)
    max_indices = np.unravel_index(np.argmax(scores, axis=None), scores.shape)
    return best_location, max_indices
    
    
def read_files():
    grid = pd.read_csv("./data/world_array_data_day_1.csv", index_col=0)   
    oil_data = pd.read_csv("./data/oil_data_day_1.csv", index_col=0)
    species_data = pd.read_csv("./data/species_data_day_1.csv", index_col=0)
    temperature_data = pd.read_csv("./data/temperature_data_day_1.csv", index_col=0)
    
    combined_data = pd.merge(grid, oil_data, how="inner", on=['x', 'y'], suffixes=('_world', '_oil'))
    combined_data = pd.merge(combined_data, species_data, how="inner", on=['x', 'y'])
    combined_data = pd.merge(combined_data, temperature_data, how="inner", on=['x', 'y'], suffixes=('_species', '_temperature'))
    best, indices = find_best_position(combined_data, 0, 0)
       
read_files()
    