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
            timeout=20
        )

        if response.status_code == 200:
            result = response.json()
            return result["data"][0]

        return f"⚠️ HuggingFace Error: {response.status_code}"

    except requests.exceptions.Timeout:
        return "⚠️ AI is waking up, try again in few seconds"

    except Exception as e:
        print("HF API Error:", str(e))
        return "⚠️ AI service failed"
