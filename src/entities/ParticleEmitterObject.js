import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';

class EmitterController {
    constructor(config) {
        this.config = config;
        this.timer = 0;
        this.emitInterval = 1 / (config.emitRate || 10);
    }

    update(deltaTime) {
        this.timer += deltaTime;
        if (this.timer >= this.emitInterval) {
            this.timer = 0;
            this.emit();
        }
    }

    emit() {
        const particleSystem = this.gameObject.scene?.particleSystem;
        if (!particleSystem) return;

        const { x, y } = this.gameObject.transform.position;
        const { width, height } = this.gameObject.transform.size;

        const emitterName = this.config.particleType === 'physical' ? 'generic_physical' : 'generic_aesthetic';

        // This is a simplified emission. A more robust system would allow customizing all particle properties.
        particleSystem.emit(emitterName, {
            x: x + Math.random() * width,
            y: y + Math.random() * height,
            color: this.config.particleColor || '#ffffff'
        });
    }
}

export function createParticleEmitterObject(x, y, config) {
    const emitter = new GameObject('ParticleEmitterObject');
    emitter.addComponent(new Transform(x, y, config.width || 32, config.height || 32));
    emitter.addComponent(new EmitterController(config));
    return emitter;
}