export default class ParticleEmitter {
    constructor(manager, ParticleClass, config = {}) {
        this.manager = manager;
        this.ParticleClass = ParticleClass;
        this.config = {
            count: 1,
            lifetime: { min: 0.5, max: 1.5 },
            angle: { min: 0, max: 360 },
            speed: { min: 50, max: 150 },
            startSize: { min: 5, max: 10 },
            endSize: 0,
            startColor: [255, 100, 0, 1],
            endColor: [255, 0, 0, 0],
            ax: 0,
            ay: 0,
            ...config,
        };
    }

    emit(options = {}) {
        const count = this.getValue(this.config.count, options.count);
        
        for (let i = 0; i < count; i++) {
            const particle = this.manager.get(this.ParticleClass);
            if (!particle) continue;

            const angle = this.getValue(this.config.angle, options.angle);
            const speed = this.getValue(this.config.speed, options.speed);
            const lifetime = this.getValue(this.config.lifetime, options.lifetime);
            const startSize = this.getValue(this.config.startSize, options.startSize);

            const rad = angle * (Math.PI / 180);
            const vx = Math.cos(rad) * speed;
            const vy = Math.sin(rad) * speed;

            particle.init({
                x: options.x,
                y: options.y,
                vx: vx,
                vy: vy,
                ax: this.getValue(this.config.ax, options.ax),
                ay: this.getValue(this.config.ay, options.ay),
                lifetime: lifetime,
                startSize: startSize,
                endSize: this.getValue(this.config.endSize, options.endSize),
                startColor: this.getValue(this.config.startColor, options.startColor),
                endColor: this.getValue(this.config.endColor, options.endColor),
            });
        }
    }

    getValue(configValue, overrideValue) {
        if (overrideValue !== undefined) {
            if (typeof overrideValue === 'object' && overrideValue !== null) {
                if (overrideValue.min !== undefined) {
                    return overrideValue.min + Math.random() * (overrideValue.max - overrideValue.min);
                }
                if (Array.isArray(overrideValue)) {
                    return [...overrideValue];
                }
            }
            return overrideValue;
        }
        if (typeof configValue === 'object' && configValue !== null) {
            if (configValue.min !== undefined) {
                return configValue.min + Math.random() * (configValue.max - configValue.min);
            }
            if (Array.isArray(configValue)) {
                return [...configValue];
            }
        }
        return configValue;
    }
}