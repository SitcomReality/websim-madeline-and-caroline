import EditorUI from 'game/editor/ui/EditorUI';
import EditorState from 'game/editor/core/EditorState';
import PlatformTool from 'game/editor/tools/PlatformTool';
import SelectTool from 'game/editor/tools/SelectTool';
import DeleteTool from 'game/editor/tools/DeleteTool';
import InputManager from 'game/core/InputManager';

export default class EditorManager {
    constructor(game) {
        this.game = game;
        this.state = new EditorState();
        this.ui = new EditorUI(this);
        this.tools = {
            platform: new PlatformTool(this),
            select: new SelectTool(this),
            delete: new DeleteTool(this)
        };
        this.currentTool = this.tools.platform;
        this.canvas = game.canvas;
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

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.currentTool.onMouseDown(x, y);
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.currentTool.onMouseMove(x, y);
    }

    handleMouseUp(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.currentTool.onMouseUp(x, y);
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.currentTool.onClick(x, y);
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

        // Draw border
        ctx.strokeStyle = '#47ffff';
        ctx.lineWidth = 1;
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