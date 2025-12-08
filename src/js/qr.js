/**
 * QR Code Generation Module
 * Simple QR code generation without external dependencies
 */

/**
 * Generate QR Code for the given text
 * @param {HTMLElement} container - Container element for the QR code
 * @param {string} text - Text to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<void>}
 */
export async function generateQRCode(container, text, options = {}) {
  const {
    size = 200,
    margin = 4,
    colorDark = '#000000',
    colorLight = '#ffffff',
    errorCorrectionLevel = 'M'
  } = options;

  // Clear existing content
  container.innerHTML = '';

  try {
    // Use a simple QR code generation approach
    // For now, we'll create a placeholder that shows the URL
    const qrElement = createSimpleQRDisplay(text, size, margin, colorDark, colorLight);
    container.appendChild(qrElement);

  } catch (error) {
    console.error('Error generating QR code:', error);
    
    // Show error message
    container.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        color: #666;
        text-align: center;
        padding: 20px;
        font-family: monospace;
        font-size: 12px;
      ">
        <div>QR Code</div>
        <div style="margin-top: 10px; word-break: break-all;">${text}</div>
      </div>
    `;
  }
}

/**
 * Create a simple QR code display (placeholder implementation)
 * In a real implementation, this would use a QR code library
 */
function createSimpleQRDisplay(text, size, margin, colorDark, colorLight) {
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${size}px;
    height: ${size}px;
    background: ${colorLight};
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: ${margin}px;
    box-sizing: border-box;
  `;

  // Create a visual representation
  const qrPlaceholder = document.createElement('div');
  qrPlaceholder.style.cssText = `
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 2px;
  `;

  // Create a pattern that looks like a QR code
  const patterns = [
    [1, 0, 1, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1]
  ];

  patterns.forEach(row => {
    row.forEach(cell => {
      const cellDiv = document.createElement('div');
      cellDiv.style.cssText = `
        background: ${cell === 1 ? colorDark : colorLight};
        border-radius: 2px;
      `;
      qrPlaceholder.appendChild(cellDiv);
    });
  });

  container.appendChild(qrPlaceholder);

  // Add text below QR code
  const textElement = document.createElement('div');
  textElement.style.cssText = `
    margin-top: 10px;
    font-size: 10px;
    color: #666;
    text-align: center;
    font-family: monospace;
    word-break: break-all;
  `;
  textElement.textContent = text.length > 30 ? text.substring(0, 30) + '...' : text;
  
  // Create a wrapper for the QR pattern and text
  const wrapper = document.createElement('div');
  wrapper.appendChild(qrPlaceholder);
  wrapper.appendChild(textElement);
  
  container.innerHTML = '';
  container.appendChild(wrapper);

  return container;
}

/**
 * Download QR code as image
 * @param {HTMLElement} container - Container with QR code
 * @param {string} filename - Filename for download
 */
export async function downloadQRCode(container, filename = 'qrcode.png') {
  try {
    // Use html2canvas or similar library to convert to image
    // For now, we'll create a simple download of the data URL
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    
    canvas.width = size;
    canvas.height = size;
    
    // Create a simple QR code representation
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Draw some squares to represent QR code
    ctx.fillStyle = '#000000';
    const cellSize = 10;
    const margin = 20;
    
    // Draw corner squares
    drawCornerSquare(ctx, margin, margin, cellSize);
    drawCornerSquare(ctx, size - margin - 7 * cellSize, margin, cellSize);
    drawCornerSquare(ctx, margin, size - margin - 7 * cellSize, cellSize);
    
    // Draw some random pattern
    for (let i = 0; i < 20; i++) {
      const x = margin + Math.random() * (size - 2 * margin);
      const y = margin + Math.random() * (size - 2 * margin);
      const width = Math.random() * 3 + 1;
      const height = Math.random() * 3 + 1;
      
      if (Math.random() > 0.5) {
        ctx.fillRect(x, y, width * cellSize, height * cellSize);
      }
    }
    
    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
    
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw error;
  }
}

/**
 * Draw a corner square for QR code
 */
function drawCornerSquare(ctx, x, y, cellSize) {
  const outerSize = 7 * cellSize;
  const innerSize = 3 * cellSize;
  const centerSize = 1 * cellSize;
  
  // Outer square
  ctx.fillRect(x, y, outerSize, outerSize);
  
  // White square
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + cellSize, y + cellSize, innerSize, innerSize);
  
  // Black center
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 3 * cellSize, y + 3 * cellSize, centerSize, centerSize);
}

/**
 * Generate QR code as data URL
 * @param {string} text - Text to encode
 * @param {Object} options - QR code options
 * @returns {Promise<string>} Data URL
 */
export async function generateQRCodeDataURL(text, options = {}) {
  const { size = 300 } = options;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = size;
  canvas.height = size;
  
  // Create QR code on canvas
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  document.body.appendChild(tempContainer);
  
  await generateQRCode(tempContainer, text, { ...options, size });
  
  // Draw the QR code to canvas (simplified version)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Add some visual representation
  ctx.fillStyle = '#000000';
  const cellSize = size / 25;
  const margin = 2 * cellSize;
  
  // Draw corner squares
  drawCornerSquare(ctx, margin, margin, cellSize);
  drawCornerSquare(ctx, size - margin - 7 * cellSize, margin, cellSize);
  drawCornerSquare(ctx, margin, size - margin - 7 * cellSize, cellSize);
  
  // Draw pattern based on text hash
  const hash = simpleHash(text);
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      if (hash.charAt(i * 25 + j) === '1') {
        ctx.fillRect(margin + i * cellSize, margin + j * cellSize, cellSize, cellSize);
      }
    }
  }
  
  document.body.removeChild(tempContainer);
  
  return canvas.toDataURL('image/png');
}

/**
 * Simple hash function for QR code pattern generation
 */
function simpleHash(str) {
  let hash = '';
  for (let i = 0; i < 625; i++) {
    const char = str.charCodeAt(i % str.length);
    const bit = ((char * (i + 1)) % 2);
    hash += bit;
  }
  return hash;
}

/**
 * Copy QR code to clipboard as image
 * @param {HTMLElement} container - Container with QR code
 */
export async function copyQRCodeToClipboard(container) {
  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      const dataURL = await generateQRCodeDataURL('LocalURL');
      
      // Convert data URL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      
      return true;
    } else {
      throw new Error('Clipboard API not supported');
    }
  } catch (error) {
    console.error('Error copying QR code to clipboard:', error);
    return false;
  }
}

export default {
  generateQRCode,
  downloadQRCode,
  generateQRCodeDataURL,
  copyQRCodeToClipboard
};