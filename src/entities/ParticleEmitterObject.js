import GameObject from 'game/ecs/GameObject';
import Transform from 'game/ecs/components/Transform';
import EmitterController from 'game/ecs/components/EmitterController';

export function createParticleEmitterObject(x, y, config) {
    const emitter = new GameObject('ParticleEmitterObject');
    emitter.addComponent(new Transform(x, y, config.width || 32, config.height || 32));
    emitter.addComponent(new EmitterController(config));
    return emitter;
}