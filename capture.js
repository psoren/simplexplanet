const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the local development server
  await page.goto('http://localhost:5173/simplexplanet/');
  
  // Wait for the canvas to be rendered
  await page.waitForSelector('#planetCanvas');
  
  // Generate timestamp for filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `planet_${timestamp}.png`;
  const filepath = path.join('imageSnapshots', filename);
  
  // Take a screenshot of the canvas
  const canvas = await page.$('#planetCanvas');
  await canvas.screenshot({ path: filepath });
  
  console.log(`Screenshot saved as: ${filepath}`);
  
  await browser.close();
})(); 