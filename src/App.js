
import React, { useState } from "react";
import { backgroundImage } from "./background"; // Import the image from background.js
import "./App.css";
import { saveAs } from "file-saver";

function App() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const renderTextToImage = (text, canvasWidth = 300, canvasHeight = 50, isSemiBold = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    let fontSize = 20; 
    const fontWeight = isSemiBold ? "600" : "bold";
    ctx.font = `${fontWeight} ${fontSize}px 'S0763892'`;
    ctx.fillStyle = "#b40000";
 
    while (ctx.measureText(text).width > canvasWidth - 20 && fontSize > 14) {
      fontSize--;
      ctx.font = `${fontWeight} ${fontSize}px 'S0763892'`;
    }

    const words = text.split(" ");
    let currentLine = "";
    const lines = [];
    words.forEach((word) => {
      const testLine = currentLine + word + " ";
      if (ctx.measureText(testLine).width > canvasWidth - 20) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine.trim());

    const lineHeight = fontSize + 10;
    let y = 40;
    lines.forEach((line) => {
      ctx.fillText(line, 10, y);
      y += lineHeight;
    });

    return canvas.toDataURL();
  };

  const calculatePositions = (nameLength) => {
    if (nameLength > 33) {
      return { x: 293, y: 495 };
    }
    return { x: 293, y: 495 };
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const generateImage = async () => {
    if (!name) {
      setErrorMessage("Name is required.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);

    try {
      const bg = await loadImage(backgroundImage);
      const canvas = document.createElement("canvas");
      canvas.width = bg.width;
      canvas.height = bg.height;
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // Render name to an image and draw it on top
      const gujaratiImageName = renderTextToImage(name, 500, 400);
      const nameImg = await loadImage(gujaratiImageName);
      const positions = calculatePositions(name.length);
      ctx.drawImage(nameImg, positions.x, positions.y);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${name || "Generated"}.png`);
        }
        setIsLoading(false);
      }, "image/png");
    } catch (e) {
      setErrorMessage("Failed to generate image.");
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>અન્નકૂટોત્સવ Invitation General Invitation</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="name-input"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button onClick={generateImage} className="generate-button" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Invitation Image"}
      </button>

      {isLoading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Generating your invitation...</p>
        </div>
      )}
    </div>
  );
}

export default App;