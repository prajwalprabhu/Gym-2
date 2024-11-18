from typing import List

import numpy as np
from sklearn.linear_model import LinearRegression

# Your array of numbers
data = np.array([1, 3, 5, 7, 9])


def predictNextValue(data: np.ndarray | List[int | float]) -> float:
    # Create indices for the data
    X = np.arange(len(data)).reshape(-1, 1)
    y = data

    # Create and train the model
    model = LinearRegression()
    model.fit(X, y)

    # Predict the next value
    next_index = np.array([[len(data)]])
    next_value = model.predict(next_index)
    return round(next_value[0], 2)
