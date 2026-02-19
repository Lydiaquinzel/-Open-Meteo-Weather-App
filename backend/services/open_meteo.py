from datetime import datetime
from django.utils import timezone
from weather.models import WeatherRecord
import requests
import logging
import os

# Logs 
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

# Nombre del archivo Log con fecha actual
today_str = timezone.now().strftime("%d-%m-%Y")
log_file = os.path.join(LOG_DIR, f"weather{today_str}.log")

# Logger 
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # INFO, WARNING, ERROR

# Handler al archivo
handler = logging.FileHandler(log_file, encoding='utf-8')
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

class OpenMeteoService:
    @staticmethod
    def get_city_coordinates(city_name: str):
        logger.info(f"Searching coordinates for city: {city_name}")
        params = {
            "name": city_name,
            "count": 1,
            "language": "en",
            "format": "json"
        }

        response = requests.get(GEOCODING_URL, params=params)
        response.raise_for_status()
        data = response.json()

        if "results" not in data or len(data["results"]) == 0:
            logger.error(f"City not found: {city_name}")
            raise ValueError(f"City not found: {city_name}")

        city_data = data["results"][0]
        logger.info(f"Coordinates found: {city_data}")
        return {
            "name": city_data["name"],
            "latitude": city_data["latitude"],
            "longitude": city_data["longitude"],
            "country": city_data.get("country")
        }

    @staticmethod
    def fetch_weather_data(latitude, longitude, start_date, end_date):
        logger.info(f"Fetching weather data for lat={latitude}, lon={longitude}, from {start_date} to {end_date}")
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "hourly": "temperature_2m,precipitation",
            "timezone": "UTC"
        }

        response = requests.get(ARCHIVE_URL, params=params)
        response.raise_for_status()
        logger.info(f"Weather data received: {len(response.json().get('hourly', {}).get('time', []))} records")
        return response.json()

    @staticmethod
    def store_weather_data(city_name, latitude, longitude, weather_json):
        logger.info(f"Storing weather data for {city_name}")
        hourly = weather_json.get("hourly", {})
        times = hourly.get("time", [])
        temperatures = hourly.get("temperature_2m", [])
        precipitations = hourly.get("precipitation", [])

        records = []
        for i, time_str in enumerate(times):
            dt_naive = datetime.fromisoformat(time_str)
            dt_aware = timezone.make_aware(dt_naive)

            record = WeatherRecord(
                city=city_name,
                latitude=latitude,
                longitude=longitude,
                datetime=dt_aware,
                temperature=temperatures[i],
                precipitation=precipitations[i]
            )
            records.append(record)

        WeatherRecord.objects.bulk_create(records)
        logger.info(f"{len(records)} records inserted into DB for {city_name}")
        return len(records)
