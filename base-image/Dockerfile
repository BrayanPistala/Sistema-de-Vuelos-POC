FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt


# instalar dependencias del sistema necesarias 
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      gcc \
      ca-certificates \
      libssl-dev \
      libffi-dev \
      python3-dev \
      curl \
      git \
      && rm -rf /var/lib/apt/lists/*
