import Toolbar from './Toolbar.js';
import PropertiesPanel from './PropertiesPanel.js';
import BottomBar from './BottomBar.js';
import SaveLoadPanel from './SaveLoadPanel.js';

export default class EditorUI {
    constructor(editorManager) {
        this.editorManager = editorManager;
        this.container = document.getElementById('editor-ui');
        this.toolbar = new Toolbar(this);
        this.propertiesPanel = new PropertiesPanel(this);
        this.bottomBar = new BottomBar(this);
        this.saveLoadPanel = new SaveLoadPanel(this);
    }

    init() {
        this.container.classList.remove('hidden');
        this.toolbar.init();
        this.propertiesPanel.init();
        this.bottomBar.init();
        this.saveLoadPanel.init();
    }

    updateToolSelection(toolName) {
        this.toolbar.updateSelection(toolName);
    }

    updateProperties() {
        this.propertiesPanel.update();
    }

    updateUndoRedoButtons() {
        this.bottomBar.updateUndoRedoButtons();
    }

    destroy() {
        this.container.classList.add('hidden');
        this.container.innerHTML = '';
    }
}