import Tool from 'game/editor/tools/Tool';

export default class ExitDoorTool extends Tool {
    onClick(x, y) {
        const entity = {
            x: x - 20,
            y: y - 40,
            width: 40,
            height: 80,
            color: '#00ffff',
            type: 'exit_door'
        };
        this.editorManager.addEntity(entity);
    }
}

