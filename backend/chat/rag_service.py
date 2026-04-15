import requests

HF_API_URL = "https://kirankumarreddy7312-rentora-ai.hf.space/run/predict"

def get_rag_response(query):
    try:
        payload = {
            "data": [query]
        }

        response = requests.post(HF_API_URL, json=payload)

        if response.status_code == 200:
            result = response.json()
            return result["data"][0]
        else:
            return "⚠️ Hugging Face API error"

    except Exception as e:
        print("HF API Error:", str(e))
        return "⚠️ AI service failed"
