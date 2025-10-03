import InputManager from '../../core/InputManager.js';
import Vector2 from '../../utils/Vector2.js';

export default class EditorInput {
    constructor(editorManager) {
        this.editorManager = editorManager;
        this.canvas = editorManager.canvas;
    }

    init() {
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
            this.editorManager.camera.isPanning = true;
            this.editorManager.camera.panStart.set(e.clientX, e.clientY);
            this.editorManager.camera.panPositionStart.set(this.editorManager.camera.position.x, this.editorManager.camera.position.y);
            this.canvas.style.cursor = 'grabbing';
            e.preventDefault();
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.editorManager.camera.screenToWorld(screenPos);
        this.editorManager.currentTool.onMouseDown(worldPos.x, worldPos.y);
    }

    handleMouseMove(e) {
        if (this.editorManager.camera.isPanning) {
            const dx = e.clientX - this.editorManager.camera.panStart.x;
            const dy = e.clientY - this.editorManager.camera.panStart.y;
            this.editorManager.camera.position.set(this.editorManager.camera.panPositionStart.x - dx, this.editorManager.camera.panPositionStart.y - dy);
            this.editorManager.camera.clampToBounds();
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.editorManager.camera.screenToWorld(screenPos);
        this.editorManager.currentTool.onMouseMove(worldPos.x, worldPos.y);
    }

    handleMouseUp(e) {
        if (e.button === 1) {
            this.editorManager.camera.isPanning = false;
            this.canvas.style.cursor = 'default';
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.editorManager.camera.screenToWorld(screenPos);
        this.editorManager.currentTool.onMouseUp(worldPos.x, worldPos.y);
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const screenPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
        const worldPos = this.editorManager.camera.screenToWorld(screenPos);
        this.editorManager.currentTool.onClick(worldPos.x, worldPos.y);
    }

    handleKeyDown(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.editorManager.redo();
                } else {
                    this.editorManager.undo();
                }
            } else if (e.key === 'y') {
                e.preventDefault();
                this.editorManager.redo();
            }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            if (this.editorManager.state.selectedEntity) {
                e.preventDefault();
                this.editorManager.deleteSelected();
            }
        }
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.removeEventListener('click', this.handleClick.bind(this));
        this.canvas.removeEventListener('contextmenu', e => e.preventDefault());
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
}