Directorul test_data/ contine arhive/pachete Sentinel-2. Aceste pachete vor fi selectate pentru procesare.
Directorul output/ contine rezultate obtinute in urma inferentei, 2 fisiere geotif per pachet procesat. Dupa procesare, fisierele geotif vor fi randate in platforma.

# Build docker image
```nohup docker build -t ai-ch-processor . > build.log 2>&1 &```

# Run interactive 
```docker run -p 5555:5555 --rm -it --gpus all ai-ch-processor bash```

# Run container
```docker run -p 5555:5555 --rm --gpus all -v $(pwd)/test_data:/app/test_data -v $(pwd)/model:/app/model -v $(pwd)/output:/app/output ai-ch-processor```
```docker run -p 5555:5555 --rm --gpus all -v .\test_data:/app/test_data -v .\model:/app/model -v .\output:/app/output ai-ch-processor```


Exemplu apel din Postman:
http://IP:5555/predict/   
Body - raw:
```JSON
{
  "image_filenames": [
    "S2A_MSIL2A_20200606T085601_N0214_R007_T35TPK_20200606T115035.SAFE.zip",
    "S2B_MSIL2A_20200711T085559_N0214_R007_T35TPK_20200711T120635.SAFE.zip",
    "S2B_MSIL2A_20240619T092549_N0510_R136_T34TER_20240619T110657.SAFE.zip"
  ]
}
```