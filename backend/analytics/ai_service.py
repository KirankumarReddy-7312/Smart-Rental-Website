import requests
import json
import logging

# Set up logging
logger = logging.getLogger(__name__)

HF_API_URL = "https://kirankumarreddy7312-rentora-ai.hf.space/api/predict" # Common Gradio/HF API structure

def call_huggingface_ai(query):
    """
    Sends a query to the Hugging Face AI Space for processing.
    Uses Gradio API format (common for HF Spaces).
    """
    if not query or len(query.strip()) < 3:
        return {"error": "Query too short. Please provide at least 3 characters."}

    try:
        # Standard Gradio format for HF Spaces
        payload = {
            "data": [query]
        }
        
        response = requests.post(
            HF_API_URL, 
            json=payload, 
            timeout=15 # Longer timeout for AI processing
        )
        
        if response.status_code == 200:
            result = response.json()
            # Extracting data from Gradio response format
            if "data" in result and len(result["data"]) > 0:
                return {"success": True, "response": result["data"][0]}
            return {"success": True, "response": result}
        
        logger.error(f"HF API Error: {response.status_code} - {response.text}")
        return {"error": "AI service temporarily unavailable (HF Error)"}

    except requests.exceptions.Timeout:
        logger.error("HF API Timeout")
        return {"error": "AI service temporarily unavailable (Request timed out)"}
    except Exception as e:
        logger.error(f"HF Service Exception: {str(e)}")
        return {"error": f"AI service temporarily unavailable"}
