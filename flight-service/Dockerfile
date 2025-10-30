FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# instalar dependencias del sistema necesarias para compilar ruedas (openssl, libffi, build-essential)
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

# copiar requirements e instalarlas
COPY requirements.txt .
# actualizar pip usando python -m pip, con reintentos y sin cache
RUN python -m pip install --upgrade pip setuptools wheel --no-cache-dir --retries 10 --timeout 120
RUN python -m pip install --no-cache-dir -r requirements.txt

# copiar el código
COPY ./app /app

EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]


