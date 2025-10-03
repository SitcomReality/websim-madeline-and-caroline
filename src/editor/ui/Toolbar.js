export default class Toolbar {
    constructor(editorUI) {
        this.editorUI = editorUI;
        this.element = null;
        this.tools = [
            { name: 'platform', label: 'Platform', icon: '▭' },
            { name: 'select', label: 'Select', icon: '⌖' },
            { name: 'delete', label: 'Delete', icon: '✕' }
        ];
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'editor-toolbar';
        
        this.tools.forEach(tool => {
            const button = document.createElement('button');
            button.className = 'editor-tool-btn';
            button.dataset.tool = tool.name;
            button.textContent = `${tool.icon} ${tool.label}`;
            button.onclick = () => this.selectTool(tool.name);
            this.element.appendChild(button);
        });

        this.editorUI.container.appendChild(this.element);
        this.updateSelection('platform');
    }

    selectTool(toolName) {
        this.editorUI.editorManager.setTool(toolName);
    }

    updateSelection(toolName) {
        const buttons = this.element.querySelectorAll('.editor-tool-btn');
        buttons.forEach(btn => {
            if (btn.dataset.tool === toolName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

