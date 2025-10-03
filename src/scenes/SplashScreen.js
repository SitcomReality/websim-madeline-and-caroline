import Scene from 'game/scenes/Scene';
import LocalStorageManager from 'game/editor/serialization/LocalStorageManager';
import LevelSerializer from 'game/editor/serialization/LevelSerializer';
import { BUNDLED_MAPS, fetchLevelData } from 'game/utils/levelLoader';

export default class SplashScreen extends Scene {
    constructor(game) {
        super(game);
        this.splashElement = document.getElementById('splash-screen');
        this.editorButton = document.getElementById('map-editor-btn');
        this.loadButton = document.getElementById('load-map-btn');
        this.storage = new LocalStorageManager();
        this.serializer = new LevelSerializer();
        this.modalEl = null;
    }

    init() {
        this.splashElement.classList.remove('hidden');
        document.getElementById('menu-button').classList.add('hidden');
        this.editorButton.onclick = () => this.openEditor();
        this.loadButton.onclick = () => this.openLoadModal();
    }

    startGame() {
        this.splashElement.classList.add('hidden');
        this.game.sceneManager.changeScene('game');
    }

    openEditor() {
        this.splashElement.classList.add('hidden');
        this.game.sceneManager.changeScene('editor');
    }

    destroy() {
        this.editorButton.onclick = null;
        this.loadButton.onclick = null;
        if (this.modalEl) this.modalEl.remove();
    }

    openLoadModal() {
        if (this.modalEl) this.modalEl.remove();
        const modal = document.createElement('div');
        modal.className = 'save-load-modal';
        const title = document.createElement('h2');
        title.textContent = 'Choose Map';
        modal.appendChild(title);

        const localStorageLevels = this.storage.listLevels().map(name => ({
            name, 
            type: 'local'
        }));
        
        const allLevels = [
            ...BUNDLED_MAPS.map(map => ({ ...map, type: 'bundled' })),
            ...localStorageLevels
        ];

        if (allLevels.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No saved levels found.';
            modal.appendChild(p);
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
                    // If click target is a button, let the button handler manage it.
                    if (e.target.tagName === 'BUTTON') {
                        return; 
                    }
                    
                    if (level.type === 'local') {
                        this.loadLevelAndStart(level.name);
                    } else if (level.type === 'bundled') {
                        this.loadBundledLevelAndStart(level.path);
                    }
                };

                const nameSpan = document.createElement('span');
                nameSpan.textContent = level.name;
                nameSpan.classList.add('level-name-span');
                item.appendChild(nameSpan);

                if (level.type === 'local') {
                    const edit = document.createElement('button');
                    edit.textContent = 'Edit';
                    edit.onclick = (e) => { e.stopPropagation(); this.loadLevelAndEdit(level.name); };
                    
                    const del = document.createElement('button');
                    del.textContent = '✕';
                    del.onclick = (e) => { e.stopPropagation(); if (confirm(`Delete "${level.name}"?`)) { this.storage.deleteLevel(level.name); this.openLoadModal(); } };
                    
                    item.appendChild(edit);
                    item.appendChild(del);
                    
                } else if (level.type === 'bundled') {
                    const indicator = document.createElement('span');
                    indicator.textContent = '[Built-in]';
                    indicator.style.fontSize = '0.75rem';
                    indicator.style.color = 'var(--color-secondary)';
                    indicator.style.paddingLeft = '10px';
                    indicator.style.flexShrink = 0;
                    item.appendChild(indicator);
                }

                list.appendChild(item);
            });
            modal.appendChild(list);
        }
        const actions = document.createElement('div');
        actions.className = 'modal-actions';
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = () => { modal.remove(); this.modalEl = null; };
        actions.appendChild(cancel);
        modal.appendChild(actions);
        document.getElementById('game-container').appendChild(modal);
        this.modalEl = modal;
    }

    async loadBundledLevelAndStart(path) {
        if (this.modalEl) { this.modalEl.remove(); this.modalEl = null; }
        
        const levelState = await fetchLevelData(path);
        if (levelState) {
            this.startGameWithLevel(levelState);
        } else {
            alert("Failed to load map.");
            this.openLoadModal(); 
        }
    }

    loadLevelAndStart(name) {
        const data = this.storage.loadLevel(name);
        if (!data) return;
        const state = this.serializer.deserialize(data);
        if (!state) return;
        if (this.modalEl) { this.modalEl.remove(); this.modalEl = null; }
        this.startGameWithLevel(state);
    }

    startGameWithLevel(levelState) {
        this.splashElement.classList.add('hidden');
        this.game.sceneManager.changeScene('game', { level: levelState });
    }

    loadLevelAndEdit(name) {
        const data = this.storage.loadLevel(name);
        if (!data) return;
        const state = this.serializer.deserialize(data);
        if (!state) return;
        if (this.modalEl) { this.modalEl.remove(); this.modalEl = null; }
        this.startEditorWithLevel(state);
    }

    startEditorWithLevel(levelState) {
        this.splashElement.classList.add('hidden');
        this.game.sceneManager.changeScene('editor', { level: levelState });
    }
}