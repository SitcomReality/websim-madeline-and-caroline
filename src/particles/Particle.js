import Vector2 from 'game/utils/Vector2';

export default class Particle {
    constructor() {
        this.position = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);

        this.lifetime = 1;
        this.age = 0;

        this.startSize = 10;
        this.endSize = 0;
        this.size = 10;

        this.startColor = [255, 255, 255, 1];
        this.endColor = [255, 255, 255, 0];
        this.color = [255, 255, 255, 1];

        this.active = false;
    }

    init(options) {
        this.position.set(options.x, options.y);
        this.velocity.set(options.vx || 0, options.vy || 0);
        this.acceleration.set(options.ax || 0, options.ay || 0);

        this.lifetime = options.lifetime || 1;
        this.age = 0;

        this.startSize = options.startSize || 10;
        this.endSize = options.endSize !== undefined ? options.endSize : 0;
        this.size = this.startSize;

        this.startColor = options.startColor || [255, 255, 255, 1];
        this.endColor = options.endColor || [255, 255, 255, 0];
        this.color = [...this.startColor];

        this.active = true;
    }

    update(deltaTime) {
        if (!this.active) return;

        this.age += deltaTime;
        if (this.age >= this.lifetime) {
            this.active = false;
            return;
        }

        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        // Interpolate properties
        const t = this.age / this.lifetime;
        this.size = this.lerp(this.startSize, this.endSize, t);
        for (let i = 0; i < 4; i++) {
            this.color[i] = this.lerp(this.startColor[i], this.endColor[i], t);
        }
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.fillStyle = `rgba(${Math.round(this.color[0])}, ${Math.round(this.color[1])}, ${Math.round(this.color[2])}, ${this.color[3]})`;
        ctx.beginPath();        
        ctx.fillRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
    }
}