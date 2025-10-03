export const BUNDLED_MAPS = [
    { name: "Chromatic Ascent", path: "src/maps/Chromatic_Ascent.json" },
    { name: "Colorful Cringe", path: "src/maps/Colorful_Cringe.json" },
    { name: "Particle Showcase Level 1", path: "src/maps/Particle_Showcase_Level_1.json" },
    { name: "Particle Showcase Level A", path: "src/maps/Particle_Showcase_Level_A.json" },
    { name: "Prism Path", path: "src/maps/Prism_Path.json" },
    { name: "Saline Trampoline", path: "src/maps/Saline_Trampoline.json" }
];

export async function fetchLevelData(path) {
    if (path.startsWith('src/maps/')) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                // If fetching fails (e.g., path error), warn and return null
                console.warn(`Failed to fetch bundled map from ${path}. Status: ${response.status}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching bundled level:', error);
            return null;
        }
    }
    // This function primarily handles asynchronous fetching of bundled maps.
}