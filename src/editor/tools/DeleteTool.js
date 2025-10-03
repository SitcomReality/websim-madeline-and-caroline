import Tool from 'game/editor/tools/Tool';

export default class DeleteTool extends Tool {
    onClick(x, y) {
        const state = this.editorManager.state;
        
        // Find entity at click position
        for (let i = state.entities.length - 1; i >= 0; i--) {
            const entity = state.entities[i];
            if (x >= entity.x && x <= entity.x + entity.width &&
                y >= entity.y && y <= entity.y + entity.height) {
                state.deleteEntity(entity);
                this.editorManager.ui.updateProperties();
                break;
            }
        }
    }

    draw(ctx) {
        // Draw a red X cursor effect when hovering over entities
        // This is optional visual feedback
    }
}