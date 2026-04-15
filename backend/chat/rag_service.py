import requests

HF_API_URL = "https://kirankumarreddy7312-rentora-ai.hf.space/run/predict"

def get_rag_response(query):
    try:
        payload = {
            "data": [query],
            "fn_index": 0   # 🔥 VERY IMPORTANT
        }

        response = requests.post(
            HF_API_URL,
            json=payload,
            timeout=20
        )

        if response.status_code == 200:
            result = response.json()

            # 🔥 SAFE PARSING
            if "data" in result and len(result["data"]) > 0:
                return result["data"][0]
            else:
                return "⚠️ Invalid AI response format"

        return f"⚠️ HuggingFace Error: {response.status_code}"

    except requests.exceptions.Timeout:
        return "⚠️ AI is waking up, try again"

    except Exception as e:
        print("HF ERROR:", str(e))
        return "⚠️ AI service failed"
