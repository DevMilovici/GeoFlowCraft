from osgeo import gdal
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import matplotlib
import os
from matplotlib import cm
import numpy as np
import time
import math

directorypath = '/data/mcoca/global-canopy-height-model/deploy_example/predictions/serie_delta_model_0/'
max_new_data =  50 #consideram maxim 60 metrii inaltime vegetatie pe zona deltei 

start = time.time()

print("\n==========START============\n")

#for filename in os.listdir(directorypath):
#	filenamepath = os.path.join(directorypath, filename)
filename = 'S2A_MSIL2A_20230721T085601_N0509_R007_T35TPK_20230721T132702.SAFE_predictions.tif'
filenamepath = '/data/mcoca/global-canopy-height-model/deploy_example/predictions/2023/S2A_MSIL2A_20230721T085601_N0509_R007_T35TPK_20230721T132702.SAFE_predictions.tif'

split_tup = os.path.splitext(filenamepath)
file_ext = split_tup[1]
# if file_ext == '.png':
# 	continue

filename_no_extension = split_tup[0]

std_or_predicitons = filename_no_extension.split('_')[-1]

# if std_or_predicitons == 'std':
# 	continue

# start = time.time()

ds = gdal.OpenEx(filenamepath)
band = ds.GetRasterBand(1)
data = band.ReadAsArray()

if std_or_predicitons == 'std':
	###################################################
	#use in cases where there are outliers
	data[np.isnan(data)] = 0
	u = np.mean(data)
	s = np.std(data)

	factor_std = 5

	f1 = u - factor_std*s
	f2 = u + factor_std*s

	median = np.median(data)
	print(f1,f2,median)

	data[data < f1] = median
	data[data > f2] = median

	# for i in range(len(data)):
	#     for j in range(len(data)):
	#         if (f1 > data[i,j]) or (data[i,j] > f2):
	#             data[i,j] = median

	####################################################
	#end for

data[np.isnan(data)] = 0
max_data = np.max(data)
print("\n(Image, Min, Max)=({}, {}, {})\n".format(filename, np.min(data),max_data))

#data *= (255.0/maxim)

#trebuie sa fac flip pe randuri pentru a obtine orientarea initiala
data = data[::-1]

#14.04.2024 - voi rotunji valoarea maxima la urmatorul intreg multiplu de 10, pentru 45.74 ma voi duce la 50
#Atfel voi afisa harta inaltimilor pe intervale 0,10;10-20;...;40-50; asta pentru toate comparatiile dintr-o serie temporala
#Pentru a obtine cmap-ul dorit trebuie sa setez un pixel cu noul maxim, e.g., 50, voi alege pixelul de pe pozitia [0,0]

#max_new_data =  math.ceil(max_data/10.0)*10
#print("\n(Image, New Max)=({}, {})\n".format(filename, max_new_data))
data[0][0] = max_new_data


plt.figure(figsize=(14, 10))
#parametrul cmap ne ajuta sa fac un colorbar pe intervale
im = plt.pcolormesh(data, cmap = cm.get_cmap(None, 6))
#im = plt.pcolormesh(data)#, cmap = cm.get_cmap(None, 5))
cbar = plt.colorbar()


im.figure.axes[0].tick_params(axis="both", labelsize=25) 
im.figure.axes[1].tick_params(axis="y", labelsize=25)

if std_or_predicitons == 'std':
	plt.savefig(os.path.join(directorypath,filename_no_extension+'_factor_'+str(factor_std)+'.png'), bbox_inches='tight')
else:
	plt.savefig(os.path.join(directorypath,filename_no_extension+'_peIntervale_Max_60_maxImg_'+ str(round(max_data, 2)) +'_.png'), bbox_inches='tight')

# end = time.time()
# print("\n Time to generate view image (png):", time.strftime('%H:%M:%S', time.gmtime(end - start)))


end = time.time()
print("TIME TO GENERATE VIEW DATA ON SERIES:", time.strftime('%H:%M:%S', time.gmtime(end - start)))