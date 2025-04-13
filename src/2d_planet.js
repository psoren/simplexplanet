import { createNoise2D } from 'simplex-noise';

class PixelPlanet {
    constructor(canvas, size = 256) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Color palette matching the reference image
        this.colors = {
            deepWater: '#1a1a3a',
            shallowWater: '#2a2a5a',
            beach: '#e6b873',
            grass: '#4d8c57',
            mountain: '#8c6d4d',
            snow: '#f5f5f5'
        };
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
                    
                    // Generate multiple layers of noise with different frequencies
                    const noise1 = noise2D(nx * noiseScale, ny * noiseScale);
                    const noise2 = noise2D(nx * noiseScale * 2, ny * noiseScale * 2) * 0.5;
                    const noise3 = noise2D(nx * noiseScale * 4, ny * noiseScale * 4) * 0.25;
                    const noise4 = noise2D(nx * noiseScale * 8, ny * noiseScale * 8) * 0.125;
                    const noise5 = noise2D(nx * noiseScale * 16, ny * noiseScale * 16) * 0.0625;
                    
                    // Combine noise layers with different weights
                    const noise = (noise1 + noise2 + noise3 + noise4 + noise5) / 1.9375;
                    
                    // Add some turbulence for more detail
                    const turbulence = noise2D(nx * noiseScale * 32, ny * noiseScale * 32) * 0.05;
                    
                    const height = 1 + (noise + turbulence) * 0.4;
                    
                    // Set color based on height with more granular thresholds
                    let color;
                    if (height < 0.92) {
                        color = this.colors.deepWater;
                    } else if (height < 0.96) {
                        color = this.colors.shallowWater;
                    } else if (height < 1.02) {
                        color = this.colors.beach;
                    } else if (height < 1.12) {
                        color = this.colors.grass;
                    } else if (height < 1.22) {
                        color = this.colors.mountain;
                    } else {
                        color = this.colors.snow;
                    }
                    
                    // Draw pixel
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x, y, 1, 1);
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