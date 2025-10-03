import ParticleEmitter from '../ParticleEmitter.js';
import AestheticParticle from '../AestheticParticle.js';
import PhysicalParticle from '../PhysicalParticle.js';

export default class EmitterRegistry {
    constructor(manager) {
        this.manager = manager;
        this.emitters = new Map();
    }

    register(name, emitter) {
        this.emitters.set(name, emitter);
    }

    get(name) {
        return this.emitters.get(name);
    }

    getAvailableEmitterTypes() {
        // User requested all particle types to be available in the editor properties panel.
        return Array.from(this.emitters.keys());
    }
}