FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

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


# copiar requirements 
COPY requirements.txt .

RUN python -m pip install --upgrade pip setuptools wheel --no-cache-dir --retries 10 --timeout 120
RUN python -m pip install --no-cache-dir -r requirements.txt


COPY ./app /app

EXPOSE 8004
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8004"]


