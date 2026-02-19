from django.http import JsonResponse
import pandas as pd
from ..models import WeatherRecord
from services.stats import global_stats


def get_global_stats(request):
    city = request.GET.get("city")
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    qs = WeatherRecord.objects.all()

    if city:
        qs = qs.filter(city=city)
    if start_date:
        qs = qs.filter(datetime__date__gte=start_date)
    if end_date:
        qs = qs.filter(datetime__date__lte=end_date)

    df = pd.DataFrame(
        list(
            qs.values(
                "city",
                "datetime",
                "temperature",
                "precipitation",
                "latitude",
                "longitude",
            )
        )
    )

    if df.empty:
        return JsonResponse({"error": "No data found"}, status=404)

    raw_result = global_stats(df)

    # 🔥 RECONSTRUIR FORMATO EXACTO
    formatted_result = {}

    for city_name, data in raw_result.items():
        formatted_result[city_name] = {
            "start_date": data["start_date"],
            "end_date": data["end_date"],
            "temperature_average": data["temperature_average"],
            "precipitation_total": data["precipitation_total"],
            "days_with_precipitation": data["days_with_precipitation"],
            "precipitation_max": {
                "date": data["precipitation_max"]["date"],
                "value": data["precipitation_max"]["value"],
            },
            "temperature_max": {
                "date": data["temperature_max"]["date"],
                "value": data["temperature_max"]["value"],
            },
            "temperature_min": {
                "date": data["temperature_min"]["date"],
                "value": data["temperature_min"]["value"],
            },
        }

    return JsonResponse(formatted_result)
