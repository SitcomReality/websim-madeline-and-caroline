import UIComponent from '../../ui/UIComponent.js';

export default class BottomBar extends UIComponent {
    constructor(editorUI) {
        super();
        this.editorUI = editorUI;
        this.undoBtn = null;
        this.redoBtn = null;
    }

    init() {
        this.createElement('div', 'editor-bottom-bar', this.editorUI.container);

        const actions = document.createElement('div');
        actions.className = 'editor-actions';

        this.undoBtn = this.createButton('↶ Undo', () => this.editorUI.editorManager.undo());
        this.redoBtn = this.createButton('↷ Redo', () => this.editorUI.editorManager.redo());
        const clearBtn = this.createButton('Clear All', () => this.clearLevel());
        const saveBtn = this.createButton('Save', () => this.editorUI.saveLoadPanel.showSave());
        const loadBtn = this.createButton('Load', () => this.editorUI.saveLoadPanel.showLoad());
        const exitBtn = this.createButton('Exit Editor', () => this.exitEditor());

        actions.appendChild(this.undoBtn);
        actions.appendChild(this.redoBtn);
        actions.appendChild(clearBtn);
        actions.appendChild(saveBtn);
        actions.appendChild(loadBtn);
        actions.appendChild(exitBtn);

        const info = document.createElement('div');
        info.className = 'editor-info';
        info.textContent = 'Map Editor | Controls: Click & drag to create platforms | Select tool to move objects';

        this.element.appendChild(actions);
        this.element.appendChild(info);
        this.editorUI.container.appendChild(this.element);

        this.updateUndoRedoButtons();
    }

    createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'editor-action-btn';
        btn.textContent = text;
        btn.onclick = onClick;
        return btn;
    }

    updateUndoRedoButtons() {
        const history = this.editorUI.editorManager.state.history;
        this.undoBtn.disabled = !history.canUndo();
        this.redoBtn.disabled = !history.canRedo();
    }

    clearLevel() {
        if (confirm('Clear all entities? This cannot be undone.')) {
            this.editorUI.editorManager.state.clear();
            this.editorUI.updateProperties();
        }
    }

    exitEditor() {
        this.editorUI.editorManager.game.sceneManager.changeScene('splash');
    }
}