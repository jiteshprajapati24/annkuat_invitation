from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from io import BytesIO
import base64
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader

app = Flask(__name__)
CORS(app)

@app.post('/api/generate')
def generate():
    data = request.get_json(force=True, silent=True) or {}
    name = str(data.get('name', '')).strip()
    background_data_url = data.get('backgroundImage')  # optional data URL string
    if not name:
        return jsonify({'error': 'Name is required'}), 400

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    page_width, page_height = A4

    # Draw background if provided (data URL: data:image/...;base64,<payload>)
    if isinstance(background_data_url, str) and background_data_url.startswith('data:') and 'base64,' in background_data_url:
        try:
            b64_part = background_data_url.split('base64,', 1)[1]
            img_bytes = base64.b64decode(b64_part)
            img_reader = ImageReader(BytesIO(img_bytes))
            c.drawImage(img_reader, 0, 0, width=page_width, height=page_height, preserveAspectRatio=False, mask='auto')
        except Exception:
            # If decoding fails, continue without background
            pass

    # Draw name text (you may tune font, color, and position)
    c.setFillColorRGB(0.70, 0, 0)
    c.setFont('Helvetica-Bold', 18)
    # Example position roughly similar to client-side; adjust as needed
    c.drawString(200, page_height - 325, name)

    c.showPage()
    c.save()
    buffer.seek(0)

    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"{name or 'Generated'}.pdf",
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)


