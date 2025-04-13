import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Planet parameters
let planet;
let radius = 5;
let segments = 64; // Increased for more detail while keeping pixelation
let baseNoiseScale = 0.5; // Increased for more detail
let noiseIntensity = 0.2; // Increased for more pronounced features
let octaves = 5; // Increased for more detail
let persistence = 0.5;
let lacunarity = 2.0;

// Color palettes
const colorPalettes = [
    {
        deepWater: new THREE.Color(0.1, 0.1, 0.4),
        shallowWater: new THREE.Color(0.2, 0.3, 0.7),
        beach: new THREE.Color(0.9, 0.7, 0.4),
        grass: new THREE.Color(0.4, 0.6, 0.2),
        mountain: new THREE.Color(0.5, 0.4, 0.3),
        snow: new THREE.Color(0.95, 0.95, 0.95)
    }
];

let currentColorPalette = colorPalettes[0];

// Create initial planet
createPlanet();

function createPlanet() {
    // Remove existing planet if it exists
    if (planet) {
        scene.remove(planet);
        planet.geometry.dispose();
    }

    // Create planet geometry
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        shininess: 0,
        flatShading: true,
        specular: new THREE.Color(0x000000)
    });

    // Generate terrain using multiple octaves of simplex noise
    const noise2D = createNoise2D();
    const positions = geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);

    // Store original positions for proper spherical mapping
    const originalPositions = new Float32Array(positions);

    function generateNoise(x, y, z, scale) {
        let amplitude = 1;
        let frequency = 1;
        let noiseValue = 0;
        let maxValue = 0;

        // Convert to spherical coordinates
        const r = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.acos(z / r);
        const phi = Math.atan2(y, x);

        // Use proper spherical mapping for noise coordinates
        const nx = Math.sin(theta) * Math.cos(phi);
        const ny = Math.sin(theta) * Math.sin(phi);
        const nz = Math.cos(theta);

        for (let i = 0; i < octaves; i++) {
            // Sample noise in 3D space with higher frequency
            const noiseX = nx * frequency * scale * 2;
            const noiseY = ny * frequency * scale * 2;
            const noiseZ = nz * frequency * scale * 2;
            
            // Combine multiple noise samples
            const noise1 = noise2D(noiseX, noiseY);
            const noise2 = noise2D(noiseY, noiseZ);
            const noise3 = noise2D(noiseZ, noiseX);
            
            noiseValue += (noise1 + noise2 + noise3) / 3 * amplitude;
            maxValue += amplitude;
            
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return noiseValue / maxValue;
    }

    // First pass: calculate heights
    const heights = new Float32Array(positions.length / 3);
    for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        
        const noise = generateNoise(x, y, z, baseNoiseScale);
        heights[i / 3] = 1 + noise * noiseIntensity;
    }

    // Second pass: apply heights and colors
    for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        
        // Calculate the normalized direction vector
        const r = Math.sqrt(x * x + y * y + z * z);
        const nx = x / r;
        const ny = y / r;
        const nz = z / r;
        
        // Get height for this vertex
        const height = heights[i / 3];
        
        // Apply height while maintaining spherical shape
        positions[i] = nx * radius * height;
        positions[i + 1] = ny * radius * height;
        positions[i + 2] = nz * radius * height;
        
        // Enhanced color mapping with current palette
        const color = new THREE.Color();
        if (height < 0.95) {
            color.copy(currentColorPalette.deepWater);
        } else if (height < 1.0) {
            color.copy(currentColorPalette.shallowWater);
        } else if (height < 1.05) {
            color.copy(currentColorPalette.beach);
        } else if (height < 1.15) {
            color.copy(currentColorPalette.grass);
        } else if (height < 1.25) {
            color.copy(currentColorPalette.mountain);
        } else {
            color.copy(currentColorPalette.snow);
        }
        
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    planet = new THREE.Mesh(geometry, material);
    scene.add(planet);
}

// Camera position
camera.position.z = 15;

// Controls
const rotationSpeed = document.getElementById('rotationSpeed');
const noiseScaleInput = document.getElementById('noiseScale');
const randomizeButton = document.getElementById('randomize');

// Randomize planet parameters
function randomizePlanet() {
    // Randomize noise parameters
    baseNoiseScale = 0.1 + Math.random() * 1.9; // 0.1 to 2.0
    noiseIntensity = 0.1 + Math.random() * 0.3; // 0.1 to 0.4
    octaves = 2 + Math.floor(Math.random() * 4); // 2 to 5
    persistence = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
    lacunarity = 1.5 + Math.random() * 1.5; // 1.5 to 3.0
    
    // Update sliders
    noiseScaleInput.value = baseNoiseScale;
    
    // Create new planet
    createPlanet();
}

// Event listeners
randomizeButton.addEventListener('click', randomizePlanet);
noiseScaleInput.addEventListener('input', (e) => {
    baseNoiseScale = parseFloat(e.target.value);
    createPlanet();
});

// Add orbit controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate planet
    planet.rotation.y += parseFloat(rotationSpeed.value);
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate(); 