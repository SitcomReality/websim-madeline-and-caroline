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
            particleType: 'aesthetic',
            emitRate: 10,
            particleColor: '#ffffff'
        };
        this.editorManager.addEntity(entity);
    }
}

