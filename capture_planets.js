const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const planetTypes = [
    'terra-nova',
    'glacius',
    'jungle-prime',
    'cliffside',
    'desertia',
    'volcanis',
    'aquaria',
    'tundra'
];

async function startServer() {
    console.log('Starting server...');
    const server = exec('npx http-server -p 8080');
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    return server;
}

async function capturePlanets() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotDir = path.join('imageSnapshots', timestamp);
    fs.mkdirSync(snapshotDir, { recursive: true });

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport size to ensure canvas is visible
    await page.setViewport({ width: 1200, height: 1200 });
    
    await page.goto('http://localhost:8080');

    // Wait for the canvas and controls to be ready
    await page.waitForSelector('#planetCanvas');
    await page.waitForSelector('#randomize');

    for (const planetType of planetTypes) {
        console.log(`Capturing ${planetType}...`);
        
        // Select the planet type and trigger generation
        await page.evaluate((type) => {
            // Select the radio button
            const radio = document.querySelector(`input[value="${type}"]`);
            radio.click();
            
            // Click the generate button to ensure a new planet is created
            document.getElementById('randomize').click();
        }, planetType);

        // Wait for the planet to generate
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Take screenshot of just the canvas
        const screenshotPath = path.join(snapshotDir, `${planetType}.png`);
        const canvas = await page.$('#planetCanvas');
        await canvas.screenshot({ 
            path: screenshotPath,
            omitBackground: true
        });

        console.log(`Saved ${planetType}.png`);
    }

    await browser.close();
    return snapshotDir;
}

async function main() {
    try {
        const server = await startServer();
        const snapshotDir = await capturePlanets();
        console.log(`Screenshots saved in: ${snapshotDir}`);
        server.kill();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main(); 