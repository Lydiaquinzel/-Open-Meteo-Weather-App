from django.http import JsonResponse

def health_check(request):
    """
    Endpoint de salud de la API
    Retorna 200 OK si el servidor está activo.
    """
    return JsonResponse({"status": "ok"})
