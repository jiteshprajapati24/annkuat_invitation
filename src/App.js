import React, { useState } from "react";
import { backgroundImage } from "./background"; // Import the image from background.js
import pdfMake from "pdfmake/build/pdfmake.min";
import AYMInvitation from "./pdf/AYM.pdf"; // Import your PDF file
import "./App.css";
import { PDFDocument } from "pdf-lib";
import { saveAs } from 'file-saver';

function App() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  const renderTextToImage = (
    text,
    canvasWidth = 300,
    canvasHeight = 50,
    isSemiBold = false
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");

    let fontSize = 20; // Default font size
    const fontWeight = isSemiBold ? "600" : "bold"; // Set semi-bold or bold
    ctx.font = `${fontWeight} ${fontSize}px 'S0763892'`; // Adjust font weight
    ctx.fillStyle = "#b40000"; // Text color

    // Adjust font size dynamically for longer text
    while (ctx.measureText(text).width > canvasWidth - 20 && fontSize > 14) {
      fontSize--;
      ctx.font = `${fontWeight} ${fontSize}px 'S0763892'`;
    }

    // Wrap text if needed
    const lines = [];
    let currentLine = "";
    const words = text.split(" ");
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

    // Render lines
    const lineHeight = fontSize + 10;
    let y = 40;
    lines.forEach((line) => {
      ctx.fillText(line, 10, y);
      y += lineHeight;
    });

    return canvas.toDataURL();
  };

  const calculatePositions = (nameLength) => {
    // If the name length exceeds 20, adjust the x and y positions
    if (nameLength > 35) {
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
    }
  };

  const generatePDF = () => {
    const formattedName = name.endsWith(",") ? name : `${name}`;
    const formattedPosition = `${position}`;
    const gujaratiImageName = renderTextToImage(formattedName, 500, 400);
    const gujaratiImagePosition = renderTextToImage(
      formattedPosition,
      300,
      200,
      true
    );

    const positions = calculatePositions(formattedName.length);

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
    });
  };

  return (
    <div className="App">
      <h1>Invitation</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="name-input"
      />
      
      <br />
      <br />
      <button onClick={generatePDF} className="generate-button">
        Generate Invitation
      </button>
    </div>
  );
}

export default App;
