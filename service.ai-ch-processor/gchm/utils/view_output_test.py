import matplotlib.pyplot as plt
import numpy as np


plt.figure(figsize=(7, 6))
plt.pcolormesh(np.random.random((100, 100)))
plt.colorbar()