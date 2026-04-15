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

        # Debug print
        print("HF STATUS:", response.status_code)
        print("HF RESPONSE:", response.text)

        if response.status_code == 200:
            result = response.json()

            # SAFE handling
            if "data" in result and len(result["data"]) > 0:
                return result["data"][0]
            else:
                return "⚠️ Invalid response format from AI"

        else:
            return f"⚠️ HuggingFace Error: {response.status_code}"

    except requests.exceptions.Timeout:
        return "⚠️ AI is waking up, try again"

    except Exception as e:
        print("HF ERROR:", str(e))
        return "⚠️ AI service failed"
