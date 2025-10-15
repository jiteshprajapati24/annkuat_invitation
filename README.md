## Backend/Frontend separation

This project can run with a Python backend for server-side PDF generation and a React frontend for UI.

### Backend (Python + Flask)

1. Create a new folder next to this project, e.g. `backend`.
2. Inside `backend`, create `app.py`:

```python
from flask import Flask, request, send_file, jsonify
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

app = Flask(__name__)

@app.post('/api/generate')
def generate():
    data = request.get_json(force=True)
    name = (data or {}).get('name', '').strip()
    if not name:
        return jsonify({ 'error': 'Name is required' }), 400

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    c.setFillColorRGB(0.7, 0, 0)
    c.setFont('Helvetica-Bold', 16)
    c.drawString(100, height - 200, name)
    c.showPage()
    c.save()
    buffer.seek(0)

    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name=f"{name or 'Generated'}.pdf")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
```

3. Create `requirements.txt`:

```
Flask==3.0.0
reportlab==4.2.0
```

4. Install and run:

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

### Frontend (React)

Update the button handler to call the backend first and fall back to client-side if the request fails.

```js
async function generateViaBackend(name) {
  const res = await fetch('http://localhost:5001/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('backend failed');
  return await res.blob();
}
```

In `generatePDF`, try backend first:

```js
try {
  const blob = await generateViaBackend(name);
  saveAs(blob, `${name || 'Generated'}.pdf`);
} catch (_) {
  // fall back to existing client-side pdfMake flow
}
```

Configure CORS if serving frontend separately. In Flask:

```python
pip install flask-cors
from flask_cors import CORS
CORS(app)
```

<<<<<<< HEAD
# અન્નકૂટોત્સવ Invitation
#
=======
# અન્નકૂટોત્સવ 
>>>>>>> 4858793c01592805148278c656a4a327ed2eba5d
# Getting Started with Create React App
#
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
