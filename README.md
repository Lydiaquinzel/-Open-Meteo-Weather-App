![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-6.0-green)
![DRF](https://img.shields.io/badge/Django_REST_Framework-API-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-optional-blue?logo=docker)
![Pandas](https://img.shields.io/badge/Pandas-Data_Analysis-purple?logo=pandas)
![pytest](https://img.shields.io/badge/Pytest-Testing-yellow?logo=pytest)
![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple?logo=bootstrap)

# 🌤️ Open-Meteo Weather App

Backend API for loading, storing and analyzing historical weather data using the Open-Meteo API.

---

## 📦 Project Overview

This full-stack application allows you to:

- Upload historical weather data using the [Open-Meteo API](https://open-meteo.com/en/docs).
- Save weather records in PostgreSQL.
- View temperature and precipitation statistics.
- Generate global weather statistics.
- Health check endpoints.
- Logging system for tracking data uploads.

## Project Architecture

```bash
backend/
├── config/          # Configuración Django (settings, urls, asgi, wsgi)
├── weather/         # App principal: models, views, serializers, urls
├── services/        # Lógica de negocio y conexión con Open-Meteo
├── logs/            # Archivos de logs
├── manage.py        # Entrada principal de Django
├── models.py        # Models
└── requirements.txt # Dependencias Python

frontend/
├── src/             # Componentes React y lógica frontend
├── public/          # Archivos estáticos
├── package.json     # Dependencias frontend
└── tsconfig.json    # Configuración TypeScript
```
## Set Up

## 🐍 Backend Setup

### 1. Create a virtual environment:

```bash
python -m venv env
```

Windows
```bash
env\Scripts\activate
```
Mac/Linux
```bash
source env/bin/activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Run database migrations:

```bash
cd backend
python manage.py migrate
```

Run the server:

```bash
python manage.py runserver
```

Run tests:

```bash
pytest -v
```

⚛️ Frontend Setup

Navigate to frontend folder:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Run development server:
```bash
npm start
```

🐳 Optional: Run Everything with Docker

Build and start containers:
```bash
docker-compose up -d --build
```
Access backend container:
```bash
docker exec -it open_meteo_backend bash
```
Run database migrations inside container:
```bash
python manage.py migrate
```
Run backend tests:
```bash
pytest -v
```

# 🐳 Run with Docker

## 1️⃣ Build and start containers

```bash
docker-compose up -d --build
```

## 2️⃣ Access backend container

```bash
docker exec -it open_meteo_backend bash
```

## 3️⃣ Run database migrations

```bash
python manage.py migrate
```

## 4️⃣ Run unit tests

```bash
pytest -v
```

🌍 Base URL

```bash
http://localhost:8000/api/
```

📡 API Endpoints

✅ Health Check

GET /api/health/

Example:

```bash
curl http://localhost:8000/api/health/
```
Response:

```json
{"status":"ok"}
```

✅ Load Weather Data

POST /api/load/

Body:
```json
{
  "city": "Madrid",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD"
}
```

Example:

```bash
curl -X POST http://localhost:8000/api/load/ \
  -H "Content-Type: application/json" \
  -d '{"city":"Madrid","start_date":"2024-07-01","end_date":"2024-07-03"}'
```
Response:

```json
{"status":"success","records_added":72}
```

🌡️ Temperature Statistics

GET /api/temperature/?city=Madrid&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD

Example:

```bash
curl "http://localhost:8000/api/temperature/?city=Madrid"
```

Response:

```json
{
  "temperature": {
    "average": 18.7,
    "average_by_day": {
      "2024-07-01": 18.5,
      "2024-07-02": 19.0
    },
    "max": {
      "value": 33.2,
      "date_time": "2024-07-02T15:00:00"
    },
    "min": {
      "value": 7.1,
      "date_time": "2024-07-01T06:00:00"
    }
  }
}
```

🌧️ Precipitation Statistics

GET /api/precipitation/?city=Madrid&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD

```bash
curl "http://localhost:8000/api/precipitation/?city=Madrid"
```

Response:

```json
{
  "precipitation": {
    "total": 5.8,
    "total_by_day": {
      "2024-07-01": 1.2,
      "2024-07-02": 2.5,
      "2024-07-03": 2.1
    },
    "days_with_precipitation": 3,
    "max": {
      "value": 1.5,
      "date": "2024-07-02"
    },
    "average": 1.93
  }
}
```

🌍 Global Statistics

GET /api/global-stats/

Optional filters:

?city=Madrid
?start_date=YYYY-MM-DD
?end_date=YYYY-MM-DD

Example:

```bash
curl http://localhost:8000/api/global-stats/
```

Response:

```json
{
  "Madrid": {
    "start_date": "2024-07-01",
    "end_date": "2024-07-03",
    "temperature_average": 18.7,
    "precipitation_total": 5.8,
    "days_with_precipitation": 3,
    "precipitation_max": {
      "date": "2024-07-02",
      "value": 1.5
    },
    "temperature_max": {
      "date": "2024-07-02",
      "value": 33.2
    },
    "temperature_min": {
      "date": "2024-07-01",
      "value": 7.1
    }
  }
}
```

📝 Logs

Logs are stored inside the container at:

/app/logs/

To inspect:

```bash
ls /app/logs
cat /app/logs/weatherDD-MM-YYYY.log
```

🖥️ Run Without Docker (Optional)

If running locally:

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Then access:

```bash
http://localhost:8000/api/
```
