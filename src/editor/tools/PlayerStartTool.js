import Tool from 'game/editor/tools/Tool';

export default class PlayerStartTool extends Tool {
    onClick(x, y) {
        // Only allow one player start per level
        const existing = this.editorManager.state.entities.find(e => e.type === 'player_start');
        if (existing) {
            // Move the existing one
            existing.x = x - 16;
            existing.y = y - 16;
            this.editorManager.ui.updateProperties();
        } else {
            const entity = {
                x: x - 16,
                y: y - 16,
                width: 32,
                height: 32,
                color: '#00ff00',
                type: 'player_start'
            };
            this.editorManager.addEntity(entity);
        }
    }
}