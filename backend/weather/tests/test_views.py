import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from weather.models import WeatherRecord
from django.utils import timezone
import datetime

# ---------------------------
# Fixtures
# ---------------------------
@pytest.fixture
def api_client():
    """Cliente API de DRF para tests"""
    return APIClient()

@pytest.fixture
def sample_weather(db):
    """Crea un registro de clima de prueba en la base de datos"""
    record = WeatherRecord.objects.create(
        city="Madrid",
        latitude=40.4168,
        longitude=-3.7038,
        datetime=timezone.make_aware(datetime.datetime(2024, 7, 1, 12, 0)),
        temperature=28.5,
        precipitation=0.0
    )
    return record

# ---------------------------
# Tests
# ---------------------------
@pytest.mark.django_db
def test_health_check(api_client, caplog):
    url = reverse('health_check')
    with caplog.at_level("INFO"):
        response = api_client.get(url)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    # Puedes verificar que no haya errores de logging
    assert "ERROR" not in caplog.text

@pytest.mark.django_db
def test_load_weather_post(api_client, caplog):
    url = reverse('load_weather')
    data = {
        "city": "Madrid",
        "start_date": "2024-07-01",
        "end_date": "2024-07-01"
    }
    with caplog.at_level("INFO"):
        response = api_client.post(url, data, format='json')

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    # Verifica que los logs estén en inglés
    assert "Searching coordinates for city" in caplog.text
    assert "Storing weather data for Madrid" in caplog.text

@pytest.mark.django_db
def test_temperature_stats(api_client, sample_weather, caplog):
    url = reverse('temperature_stats')
    with caplog.at_level("INFO"):
        response = api_client.get(f"{url}?city=Madrid")
    assert response.status_code == 200
    json_data = response.json()
    assert "temperature" in json_data
    assert json_data["temperature"]["max"]["value"] == 28.5

@pytest.mark.django_db
def test_precipitation_stats(api_client, sample_weather, caplog):
    url = reverse('precipitation_stats')
    with caplog.at_level("INFO"):
        response = api_client.get(f"{url}?city=Madrid")
    assert response.status_code == 200
    json_data = response.json()
    assert "precipitation" in json_data
    assert json_data["precipitation"]["total"] == 0.0

@pytest.mark.django_db
def test_global_stats(api_client, sample_weather, caplog):
    url = reverse('global_stats')
    with caplog.at_level("INFO"):
        response = api_client.get(url)
    assert response.status_code == 200
    json_data = response.json()
    assert "Madrid" in json_data