import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';

class EmitterController {
    constructor(config) {
        this.config = config;
        this.timer = 0;
        this.emitInterval = 1 / (config.emitRate || 10);
        this.burstMode = config.burstMode || false;
        this.burstInterval = config.burstInterval || 2;
    }

    update(deltaTime) {
        this.timer += deltaTime;

        if (this.burstMode) {
            if (this.timer >= this.burstInterval) {
                this.timer = 0;
                this.emit();
            }
        } else {
            if (this.timer >= this.emitInterval) {
                this.timer = 0;
                this.emit();
            }
        }
    }

    emit() {
        const particleSystem = this.gameObject.scene?.particleSystem;
        if (!particleSystem) return;

        const { x, y } = this.gameObject.transform.position;
        const { width, height } = this.gameObject.transform.size;

        const emitterName = this.config.emitterType || 'magic_sparkle';
        const angle = this.config.angle || -90; // Default up
        const cone = this.config.cone || 20; // Default 20 degree spread
        
        const emitOptions = {
            x: x + width / 2,
            y: y + height / 2,
            color: this.config.particleColor || '#ffffff',
            angle: { min: angle - cone / 2, max: angle + cone / 2 }
        };

        // Don't override color if emitter has its own
        if (this.config.particleColor) {
             emitOptions.color = this.config.particleColor;
        }

        particleSystem.emit(emitterName, emitOptions);
    }
}

export function createParticleEmitterObject(x, y, config) {
    const emitter = new GameObject('ParticleEmitterObject');
    emitter.addComponent(new Transform(x, y, config.width || 32, config.height || 32));
    emitter.addComponent(new EmitterController(config));
    return emitter;
}

