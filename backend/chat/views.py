from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["POST"])
def chat_query(request):
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # 🔥 TEMP RESPONSE (NO AI CALL)
        return JsonResponse({
            "status": "success",
            "input": message,
            "response": f"Searching for: {message}"
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
