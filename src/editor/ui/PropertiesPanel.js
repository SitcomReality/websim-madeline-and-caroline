export default class PropertiesPanel {
    constructor(editorUI) {
        this.editorUI = editorUI;
        this.element = null;
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'editor-properties';
        this.editorUI.container.appendChild(this.element);
        this.update();
    }

    update() {
        const state = this.editorUI.editorManager.state;
        const selected = state.selectedEntity;

        this.element.innerHTML = '<h3>Properties</h3>';

        if (selected) {
            this.renderEntityProperties(selected);
        } else {
            this.renderLevelSettings(state.levelSettings);
        }
    }

    renderEntityProperties(entity) {
        const properties = [
            { label: 'X Position', key: 'x', type: 'number' },
            { label: 'Y Position', key: 'y', type: 'number' },
            { label: 'Width', key: 'width', type: 'number' },
            { label: 'Height', key: 'height', type: 'number' },
            { label: 'Color', key: 'color', type: 'color' },
            { label: 'Type', key: 'type', type: 'select', options: ['platform', 'obstacle', 'hazard', 'collectible'] }
        ];

        properties.forEach(prop => {
            const div = document.createElement('div');
            div.className = 'editor-property';

            const label = document.createElement('label');
            label.textContent = prop.label;
            div.appendChild(label);

            if (prop.type === 'select') {
                const select = document.createElement('select');
                select.value = entity[prop.key] || 'platform';
                prop.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                select.onchange = (e) => this.updateEntityProperty(entity, prop.key, e.target.value);
                div.appendChild(select);
            } else {
                const input = document.createElement('input');
                input.type = prop.type;
                input.value = entity[prop.key];
                input.onchange = (e) => {
                    const value = prop.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                    this.updateEntityProperty(entity, prop.key, value);
                };
                div.appendChild(input);
            }

            this.element.appendChild(div);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Entity';
        deleteBtn.onclick = () => this.editorUI.editorManager.deleteSelected();

        const btnDiv = document.createElement('div');
        btnDiv.className = 'editor-property';
        btnDiv.appendChild(deleteBtn);
        this.element.appendChild(btnDiv);
    }

    renderLevelSettings(settings) {
        const properties = [
            { label: 'Level Name', key: 'name', type: 'text' },
            { label: 'Width', key: 'width', type: 'number' },
            { label: 'Height', key: 'height', type: 'number' },
            { label: 'Background', key: 'backgroundColor', type: 'color' },
            { label: 'Gravity', key: 'gravity', type: 'number' }
        ];

        properties.forEach(prop => {
            const div = document.createElement('div');
            div.className = 'editor-property';

            const label = document.createElement('label');
            label.textContent = prop.label;
            div.appendChild(label);

            const input = document.createElement('input');
            input.type = prop.type;
            input.value = settings[prop.key];
            input.onchange = (e) => {
                const value = prop.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                settings[prop.key] = value;
            };
            div.appendChild(input);

            this.element.appendChild(div);
        });
    }

    updateEntityProperty(entity, key, value) {
        const changes = { [key]: value };
        this.editorUI.editorManager.state.updateEntity(entity, changes);
        this.update();
    }
}