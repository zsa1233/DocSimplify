from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract, fitz
from openai import OpenAI 
import os
import json
from dotenv import load_dotenv


load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


print("OpenAI API Key:", os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app) 

@app.route('/extract', methods=['POST'])
def extract_route():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    filename = file.filename.lower()
    temp_file_path = os.path.join("uploads", file.filename)
    
    try:
        os.makedirs("uploads", exist_ok=True)
        file.save(temp_file_path)

        if filename.endswith('pdf'):
            text = pdf_extract(temp_file_path)
        elif filename.endswith(('.jpg', '.jpeg', '.png')):
            text = image_extract(temp_file_path)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        extracted_data = extract_ai(text)
        return jsonify(extracted_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

def pdf_extract(pdf_path):
    doc = fitz.open(pdf_path)
    return "\n".join([page.get_text() for page in doc])

def image_extract(image_path):
    image = Image.open(image_path)
    return pytesseract.image_to_string(image)

def extract_ai(extracted_text):
    try:
        prompt = f"""
        Extract structured data from the following text and return ONLY valid JSON with keys like 
        "title", "author", "date", "revenue", "expenses", "profit" etc.
        Text:
        {extracted_text}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial data extraction assistant. Return ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }  # This ensures JSON output
        )

        gpt_response = response.choices[0].message.content
        return json.loads(gpt_response)
        
    except Exception as e:
        print(f"AI processing error: {str(e)}")
        return {"error": "AI processing failed", "details": str(e)}

if __name__ == '__main__':
    app.run(debug=True) 