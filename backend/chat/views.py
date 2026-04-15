from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# ✅ CORRECT IMPORT (VERY IMPORTANT)
from .rag_service import get_rag_response


@csrf_exempt
@require_http_methods(["POST"])
def chat_query(request):
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        response = get_rag_response(message)

        return JsonResponse({
            "status": "success",
            "input": message,
            "response": response
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    except Exception as e:
        print("Chat API Error:", str(e))
        return JsonResponse({'error': 'Server error'}, status=500)
