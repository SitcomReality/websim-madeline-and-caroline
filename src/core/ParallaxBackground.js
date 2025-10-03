export default class ParallaxBackground {
    constructor(camera, worldSize, themeColors) {
        this.camera = camera;
        this.worldSize = worldSize;
        // Use a much darker, muted palette by default so background doesn't overpower the level
        this.themeColors = themeColors || ['#2a2a3a', '#1e2933', '#2d2b36'];
        this.layers = [];
    }

    init() {
        // Darker, subtler layers with lower opacities so map remains readable
        this.layers.push(this.createLayer(0.2, 80, { min: 150, max: 400 }, { min: 0.04, max: 0.08 }));
        this.layers.push(this.createLayer(0.4, 60, { min: 80, max: 200 }, { min: 0.06, max: 0.12 }));
        this.layers.push(this.createLayer(0.7, 40, { min: 40, max: 120 }, { min: 0.08, max: 0.16 }));
    }

    createLayer(parallaxFactor, numShapes, sizeRange, opacityRange) {
        const shapes = [];
        for (let i = 0; i < numShapes; i++) {
            const size = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min);
            const opacity = opacityRange.min + Math.random() * (opacityRange.max - opacityRange.min);
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
            return `rgba(${r},${g},${b},${opacity})`;
        }
        return `rgba(255,255,255,${opacity})`;
    }

    draw(ctx) {
        for (const layer of this.layers) {
            ctx.save();
            // Reduce overall layer alpha so parallax is unobtrusive
            ctx.globalAlpha = 0.6;
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