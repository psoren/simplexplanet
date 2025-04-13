import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/+esm';

class PixelPlanet {
    constructor(canvas, size = 256) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Define land types with their characteristics
        this.landTypes = {
            deepOcean: {
                color: '#1a1a3a',
                heightRange: [0, 0.3],
                noiseScale: 0.8,
                noiseWeight: 0.3
            },
            shallowOcean: {
                color: '#2a2a5a',
                heightRange: [0.3, 0.5],
                noiseScale: 0.6,
                noiseWeight: 0.4
            },
            beach: {
                color: '#e6b873',
                heightRange: [0.5, 0.6],
                noiseScale: 0.4,
                noiseWeight: 0.5
            },
            plains: {
                color: '#4d8c57',
                heightRange: [0.6, 0.7],
                noiseScale: 0.3,
                noiseWeight: 0.6
            },
            hills: {
                color: '#6d9c67',
                heightRange: [0.7, 0.8],
                noiseScale: 0.2,
                noiseWeight: 0.7
            },
            mountains: {
                color: '#8c6d4d',
                heightRange: [0.8, 0.9],
                noiseScale: 0.15,
                noiseWeight: 0.8
            },
            snowPeaks: {
                color: '#f5f5f5',
                heightRange: [0.9, 1.0],
                noiseScale: 0.1,
                noiseWeight: 0.9
            }
        };
    }

    getLandType(height) {
        for (const [type, properties] of Object.entries(this.landTypes)) {
            if (height >= properties.heightRange[0] && height < properties.heightRange[1]) {
                return { type, ...properties };
            }
        }
        return null;
    }

    generate(noiseScale = 0.5) {
        const noise2D = createNoise2D();
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
                    // Convert to polar coordinates for noise
                    const angle = Math.atan2(dy, dx);
                    const nx = Math.cos(angle) * distance / radius;
                    const ny = Math.sin(angle) * distance / radius;
                    
                    // Generate base height with more variation
                    const baseHeight = 1 - (distance / radius);
                    
                    // Generate multiple layers of noise with different frequencies
                    const noise1 = noise2D(nx * noiseScale * 0.5, ny * noiseScale * 0.5);
                    const noise2 = noise2D(nx * noiseScale, ny * noiseScale) * 0.5;
                    const noise3 = noise2D(nx * noiseScale * 2, ny * noiseScale * 2) * 0.25;
                    const noise4 = noise2D(nx * noiseScale * 4, ny * noiseScale * 4) * 0.125;
                    const noise5 = noise2D(nx * noiseScale * 8, ny * noiseScale * 8) * 0.0625;
                    
                    // Add a low-frequency noise for continent shaping
                    const continentNoise = noise2D(nx * noiseScale * 0.25, ny * noiseScale * 0.25) * 0.3;
                    
                    // Combine noise layers with continent shaping
                    const combinedNoise = (noise1 + noise2 + noise3 + noise4 + noise5) / 1.9375;
                    
                    // Add turbulence for fine detail
                    const turbulence = noise2D(nx * noiseScale * 16, ny * noiseScale * 16) * 0.05;
                    
                    // Calculate final height with more variation
                    let height = baseHeight + (combinedNoise + turbulence + continentNoise) * 0.5;
                    
                    // Apply biome-specific noise
                    for (const [type, properties] of Object.entries(this.landTypes)) {
                        if (height >= properties.heightRange[0] && height < properties.heightRange[1]) {
                            const biomeNoise = noise2D(
                                nx * noiseScale * properties.noiseScale,
                                ny * noiseScale * properties.noiseScale
                            ) * properties.noiseWeight * 0.2;
                            height += biomeNoise;
                            break;
                        }
                    }
                    
                    // Normalize height
                    height = Math.max(0, Math.min(1, height));
                    
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
const randomizeButton = document.getElementById('randomize');

// Generate initial planet
planet.generate();

// Event listeners
randomizeButton.addEventListener('click', () => {
    planet.generate(parseFloat(noiseScaleInput.value));
});

noiseScaleInput.addEventListener('input', (e) => {
    planet.generate(parseFloat(e.target.value));
}); 