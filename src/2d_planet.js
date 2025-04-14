import { createNoise2D } from 'simplex-noise';

class PixelPlanet {
    constructor() {
        this.canvas = document.getElementById('planetCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.noise2D = createNoise2D();
        
        // Define planet types with their color palettes
        this.planetTypes = {
            'terra-nova': {
                name: 'Terra Nova',
                colors: {
                    deepWater: [0, 0, 100],    // Deep blue
                    shallowWater: [0, 100, 200], // Light blue
                    beach: [255, 200, 150],    // Sandy color
                    grass: [0, 150, 0],        // Green
                    mountain: [100, 100, 100], // Gray
                    snow: [255, 255, 255]      // White
                }
            },
            'glacius': {
                name: 'Glacius',
                colors: {
                    deepWater: [0, 50, 150],   // Deep blue
                    shallowWater: [100, 150, 255], // Light blue
                    beach: [200, 220, 255],    // Ice
                    grass: [150, 200, 255],    // Light ice
                    mountain: [100, 150, 200], // Dark ice
                    snow: [255, 255, 255]      // White
                }
            },
            'jungle-prime': {
                name: 'Jungle Prime',
                colors: {
                    deepWater: [0, 50, 100],   // Deep green-blue
                    shallowWater: [0, 150, 200], // Light green-blue
                    beach: [200, 180, 100],    // Sandy color
                    grass: [0, 100, 0],        // Dark green
                    mountain: [50, 80, 50],    // Darker green
                    snow: [150, 200, 150]      // Light green
                }
            },
            'cliffside': {
                name: 'Cliffside',
                colors: {
                    deepWater: [0, 0, 50],     // Very deep blue
                    shallowWater: [0, 50, 100], // Deep blue
                    beach: [150, 100, 50],     // Rocky color
                    grass: [100, 80, 60],      // Brown
                    mountain: [80, 60, 40],    // Dark brown
                    snow: [200, 200, 200]      // Light gray
                }
            },
            'desertia': {
                name: 'Desertia',
                colors: {
                    deepWater: [0, 0, 50],     // Deep blue
                    shallowWater: [0, 50, 100], // Medium blue
                    beach: [200, 150, 100],    // Sand
                    grass: [150, 100, 50],     // Desert
                    mountain: [100, 70, 30],   // Rocky desert
                    snow: [200, 180, 150]      // Light sand
                }
            },
            'volcanis': {
                name: 'Volcanis',
                colors: {
                    deepWater: [0, 0, 0],      // Black
                    shallowWater: [50, 0, 0],  // Dark red
                    beach: [100, 0, 0],        // Red
                    grass: [150, 50, 0],       // Orange
                    mountain: [200, 100, 0],   // Bright orange
                    snow: [255, 150, 0]        // Yellow
                }
            },
            'aquaria': {
                name: 'Aquaria',
                colors: {
                    deepWater: [0, 0, 150],    // Deep blue
                    shallowWater: [0, 100, 255], // Light blue
                    beach: [0, 200, 255],      // Very light blue
                    grass: [0, 150, 200],      // Blue-green
                    mountain: [0, 100, 150],   // Dark blue-green
                    snow: [200, 240, 255]      // Ice blue
                }
            },
            'tundra': {
                name: 'Tundra',
                colors: {
                    deepWater: [0, 50, 100],   // Deep blue
                    shallowWater: [100, 150, 200], // Light blue
                    beach: [200, 220, 240],    // Light ice
                    grass: [150, 180, 200],    // Gray-blue
                    mountain: [100, 120, 140], // Dark gray
                    snow: [240, 240, 255]      // White-blue
                }
            }
        };

        // Set up event listeners
        document.getElementById('noiseScale').addEventListener('input', (e) => {
            document.getElementById('noiseScaleValue').textContent = e.target.value;
            this.generate(e.target.value, document.getElementById('variation').value);
        });

        document.getElementById('variation').addEventListener('input', (e) => {
            document.getElementById('variationValue').textContent = e.target.value;
            this.generate(document.getElementById('noiseScale').value, e.target.value);
        });

        document.getElementById('randomize').addEventListener('click', () => {
            this.generate(
                document.getElementById('noiseScale').value,
                document.getElementById('variation').value
            );
        });

        // Add planet type change listener
        document.querySelectorAll('input[name="planetType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentPlanetType = e.target.value;
                this.generate(
                    document.getElementById('noiseScale').value,
                    document.getElementById('variation').value
                );
            });
        });

        // Set default planet type
        this.currentPlanetType = 'terra-nova';

        // Initial generation
        this.generate(3.0, 0.5);
    }

    generate(noiseScale = 3.0, variation = 0.5) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;

        // Get current planet type colors
        const colors = this.planetTypes[this.currentPlanetType].colors;

        // Clear canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, width, height);

        // Create island-forming noise with three layers
        const islandNoise1 = this.noise2D(0, 0) * 0.5;
        const islandNoise2 = this.noise2D(100, 100) * 0.3;
        const islandNoise3 = this.noise2D(200, 200) * 0.2;
        const baseIslandPattern = (islandNoise1 + islandNoise2 + islandNoise3) * variation;

        // Generate terrain
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= radius) {
                    // Normalize coordinates for noise
                    const nx = (x - centerX) / radius;
                    const ny = (y - centerY) / radius;
                    
                    // Calculate base height using multiple noise layers
                    const baseNoise = this.noise2D(nx * noiseScale, ny * noiseScale);
                    const detailNoise = this.noise2D(nx * noiseScale * 2, ny * noiseScale * 2) * 0.5;
                    const fineNoise = this.noise2D(nx * noiseScale * 4, ny * noiseScale * 4) * 0.25;
                    
                    // Combine noise layers
                    const combinedNoise = (baseNoise + detailNoise + fineNoise) / 1.75;
                    
                    // Calculate island pattern
                    const islandPattern = this.noise2D(nx * 0.1 * variation, ny * 0.1 * variation) * variation;
                    
                    // Only add height if we're in an island area
                    let height = 0;
                    if (islandPattern > baseIslandPattern) {
                        height = combinedNoise;
                    }
                    
                    // Determine color based on height
                    let color;
                    if (height < -0.2) {
                        color = `rgb(${colors.deepWater.join(',')})`;
                    } else if (height < 0) {
                        color = `rgb(${colors.shallowWater.join(',')})`;
                    } else if (height < 0.1) {
                        color = `rgb(${colors.beach.join(',')})`;
                    } else if (height < 0.3) {
                        color = `rgb(${colors.grass.join(',')})`;
                    } else if (height < 0.6) {
                        color = `rgb(${colors.mountain.join(',')})`;
                    } else {
                        color = `rgb(${colors.snow.join(',')})`;
                    }
                    
                    // Draw pixel
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
}

// Initialize the planet generator
new PixelPlanet(); 