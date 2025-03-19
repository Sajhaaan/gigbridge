const fs = require('fs');
const { createCanvas } = require('canvas');

// Create assets directory if it doesn't exist
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

// Function to create a placeholder image
function createPlaceholderImage(width, height, filename, backgroundColor = '#ffffff', text = '') {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Add text if provided
  if (text) {
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
  }

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`assets/${filename}`, buffer);
}

// Generate placeholder images
createPlaceholderImage(1024, 1024, 'icon.png', '#ffffff', 'GB');
createPlaceholderImage(1024, 1024, 'adaptive-icon.png', '#ffffff', 'GB');
createPlaceholderImage(1242, 2436, 'splash.png', '#ffffff', 'GigBridge');
createPlaceholderImage(32, 32, 'favicon.png', '#ffffff', 'GB');

console.log('Generated placeholder images in assets directory'); 