from django.http import JsonResponse
import pandas as pd
from ..models import WeatherRecord
from services.stats import precipitation_stats

def get_precipitation_stats(request):
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

    df = pd.DataFrame(list(qs.values("datetime", "precipitation")))

    if df.empty:
        return JsonResponse({"error": "No data found"}, status=404)

    result = precipitation_stats(df, start_date, end_date)

    return JsonResponse({"precipitation": result})
