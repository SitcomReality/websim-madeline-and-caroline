import EditorUI from '../ui/EditorUI.js';
import EditorState from './EditorState.js';
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
import EditorInput from './EditorInput.js';
import EditorRenderer from './EditorRenderer.js';

export default class EditorManager {
    constructor(game, scene) {
        this.game = game;
        this.scene = scene;
        this.camera = scene.camera;
        this.state = new EditorState();
        this.ui = new EditorUI(this);
        this.input = new EditorInput(this);
        this.renderer = new EditorRenderer(this);
        
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
        this.snapToGrid = true;
        this.gridSize = 20;
    }

    init() {
        this.ui.init();
        this.input.init();
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
        this.renderer.draw(ctx);
    }

    destroy() {
        this.input.destroy();
        this.ui.destroy();
    }
}