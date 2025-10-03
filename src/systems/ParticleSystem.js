import ParticleManager from 'game/particles/ParticleManager';
import EmitterRegistry from '../particles/EmitterRegistry.js';
import { registerDefaultEmitters } from '../particles/presets/index.js';
import { hexToRgbA } from '../particles/utils/color.js';

export default class ParticleSystem {
    constructor() {
        this.manager = new ParticleManager();
        this.registry = new EmitterRegistry(this.manager);
        registerDefaultEmitters(this.registry);
    }

    getAvailableEmitterTypes() {
        return this.registry.getAvailableEmitterTypes();
    }

    emit(emitterName, options) {
        const emitter = this.registry.get(emitterName);
        if (!emitter) { console.warn(`Particle emitter "${emitterName}" not found.`); return; }
        if (options?.color) {
            const startColor = hexToRgbA(options.color);
            const endColor = [...startColor]; endColor[3] = 0;
            emitter.emit({ ...options, startColor, endColor });
        } else {
            emitter.emit(options);
        }
    }

    update(deltaTime, colliders = []) { this.manager.update(deltaTime, colliders); }
    draw(ctx) { this.manager.draw(ctx); }
}