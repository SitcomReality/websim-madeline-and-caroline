import Scene from 'game/scenes/Scene';
import LocalStorageManager from 'game/editor/serialization/LocalStorageManager';
import LevelSerializer from 'game/editor/serialization/LevelSerializer';

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
        const levels = this.storage.listLevels();
        if (levels.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No saved levels found.';
            modal.appendChild(p);
        } else {
            const list = document.createElement('ul');
            list.className = 'level-list';
            levels.forEach(name => {
                const item = document.createElement('li');
                item.className = 'level-list-item';
                const span = document.createElement('span');
                span.textContent = name;
                span.onclick = () => this.loadLevelAndStart(name);
                const del = document.createElement('button');
                del.textContent = '✕';
                del.onclick = (e) => { e.stopPropagation(); if (confirm(`Delete "${name}"?`)) { this.storage.deleteLevel(name); this.openLoadModal(); } };
                const edit = document.createElement('button');
                edit.textContent = 'Edit';
                edit.onclick = (e) => { e.stopPropagation(); this.loadLevelAndEdit(name); };
                item.appendChild(span);
                item.appendChild(edit);
                item.appendChild(del);
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