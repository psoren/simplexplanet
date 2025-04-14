import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/+esm';
import { terrainTypes } from '/src/terrainTypes.js';

class PixelPlanet {
    constructor(canvas, size = 256) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.canvas.width = size;
        this.canvas.height = size;
        this.initializeNoise();
        
        // Define planet types with their terrain sets
        this.planetTypes = {
            'terra-nova': {
                name: 'Terra Nova',
                description: 'Earth-like planet with diverse biomes',
                terrainSet: ['deepOcean', 'shallowOcean', 'beach', 'plains', 'hills', 'mountains', 'snowPeaks']
            },
            'glacius': {
                name: 'Glacius',
                description: 'Ice planet with frozen oceans',
                terrainSet: ['deepIce', 'shallowIce', 'iceBeach', 'tundra', 'iceHills', 'iceMountains', 'icePeaks']
            },
            'jungle-prime': {
                name: 'Jungle Prime',
                description: 'Tropical planet with dense vegetation',
                terrainSet: ['deepJungleOcean', 'shallowJungleOcean', 'jungleBeach', 'jungle', 'jungleHills', 'jungleMountains', 'junglePeaks']
            },
            'cliffside': {
                name: 'Cliffside',
                description: 'Rocky planet with dramatic elevation changes',
                terrainSet: ['deepCliffOcean', 'shallowCliffOcean', 'cliffBeach', 'cliffPlains', 'cliffHills', 'cliffMountains', 'cliffPeaks']
            },
            'desertia': {
                name: 'Desertia',
                description: 'Arid planet with vast deserts',
                terrainSet: ['deepDesertOcean', 'shallowDesertOcean', 'desertBeach', 'desert', 'desertHills', 'desertMountains', 'desertPeaks']
            },
            'volcanis': {
                name: 'Volcanis',
                description: 'Volcanic planet with lava flows',
                terrainSet: ['lavaOcean', 'shallowLava', 'lavaBeach', 'volcanicPlains', 'volcanicHills', 'volcanicMountains', 'volcanicPeaks']
            },
            'aquaria': {
                name: 'Aquaria',
                description: 'Ocean planet with scattered islands',
                terrainSet: ['deepAquaOcean', 'shallowAquaOcean', 'aquaBeach', 'aquaPlains', 'aquaHills', 'aquaMountains', 'aquaPeaks']
            },
            'tundra': {
                name: 'Tundra',
                description: 'Cold planet with sparse vegetation',
                terrainSet: ['deepIce', 'shallowIce', 'iceBeach', 'tundra', 'iceHills', 'iceMountains', 'icePeaks']
            }
        };

        // Set default planet type
        this.currentPlanetType = 'terra-nova';
        this.landTypes = terrainTypes;

        // Add planet type change listener
        document.querySelectorAll('input[name="planetType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentPlanetType = e.target.value;
                this.generate(
                    parseFloat(document.getElementById('noiseScale').value),
                    parseFloat(document.getElementById('variation').value)
                );
            });
        });
    }

    initializeNoise() {
        this.noise2D = createNoise2D();
    }

    // Smoothstep function for edge fading
    smoothstep(min, max, value) {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * x;
    }

    // Fractal Brownian Motion function
    fbm(x, y, octaves = 3, persistence = 0.5, lacunarity = 2.0) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise2D(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return total / maxValue;
    }

    getLandType(height) {
        const terrainSet = this.planetTypes[this.currentPlanetType].terrainSet;
        for (const type of terrainSet) {
            const properties = this.landTypes[type];
            if (height >= properties.heightRange[0] && height < properties.heightRange[1]) {
                return { type, color: properties.color };
            }
        }
        return null;
    }

    // Main function to generate the planet
    // noiseScale: controls the size of terrain features (lower = larger features)
    // variation: controls how much additional detail is added
    generate(noiseScale = 3.0, variation = 0.5) {
        const center = this.size / 2;
        const radius = this.size / 2 - 2;
        
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.size, this.size);

        // Generate planet
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const dx = x - center;
                const dy = y - center;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= radius) {
                    // Normalize coordinates to [-0.5, 0.5]
                    const nx = (x / this.size) - 0.5;
                    const ny = (y / this.size) - 0.5;
                    
                    // Calculate distance from center for edge fading
                    const d = Math.sqrt(nx * nx + ny * ny);
                    const fade = this.smoothstep(0.7, 0.9, d);
                    
                    // Generate base elevation using FBM
                    const baseElevation = this.fbm(
                        nx * noiseScale,
                        ny * noiseScale,
                        3, // octaves
                        0.5, // persistence
                        2.0 // lacunarity
                    );
                    
                    // Add variation noise at lower frequency
                    const variationNoise = this.fbm(
                        nx * noiseScale * 0.5,
                        ny * noiseScale * 0.5,
                        2,
                        0.3,
                        2.0
                    ) * variation;
                    
                    // Combine base elevation with variation and apply edge fading
                    let height = (baseElevation + variationNoise) * 0.5;
                    height = height * (1 - fade);
                    
                    // Normalize height to [0, 1]
                    height = (height + 1) * 0.5;
                    
                    // Get land type and color
                    const landType = this.getLandType(height);
                    if (landType) {
                        this.ctx.fillStyle = landType.color;
                        this.ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }

        // Add atmosphere/glow effect
        const gradient = this.ctx.createRadialGradient(
            center, center, radius * 0.8,
            center, center, radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.size, this.size);
    }
}

// Initialize and set up controls
const canvas = document.getElementById('planetCanvas');
const planet = new PixelPlanet(canvas);
const noiseScaleInput = document.getElementById('noiseScale');
const noiseScaleValue = document.getElementById('noiseScaleValue');
const variationInput = document.getElementById('variation');
const variationValue = document.getElementById('variationValue');
const randomizeButton = document.getElementById('randomize');

// Update value displays
noiseScaleInput.addEventListener('input', (e) => {
    noiseScaleValue.textContent = e.target.value;
    planet.generate(parseFloat(e.target.value), parseFloat(variationInput.value));
});

variationInput.addEventListener('input', (e) => {
    variationValue.textContent = e.target.value;
    planet.generate(parseFloat(noiseScaleInput.value), parseFloat(e.target.value));
});

// Generate initial planet
planet.generate();

// Event listeners
randomizeButton.addEventListener('click', () => {
    planet.initializeNoise(); // Reinitialize noise for new planet
    planet.generate(
        parseFloat(noiseScaleInput.value),
        parseFloat(variationInput.value)
    );
}); 