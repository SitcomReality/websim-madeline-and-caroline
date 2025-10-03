import Particle from './Particle.js';

export default class AestheticParticle extends Particle {
    constructor() {
        super();    
    }
    // No collision or special logic needed for aesthetic particles,
    // so it just inherits from the base Particle class.
}