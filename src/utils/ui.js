const RECENT_COLORS_KEY = 'editor_recent_colors';
const MAX_RECENT_COLORS = 6;

function getRecentColors() {
    try {
        const stored = localStorage.getItem(RECENT_COLORS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

export function setRecentColor(color) {
    let colors = getRecentColors();
    // Remove existing instance of the color to move it to the front
    colors = colors.filter(c => c !== color);
    // Add new color to the front
    colors.unshift(color);
    // Trim to max length
    if (colors.length > MAX_RECENT_COLORS) {
        colors.length = MAX_RECENT_COLORS;
    }
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(colors));
}

export function createRecentColors(onClick) {
    const container = document.createElement('div');
    container.className = 'recent-colors';
    
    const colors = getRecentColors();
    if (colors.length === 0) return container; // Don't show if empty

    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.title = color;
        swatch.onclick = () => onClick(color);
        container.appendChild(swatch);
    });
    
    return container;
}