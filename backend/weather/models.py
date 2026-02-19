from django.db import models

class WeatherRecord(models.Model):
    record_id = models.AutoField(primary_key=True)  # ID único
    city = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    datetime = models.DateTimeField()
    temperature = models.FloatField()
    precipitation = models.FloatField()

    class Meta:
        ordering = ['datetime']
        verbose_name = "Weather Record"
        verbose_name_plural = "Weather Records"

    def __str__(self):
        return f"{self.city} - {self.datetime} - Temp: {self.temperature}°C"
