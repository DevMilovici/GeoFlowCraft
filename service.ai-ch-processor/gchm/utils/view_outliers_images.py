#plot hist for prediction and std
from osgeo import gdal
import matplotlib.pyplot as plt
import os
from matplotlib import cm
import numpy as np


def reject_outliers(data, m = 2.):
    d = np.abs(data - np.median(data))
    mdev = np.median(d)
    s = d/mdev if mdev else np.zeros(len(d))
    return data[s<m]

def reject_outliers1(data, m=2):
    return data[abs(data - np.mean(data)) < m * np.std(data)]

filenamepath = '/data/mcoca/global-canopy-height-model/deploy_example/predictions/serie_delta/S2A_35TPK_20190811_0_L2A_predictions.tif'

ds = gdal.OpenEx(filenamepath)

band = ds.GetRasterBand(1)
data = band.ReadAsArray()
data[np.isnan(data)] = 0
print(np.min(data),np.max(data))

print(np.mean(data), np.std(data))

filenamepath1 = '/data/mcoca/global-canopy-height-model/deploy_example/predictions/serie_delta/S2A_35TPK_20190811_0_L2A_std.tif'
ds1 = gdal.OpenEx(filenamepath1)

band1 = ds1.GetRasterBand(1)
data1 = band1.ReadAsArray()

data1[np.isnan(data1)] = 0
u = np.mean(data1)
s = np.std(data1)

f1 = u - 2*s
f2 = u + 2*s

median = np.median(data1)
print(f1,f2,median)

for i in range(len(data1)):
    for j in range(len(data1)):
        if (f1 > data1[i,j]) or (data1[i,j] > f2):
            data1[i,j] = median
            

print(np.min(data1),np.max(data1))

print(np.mean(data1), np.std(data1))
print(len(data1.flatten()))
print(len(reject_outliers1(data1.flatten(), m=2)))
