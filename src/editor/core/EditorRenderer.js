export default class EditorRenderer {
    constructor(editorManager) {
        this.editorManager = editorManager;
    }

    draw(ctx) {
        // Draw all entities
        for (const entity of this.editorManager.state.entities) {
            this.drawEntity(ctx, entity);
        }

        // Draw selected entity highlight
        if (this.editorManager.state.selectedEntity) {
            this.drawSelectionHighlight(ctx, this.editorManager.state.selectedEntity);
        }

        // Draw current tool preview
        this.editorManager.currentTool.draw(ctx);
    }

    drawEntity(ctx, entity) {
        ctx.fillStyle = entity.color;
        ctx.fillRect(entity.x, entity.y, entity.width, entity.height);

        // Draw icon/label for special entity types
        ctx.save();
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = entity.x + entity.width / 2;
        const centerY = entity.y + entity.height / 2;

        if (entity.type === 'fuel') {
            ctx.fillStyle = '#000';
            ctx.fillText('⛽', centerX, centerY);
        } else if (entity.type === 'ramp') {
            // Draw triangle
            ctx.fillStyle = entity.color;
            ctx.beginPath();
            const angle = (entity.angle || 45) * Math.PI / 180;
            ctx.moveTo(entity.x, entity.y + entity.height);
            ctx.lineTo(entity.x + entity.width, entity.y + entity.height);
            ctx.lineTo(entity.x + entity.width, entity.y);
            ctx.closePath();
            ctx.fill();
        } else if (entity.type === 'enemy_spawner') {
            ctx.fillStyle = '#000';
            ctx.fillText('👾', centerX, centerY);
        } else if (entity.type === 'particle_emitter') {
            ctx.fillStyle = '#000';
            ctx.fillText('✨', centerX, centerY);
        } else if (entity.type === 'player_start') {
            ctx.fillStyle = '#000';
            ctx.fillText('🎮', centerX, centerY);
        } else if (entity.type === 'exit_door') {
            ctx.fillStyle = '#000';
            ctx.fillText('🚪', centerX, centerY);
        }
        ctx.restore();

        // Draw border
        ctx.strokeStyle = entity.killsPlayer ? '#ff0000' : '#47ffff';
        ctx.lineWidth = entity.killsPlayer ? 2 : 1;
        ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);
    }

    drawSelectionHighlight(ctx, entity) {
        ctx.strokeStyle = '#ff47ab';
        ctx.lineWidth = 3;
        ctx.strokeRect(entity.x - 2, entity.y - 2, entity.width + 4, entity.height + 4);

        // Draw emission direction for particle emitters
        if (entity.type === 'particle_emitter') {
            const centerX = entity.x + entity.width / 2;
            const centerY = entity.y + entity.height / 2;
            const angle = (entity.angle || -90) * Math.PI / 180;
            const length = 40;
            const endX = centerX + length * Math.cos(angle);
            const endY = centerY + length * Math.sin(angle);

            ctx.save();
            ctx.strokeStyle = '#ff47ab';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            // Arrowhead
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 8 * Math.cos(angle - Math.PI / 6), endY - 8 * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 8 * Math.cos(angle + Math.PI / 6), endY - 8 * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
            ctx.restore();
        }

        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = '#ff47ab';
        ctx.fillRect(entity.x - handleSize/2, entity.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(entity.x + entity.width - handleSize/2, entity.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(entity.x - handleSize/2, entity.y + entity.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(entity.x + entity.width - handleSize/2, entity.y + entity.height - handleSize/2, handleSize, handleSize);
    }
}