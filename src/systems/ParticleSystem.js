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
        
        // Character switch emitter
        const switchEmitter = new ParticleEmitter(this.manager, AestheticParticle, {
            count: 30,
            angle: { min: 0, max: 360 },
            speed: { min: 100, max: 250 },
            lifetime: { min: 0.4, max: 0.8 },
            startSize: { min: 3, max: 6 },
            endSize: 0,
            startColor: [255, 255, 255, 1], // Will be overridden
            endColor: [255, 255, 255, 0],
        });
        this.emitters.set('character_switch', switchEmitter);

        // Madeline dash emitter
        const madelineDash = new ParticleEmitter(this.manager, AestheticParticle, {
            count: 20,
            angle: { min: -10, max: 10 },
            speed: { min: 20, max: 50 },
            lifetime: { min: 0.3, max: 0.6 },
            startSize: { min: 4, max: 8 },
            endSize: 0,
            startColor: [255, 71, 171, 0.9],
            endColor: [255, 71, 171, 0]
        });
        this.emitters.set('madeline_dash', madelineDash);

        // Caroline dash emitter
        const carolineDash = new ParticleEmitter(this.manager, AestheticParticle, {
            count: 15,
            angle: { min: -5, max: 5 },
            speed: { min: 50, max: 100 },
            lifetime: { min: 0.2, max: 0.4 },
            startSize: { min: 2, max: 5 },
            endSize: 0,
            startColor: [71, 255, 255, 1],
            endColor: [71, 255, 255, 0]
        });
        this.emitters.set('caroline_dash', carolineDash);
    }

    emit(emitterName, options) {
        const emitter = this.emitters.get(emitterName);
        if (emitter) {
            if (options.color) {
                // Special handling for color override (e.g., character switch)
                const tempOptions = { ...options };
                const startColor = this.hexToRgbA(options.color);
                const endColor = [...startColor];
                endColor[3] = 0;
                tempOptions.startColor = startColor;
                tempOptions.endColor = endColor;
                emitter.emit(tempOptions);
            } else {
                emitter.emit(options);
            }
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
    
    hexToRgbA(hex) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 1];
        }
        throw new Error('Bad Hex');
    }
}