import Tool from 'game/editor/tools/Tool';

export default class ParticleEmitterTool extends Tool {
    onClick(x, y) {
        const entity = {
            x: x - 16,
            y: y - 16,
            width: 32,
            height: 32,
            color: '#ffffff',
            type: 'particle_emitter',
            emitterType: 'magic_sparkle',
            emitRate: 10,
            particleColor: '#ffffff',
            angle: -90, // Default up
            cone: 20,
            burstMode: false,
            burstInterval: 2
        };
        this.editorManager.addEntity(entity);
    }
}

