import Scene from 'game/scenes/Scene';
import EditorManager from 'game/editor/core/EditorManager';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'game/config/constants';
import Camera from '../core/Camera.js';
import EditorMinimap from 'game/editor/ui/EditorMinimap';

export default class EditorScene extends Scene {
    init() {
        // Editor levels are larger by default for design space
        const worldWidth = SCREEN_WIDTH * 3;
        const worldHeight = SCREEN_HEIGHT * 3;
        this.camera = new Camera(worldWidth, worldHeight);

        this.editorManager = new EditorManager(this.game, this);
        this.editorManager.init();
        this.editorMinimap = new EditorMinimap(this);
        this.editorMinimap.init();
    }

    update(deltaTime) {
        this.editorManager.update(deltaTime);
        this.editorMinimap?.render();
    }

    draw(ctx) {
        ctx.save();

        const { backgroundColor, width, height } = this.editorManager.state.levelSettings;
        ctx.fillStyle = backgroundColor || '#1e1e2e';
        ctx.fillRect(0, 0, width || SCREEN_WIDTH, height || SCREEN_HEIGHT);
        
        this.camera.applyTransform(ctx);

        // Draw grid
        this.drawGrid(ctx);
        
        this.editorManager.draw(ctx);

        ctx.restore();
    }

    drawGrid(ctx) {
        const gridSize = 20;
        const levelSettings = this.editorManager.state.levelSettings;
        const worldWidth = levelSettings.width || SCREEN_WIDTH;
        const worldHeight = levelSettings.height || SCREEN_HEIGHT;

        ctx.strokeStyle = 'rgba(71, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let x = 0; x <= worldWidth; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, worldHeight);
            ctx.stroke();
        }

        for (let y = 0; y <= worldHeight; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(worldWidth, y);
            ctx.stroke();
        }
    }

    destroy() {
        if (this.editorManager) {
            this.editorManager.destroy();
        }
        if (this.editorMinimap) this.editorMinimap.destroy();
    }
}