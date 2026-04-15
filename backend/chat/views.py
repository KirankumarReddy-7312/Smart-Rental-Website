from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from .rag_service import get_rag_response


@csrf_exempt
@require_http_methods(["POST"])
def chat_query(request):
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        try:
            response = get_rag_response(message)
        except Exception as ai_error:
            print("AI ERROR:", str(ai_error))
            response = "⚠️ AI failed but server is working"

        return JsonResponse({
            "status": "success",
            "input": message,
            "response": response
        })

    except Exception as e:
        print("FULL ERROR:", str(e))
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
