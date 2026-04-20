import requests

HF_API_URL = "https://kirankumarreddy7312-rentora-ai.hf.space/run/predict"

def get_rag_response(query):
    try:
        payload = {
            "data": [query]
        }

        response = requests.post(
            HF_API_URL,
            json=payload,
            timeout=10   # ⏱️ prevent hanging
        )

        if response.status_code == 200:
            result = response.json()
            return result.get("data", ["No result"])[0]

        else:
            return f"AI not available (status {response.status_code})"

    except requests.exceptions.Timeout:
        return "AI is slow, try again"

    except Exception as e:
        return "AI temporarily unavailable"
