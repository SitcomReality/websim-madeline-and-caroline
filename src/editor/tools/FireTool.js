import Tool from 'game/editor/tools/Tool';

export default class FireTool extends Tool {
    constructor(editorManager) {
        super(editorManager);
        this.intensity = 1;
    }
    
    onClick(x, y) {
        const fire = {
            x: x,
            y: y,
            width: 24 * this.intensity,
            height: 24 * this.intensity,
            color: '#ff4500',
            type: 'fire',
            intensity: this.intensity
        };
        this.editorManager.addEntity(fire);
    }
}

