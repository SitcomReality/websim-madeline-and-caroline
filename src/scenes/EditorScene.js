import Scene from 'game/scenes/Scene';
import EditorManager from 'game/editor/core/EditorManager';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'game/config/constants';
import Camera from '../core/Camera.js';
import EditorMinimap from 'game/editor/ui/EditorMinimap';
import ParticleSystem from '../systems/ParticleSystem.js';

export default class EditorScene extends Scene {
    init(params = {}) {
        // Editor levels are larger by default for design space
        const worldWidth = SCREEN_WIDTH * 3;
        const worldHeight = SCREEN_HEIGHT * 3;
        this.camera = new Camera(worldWidth, worldHeight);

        this.editorManager = new EditorManager(this.game, this);
        this.editorManager.init();
        if (params.level) {
            this.editorManager.state.fromJSON(params.level);
            this.editorManager.ui.updateProperties();
        }
        this.editorMinimap = new EditorMinimap(this);
        this.editorMinimap.init();
        // Particle preview in editor
        this.particleSystem = new ParticleSystem();
        this._emitterTimers = new Map();
    }

    update(deltaTime) {
        this.editorManager.update(deltaTime);
        this.editorMinimap?.render();
        // Drive editor particle emitters
        for (const e of this.editorManager.state.entities) {
            if (e.type !== 'particle_emitter') continue;
            const t = this._emitterTimers.get(e) || 0;
            const burst = e.burstMode;
            const interval = burst ? (e.burstInterval || 2) : (1 / (e.emitRate || 10));
            const nt = t + deltaTime;
            if (nt >= interval) {
                const angle = e.angle ?? -90, cone = e.cone ?? 20;
                this.particleSystem.emit(e.emitterType || 'magic_sparkle', {
                    x: e.x + e.width / 2,
                    y: e.y + e.height / 2,
                    color: e.particleColor || '#ffffff',
                    angle: { min: angle - cone / 2, max: angle + cone / 2 }
                });
                this._emitterTimers.set(e, 0);
            } else {
                this._emitterTimers.set(e, nt);
            }
        }
        this.particleSystem.update(deltaTime, []);
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
        this.particleSystem.draw(ctx);

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