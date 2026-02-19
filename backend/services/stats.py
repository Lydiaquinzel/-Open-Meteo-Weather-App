import pandas as pd
import logging

logger = logging.getLogger(__name__)

# ----------------------------
# Funciones de estadísticas
# ----------------------------

def temperature_stats(df, start_date=None, end_date=None):
    """Devuelve estadísticas de temperatura para un dataframe con columnas ['datetime','temperature']"""
    if df.empty:
        return {}

    df['datetime'] = pd.to_datetime(df['datetime'])

    # Filtrar por fechas si se pasan
    if start_date:
        df = df[df['datetime'].dt.date >= pd.to_datetime(start_date).date()]
    if end_date:
        df = df[df['datetime'].dt.date <= pd.to_datetime(end_date).date()]

    if df.empty:
        return {}

    df['date'] = df['datetime'].dt.date

    avg_temp = round(df['temperature'].mean(), 2)
    max_row = df.loc[df['temperature'].idxmax()]
    min_row = df.loc[df['temperature'].idxmin()]

    result = {
        "average": avg_temp,
        "average_by_day": {str(k): round(v,2) for k,v in df.groupby('date')['temperature'].mean().to_dict().items()},
        "max": {"value": round(max_row['temperature'],2), "date_time": max_row['datetime'].isoformat()},
        "min": {"value": round(min_row['temperature'],2), "date_time": min_row['datetime'].isoformat()},
    }
    logger.info("Calculated temperature stats")
    return result


def precipitation_stats(df, start_date=None, end_date=None):
    """Devuelve estadísticas de precipitación para un dataframe con columnas ['datetime','precipitation']"""
    if df.empty:
        return {}

    df['datetime'] = pd.to_datetime(df['datetime'])

    # Filtrar por fechas si se pasan
    if start_date:
        df = df[df['datetime'].dt.date >= pd.to_datetime(start_date).date()]
    if end_date:
        df = df[df['datetime'].dt.date <= pd.to_datetime(end_date).date()]

    if df.empty:
        return {}

    df['date'] = df['datetime'].dt.date

    total_prec = round(df['precipitation'].sum(), 2)
    days_with_prec = int((df.groupby('date')['precipitation'].sum() > 0).sum())
    max_row = df.loc[df['precipitation'].idxmax()]

    result = {
        "total": total_prec,
        "total_by_day": {str(k): round(v,2) for k,v in df.groupby('date')['precipitation'].sum().to_dict().items()},
        "days_with_precipitation": days_with_prec,
        "max": {"value": round(max_row['precipitation'],2), "date": str(max_row['date'])},
        "average": round(df['precipitation'].mean(),2)
    }
    logger.info("Calculated precipitation stats")
    return result


def global_stats(df):
    """Devuelve estadísticas globales para todas las ciudades"""
    if df.empty:
        return {}

    df['datetime'] = pd.to_datetime(df['datetime'])
    stats = {}

    for city, group in df.groupby('city'):
        start_date = str(group['datetime'].min().date())
        end_date = str(group['datetime'].max().date())

        # Temperatura
        temp = group[['datetime','temperature']].copy()
        avg_temp = round(temp['temperature'].mean(),2)
        max_row = temp.loc[temp['temperature'].idxmax()]
        min_row = temp.loc[temp['temperature'].idxmin()]
        temp_max = {"value": round(max_row['temperature'],2), "date": str(max_row['datetime'].date())}
        temp_min = {"value": round(min_row['temperature'],2), "date": str(min_row['datetime'].date())}

        # Precipitación
        prec = group[['datetime','precipitation']].copy()
        total_prec = round(prec['precipitation'].sum(),2)
        days_with_prec = int((prec.groupby(prec['datetime'].dt.date)['precipitation'].sum() > 0).sum())
        max_prec_row = prec.loc[prec['precipitation'].idxmax()]
        prec_max = {"value": round(max_prec_row['precipitation'],2), "date": str(max_prec_row['datetime'].date())}

        # Ubicación
        latitude = group['latitude'].iloc[0] if 'latitude' in group.columns else None
        longitude = group['longitude'].iloc[0] if 'longitude' in group.columns else None

        stats[city] = {
            "start_date": start_date,
            "end_date": end_date,
            "temperature_average": avg_temp,
            "temperature_max": temp_max,
            "temperature_min": temp_min,
            "precipitation_total": total_prec,
            "days_with_precipitation": days_with_prec,
            "precipitation_max": prec_max,
            "location": {"latitude": latitude, "longitude": longitude}
        }

    logger.info("Calculated global stats for all cities")
    return stats
