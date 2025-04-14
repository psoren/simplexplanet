# 2D Pixel Planet Generator

A simple 2D pixel planet generator that creates unique planets with different biomes and terrain features.

## Features

- Generate unique 2D pixel planets
- Adjustable noise scale and landmass variation
- 8 different planet types with unique color palettes:
  - **Terra Nova**: Earth-like planet with diverse biomes
  - **Glacius**: Ice planet with frozen oceans
  - **Jungle Prime**: Tropical planet with dense vegetation
  - **Cliffside**: Rocky planet with dramatic elevation changes
  - **Desertia**: Arid planet with vast deserts
  - **Volcanis**: Volcanic planet with lava flows
  - **Aquaria**: Ocean planet with scattered islands
  - **Tundra**: Cold planet with sparse vegetation
- Automatic screenshot generation for documentation
- Pre-commit hook for capturing planet screenshots

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/simplexplanet.git
cd simplexplanet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx http-server
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

- Use the "Noise Scale" slider to adjust the overall terrain complexity
- Use the "Landmass Variation" slider to control the amount of land vs water
- Select different planet types from the radio buttons to see different color schemes
- Click "Generate New Planet" to create a new random planet

## Screenshot Generation

The project includes functionality to automatically capture screenshots of all planet types. This can be triggered in two ways:

1. Manually:
```bash
node capture_planets.js
```

2. During commit (requires environment variable):
```bash
CAPTURE_PLANETS=1 git commit -m "your message"
```

Screenshots are saved in the `imageSnapshots` directory, organized by timestamp.

## Project Structure

```
simplexplanet/
├── src/
│   └── 2d_planet.js      # Main planet generation logic
├── index.html            # Main HTML file
├── capture_planets.js    # Screenshot generation script
├── .gitignore           # Git ignore file
└── package.json         # Project dependencies
```

## Dependencies

- [simplex-noise](https://www.npmjs.com/package/simplex-noise) - For generating terrain noise
- [puppeteer](https://www.npmjs.com/package/puppeteer) - For capturing screenshots

## License

This project is licensed under the MIT License - see the LICENSE file for details.
