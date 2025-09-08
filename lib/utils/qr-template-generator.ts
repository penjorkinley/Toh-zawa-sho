// lib/utils/qr-template-generator.ts

export interface QRTemplateData {
  restaurantName: string;
  tableNumber: string;
  qrCodeDataUrl: string;
  menuUrl: string;
}

export function generateQRCodeTemplate(data: QRTemplateData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Set canvas dimensions (A6 size ratio - good for printing)
      const width = 600;
      const height = 800;
      canvas.width = width;
      canvas.height = height;

      // Background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, "#f8fafc");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Header section with restaurant name
      ctx.fillStyle = "#1e293b";
      ctx.font = "600 40px Arial, sans-serif";
      ctx.textAlign = "center";

      // Restaurant name with word wrapping and fallback
      const restaurantText = data.restaurantName || "RESTAURANT";
      const maxWidth = width - 60;
      const words = restaurantText.split(" ");
      let line = "";
      let y = 80;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, width / 2, y);
          line = words[n] + " ";
          y += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, width / 2, y);

      // Table number section
      const tableY = y + 80;
      ctx.fillStyle = "#475569";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillText("TABLE", width / 2, tableY);

      // Large table number
      ctx.fillStyle = "#C78853";
      ctx.font = "bold 56px Arial, sans-serif";
      ctx.fillText(data.tableNumber, width / 2, tableY + 80);

      // QR Code section
      const qrY = tableY + 120;
      const qrSize = 280;
      const qrX = (width - qrSize) / 2;

      // QR Code background with shadow effect
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Load and draw QR code
      const qrImage = new Image();
      qrImage.onload = () => {
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

        // Instructions text
        const instructionsY = qrY + qrSize + 80;
        ctx.fillStyle = "#64748b";
        ctx.font = "20px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scan to view our menu", width / 2, instructionsY);

        // Footer section
        const footerY = height - 100;

        // "Toh zawa sho" text
        ctx.fillStyle = "#C78853";
        ctx.font = "italic 16px Arial, sans-serif";
        ctx.fillText("Toh zawa sho", width / 2, footerY);

        // "Powered by NabaTech" text
        ctx.fillStyle = "#64748b";
        ctx.font = "14px Arial, sans-serif";
        ctx.fillText("Powered by NabaTech", width / 2, footerY + 25);

        // Contact information
        ctx.font = "14px Arial, sans-serif";
        ctx.fillText(
          "Contact us: 77270180 | nabatech.co@gmail.com",
          width / 2,
          footerY + 45
        );

        // Add decorative elements
        drawDecorationCorners(ctx, width, height);

        // Convert to data URL and resolve
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        resolve(dataUrl);
      };

      qrImage.onerror = () => {
        reject(new Error("Failed to load QR code image"));
      };

      qrImage.src = data.qrCodeDataUrl;
    } catch (error) {
      reject(error);
    }
  });
}

function drawDecorationCorners(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const cornerSize = 35;
  const cornerThickness = 5;

  ctx.strokeStyle = "#C78853";
  ctx.lineWidth = cornerThickness;
  ctx.lineCap = "round";

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(20, 20 + cornerSize);
  ctx.lineTo(20, 20);
  ctx.lineTo(20 + cornerSize, 20);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(width - 20 - cornerSize, 20);
  ctx.lineTo(width - 20, 20);
  ctx.lineTo(width - 20, 20 + cornerSize);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(20, height - 20 - cornerSize);
  ctx.lineTo(20, height - 20);
  ctx.lineTo(20 + cornerSize, height - 20);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - 20 - cornerSize, height - 20);
  ctx.lineTo(width - 20, height - 20);
  ctx.lineTo(width - 20, height - 20 - cornerSize);
  ctx.stroke();
}
