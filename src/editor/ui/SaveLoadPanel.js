import UIComponent from '../../ui/UIComponent.js';
import LevelSerializer from 'game/editor/serialization/LevelSerializer';
import LocalStorageManager from 'game/editor/serialization/LocalStorageManager';
import { BUNDLED_MAPS, fetchLevelData } from 'game/utils/levelLoader';

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
        const localStorageLevels = this.storage.listLevels().map(name => ({
            name, 
            type: 'local',
            id: name
        }));
        
        const allLevels = [
            ...BUNDLED_MAPS.map(map => ({ ...map, type: 'bundled', id: map.path, path: map.path })),
            ...localStorageLevels
        ];

        if (allLevels.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No saved levels found.';
            this.element.appendChild(message);
        } else {
            const list = document.createElement('ul');
            list.className = 'level-list';

            allLevels.forEach(level => {
                const item = document.createElement('li');
                item.className = 'level-list-item';
                
                if (level.type === 'bundled') {
                    item.classList.add('bundled-map');
                }
                
                item.onclick = (e) => {
                    // Prevent propagation if clicking action buttons (BUTTON)
                    if (e.target.tagName === 'BUTTON') {
                        return; 
                    }

                    if (level.type === 'local') {
                        this.loadLevel(level.name);
                    } else if (level.type === 'bundled') {
                        this.loadBundledLevel(level.path);
                    }
                };
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = level.name;
                nameSpan.classList.add('level-name-span');
                item.appendChild(nameSpan);


                if (level.type === 'local') {
                    // Action buttons only for local storage maps
                    const loadBtn = document.createElement('button');
                    loadBtn.textContent = 'Load';
                    loadBtn.onclick = (e) => { e.stopPropagation(); this.loadLevel(level.name); };
                    
                    const del = document.createElement('button');
                    del.textContent = '✕';
                    del.onclick = (e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${level.name}"?`)) {
                            this.storage.deleteLevel(level.name);
                            this.createModal('load');
                        }
                    };

                    item.appendChild(loadBtn);
                    item.appendChild(del);
                } else if (level.type === 'bundled') {
                    const indicator = document.createElement('span');
                    indicator.textContent = '[Built-in]';
                    indicator.style.fontSize = '0.75rem';
                    indicator.style.color = 'var(--color-secondary)';
                    indicator.style.paddingLeft = '10px';
                    indicator.style.flexShrink = 0;
                    item.appendChild(indicator);
                    
                    const loadBtn = document.createElement('button');
                    loadBtn.textContent = 'Load';
                    loadBtn.onclick = (e) => { e.stopPropagation(); this.loadBundledLevel(level.path); };
                    item.appendChild(loadBtn);
                }


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
            this.editorUI.editorManager.state.levelSettings.name = name; // Ensure name is preserved
            this.editorUI.updateProperties();
            this.closeModal();
        }
    }
    
    async loadBundledLevel(path) {
        const data = await fetchLevelData(path);
        if (data) {
            this.editorUI.editorManager.state.fromJSON(data);
            // Bundled levels are loaded into memory and can be saved with their name
            const mapInfo = BUNDLED_MAPS.find(m => m.path === path);
            if (mapInfo) {
                this.editorUI.editorManager.state.levelSettings.name = mapInfo.name;
            }
            this.editorUI.updateProperties();
            this.closeModal();
        } else {
            alert("Failed to load bundled map.");
        }
    }

    closeModal() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}