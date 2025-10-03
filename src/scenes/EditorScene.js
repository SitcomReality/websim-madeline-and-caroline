import Scene from 'game/scenes/Scene';
import EditorManager from 'game/editor/core/EditorManager';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'game/config/constants';

export default class EditorScene extends Scene {
    init() {
        this.editorManager = new EditorManager(this.game);
        this.editorManager.init();
    }

    update(deltaTime) {
        this.editorManager.update(deltaTime);
    }

    draw(ctx) {
        ctx.fillStyle = '#1e1e2e';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        
        // Draw grid
        this.drawGrid(ctx);
        
        this.editorManager.draw(ctx);
    }

    drawGrid(ctx) {
        const gridSize = 20;
        ctx.strokeStyle = 'rgba(71, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let x = 0; x < SCREEN_WIDTH; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, SCREEN_HEIGHT);
            ctx.stroke();
        }

        for (let y = 0; y < SCREEN_HEIGHT; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(SCREEN_WIDTH, y);
            ctx.stroke();
        }
    }

    destroy() {
        if (this.editorManager) {
            this.editorManager.destroy();
        }
    }
}

