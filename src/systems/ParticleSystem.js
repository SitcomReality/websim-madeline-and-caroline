import ParticleManager from 'game/particles/ParticleManager';
import ParticleEmitter from 'game/particles/ParticleEmitter';
import AestheticParticle from 'game/particles/AestheticParticle';

export default class ParticleSystem {
    constructor() {
        this.manager = new ParticleManager();
        this.emitters = new Map();
        this.registerDefaultEmitters();
    }

    registerDefaultEmitters() {
        // Jump dust emitter
        const jumpDustEmitter = new ParticleEmitter(this.manager, AestheticParticle, {
            count: 10,
            angle: { min: -120, max: -60 },
            speed: { min: 20, max: 80 },
            lifetime: { min: 0.3, max: 0.7 },
            startSize: { min: 2, max: 5 },
            endSize: 0,
            startColor: [200, 200, 200, 0.8],
            endColor: [200, 200, 200, 0],
            ay: 50 // slight gravity effect
        });
        this.emitters.set('jump_dust', jumpDustEmitter);
    }

    emit(emitterName, options) {
        const emitter = this.emitters.get(emitterName);
        if (emitter) {
            emitter.emit(options);
        } else {
            console.warn(`Particle emitter "${emitterName}" not found.`);
        }
    }

    update(deltaTime, colliders = []) {
        this.manager.update(deltaTime, colliders);
    }

    draw(ctx) {
        this.manager.draw(ctx);
    }
}