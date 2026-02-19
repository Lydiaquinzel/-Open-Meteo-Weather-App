from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
import json
from ..models import WeatherRecord
from datetime import datetime  
from services.open_meteo import OpenMeteoService
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def load_weather(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        city = data.get("city")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # Validar fechas
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
        if start_dt > end_dt:
            return JsonResponse({"error": "start_date must be before end_date"}, status=400)

        logger.info(f"Load request for city={city}, start={start_date}, end={end_date}")

        # Obtener coordenadas y datos de OpenMeteoService
        coords = OpenMeteoService.get_city_coordinates(city)
        weather_data = OpenMeteoService.fetch_weather_data(
            coords['latitude'],
            coords['longitude'],
            start_date,
            end_date
        )

        records_added = OpenMeteoService.store_weather_data(
            city_name=city,
            latitude=coords['latitude'],
            longitude=coords['longitude'],
            weather_json=weather_data
        )

        return JsonResponse({"status": "success", "records_added": records_added})

    except Exception as e:
        logger.error(f"Error loading weather for {city}: {e}")
        return JsonResponse({"error": str(e)}, status=500)
