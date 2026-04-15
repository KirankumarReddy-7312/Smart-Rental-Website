import requests
HF_BASE_URL = "https://kirankumarreddy7312-rentora-ai.hf.space"
def get_rag_response(query):
    try:
        payload = {
            "data": [query]
        }

        
        endpoints = [
            f"{HF_BASE_URL}/predict",
            f"{HF_BASE_URL}/api/predict",
            f"{HF_BASE_URL}/run/predict"
        ]

        for url in endpoints:
            try:
                response = requests.post(
                    url,
                    json=payload,
                    timeout=15
                )

                if response.status_code == 200:
                    result = response.json()

                  
                    if "data" in result and len(result["data"]) > 0:
                        return result["data"][0]

                    return str(result)

            except Exception as e:
                print(f"Trying next endpoint... Error: {e}")

        return "⚠️ AI endpoint not found"

    except requests.exceptions.Timeout:
        return "⚠️ AI is waking up, try again in few seconds"

    except Exception as e:
        print("HF API Error:", str(e))
        return "⚠️ AI service failed"
