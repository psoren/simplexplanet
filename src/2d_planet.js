import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/+esm';

class PixelPlanet {
    constructor(canvas, size = 256) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.canvas.width = size;
        this.canvas.height = size;
        this.initializeNoise();
        
        // Define planet types with their color palettes
        this.planetTypes = {
            'terra-nova': {
                name: 'Terra Nova',
                landTypes: {
                    deepOcean: {
                        color: '#1a1a3a',    // Dark blue
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#2a2a5a',    // Medium blue
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#e6b873',    // Sandy color
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#4d8c57',    // Green
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#6d9c67',    // Darker green
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#8c6d4d',    // Brown
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#f5f5f5',    // White
                        heightRange: [0.95, 1.0]
                    }
                }
            },
            'glacius': {
                name: 'Glacius',
                landTypes: {
                    deepOcean: {
                        color: '#1a3a5a',    // Deep blue
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#3a5a7a',    // Light blue
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#c8e0f0',    // Ice
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#a0c0d0',    // Light ice
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#8090a0',    // Dark ice
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#607080',    // Darker ice
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#ffffff',    // White
                        heightRange: [0.95, 1.0]
                    }
                }
            },
            'jungle-prime': {
                name: 'Jungle Prime',
                landTypes: {
                    deepOcean: {
                        color: '#1a3a2a',    // Deep green-blue
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#2a5a3a',    // Light green-blue
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#c8b873',    // Sandy color
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#2d8c37',    // Dark green
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#3d9c47',    // Medium green
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#4d6d3d',    // Darker green
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#a0c0a0',    // Light green
                        heightRange: [0.95, 1.0]
                    }
                }
            },
            'cliffside': {
                name: 'Cliffside',
                landTypes: {
                    deepOcean: {
                        color: '#1a1a2a',    // Very deep blue
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#2a2a3a',    // Deep blue
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#967853',    // Rocky color
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#645a40',    // Brown
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#4a4030',    // Dark brown
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#302820',    // Darker brown
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#c8c8c8',    // Light gray
                        heightRange: [0.95, 1.0]
                    }
                }
            },
            'desertia': {
                name: 'Desertia',
                landTypes: {
                    deepOcean: {
                        color: '#1a1a3a',    // Deep blue
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#2a2a5a',    // Medium blue
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#c8a873',    // Sand
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#967853',    // Desert
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#785a30',    // Rocky desert
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#5a3a20',    // Dark desert
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#c8b4a0',    // Light sand
                        heightRange: [0.95, 1.0]
                    }
                }
            },
            'volcanis': {
                name: 'Volcanis',
                landTypes: {
                    deepOcean: {
                        color: '#1a0000',    // Black
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#3a0000',    // Dark red
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#640000',    // Red
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#963200',    // Orange
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#c86400',    // Bright orange
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#ff9600',    // Yellow-orange
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#ffc800',    // Yellow
                        heightRange: [0.95, 1.0]
                    }
                }
            },
            'aquaria': {
                name: 'Aquaria',
                landTypes: {
                    deepOcean: {
                        color: '#001a3a',    // Deep blue
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#003a7a',    // Light blue
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#00a0ff',    // Very light blue
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#0064c8',    // Blue-green
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#004896',    // Dark blue-green
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#003264',    // Darker blue-green
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#c8e0ff',    // Ice blue
                        heightRange: [0.95, 1.0]
                    }
                }
            },
            'tundra': {
                name: 'Tundra',
                landTypes: {
                    deepOcean: {
                        color: '#1a3a5a',    // Deep blue
                        heightRange: [0, 0.4]
                    },
                    shallowOcean: {
                        color: '#3a5a7a',    // Light blue
                        heightRange: [0.4, 0.5]
                    },
                    beach: {
                        color: '#c8d0e0',    // Light ice
                        heightRange: [0.5, 0.55]
                    },
                    plains: {
                        color: '#a0b0c0',    // Gray-blue
                        heightRange: [0.55, 0.65]
                    },
                    hills: {
                        color: '#8090a0',    // Dark gray
                        heightRange: [0.65, 0.8]
                    },
                    mountains: {
                        color: '#607080',    // Darker gray
                        heightRange: [0.8, 0.95]
                    },
                    snowPeaks: {
                        color: '#e0e0ff',    // White-blue
                        heightRange: [0.95, 1.0]
                    }
                }
            }
        };

        // Set default planet type
        this.currentPlanetType = 'terra-nova';
        this.landTypes = this.planetTypes[this.currentPlanetType].landTypes;

        // Add planet type change listener
        document.querySelectorAll('input[name="planetType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentPlanetType = e.target.value;
                this.landTypes = this.planetTypes[this.currentPlanetType].landTypes;
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
        for (const [type, properties] of Object.entries(this.landTypes)) {
            if (height >= properties.heightRange[0] && height < properties.heightRange[1]) {
                return { type, ...properties };
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