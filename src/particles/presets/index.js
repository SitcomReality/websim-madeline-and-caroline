import ParticleEmitter from '../ParticleEmitter.js';
import AestheticParticle from '../AestheticParticle.js';
import PhysicalParticle from '../PhysicalParticle.js';

export function registerDefaultEmitters(registry) {
    const m = registry.manager;

    registry.register('jump_dust', new ParticleEmitter(m, AestheticParticle, {
        count: 10,
        angle: { min: -120, max: -60 },
        speed: { min: 20, max: 80 },
        lifetime: { min: 0.3, max: 0.7 },
        startSize: { min: 2, max: 5 },
        endSize: 0,
        startColor: [200, 200, 200, 0.8],
        endColor: [200, 200, 200, 0],
        ay: 50
    }));

    registry.register('character_switch', new ParticleEmitter(m, AestheticParticle, {
        count: 30,
        angle: { min: 0, max: 360 },
        speed: { min: 100, max: 250 },
        lifetime: { min: 0.4, max: 0.8 },
        startSize: { min: 3, max: 6 },
        endSize: 0,
        startColor: [255, 255, 255, 1],
        endColor: [255, 255, 255, 0],
    }));

    registry.register('madeline_dash', new ParticleEmitter(m, AestheticParticle, {
        count: 20,
        angle: { min: -10, max: 10 },
        speed: { min: 20, max: 50 },
        lifetime: { min: 0.3, max: 0.6 },
        startSize: { min: 4, max: 8 },
        endSize: 0,
        startColor: [255, 71, 171, 0.9],
        endColor: [255, 71, 171, 0]
    }));

    registry.register('caroline_dash', new ParticleEmitter(m, AestheticParticle, {
        count: 15,
        angle: { min: -5, max: 5 },
        speed: { min: 50, max: 100 },
        lifetime: { min: 0.2, max: 0.4 },
        startSize: { min: 2, max: 5 },
        endSize: 0,
        startColor: [71, 255, 255, 1],
        endColor: [71, 255, 255, 0]
    }));

    registry.register('fuel_collect', new ParticleEmitter(m, AestheticParticle, {
        count: 25,
        angle: { min: 0, max: 360 },
        speed: { min: 80, max: 200 },
        lifetime: { min: 0.3, max: 0.7 },
        startSize: { min: 2, max: 5 },
        endSize: 0,
        startColor: [255, 255, 71, 1],
        endColor: [255, 255, 71, 0]
    }));

    registry.register('gasoline_spray', new ParticleEmitter(m, PhysicalParticle, {
        count: 3,
        lifetime: { min: 2.0, max: 4.0 },
        speed: { min: 150, max: 200 },
        startSize: { min: 3, max: 5 },
        endSize: 2,
        startColor: [200, 180, 220, 0.9],
        endColor: [150, 120, 170, 0.6],
        bounciness: 0.3,
        friction: 0.85,
        ay: 500
    }));

    registry.register('slime_blob', new ParticleEmitter(m, PhysicalParticle, {
        count: 5,
        lifetime: { min: 3.0, max: 5.0 },
        speed: { min: 50, max: 100 },
        startSize: { min: 4, max: 7 },
        endSize: 3,
        startColor: [50, 200, 50, 0.9], // Greenish slime color
        endColor: [30, 100, 30, 0.7],
        bounciness: 0.1, // Low bounce, sticky
        friction: 0.98, // High friction
        ay: 500
    }));

    registry.register('magic_sparkle', new ParticleEmitter(m, AestheticParticle, {
        count: 1,
        lifetime: { min: 0.5, max: 1.5 },
        speed: { min: 10, max: 30 },
        angle: { min: -120, max: -60 },
        startSize: { min: 2, max: 4 },
        endSize: 0
    }));

    registry.register('debris', new ParticleEmitter(m, PhysicalParticle, {
        count: 1,
        lifetime: { min: 1, max: 2 },
        speed: { min: 10, max: 30 },
        angle: { min: -120, max: -60 },
        startSize: { min: 2, max: 4 },
        endSize: 1,
        bounciness: 0.3,
        friction: 0.95,
        ay: 400
    }));

    registry.register('fire_sparks', new ParticleEmitter(m, AestheticParticle, {
        count: 1,
        lifetime: { min: 0.3, max: 0.8 },
        speed: { min: 40, max: 120 },
        angle: { min: -120, max: -60 },
        startSize: { min: 1, max: 3 },
        endSize: 0,
        startColor: [255, 180, 50, 1],
        endColor: [255, 80, 0, 0],
    }));

    registry.register('smoke', new ParticleEmitter(m, AestheticParticle, {
        count: 1,
        lifetime: { min: 1.5, max: 3.0 },
        speed: { min: 10, max: 30 },
        angle: { min: -100, max: -80 },
        startSize: { min: 5, max: 10 },
        endSize: { min: 15, max: 25 },
        startColor: [50, 50, 50, 0.7],
        endColor: [50, 50, 50, 0],
        ay: -20
    }));

    registry.register('player_death_burst', new ParticleEmitter(m, AestheticParticle, {
        count: 180,
        angle: { min: 0, max: 360 },
        speed: { min: 150, max: 400 },
        lifetime: { min: 0.6, max: 1.2 },
        startSize: { min: 1, max: 3 },
        endSize: 0
    }));
}