import Tool from 'game/editor/tools/Tool';

export default class SelectTool extends Tool {
    constructor(editorManager) {
        super(editorManager);
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.entityStartX = 0;
        this.entityStartY = 0;
    }

    onClick(x, y) {
        if (this.isDragging) return;

        const state = this.editorManager.state;
        let found = null;

        // Check in reverse order to select topmost entity
        for (let i = state.entities.length - 1; i >= 0; i--) {
            const entity = state.entities[i];
            if (x >= entity.x && x <= entity.x + entity.width &&
                y >= entity.y && y <= entity.y + entity.height) {
                found = entity;
                break;
            }
        }

        if (found) {
            state.selectEntity(found);
        } else {
            state.deselectEntity();
        }

        this.editorManager.ui.updateProperties();
    }

    onMouseDown(x, y) {
        const selected = this.editorManager.state.selectedEntity;
        if (selected) {
            if (x >= selected.x && x <= selected.x + selected.width &&
                y >= selected.y && y <= selected.y + selected.height) {
                this.isDragging = true;
                this.dragStartX = x;
                this.dragStartY = y;
                this.entityStartX = selected.x;
                this.entityStartY = selected.y;
            }
        }
    }

    onMouseMove(x, y) {
        if (this.isDragging) {
            const selected = this.editorManager.state.selectedEntity;
            if (selected) {
                const dx = x - this.dragStartX;
                const dy = y - this.dragStartY;
                selected.x = this.entityStartX + dx;
                selected.y = this.entityStartY + dy;
            }
        }
    }

    onMouseUp(x, y) {
        if (this.isDragging) {
            const selected = this.editorManager.state.selectedEntity;
            if (selected) {
                const changes = {
                    x: selected.x,
                    y: selected.y
                };
                this.editorManager.state.updateEntity(selected, changes);
                this.editorManager.ui.updateProperties();
            }
            this.isDragging = false;
        }
    }
}