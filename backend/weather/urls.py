from django.urls import path
from .views.load import load_weather
from .views.temperature import get_temperature_stats
from .views.precipitation import get_precipitation_stats
from .views.global_stats import get_global_stats
from .views.health import health_check

urlpatterns = [
    path("load/", load_weather, name="load_weather"),
    path("temperature/", get_temperature_stats, name="temperature_stats"),
    path("precipitation/", get_precipitation_stats, name="precipitation_stats"),
    path("global-stats/", get_global_stats, name="global_stats"),
    path("health/", health_check, name="health_check"),
]
