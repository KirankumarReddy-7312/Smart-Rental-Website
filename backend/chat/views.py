from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from .rag_service import get_rag_response


@csrf_exempt
@require_http_methods(["POST"])
def chat_query(request):
    try:
        # ✅ Parse JSON safely
        data = json.loads(request.body)
        message = data.get('message', '').strip()

        if not message:
            return JsonResponse({
                "status": "error",
                "message": "Message is required"
            }, status=400)

        # ✅ Call AI service
        response = get_rag_response(message)

        # ✅ Ensure response is always string
        if not isinstance(response, str):
            response = str(response)

        return JsonResponse({
            "status": "success",
            "input": message,
            "response": response
        })

    except json.JSONDecodeError:
        return JsonResponse({
            "status": "error",
            "message": "Invalid JSON format"
        }, status=400)

    except Exception as e:
        print("❌ Chat API Error:", str(e))

        return JsonResponse({
            "status": "error",
            "message": "Something went wrong",
            "details": str(e)
        }, status=500)
