# FROM python:3.9-slim

# WORKDIR /app

# COPY . /app

# RUN pip install --no-cache-dir --upgrade pip setuptools==61.0.0 setuptools_scm
# RUN pip install --no-cache-dir -r /app/requirement.txt

# EXPOSE 8000
# ENV PYTHONDONTWRITEBYTECODE=1

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]



FROM python:3.9-slim

WORKDIR /app
# System deps (ffmpeg only if you really need it)
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy first to leverage layer caching
COPY requirement.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt \
 -f https://download.pytorch.org/whl/cpu/torch_stable.html




# Copy code
COPY . /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]






