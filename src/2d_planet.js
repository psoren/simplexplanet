import { createNoise2D } from 'simplex-noise';
import seedrandom from 'seedrandom';
import { v4 as uuidv4 } from 'uuid';
import { terrainTypes } from '/src/terrainTypes.js';
import { planetTypes } from '/src/planetTypes.js';
import * as THREE from 'three';

class PixelPlanet {
    constructor(canvas, size = 512) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Set up star canvas
        this.starCanvas = document.getElementById('starCanvas');
        this.starCtx = this.starCanvas.getContext('2d');
        this.resizeStarCanvas();
        window.addEventListener('resize', () => this.resizeStarCanvas());
        
        // Set default planet type
        this.currentPlanetType = 'terra-nova';
        this.landTypes = terrainTypes;
        this.planetTypes = planetTypes;

        // Generate initial random seed and initialize noise
        this.seed = this.generateSeed();
        this.initializeNoise();
        this.updateDescription();

        // Add planet type change listener
        document.querySelectorAll('input[name="planetType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentPlanetType = e.target.value;
                this.updateDescription();
                this.generate(
                    parseFloat(document.getElementById('noiseScale').value),
                    parseFloat(document.getElementById('variation').value)
                );
            });
        });

        // Generate initial stars
        this.generateStars();
    }

    resizeStarCanvas() {
        this.starCanvas.width = window.innerWidth;
        this.starCanvas.height = window.innerHeight;
        this.generateStars();
    }

    generateStars() {
        const starCount = Math.floor((this.starCanvas.width * this.starCanvas.height) / 1000);
        this.starCtx.fillStyle = '#000000';
        this.starCtx.fillRect(0, 0, this.starCanvas.width, this.starCanvas.height);
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * this.starCanvas.width;
            const y = Math.random() * this.starCanvas.height;
            const size = Math.random() * 1.5;
            const brightness = Math.random() * 0.8 + 0.2;
            
            this.starCtx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            this.starCtx.fillRect(x, y, size, size);
        }
    }

    updateDescription() {
        const description = this.planetTypes[this.currentPlanetType].description;        
        document.getElementById('planetDescription').textContent = description;
    }

    generateSeed() {
        return uuidv4();
    }

    initializeNoise() {
        const rng = seedrandom(this.seed);
        this.noise2D = createNoise2D(rng);
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
        
        // Clear canvas with black background
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
        this.texture.needsUpdate = true;

        if (this.texture) {
            this.texture.needsUpdate = true;
        }    
    
    
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
const seedInput = document.getElementById('seed');
const setSeedButton = document.getElementById('setSeed');

// Update value displays
noiseScaleInput.addEventListener('input', (e) => {
    noiseScaleValue.textContent = e.target.value;
    planet.generate(
        parseFloat(e.target.value),
        parseFloat(variationInput.value)
    );
});

variationInput.addEventListener('input', (e) => {
    variationValue.textContent = e.target.value;
    planet.generate(
        parseFloat(noiseScaleInput.value),
        parseFloat(e.target.value)
    );
});


randomizeButton.addEventListener('click', () => {
    planet.seed = planet.generateSeed();
    seedInput.value = planet.seed;
    planet.initializeNoise();
    planet.generate(
        parseFloat(noiseScaleInput.value),
        parseFloat(variationInput.value)
    );
});


setSeedButton.addEventListener('click', () => {
    const newSeed = seedInput.value;

    if(newSeed && newSeed !== planet.seed){
        planet.seed = newSeed;
        planet.initializeNoise();
        planet.generate(
            parseFloat(noiseScaleInput.value),
            parseFloat(variationInput.value)
        );
    }
});

// Setup Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threeContainer').appendChild(renderer.domElement);

// Turn canvas into texture
const texture = new THREE.CanvasTexture(canvas);
planet.texture = texture;


const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Animate
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

// Generate initial planet
planet.generate(3.0, 0.5); 