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

## 🗺️ Project Architecture

```bash
backend/
├── config/          # Django configuration
├── weather/         # Main app: models, views, serializers, urls
├── services/        # Business logic and connection to Open-Meteo
├── logs/            # Log files
├── manage.py        # Main Django entry point
├── models.py        # Models
└── requirements.txt # Python dependencies
frontend/
├── src/             # React components and frontend logic
├── public/          # Static files
├── package.json     # Frontend dependencies
└── tsconfig.json    # TypeScript configuration
```

## Installation & Deployment Guide

### 1) Clone the Repository

```bash
git clone https://github.com/Lydiaquinzel/Open-Meteo-Weather-App.git
cd Open-Meteo-Weather-App
```
From this point, you can choose one of the following backend deployment options.

### 2) Backend Deployment (Docker)

📄 Requirements
- Docker
- Docker Compose

STEPS:

### 1️⃣ Build and start containers

From the project root directory:
```bash
docker-compose up -d --build
```

To stop containers:
```bash
docker-compose down
```

To fully reset containers and volumes:
```bash
docker-compose down -v
docker-compose up -d --build
```

### 2️⃣ Access backend container

```bash
docker exec -it open_meteo_backend bash
```

### 3️⃣ Run database migrations (container)

```bash
python manage.py migrate
```

### 4️⃣ Run unit tests (container)

```bash
pytest -v
```

🌍 Base URL

The backend will be available at:
```http
http://localhost:8000/
```

### 3) Frontend Deployment (optional)

⚠️ The backend must be running before starting the frontend. Otherwise, the application will not work.

📄 Requirements
- Python 3.10+
- pip
- 

STEPS:

### 1️⃣ Navigate to frontend folder:
```bash
cd frontend
```

### 2️⃣ Install dependencies:
```bash
npm install
```

### 3️⃣ Run development server:
```bash
npm start
```

## 📝 Logs

The logs are stored in the project folder:
```
backend/logs/
```

Ver los logs desde tu máquina local:
```bash
# List the log files:
ls backend/logs
# View a specific log:
cat backend/logs/weatherDD-MM-YYYY.log
```

Ver los logs desde dentro del contenedor Docker:
```bash
# List the log files:
docker exec -it open_meteo_backend ls /app/logs
# View a specific log:
docker exec -it open_meteo_backend cat /app/logs/weatherDD-MM-YYYY.log
```

## 🧪 Database Tests

Quick test of the `WeatherRecord` model:

1. Open the Django shell:
```bash
python manage.py shell
```

2. Run the following to create and query test records:
```python
from weather.models import WeatherRecord

# Create a test record:
WeatherRecord.objects.create(
    city="Madrid",
    latitude=40.4168,
    longitude=-3.7038,
    datetime="2024-07-01T12:00",
    temperature=28.5,
    precipitation=0.0
)

# Query all records:
WeatherRecord.objects.all()
```

## 📡 API Endpoints

The backend exposes the following REST endpoints.

| Entorno | URL de la API |
|---------|---------------|
| Local   | http://127.0.0.1:8000/api/ |
| Docker  | http://localhost:8000/api/ |

The API works identically in both deployment modes.

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

🟢 Load Weather Data

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

Example:
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

> **How to test the API:**
>
> The API can be tested in any of the following ways:
> 
> - Using cURL (terminal)  
> - Using Postman  
> - Using the frontend interface  
>
> **Note:** The backend must be running (either locally or via Docker). The endpoints and responses are identical in both deployment modes.
