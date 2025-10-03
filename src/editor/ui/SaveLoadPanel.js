import UIComponent from '../../ui/UIComponent.js';
import LevelSerializer from 'game/editor/serialization/LevelSerializer';
import LocalStorageManager from 'game/editor/serialization/LocalStorageManager';

export default class SaveLoadPanel extends UIComponent {
    constructor(editorUI) {
        super();
        this.editorUI = editorUI;
        this.serializer = new LevelSerializer();
        this.storage = new LocalStorageManager();
    }

    init() {
        // Panel will be created on demand
    }

    showSave() {
        this.createModal('save');
    }

    showLoad() {
        this.createModal('load');
    }

    showExport() {
        const state = this.editorUI.editorManager.state;
        const levelName = state.levelSettings.name || 'untitled';
        this.exportLevel(levelName);
    }

    exportLevel(name) {
        const state = this.editorUI.editorManager.state;
        const data = this.serializer.serialize(state);
        
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        // Use a safe filename, replacing spaces with underscores
        a.download = `${name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    createModal(mode) {
        if (this.element) {
            this.element.remove();
        }

        this.element = document.createElement('div');
        this.element.className = 'save-load-modal';

        const title = document.createElement('h2');
        title.textContent = mode === 'save' ? 'Save Level' : 'Choose Map';
        this.element.appendChild(title);

        if (mode === 'save') {
            this.createSaveUI();
        } else {
            this.createLoadUI();
        }

        this.editorUI.container.appendChild(this.element);
    }

    createSaveUI() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter level name...';
        input.value = this.editorUI.editorManager.state.levelSettings.name;
        this.element.appendChild(input);

        const actions = document.createElement('div');
        actions.className = 'modal-actions';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.onclick = () => {
            const name = input.value.trim() || 'Untitled Level';
            this.saveLevel(name);
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => this.closeModal();

        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        this.element.appendChild(actions);
    }

    createLoadUI() {
        const levels = this.storage.listLevels();

        if (levels.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No saved levels found.';
            this.element.appendChild(message);
        } else {
            const list = document.createElement('ul');
            list.className = 'level-list';

            levels.forEach(levelName => {
                const item = document.createElement('li');
                item.className = 'level-list-item';
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = levelName;
                nameSpan.onclick = () => this.loadLevel(levelName);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✕';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${levelName}"?`)) {
                        this.storage.deleteLevel(levelName);
                        this.createModal('load');
                    }
                };

                item.appendChild(nameSpan);
                item.appendChild(deleteBtn);
                list.appendChild(item);
            });

            this.element.appendChild(list);
        }

        const actions = document.createElement('div');
        actions.className = 'modal-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => this.closeModal();

        actions.appendChild(cancelBtn);
        this.element.appendChild(actions);
    }

    saveLevel(name) {
        const state = this.editorUI.editorManager.state;
        state.levelSettings.name = name;
        const data = this.serializer.serialize(state);
        this.storage.saveLevel(name, data);
        alert(`Level "${name}" saved successfully!`);
        this.closeModal();
    }

    loadLevel(name) {
        const data = this.storage.loadLevel(name);
        if (data) {
            const state = this.serializer.deserialize(data);
            this.editorUI.editorManager.state.fromJSON(state);
            this.editorUI.updateProperties();
            this.closeModal();
        }
    }

    closeModal() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}