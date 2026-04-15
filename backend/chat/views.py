from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# SAFE IMPORT (prevents crash)
try:
    from rag_service import get_rag_response
except Exception as e:
    print("❌ AI import failed:", str(e))
    get_rag_response = None


@csrf_exempt
@require_http_methods(["POST"])
def chat_query(request):
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # ✅ SAFE AI CALL
        if get_rag_response:
            try:
                response = get_rag_response(message)
            except Exception as e:
                print("❌ AI runtime error:", str(e))
                response = "⚠️ AI temporarily unavailable"
        else:
            response = "⚠️ AI service not loaded"

        return JsonResponse({
            'status': 'success',
            'input': message,
            'response': response
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    except Exception as e:
        print("❌ Chat API Error:", str(e))
        return JsonResponse({
            'error': 'Server error',
            'details': str(e)
        }, status=500)
