export const terrainTypes = {
    // Ocean types
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
    
    // Forest types
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
    },
    
    // Ice types
    deepIce: {
        color: '#1a3a5a',    // Deep blue
        heightRange: [0, 0.4]
    },
    shallowIce: {
        color: '#3a5a7a',    // Light blue
        heightRange: [0.4, 0.5]
    },
    iceBeach: {
        color: '#c8e0f0',    // Ice
        heightRange: [0.5, 0.55]
    },
    tundra: {
        color: '#a0c0d0',    // Light ice
        heightRange: [0.55, 0.65]
    },
    iceHills: {
        color: '#8090a0',    // Dark ice
        heightRange: [0.65, 0.8]
    },
    iceMountains: {
        color: '#607080',    // Darker ice
        heightRange: [0.8, 0.95]
    },
    icePeaks: {
        color: '#ffffff',    // White
        heightRange: [0.95, 1.0]
    },
    
    // Desert types
    deepDesertOcean: {
        color: '#1a1a3a',    // Deep blue
        heightRange: [0, 0.4]
    },
    shallowDesertOcean: {
        color: '#2a2a5a',    // Medium blue
        heightRange: [0.4, 0.5]
    },
    desertBeach: {
        color: '#c8a873',    // Sand
        heightRange: [0.5, 0.55]
    },
    desert: {
        color: '#967853',    // Desert
        heightRange: [0.55, 0.65]
    },
    desertHills: {
        color: '#785a30',    // Rocky desert
        heightRange: [0.65, 0.8]
    },
    desertMountains: {
        color: '#5a3a20',    // Dark desert
        heightRange: [0.8, 0.95]
    },
    desertPeaks: {
        color: '#c8b4a0',    // Light sand
        heightRange: [0.95, 1.0]
    },
    
    // Volcanic types
    lavaOcean: {
        color: '#1a0000',    // Black
        heightRange: [0, 0.4]
    },
    shallowLava: {
        color: '#3a0000',    // Dark red
        heightRange: [0.4, 0.5]
    },
    lavaBeach: {
        color: '#640000',    // Red
        heightRange: [0.5, 0.55]
    },
    volcanicPlains: {
        color: '#963200',    // Orange
        heightRange: [0.55, 0.65]
    },
    volcanicHills: {
        color: '#c86400',    // Bright orange
        heightRange: [0.65, 0.8]
    },
    volcanicMountains: {
        color: '#ff9600',    // Yellow-orange
        heightRange: [0.8, 0.95]
    },
    volcanicPeaks: {
        color: '#ffc800',    // Yellow
        heightRange: [0.95, 1.0]
    },

    // Jungle types
    deepJungleOcean: {
        color: '#1a3a2a',    // Deep green-blue
        heightRange: [0, 0.4]
    },
    shallowJungleOcean: {
        color: '#2a5a3a',    // Light green-blue
        heightRange: [0.4, 0.5]
    },
    jungleBeach: {
        color: '#c8b873',    // Sandy color
        heightRange: [0.5, 0.55]
    },
    jungle: {
        color: '#2d8c37',    // Dark green
        heightRange: [0.55, 0.65]
    },
    jungleHills: {
        color: '#3d9c47',    // Medium green
        heightRange: [0.65, 0.8]
    },
    jungleMountains: {
        color: '#4d6d3d',    // Darker green
        heightRange: [0.8, 0.95]
    },
    junglePeaks: {
        color: '#a0c0a0',    // Light green
        heightRange: [0.95, 1.0]
    },

    // Cliffside types
    deepCliffOcean: {
        color: '#1a1a2a',    // Very deep blue
        heightRange: [0, 0.4]
    },
    shallowCliffOcean: {
        color: '#2a2a3a',    // Deep blue
        heightRange: [0.4, 0.5]
    },
    cliffBeach: {
        color: '#967853',    // Rocky color
        heightRange: [0.5, 0.55]
    },
    cliffPlains: {
        color: '#645a40',    // Brown
        heightRange: [0.55, 0.65]
    },
    cliffHills: {
        color: '#4a4030',    // Dark brown
        heightRange: [0.65, 0.8]
    },
    cliffMountains: {
        color: '#302820',    // Darker brown
        heightRange: [0.8, 0.95]
    },
    cliffPeaks: {
        color: '#c8c8c8',    // Light gray
        heightRange: [0.95, 1.0]
    },

    // Aquaria types
    deepAquaOcean: {
        color: '#001a3a',    // Deep blue
        heightRange: [0, 0.4]
    },
    shallowAquaOcean: {
        color: '#003a7a',    // Light blue
        heightRange: [0.4, 0.5]
    },
    aquaBeach: {
        color: '#00a0ff',    // Very light blue
        heightRange: [0.5, 0.55]
    },
    aquaPlains: {
        color: '#0064c8',    // Blue-green
        heightRange: [0.55, 0.65]
    },
    aquaHills: {
        color: '#004896',    // Dark blue-green
        heightRange: [0.65, 0.8]
    },
    aquaMountains: {
        color: '#003264',    // Darker blue-green
        heightRange: [0.8, 0.95]
    },
    aquaPeaks: {
        color: '#c8e0ff',    // Ice blue
        heightRange: [0.95, 1.0]
    }
}; 