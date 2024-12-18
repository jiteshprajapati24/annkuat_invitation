import React, { useState } from "react";
import { backgroundImage } from "./background"; // Import the image from background.js
import pdfMake from "pdfmake/build/pdfmake.min";
import AYMInvitation from "./pdf/AYM.pdf"; // Import your PDF file
import "./App.css";
import { PDFDocument } from "pdf-lib";
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
      return { x: 80, y: 505 };
    }
    return { x: 215, y: 465 };
  };

  const mergePDFs = async (generatedPDFBlob, additionalPDFUrl) => {
    try {
      const generatedPDFBytes = await generatedPDFBlob.arrayBuffer();
      const response = await fetch(additionalPDFUrl);
      if (!response.ok) throw new Error("Failed to fetch additional PDF");
      const additionalPDFBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(generatedPDFBytes);
      const additionalPDF = await PDFDocument.load(additionalPDFBytes);
      const additionalPages = await pdfDoc.copyPages(additionalPDF, additionalPDF.getPageIndices());
      additionalPages.forEach((page) => pdfDoc.addPage(page));
      const mergedPDFBytes = await pdfDoc.save();
      const mergedPDFBlob = new Blob([mergedPDFBytes], { type: 'application/pdf' });
      saveAs(mergedPDFBlob, `${name || "Generated"}.pdf`);
    } catch (error) {
      console.error("Error merging PDFs:", error.message);
      setErrorMessage("Failed to generate PDF");
    }
  };

  const generatePDF = () => {
    if (!name) {
      setErrorMessage("Name is required.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);

    const gujaratiImageName = renderTextToImage(name, 500, 400);
    const positions = calculatePositions(name.length);

    const docDefinition = {
      content: [
        {
          image: gujaratiImageName,
          absolutePosition: { x: positions.x, y: positions.y },
        }
      ],
      background: [
        {
          image: backgroundImage,
          width: 595,
        }
      ],
    };

    pdfMake.createPdf(docDefinition).getBlob(async (generatedPDFBlob) => {
      await mergePDFs(generatedPDFBlob, AYMInvitation);
      setIsLoading(false);
    });
  };

  return (
    <div className="App">
      <h1>Atmiya Yuva Mahotsav General Invitation</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="name-input"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button onClick={generatePDF} className="generate-button" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Invitation"}
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
