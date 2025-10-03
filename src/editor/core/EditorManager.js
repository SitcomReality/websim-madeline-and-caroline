import EditorUI from 'game/editor/ui/EditorUI';
import EditorState from 'game/editor/core/EditorState';
import PlatformTool from '../tools/PlatformTool.js';
import SelectTool from '../tools/SelectTool.js';
import DeleteTool from '../tools/DeleteTool.js';
import FuelTool from '../tools/FuelTool.js';
import RampTool from '../tools/RampTool.js';
import EnemySpawnerTool from '../tools/EnemySpawnerTool.js';
import ParticleEmitterTool from '../tools/ParticleEmitterTool.js';
import PlayerStartTool from '../tools/PlayerStartTool.js';
import ExitDoorTool from '../tools/ExitDoorTool.js';
import InputManager from '../../core/InputManager.js';
import Vector2 from '../../utils/Vector2.js';

export default class EditorManager {
    constructor(game, scene) {
        this.game = game;
        this.scene = scene;
        this.camera = scene.camera;
        this.state = new EditorState();
        this.ui = new EditorUI(this);
        this.tools = {
            platform: new PlatformTool(this),
            select: new SelectTool(this),
            delete: new DeleteTool(this),
            fuel: new FuelTool(this),
            ramp: new RampTool(this),
            enemy_spawner: new EnemySpawnerTool(this),
            particle_emitter: new ParticleEmitterTool(this),
            player_start: new PlayerStartTool(this),
            exit_door: new ExitDoorTool(this)
        };
        this.currentTool = this.tools.platform;
        this.canvas = game.canvas;
        this.snapToGrid = true; // default snap enabled
        this.gridSize = 20;
    }

    init() {
        this.ui.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));

        // Prevent context menu on right click for panning
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleMouseDown(e) {
        if (e.button === 1) { // Middle mouse button
            this.camera.isPanning = true;
            this.camera.panStart.set(e.clientX, e.clientY);
            this.camera.panPositionStart.set(this.camera.position.x, this.camera.position.y);
            this.canvas.style.cursor = 'grabbing';
            e.preventDefault();
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.camera.screenToWorld(screenPos);
        this.currentTool.onMouseDown(worldPos.x, worldPos.y);
    }

    handleMouseMove(e) {
        if (this.camera.isPanning) {
            const dx = e.clientX - this.camera.panStart.x;
            const dy = e.clientY - this.camera.panStart.y;
            this.camera.position.set(this.camera.panPositionStart.x - dx, this.camera.panPositionStart.y - dy);
            this.camera.clampToBounds();
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.camera.screenToWorld(screenPos);
        this.currentTool.onMouseMove(worldPos.x, worldPos.y);
    }

    handleMouseUp(e) {
        if (e.button === 1) {
            this.camera.isPanning = false;
            this.canvas.style.cursor = 'default';
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.camera.screenToWorld(screenPos);
        this.currentTool.onMouseUp(worldPos.x, worldPos.y);
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.camera.screenToWorld(screenPos);
        this.currentTool.onClick(worldPos.x, worldPos.y);
    }

    handleKeyDown(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.redo();
                } else {
                    this.undo();
                }
            } else if (e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            if (this.state.selectedEntity) {
                e.preventDefault();
                this.deleteSelected();
            }
        }
    }

    setTool(toolName) {
        if (this.tools[toolName]) {
            this.currentTool = this.tools[toolName];
            this.ui.updateToolSelection(toolName);
        }
    }

    addEntity(entity) {
        this.state.addEntity(entity);
    }

    deleteSelected() {
        if (this.state.selectedEntity) {
            this.state.deleteEntity(this.state.selectedEntity);
            this.ui.updateProperties();
        }
    }

    undo() {
        this.state.undo();
        this.ui.updateUndoRedoButtons();
        this.ui.updateProperties();
    }

    redo() {
        this.state.redo();
        this.ui.updateUndoRedoButtons();
        this.ui.updateProperties();
    }

    update(deltaTime) {
        this.currentTool.update(deltaTime);
    }

    draw(ctx) {
        // Draw all entities
        for (const entity of this.state.entities) {
            this.drawEntity(ctx, entity);
        }

        // Draw selected entity highlight
        if (this.state.selectedEntity) {
            this.drawSelectionHighlight(ctx, this.state.selectedEntity);
        }

        // Draw current tool preview
        this.currentTool.draw(ctx);
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

        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = '#ff47ab';
        ctx.fillRect(entity.x - handleSize/2, entity.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(entity.x + entity.width - handleSize/2, entity.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(entity.x - handleSize/2, entity.y + entity.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(entity.x + entity.width - handleSize/2, entity.y + entity.height - handleSize/2, handleSize, handleSize);
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.removeEventListener('click', this.handleClick.bind(this));
        this.ui.destroy();
    }
}