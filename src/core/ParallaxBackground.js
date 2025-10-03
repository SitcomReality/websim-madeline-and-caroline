export default class ParallaxBackground {
    constructor(camera, worldSize, themeColors) {
        this.camera = camera;
        this.worldSize = worldSize;
        this.themeColors = themeColors || ['#ff47ab', '#47ffff', '#ffff47'];
        this.layers = [];
    }

    init() {
        // Layer 1: Farthest, slowest
        this.layers.push(this.createLayer(0.2, 80, { min: 150, max: 400 }, { min: 0.1, max: 0.2 }));
        // Layer 2: Mid-ground
        this.layers.push(this.createLayer(0.4, 60, { min: 80, max: 200 }, { min: 0.2, max: 0.4 }));
        // Layer 3: Closer, faster
        this.layers.push(this.createLayer(0.7, 40, { min: 40, max: 120 }, { min: 0.3, max: 0.6 }));
    }

    createLayer(parallaxFactor, numShapes, sizeRange, opacityRange) {
        const shapes = [];
        for (let i = 0; i < numShapes; i++) {
            const size = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min);
            // Reduce base opacity and apply a per-layer multiplier so farther layers (smaller parallaxFactor)
            // become noticeably more transparent to avoid accumulation and reduce visual dominance.
            const baseOpacity = opacityRange.min + Math.random() * (opacityRange.max - opacityRange.min);
            const layerMultiplier = 0.2 + parallaxFactor * 0.8; // smaller parallaxFactor -> smaller multiplier
            const opacity = baseOpacity * 0.6 * layerMultiplier;
            shapes.push({
                x: Math.random() * this.worldSize.x,
                y: Math.random() * this.worldSize.y,
                width: size * (0.8 + Math.random() * 0.4),
                height: size * (0.8 + Math.random() * 0.4),
                color: this.getRandomColor(opacity)
            });
        }
        return { parallaxFactor, shapes };
    }

    getRandomColor(opacity) {
        const color = this.themeColors[Math.floor(Math.random() * this.themeColors.length)];
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
            c = color.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            const r = (c >> 16) & 255;
            const g = (c >> 8) & 255;
            const b = c & 255;
            // Slightly mute colors so the background reads darker and less vibrant
            const toneFactor = 0.72;
            return `rgba(${Math.round(r * toneFactor)},${Math.round(g * toneFactor)},${Math.round(b * toneFactor)},${opacity})`;
        }
        return `rgba(255,255,255,${opacity})`;
    }

    draw(ctx) {
        for (const layer of this.layers) {
            ctx.save();
            const parallaxX = this.camera.position.x * layer.parallaxFactor;
            const parallaxY = this.camera.position.y * layer.parallaxFactor;
            ctx.translate(-parallaxX, -parallaxY);

            for (const shape of layer.shapes) {
                ctx.fillStyle = shape.color;
                ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
            }
            ctx.restore();
        }
    }
}