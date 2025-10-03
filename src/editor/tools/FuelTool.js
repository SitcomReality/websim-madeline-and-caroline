import Tool from 'game/editor/tools/Tool';

export default class FuelTool extends Tool {
    onClick(x, y) {
        const fuel = {
            x: x - 14,
            y: y - 16,
            width: 28,
            height: 32,
            color: '#ffff00',
            type: 'fuel'
        };
        this.editorManager.addEntity(fuel);
    }
}

