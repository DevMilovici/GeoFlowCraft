FROM continuumio/miniconda3

# Creează mediu Conda identic cu cel local
COPY env.yml /
RUN conda env create -f /env.yml

# Activează mediu la rulare
#SHELL ["conda", "run", "-n", "gchm", "/bin/bash", "-c"]
SHELL ["/bin/bash", "-c"]

# Setează directorul aplicației
WORKDIR /app
COPY . /app

# Portul expus
EXPOSE 5555

#CMD ["conda", "run", "-n", "gchm", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5555", "--log-level", "debug"]
CMD ["bash", "-c", "source activate gchm && uvicorn main:app --host 0.0.0.0 --port 5555 --log-level debug"]
