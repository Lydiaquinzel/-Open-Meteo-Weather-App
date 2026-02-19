import pandas as pd
from weather.models import WeatherRecord

def calculate_temperature_stats(city, threshold_high=30, threshold_low=0):
    qs = WeatherRecord.objects.filter(city=city).values("datetime", "temperature")
    if not qs.exists():
        return None

    df = pd.DataFrame(list(qs))
    df["datetime"] = pd.to_datetime(df["datetime"])

    avg_temp = df["temperature"].mean()
    avg_by_day = df.groupby(df["datetime"].dt.date)["temperature"].mean().to_dict()
    max_row = df.loc[df["temperature"].idxmax()]
    min_row = df.loc[df["temperature"].idxmin()]

    hours_above = (df["temperature"] > threshold_high).sum()
    hours_below = (df["temperature"] < threshold_low).sum()

    return {
        "temperature": {
            "average": round(avg_temp, 1),
            "average_by_day": {str(k): round(v, 1) for k, v in avg_by_day.items()},
            "max": {"value": max_row["temperature"], "date_time": max_row["datetime"].isoformat()},
            "min": {"value": min_row["temperature"], "date_time": min_row["datetime"].isoformat()},
            "hours_above_threshold": int(hours_above),
            "hours_below_threshold": int(hours_below)
        }
    }

def calculate_precipitation_stats(city):
    qs = WeatherRecord.objects.filter(city=city).values("datetime", "precipitation")
    if not qs.exists():
        return None

    df = pd.DataFrame(list(qs))
    df["datetime"] = pd.to_datetime(df["datetime"])

    total = df["precipitation"].sum()
    total_by_day = df.groupby(df["datetime"].dt.date)["precipitation"].sum().to_dict()
    average = df["precipitation"].mean()
    days_with_precip = (df.groupby(df["datetime"].dt.date)["precipitation"].sum() > 0).sum()
    max_row = df.loc[df["precipitation"].idxmax()]

    return {
        "precipitation": {
            "total": round(total, 1),
            "total_by_day": {str(k): round(v, 1) for k, v in total_by_day.items()},
            "average": round(average, 2),
            "days_with_precipitation": int(days_with_precip),
            "max": {"value": max_row["precipitation"], "date": max_row["datetime"].date().isoformat()}
        }
    }
